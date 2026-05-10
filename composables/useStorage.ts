export const useStorage = () => {
  const isAvailable = (): boolean => {
    try {
      const k = '__storage_test__'
      localStorage.setItem(k, k)
      localStorage.removeItem(k)
      return true
    } catch {
      return false
    }
  }

  const get = (key: string): string | null => {
    if (!isAvailable()) return null
    try { return localStorage.getItem(key) } catch { return null }
  }

  const set = (key: string, value: string): boolean => {
    if (!isAvailable()) return false
    try { localStorage.setItem(key, value); return true } catch { return false }
  }

  const remove = (key: string): boolean => {
    if (!isAvailable()) return false
    try { localStorage.removeItem(key); return true } catch { return false }
  }

  return { get, set, remove }
}
