/**
 * Standalone app: no backend. All data is stored in localStorage.
 * This module exists so imports from @shared/api/client don't break.
 * useApi() is always false so contexts use localStorage only.
 */

export function getApiUrl(): string {
  return ''
}

export function useApi(): boolean {
  return false
}
