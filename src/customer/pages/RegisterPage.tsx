import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@shared/context'
import { PageContainer } from '@shared/components'
import { sendOtpEmail } from '@shared/utils/emailJsOtp'

function generateOtp(): string {
  return String(Math.floor(100000 + Math.random() * 900000))
}

export default function RegisterPage() {
  const navigate = useNavigate()
  const { registerCustomer } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)
  const [step, setStep] = useState<'form' | 'otp'>('form')
  const [otpInput, setOtpInput] = useState('')
  const [otpSending, setOtpSending] = useState(false)
  const [pendingRegistration, setPendingRegistration] = useState<{ name: string; email: string; password: string; otp: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!name.trim() || !email.trim() || !password) {
      setError('Please fill all fields')
      return
    }
    const trimmedEmail = email.trim()
    const otp = generateOtp()
    setOtpSending(true)
    const sendResult = await sendOtpEmail(trimmedEmail, otp)
    setOtpSending(false)
    if (!sendResult.ok) {
      const msg = sendResult.error
      setError(typeof msg === 'string' ? msg : 'Email could not be sent. Use the demo account to log in: customer@gmail.com / customer123.')
      return
    }
    setPendingRegistration({ name: name.trim(), email: trimmedEmail, password, otp })
    setOtpInput('')
    setStep('otp')
  }

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!pendingRegistration) return
    const entered = otpInput.trim().replace(/\s/g, '')
    if (entered !== pendingRegistration.otp) {
      setError('Invalid OTP. Please check your email and try again.')
      return
    }
    const result = await registerCustomer(pendingRegistration.email, pendingRegistration.password, pendingRegistration.name)
    if (result.ok) {
      setPendingRegistration(null)
      setStep('form')
      setShowSuccess(true)
    } else {
      const msg = result.error
      setError(typeof msg === 'string' ? msg : 'Registration failed')
    }
  }

  const handleBackToForm = () => {
    setStep('form')
    setPendingRegistration(null)
    setOtpInput('')
    setError('')
  }

  const handleSuccessDismiss = () => {
    setShowSuccess(false)
    navigate('/login')
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-transparent">
      {showSuccess && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
          role="dialog"
          aria-modal="true"
          aria-live="polite"
          aria-label="Registration success"
        >
          <div className="rounded-xl bg-brand-success text-white shadow-2xl max-w-sm w-full p-6 text-center">
            <div className="flex justify-center mb-3" aria-hidden>
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-2xl">✓</span>
            </div>
            <p className="text-lg font-semibold">You have successfully registered.</p>
            <p className="mt-1 text-sm text-white/90">You can now log in with your account.</p>
            <button
              type="button"
              onClick={handleSuccessDismiss}
              className="mt-5 w-full rounded-lg bg-white/20 px-4 py-2.5 font-medium text-white hover:bg-white/30 transition"
            >
              Continue to login
            </button>
          </div>
        </div>
      )}
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
              <div
                className="mb-5 rounded-xl border-2 border-diamond-border bg-diamond-surface px-4 py-4 text-base text-diamond shadow-sm"
                role="note"
              >
                <p className="font-semibold text-diamond mb-1">Note</p>
                <p className="text-diamond-muted">
                  OTP email verification is not configured. You can use the demo customer account to log in: <span className="font-semibold text-diamond">customer@gmail.com</span> / <span className="font-semibold text-diamond">customer123</span>.
                </p>
              </div>
              {step === 'form' ? (
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
                    <p className="mt-1 text-xs text-diamond-muted">We’ll send a 6-digit OTP to this address (e.g. your Gmail) to verify.</p>
                    <input
                      id="reg-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-2 w-full rounded-lg border border-diamond-border bg-diamond-surface px-4 py-3 text-diamond placeholder-diamond-muted transition focus:border-crimson focus:outline-none focus:ring-2 focus:ring-crimson/20 min-h-[48px]"
                      placeholder="you@gmail.com"
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
                    disabled={otpSending}
                    className="w-full rounded-lg bg-crimson px-4 py-3.5 font-semibold text-white shadow-md shadow-crimson/25 transition hover:bg-crimson-light focus:outline-none focus:ring-2 focus:ring-crimson focus:ring-offset-2 focus:ring-offset-diamond-bg active:bg-crimson-dark disabled:opacity-60"
                  >
                    {otpSending ? 'Sending OTP…' : 'Register & send OTP'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleOtpSubmit} className="space-y-5">
                  {error && (
                    <div
                      className="rounded-lg bg-crimson/10 px-4 py-3 text-sm font-medium text-crimson ring-1 ring-crimson/30"
                      role="alert"
                    >
                      {error}
                    </div>
                  )}
                  <p className="text-sm text-diamond-muted">
                    We sent a 6-digit verification code to <strong className="text-diamond">{pendingRegistration?.email}</strong>. Check your inbox (and spam if using Gmail), then enter the code below to complete registration.
                  </p>
                  <div>
                    <label
                      htmlFor="reg-otp"
                      className="block text-sm font-semibold text-diamond"
                    >
                      Verification code
                    </label>
                    <input
                      id="reg-otp"
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="000000"
                      maxLength={6}
                      className="mt-2 w-full rounded-lg border border-diamond-border bg-diamond-surface px-4 py-3 text-diamond text-center text-lg tracking-[0.4em] placeholder-diamond-muted transition focus:border-crimson focus:outline-none focus:ring-2 focus:ring-crimson/20 min-h-[48px]"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleBackToForm}
                      className="flex-1 rounded-lg border border-diamond-border px-4 py-3 font-medium text-diamond-muted hover:bg-diamond-surface transition"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 rounded-lg bg-crimson px-4 py-3.5 font-semibold text-white shadow-md shadow-crimson/25 transition hover:bg-crimson-light focus:outline-none focus:ring-2 focus:ring-crimson focus:ring-offset-2 focus:ring-offset-diamond-bg"
                    >
                      Confirm & register
                    </button>
                  </div>
                </form>
              )}
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
