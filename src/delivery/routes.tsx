import { Route } from 'react-router-dom'
import DeliveryOrders from './pages/DeliveryOrders'
import DeliveryChat from './pages/DeliveryChat'

export const DeliveryRoutes = (
  <>
    <Route index element={<DeliveryOrders />} />
    <Route path="chat" element={<DeliveryChat />} />
  </>
)
