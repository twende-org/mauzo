import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../store";

import { fetchSellers } from "../../store/features/sellers/sellersSlice";
import { fetchProducts } from "../../store/features/products/productsSlice";
import {
  fetchDispatches,
  createDispatch,
  closeDispatchRecord,
} from "../../store/features/sales/dispatchSlice";

import Button from "../../components/ui/Button";
import InputField from "../../components/ui/InputField";
import { FaCashRegister } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ITEMS_PER_PAGE = 5;

export default function Sales() {
  const dispatch = useDispatch<AppDispatch>();

  const { sellers } = useSelector((s: RootState) => s.sellers);
  const { products } = useSelector((s: RootState) => s.products);
  const { records, loading } = useSelector((s: RootState) => s.dispatch);

  const [form, setForm] = useState({ sellerId: "", productId: "", qty: "" });
  const [brokenQty, setBrokenQty] = useState("");
  const [filterDate, setFilterDate] = useState<Date | null>(new Date());
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // ---------------- PAKUA TAARIFA ----------------
  useEffect(() => {
    dispatch(fetchSellers());
    dispatch(fetchProducts());
    dispatch(fetchDispatches());
  }, [dispatch]);

  // ---------------- BIDHAA ZILIZO ACTIVE ----------------
  const activeProducts = useMemo(
    () => products.filter((p) => p.active),
    [products]
  );

  const selectedProduct = useMemo(
    () => products.find((p) => p.id === form.productId),
    [form.productId, products]
  );

  // ---------------- HESABU JUMLA ----------------
  const total = useMemo(() => {
    if (!selectedProduct || !form.qty) return 0;

    const givenQty = Number(form.qty);
    const broken = Number(brokenQty || 0);
    const soldQty = Math.max(0, givenQty - broken);

    return soldQty * selectedProduct.price;
  }, [selectedProduct, form.qty, brokenQty]);

  // ---------------- HIFADHI MAUZO ----------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.sellerId || !form.productId || !form.qty) {
      setError("Tafadhali jaza taarifa zote");
      return;
    }

    const givenQty = Number(form.qty);
    const meltedQty = Number(brokenQty || 0);

    if (meltedQty > givenQty) {
      setError("Idadi iliyoharibika haiwezi kuzidi idadi iliyotolewa");
      return;
    }

    const returnedQty = givenQty - meltedQty;

    try {
      const dispatchRec = await dispatch(
        createDispatch({
          sellerId: form.sellerId,
          productId: form.productId,
          productName: selectedProduct!.name,
          unit: selectedProduct!.unit,
          givenQty,
          pricePerUnit: selectedProduct!.price,
        })
      ).unwrap();

      await dispatch(
        closeDispatchRecord({
          id: dispatchRec.id,
          meltedQty,
          returnedQty,
          productId: dispatchRec.productId,
        })
      ).unwrap();

      await dispatch(fetchDispatches());

      setForm({ sellerId: "", productId: "", qty: "" });
      setBrokenQty("");
      setError("");
    } catch {
      setError("Imeshindikana kurekodi mauzo");
    }
  };

  // ---------------- CHUJA MAUZO KWA TAREHE ----------------
  const filteredSales = useMemo(() => {
    return records.filter((r) => {
      if (!filterDate) return true;

      const d = new Date(r.date);
      return (
        d.getFullYear() === filterDate.getFullYear() &&
        d.getMonth() === filterDate.getMonth() &&
        d.getDate() === filterDate.getDate() &&
        r.status === "closed"
      );
    });
  }, [records, filterDate]);

  // ---------------- PAGINATION ----------------
  const totalPages = Math.ceil(filteredSales.length / ITEMS_PER_PAGE);

  const paginatedSales = filteredSales.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen space-y-6 container mx-auto">
      {/* KICHWA */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#20B2AA] flex items-center gap-2">
            <FaCashRegister /> Mauzo ya POS
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Rekodi za mauzo ya bidhaa
          </p>
        </div>

        {/* CHAGUA TAREHE */}
        <DatePicker
          selected={filterDate}
          onChange={setFilterDate}
          dateFormat="dd/MM/yyyy"
          placeholderText="Chagua tarehe"
          className="border rounded px-3 py-2 shadow-sm w-full sm:w-auto"
        />
      </div>

      {/* FOMU YA MAUZO */}
      <div className="bg-white shadow rounded-xl border border-gray-200 p-4 md:p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Rekodi Mauzo
        </h2>

        <form
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 items-end"
          onSubmit={handleSubmit}
        >
          <select
            value={form.sellerId}
            onChange={(e) => setForm({ ...form, sellerId: e.target.value })}
            className="border rounded px-3 py-2 w-full"
          >
            <option value="">Chagua Muuzaji</option>
            {sellers.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          <select
            value={form.productId}
            onChange={(e) => setForm({ ...form, productId: e.target.value })}
            className="border rounded px-3 py-2 w-full"
          >
            <option value="">Chagua Bidhaa</option>
            {activeProducts.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} – TSh {p.price.toLocaleString()}
              </option>
            ))}
          </select>

          <InputField
            label="Idadi Uliyotoa"
            type="number"
            value={form.qty}
            onChange={(e) => setForm({ ...form, qty: e.target.value })}
            name="qty"
          />

          <InputField
            label="Idadi Iliyoharibika"
            type="number"
            value={brokenQty}
            onChange={(e) => setBrokenQty(e.target.value)}
            name="brokenQty"
          />

          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Jumla ya Mauzo</span>
            <span className="font-bold text-lg">
              TSh {total.toLocaleString()}
            </span>
          </div>

          <Button type="submit">
            {loading ? "Inahifadhi..." : "Hifadhi Mauzo"}
          </Button>
        </form>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>

      {/* ORODHA YA MAUZO */}
      <div className="hidden md:block bg-white shadow rounded-xl border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Bidhaa</th>
              <th className="p-3 text-center">Iliyotolewa</th>
              <th className="p-3 text-center">Iliyouzwa</th>
              <th className="p-3 text-center">Iliyorejeshwa</th>
              <th className="p-3 text-center">Iliyoharibika</th>
              <th className="p-3 text-center">Bei</th>
              <th className="p-3 text-center">Fedha</th>
              <th className="p-3 text-center">Tarehe</th>
            </tr>
          </thead>
          <tbody>
            {paginatedSales.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-8 text-gray-400">
                  {loading ? "Inapakia..." : "Hakuna mauzo kwa tarehe hii"}
                </td>
              </tr>
            ) : (
              paginatedSales.map((s) => (
                <tr key={s.id} className="border-t">
                  <td className="p-3 font-medium">{s.productName}</td>
                  <td className="p-3 text-center">{s.givenQty}</td>
                  <td className="p-3 text-center">{s.soldQty}</td>
                  <td className="p-3 text-center">{s.returnedQty}</td>
                  <td className="p-3 text-center">{s.meltedQty}</td>
                  <td className="p-3 text-center">
                    TSh {Number(s.pricePerUnit).toLocaleString()}
                  </td>
                  <td className="p-3 text-center font-semibold">
                    TSh {Number(s.cashCollected).toLocaleString()}
                  </td>
                  <td className="p-3 text-center">
                    {new Date(s.date).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>
            Nyuma
          </Button>

          <Button disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)}>
            Mbele
          </Button>
        </div>
      )}
    </div>
  );
}
