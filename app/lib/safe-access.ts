// Utility functions for safe data access

export function safeArrayAccess<T>(array: T[] | undefined, index: number): T | undefined {
  return array && array.length > index ? array[index] : undefined
}

export function safeFirstItem<T>(array: T[] | undefined): T | undefined {
  return safeArrayAccess(array, 0)
}

export function safePropertyAccess<T, K extends keyof T>(
  obj: T | undefined,
  key: K
): T[K] | undefined {
  return obj?.[key]
}

export function safeStringAccess(
  obj: any,
  path: string,
  fallback: string = ''
): string {
  try {
    const result = path.split('.').reduce((current, key) => current?.[key], obj)
    return result?.toString() || fallback
  } catch {
    return fallback
  }
}

// Specific helpers for common patterns
export function getFirstHeadquarter(results: any[], fallback?: string): string {
  return safeStringAccess(safeFirstItem(results), 'id', fallback || '')
}

export function getFirstPanel(results: any[], fallback?: string): string {
  return safeStringAccess(safeFirstItem(results?.results), 'id', fallback || '')
}

export function getFirstMeasurementPoint(results: any[], fallback?: string): string {
  const firstResult = safeFirstItem(results?.results)
  const firstPoint = safeFirstItem(firstResult?.measurement_points)
  return safeStringAccess(firstPoint, 'id', fallback || '')
}