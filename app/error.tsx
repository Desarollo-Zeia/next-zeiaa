'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    console.error('Error capturado en app root:', {
      message: error.message,
      digest: error.digest,
      stack: error.stack,
      pathname,
    })
  }, [error, pathname])

  const isAuthError = error.message.includes('403') || 
    error.message.includes('Token') || 
    error.message.includes('401') ||
    error.message.includes('Unauthorized')

  const is404Error = error.message.includes('404') ||
    error.message.includes('Not Found')

  useEffect(() => {
    if (isAuthError) {
      const token = localStorage.getItem('token')
      if (token) {
        localStorage.removeItem('token')
      }
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    }
  }, [isAuthError, router])

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
        {isAuthError ? (
          <>
            <div className="mb-4">
              <svg className="mx-auto h-12 w-12 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Sesión Expirada
            </h2>
            <p className="text-gray-600 mb-6">
              Tu sesión ha expirado. Serás redirigido al inicio de sesión...
            </p>
          </>
        ) : is404Error ? (
          <>
            <div className="mb-4">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Página no encontrada
            </h2>
            <p className="text-gray-600 mb-6">
              La página que buscas no existe o no tienes acceso.
            </p>
            <button
              onClick={() => router.push('/')}
              className="bg-[#00b0c7] text-white px-6 py-2 rounded-lg transition"
            >
              Volver al inicio
            </button>
          </>
        ) : (
          <>
            <div className="mb-4">
              <svg className="mx-auto h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Algo salió mal
            </h2>
            <p className="text-gray-600 mb-6">
              Ha ocurrido un error inesperado. Por favor, intenta nuevamente.
            </p>
            <div className="space-y-3">
              <button
                onClick={reset}
                className="bg-[#00b0c7] text-white px-6 py-2 rounded-lg transition w-full"
              >
                Intentar nuevamente
              </button>
              <button
                onClick={() => router.push(pathname)}
                className="text-[#00b0c7] px-6 py-2 rounded-lg transition w-full text-sm"
              >
                Recargar página
              </button>
            </div>
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-4 p-3 bg-red-50 rounded text-left text-xs text-red-600 overflow-auto max-h-32">
                <p className="font-bold">Error:</p>
                <p>{error.message}</p>
                {error.digest && (
                  <p className="mt-2">Digest: {error.digest}</p>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
