import { useState } from 'react'
import { PageContainer } from '@shared/components'
import { useAuth, type ForgotPasswordRequest } from '@shared/context'

export default function AdminForgotPasswordRequests() {
  const { forgotPasswordRequests, approveForgotPasswordRequest, rejectForgotPasswordRequest } = useAuth()
  const [viewingProof, setViewingProof] = useState<ForgotPasswordRequest | null>(null)

  const pending = forgotPasswordRequests.filter((r) => r.status === 'pending')
  const resolved = forgotPasswordRequests.filter((r) => r.status !== 'pending')

  const handleApprove = (id: string) => {
    approveForgotPasswordRequest(id)
  }

  const handleReject = (id: string) => {
    if (window.confirm('Reject this password reset request?')) rejectForgotPasswordRequest(id)
  }

  const formatDate = (iso: string) => new Date(iso).toLocaleString()

  return (
    <PageContainer>
      <h1 className="text-2xl font-bold text-diamond">Forgot password requests</h1>
      <p className="mt-2 text-diamond-muted">
        Approve or reject password reset requests. The user will set their new password on the Forgot password monitoring page after approval.
      </p>

      <div className="card-diamond mt-6 overflow-hidden rounded-xl">
        {forgotPasswordRequests.length === 0 ? (
          <div className="p-8 text-center text-diamond-muted">
            No forgot password requests yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[400px] w-full divide-y divide-diamond-border">
              <thead className="bg-diamond-surface">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-diamond-muted">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-diamond-muted">Requested</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-diamond-muted">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-diamond-muted">Proof</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-diamond-muted">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-diamond-border bg-diamond-card">
                {[...pending, ...resolved].map((req) => (
                  <tr key={req.id}>
                    <td className="px-4 py-3 text-diamond font-medium">{req.email}</td>
                    <td className="px-4 py-3 text-sm text-diamond-muted">{formatDate(req.createdAt)}</td>
                    <td className="px-4 py-3">
                      {req.status === 'pending' && (
                        <span className="inline-flex rounded-md bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">Pending</span>
                      )}
                      {req.status === 'approved' && (
                        <span className="inline-flex rounded-md bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">Approved</span>
                      )}
                      {req.status === 'rejected' && (
                        <span className="inline-flex rounded-md bg-diamond-surface border border-diamond-border px-2 py-0.5 text-xs font-medium text-diamond-muted">Rejected</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {req.proofDataUrl ? (
                        <button
                          type="button"
                          onClick={() => setViewingProof(req)}
                          className="rounded bg-crimson/10 px-2 py-1 text-xs font-medium text-crimson hover:bg-crimson/20"
                        >
                          View photo
                        </button>
                      ) : (
                        <span className="text-diamond-muted text-xs">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {req.status === 'pending' && (
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleApprove(req.id)}
                            className="rounded bg-crimson px-3 py-1.5 text-xs font-medium text-white hover:bg-crimson-light"
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => handleReject(req.id)}
                            className="rounded border border-diamond-border px-3 py-1.5 text-xs font-medium text-diamond-muted hover:bg-diamond-surface"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {viewingProof && viewingProof.proofDataUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setViewingProof(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="proof-title"
        >
          <div
            className="bg-diamond-card border border-diamond-border rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="proof-title" className="text-lg font-semibold text-diamond px-4 py-3 border-b border-diamond-border">
              Proof of ownership {viewingProof.proofFileName ? `— ${viewingProof.proofFileName}` : ''}
            </h2>
            <div className="p-4 overflow-auto flex-1 flex items-center justify-center min-h-0">
              {viewingProof.proofDataUrl.startsWith('data:image/') ? (
                <img
                  src={viewingProof.proofDataUrl}
                  alt="Proof of ownership"
                  className="max-w-full max-h-[70vh] object-contain rounded-lg"
                />
              ) : (
                <div className="w-full">
                  <p className="text-sm text-diamond-muted mb-2">File type: document</p>
                  <a
                    href={viewingProof.proofDataUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-crimson underline"
                  >
                    Open proof file in new tab
                  </a>
                </div>
              )}
            </div>
            <div className="px-4 py-3 border-t border-diamond-border">
              <button
                type="button"
                onClick={() => setViewingProof(null)}
                className="rounded-lg border border-diamond-border px-4 py-2 font-medium text-diamond-muted hover:bg-diamond-surface"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  )
}
