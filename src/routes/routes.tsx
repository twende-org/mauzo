import Home from '../pages/Home';
import Login from '../pages/Login';
import Registration from '../pages/Registration';

// Admin pages
import Dashboard1 from '../pages/admin/Dashboard';
import Sales from '../pages/admin/Sales';
import Stock from '../pages/admin/Stock';
import Users from '../pages/admin/Users';
import Report from '../pages/admin/Report';
import Expenses from '../pages/admin/Expenses';
import Products from '../pages/admin/Products';

// Layouts
import MainLayout from '../layouts/MainLayout';
import AdminLayout from '../layouts/AdminLayout';

import type { JSX } from 'react';

interface RouteConfig {
  path: string;
  element: JSX.Element;
  children?: RouteConfig[];
  authenticated?: boolean;
}

export const routes: RouteConfig[] = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: '', element: <Home /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Registration /> },
    ],
  },
  {
    path: '/dashboard',
    element: <AdminLayout />,
    children: [
      { path: '', element: <Dashboard1 /> },
      { path: 'sales', element: <Sales /> },
      { path: 'stock', element: <Stock /> },
      { path: 'users', element: <Users /> },
      { path: 'report', element: <Report /> },
      { path: 'expenses', element: <Expenses /> },
      { path: 'products', element: <Products /> },
    ],
    authenticated: true,
  },
];
