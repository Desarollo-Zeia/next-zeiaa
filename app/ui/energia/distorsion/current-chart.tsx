"use client"

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

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
  THDIa: number
  THDIb: number
  THDIc: number
}

export default function CurrentChart({ currentReadings }: { currentReadings: THDIDataPoint[] }) {
  const formattedData: FormattedTHDIDataPoint[] = currentReadings.map((item) => ({
    timestamp: `${item.time}`,
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
          <YAxis tickLine={false} axisLine={false} tickMargin={10} domain={[0, "dataMax + 1"]} />
          <ChartTooltip
            content={
              <ChartTooltipContent
                indicator="line"
                formatValue={(value) => `${value}%`}
                formatLabel={(label) => {
                  return label === "timestamp" ? "Hora" : label
                }}
              />
            }
          />
          <Line
            type="step"
            dataKey="THDIa"
            stroke="var(--color-THDIa)"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="step"
            dataKey="THDIb"
            stroke="var(--color-THDIb)"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="step"
            dataKey="THDIc"
            stroke="var(--color-THDIc)"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ChartContainer>
    </div>
  )
}

