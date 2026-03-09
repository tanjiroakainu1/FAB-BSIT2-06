import { Route } from 'react-router-dom'
import AdminDashboard from './pages/AdminDashboard'
import AdminCategories from './pages/AdminCategories'
import AdminProducts from './pages/AdminProducts'
import AdminOrders from './pages/AdminOrders'
import AdminChat from './pages/AdminChat'
import AdminUserManagement from './pages/AdminUserManagement'
import AdminForgotPasswordRequests from './pages/AdminForgotPasswordRequests'
import AdminArchive from './pages/AdminArchive'
import AdminSystemCharts from './system-charts/AdminSystemCharts'

export const AdminRoutes = (
  <>
    <Route index element={<AdminDashboard />} />
    <Route path="categories" element={<AdminCategories />} />
    <Route path="products" element={<AdminProducts />} />
    <Route path="archive" element={<AdminArchive />} />
    <Route path="orders" element={<AdminOrders />} />
    <Route path="users" element={<AdminUserManagement />} />
    <Route path="forgot-password-requests" element={<AdminForgotPasswordRequests />} />
    <Route path="chat" element={<AdminChat />} />
    <Route path="system-charts" element={<AdminSystemCharts />} />
  </>
)
