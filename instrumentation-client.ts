/**
 * PostHog Analytics - Carga diferida para mejor rendimiento
 * 
 * Se inicializa después de que la página esté completamente cargada
 * para no bloquear el bundle inicial ni la hidratación.
 * 
 * Impacto: ~50-80KB menos en el bundle inicial
 */

// Función para inicializar PostHog de forma diferida
async function initPostHog() {
  // Solo inicializar si las variables de entorno existen
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    return
  }

  // Importar PostHog dinámicamente
  const posthog = (await import('posthog-js')).default

  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    // Capturar pageviews automáticamente
    capture_pageview: true,
  })
}

// Inicializar cuando la página esté completamente cargada
function scheduleInit() {
  // Usar requestIdleCallback si está disponible para cargar en tiempo idle
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(() => {
      initPostHog()
    }, { timeout: 3000 }) // Timeout de 3 segundos máximo
  } else {
    // Fallback: cargar después de un pequeño delay
    setTimeout(initPostHog, 100)
  }
}

// Solo ejecutar en el cliente
if (typeof window !== 'undefined') {
  if (document.readyState === 'complete') {
    scheduleInit()
  } else {
    window.addEventListener('load', scheduleInit)
  }
}
