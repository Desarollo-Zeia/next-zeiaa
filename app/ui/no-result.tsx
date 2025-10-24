import { MessageSquareX } from 'lucide-react';

interface NoResultsFoundProps {
  message?: string
  suggestion?: string
  actionText?: string
  actionHref?: string
}

export default function NoResultsFound({
  message = "No se encontraron resultados",
  suggestion = "Intenta ajustar tus filtros o realiza una nueva búsqueda.",
  // actionText = "Volver al inicio",
  // actionHref = "/",
}: NoResultsFoundProps) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center min-h-auto text-center px-4">
      <MessageSquareX className="w-12 h-12 text-gray-400 mb-4" />
      <h2 className="text-lg font-semibold text-gray-900 mb-2">{message}</h2>
      <p className="text-gray-600 mb-6 max-w-md">{suggestion}</p>
    </div>
  )
}