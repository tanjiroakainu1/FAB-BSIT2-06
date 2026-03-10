import { useState, useRef } from 'react'
import { PageContainer } from '@shared/components'
import { useAppData } from '@shared/context'

export default function AdminPaymentInstruction() {
  const { paymentInstruction, setPaymentInstruction } = useAppData()
  const [pendingImage, setPendingImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const displayImage = pendingImage ?? paymentInstruction

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = () => {
      setPendingImage(reader.result as string)
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const handleSave = () => {
    if (!displayImage) return
    setPaymentInstruction(displayImage)
    setPendingImage(null)
  }

  const handleDownload = () => {
    if (!displayImage) return
    const link = document.createElement('a')
    link.href = displayImage
    link.download = 'gcash-payment-instruction.png'
    link.click()
  }

  return (
    <PageContainer className="pb-12">
      <div className="mb-6 flex items-baseline gap-3">
        <h1 className="text-2xl font-bold text-diamond sm:text-3xl">GCash payment instruction</h1>
        <span className="h-px flex-1 max-w-[60px] bg-gradient-to-r from-crimson/60 to-transparent" aria-hidden />
      </div>
      <p className="mt-2 text-diamond-muted">
        Upload an image that shows customers how to pay via GCash. This image is shown to all customers on their order history page (next to pending orders) so they can view the payment steps and submit their receipt.
      </p>

      <div className="card-diamond mt-6 rounded-xl p-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-0">
            <label className="block text-sm font-semibold text-diamond mb-2">Choose file (image)</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-diamond-muted file:mr-4 file:rounded-lg file:border-0 file:bg-crimson file:px-4 file:py-2 file:text-sm file:font-medium file:text-white file:hover:bg-crimson-light"
              aria-label="Choose image for GCash payment instruction"
            />
          </div>
          <div className="flex items-end">
            <button
              type="button"
              onClick={handleSave}
              disabled={!displayImage}
              className="rounded-lg bg-crimson px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-crimson/25 transition hover:bg-crimson-light focus:outline-none focus:ring-2 focus:ring-crimson focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save
            </button>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-sm font-semibold text-diamond mb-2">Preview (default image shown to customers)</p>
          {displayImage ? (
            <div className="rounded-lg border border-diamond-border overflow-hidden max-w-lg bg-diamond-card">
              <img
                src={displayImage}
                alt="GCash payment instruction"
                className="w-full h-auto max-h-[400px] object-contain"
              />
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownload}
                  className="rounded-lg border border-diamond-border bg-diamond-surface px-3 py-2 text-sm font-medium text-diamond hover:bg-diamond-card transition focus:outline-none focus:ring-2 focus:ring-crimson/20"
                >
                  Save image (download)
                </button>
                {pendingImage && (
                  <p className="text-xs text-crimson font-medium">New image selected. Click Save to apply.</p>
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-diamond-border bg-diamond-surface p-8 text-center text-diamond-muted text-sm">
              No image set. Choose a file above, then click Save to set the default GCash payment instruction picture.
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  )
}
