// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { useAuth } from './hook/useAuth';

// Client layout & pages
import ClientLayout from './modules/client/layout/ClientLayout';
import Home from './modules/client/page/Home';
import Category from './modules/client/page/Category';
import EbookDetail from './modules/client/page/EbookDetail';
import Cart from './modules/client/page/Cart';
import Login from './modules/client/page/Login';
import Checkout from './modules/client/page/Checkout';
import Profile from './modules/client/page/Profile';

import AdminRoutes from './modules/admin/routes/AdminRoutes';

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
  },
});

// ------------------- ProtectedRoute -------------------
function ProtectedRoute({ children, requiredRole }) {
  const { user, loading } = useAuth();

  if (loading) return <div>Đang tải...</div>;

  // Chưa login
  if (!user) {
    const path = requiredRole === 'admin' ? '/admin/login' : '/login';
    return <Navigate to={path} replace />;
  }

  // Nếu role không khớp
  if (requiredRole && user.role !== requiredRole) {
    const path = requiredRole === 'admin' ? '/admin/login' : '/login';
    return <Navigate to={path} replace />;
  }

  return children;
}

function AppRoutes() {
  const { user, loading } = useAuth();
  return (
    <Routes>
      {/* Admin routes */}
      <Route path="/admin/*" element={<AdminRoutes />} />

      {/* Client routes */}
      <Route path="/login" element={<Login />} />
      <Route element={<ClientLayout />}>
        <Route
          index
          element={
            loading ? (
              <div>Đang tải...</div>
            ) : user ? (
              <Home />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="/profile" element={<Profile />} />
         <Route index element={<Home />} />
        <Route path="ebook/:id" element={<EbookDetail />} />
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

// ------------------- App -------------------
export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <AppRoutes />
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}
