import { useEffect, useMemo, useState } from "react";
import {
  FaBox,
  FaMoneyBillWave,
  FaFire,
  FaChartLine,
} from "react-icons/fa";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchDispatches } from "../../store/features/sales/dispatchSlice";
import { fetchInventory } from "../../store/features/inventory/inventorySlice";
import { fetchExpenses } from "../../store/features/expenses/expensesSlice";
import { fetchProducts } from "../../store/features/products/productsSlice";

export default function POSDashboard() {
  const dispatch = useAppDispatch();
  const [date, setDate] = useState<Date>(new Date());

  // ---------------- DATA KUTOKA STORE ----------------
  const dispatches = useAppSelector((s) => s.dispatch.records);
  const inventory = useAppSelector((s) => s.inventory.items);
  const expenses = useAppSelector((s) => s.expenses.expenses);
  const products = useAppSelector((s) => s.products.products);

  // ---------------- KUPAKUA DATA ----------------
  useEffect(() => {
    dispatch(fetchDispatches());
    dispatch(fetchInventory());
    dispatch(fetchExpenses());
    dispatch(fetchProducts());
  }, [dispatch]);

  // ---------------- KULINGANISHA TAREHE ----------------
  const sameDay = (a: string, b: Date) =>
    new Date(a).toDateString() === b.toDateString();

  // ---------------- MAUZO YA TAREHE ILIYOCHAGULIWA ----------------
  const dispatchesToday = useMemo(
    () => dispatches.filter((d) => sameDay(d.date, date)),
    [dispatches, date]
  );

  // ---------------- MATUMIZI YA TAREHE ILIYOCHAGULIWA ----------------
  const expensesToday = useMemo(
    () => expenses.filter((e) => sameDay(e.date, date)),
    [expenses, date]
  );

  // ---------------- MATUMIZI YA JUMLA (BILA BIDHAA) ----------------
  const generalExpenseTotal = useMemo(() => {
    return expensesToday
      .filter((e) => !e.productId)
      .reduce((s, e) => s + e.amount, 0);
  }, [expensesToday]);

  // ---------------- TAKWIMU ZA KILA BIDHAA ----------------
  const productStats = useMemo(() => {
    return products.map((product) => {
      const prodDispatches = dispatchesToday.filter(
        (d) => d.productId === product.id
      );

      const prodExpenses = expensesToday.filter(
        (e) => e.productId === product.id
      );

      const soldQty = prodDispatches.reduce((s, d) => s + d.soldQty, 0);
      const wasteQty = prodDispatches.reduce((s, d) => s + d.meltedQty, 0);
      const revenue = prodDispatches.reduce((s, d) => s + d.cashCollected, 0);
      const expenseTotal = prodExpenses.reduce((s, e) => s + e.amount, 0);

      return {
        product,
        soldQty,
        wasteQty,
        revenue,
        expenses: expenseTotal,
        profit: revenue - expenseTotal,
        inventoryQty: inventory[product.id]?.availableQty ?? 0,
      };
    });
  }, [products, dispatchesToday, expensesToday, inventory]);

  // ---------------- JUMLA KUU ----------------
  const totals = useMemo(() => {
    const revenue = productStats.reduce((s, p) => s + p.revenue, 0);
    const productExpenses = productStats.reduce((s, p) => s + p.expenses, 0);
    const waste = productStats.reduce((s, p) => s + p.wasteQty, 0);
    const expenses = productExpenses + generalExpenseTotal;

    return {
      revenue,
      expenses,
      waste,
      profit: revenue - expenses,
    };
  }, [productStats, generalExpenseTotal]);

  // ---------------- DATA YA CHATI ----------------
  const chartData = useMemo(() => {
    return [
      { name: "Mauzo", value: totals.revenue, color: "#2563EB" },
      { name: "Matumizi", value: totals.expenses, color: "#F97316" },
      { name: "Faida", value: totals.profit, color: "#16A34A" },
    ];
  }, [totals]);

  // ---------------- UI ----------------
  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen space-y-6">
      {/* KICHWA */}
      <div className="flex items-center gap-2">
        <FaChartLine className="text-primary text-2xl" />
        <h2 className="text-2xl md:text-3xl font-bold text-primary">
          Dashibodi ya POS
        </h2>
      </div>

      {/* KUCHAGUA TAREHE */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        <label className="text-sm font-medium text-gray-600">
          Chagua Tarehe:
        </label>

        <input
          type="date"
          value={date.toISOString().split("T")[0]}
          onChange={(e) => setDate(new Date(e.target.value))}
          className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* KADI ZA MUHTASARI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KPI label="Mauzo" value={totals.revenue} icon={<FaMoneyBillWave  />} color="green" />
        <KPI label="Matumizi" value={totals.expenses} icon={<FaBox />} color="yellow" />
        <KPI label="Hasara / Uharibifu" value={totals.waste} suffix=" vipande" icon={<FaFire />} color="red" />
        <KPI label="Faida" value={totals.profit} icon={<FaMoneyBillWave />} color="purple" highlight />
      </div>

      {/* CHATI */}
      <div className="bg-white rounded-xl shadow border p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Utendaji wa Siku
        </h3>

        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid stroke="#E5E7EB" strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value">
                {chartData.map((item, index) => (
                  <Cell key={index} fill={item.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* JEDWALI (DESKTOP) */}
      <div className="hidden md:block bg-white rounded-xl shadow border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Bidhaa</th>
              <th className="p-3 text-center">Iliyouzwa</th>
              <th className="p-3 text-center hidden lg:table-cell">Hasara</th>
              <th className="p-3 text-center hidden lg:table-cell">Hifadhi</th>
              <th className="p-3 text-center">Mauzo</th>
              <th className="p-3 text-center">Faida</th>
            </tr>
          </thead>
          <tbody>
            {productStats.map((p) => (
              <tr key={p.product.id} className="border-t">
                <td className="p-3">{p.product.name}</td>
                <td className="p-3 text-center">{p.soldQty}</td>
                <td className="p-3 text-center hidden lg:table-cell text-red-600">
                  {p.wasteQty}
                </td>
                <td className="p-3 text-center hidden lg:table-cell">
                  {p.inventoryQty}
                </td>
                <td className="p-3 text-center text-green-700">
                  TSh {p.revenue.toLocaleString()}
                </td>
                <td className="p-3 text-center font-semibold text-purple-700">
                  TSh {(p.profit - generalExpenseTotal).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MWONEKANO WA SIMU */}
      <div className="md:hidden space-y-3">
        {productStats.map((p) => (
          <div key={p.product.id} className="bg-white border rounded-lg p-3">
            <h3 className="font-semibold">{p.product.name}</h3>
            <p className="text-xs text-gray-500">Stock: {p.inventoryQty}</p>

            <div className="grid grid-cols-2 gap-3 mt-3 text-sm">
              <Stat label="Iliyouzwa" value={p.soldQty} />
              <Stat label="Hasara" value={p.wasteQty} danger />
              <Stat label="Mauzo" value={`TSh ${p.revenue.toLocaleString()}`} success />
              <Stat label="Faida" value={`TSh ${p.profit.toLocaleString()}`} highlight />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- KADI NDOGO ---------------- */
function KPI({ label, value, suffix = "", highlight, icon, color }: any) {
  const colors: any = {
    green: "bg-green-50 text-green-700 border-green-200",
    red: "bg-red-50 text-red-700 border-red-200",
    yellow: "bg-yellow-50 text-yellow-700 border-yellow-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
  };

  return (
    <div className={`p-3 rounded-xl border shadow ${highlight ? colors.purple : colors[color]}`}>
      <div className="flex items-center gap-2 text-sm font-medium">
        {icon} {label}
      </div>
      <div className="text-lg font-bold mt-1">
        TSh {value.toLocaleString()}{suffix}
      </div>
    </div>
  );
}

/* ---------------- TAKWIMU NDOGO ---------------- */
function Stat({ label, value, danger, success, highlight }: any) {
  return (
    <div>
      <div className="text-xs text-gray-500">{label}</div>
      <div
        className={`font-semibold ${
          danger
            ? "text-red-600"
            : success
            ? "text-green-700"
            : highlight
            ? "text-purple-700"
            : "text-gray-800"
        }`}
      >
        {value}
      </div>
    </div>
  );
}
