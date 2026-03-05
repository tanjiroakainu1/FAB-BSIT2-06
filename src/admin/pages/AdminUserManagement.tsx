import { useState } from 'react'
import { PageContainer } from '@shared/components'
import { useAuth } from '@shared/context/AuthContext'

const ROLE_OPTIONS = [
  { value: 'customer', label: 'Customer' },
  { value: 'kitchen', label: 'Kitchen' },
  { value: 'deliveryguy', label: 'Delivery' },
] as const

export default function AdminUserManagement() {
  const { staffUsers, addStaffUser } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState<'customer' | 'kitchen' | 'deliveryguy'>('kitchen')
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

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
        Add Kitchen and Delivery users. All users are stored locally in this browser.
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

      <div className="card-diamond mt-6 overflow-hidden rounded-lg -mx-3 sm:mx-0">
        <div className="overflow-x-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
        <table className="min-w-[400px] sm:min-w-full divide-y divide-diamond-border">
          <thead className="bg-diamond-surface">
            <tr>
              <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-diamond-muted whitespace-nowrap">Email</th>
              <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-diamond-muted whitespace-nowrap">Name</th>
              <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-diamond-muted whitespace-nowrap">Role</th>
              <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-diamond-muted whitespace-nowrap">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-diamond-border bg-diamond-card">
            {staffUsers.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-diamond-muted">
                  No users yet. Add one above or register from the app.
                </td>
              </tr>
            ) : (
              staffUsers.map((u) => (
                <tr key={u.id}>
                  <td className="px-2 sm:px-4 py-3 text-diamond text-xs sm:text-sm truncate max-w-[140px] sm:max-w-none">{u.email}</td>
                  <td className="px-2 sm:px-4 py-3 text-diamond text-xs sm:text-sm">{u.name}</td>
                  <td className="px-2 sm:px-4 py-3 text-diamond capitalize text-xs sm:text-sm">{u.role}</td>
                  <td className="px-2 sm:px-4 py-3 text-diamond-muted text-xs sm:text-sm whitespace-nowrap">
                    {new Date(u.createdAt).toLocaleString()}
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
