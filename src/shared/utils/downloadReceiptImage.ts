import html2canvas from 'html2canvas'

/**
 * Capture an element (receipt container) as PNG and trigger download.
 * @param element - DOM element that contains the receipt (e.g. div with receipt-print-area)
 * @param filename - Suggested filename without extension (e.g. "receipt-order-a1b2c3d4")
 */
export async function downloadReceiptAsImage(element: HTMLElement, filename: string): Promise<void> {
  const canvas = await html2canvas(element, {
    backgroundColor: '#ffffff',
    scale: 2,
    useCORS: true,
    logging: false,
  })
  canvas.toBlob((blob) => {
    if (!blob) return
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${filename}.png`
    a.click()
    URL.revokeObjectURL(url)
  }, 'image/png')
}
