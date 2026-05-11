import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

// Layout
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Pages
import Home          from "./pages/Home";
import Login         from "./pages/Login";
import Register      from "./pages/Register";
import Browse        from "./pages/Browse";
import ProductDetail from "./pages/ProductDetail";
import Cart          from "./pages/Cart";
import Checkout      from "./pages/Checkout";
import Orders        from "./pages/Orders";
import FarmerDashboard from "./pages/FarmerDashboard";
import AddEditProduct  from "./pages/AddEditProduct";
import FarmerProfile   from "./pages/FarmerProfile";
import Farmers         from "./pages/Farmers";
import Profile         from "./pages/Profile";

// Protected Route wrapper
const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 text-sm">Loading...</p>
      </div>
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
};

// Pages with Navbar + Footer layout
const Layout = ({ children }) => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
);

// Auth pages (no footer)
const AuthLayout = ({ children }) => (
  <div className="min-h-screen">
    {children}
  </div>
);

const AppRoutes = () => (
  <Routes>
    {/* Public Routes */}
    <Route path="/" element={<Layout><Home /></Layout>} />
    <Route path="/browse" element={<Layout><Browse /></Layout>} />
    <Route path="/product/:id" element={<Layout><ProductDetail /></Layout>} />
    <Route path="/farmers" element={<Layout><Farmers /></Layout>} />
    <Route path="/farmer/:id" element={<Layout><FarmerProfile /></Layout>} />

    {/* Auth Routes */}
    <Route path="/login"    element={<AuthLayout><Login /></AuthLayout>} />
    <Route path="/register" element={<AuthLayout><Register /></AuthLayout>} />

    {/* Protected - Any logged in user */}
    <Route path="/profile" element={
      <ProtectedRoute>
        <Layout><Profile /></Layout>
      </ProtectedRoute>
    } />
    <Route path="/orders" element={
      <ProtectedRoute>
        <Layout><Orders /></Layout>
      </ProtectedRoute>
    } />

    {/* Protected - Consumer only */}
    <Route path="/cart" element={
      <ProtectedRoute roles={["consumer", "vendor"]}>
        <Layout><Cart /></Layout>
      </ProtectedRoute>
    } />
    <Route path="/checkout" element={
      <ProtectedRoute roles={["consumer", "vendor"]}>
        <Layout><Checkout /></Layout>
      </ProtectedRoute>
    } />

    {/* Protected - Farmer only */}
    <Route path="/farmer/dashboard" element={
      <ProtectedRoute roles={["farmer"]}>
        <Layout><FarmerDashboard /></Layout>
      </ProtectedRoute>
    } />
    <Route path="/farmer/add-product" element={
      <ProtectedRoute roles={["farmer"]}>
        <Layout><AddEditProduct /></Layout>
      </ProtectedRoute>
    } />
    <Route path="/farmer/edit-product/:id" element={
      <ProtectedRoute roles={["farmer"]}>
        <Layout><AddEditProduct /></Layout>
      </ProtectedRoute>
    } />

    {/* 404 */}
    <Route path="*" element={
      <Layout>
        <div className="max-w-2xl mx-auto px-4 py-24 text-center">
          <div className="text-8xl mb-6">🌾</div>
          <h1 className="text-4xl font-extrabold text-gray-800 mb-3">404</h1>
          <p className="text-gray-500 mb-6">Oops! This page doesn't exist.</p>
          <a href="/" className="btn-primary px-8 py-3 inline-block">Go Home</a>
        </div>
      </Layout>
    } />
  </Routes>
);

const App = () => (
  <Router>
    <AuthProvider>
      <CartProvider>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: { borderRadius: "12px", fontSize: "14px", fontWeight: "500" },
            success: { iconTheme: { primary: "#16a34a", secondary: "#fff" } },
            error:   { iconTheme: { primary: "#ef4444", secondary: "#fff" } },
          }}
        />
      </CartProvider>
    </AuthProvider>
  </Router>
);

export default App;
