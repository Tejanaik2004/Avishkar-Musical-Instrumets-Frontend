import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import { WishlistProvider } from './context/WishlistContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import MyOrdersPage from './pages/MyOrdersPage';
import ProfilePage from './pages/ProfilePage';
import WishlistPage from './pages/WishlistPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './pages/AdminProducts';
import AdminOrders from './pages/AdminOrders';
import AdminUsers from './pages/AdminUsers';
import AdminCategories from './pages/AdminCategories';
import NotFoundPage from './pages/NotFoundPage';

import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <Router>
              <div className="app">
                <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="/reset-password" element={<ResetPasswordPage />} />
                  
                  <Route path="/home" element={<><Navbar /><HomePage /><Footer /></>} />
                  <Route path="/products" element={<><Navbar /><ProductsPage /><Footer /></>} />
                  <Route path="/products/:id" element={<><Navbar /><ProductDetailPage /><Footer /></>} />
                  <Route path="/category/:categoryId" element={<><Navbar /><ProductsPage /><Footer /></>} />
                  <Route path="/search" element={<><Navbar /><ProductsPage /><Footer /></>} />
                  
                  <Route path="/cart" element={<ProtectedRoute><><Navbar /><CartPage /><Footer /></></ProtectedRoute>} />
                  <Route path="/checkout" element={<ProtectedRoute><><Navbar /><CheckoutPage /><Footer /></></ProtectedRoute>} />
                  <Route path="/order-success" element={<ProtectedRoute><><Navbar /><OrderSuccessPage /><Footer /></></ProtectedRoute>} />
                  <Route path="/my-orders" element={<ProtectedRoute><><Navbar /><MyOrdersPage /><Footer /></></ProtectedRoute>} />
                  <Route path="/profile" element={<ProtectedRoute><><Navbar /><ProfilePage /><Footer /></></ProtectedRoute>} />
                  <Route path="/wishlist" element={<ProtectedRoute><><Navbar /><WishlistPage /><Footer /></></ProtectedRoute>} />
                  
                  <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                  <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
                  <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
                  <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
                  <Route path="/admin/categories" element={<AdminRoute><AdminCategories /></AdminRoute>} />
                  
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </div>
            </Router>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
