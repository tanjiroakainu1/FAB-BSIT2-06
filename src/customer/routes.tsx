import { Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import MenuPage from './pages/MenuPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import OrderHistoryPage from './pages/OrderHistoryPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ForgotPasswordMonitoringPage from './pages/ForgotPasswordMonitoringPage'
import CustomerSystemCharts from './system-charts/CustomerSystemCharts'

export const CustomerRoutes = (
  <>
    <Route index element={<Navigate to="/home" replace />} />
    <Route path="home" element={<HomePage />} />
    <Route path="forgot-password-monitoring" element={<ForgotPasswordMonitoringPage />} />
    <Route path="menu" element={<MenuPage />} />
    <Route path="cart" element={<CartPage />} />
    <Route path="checkout" element={<CheckoutPage />} />
    <Route path="orders" element={<OrderHistoryPage />} />
    <Route path="system-charts" element={<CustomerSystemCharts />} />
    <Route path="login" element={<LoginPage />} />
    <Route path="register" element={<RegisterPage />} />
    <Route path="forgot-password" element={<ForgotPasswordPage />} />
    <Route path="*" element={<Navigate to="/home" replace />} />
  </>
)
