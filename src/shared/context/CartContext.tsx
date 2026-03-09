import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { OrderItem } from '@shared/types'

const CART_KEY = 'food-ordering-cart'

function loadCart(): OrderItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY)
    if (!raw) return []
    return JSON.parse(raw)
  } catch {
    return []
  }
}

function saveCart(items: OrderItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items))
}

/** Cart line key: same menuItemId + traySize + notes merge into one line. */
function lineKey(item: OrderItem): string {
  return `${item.menuItemId}|${item.traySize ?? 'full'}|${item.notes ?? ''}`
}

interface CartContextValue {
  items: OrderItem[]
  addItem: (menuItemId: string, name: string, price: number, quantity?: number, traySize?: 'half' | 'full', notes?: string) => void
  updateQuantity: (menuItemId: string, quantity: number, traySize?: 'half' | 'full', notes?: string) => void
  removeItem: (menuItemId: string, traySize?: 'half' | 'full', notes?: string) => void
  total: number
  clearCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<OrderItem[]>(loadCart)

  const addItem = useCallback(
    (menuItemId: string, name: string, price: number, quantity = 1, traySize?: 'half' | 'full', notes?: string) => {
      const newLine: OrderItem = { menuItemId, name, quantity, price, traySize, notes }
      setItems((prev) => {
        const key = lineKey(newLine)
        const existing = prev.find((i) => lineKey(i) === key)
        let next: OrderItem[]
        if (existing) {
          next = prev.map((i) =>
            lineKey(i) === key ? { ...i, quantity: i.quantity + quantity } : i
          )
        } else {
          next = [...prev, newLine]
        }
        saveCart(next)
        return next
      })
    },
    []
  )

  const updateQuantity = useCallback((menuItemId: string, quantity: number, traySize?: 'half' | 'full', notes?: string) => {
    const key = `${menuItemId}|${traySize ?? 'full'}|${notes ?? ''}`
    setItems((prev) => {
      if (quantity <= 0) {
        const next = prev.filter((i) => lineKey(i) !== key)
        saveCart(next)
        return next
      }
      const next = prev.map((i) =>
        lineKey(i) === key ? { ...i, quantity } : i
      )
      saveCart(next)
      return next
    })
  }, [])

  const removeItem = useCallback((menuItemId: string, traySize?: 'half' | 'full', notes?: string) => {
    const key = `${menuItemId}|${traySize ?? 'full'}|${notes ?? ''}`
    setItems((prev) => {
      const next = prev.filter((i) => lineKey(i) !== key)
      saveCart(next)
      return next
    })
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
    saveCart([])
  }, [])

  const total = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [items]
  )

  const value = useMemo(
    () => ({ items, addItem, updateQuantity, removeItem, total, clearCart }),
    [items, addItem, updateQuantity, removeItem, total, clearCart]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
