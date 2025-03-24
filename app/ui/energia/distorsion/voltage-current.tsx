"use client"

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Definición de tipos para los datos THDU
interface THDUVoltage {
  THDUa: number
  THDUb: number
  THDUc: number
}

interface THDUDataPoint {
  date: string
  time: string
  voltage: THDUVoltage
}

interface FormattedTHDUDataPoint {
  timestamp: string
  THDUa: number
  THDUb: number
  THDUc: number
}

export default function VoltageChart({ voltageReadings }: { voltageReadings: THDUDataPoint[] }) {
  const formattedData: FormattedTHDUDataPoint[] = voltageReadings.map((item) => ({
    timestamp: `${item.time}`,
    THDUa: item.voltage.THDUa,
    THDUb: item.voltage.THDUb,
    THDUc: item.voltage.THDUc,
  }))

  return (
    <div className="w-full p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center dark:text-white">Valores THDU por Tiempo</h2>
      <ChartContainer
        config={{
          THDUa: {
            label: "THDU Fase A",
            color: "hsl(var(--chart-1))",
          },
          THDUb: {
            label: "THDU Fase B",
            color: "hsl(var(--chart-2))",
          },
          THDUc: {
            label: "THDU Fase C",
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
          <ChartTooltip
            content={
              <ChartTooltipContent
                indicator="line"
                formatValue={(value) => `${value} V`}
                formatLabel={(label) => {
                  return label === "timestamp" ? "Hora" : label
                }}
              />
            }
          />
          <Line
            type="step"
            dataKey="THDUa"
            stroke="var(--color-THDUa)"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="step"
            dataKey="THDUb"
            stroke="var(--color-THDUb)"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="step"
            dataKey="THDUc"
            stroke="var(--color-THDUc)"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ChartContainer>
    </div>
  )
}

