"use client"

import { Bar, BarChart, CartesianGrid, Tooltip, XAxis } from "recharts"
import type { TooltipProps } from "recharts"
import { ChartContainer } from "@/components/ui/chart"
import NoResultFound from "../../no-result-found"

export interface CustomTooltipProps extends TooltipProps<any, any> { // eslint-disable-line @typescript-eslint/no-explicit-any
    active?: boolean
    payload?: any[] // eslint-disable-line @typescript-eslint/no-explicit-any
  }

  interface DataPoint {
    date: string;
    consumption: number;
    cost: number;
    first_value: number;
    last_value: number;
    date_first_value: string;
    date_last_value: string;
    timestamp: string;
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

export default function TarifarioChart({ data } : { data: DataPoint[]}) {

  // Formatear las fechas para mostrar solo el día y mes
  const formattedData = data?.map((item) => {
    const dateParts = item.date.split(" ")
    const shortDate = `${dateParts[0].substring(0, 3)} ${dateParts[1]}`
    return {
      ...item,
      shortDate,
    }
  })

  return (
    <div className="w-full p-6 bg-white rounded-lg">
      {
        data.length > 0 ? 
        (
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
        ) : 
        (
          <NoResultFound/>
        )
      }
  
    </div>
  )
}

