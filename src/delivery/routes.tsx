import { Route } from 'react-router-dom'
import DeliveryOrders from './pages/DeliveryOrders'
import DeliveryChat from './pages/DeliveryChat'
import DeliveryHistory from './pages/DeliveryHistory'

export const DeliveryRoutes = (
  <>
    <Route index element={<DeliveryOrders />} />
    <Route path="chat" element={<DeliveryChat />} />
    <Route path="history" element={<DeliveryHistory />} />
  </>
)
