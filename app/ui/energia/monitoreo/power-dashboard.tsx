"use client"

import { Button } from "@/components/ui/button"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import ExcessPower from "./excess-power"
import { Card } from "@/components/ui/card"

// Función para formatear la fecha a solo hora y minutos
const formatTime = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })
}

// Datos modificados con picos de potencia y valores en 0
const chartData = [
  {
    time: "2025-02-19T17:03:11.677283-05:00",
    power: 0,
  },
  {
    time: "2025-02-19T17:02:11.611909-05:00",
    power: 820,
  },
  {
    time: "2025-02-19T17:01:11.723821-05:00",
    power: 680,
  },
  {
    time: "2025-02-19T17:00:11.701413-05:00",
    power: 0,
  },
  {
    time: "2025-02-19T16:59:11.381985-05:00",
    power: 0,
  },
  {
    time: "2025-02-19T16:58:11.511805-05:00",
    power: 920,
  },
  {
    time: "2025-02-19T16:57:11.566406-05:00",
    power: 750,
  },
  {
    time: "2025-02-19T16:56:11.837776-05:00",
    power: 0,
  },
  {
    time: "2025-02-19T16:55:11.139006-05:00",
    power: 480,
  },
  {
    time: "2025-02-19T16:54:11.233592-05:00",
    power: 0,
  },
].reverse() // Revertimos el array para mostrar los datos en orden cronológico

const CustomTooltip = ({ active, payload, label }: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
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

export default function PowerUsageChart() {
  // Encontrar el valor máximo para el dominio del eje Y
  const maxValue = Math.max(...chartData.map((d) => d.power))
  const yDomain = [0, Math.ceil(maxValue / 100) * 100]

  return (
    <Card className="flex-1 p-6 shadow-md">
      <div className="flex justify-end gap-2 mb-6">
        <Button variant="outline" size="sm" className="text-sm">
          Por día
        </Button>
        <Button variant="outline" size="sm" className="text-sm">
          Por hora
        </Button>
      </div>

      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
              tickFormatter={formatTime}
              interval="preserveStartEnd"
            />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} domain={yDomain} tickCount={8} />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="step"
              dataKey="power"
              stroke="#0ea5e9"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 8 }}
              name="Potencia actual"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <ExcessPower />
    </Card>
  )
}

