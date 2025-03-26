"use client"

import { Bar, BarChart, CartesianGrid, Tooltip, XAxis } from "recharts"
import type { TooltipProps } from "recharts"
import { ChartContainer } from "@/components/ui/chart"

export interface CustomTooltipProps extends TooltipProps<any, any> { // eslint-disable-line @typescript-eslint/no-explicit-any
    active?: boolean
    payload?: any[] // eslint-disable-line @typescript-eslint/no-explicit-any
  }
  
  export function CustomTooltip({ active, payload }: CustomTooltipProps) {
    if (!active || !payload || payload.length === 0) {
      return null
    }
  
    // Extract data from the first payload item
    const data = payload[0].payload
  
    return (
      <div className="bg-white dark:bg-gray-800 p-3 border rounded-lg shadow-sm">
        <p className="text-sm font-medium mb-2">
          {data.date} - {data.timestamp}
        </p>
  
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 text-xs mb-1">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span>
              {entry.dataKey === "THDIa"
                ? "THDI Fase A"
                : entry.dataKey === "THDIb"
                  ? "THDI Fase B"
                  : entry.dataKey === "THDIc"
                    ? "THDI Fase C"
                    : entry.dataKey}
              :
            </span>
            <span className="font-medium">{entry.value} %</span>
          </div>
        ))}
      </div>
    )
  }

export default function TarifarioChart() {
  // Datos proporcionados en el JSON con timestamp añadido para el tooltip
  const data = [
    {
      date: "Monday 17 de February de 2025",
      consumption: 0.0,
      cost: 0.0,
      first_value: 3.57,
      last_value: 3.57,
      date_first_value: "2025-02-17 16:21",
      date_last_value: "2025-02-17 16:54",
      timestamp: "16:54", // Añadido para el tooltip
    },
    {
      date: "Wednesday 19 de February de 2025",
      consumption: 0.0,
      cost: 0.0,
      first_value: 3.57,
      last_value: 3.57,
      date_first_value: "2025-02-19 09:26",
      date_last_value: "2025-02-19 17:03",
      timestamp: "17:03", // Añadido para el tooltip
    },
    {
      date: "Friday 21 de February de 2025",
      consumption: 0.73,
      cost: 0.22,
      first_value: 3.57,
      last_value: 4.3,
      date_first_value: "2025-02-21 09:53",
      date_last_value: "2025-02-21 16:59",
      timestamp: "16:59", // Añadido para el tooltip
    },
    {
      date: "Monday 24 de February de 2025",
      consumption: -4.3,
      cost: 0.0,
      first_value: 4.3,
      last_value: 0,
      date_first_value: "2025-02-24 14:50",
      date_last_value: "2025-02-24 16:56",
      timestamp: "16:56", // Añadido para el tooltip
    },
  ]

  // Formatear las fechas para mostrar solo el día y mes
  const formattedData = data.map((item) => {
    const dateParts = item.date.split(" ")
    const shortDate = `${dateParts[0].substring(0, 3)} ${dateParts[1]}`
    return {
      ...item,
      shortDate,
    }
  })

  return (
    <div className="w-full p-6 bg-white rounded-lg shadow">
      <ChartContainer
        config={{
          cost: {
            label: "Costo",
            color: "hsl(var(--chart-1))",
          },
        }}
        className="min-h-[350px]"
      >
        <BarChart
          accessibilityLayer
          data={formattedData}
          margin={{
            top: 20,
            right: 20,
            left: 20,
            bottom: 20,
          }}
        >
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis dataKey="shortDate" tickLine={false} axisLine={false} tickMargin={10} />
          {/* <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            label={{ value: "Costo ($)", angle: -90, position: "insideLeft", offset: 0 }}
          /> */}
          {/* Usando el componente CustomTooltip externo */}
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="cost" fill="var(--color-cost)" radius={[4, 4, 0, 0]} name="Costo" />
        </BarChart>
      </ChartContainer>
    </div>
  )
}

