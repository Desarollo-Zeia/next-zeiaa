"use client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSearchParams, usePathname, useRouter } from "next/navigation"
import { useTransition } from "react"

const ELECTRIC_UNITS = ["V", "A", "KW", "KVar", "KVA", "-", "Hz", "KWh", "%", "KVarh"]

// Mapeo de abreviaturas a nombres completos en español
const UNIT_NAMES: Record<string, string> = {
  V: "Voltios",
  A: "Amperios",
  KW: "Kilowatts",
  KVar: "Kilovoltio-Amperio Reactivo",
  KVA: "Kilovoltio-Amperio",
  "-": "Sin unidad",
  Hz: "Hertz",
  KWh: "Kilowatt-hora",
  "%": "Porcentaje",
  KVarh: "Kilovoltio-Amperio Reactivo hora",
}

export default function ElectricUnitFilter({ defaultUnit = "V" }: { defaultUnit?: string }) {
  const [isPending, startTransition] = useTransition()
  const searchParams = useSearchParams()
  const currentUnit = searchParams.get("unit") as string
  const pathname = usePathname()
  const { replace } = useRouter()

  const handleUnitChange = (unit: string) => {
    startTransition(() => {
      const newParams = new URLSearchParams(searchParams)

      if (unit && unit !== "none") {
        newParams.set("unit", unit)
      }

      if (unit === "none") {
        newParams.delete("unit")
      }

      replace(`${pathname}?${newParams.toString()}`, { scroll: false })
    })
  }

  // Formatear la unidad para mostrar tanto la abreviatura como el nombre completo
  const formatUnitDisplay = (unit: string) => {
    if (unit && UNIT_NAMES[unit]) {
      return `${unit} (${UNIT_NAMES[unit]})`
    }
    return unit
  }

  return (
    <div className="relative">
      <Select onValueChange={handleUnitChange} value={currentUnit ? currentUnit : defaultUnit} disabled={isPending}>
        <SelectTrigger className="w-[240px] bg-[#00b0c7]">
          <SelectValue placeholder={isPending ? "Cargando..." : "Seleccionar unidad"} className="text-white font-bold">
            {currentUnit && formatUnitDisplay(currentUnit)}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">Sin unidad</SelectItem>
          {ELECTRIC_UNITS.map((unit) => (
            <SelectItem key={unit} value={unit}>
              {formatUnitDisplay(unit)}
            </SelectItem>
          ))}
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

