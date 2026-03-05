import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@shared/context'
import { PageContainer } from '@shared/components'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { registerCustomer } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!name.trim() || !email.trim() || !password) {
      setError('Please fill all fields')
      return
    }
    const result = await registerCustomer(email.trim(), password, name.trim())
    if (result.ok) {
      navigate('/login')
    } else {
      setError(result.error ?? 'Registration failed')
    }
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-transparent">
      <PageContainer className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center py-12">
        <div className="w-full max-w-md">
          <div className="card-diamond overflow-hidden rounded-2xl shadow-xl">
            <div className="relative border-b border-white/20 bg-gradient-to-br from-crimson-dark to-crimson px-6 py-8 text-center">
              <div className="absolute top-4 right-4 h-8 w-8 rotate-45 border-2 border-white/30 rounded-sm" aria-hidden />
              <div className="absolute bottom-4 left-4 h-5 w-5 rotate-45 border border-white/20 rounded-sm" aria-hidden />
              <h1 className="relative text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Food Ordering Hermanas
              </h1>
              <p className="relative mt-2 text-sm font-medium text-white/90">
                Create your account
              </p>
            </div>
            <div className="p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div
                    className="rounded-lg bg-crimson/10 px-4 py-3 text-sm font-medium text-crimson ring-1 ring-crimson/30"
                    role="alert"
                  >
                    {error}
                  </div>
                )}
                <div>
                  <label
                    htmlFor="reg-name"
                    className="block text-sm font-semibold text-diamond"
                  >
                    Full name
                  </label>
                  <input
                    id="reg-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-2 w-full rounded-lg border border-diamond-border bg-diamond-surface px-4 py-3 text-diamond placeholder-diamond-muted transition focus:border-crimson focus:outline-none focus:ring-2 focus:ring-crimson/20 min-h-[48px]"
                    placeholder="Maria Santos"
                    autoComplete="name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="reg-email"
                    className="block text-sm font-semibold text-diamond"
                  >
                    Email
                  </label>
                  <input
                    id="reg-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-2 w-full rounded-lg border border-diamond-border bg-diamond-surface px-4 py-3 text-diamond placeholder-diamond-muted transition focus:border-crimson focus:outline-none focus:ring-2 focus:ring-crimson/20 min-h-[48px]"
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                </div>
                <div>
                  <label
                    htmlFor="reg-password"
                    className="block text-sm font-semibold text-diamond"
                  >
                    Password
                  </label>
                  <input
                    id="reg-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-2 w-full rounded-lg border border-diamond-border bg-diamond-surface px-4 py-3 text-diamond placeholder-diamond-muted transition focus:border-crimson focus:outline-none focus:ring-2 focus:ring-crimson/20 min-h-[48px]"
                    placeholder="••••••••"
                    autoComplete="new-password"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-lg bg-crimson px-4 py-3.5 font-semibold text-white shadow-md shadow-crimson/25 transition hover:bg-crimson-light focus:outline-none focus:ring-2 focus:ring-crimson focus:ring-offset-2 focus:ring-offset-diamond-bg active:bg-crimson-dark"
                >
                  Register
                </button>
              </form>
              <p className="mt-6 text-center text-sm text-diamond-muted">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-semibold text-crimson underline decoration-crimson/50 underline-offset-2 hover:text-crimson-light hover:decoration-crimson"
                >
                  Log in
                </Link>
              </p>
            </div>
          </div>
          <p className="mt-4 text-center text-xs text-diamond-muted">
            Join Hermanas to order food and track your orders.
          </p>
        </div>
      </PageContainer>
    </div>
  )
}
