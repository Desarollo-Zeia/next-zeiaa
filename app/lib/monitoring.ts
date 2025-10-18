// Client-side error monitoring
export function setupErrorMonitoring() {
  if (typeof window === 'undefined') return

  // Global error handler
  window.addEventListener('error', (event) => {
    console.error('Global error:', event.error)
    
    if (window.posthog) {
      window.posthog.capture('javascript_error', {
        message: event.error?.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack,
      })
    }
  })

  // Unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason)
    
    if (window.posthog) {
      window.posthog.capture('unhandled_promise_rejection', {
        reason: event.reason?.toString(),
        stack: event.reason?.stack,
      })
    }
  })

  // React Error Boundary fallback
  window.addEventListener('react-error-boundary', (event: CustomEvent) => {
    console.error('React Error Boundary:', event.detail)
    
    if (window.posthog) {
      window.posthog.capture('react_error_boundary', {
        error: event.detail.error?.message,
        componentStack: event.detail.errorInfo?.componentStack,
      })
    }
  })
}

// Performance monitoring
export function measurePerformance(name: string, fn: () => void | Promise<void>) {
  const start = performance.now()
  
  const result = fn()
  
  if (result instanceof Promise) {
    return result.finally(() => {
      const duration = performance.now() - start
      console.log(`Performance [${name}]: ${duration.toFixed(2)}ms`)
      
      if (window.posthog) {
        window.posthog.capture('performance_measure', {
          name,
          duration,
        })
      }
    })
  } else {
    const duration = performance.now() - start
    console.log(`Performance [${name}]: ${duration.toFixed(2)}ms`)
    
    if (window.posthog) {
      window.posthog.capture('performance_measure', {
        name,
        duration,
      })
    }
    
    return result
  }
}