// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hook/useAuth';
import { CartProvider } from './context/CartContext';
import ClientLayout from './modules/client/layout/ClientLayout';

// Import pages
import Home from './modules/client/page/Home';
import Category from './modules/client/page/Category';
import EbookDetail from './modules/client/page/EbookDetail';
import Cart from './modules/client/page/Cart';
import Login from './modules/client/page/Login';
import Checkout from './modules/client/page/Checkout';
import Profile from './modules/client/page/profile';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Đang tải...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}


function AppRoutes() {
  const { user, loading } = useAuth();

  return (
    <Routes>
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
        {/* <Route path="categories" element={<Category />} /> */}
        <Route path="ebook/:id" element={<EbookDetail />} />
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
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

export default App;