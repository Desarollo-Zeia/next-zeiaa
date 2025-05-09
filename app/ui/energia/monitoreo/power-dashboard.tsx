"use client"

import { useTransition } from "react";
import { format } from "date-fns"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useSearchParams, usePathname, useRouter } from 'next/navigation';


interface DeviceInfo {
  id: number
  name: string
  dev_eui: string
}

interface MeasurementPoint {
  id: number
  measurement_point_name: string
  power: number
}

interface PowerReading {
  created_at: string
  device: DeviceInfo
  values_per_channel: MeasurementPoint[]
}

// Función para formatear la fecha a solo hora y minutos
const formatTime = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleTimeString("es-ES", { day: "2-digit", month: "long", hour: "2-digit", minute: "2-digit" })
}

function hoursToMinutes(horaStr : string) {
  // Separa las horas y los minutos
  const [horas, minutos] = horaStr.split(':').map(Number);
  // Calcula el total de minutos desde la medianoche (00:00)
  return horas * 60 + minutos;
}

// Transformar los datos del JSON al formato esperado por el gráfico

// Convertir los datos al formato esperado por el gráfico

const CustomTooltip = ({ active, payload, label }: any) => {  // eslint-disable-line @typescript-eslint/no-explicit-any
  // eslint-disable-line @typescript-eslint/no-explicit-any

  const date = new Date(label)
  const hour = date.getHours()
  const minute = date.getMinutes()

  const hourFormatted = hour.toString().padStart(2, "0")
  const minuteFormatted = minute.toString().padStart(2, "0")

  const current = `${hourFormatted}:${minuteFormatted}`

  const start = hoursToMinutes('18:00')
  const end = hoursToMinutes('23:00')
  const compared = hoursToMinutes(current)

  if (active && payload && payload.length) {  

    return (
      <div className="bg-white p-3 border rounded-lg shadow-sm">
        <p className="text-sm font-medium mb-2">{formatTime(label)}</p>
        <div className="flex items-center gap-2 text-xs">
          <span className="w-2 h-2 rounded-full bg-[#0ea5e9]" />
          <span>Potencia actual:</span>
          <span className="font-medium">{payload[0].value} kW</span>
        </div>
        {compared > start && compared < end && 
          <div className="flex items-center gap-2 text-xs">
            <div className="w-2 h-2 rounded-full bg-red-600"/>
            <span>Dentro de la hora punta</span>
          </div>
        }
      </div>
    )
  }
  return null
}

export default function PowerUsageChart({ readings, group } : { readings: PowerReading[], group?: string }) {

  const [isPending, startTransition] = useTransition()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  const handleGroupChange = (group: string) => {
    startTransition(() => {
      const newParams = new URLSearchParams(searchParams);
      
      newParams.set('group_by', 'day');

      if (group) {
        newParams.set('group_by', group);
      }

      if (group === 'hour') {
        newParams.delete('group_by');
      }

      replace(`${pathname}?${newParams.toString()}`, { scroll: false })
    })
  }

  const chartData = readings?.map((item) => ({
    time: item.created_at,
    power: item.values_per_channel[0]?.power?.toFixed(2) || 0,
  }))
  return (
    <div className="flex-1 p-6">
      <div className="flex justify-end">
        <ToggleGroup type="single" className="relative" onValueChange={handleGroupChange} defaultValue={group || 'hour'}>
          {isPending && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-md z-10">
              <span className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></span>
            </div>
          )}
          <ToggleGroupItem value="day" aria-label="day">
            <p>Día</p>
          </ToggleGroupItem>
          <ToggleGroupItem value="hour" aria-label="hour">
            <p>Hora</p>
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
              tickFormatter={(date) => group === 'day' ?  format(new Date(date), 'dd MMM') : format(new Date(date), 'HH:mm')}
              interval="preserveStartEnd"
            />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="step"
              dataKey="power"
              stroke="#00b0c7"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 8 }}
              name="Potencia actual"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

