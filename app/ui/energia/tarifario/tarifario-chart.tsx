"use client"

import { Bar, BarChart, CartesianGrid, Tooltip, XAxis } from "recharts"
import type { TooltipProps } from "recharts"
import { ChartContainer } from "@/components/ui/chart"
import NoResultFound from "../../no-result-found"

const dateFormatWithHour = (dateStr: string) => {
  const date = new Date(dateStr);
  const formattedDate = date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }).replace('.', '');
  // Formatear la hora
  const finalOutput = `${formattedDate}`

  return finalOutput
}

const dateFormatWithDay = (dateStr: string) => {
  const date = new Date(dateStr);

// Opciones para formatear la fecha
const formattedDate = date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }).replace('.', '')

return formattedDate
}

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
          {data.formattedTooltip}
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
            <span className="font-medium">S/ {entry.value}</span>
          </div>
        ))}
      </div>
    )
  }

export default function TarifarioChart({ data, group_by } : { data: DataPoint[], group_by: string}) {

  // Formatear las fechas para mostrar solo el día y mes
  const formattedData = data?.map((item) => {

    const dateHours = `${dateFormatWithHour(item.date_first_value)}`
    const dateMonth = `${dateFormatWithDay(item.date_first_value)} - ${dateFormatWithDay(item.date_last_value)}`

    const formattedTooltip = group_by === 'day' ? dateHours : dateMonth
    return {
      ...item,
      formattedTooltip,
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
          className="h-[450px] w-full"
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
            <XAxis dataKey="formattedTooltip" tickLine={false} axisLine={false} tickMargin={10} />
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

