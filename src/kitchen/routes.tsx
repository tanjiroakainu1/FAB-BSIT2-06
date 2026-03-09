import { Route } from 'react-router-dom'
import KitchenOrders from './pages/KitchenOrders'
import KitchenChat from './pages/KitchenChat'

export const KitchenRoutes = (
  <>
    <Route index element={<KitchenOrders />} />
    <Route path="chat" element={<KitchenChat />} />
  </>
)
