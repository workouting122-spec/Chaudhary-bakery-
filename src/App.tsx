import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import ProtectedRoute from "@/admin/ProtectedRoute";

// Storefront (code-split so the 3D/animation-heavy home doesn't bloat other routes)
const Home = lazy(() => import("@/pages/Home"));
const Shop = lazy(() => import("@/pages/Shop"));
const ProductDetail = lazy(() => import("@/pages/ProductDetail"));
const About = lazy(() => import("@/pages/About"));
const Gallery = lazy(() => import("@/pages/Gallery"));
const Contact = lazy(() => import("@/pages/Contact"));
const Checkout = lazy(() => import("@/pages/Checkout"));
const OrderConfirmation = lazy(() => import("@/pages/OrderConfirmation"));
const NotFound = lazy(() => import("@/pages/NotFound"));

// Admin (separate bundle — never loaded for storefront visitors)
const AdminLayout = lazy(() => import("@/admin/AdminLayout"));
const AdminLogin = lazy(() => import("@/admin/pages/AdminLogin"));
const Dashboard = lazy(() => import("@/admin/pages/Dashboard"));
const Orders = lazy(() => import("@/admin/pages/Orders"));
const OrderDetail = lazy(() => import("@/admin/pages/OrderDetail"));
const Products = lazy(() => import("@/admin/pages/Products"));
const ProductForm = lazy(() => import("@/admin/pages/ProductForm"));
const Categories = lazy(() => import("@/admin/pages/Categories"));
const Customers = lazy(() => import("@/admin/pages/Customers"));

function PageFallback() {
  return <div className="flex min-h-screen items-center justify-center text-ink-faint">Loading…</div>;
}

export default function App() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        {/* Storefront */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Admin */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="orders" element={<Orders />} />
          <Route path="orders/:id" element={<OrderDetail />} />
          <Route path="products" element={<Products />} />
          <Route path="products/new" element={<ProductForm />} />
          <Route path="products/:id/edit" element={<ProductForm />} />
          <Route path="categories" element={<Categories />} />
          <Route path="customers" element={<Customers />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
