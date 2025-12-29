import { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../store";
import { 
  fetchExpenses, 
  createExpense, 
  editExpense, 
  removeExpense 
} from "../../store/features/expenses/expensesSlice";

import { FaPlus, FaHistory } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Button from "../../components/ui/Button";
import InputField from "../../components/ui/InputField";
import { type ExpenseCategory } from "../../services/expenseService";
import { Timestamp } from "firebase/firestore";

export default function Expenses() {
  const dispatch = useDispatch<AppDispatch>();
  const { expenses, loading, error } = useSelector((state: RootState) => state.expenses);

  // Form data
  const [form, setForm] = useState({ description: "", amount: "", category: "other" as ExpenseCategory });
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);
  const [formError, setFormError] = useState("");

  // Picking date
  const [filterDate, setFilterDate] = useState<Date | null>(new Date());

  // Fetch expenses on load
  useEffect(() => {
    dispatch(fetchExpenses());
  }, [dispatch]);

  // Filter expenses by selected date
  const filteredExpenses = useMemo(() => {
    if (!filterDate) return expenses;

    return expenses.filter((exp) => {
      if (!exp.date) return false;
      const expDate = exp.date.toDate ? exp.date.toDate() : new Date(exp.date);
      return (
        expDate.getFullYear() === filterDate.getFullYear() &&
        expDate.getMonth() === filterDate.getMonth() &&
        expDate.getDate() === filterDate.getDate()
      );
    });
  }, [expenses, filterDate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.description || !form.amount || !form.category) {
      setFormError("Tafadhali jaza kila sehemu");
      return;
    }
    setFormError("");

    const now = Timestamp.now(); // Firestore Timestamp

    const payload = {
      description: form.description,
      amount: parseFloat(form.amount),
      category: form.category as ExpenseCategory,
      date: now,
      createdAt: now,
    };

    try {
      if (editingExpenseId) {
        await dispatch(editExpense({ id: editingExpenseId, data: payload })).unwrap();
        setEditingExpenseId(null);
      } else {
        await dispatch(createExpense(payload)).unwrap();
      }
      setForm({ description: "", amount: "", category: "other" });
    } catch {
      setFormError("Imeshindikana kuhifadhi matumizi");
    }
  };

  const handleEdit = (expense: typeof expenses[0]) => {
    setForm({
      description: expense.description,
      amount: expense.amount.toString(),
      category: expense.category,
    });
    setEditingExpenseId(expense.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Una uhakika unataka kufuta matumizi haya?")) return;
    try {
      await dispatch(removeExpense(id)).unwrap();
    } catch {
      console.error("Imeshindikana kufuta matumizi");
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6 bg-gray-50 min-h-screen w-full max-w-full overflow-hidden">
      {/* HEADER */}
      <div className="flex items-center gap-3">
        <FaPlus className="text-2xl text-primary" />
        <h1 className="text-2xl md:text-3xl font-bold text-primary">Matumizi ya Kila Siku</h1>
      </div>

      {/* FORM YA KUONGEZA / KUBADILI */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 w-full">
        <h2 className="font-bold text-gray-700 mb-4">
          {editingExpenseId ? "Badili Matumizi" : "Ongeza Matumizi Mpya"}
        </h2>
        <form className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end" onSubmit={handleSubmit}>
          <InputField
            label="Maelezo"
            name="description"
            placeholder="Andika maelezo ya matumizi"
            value={form.description}
            onChange={handleChange}
            disabled={loading}
          />
          <InputField
            label="Kiasi (TSh)"
            name="amount"
            type="number"
            placeholder="50000"
            value={form.amount}
            onChange={handleChange}
            disabled={loading}
          />
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">Kategoria</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="border rounded px-3 py-2 w-full"
              disabled={loading}
            >
              <option value="ingredient">Vifaa</option>
              <option value="fuel">Nishati</option>
              <option value="maintenance">Matengenezo</option>
              <option value="other">Mengineyo</option>
            </select>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full">
            <Button type="submit" variant="primary" className="w-full">
              {loading ? "Inachakata..." : editingExpenseId ? "Badili" : "Ongeza"}
            </Button>
            {editingExpenseId && (
              <Button
                type="button"
                variant="secondary"
                className="w-full"
                onClick={() => {
                  setEditingExpenseId(null);
                  setForm({ description: "", amount: "", category: "other" });
                  setFormError("");
                }}
              >
                Ghairi
              </Button>
            )}
          </div>
        </form>
        {formError && <p className="text-red-500 mt-2">{formError}</p>}
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>

      {/* CHAGUA TAREHE */}
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

      {/* ORODHA YA MATUMIZI */}
      <div className="space-y-4 w-full">
        {/* DESKTOP */}
        <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden w-full">
          <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2 font-semibold text-gray-700">
            <FaHistory className="text-gray-400" /> Historia ya Matumizi
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left table-auto">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-sm uppercase">
                  <th className="px-4 py-2 font-semibold">Maelezo</th>
                  <th className="px-4 py-2 font-semibold text-right">Kiasi</th>
                  <th className="px-4 py-2 font-semibold">Kategoria</th>
                  <th className="px-4 py-2 font-semibold">Tarehe</th>
                  <th className="px-4 py-2 font-semibold text-center">Vitendo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-center">
                {filteredExpenses.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-4 text-gray-400">
                      {loading ? "Inapakia..." : "Hakuna matumizi kwa tarehe hii."}
                    </td>
                  </tr>
                ) : (
                  filteredExpenses.map((expense) => (
                    <tr key={expense.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-left">{expense.description}</td>
                      <td className="px-4 py-2 text-right font-semibold text-red-600">
                        TSh {expense.amount.toLocaleString()}
                      </td>
                      <td className="px-4 py-2">{expense.category}</td>
                      <td className="px-4 py-2 text-gray-500">
                        {expense.date.toDate ? expense.date.toDate().toLocaleDateString() : new Date(expense.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2 flex justify-center gap-2">
                        <Button variant="secondary" onClick={() => handleEdit(expense)}>Badili</Button>
                        <Button variant="primary" onClick={() => handleDelete(expense.id)}>Futa</Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* MOBILE CARDS */}
        <div className="md:hidden space-y-4 w-full">
          {filteredExpenses.length === 0 ? (
            <div className="text-center text-gray-400 py-6 bg-white rounded-xl shadow-sm border border-gray-100">
              {loading ? "Inapakia..." : "Hakuna matumizi kwa tarehe hii."}
            </div>
          ) : (
            filteredExpenses.map((expense) => (
              <div key={expense.id} className="bg-white rounded-xl shadow p-4 space-y-2 border w-full">
                <div className="flex justify-between items-start">
                  <div className="font-medium text-gray-800 flex-1 pr-2">{expense.description}</div>
                  <span className="text-red-600 font-semibold whitespace-nowrap">TSh {expense.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Kategoria: {expense.category}</span>
                  <span>{expense.date.toDate ? expense.date.toDate().toLocaleDateString() : new Date(expense.date).toLocaleDateString()}</span>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button variant="secondary" onClick={() => handleEdit(expense)} className="flex-1">Badili</Button>
                  <Button variant="primary" onClick={() => handleDelete(expense.id)} className="flex-1">Futa</Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
