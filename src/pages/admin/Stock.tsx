import { useEffect, useState, useMemo, type SetStateAction } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../store";

import {
  fetchInventory,
  adjustInventoryAction,
} from "../../store/features/inventory/inventorySlice";
import { fetchProducts } from "../../store/features/products/productsSlice";

import Button from "../../components/ui/Button";
import InputField from "../../components/ui/InputField";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import type { Timestamp } from "firebase/firestore";

interface InventoryItem {
  availableQty: number;
  lastUpdated: Timestamp | null;
}

export default function Stock() {
  const dispatch = useDispatch<AppDispatch>();

  const { items: inventoryItems, loading, error } = useSelector(
    (state: RootState) => state.inventory
  );

  const { products } = useSelector((state: RootState) => state.products);

  const [form, setForm] = useState({
    productId: "",
    type: "PRODUCTION",
    quantity: "",
  });

  const [formError, setFormError] = useState("");
  const [filterDate, setFilterDate] = useState<Date | null>(new Date());

  // ---------------- FETCH DATA ----------------
  useEffect(() => {
    dispatch(fetchInventory());
    dispatch(fetchProducts());
  }, [dispatch]);

  // ---------------- HANDLE FORM CHANGE ----------------
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ---------------- HANDLE FORM SUBMIT ----------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.productId) {
      setFormError("Tafadhali chagua bidhaa");
      return;
    }

    if (!form.quantity || isNaN(Number(form.quantity))) {
      setFormError("Tafadhali weka idadi sahihi");
      return;
    }

    setFormError("");

    try {
      await dispatch(
        adjustInventoryAction({
          productId: form.productId,
          type: form.type as "PRODUCTION" | "DISPATCH" | "RETURN" | "MELT",
          quantity: Number(form.quantity),
        })
      ).unwrap();

      setForm({ ...form, quantity: "" });
      dispatch(fetchInventory());
    } catch {
      setFormError("Imeshindikana kurekebisha stock");
    }
  };

  // ---------------- FILTER STOCK BY DATE ----------------
  const filteredProducts = useMemo(() => {
    if (!filterDate) return products;

    return products.filter((p) => {
      const inv: InventoryItem | undefined = inventoryItems?.[p.id];
      if (!inv?.lastUpdated) return false;

      const updatedDate: Date = inv.lastUpdated.toDate
        ? inv.lastUpdated.toDate()
        : new Date(inv.lastUpdated as unknown as string); // fallback

      return (
        updatedDate.getFullYear() === filterDate.getFullYear() &&
        updatedDate.getMonth() === filterDate.getMonth() &&
        updatedDate.getDate() === filterDate.getDate()
      );
    });
  }, [products, inventoryItems, filterDate]);

  return (
    <div className="p-4 md:p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <h1 className="text-2xl font-bold text-primary">
        Usimamizi wa Stock
      </h1>

      {/* FORM */}
      <div className="bg-white rounded-xl shadow-sm border p-4 md:p-6">
        <h2 className="font-semibold text-gray-700 mb-4">Ongeza bidhaa kwenye Stock</h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end"
        >
          <select
            name="productId"
            value={form.productId}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full"
            disabled={loading || products.length === 0}
          >
            <option value="">Chagua Bidhaa</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} – {p.unit}
              </option>
            ))}
          </select>

          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full"
            disabled={loading}
          >
            <option value="PRODUCTION">Uzalishaji</option>
            <option value="DISPATCH">Kutolewa</option>
            <option value="RETURN">Kurudishwa</option>
            <option value="MELT">Iliyoharibika</option>
          </select>

          <InputField
            label="Idadi"
            name="quantity"
            type="number"
            placeholder="Weka idadi"
            value={form.quantity}
            onChange={handleChange}
            disabled={loading}
          />

          <Button type="submit" disabled={loading}>
            {loading ? "Inachakata..." : "Hifadhi"}
          </Button>
        </form>

        {formError && (
          <p className="text-red-500 mt-3 text-sm bg-red-50 p-2 rounded">
            {formError}
          </p>
        )}
        {error && (
          <p className="text-red-500 mt-3 text-sm">{error}</p>
        )}
      </div>

      {/* DATE PICKER */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <label className="font-medium text-gray-700">
          Chagua Tarehe ya Kuangalia Stock:
        </label>
        <DatePicker
          selected={filterDate}
          onChange={(date: SetStateAction<Date | null>) => setFilterDate(date)}
          dateFormat="dd/MM/yyyy"
          isClearable
          placeholderText="Chagua tarehe"
          className="border p-2 rounded w-full sm:w-auto"
        />
      </div>

      {/* STOCK LIST */}
      <div className="space-y-4">
        {/* DESKTOP */}
        <div className="hidden md:block bg-white rounded-xl shadow border p-4 md:p-6 overflow-x-auto">
          <h2 className="font-semibold text-gray-700 mb-4">
            Stock kwa Siku Iliyochaguliwa
          </h2>

          <table className="w-full text-sm min-w-[700px]">
            <thead className="bg-gray-100 text-gray-600 text-xs uppercase">
              <tr>
                <th className="px-4 py-2">Bidhaa</th>
                <th className="px-4 py-2 text-center">Idadi Iliyopo</th>
                <th className="px-4 py-2 text-center">Kipimo</th>
                <th className="px-4 py-2 text-center">Ilisasishwa Mwisho</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-gray-400">
                    Hakuna mabadiliko ya stock kwa tarehe hii
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const inv: InventoryItem = inventoryItems?.[p.id] || {
                    availableQty: 0,
                    lastUpdated: null,
                  };

                  const lastUpdatedDate: Date | null = inv.lastUpdated
                    ? inv.lastUpdated.toDate
                      ? inv.lastUpdated.toDate()
                      : new Date(inv.lastUpdated as unknown as string)
                    : null;

                  return (
                    <tr key={p.id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-2 font-medium">{p.name}</td>
                      <td className="px-4 py-2 text-center">
                        {inv.availableQty}
                      </td>
                      <td className="px-4 py-2 text-center">{p.unit}</td>
                      <td className="px-4 py-2 text-center">
                        {lastUpdatedDate
                          ? lastUpdatedDate.toLocaleString()
                          : "-"}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* MOBILE */}
        <div className="md:hidden space-y-4">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-10 text-gray-400 italic">
              Hakuna stock kwa tarehe hii
            </div>
          ) : (
            filteredProducts.map((p) => {
              const inv: InventoryItem = inventoryItems?.[p.id] || {
                availableQty: 0,
                lastUpdated: null,
              };

              const lastUpdatedDate: Date | null = inv.lastUpdated
                ? inv.lastUpdated.toDate
                  ? inv.lastUpdated.toDate()
                  : new Date(inv.lastUpdated as unknown as string)
                : null;

              return (
                <div
                  key={p.id}
                  className="bg-white shadow rounded-xl border p-4 space-y-1"
                >
                  <div className="font-medium">{p.name}</div>
                  <div className="text-sm text-gray-600">
                    Iliyopo: {inv.availableQty} {p.unit}
                  </div>
                  <div className="text-xs text-gray-500 text-right">
                    Mwisho kusasishwa:{" "}
                    {lastUpdatedDate
                      ? lastUpdatedDate.toLocaleString()
                      : "-"}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
