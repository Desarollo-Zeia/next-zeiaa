import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { useTransition } from 'react'

export default function OrderingFilter() {
  const [isPending, startTransition] = useTransition()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()


  const handleTableOrdering = (ordering: string) => {
    startTransition(() => {
      const newParams = new URLSearchParams(searchParams)

      newParams.set('page', '1')

      if (ordering) {
        newParams.set('ordering', ordering)
      }

      if (ordering === 'none') {
        newParams.delete('ordering')
      }

      replace(`${pathname}?${newParams.toString()}`, { scroll: false })
    })
  }
  return (
    <div className="relative">
      <Select
        onValueChange={handleTableOrdering}
        disabled={isPending}
      >
        <SelectTrigger className="w-[240px] bg-[#00b0c7]">
          <SelectValue
            placeholder={isPending ? "Cargando..." : "Ordenar datos"}
            className="text-white font-bold"
          />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='none'>Indeterminado</SelectItem>
          <SelectItem value='ASC'>Ascendentemente </SelectItem>
          <SelectItem value='DESC'>Desacendentemente</SelectItem>
        </SelectContent>
      </Select>

      {isPending && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
        </div>
      )}
    </div>
  )
}
