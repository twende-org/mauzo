import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../store";
import {
  fetchUsers,
  createUser,
  editUser,
  removeUser,
  type User,
} from "../../store/features/user/usersSlice";

import Button from "../../components/ui/Button";
import InputField from "../../components/ui/InputField";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface UsersPageProps {
  businessId: string;
}

export default function UsersPage({ businessId }: UsersPageProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { users, loading, error } = useSelector((state: RootState) => state.users);

  const [form, setForm] = useState<{
    name: string;
    email: string;
    password: string;
    contact: string;
    role: User["role"];
    businessId: string;
  }>({
    name: "",
    email: "",
    password: "",
    contact: "",
    role: "seller",
    businessId,
  });

  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [filterDate, setFilterDate] = useState<Date | null>(null);

  useEffect(() => {
    if (businessId) {
      dispatch(fetchUsers(businessId));
    }
  }, [dispatch, businessId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || (!form.password && !editingUserId)) return;

    try {
      if (editingUserId) {
        const { password, email, ...data } = form;
        await dispatch(editUser({ id: editingUserId, data })).unwrap();
        setEditingUserId(null);
      } else {
        await dispatch(createUser({ ...form })).unwrap();
      }

      setForm({
        name: "",
        email: "",
        password: "",
        contact: "",
        role: "seller",
        businessId,
      });
    } catch (err) {
      console.error("Imeshindikana kuhifadhi mtumiaji:", err);
    }
  };

  const handleEdit = (user: User) => {
    setForm({
      name: user.name,
      email: user.email,
      password: "",
      contact: user.contact,
      role: user.role,
      businessId: user.businessId,
    });
    setEditingUserId(user.id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Una uhakika unataka kufuta mtumiaji huyu?")) return;
    try {
      await dispatch(removeUser(id)).unwrap();
    } catch (err) {
      console.error("Imeshindikana kufuta mtumiaji:", err);
    }
  };

  const filteredUsers = useMemo(() => {
    if (!filterDate) return users;
    return users.filter(u => new Date(u.createdAt).toDateString() === filterDate.toDateString());
  }, [users, filterDate]);

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen space-y-6">
      <h1 className="text-2xl text-primary font-bold">Usimamizi wa Watumiaji</h1>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-end"
      >
        <InputField label="Jina" name="name" value={form.name} onChange={handleChange} disabled={loading} />

        <InputField label="Namba ya Simu" name="contact" value={form.contact} onChange={handleChange} disabled={loading} />
        {/* <InputField label="Njia" name="route" value={form.route} onChange={handleChange} disabled={loading} /> */}
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="border p-2 rounded"
          disabled={loading}
        >
          <option value="seller">Muuzaji</option>
          <option value="admin">Msimamizi</option>
          <option value="manager">Meneja</option>
          <option value="cashier">Kashieri</option>
          <option value="owner">Mmiliki</option>
        </select>
        <InputField label="Barua Pepe" name="email" value={form.email} onChange={handleChange} disabled={loading || !!editingUserId} />
        {!editingUserId && (
          <InputField label="Nywila" name="password" type="password" value={form.password} onChange={handleChange} disabled={loading} />
        )}
        <Button type="submit" disabled={loading}>
          {editingUserId ? "Sasisha Mtumiaji" : "Ongeza Mtumiaji"}
        </Button>
      </form>

      {/* FILTER DATE */}
      <DatePicker
        selected={filterDate}
        onChange={setFilterDate}
        isClearable
        placeholderText="Chuja kwa tarehe ya kuundwa"
        className="w-full mb-4"
      />

      {error && <p className="text-red-500">{error}</p>}

      {/* MOBILE CARDS */}
      <div className="md:hidden space-y-4">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-8 text-gray-400 italic">Hakuna watumiaji kwa tarehe hii</div>
        ) : (
          filteredUsers.map(u => (
            <div key={u.id} className="bg-white shadow rounded-xl border p-4 space-y-1">
              <div className="font-medium">{u.name}</div>
              <div className="text-sm text-gray-600">Barua Pepe: {u.email}</div>
              <div className="text-sm text-gray-600">Simu: {u.contact}</div>
              <div className="text-sm text-gray-600">Njia: {u.route}</div>
              <div className="text-sm text-gray-600">Cheo: {u.role}</div>
              <div className="flex flex-wrap gap-2 mt-2">
                <Button onClick={() => handleEdit(u)} disabled={loading}>Hariri</Button>
                <Button onClick={() => handleDelete(u.id)} disabled={loading}>Futa</Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden md:block bg-white rounded-xl shadow border p-4">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">Jina</th>
              <th className="px-4 py-2">Barua Pepe</th>
              <th className="px-4 py-2">Simu</th>
              <th className="px-4 py-2">Njia</th>
              <th className="px-4 py-2">Cheo</th>
              <th className="px-4 py-2">Vitendo</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(u => (
              <tr key={u.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{u.name}</td>
                <td className="px-4 py-2">{u.email}</td>
                <td className="px-4 py-2">{u.contact}</td>
                {/* <td className="px-4 py-2">{u.route}</td> */}
                <td className="px-4 py-2">{u.role}</td>
                <td className="px-4 py-2 flex flex-wrap gap-2">
                  <Button onClick={() => handleEdit(u)} disabled={loading}>Hariri</Button>
                  <Button onClick={() => handleDelete(u.id)} disabled={loading}>Futa</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
