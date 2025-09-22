"use client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSearchParams, usePathname, useRouter } from "next/navigation"
import { useTransition } from "react"

const ELECTRIC_CATEGORYS = ["power", "energy", "current", "voltage"]
// Mapeo de abreviaturas a nombres completos en español
const ELECTRIC_NAMES: Record<string, string> = {
  power: "Potencia",
  energy: "Energía",
  current: "Corriente",
  voltage: "Voltaje",
}

export default function ElectricUnitFilter({ category = "power" }: { category?: string }) {
  const [isPending, startTransition] = useTransition()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  const handleUnitChange = (category: string) => {
    startTransition(() => {
      const newParams = new URLSearchParams(searchParams)


      if (category === 'energy') {
        newParams.set("last_by", 'hour')
      } else {
        newParams.delete("last_by")
      }

      if (category && category !== "none") {
        newParams.set("category", category)
        newParams.set("page", '1')
      }

      if (category === "none") {
        newParams.delete("category")
      }

      replace(`${pathname}?${newParams.toString()}`, { scroll: false })
    })
  }

  return (
    <div className="relative">
      <Select onValueChange={handleUnitChange} defaultValue={category.toString()}>
        <SelectTrigger className="w-[240px] bg-[#00b0c7]">
          <SelectValue placeholder={"Seleccionar unidad"} className="text-white font-bold" />
        </SelectTrigger>
        <SelectContent>
          {ELECTRIC_CATEGORYS.map((category) => (
            <SelectItem key={category} value={category}>
              {ELECTRIC_NAMES[category]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {isPending && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50 w-[240px]">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
        </div>
      )}
    </div>
  )
}

