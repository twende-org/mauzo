import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../store";
import {
    fetchProducts,
    createProduct,
    editProduct,
    removeProduct,
} from "../../store/features/products/productsSlice";
import Button from "../../components/ui/Button";
import InputField from "../../components/ui/InputField";
import { FaEdit, FaTrashAlt, FaPowerOff } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ITEMS_PER_PAGE = 5;

export default function Products() {
    const dispatch = useDispatch<AppDispatch>();
    const { products, loading } = useSelector((s: RootState) => s.products);

    const [form, setForm] = useState({ name: "", unit: "pcs", price: "" });
    const [editingId, setEditingId] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [filterDate, setFilterDate] = useState<Date | null>(null);

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    // filter by picking date
    const filteredProducts = useMemo(() => {
        if (!filterDate) return products;

        return products.filter((p) => {
            if (!p.createdAt) return true;
            const pDate = new Date(p.createdAt);
            return (
                pDate.getFullYear() === filterDate.getFullYear() &&
                pDate.getMonth() === filterDate.getMonth() &&
                pDate.getDate() === filterDate.getDate()
            );
        });
    }, [products, filterDate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name || !form.price) return;

        const payload = {
            name: form.name,
            unit: form.unit,
            price: Number(form.price),
            active: true,
            createdAt: new Date().toISOString() // store as string
        };

        if (editingId) {
            await dispatch(editProduct({ id: editingId, data: payload }));
        } else {
            await dispatch(createProduct(payload));
        }

        setForm({ name: "", unit: "pcs", price: "" });
        setEditingId(null);
    };

    const handleEdit = (p: any) => {
        setEditingId(p.id);
        setForm({ name: p.name, unit: p.unit, price: p.price.toString() });
    };

    const toggleActive = (p: any) => {
        dispatch(editProduct({ id: p.id, data: { active: !p.active } }));
    };

    const handleDelete = (id: string) => {
        if (!confirm("Una uhakika unataka kufuta bidhaa hii?")) return;
        dispatch(removeProduct(id));
    };

    // Pagination
    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
    const paginatedProducts = useMemo(
        () =>
            filteredProducts.slice(
                (currentPage - 1) * ITEMS_PER_PAGE,
                currentPage * ITEMS_PER_PAGE
            ),
        [filteredProducts, currentPage]
    );

    return (
        <div className="p-4 md:p-6 space-y-6 bg-gray-50 min-h-screen">
            <h1 className="text-2xl md:text-3xl font-bold text-primary">
                Usimamizi wa Bidhaa
            </h1>
            <p className="text-sm text-gray-500 mt-2">
                Rekodi bidhaa haraka na kwa urahisi
            </p>


            {/* Fomu ya Kuongeza / Kubadilisha Bidhaa */}
            <form
                onSubmit={handleSubmit}
                className="bg-white p-4 md:p-6 rounded-xl shadow border grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"
            >
                <InputField
                    label="Jina la Bidhaa"
                    name="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <InputField
                    label="Unit"
                    name="unit"
                    value={form.unit}
                    onChange={(e) => setForm({ ...form, unit: e.target.value })}
                />
                <InputField
                    label="Bei (TSh)"
                    name="price"
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                />
                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Inahifadhi..." : editingId ? "Badili Bidhaa" : "Ongeza Bidhaa"}
                </Button>
            </form>

            {/* Chagua Tarehe */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full">
                <label className="font-medium text-gray-700">Chuja kwa Tarehe:</label>
                <DatePicker
                    selected={filterDate}
                    onChange={(date: Date | null) => setFilterDate(date)}
                    dateFormat="dd/MM/yyyy"
                    isClearable
                    placeholderText="Chagua tarehe"
                    className="border p-2 rounded w-full sm:w-auto"
                />
            </div>
            {/* Jedwali la Desktop */}
            <div className="hidden md:block bg-white rounded-xl shadow border overflow-x-auto">
                <table className="w-full text-sm min-w-[700px]">
                    <thead className="bg-gray-50 text-gray-600">
                        <tr>
                            <th className="p-4 text-left">Jina</th>
                            <th className="p-4 text-center">Unit</th>
                            <th className="p-4 text-center">Bei</th>
                            <th className="p-4 text-center">Hali</th>
                            <th className="p-4 text-center">Vitendo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedProducts.map((p) => (
                            <tr key={p.id} className="border-t hover:bg-gray-50">
                                <td className="p-4 font-medium">{p.name}</td>
                                <td className="p-4 text-center">{p.unit}</td>
                                <td className="p-4 text-center">TSh {p.price.toLocaleString()}</td>
                                <td className="p-4 text-center">
                                    <span className={`font-medium ${p.active ? "text-green-600" : "text-red-500"}`}>
                                        {p.active ? "Shirika" : "Haishiriki"}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center justify-center gap-2">
                                        <button onClick={() => handleEdit(p)} title="Badili bidhaa" className="w-9 h-9 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 active:scale-95 transition">
                                            <FaEdit size={15} />
                                        </button>
                                        <button onClick={() => toggleActive(p)} title={p.active ? "Zima bidhaa" : "Washisha bidhaa"} className={`w-9 h-9 flex items-center justify-center rounded-lg ${p.active ? "bg-yellow-50 text-yellow-600 hover:bg-yellow-100" : "bg-green-50 text-green-600 hover:bg-green-100"} active:scale-95 transition`}>
                                            <FaPowerOff size={14} />
                                        </button>
                                        <button onClick={() => handleDelete(p.id)} title="Futa bidhaa" className="w-9 h-9 flex items-center justify-center rounded-lg bg-red-50 text-red-600 hover:bg-red-100 active:scale-95 transition">
                                            <FaTrashAlt size={14} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {paginatedProducts.length === 0 && (
                            <tr>
                                <td colSpan={5} className="p-6 text-center text-gray-400">
                                    Hakuna bidhaa zilizoongezwa
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden grid gap-4">
                {paginatedProducts.map((p) => (
                    <div key={p.id} className="bg-white rounded-xl shadow p-4 space-y-2 border">
                        <div className="flex justify-between items-center">
                            <div className="font-medium">{p.name}</div>
                            <span className={`font-medium ${p.active ? "text-green-600" : "text-red-500"}`}>
                                {p.active ? "Shirika" : "Haishiriki"}
                            </span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                            <div>Unit: {p.unit}</div>
                            <div>Bei: TSh {p.price.toLocaleString()}</div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 mt-2">
                            <button onClick={() => handleEdit(p)} className="flex-1 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 active:scale-95 transition py-2">
                                <FaEdit size={15} /><span className="ml-2">Badili</span>
                            </button>
                            <button onClick={() => toggleActive(p)} className={`flex-1 flex items-center justify-center rounded-lg py-2 ${p.active ? "bg-yellow-50 text-yellow-600 hover:bg-yellow-100" : "bg-green-50 text-green-600 hover:bg-green-100"} active:scale-95 transition`}>
                                <FaPowerOff size={14} /><span className="ml-2">{p.active ? "Zima" : "Washisha"}</span>
                            </button>
                            <button onClick={() => handleDelete(p.id)} className="flex-1 flex items-center justify-center rounded-lg bg-red-50 text-red-600 hover:bg-red-100 active:scale-95 transition py-2">
                                <FaTrashAlt size={14} /><span className="ml-2">Futa</span>
                            </button>
                        </div>
                    </div>
                ))}
                {paginatedProducts.length === 0 && (
                    <div className="text-center text-gray-400 py-6">Hakuna bidhaa zilizoongezwa</div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 py-3 flex-wrap">
                    <Button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)}>Kabla</Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
                        <Button key={num} onClick={() => setCurrentPage(num)} className={currentPage === num ? "bg-blue-600 text-white" : ""}>
                            {num}
                        </Button>
                    ))}
                    <Button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)}>Ijayo</Button>
                </div>
            )}
        </div>
    );
}
