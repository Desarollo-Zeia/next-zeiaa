import { FileX2 } from 'lucide-react'
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface NoResultsFoundProps {
  message?: string
  suggestion?: string
  actionText?: string
  actionHref?: string
}

export default function NoResultsFound({
  message = "No se encontraron resultados",
  suggestion = "Intenta ajustar tus filtros o realiza una nueva búsqueda.",
  actionText = "Volver al inicio",
  actionHref = "/",
}: NoResultsFoundProps) {
  return (
    <div className="w-full flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
      <FileX2 className="w-16 h-16 text-gray-400 mb-4" />
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{message}</h2>
      <p className="text-gray-600 mb-6 max-w-md">{suggestion}</p>
      <Button asChild>
        <Link href={actionHref}>{actionText}</Link>
      </Button>
    </div>
  )
}