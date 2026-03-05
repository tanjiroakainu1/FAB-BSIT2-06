import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth, ROLE_LOGIN_GUIDE } from '@shared/context'
import { PageContainer } from '@shared/components'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const from = (location.state as { from?: string } | null)?.from ?? '/menu'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email.trim() || !password) {
      setError('Please enter email and password')
      return
    }
    const loggedInUser = await login(email.trim(), password)
    if (loggedInUser) {
      if (loggedInUser.type === 'admin') {
        navigate('/admin', { replace: true })
      } else if (loggedInUser.type === 'kitchen') {
        navigate('/kitchen', { replace: true })
      } else if (loggedInUser.type === 'deliveryguy') {
        navigate('/delivery', { replace: true })
      } else {
        navigate(from, { replace: true })
      }
    } else {
      setError('Invalid email or password')
    }
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-transparent">
      <PageContainer className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center py-10 sm:py-14">
        <div className="w-full max-w-md">
          <div className="card-diamond overflow-hidden rounded-2xl shadow-xl">
            {/* Header with diamond accent */}
            <div className="relative border-b border-white/20 bg-gradient-to-br from-crimson-dark to-crimson px-6 py-8 text-center">
              <div className="absolute top-4 right-4 h-8 w-8 rotate-45 border-2 border-white/30 rounded-sm" aria-hidden />
              <div className="absolute bottom-4 left-4 h-5 w-5 rotate-45 border border-white/20 rounded-sm" aria-hidden />
              <h1 className="relative text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Food Ordering Hermanas
              </h1>
              <p className="relative mt-2 text-sm font-medium text-white/90">
                Sign in to your account
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
                    htmlFor="login-email"
                    className="block text-sm font-semibold text-diamond"
                  >
                    Email
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-2 w-full rounded-lg border border-diamond-border bg-diamond-surface px-4 py-3 text-diamond placeholder-diamond-muted transition focus:border-crimson focus:outline-none focus:ring-2 focus:ring-crimson/20"
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                </div>
                <div>
                  <label
                    htmlFor="login-password"
                    className="block text-sm font-semibold text-diamond"
                  >
                    Password
                  </label>
                  <input
                    id="login-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-2 w-full rounded-lg border border-diamond-border bg-diamond-surface px-4 py-3 text-diamond placeholder-diamond-muted transition focus:border-crimson focus:outline-none focus:ring-2 focus:ring-crimson/20"
                    placeholder="••••••••"
                    autoComplete="current-password"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-lg bg-crimson px-4 py-3.5 font-semibold text-white shadow-md shadow-crimson/25 transition hover:bg-crimson-light focus:outline-none focus:ring-2 focus:ring-crimson focus:ring-offset-2 focus:ring-offset-diamond-bg active:bg-crimson-dark"
                >
                  Log in
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-diamond-muted">
                No account?{' '}
                <Link
                  to="/register"
                  className="font-semibold text-crimson underline decoration-crimson/50 underline-offset-2 hover:text-crimson-light hover:decoration-crimson"
                >
                  Create one
                </Link>
              </p>

              {/* Demo accounts */}
              <div className="mt-8 rounded-xl border border-diamond-border bg-diamond-surface/60 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-crimson">
                  Demo accounts
                </p>
                <p className="mt-1 text-xs text-diamond-muted">
                  Click &quot;Use this account&quot; to fill the form, then Log in.
                </p>
                <ul className="mt-4 space-y-3">
                  {ROLE_LOGIN_GUIDE.map(({ role, email: demoEmail, password: demoPassword, description }) => (
                    <li
                      key={role}
                      className="rounded-lg border border-diamond-border bg-diamond-card p-3 shadow-sm"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-semibold text-diamond">{role}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setEmail(demoEmail)
                            setPassword(demoPassword)
                            setError('')
                          }}
                          className="rounded-md bg-crimson px-3 py-2.5 min-h-[44px] sm:py-1.5 sm:min-h-0 text-xs font-medium text-white hover:bg-crimson-light focus:outline-none focus:ring-2 focus:ring-crimson focus:ring-offset-1 touch-manipulation"
                          aria-label={`Fill login with ${role} demo account`}
                        >
                          Use this account
                        </button>
                      </div>
                      <p className="mt-1.5 text-xs text-diamond-muted">
                        {demoEmail} · <code className="rounded bg-diamond-surface px-1 py-0.5 font-mono text-crimson">{demoPassword}</code>
                      </p>
                      <p className="mt-0.5 text-xs text-diamond-muted">{description}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <p className="mt-5 text-center text-xs text-diamond-muted">
            Place orders and manage your account with Hermanas.
          </p>
        </div>
      </PageContainer>
    </div>
  )
}
