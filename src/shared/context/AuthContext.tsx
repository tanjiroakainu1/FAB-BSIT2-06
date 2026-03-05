import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

const ADMIN_EMAIL = 'admin@gmail.com'
const ADMIN_PASSWORD = 'admin123'
const KITCHEN_EMAIL = 'kitchen@gmail.com'
const KITCHEN_PASSWORD = 'kitchen123'
const DELIVERYGUY_EMAIL = 'deliveryguy@gmail.com'
const DELIVERYGUY_PASSWORD = 'delivery123'

/** Role-based demo accounts for the login page guide. Single source of truth for credentials. */
export const ROLE_LOGIN_GUIDE = [
  { role: 'Admin', email: ADMIN_EMAIL, password: ADMIN_PASSWORD, description: 'Manage categories, products, orders & users' },
  { role: 'Kitchen', email: KITCHEN_EMAIL, password: KITCHEN_PASSWORD, description: 'View orders & update kitchen status' },
  { role: 'Delivery', email: DELIVERYGUY_EMAIL, password: DELIVERYGUY_PASSWORD, description: 'View orders & update delivery status' },
] as const

const CUSTOMERS_KEY = 'food-ordering-customers'
const STAFF_KEY = 'food-ordering-staff'
const AUTH_KEY = 'food-ordering-auth'

export type User =
  | { type: 'admin' }
  | { type: 'kitchen' }
  | { type: 'deliveryguy' }
  | { type: 'customer'; id: string; email: string; name: string }
  | null

export interface StoredStaffUser {
  id: string
  email: string
  password: string
  name: string
  role: 'customer' | 'kitchen' | 'deliveryguy'
  createdAt: string
}

interface AuthContextValue {
  user: User
  login: (email: string, password: string) => Promise<User | null>
  registerCustomer: (email: string, password: string, name: string) => Promise<{ ok: boolean; error?: string }>
  logout: () => void
  staffUsers: StoredStaffUser[]
  addStaffUser: (data: { email: string; password: string; name: string; role: 'customer' | 'kitchen' | 'deliveryguy' }) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

interface StoredCustomer {
  id: string
  email: string
  password: string
  name: string
}

function loadStoredAuth(): User {
  try {
    const raw = localStorage.getItem(AUTH_KEY)
    if (!raw) return null
    const data = JSON.parse(raw)
    if (data.type === 'admin') return { type: 'admin' }
    if (data.type === 'kitchen') return { type: 'kitchen' }
    if (data.type === 'deliveryguy') return { type: 'deliveryguy' }
    if (data.type === 'customer' && data.id && data.email && data.name)
      return { type: 'customer', id: data.id, email: data.email, name: data.name }
  } catch {
    // ignore
  }
  return null
}

function getCustomers(): StoredCustomer[] {
  try {
    const raw = localStorage.getItem(CUSTOMERS_KEY)
    if (!raw) return []
    return JSON.parse(raw)
  } catch {
    return []
  }
}

function saveCustomers(customers: StoredCustomer[]) {
  localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(customers))
}

function getStaff(): StoredStaffUser[] {
  try {
    const raw = localStorage.getItem(STAFF_KEY)
    if (!raw) return []
    return JSON.parse(raw)
  } catch {
    return []
  }
}

function saveStaff(staff: StoredStaffUser[]) {
  localStorage.setItem(STAFF_KEY, JSON.stringify(staff))
}

function setStoredAuth(user: User) {
  if (!user) {
    localStorage.removeItem(AUTH_KEY)
    return
  }
  if (user.type === 'admin') localStorage.setItem(AUTH_KEY, JSON.stringify({ type: 'admin' }))
  else if (user.type === 'kitchen') localStorage.setItem(AUTH_KEY, JSON.stringify({ type: 'kitchen' }))
  else if (user.type === 'deliveryguy') localStorage.setItem(AUTH_KEY, JSON.stringify({ type: 'deliveryguy' }))
  else
    localStorage.setItem(
      AUTH_KEY,
      JSON.stringify({ type: 'customer', id: user.id, email: user.email, name: user.name })
    )
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(loadStoredAuth)
  const [staffUsers, setStaffUsers] = useState<StoredStaffUser[]>(getStaff)

  const login = useCallback(async (email: string, password: string): Promise<User | null> => {
    const trimmed = email.trim()
    if (trimmed === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const u: User = { type: 'admin' }
      setUser(u)
      setStoredAuth(u)
      return u
    }
    if (trimmed === KITCHEN_EMAIL && password === KITCHEN_PASSWORD) {
      const u: User = { type: 'kitchen' }
      setUser(u)
      setStoredAuth(u)
      return u
    }
    if (trimmed === DELIVERYGUY_EMAIL && password === DELIVERYGUY_PASSWORD) {
      const u: User = { type: 'deliveryguy' }
      setUser(u)
      setStoredAuth(u)
      return u
    }
    const staff = getStaff()
    const staffMatch = staff.find(
      (x) => x.email.toLowerCase() === trimmed.toLowerCase() && x.password === password
    )
    if (staffMatch) {
      if (staffMatch.role === 'kitchen') {
        const u: User = { type: 'kitchen' }
        setUser(u)
        setStoredAuth(u)
        return u
      }
      if (staffMatch.role === 'deliveryguy') {
        const u: User = { type: 'deliveryguy' }
        setUser(u)
        setStoredAuth(u)
        return u
      }
      const u: User = { type: 'customer', id: staffMatch.id, email: staffMatch.email, name: staffMatch.name }
      setUser(u)
      setStoredAuth(u)
      return u
    }
    const customers = getCustomers()
    const c = customers.find(
      (x) => x.email.toLowerCase() === trimmed.toLowerCase() && x.password === password
    )
    if (c) {
      const u: User = { type: 'customer', id: c.id, email: c.email, name: c.name }
      setUser(u)
      setStoredAuth(u)
      return u
    }
    return null
  }, [])

  const registerCustomer = useCallback(
    async (email: string, password: string, name: string): Promise<{ ok: boolean; error?: string }> => {
      const customers = getCustomers()
      if (customers.some((c) => c.email.toLowerCase() === email.toLowerCase())) {
        return { ok: false, error: 'Email already registered' }
      }
      const id = crypto.randomUUID()
      customers.push({ id, email, password, name })
      saveCustomers(customers)
      return { ok: true }
    },
    []
  )

  const addStaffUser = useCallback(
    (data: { email: string; password: string; name: string; role: 'customer' | 'kitchen' | 'deliveryguy' }) => {
      const newStaff: StoredStaffUser = {
        id: crypto.randomUUID(),
        email: data.email.trim(),
        password: data.password,
        name: data.name.trim(),
        role: data.role,
        createdAt: new Date().toISOString(),
      }
      const updated = [...getStaff(), newStaff]
      saveStaff(updated)
      setStaffUsers(updated)
    },
    []
  )

  const logout = useCallback(() => {
    setUser(null)
    setStoredAuth(null)
  }, [])

  const value = useMemo(
    () => ({ user, login, registerCustomer, logout, staffUsers, addStaffUser }),
    [user, login, registerCustomer, logout, staffUsers, addStaffUser]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
