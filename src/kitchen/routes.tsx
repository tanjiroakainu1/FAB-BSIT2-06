import { Route } from 'react-router-dom'
import KitchenOrders from './pages/KitchenOrders'
import KitchenChat from './pages/KitchenChat'
import KitchenHistory from './pages/KitchenHistory'

export const KitchenRoutes = (
  <>
    <Route index element={<KitchenOrders />} />
    <Route path="history" element={<KitchenHistory />} />
    <Route path="chat" element={<KitchenChat />} />
  </>
)
