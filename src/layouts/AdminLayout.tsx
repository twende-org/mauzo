import { Outlet,Navigate, NavLink } from 'react-router-dom';
import { useState } from 'react';
import { useAppSelector } from '../store/hooks';
import {
  FaBars,
  FaTimes,
  FaTachometerAlt,
  FaDollarSign,
  FaBoxes,
  FaUsers,
  FaChartBar,
  FaMoneyBillWave
} from 'react-icons/fa';
import { useAppDispatch } from '../store/hooks';
import { logout } from '../store/features/auth/authSlice';
// Add the icon property to each nav item
const navItems = [
  { label: 'Dashibodi', to: '/dashboard', end: true, icon: <FaTachometerAlt /> },
  { label: 'Mauzo', to: '/dashboard/sales', icon: <FaDollarSign /> },
  { label: 'Stoko', to: '/dashboard/stock', icon: <FaBoxes /> },
  { label: 'Wauzaji', to: '/dashboard/users', icon: <FaUsers /> },
  { label: 'Repoti', to: '/dashboard/report', icon: <FaChartBar /> },
  { label: 'Matumizi', to: '/dashboard/expenses', icon: <FaMoneyBillWave /> },
  { label: 'Bidhaa', to: '/dashboard/products', icon: <FaBoxes /> },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    [
      'flex items-center gap-2 p-2 rounded transition-colors',
      isActive ? 'bg-teal-500 text-white' : 'hover:bg-gray-700 text-gray-200',
    ].join(' ');

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={[
          'fixed md:static z-50 w-64 bg-gray-800 text-white flex flex-col',
          'transform transition-transform duration-300 ease-in-out',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
        ].join(' ')}
        aria-label="Admin navigation"
      >
        {/* Sidebar Header */}
        <div className="p-6 font-bold text-lg flex items-center justify-between border-b border-gray-700">
          <span>Admin Panel</span>
          <button
            className="md:hidden text-white"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <FaTimes />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col gap-1 px-4 py-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={linkClass}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Top Bar */}
        <header className="md:hidden bg-white shadow p-4 flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-700 text-xl"
            aria-label="Open sidebar"
          >
            <FaBars />
          </button>
          <h1 className="font-bold text-lg text-gray-800">Admin Dashboard</h1>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          <div className="mb-4 flex w-full items-center justify-between text-sm text-gray-600 me-10">
            <span>
              {user ? `Welcome, ${user.email}` : "Please log in."}
            </span>

            {user && (
              <button
                className="text-red-600 hover:text-red-700 font-medium"
                onClick={handleLogout}
              >
                Logout
              </button>
            )}
          </div>


          <Outlet />
        </main>
      </div>
    </div>
  );
}
