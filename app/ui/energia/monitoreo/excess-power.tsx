"use client"

import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import Link from "next/link"
import ContractedPowerSidebar from "./contracted-power-sidebar"

interface DeviceInfo {
  id: number
  dev_eui: string
  name: string
}

interface Indicator {
  id: number
  measurement_point_name: string
  power: number
  exceeded_thresholds: string[]
}

interface PowerExceedingEvent {
  created_at: string
  device: DeviceInfo
  indicators: Indicator[]
}

interface ExcessPowerData {
  count: number
  next: string | null
  previous: string | null
  results: PowerExceedingEvent[]
}

interface Panel {
  id: number
  name: string
  is_active: boolean
  type: "monofasico" // O bien: string, en caso de admitir otros tipos.
  threads: any[] | null  // eslint-disable-line @typescript-eslint/no-explicit-any
}

interface Powers {
  id: number
  power_installed: number
  power_contracted: number
  power_max: number
}

// Función para formatear la fecha y hora
const formatDateTime = (dateString: string) => {
  const date = new Date(dateString)

  // Formatear la fecha (ej: "Lunes 10 de marzo")
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    day: "numeric",
    month: "long",
  }
  const formattedDate = date.toLocaleDateString("es-ES", options)

  // Formatear la hora (ej: "11:58am")
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const ampm = hours >= 12 ? "pm" : "am"
  const formattedHours = hours % 12 || 12
  const formattedMinutes = minutes.toString().padStart(2, "0")
  const formattedTime = `${formattedHours}:${formattedMinutes}${ampm}`

  return { date: formattedDate, time: formattedTime }
}

export default function ExcessPower({ excessPowerData, panel, powers }: { excessPowerData: ExcessPowerData, panel: Panel[]; powers: Powers[] }) {

  const excessPowerEvents = excessPowerData.results.map((item) => {
    const { date, time } = formatDateTime(item.created_at)
    const power = item.indicators[0]?.power || 0
    const exceededThresholds = item.indicators[0]?.exceeded_thresholds || []
  
    return {
      date,
      time,
      power: `${power.toFixed(2)}kW`,
      status: exceededThresholds.length > 0 ? "Consumo excedente" : "Normal",
      thresholds: exceededThresholds.join(", "),
    }
  })


  return (
    <div className="w-full flex">
      <div>
        <ContractedPowerSidebar panel={panel} powers={powers}/>
      </div>
      <div className="p-4 space-y-4 flex-1">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-lg font-medium">Potencia excedente</h2>
            <p className="text-sm text-muted-foreground">Durante el período seleccionado en el filtro de fecha</p>
          </div>
          <Link href={"/energia/dashboard/monitoreo/potencia-excedente"}>
            <Button variant="secondary" size="sm" className="gap-2">
              <Eye className="w-4 h-4" />
              Ver Alerta
            </Button>
          </Link>
        </div>
        <div className="space-y-1">
          {excessPowerEvents.map((event, index) => (
            <div key={index} className="p-3 rounded-lg text-sm flex flex-wrap items-center gap-1 bg-sky-50/50">
              <span>
                El {event.date} a las {event.time} con{" "}
              </span>
              <span className="font-medium">{event.power}</span>
              <span>(</span>
              <span className="text-red-500">{event.status}</span>
              <span>)</span>
              
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

