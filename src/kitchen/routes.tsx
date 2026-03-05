import { Route } from 'react-router-dom'
import KitchenOrders from './pages/KitchenOrders'
import KitchenSystemCharts from './system-charts/KitchenSystemCharts'
import KitchenChat from './pages/KitchenChat'

export const KitchenRoutes = (
  <>
    <Route index element={<KitchenOrders />} />
    <Route path="system-charts" element={<KitchenSystemCharts />} />
    <Route path="chat" element={<KitchenChat />} />
  </>
)
