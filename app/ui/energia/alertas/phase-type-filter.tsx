"use client"

import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { useTransition } from "react"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const PHASES = [
  { value: "all", label: "Todas las fases" },
  { value: "A", label: "Fase A" },
  { value: "B", label: "Fase B" },
  { value: "C", label: "Fase C" },
  { value: "AB", label: "Fase AB" },
  { value: "BC", label: "Fase BC" },
  { value: "AC", label: "Fase AC" },
]

export default function PhaseTypeFilter() {
  const [isPending, startTransition] = useTransition()
  const searchParams = useSearchParams()
  const { replace } = useRouter()
  const pathname = usePathname()

  const currentPhase = searchParams.get("phase_type") ?? "all"

  const handlePhaseChange = (phase: string) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams)
      if (phase === "all") {
        params.delete("phase_type")
      } else {
        params.set("phase_type", phase)
      }
      params.set("page", "1")
      replace(`${pathname}?${params.toString()}`, { scroll: false })
    })
  }

  return (
    <div className="relative">
      <Select value={currentPhase} onValueChange={handlePhaseChange} disabled={isPending}>
        <SelectTrigger className="w-[200px] bg-[#00b0c7] text-white">
          <SelectValue placeholder="Seleccionar fase" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {PHASES.map((phase) => (
              <SelectItem key={phase.value} value={phase.value}>
                {phase.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {isPending && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50 rounded-md">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#00b0c7]"></div>
        </div>
      )}
    </div>
  )
}
