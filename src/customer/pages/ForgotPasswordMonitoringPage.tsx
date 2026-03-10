import { useState, useRef } from 'react'
import { PageContainer } from '@shared/components'
import { useAuth } from '@shared/context'

const MAX_PROOF_SIZE_BYTES = 2 * 1024 * 1024 // 2MB

export default function ForgotPasswordMonitoringPage() {
  const { submitProofAndGetStatus, getRequestsByEmail, setPasswordAfterApproval } = useAuth()
  const [monitorEmail, setMonitorEmail] = useState('')
  const [monitorError, setMonitorError] = useState<string | null>(null)
  const [monitorSuccess, setMonitorSuccess] = useState(false)
  const [checkedEmail, setCheckedEmail] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [changePasswordOpen, setChangePasswordOpen] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [changePasswordError, setChangePasswordError] = useState<string | null>(null)
  const [changePasswordSuccess, setChangePasswordSuccess] = useState(false)

  const requestsForEmail = checkedEmail ? getRequestsByEmail(checkedEmail) : []
  const hasApproved = requestsForEmail.some((r) => r.status === 'approved')

  const handleMonitorSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setMonitorError(null)
    setMonitorSuccess(false)
    const email = monitorEmail.trim()
    if (!email) {
      setMonitorError('Please enter your email address.')
      return
    }
    const file = fileInputRef.current?.files?.[0]
    if (file) {
      if (file.size > MAX_PROOF_SIZE_BYTES) {
        setMonitorError('File is too large. Maximum size is 2MB.')
        return
      }
      const reader = new FileReader()
      reader.onload = async () => {
        const dataUrl = reader.result as string
        const res = await submitProofAndGetStatus(email, dataUrl, file.name)
        if (res.ok) {
          setMonitorSuccess(true)
          setCheckedEmail(email.toLowerCase())
          if (fileInputRef.current) fileInputRef.current.value = ''
        } else {
          setMonitorError(res.error ?? 'Something went wrong.')
        }
      }
      reader.onerror = () => setMonitorError('Failed to read the file.')
      reader.readAsDataURL(file)
    } else {
      setCheckedEmail(email.toLowerCase())
      setMonitorSuccess(true)
    }
  }

  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setChangePasswordError(null)
    if (!checkedEmail) return
    const res = await setPasswordAfterApproval(checkedEmail, newPassword)
    if (res.ok) {
      setChangePasswordSuccess(true)
      setNewPassword('')
      setChangePasswordOpen(false)
    } else {
      setChangePasswordError(res.error ?? 'Failed to change password.')
    }
  }

  return (
    <PageContainer className="pb-12">
      <section className="max-w-xl mx-auto">
        <h1 className="text-2xl font-bold text-diamond sm:text-3xl">Forgot password monitoring</h1>
        <p className="mt-2 text-diamond-muted">
          Enter your email to check status. You can optionally submit a proof of ownership (e.g. photo of ID) to attach to a request.
        </p>
        <div className="card-diamond mt-6 rounded-xl p-6 sm:p-8">
          <form onSubmit={handleMonitorSubmit} className="space-y-4">
            <div>
              <label htmlFor="monitor-email" className="block text-sm font-medium text-diamond mb-1">
                Email address
              </label>
              <input
                id="monitor-email"
                type="email"
                value={monitorEmail}
                onChange={(e) => {
                  setMonitorEmail(e.target.value)
                  setMonitorError(null)
                  setCheckedEmail(null)
                }}
                placeholder="your@email.com"
                className="w-full rounded-lg border border-diamond-border bg-diamond-surface px-3 py-2 text-diamond placeholder:text-diamond-muted focus:border-crimson focus:outline-none focus:ring-2 focus:ring-crimson/20"
              />
            </div>
            <div>
              <label htmlFor="monitor-proof" className="block text-sm font-medium text-diamond mb-1">
                Proof of ownership (optional — choose file)
              </label>
              <input
                id="monitor-proof"
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf"
                className="w-full text-sm text-diamond-muted file:mr-3 file:rounded-lg file:border-0 file:bg-crimson file:px-4 file:py-2 file:text-sm file:font-medium file:text-white file:hover:bg-crimson-light"
                onChange={() => setMonitorError(null)}
              />
            </div>
            {monitorError && (
              <p className="text-sm text-crimson" role="alert">
                {monitorError}
              </p>
            )}
            {monitorSuccess && (
              <p className="text-sm text-green-600">Proof submitted. See status below.</p>
            )}
            <button
              type="submit"
              className="rounded-lg bg-crimson px-5 py-2.5 font-semibold text-white shadow-md shadow-crimson/20 transition hover:bg-crimson-light"
            >
              Submit & check status
            </button>
          </form>
          {requestsForEmail.length > 0 && (
            <div className="mt-8">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <h2 className="text-lg font-semibold text-diamond">Requests for {checkedEmail}</h2>
                {hasApproved && (
                  <button
                    type="button"
                    onClick={() => {
                      setChangePasswordOpen(true)
                      setNewPassword('')
                      setChangePasswordError(null)
                      setChangePasswordSuccess(false)
                    }}
                    className="rounded-lg bg-crimson px-4 py-2 text-sm font-semibold text-white shadow-md shadow-crimson/20 transition hover:bg-crimson-light"
                  >
                    Change password
                  </button>
                )}
              </div>
              {changePasswordSuccess && (
                <p className="text-sm text-green-600 mb-2" role="alert">
                  Password changed successfully. You can now log in with your new password.
                </p>
              )}
              <div className="overflow-x-auto rounded-lg border border-diamond-border">
                <table className="min-w-[280px] w-full divide-y divide-diamond-border text-left">
                  <thead className="bg-diamond-surface">
                    <tr>
                      <th className="px-3 py-2 text-sm font-medium text-diamond-muted">Date</th>
                      <th className="px-3 py-2 text-sm font-medium text-diamond-muted">Status</th>
                      <th className="px-3 py-2 text-sm font-medium text-diamond-muted">Proof</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-diamond-border bg-diamond-card">
                    {requestsForEmail.map((r) => (
                      <tr key={r.id}>
                        <td className="px-3 py-2 text-sm text-diamond">
                          {new Date(r.createdAt).toLocaleString()}
                        </td>
                        <td className="px-3 py-2">
                          {r.status === 'pending' && (
                            <span className="text-amber-600 font-medium">Pending</span>
                          )}
                          {r.status === 'approved' && (
                            <span className="text-green-600 font-medium">Approved</span>
                          )}
                          {r.status === 'rejected' && (
                            <span className="text-diamond-muted font-medium">Rejected</span>
                          )}
                        </td>
                        <td className="px-3 py-2 text-sm text-diamond-muted">
                          {r.proofDataUrl ? 'Yes' : 'No'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {changePasswordOpen && checkedEmail && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
              onClick={() => setChangePasswordOpen(false)}
              role="dialog"
              aria-modal="true"
              aria-labelledby="change-password-title"
            >
              <div
                className="card-diamond w-full max-w-md rounded-xl p-6 shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 id="change-password-title" className="text-lg font-semibold text-diamond">
                  Change password
                </h2>
                <p className="mt-1 text-sm text-diamond-muted">
                  Your request was approved. Enter a new password for {checkedEmail}.
                </p>
                <form onSubmit={handleChangePasswordSubmit} className="mt-4 space-y-3">
                  {changePasswordError && (
                    <p className="text-sm text-crimson" role="alert">
                      {changePasswordError}
                    </p>
                  )}
                  <div>
                    <label htmlFor="new-password" className="block text-sm font-medium text-diamond mb-1">
                      New password
                    </label>
                    <input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value)
                        setChangePasswordError(null)
                      }}
                      placeholder="Min 4 characters"
                      className="w-full rounded-lg border border-diamond-border bg-diamond-surface px-3 py-2 text-diamond placeholder:text-diamond-muted focus:border-crimson focus:outline-none focus:ring-2 focus:ring-crimson/20"
                      minLength={4}
                      autoFocus
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={newPassword.length < 4}
                      className="rounded-lg bg-crimson px-4 py-2 font-medium text-white hover:bg-crimson-light disabled:opacity-50"
                    >
                      Set new password
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setChangePasswordOpen(false)
                        setChangePasswordError(null)
                      }}
                      className="rounded-lg border border-diamond-border px-4 py-2 font-medium text-diamond-muted hover:bg-diamond-surface"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </section>
    </PageContainer>
  )
}
