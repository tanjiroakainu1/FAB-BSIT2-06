import { useMemo, useState } from 'react'
import { PageContainer } from '@shared/components'
import { useAuth, SYSTEM_ACCOUNTS } from '@shared/context'

const ROLE_OPTIONS = [
  { value: 'customer', label: 'Customer' },
  { value: 'kitchen', label: 'Kitchen' },
  { value: 'deliveryguy', label: 'Delivery' },
] as const

type UserRow =
  | { type: 'system'; email: string; name: string; role: 'admin' | 'kitchen' | 'deliveryguy' | 'customer' }
  | { type: 'added'; id: string; email: string; name: string; role: string; createdAt: string }
  | { type: 'customer'; id: string; email: string; name: string; createdAt: string }

export default function AdminUserManagement() {
  const { staffUsers, customers, addStaffUser } = useAuth()
  const [search, setSearch] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState<'customer' | 'kitchen' | 'deliveryguy'>('kitchen')
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const allUsers: UserRow[] = useMemo(() => {
    const system: UserRow[] = SYSTEM_ACCOUNTS.map((a) => ({ type: 'system', ...a }))
    const added: UserRow[] = staffUsers.map((u) => ({
      type: 'added' as const,
      id: u.id,
      email: u.email,
      name: u.name,
      role: u.role,
      createdAt: u.createdAt,
    }))
    const registered: UserRow[] = customers.map((c) => ({
      type: 'customer' as const,
      id: c.id,
      email: c.email,
      name: c.name,
      createdAt: c.createdAt,
    }))
    return [...system, ...added, ...registered]
  }, [staffUsers, customers])

  const searchLower = search.trim().toLowerCase()
  const filteredUsers = useMemo(
    () =>
      searchLower
        ? allUsers.filter((u) => {
            const roleStr = u.type === 'customer' ? 'customer' : u.role
            return (
              u.email.toLowerCase().includes(searchLower) ||
              u.name.toLowerCase().includes(searchLower) ||
              roleStr.toLowerCase().includes(searchLower)
            )
          })
        : allUsers,
    [allUsers, searchLower]
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedEmail = email.trim()
    const trimmedName = name.trim()
    if (!trimmedEmail || !password || !trimmedName) {
      setSubmitError('Email, password, and name are required.')
      return
    }
    setSubmitting(true)
    setSubmitError(null)
    const systemEmails = SYSTEM_ACCOUNTS.map((a) => a.email.toLowerCase())
    if (systemEmails.includes(trimmedEmail.toLowerCase())) {
      setSubmitError('This email is used by a system account. Use a different email.')
      setSubmitting(false)
      return
    }
    if (staffUsers.some((u) => u.email.toLowerCase() === trimmedEmail.toLowerCase())) {
      setSubmitError('A user with this email already exists.')
      setSubmitting(false)
      return
    }
    addStaffUser({
      email: trimmedEmail,
      password,
      name: trimmedName,
      role,
    })
    setEmail('')
    setPassword('')
    setName('')
    setRole('kitchen')
    setSubmitting(false)
  }

  return (
    <PageContainer>
      <h1 className="text-2xl font-bold text-diamond">User management</h1>
      <p className="mt-2 text-diamond-muted">
        View system accounts (Admin, Kitchen, Delivery, Customer), staff you add, and customers who registered (with OTP). All data is stored in this browser (localStorage).
      </p>

      <form onSubmit={handleSubmit} className="card-diamond mt-6 flex flex-wrap items-end gap-4 rounded-lg p-4">
        <div className="flex flex-col gap-1 min-w-[200px] flex-1">
          <label className="text-sm font-medium text-diamond-muted">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@example.com"
            className="rounded border border-diamond-border bg-diamond-surface px-3 py-2.5 sm:py-2 text-diamond focus:border-crimson focus:outline-none focus:ring-1 focus:ring-crimson min-h-[44px] sm:min-h-0"
          />
        </div>
        <div className="flex flex-col gap-1 min-w-[200px] flex-1">
          <label className="text-sm font-medium text-diamond-muted">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="rounded border border-diamond-border bg-diamond-surface px-3 py-2.5 sm:py-2 text-diamond focus:border-crimson focus:outline-none focus:ring-1 focus:ring-crimson min-h-[44px] sm:min-h-0"
          />
        </div>
        <div className="flex flex-col gap-1 min-w-[200px] flex-1">
          <label className="text-sm font-medium text-diamond-muted">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Display name"
            className="rounded border border-diamond-border bg-diamond-surface px-3 py-2.5 sm:py-2 text-diamond focus:border-crimson focus:outline-none focus:ring-1 focus:ring-crimson min-h-[44px] sm:min-h-0"
          />
        </div>
        <div className="flex flex-col gap-1 min-w-[140px]">
          <label className="text-sm font-medium text-diamond-muted">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as 'customer' | 'kitchen' | 'deliveryguy')}
            className="rounded border border-diamond-border bg-diamond-surface px-3 py-2.5 sm:py-2 text-diamond focus:border-crimson focus:outline-none focus:ring-1 focus:ring-crimson min-h-[44px] sm:min-h-0"
          >
            {ROLE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="rounded bg-crimson px-4 py-3 min-h-[48px] sm:py-2 sm:min-h-0 font-medium text-white hover:bg-crimson-light disabled:opacity-50 touch-manipulation"
        >
          {submitting ? 'Adding…' : 'Add user'}
        </button>
        {submitError && <p className="w-full text-sm text-crimson">{submitError}</p>}
      </form>

      <div className="card-diamond mt-6 rounded-xl p-4 sm:p-5">
        <label htmlFor="user-search" className="sr-only">Search users</label>
        <input
          id="user-search"
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by email, name, or role..."
          className="w-full max-w-md rounded-lg border border-diamond-border bg-diamond-surface px-4 py-2.5 text-diamond placeholder-diamond-muted transition focus:border-crimson focus:outline-none focus:ring-2 focus:ring-crimson/20"
          aria-label="Search users"
        />
      </div>

      <div className="card-diamond mt-6 overflow-hidden rounded-lg -mx-3 sm:mx-0">
        <div className="overflow-x-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
        <table className="min-w-[480px] sm:min-w-full divide-y divide-diamond-border">
          <thead className="bg-diamond-surface">
            <tr>
              <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-diamond-muted whitespace-nowrap">Email</th>
              <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-diamond-muted whitespace-nowrap">Name</th>
              <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-diamond-muted whitespace-nowrap">Role</th>
              <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-diamond-muted whitespace-nowrap">Type</th>
              <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-diamond-muted whitespace-nowrap">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-diamond-border bg-diamond-card">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-diamond-muted">
                  No users match your search.
                </td>
              </tr>
            ) : (
              filteredUsers.map((u) => (
                <tr key={u.type === 'system' ? u.email : u.id}>
                  <td className="px-2 sm:px-4 py-3 text-diamond text-xs sm:text-sm truncate max-w-[140px] sm:max-w-none">{u.email}</td>
                  <td className="px-2 sm:px-4 py-3 text-diamond text-xs sm:text-sm">{u.name}</td>
                  <td className="px-2 sm:px-4 py-3 text-diamond capitalize text-xs sm:text-sm">
                    {u.type === 'customer' ? 'Customer' : u.role === 'deliveryguy' ? 'Delivery' : u.role}
                  </td>
                  <td className="px-2 sm:px-4 py-3">
                    {u.type === 'system' && (
                      <span className="inline-flex items-center rounded-md bg-crimson/10 px-2 py-0.5 text-xs font-medium text-crimson">System</span>
                    )}
                    {u.type === 'added' && (
                      <span className="inline-flex items-center rounded-md bg-diamond-surface border border-diamond-border px-2 py-0.5 text-xs font-medium text-diamond-muted">Added</span>
                    )}
                    {u.type === 'customer' && (
                      <span className="inline-flex items-center rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">Registered (OTP)</span>
                    )}
                  </td>
                  <td className="px-2 sm:px-4 py-3 text-diamond-muted text-xs sm:text-sm whitespace-nowrap">
                    {u.type === 'system' ? '—' : u.createdAt ? new Date(u.createdAt).toLocaleString() : '—'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
      </div>
    </PageContainer>
  )
}
