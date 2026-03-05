import { Route } from 'react-router-dom'
import DeliveryOrders from './pages/DeliveryOrders'
import DeliverySystemCharts from './system-charts/DeliverySystemCharts'
import DeliveryChat from './pages/DeliveryChat'

export const DeliveryRoutes = (
  <>
    <Route index element={<DeliveryOrders />} />
    <Route path="system-charts" element={<DeliverySystemCharts />} />
    <Route path="chat" element={<DeliveryChat />} />
  </>
)
