import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
        <div className="mb-4">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Página no encontrada
        </h2>
        <p className="text-gray-600 mb-6">
          La página que buscas no existe.
        </p>
        <Link
          href="/"
          className="inline-block bg-[#00b0c7] text-white px-6 py-2 rounded-lg transition"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}
