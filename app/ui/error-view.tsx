'use client'

import { useEffect } from 'react'

interface ErrorViewProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorView({ error, reset }: ErrorViewProps) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Ups!</h1>
        <h2 className="text-lg text-gray-600 mb-6">Algo pasó por aquí y lo estamos revisando</h2>
        <p className="text-sm text-gray-500 mb-6">Recarga la página para continuar</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-[#00b0c7] text-white px-6 py-2 rounded-lg hover:opacity-90 transition"
        >
          Recargar
        </button>
      </div>
    </div>
  )
}
