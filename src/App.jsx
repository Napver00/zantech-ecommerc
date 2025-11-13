import { BrowserRouter, Routes, Route } from "react-router-dom";
import {HelmetProvider } from 'react-helmet-async';
import HomePage from "./pages/HomePage";
import About from "./pages/About";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import ReturnPolicy from "./pages/ReturnPolicy";
import Contact from "./pages/Contact";
import ProductPage from "./pages/ProductPage";
import Shop from "./pages/Shop";
import Checkout from "./pages/Checkout";
import Faq from "./pages/Faq";
import Blog from "./pages/Blog";
import PostDetails from "./pages/PostDetails";
import Tutorials from "./pages/Tutorials";
import ProtectedRoute from "./components/ProtectedRoute";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "sonner";

// Import Dashboard components
import DashboardLayout from "./pages/Dashboard/DashboardLayout";
import DashboardHome from "./pages/Dashboard/DashboardHome";
import Orders from "./pages/Dashboard/Orders";
import OrderDetails from "./pages/Dashboard/OrderDetails";
import Downloads from "./pages/Dashboard/Downloads";
import Addresses from "./pages/Dashboard/Addresses";
import AccountDetails from "./pages/Dashboard/AccountDetails";
import Wishlist from "./pages/Dashboard/Wishlist";

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/tutorials" element={<Tutorials />} />
            <Route path="/postdetails/:id" element={<PostDetails />} />
            <Route path="/about" element={<About />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy-policy" element={<Privacy />} />
            <Route path="/return-policy" element={<ReturnPolicy />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/product/:slug" element={<ProductPage />} />
            <Route path="/checkout" element={<Checkout />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardHome />} />
              <Route path="orders" element={<Orders />} />
              <Route path="orders/:invoiceCode" element={<OrderDetails />} />
              <Route path="downloads" element={<Downloads />} />
              <Route path="addresses" element={<Addresses />} />
              <Route path="account-details" element={<AccountDetails />} />
              <Route path="wishlist" element={<Wishlist />} />
            </Route>

            <Route path="*" element={<HomePage />} />
          </Routes>
        </BrowserRouter>
        <Toaster
          position="top-right"
          expand={true}
          richColors
          closeButton
          duration={4000}
          toastOptions={{
            style: {
              borderRadius: "12px",
              padding: "16px",
            },
            className: "toast-notification",
          }}
        />
      </CartProvider>
    </AuthProvider>
    </HelmetProvider>
    
  );
}

export default App;
