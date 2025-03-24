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

// Transformar los datos del JSON al formato esperado por el gráfico

// Convertir los datos al formato esperado por el gráfico

const CustomTooltip = ({ active, payload, label }: any) => {  // eslint-disable-line @typescript-eslint/no-explicit-any
  // eslint-disable-line @typescript-eslint/no-explicit-any
  
  if (active && payload && payload.length) {  

    return (
      <div className="bg-white p-3 border rounded-lg shadow-sm">
        <p className="text-sm font-medium mb-2">{formatTime(label)}</p>
        <div className="flex items-center gap-2 text-xs">
          <span className="w-2 h-2 rounded-full bg-[#0ea5e9]" />
          <span>Potencia actual:</span>
          <span className="font-medium">{payload[0].value} kW</span>
        </div>
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

      if (group === 'none') {
        newParams.delete('group_by');
      }

      replace(`${pathname}?${newParams.toString()}`, { scroll: false });
    });
  };




  const chartData = readings?.map((item) => ({
    time: item.created_at,
    power: item.values_per_channel[0]?.power || 0,
  }))
 // Revertimos el array para mostrar los datos en orden cronológico
  // Encontrar el valor máximo para el dominio del eje Y
  return (
    <div className="flex-1 p-6">
      <div className="flex justify-end">
        <ToggleGroup type="single" className="relative" onValueChange={handleGroupChange} defaultValue="day">
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
              tickFormatter={(date) => group === 'hour' ?  format(new Date(date), 'HH:mm') : format(new Date(date), 'dd/MMM')}
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

