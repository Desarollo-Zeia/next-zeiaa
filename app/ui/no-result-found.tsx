import { FileX2 } from "lucide-react"

export default function NoResultFound() {
  return (  
    <div className="text-center p-8 rounded-lg bg-gray-50/50 shadow-sm border border-gray-100">
      <FileX2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <h2 className="text-lg font-semibold mb-2 text-gray-700">No se encontraron resultados</h2>
      <p className="text-gray-500 text-sm">Intenta ajustar tu búsqueda o cambiar los parámetros</p>
    </div>
  )
}
