import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@shared/context'
import { PageContainer } from '@shared/components'

export default function ForgotPasswordPage() {
  const { addForgotPasswordRequest } = useAuth()
  const [email, setEmail] = useState('')
  const [result, setResult] = useState<{ ok: boolean; error?: string } | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setResult(null)
    const res = addForgotPasswordRequest(email)
    setResult(res)
    if (res.ok) setEmail('')
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-transparent">
      <PageContainer className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center py-10 sm:py-14">
        <div className="w-full max-w-md">
          <div className="card-diamond overflow-hidden rounded-2xl shadow-xl">
            <div className="relative border-b border-white/20 bg-gradient-to-br from-crimson-dark to-crimson px-6 py-8 text-center">
              <h1 className="relative text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Forgot password
              </h1>
              <p className="relative mt-2 text-sm font-medium text-white/90">
                Request a password reset. An admin will review your request.
              </p>
            </div>
            <div className="p-6 sm:p-8">
              {result?.ok ? (
                <div className="rounded-lg bg-green-500/10 px-4 py-3 text-sm font-medium text-green-800 dark:text-green-200 ring-1 ring-green-500/30">
                  Request submitted. An admin will process it shortly. You can try logging in again after your request is approved.
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {result?.error && (
                    <div
                      className="rounded-lg bg-crimson/10 px-4 py-3 text-sm font-medium text-crimson ring-1 ring-crimson/30"
                      role="alert"
                    >
                      {result.error}
                    </div>
                  )}
                  <div>
                    <label htmlFor="forgot-email" className="block text-sm font-semibold text-diamond">
                      Email address
                    </label>
                    <input
                      id="forgot-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-2 w-full rounded-lg border border-diamond-border bg-diamond-surface px-4 py-3 text-diamond placeholder-diamond-muted focus:border-crimson focus:outline-none focus:ring-2 focus:ring-crimson/20"
                      placeholder="you@example.com"
                      autoComplete="email"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full rounded-lg bg-crimson px-4 py-3.5 font-semibold text-white shadow-md shadow-crimson/25 transition hover:bg-crimson-light focus:outline-none focus:ring-2 focus:ring-crimson focus:ring-offset-2"
                  >
                    Submit request
                  </button>
                </form>
              )}

              <p className="mt-6 text-center text-sm text-diamond-muted">
                <Link
                  to="/login"
                  className="font-semibold text-crimson underline decoration-crimson/50 underline-offset-2 hover:text-crimson-light"
                >
                  Back to login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </PageContainer>
    </div>
  )
}
