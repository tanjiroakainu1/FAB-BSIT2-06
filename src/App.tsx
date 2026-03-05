import { Routes, Route, Navigate } from 'react-router-dom'
import AdminLayout from './admin/AdminLayout'
import KitchenLayout from './kitchen/KitchenLayout'
import DeliveryLayout from './delivery/DeliveryLayout'
import CustomerLayout from './customer/CustomerLayout'
import { AdminRoutes } from './admin/routes'
import { KitchenRoutes } from './kitchen/routes'
import { DeliveryRoutes } from './delivery/routes'
import { CustomerRoutes } from './customer/routes'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/admin/*" element={<AdminLayout />}>
        {AdminRoutes}
      </Route>
      <Route path="/kitchen/*" element={<KitchenLayout />}>
        {KitchenRoutes}
      </Route>
      <Route path="/delivery/*" element={<DeliveryLayout />}>
        {DeliveryRoutes}
      </Route>
      <Route path="/*" element={<CustomerLayout />}>
        {CustomerRoutes}
      </Route>
    </Routes>
  )
}

export default App
