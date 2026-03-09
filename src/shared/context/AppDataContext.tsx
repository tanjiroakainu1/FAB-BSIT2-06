import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Category, MenuItem, Order, PaymentStatus, DeliveryStatus, CalledStatus, KitchenStatus, UpsAndDownsEntry, UpsAndDownsRole } from '@shared/types'

const STORAGE_KEY = 'food-ordering-data'

/** Community chat: admin, kitchen, and delivery share one channel. */
export type CommunityChatSender = 'admin' | 'kitchen' | 'delivery'

export interface AdminChatMessage {
  id: string
  sender: CommunityChatSender
  text: string
  createdAt: string
}

/** 1-on-1 chat: participant id is 'admin' | 'kitchen' | 'delivery' or staff user id (uuid). */
export interface DirectChatMessage {
  id: string
  conversationId: string
  fromId: string
  toId: string
  text: string
  createdAt: string
}

export function getConversationId(party1: string, party2: string): string {
  return [party1, party2].sort().join(':')
}

/** Menu item stored in archive (with when it was archived). */
export interface ArchivedMenuItem extends MenuItem {
  archivedAt: string
}

interface StoredData {
  categories: Category[]
  menuItems: MenuItem[]
  archivedMenuItems: ArchivedMenuItem[]
  orders: Order[]
  adminChatMessages: AdminChatMessage[]
  directChatMessages: DirectChatMessage[]
  upsAndDowns: UpsAndDownsEntry[]
}

const SEED_CATEGORIES: Category[] = [
  { id: 'seed-cat-1', name: 'Main Dishes', slug: 'main-dishes' },
  { id: 'seed-cat-2', name: 'Drinks', slug: 'drinks' },
  { id: 'seed-cat-3', name: 'Desserts', slug: 'desserts' },
  { id: 'seed-cat-4', name: 'Snacks', slug: 'snacks' },
  { id: 'seed-cat-combo', name: 'Combo & Package Meals', slug: 'combo-package-meals' },
]

// Open-source food images (Unsplash, free to use – https://unsplash.com/license)
const U = (id: string) => `https://images.unsplash.com/photo-${id}?w=400&q=80`

const SEED_MENU_ITEMS: MenuItem[] = [
  { id: 'seed-item-1', name: 'Chicken Adobo', description: 'Classic Filipino braised chicken in soy and vinegar.', price: 125, categoryId: 'seed-cat-1', available: true, imageUrl: U('1598103442097-8b74394b95c6') },
  { id: 'seed-item-2', name: 'Pancit Canton', description: 'Stir-fried noodles with vegetables and meat.', price: 99, categoryId: 'seed-cat-1', available: true, imageUrl: U('1569718212165-3a2854114a5e') },
  { id: 'seed-item-3', name: 'Lechon Kawali', description: 'Crispy fried pork belly with rice.', price: 185, categoryId: 'seed-cat-1', available: true, imageUrl: U('1603360946369-dc9bbf580ab5') },
  { id: 'seed-item-4', name: 'Sinigang na Baboy', description: 'Sour tamarind soup with pork and vegetables.', price: 145, categoryId: 'seed-cat-1', available: true, imageUrl: U('1547592166-23ac45744acd') },
  { id: 'seed-item-5', name: 'Iced Calamansi Juice', description: 'Refreshing citrus drink.', price: 45, categoryId: 'seed-cat-2', available: true, imageUrl: U('1621263764928-df1444c5e859') },
  { id: 'seed-item-6', name: 'Sago\'t Gulaman', description: 'Sweet drink with tapioca and jelly.', price: 35, categoryId: 'seed-cat-2', available: true, imageUrl: U('1544145945-f90425340c7e') },
  { id: 'seed-item-7', name: 'Buko Juice', description: 'Fresh young coconut water.', price: 55, categoryId: 'seed-cat-2', available: true, imageUrl: U('1558618666-fcd25c85cd64') },
  { id: 'seed-item-8', name: 'Halo-Halo', description: 'Shaved ice with mixed fruits, beans, and leche flan.', price: 89, categoryId: 'seed-cat-3', available: true, imageUrl: U('1570197788417-0e82375c9371') },
  { id: 'seed-item-9', name: 'Leche Flan', description: 'Caramel custard dessert.', price: 65, categoryId: 'seed-cat-3', available: true, imageUrl: U('1488477181946-6428a0291777') },
  { id: 'seed-item-10', name: 'Turon', description: 'Fried banana spring rolls with caramel.', price: 49, categoryId: 'seed-cat-3', available: true, imageUrl: U('1603833664338-1a2c0b5e1a19') },
  { id: 'seed-item-11', name: 'Lumpia', description: 'Crispy vegetable spring rolls (2 pcs).', price: 59, categoryId: 'seed-cat-4', available: true, imageUrl: U('1601050690597-df0568f70950') },
  { id: 'seed-item-12', name: 'Chicharon', description: 'Crispy pork rinds with vinegar dip.', price: 75, categoryId: 'seed-cat-4', available: true, imageUrl: U('1559847844-5315695dadae') },
  { id: 'seed-item-combo-1', name: 'Family Combo', description: 'Chicken Adobo, Pancit Canton, and Iced Calamansi — perfect for sharing.', price: 249, categoryId: 'seed-cat-combo', available: true, imageUrl: U('1603360946369-dc9bbf580ab5'), productType: 'combo', comboItemIds: ['seed-item-1', 'seed-item-2', 'seed-item-5'], halfTrayAvailable: true },
]

const seedData: StoredData = {
  categories: SEED_CATEGORIES,
  menuItems: SEED_MENU_ITEMS,
  archivedMenuItems: [],
  orders: [],
  adminChatMessages: [],
  directChatMessages: [],
  upsAndDowns: [],
}

function migrateOrder(o: unknown): Order {
  const order = o as Order
  return {
    ...order,
    paymentMethod: order.paymentMethod ?? 'cash',
    paymentStatus: order.paymentStatus ?? 'pending',
    deliveryOption: order.deliveryOption ?? 'delivery',
    deliveryStatus: order.deliveryStatus ?? 'pending',
    calledStatus: order.calledStatus ?? 'pending',
    kitchenStatus: order.kitchenStatus ?? 'pending',
    orderNotes: order.orderNotes,
    paymentReference: order.paymentReference,
    gcashMobileNumber: order.gcashMobileNumber,
    needByDate: order.needByDate,
    needByTime: order.needByTime,
  }
}

const SEED_IMAGE_BY_ID: Record<string, string> = Object.fromEntries(
  SEED_MENU_ITEMS.filter((m) => m.imageUrl).map((m) => [m.id, m.imageUrl!])
)

function migrateMenuItem(item: MenuItem): MenuItem {
  const withImage = item.imageUrl ? item : (() => {
    const seedImage = SEED_IMAGE_BY_ID[item.id]
    return seedImage ? { ...item, imageUrl: seedImage } : item
  })()
  const productType = withImage.productType ?? 'single'
  const comboItemIds = Array.isArray(withImage.comboItemIds) ? withImage.comboItemIds : []
  return { ...withImage, halfTrayAvailable: withImage.halfTrayAvailable ?? false, productType, comboItemIds }
}

function loadData(): StoredData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return seedData
    const data = JSON.parse(raw)
    const categories = Array.isArray(data.categories) ? data.categories : seedData.categories
    const menuItemsRaw = Array.isArray(data.menuItems) ? data.menuItems : seedData.menuItems
    const menuItems = menuItemsRaw.map((m: MenuItem) => migrateMenuItem(m))
    const ordersRaw = Array.isArray(data.orders) ? data.orders : seedData.orders
    const orders = ordersRaw.map((o: unknown) => migrateOrder(o))
    const adminChatMessagesRaw = Array.isArray(data.adminChatMessages)
      ? data.adminChatMessages
      : seedData.adminChatMessages
    const validSenders: CommunityChatSender[] = ['admin', 'kitchen', 'delivery']
    const adminChatMessages = adminChatMessagesRaw.map((m: { id: string; sender: string; text: string; createdAt: string }): AdminChatMessage => ({
      ...m,
      sender: validSenders.includes(m.sender as CommunityChatSender) ? (m.sender as CommunityChatSender) : 'admin',
    }))
    const directChatMessages = Array.isArray(data.directChatMessages) ? data.directChatMessages : seedData.directChatMessages
    const upsAndDowns = Array.isArray(data.upsAndDowns) ? data.upsAndDowns : seedData.upsAndDowns
    const archivedMenuItemsRaw = Array.isArray(data.archivedMenuItems) ? data.archivedMenuItems : []
    const archivedMenuItems = archivedMenuItemsRaw.map((m: ArchivedMenuItem) => ({
      ...migrateMenuItem(m),
      archivedAt: m.archivedAt ?? new Date().toISOString(),
    }))
    if (categories.length === 0 && menuItems.length === 0) return seedData
    return { categories, menuItems, archivedMenuItems, orders, adminChatMessages, directChatMessages, upsAndDowns }
  } catch {
    return seedData
  }
}

function saveData(data: StoredData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
}

interface AppDataContextValue extends StoredData {
  addCategory: (name: string) => Category
  updateCategory: (id: string, name: string) => void
  deleteCategory: (id: string) => void
  addMenuItem: (item: Omit<MenuItem, 'id'>) => MenuItem
  updateMenuItem: (id: string, item: Partial<Omit<MenuItem, 'id'>>) => void
  /** Soft-delete: move product to archive (restore or permanently delete from Archive management). */
  deleteMenuItem: (id: string) => void
  restoreMenuItem: (id: string) => void
  permanentlyDeleteMenuItem: (id: string) => void
  addOrder: (order: Omit<Order, 'id' | 'createdAt'>) => Order
  updateOrderStatus: (id: string, status: Order['status']) => void
  updateOrderPaymentStatus: (id: string, status: PaymentStatus) => void
  updateOrderDeliveryStatus: (id: string, status: DeliveryStatus) => void
  updateOrderCalledStatus: (id: string, status: CalledStatus) => void
  updateOrderKitchenStatus: (id: string, status: KitchenStatus) => void
  addAdminChatMessage: (sender: CommunityChatSender, text: string) => void
  addDirectChatMessage: (conversationId: string, fromId: string, toId: string, text: string) => void
  addUpsAndDowns: (type: 'up' | 'down', label: string, role: UpsAndDownsRole) => UpsAndDownsEntry
}

const AppDataContext = createContext<AppDataContextValue | null>(null)

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<StoredData>(loadData)

  useEffect(() => {
    saveData(data)
  }, [data])

  const addCategory = useCallback((name: string) => {
    const id = crypto.randomUUID()
    const slug = slugify(name) || id.slice(0, 8)
    const category: Category = { id, name, slug }
    setData((d) => ({ ...d, categories: [...d.categories, category] }))
    return category
  }, [])

  const updateCategory = useCallback((id: string, name: string) => {
    const slug = slugify(name) || id.slice(0, 8)
    setData((d) => ({
      ...d,
      categories: d.categories.map((c) => (c.id === id ? { ...c, name, slug } : c)),
    }))
  }, [])

  const deleteCategory = useCallback((id: string) => {
    setData((d) => ({
      ...d,
      categories: d.categories.filter((c) => c.id !== id),
      menuItems: d.menuItems.filter((m) => m.categoryId !== id),
    }))
  }, [])

  const addMenuItem = useCallback((item: Omit<MenuItem, 'id'>) => {
    const id = crypto.randomUUID()
    const menuItem: MenuItem = { ...item, id }
    setData((d) => ({ ...d, menuItems: [...d.menuItems, menuItem] }))
    return menuItem
  }, [])

  const updateMenuItem = useCallback((id: string, item: Partial<Omit<MenuItem, 'id'>>) => {
    setData((d) => ({
      ...d,
      menuItems: d.menuItems.map((m) => (m.id === id ? { ...m, ...item } : m)),
    }))
  }, [])

  const deleteMenuItem = useCallback((id: string) => {
    setData((d) => {
      const item = d.menuItems.find((m) => m.id === id)
      if (!item) return d
      const archived: ArchivedMenuItem = { ...item, archivedAt: new Date().toISOString() }
      return {
        ...d,
        menuItems: d.menuItems.filter((m) => m.id !== id),
        archivedMenuItems: [archived, ...d.archivedMenuItems],
      }
    })
  }, [])

  const restoreMenuItem = useCallback((id: string) => {
    setData((d) => {
      const archived = d.archivedMenuItems.find((m) => m.id === id)
      if (!archived) return d
      const { archivedAt: _, ...item } = archived
      return {
        ...d,
        menuItems: [...d.menuItems, item],
        archivedMenuItems: d.archivedMenuItems.filter((m) => m.id !== id),
      }
    })
  }, [])

  const permanentlyDeleteMenuItem = useCallback((id: string) => {
    setData((d) => ({
      ...d,
      archivedMenuItems: d.archivedMenuItems.filter((m) => m.id !== id),
    }))
  }, [])

  const addOrder = useCallback((order: Omit<Order, 'id' | 'createdAt'>) => {
    const id = crypto.randomUUID()
    const full: Order = {
      ...order,
      id,
      createdAt: new Date().toISOString(),
      paymentStatus: order.paymentStatus ?? 'pending',
      deliveryStatus: order.deliveryStatus ?? 'pending',
      calledStatus: 'pending',
      kitchenStatus: 'pending',
    }
    setData((d) => ({ ...d, orders: [full, ...d.orders] }))
    return full
  }, [])

  const updateOrderStatus = useCallback((id: string, status: Order['status']) => {
    setData((d) => ({
      ...d,
      orders: d.orders.map((o) => (o.id === id ? { ...o, status } : o)),
    }))
  }, [])

  const updateOrderPaymentStatus = useCallback((id: string, status: PaymentStatus) => {
    setData((d) => ({
      ...d,
      orders: d.orders.map((o) => (o.id === id ? { ...o, paymentStatus: status } : o)),
    }))
  }, [])

  const updateOrderDeliveryStatus = useCallback((id: string, status: DeliveryStatus) => {
    setData((d) => ({
      ...d,
      orders: d.orders.map((o) => (o.id === id ? { ...o, deliveryStatus: status } : o)),
    }))
  }, [])

  const updateOrderCalledStatus = useCallback((id: string, status: CalledStatus) => {
    setData((d) => ({
      ...d,
      orders: d.orders.map((o) => (o.id === id ? { ...o, calledStatus: status } : o)),
    }))
  }, [])

  const updateOrderKitchenStatus = useCallback((id: string, status: KitchenStatus) => {
    setData((d) => ({
      ...d,
      orders: d.orders.map((o) => (o.id === id ? { ...o, kitchenStatus: status } : o)),
    }))
  }, [])

  const addAdminChatMessage = useCallback((sender: CommunityChatSender, text: string) => {
    const trimmed = text.trim()
    if (!trimmed) return
    const msg: AdminChatMessage = {
      id: crypto.randomUUID(),
      sender,
      text: trimmed,
      createdAt: new Date().toISOString(),
    }
    setData((d) => ({ ...d, adminChatMessages: [...d.adminChatMessages, msg] }))
  }, [])

  const addDirectChatMessage = useCallback((conversationId: string, fromId: string, toId: string, text: string) => {
    const trimmed = text.trim()
    if (!trimmed) return
    const msg: DirectChatMessage = {
      id: crypto.randomUUID(),
      conversationId,
      fromId,
      toId,
      text: trimmed,
      createdAt: new Date().toISOString(),
    }
    setData((d) => ({ ...d, directChatMessages: [...d.directChatMessages, msg] }))
  }, [])

  const addUpsAndDowns = useCallback((type: 'up' | 'down', label: string, role: UpsAndDownsRole) => {
    const entry: UpsAndDownsEntry = {
      id: crypto.randomUUID(),
      type,
      label: label.trim() || (type === 'up' ? 'Up' : 'Down'),
      createdAt: new Date().toISOString(),
      role,
    }
    setData((d) => ({ ...d, upsAndDowns: [entry, ...d.upsAndDowns] }))
    return entry
  }, [])

  const value = useMemo<AppDataContextValue>(
    () => ({
      ...data,
      addCategory,
      updateCategory,
      deleteCategory,
      addMenuItem,
      updateMenuItem,
      deleteMenuItem,
      restoreMenuItem,
      permanentlyDeleteMenuItem,
      addOrder,
      updateOrderStatus,
      updateOrderPaymentStatus,
      updateOrderDeliveryStatus,
      updateOrderCalledStatus,
      updateOrderKitchenStatus,
      addAdminChatMessage,
      addDirectChatMessage,
      addUpsAndDowns,
    }),
    [
      data,
      addCategory,
      updateCategory,
      deleteCategory,
      addMenuItem,
      updateMenuItem,
      deleteMenuItem,
      restoreMenuItem,
      permanentlyDeleteMenuItem,
      addOrder,
      updateOrderStatus,
      updateOrderPaymentStatus,
      updateOrderDeliveryStatus,
      updateOrderCalledStatus,
      updateOrderKitchenStatus,
      addAdminChatMessage,
      addDirectChatMessage,
      addUpsAndDowns,
    ]
  )

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
}

export function useAppData() {
  const ctx = useContext(AppDataContext)
  if (!ctx) throw new Error('useAppData must be used within AppDataProvider')
  return ctx
}
