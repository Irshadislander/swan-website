export function persist(path: string, data: unknown) {
  try {
    const key = `swan:${path}`
    const existing = JSON.parse(localStorage.getItem(key) || '[]')
    if (Array.isArray(existing)) {
      existing.push({ ts: Date.now(), ...data })
      localStorage.setItem(key, JSON.stringify(existing))
    } else {
      localStorage.setItem(key, JSON.stringify([{ ts: Date.now(), ...data }]))
    }
  } catch {
    // swallow storage errors (private browsing, quotas, etc.)
  }
}
