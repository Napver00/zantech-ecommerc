import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import About from './pages/About';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import ReturnPolicy from './pages/ReturnPolicy';
import Contact from './pages/Contact';
import ProductPage from './pages/ProductPage';
import Shop from './pages/Shop';
import Dashboard from './pages/Dashboard';
import Checkout from './pages/Checkout';
import ProtectedRoute from './components/ProtectedRoute';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'sonner';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/about" element={<About />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy-policy" element={<Privacy />} />
            <Route path="/return-policy" element={<ReturnPolicy />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/product/:slug" element={<ProductPage />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route 
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
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
              borderRadius: '12px',
              padding: '16px',
            },
            className: 'toast-notification',
          }}
        />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;

