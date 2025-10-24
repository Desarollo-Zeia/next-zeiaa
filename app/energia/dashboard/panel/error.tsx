// app/ocupacional/dashboard/analisis/estadisticas/error.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    // Log el error para debugging (opcional)
    console.error('Error capturado:', error);

    // Si es un error de autenticación, redirigir al login
    if (error.message.includes('403') || error.message.includes('Token inválido')) {
      // Limpiar token inválido
      localStorage.removeItem('token'); // o tu método de storage

      // Redirigir al login después de 2 segundos
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    }
  }, [error, router]);

  // Verificar si es error de autenticación
  const isAuthError = error.message.includes('403') ||
    error.message.includes('Token inválido');

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
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
            <button
              onClick={reset}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Intentar nuevamente
            </button>
          </>
        )}
      </div>
    </div>
  );
}