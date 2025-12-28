import { useEffect, useState, useMemo, type SetStateAction } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../store";
import { 
  fetchSellers, 
  createSeller, 
  editSeller, 
  removeSeller, 
  type Seller 
} from "../../store/features/sellers/sellersSlice";

import { FaUsers } from "react-icons/fa";
import Button from "../../components/ui/Button";
import InputField from "../../components/ui/InputField";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Sellers() {
  const dispatch = useDispatch<AppDispatch>();
  const { sellers, loading, error } = useSelector((state: RootState) => state.sellers);

  // form data
  const [form, setForm] = useState({ name: "", phone: "", route: "" });
  const [editingSellerId, setEditingSellerId] = useState<string | null>(null);
  const [formError, setFormError] = useState("");
  
  // picking date
  const [filterDate, setFilterDate] = useState<Date | null>(null);

  // fetch sellers on load
  useEffect(() => {
    dispatch(fetchSellers());
  }, [dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.route) {
      setFormError("Tafadhali jaza kila sehemu");
      return;
    }
    setFormError("");

    try {
      if (editingSellerId) {
        await dispatch(editSeller({ id: editingSellerId, data: form })).unwrap();
        setEditingSellerId(null);
      } else {
        await dispatch(createSeller({ ...form, active: true })).unwrap();
      }
      setForm({ name: "", phone: "", route: "" });
    } catch {
      setFormError("Imeshindikana kuhifadhi seller");
    }
  };

  const handleEdit = (seller: Seller) => {
    setForm({ name: seller.name, phone: seller.phone, route: seller.route });
    setEditingSellerId(seller.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Una uhakika unataka kufuta seller huyu?")) return;
    try {
      await dispatch(removeSeller(id)).unwrap();
    } catch {
      console.error("Imeshindikana kufuta seller");
    }
  };

  // ---------------- FILTER SELLERS BY PICKING DATE ----------------
  const filteredSellers = useMemo(() => {
    if (!filterDate) return sellers;

    // assuming sellers have optional 'createdAt' as Date or string
    return sellers.filter((s) => {
      if (!s.createdAt) return false;
      const sellerDate = new Date(s.createdAt as string);
      return (
        sellerDate.getFullYear() === filterDate.getFullYear() &&
        sellerDate.getMonth() === filterDate.getMonth() &&
        sellerDate.getDate() === filterDate.getDate()
      );
    });
  }, [sellers, filterDate]);

  return (
    <div className="p-4 md:p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="flex items-center gap-3">
        <div className="bg-purple-500 p-3 rounded-lg text-white text-2xl">
          <FaUsers />
        </div>
        <h3 className="text-2xl font-bold text-gray-800">Usimamizi wa Wauzaji</h3>
      </div>

      {/* FORM YA KUONGEZA / KUBADILI SELLER */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
        <h4 className="font-bold text-gray-700 mb-4">
          {editingSellerId ? "Badili muuzaji" : "Ongeza muuzaji Mpya"}
        </h4>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-end"
        >
          <InputField
            label="Jina"
            name="name"
            placeholder="Andika jina"
            value={form.name}
            onChange={handleChange}
            disabled={loading}
          />
          <InputField
            label="Simu"
            name="phone"
            placeholder="Namba ya simu"
            value={form.phone}
            onChange={handleChange}
            disabled={loading}
          />
          <InputField
            label="Njia"
            name="route"
            placeholder="Njia ya kuuza"
            value={form.route}
            onChange={handleChange}
            disabled={loading}
          />
          <div className="md:col-span-3 flex flex-col sm:flex-row gap-3 mt-2">
            <Button type="submit" variant="primary" className="w-full sm:w-auto">
              {loading ? "Inachakata..." : editingSellerId ? "Badili muuzaji" : "Ongeza muuzaji"}
            </Button>
            {editingSellerId && (
              <Button
                type="button"
                variant="secondary"
                className="w-full sm:w-auto"
                onClick={() => {
                  setEditingSellerId(null);
                  setForm({ name: "", phone: "", route: "" });
                  setFormError("");
                }}
              >
                Ghairi
              </Button>
            )}
          </div>
        </form>
        {formError && <p className="text-red-500 mt-3 text-sm">{formError}</p>}
        {error && <p className="text-red-500 mt-3 text-sm">{error}</p>}
      </div>

      {/* CHAGUA TAREHE */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <label className="font-medium text-gray-700">
          Chagua Tarehe ya Wauzaji:
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

      {/* ORODHA YA SELLERS DESKTOP */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
        <table className="min-w-full text-left">
          <thead className="bg-gray-50 text-gray-600 text-sm uppercase">
            <tr>
              <th className="p-4">Jina</th>
              <th className="p-4">Simu</th>
              <th className="p-4">Njia</th>
              <th className="p-4 text-center">Vitendo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-center">
            {filteredSellers.length === 0 && (
              <tr>
                <td colSpan={4} className="p-6 text-gray-500">
                  {loading ? "Inapakia wauzaji..." : "Hakuna wauzaji"}
                </td>
              </tr>
            )}
            {filteredSellers.map((seller) => (
              <tr key={seller.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 font-medium">{seller.name}</td>
                <td className="p-4">{seller.phone}</td>
                <td className="p-4">{seller.route}</td>
                <td className="p-4 flex flex-col sm:flex-row justify-center gap-2">
                  <Button variant="secondary" onClick={() => handleEdit(seller)} className="w-full sm:w-auto">
                    Badili
                  </Button>
                  <Button variant="primary" onClick={() => handleDelete(seller.id)} className="w-full sm:w-auto">
                    Futa
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARDS */}
      <div className="md:hidden space-y-4">
        {filteredSellers.length === 0 ? (
          <div className="text-center text-gray-400 italic">
            {loading ? "Inapakia wauzaji..." : "Hakuna wauzaji"}
          </div>
        ) : (
          filteredSellers.map((seller) => (
            <div key={seller.id} className="bg-white border rounded-xl shadow p-4 space-y-2">
              <div className="font-medium text-gray-800">{seller.name}</div>
              <div className="text-sm text-gray-600">Simu: {seller.phone}</div>
              <div className="text-sm text-gray-600">Njia: {seller.route}</div>
              <div className="flex gap-2 mt-2">
                <Button variant="secondary" onClick={() => handleEdit(seller)} className="flex-1">
                  Badili
                </Button>
                <Button variant="primary" onClick={() => handleDelete(seller.id)} className="flex-1">
                  Futa
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
