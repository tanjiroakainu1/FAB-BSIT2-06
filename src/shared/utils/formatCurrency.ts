/** Format amount as Philippine Peso (PHP). */
export function formatPrice(amount: number): string {
  return `₱${amount.toFixed(2)}`
}
