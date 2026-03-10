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
const CUSTOMER_EMAIL = 'customer@gmail.com'
const CUSTOMER_PASSWORD = 'customer123'

/** Role-based demo accounts for the login page guide. Single source of truth for credentials. */
export const ROLE_LOGIN_GUIDE = [
  { role: 'Admin', email: ADMIN_EMAIL, password: ADMIN_PASSWORD, description: 'Manage categories, products, orders & users' },
  { role: 'Kitchen', email: KITCHEN_EMAIL, password: KITCHEN_PASSWORD, description: 'View orders & update kitchen status' },
  { role: 'Delivery', email: DELIVERYGUY_EMAIL, password: DELIVERYGUY_PASSWORD, description: 'View orders & update delivery status' },
  { role: 'Customer', email: CUSTOMER_EMAIL, password: CUSTOMER_PASSWORD, description: 'Browse menu, place orders & view history' },
] as const

/** System (built-in) accounts shown in User Management. */
export const SYSTEM_ACCOUNTS = [
  { role: 'admin' as const, email: ADMIN_EMAIL, name: 'Admin' },
  { role: 'kitchen' as const, email: KITCHEN_EMAIL, name: 'Kitchen' },
  { role: 'deliveryguy' as const, email: DELIVERYGUY_EMAIL, name: 'Delivery' },
  { role: 'customer' as const, email: CUSTOMER_EMAIL, name: 'Customer' },
]

const CUSTOMERS_KEY = 'food-ordering-customers'
const STAFF_KEY = 'food-ordering-staff'
const AUTH_KEY = 'food-ordering-auth'
const FORGOT_PASSWORD_REQUESTS_KEY = 'food-ordering-forgot-password-requests'
const PASSWORD_OVERRIDES_KEY = 'food-ordering-password-overrides'

export interface ForgotPasswordRequest {
  id: string
  email: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
  /** Data URL of proof file (image) submitted by user */
  proofDataUrl?: string
  proofFileName?: string
}

export type User =
  | { type: 'admin' }
  | { type: 'kitchen'; staffId?: string }
  | { type: 'deliveryguy'; staffId?: string }
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
  /** Registered customers (from /register with OTP). No passwords exposed. */
  customers: { id: string; email: string; name: string; createdAt: string }[]
  addStaffUser: (data: { email: string; password: string; name: string; role: 'customer' | 'kitchen' | 'deliveryguy' }) => void | Promise<void>
  forgotPasswordRequests: ForgotPasswordRequest[]
  addForgotPasswordRequest: (email: string, proofDataUrl?: string, proofFileName?: string) => { ok: boolean; error?: string } | Promise<{ ok: boolean; error?: string }>
  submitProofAndGetStatus: (email: string, proofDataUrl: string, proofFileName?: string) => { ok: boolean; error?: string } | Promise<{ ok: boolean; error?: string }>
  getRequestsByEmail: (email: string) => ForgotPasswordRequest[]
  approveForgotPasswordRequest: (id: string) => { ok: boolean; error?: string } | Promise<{ ok: boolean; error?: string }>
  rejectForgotPasswordRequest: (id: string) => void | Promise<void>
  /** For non-users on monitoring page: set new password when request is already approved. */
  setPasswordAfterApproval: (email: string, newPassword: string) => { ok: boolean; error?: string } | Promise<{ ok: boolean; error?: string }>
}

const AuthContext = createContext<AuthContextValue | null>(null)

interface StoredCustomer {
  id: string
  email: string
  password: string
  name: string
  /** Set when customer registers (after OTP). Older records may lack this. */
  createdAt?: string
}

function loadStoredAuth(): User {
  try {
    const raw = localStorage.getItem(AUTH_KEY)
    if (!raw) return null
    const data = JSON.parse(raw)
    if (data.type === 'admin') return { type: 'admin' }
    if (data.type === 'kitchen') return { type: 'kitchen', staffId: data.staffId }
    if (data.type === 'deliveryguy') return { type: 'deliveryguy', staffId: data.staffId }
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

function getForgotPasswordRequests(): ForgotPasswordRequest[] {
  try {
    const raw = localStorage.getItem(FORGOT_PASSWORD_REQUESTS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as ForgotPasswordRequest[]
    return parsed.map((r) => ({
      ...r,
      proofDataUrl: r.proofDataUrl,
      proofFileName: r.proofFileName,
    }))
  } catch {
    return []
  }
}

function saveForgotPasswordRequests(requests: ForgotPasswordRequest[]) {
  localStorage.setItem(FORGOT_PASSWORD_REQUESTS_KEY, JSON.stringify(requests))
}

function getPasswordOverrides(): Record<string, string> {
  try {
    const raw = localStorage.getItem(PASSWORD_OVERRIDES_KEY)
    if (!raw) return {}
    return JSON.parse(raw)
  } catch {
    return {}
  }
}

function savePasswordOverrides(overrides: Record<string, string>) {
  localStorage.setItem(PASSWORD_OVERRIDES_KEY, JSON.stringify(overrides))
}

function setStoredAuth(user: User) {
  if (!user) {
    localStorage.removeItem(AUTH_KEY)
    return
  }
  if (user.type === 'admin') localStorage.setItem(AUTH_KEY, JSON.stringify({ type: 'admin' }))
  else if (user.type === 'kitchen') localStorage.setItem(AUTH_KEY, JSON.stringify({ type: 'kitchen', staffId: user.staffId }))
  else if (user.type === 'deliveryguy') localStorage.setItem(AUTH_KEY, JSON.stringify({ type: 'deliveryguy', staffId: user.staffId }))
  else
    localStorage.setItem(
      AUTH_KEY,
      JSON.stringify({ type: 'customer', id: user.id, email: user.email, name: user.name })
    )
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(loadStoredAuth)
  const [staffUsers, setStaffUsers] = useState<StoredStaffUser[]>(getStaff)
  const [forgotPasswordRequests, setForgotPasswordRequests] = useState<ForgotPasswordRequest[]>(getForgotPasswordRequests)
  const [customers, setCustomers] = useState<StoredCustomer[]>(getCustomers)

  const login = useCallback(async (email: string, password: string): Promise<User | null> => {
    const trimmed = email.trim()
    const overrides = getPasswordOverrides()
    if (overrides[trimmed.toLowerCase()] !== undefined && overrides[trimmed.toLowerCase()] === password) {
      if (trimmed.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
        const u: User = { type: 'admin' }
        setUser(u)
        setStoredAuth(u)
        return u
      }
      if (trimmed.toLowerCase() === KITCHEN_EMAIL.toLowerCase()) {
        const u: User = { type: 'kitchen' }
        setUser(u)
        setStoredAuth(u)
        return u
      }
      if (trimmed.toLowerCase() === DELIVERYGUY_EMAIL.toLowerCase()) {
        const u: User = { type: 'deliveryguy' }
        setUser(u)
        setStoredAuth(u)
        return u
      }
    }
    // Hardcoded passwords only when no override exists (after forgot-password change, only new password is valid)
    if (trimmed === ADMIN_EMAIL && overrides[trimmed.toLowerCase()] === undefined && password === ADMIN_PASSWORD) {
      const u: User = { type: 'admin' }
      setUser(u)
      setStoredAuth(u)
      return u
    }
    if (trimmed === KITCHEN_EMAIL && overrides[trimmed.toLowerCase()] === undefined && password === KITCHEN_PASSWORD) {
      const u: User = { type: 'kitchen' }
      setUser(u)
      setStoredAuth(u)
      return u
    }
    if (trimmed === DELIVERYGUY_EMAIL && overrides[trimmed.toLowerCase()] === undefined && password === DELIVERYGUY_PASSWORD) {
      const u: User = { type: 'deliveryguy' }
      setUser(u)
      setStoredAuth(u)
      return u
    }
    // Demo customer account (standalone)
    if (trimmed.toLowerCase() === CUSTOMER_EMAIL.toLowerCase()) {
      const pwdOk = overrides[trimmed.toLowerCase()] !== undefined ? overrides[trimmed.toLowerCase()] === password : password === CUSTOMER_PASSWORD
      if (pwdOk) {
        const u: User = { type: 'customer', id: 'demo-customer', email: CUSTOMER_EMAIL, name: 'Customer' }
        setUser(u)
        setStoredAuth(u)
        return u
      }
    }
    const staff = getStaff()
    const staffMatch = staff.find(
      (x) => x.email.toLowerCase() === trimmed.toLowerCase() && x.password === password
    )
    if (staffMatch) {
      if (staffMatch.role === 'kitchen') {
        const u: User = { type: 'kitchen', staffId: staffMatch.id }
        setUser(u)
        setStoredAuth(u)
        return u
      }
      if (staffMatch.role === 'deliveryguy') {
        const u: User = { type: 'deliveryguy', staffId: staffMatch.id }
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
      const list = getCustomers()
      if (list.some((c) => c.email.toLowerCase() === email.toLowerCase())) {
        return { ok: false, error: 'Email already registered' }
      }
      const id = crypto.randomUUID()
      const createdAt = new Date().toISOString()
      list.push({ id, email, password, name, createdAt })
      saveCustomers(list)
      setCustomers(getCustomers())
      return { ok: true }
    },
    []
  )

  const addStaffUser = useCallback(
    async (data: { email: string; password: string; name: string; role: 'customer' | 'kitchen' | 'deliveryguy' }) => {
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

  const addForgotPasswordRequest = useCallback(async (email: string, proofDataUrl?: string, proofFileName?: string): Promise<{ ok: boolean; error?: string }> => {
    const trimmed = email.trim().toLowerCase()
    if (!trimmed) return { ok: false, error: 'Email is required.' }
    const requests = getForgotPasswordRequests()
    const hasPending = requests.some((r) => r.email.toLowerCase() === trimmed && r.status === 'pending')
    if (hasPending) return { ok: false, error: 'A pending request for this email already exists.' }
    const newRequest: ForgotPasswordRequest = {
      id: crypto.randomUUID(),
      email: trimmed,
      status: 'pending',
      createdAt: new Date().toISOString(),
      proofDataUrl,
      proofFileName,
    }
    const updated = [newRequest, ...requests]
    saveForgotPasswordRequests(updated)
    setForgotPasswordRequests(updated)
    return { ok: true }
  }, [])

  const submitProofAndGetStatus = useCallback(async (email: string, proofDataUrl: string, proofFileName?: string): Promise<{ ok: boolean; error?: string }> => {
    const trimmed = email.trim().toLowerCase()
    if (!trimmed) return { ok: false, error: 'Email is required.' }
    if (!proofDataUrl) return { ok: false, error: 'Please choose a file as proof of ownership.' }
    const requests = getForgotPasswordRequests()
    const pendingIndex = requests.findIndex((r) => r.email.toLowerCase() === trimmed && r.status === 'pending')
    let updated: ForgotPasswordRequest[]
    if (pendingIndex !== -1) {
      updated = requests.map((r, i) =>
        i === pendingIndex ? { ...r, proofDataUrl, proofFileName } : r
      )
    } else {
      const newRequest: ForgotPasswordRequest = {
        id: crypto.randomUUID(),
        email: trimmed,
        status: 'pending',
        createdAt: new Date().toISOString(),
        proofDataUrl,
        proofFileName,
      }
      updated = [newRequest, ...requests]
    }
    saveForgotPasswordRequests(updated)
    setForgotPasswordRequests(updated)
    return { ok: true }
  }, [])

  const getRequestsByEmail = useCallback((email: string) => {
    const trimmed = email.trim().toLowerCase()
    if (!trimmed) return []
    return forgotPasswordRequests.filter((r) => r.email.toLowerCase() === trimmed)
  }, [forgotPasswordRequests])

  const approveForgotPasswordRequest = useCallback(async (id: string): Promise<{ ok: boolean; error?: string }> => {
    const requests = getForgotPasswordRequests()
    const req = requests.find((r) => r.id === id)
    if (!req) return { ok: false, error: 'Request not found.' }
    if (req.status !== 'pending') return { ok: false, error: 'Request is no longer pending.' }
    const updated = requests.map((r) => (r.id === id ? { ...r, status: 'approved' as const } : r))
    saveForgotPasswordRequests(updated)
    setForgotPasswordRequests(updated)
    return { ok: true }
  }, [])

  const rejectForgotPasswordRequest = useCallback(async (id: string) => {
    const requests = getForgotPasswordRequests()
    const updated = requests.map((r) => (r.id === id ? { ...r, status: 'rejected' as const } : r))
    saveForgotPasswordRequests(updated)
    setForgotPasswordRequests(updated)
  }, [])

  const setPasswordAfterApproval = useCallback(async (email: string, newPassword: string): Promise<{ ok: boolean; error?: string }> => {
    const trimmed = email.trim().toLowerCase()
    if (!trimmed) return { ok: false, error: 'Email is required.' }
    if (!newPassword || newPassword.length < 4) return { ok: false, error: 'Password must be at least 4 characters.' }
    const requests = getForgotPasswordRequests()
    const hasApproved = requests.some((r) => r.email.toLowerCase() === trimmed && r.status === 'approved')
    if (!hasApproved) return { ok: false, error: 'No approved request for this email. Only approved requests can change password here.' }
    const emailLower = trimmed
    const systemEmails = [ADMIN_EMAIL.toLowerCase(), KITCHEN_EMAIL.toLowerCase(), DELIVERYGUY_EMAIL.toLowerCase(), CUSTOMER_EMAIL.toLowerCase()]
    if (systemEmails.includes(emailLower)) {
      const overrides = getPasswordOverrides()
      overrides[emailLower] = newPassword
      savePasswordOverrides(overrides)
    } else {
      const staff = getStaff()
      const staffIndex = staff.findIndex((s) => s.email.toLowerCase() === emailLower)
      if (staffIndex !== -1) {
        staff[staffIndex] = { ...staff[staffIndex], password: newPassword }
        saveStaff(staff)
        setStaffUsers(staff)
      } else {
        const customersList = getCustomers()
        const custIndex = customersList.findIndex((c) => c.email.toLowerCase() === emailLower)
        if (custIndex !== -1) {
          customersList[custIndex] = { ...customersList[custIndex], password: newPassword }
          saveCustomers(customersList)
        } else {
          return { ok: false, error: 'No account found for this email.' }
        }
      }
    }
    return { ok: true }
  }, [])

  const value = useMemo(
    () => ({
      user,
      login,
      registerCustomer,
      logout,
      staffUsers,
      customers: customers.map((c) => ({
        id: c.id,
        email: c.email,
        name: c.name,
        createdAt: c.createdAt ?? '',
      })),
      addStaffUser,
      forgotPasswordRequests,
      addForgotPasswordRequest,
      submitProofAndGetStatus,
      getRequestsByEmail,
      approveForgotPasswordRequest,
      rejectForgotPasswordRequest,
      setPasswordAfterApproval,
    }),
    [
      user,
      login,
      registerCustomer,
      logout,
      staffUsers,
      customers,
      addStaffUser,
      forgotPasswordRequests,
      addForgotPasswordRequest,
      submitProofAndGetStatus,
      getRequestsByEmail,
      approveForgotPasswordRequest,
      rejectForgotPasswordRequest,
      setPasswordAfterApproval,
    ]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
