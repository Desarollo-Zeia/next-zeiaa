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
  obj: Record<string, unknown>,
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
export function getFirstHeadquarter(results: Array<{id: string | number}>, fallback?: string): string {
  const first = safeFirstItem(results)
  return first?.id?.toString() || fallback || ''
}

export function getFirstPanel(results: {results?: Array<{id: string | number}>}, fallback?: string): string {
  const first = safeFirstItem(results?.results)
  return first?.id?.toString() || fallback || ''
}

export function getFirstMeasurementPoint(results: {results?: Array<{measurement_points?: Array<{id: string | number}>}>}, fallback?: string): string {
  const firstResult = safeFirstItem(results?.results)
  const firstPoint = safeFirstItem(firstResult?.measurement_points)
  return firstPoint?.id?.toString() || fallback || ''
}