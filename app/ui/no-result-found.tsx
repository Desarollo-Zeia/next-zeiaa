import { FileX2 } from "lucide-react"

export default function NoResultFound() {
  return (  
    <div className="text-center p-24 rounded-lg h-full">
      <FileX2 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
      <h2 className="text-lg font-semibold mb-2">No se encontraron resultados</h2>
      <p className="text-gray-600 mb-4">Intenta ajustar tu búsqueda o cambiar los parámetros</p>
    </div>
  )
}
