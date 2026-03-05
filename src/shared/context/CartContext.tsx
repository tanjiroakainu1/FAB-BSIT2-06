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

interface CartContextValue {
  items: OrderItem[]
  addItem: (menuItemId: string, name: string, price: number, quantity?: number) => void
  updateQuantity: (menuItemId: string, quantity: number) => void
  removeItem: (menuItemId: string) => void
  total: number
  clearCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<OrderItem[]>(loadCart)

  const addItem = useCallback(
    (menuItemId: string, name: string, price: number, quantity = 1) => {
      setItems((prev) => {
        const existing = prev.find((i) => i.menuItemId === menuItemId)
        let next: OrderItem[]
        if (existing) {
          next = prev.map((i) =>
            i.menuItemId === menuItemId
              ? { ...i, quantity: i.quantity + quantity }
              : i
          )
        } else {
          next = [...prev, { menuItemId, name, quantity, price }]
        }
        saveCart(next)
        return next
      })
    },
    []
  )

  const updateQuantity = useCallback((menuItemId: string, quantity: number) => {
    setItems((prev) => {
      if (quantity <= 0) {
        const next = prev.filter((i) => i.menuItemId !== menuItemId)
        saveCart(next)
        return next
      }
      const next = prev.map((i) =>
        i.menuItemId === menuItemId ? { ...i, quantity } : i
      )
      saveCart(next)
      return next
    })
  }, [])

  const removeItem = useCallback((menuItemId: string) => {
    setItems((prev) => {
      const next = prev.filter((i) => i.menuItemId !== menuItemId)
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
