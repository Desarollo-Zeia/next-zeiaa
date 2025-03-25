"use client"

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"

// Definición de tipos para los datos THDI
interface THDICurrent {
  THDIa: number
  THDIb: number
  THDIc: number
}

interface THDIDataPoint {
  date: string
  time: string
  current: THDICurrent
}

interface FormattedTHDIDataPoint {
  timestamp: string
  date: string
  THDIa: number
  THDIb: number
  THDIc: number
}

interface CustomTooltipProps {
  active?: boolean
  payload?: any[] // eslint-disable-line @typescript-eslint/no-explicit-any
  label?: string
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
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

export default function CurrentChart({ currentReadings }: { currentReadings: THDIDataPoint[] }) {
  const formattedData: FormattedTHDIDataPoint[] = currentReadings.map((item) => ({
    timestamp: `${item.time}`,
    date: `${item.date}`,
    THDIa: item.current.THDIa,
    THDIb: item.current.THDIb,
    THDIc: item.current.THDIc,
  }))

  return (
    <div className="w-full p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <ChartContainer
        config={{
          THDIa: {
            label: "THDI Fase A",
            color: "hsl(var(--chart-1))",
          },
          THDIb: {
            label: "THDI Fase B",
            color: "hsl(var(--chart-2))",
          },
          THDIc: {
            label: "THDI Fase C",
            color: "hsl(var(--chart-3))",
          },
        }}
        className="min-h-[350px]"
      >
        <LineChart
          accessibilityLayer
          data={formattedData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 50,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="timestamp" tickLine={false} axisLine={false} tickMargin={10} angle={-45} textAnchor="end" />
          <YAxis tickLine={false} axisLine={false} tickMargin={10} />
          <ChartTooltip content={<CustomTooltip />} />
          <Line
            type="step"
            dataKey="THDIa"
            stroke="var(--color-THDIa)"
            strokeWidth={1}
            dot={false}
            activeDot={{ r: 4 }}
          />
          <Line
            type="step"
            dataKey="THDIb"
            stroke="var(--color-THDIb)"
            strokeWidth={1}
            dot={false}
            activeDot={{ r: 4 }}
          />
          <Line
            type="step"
            dataKey="THDIc"
            stroke="var(--color-THDIc)"
            strokeWidth={1}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ChartContainer>
    </div>
  )
}

