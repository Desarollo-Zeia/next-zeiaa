"use client"

import { Bar, BarChart, CartesianGrid, Tooltip, XAxis } from "recharts"
import { ChartContainer } from "@/components/ui/chart"
import type { TooltipProps } from "recharts"
import NoResultFound from "../../no-result-found";
import { formattedDate } from "@/app/utils/func";

const dateFormatWithHour = (dateStr: string) => {
  const date = new Date(dateStr);
  const formattedDate = date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }).replace('.', '');
  const finalOutput = `${formattedDate}`

  return finalOutput
}

const dateFormatWithDay = (dateStr: string) => {
  const date = new Date(dateStr);
// Opciones para formatear la fecha
const formattedDate = date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }).replace('.', '')

return formattedDate
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

  export interface ConsumoTooltipProps extends TooltipProps<any, any> { // eslint-disable-line @typescript-eslint/no-explicit-any
      active?: boolean
      payload?: any[] // eslint-disable-line @typescript-eslint/no-explicit-any
    }


  export function ConsumoTooltip({ active, payload }: ConsumoTooltipProps) {
    if (!active || !payload || payload.length === 0) {
      return null
    }
  
    // Extract data from the first payload item
    const data = payload[0].payload
  
    return (
      <div className="bg-white dark:bg-gray-800 p-3 border rounded-lg shadow-sm">
        <p className="text-sm font-medium mb-2">
          {formattedDate(data.date)}
        </p>
  
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 text-xs mb-1">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span>{entry.dataKey === "consumption" ? "Consumo" : entry.dataKey}:</span>
            <span className="font-medium">{entry.value.toFixed(2)} kWh</span>
          </div>
        ))}
  
        {/* <div className="mt-2 pt-2 border-t text-xs">
          <div className="flex justify-between">
            <span>Valor inicial:</span>
            <span className="font-medium">{data.first_value}</span>
          </div>
          <div className="flex justify-between">
            <span>Valor final:</span>
            <span className="font-medium">{data.last_value}</span>
          </div>
        </div> */}
      </div>
    )
  }
  

export default function ConsumoChart({ data, group_by } : { data: DataPoint[], group_by: string}) {

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
    <div className="w-full p-6 bg-white rounded-lg shadow">
      {
        data.length > 0 ? (
          <ChartContainer
          config={{
            consumption: {
              label: "Consumo",
              color: "hsl(var(--chart-2))",
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
            <XAxis dataKey="formattedTooltip" tickLine={false} axisLine={false} tickMargin={10} />
            <Tooltip content={<ConsumoTooltip />} />
            <Bar dataKey="consumption" fill="var(--color-consumption)" radius={[4, 4, 0, 0]} name="Consumo" />
          </BarChart>
        </ChartContainer>
        ) : (
          <NoResultFound/>
        )
      }
  
    </div>
  )
}

