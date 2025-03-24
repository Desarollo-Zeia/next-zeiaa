"use client"

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"

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
  date: string
  THDUa: number
  THDUb: number
  THDUc: number
}

interface CustomTooltipProps {
  active?: boolean
  payload?: any[]
  label?: string
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) {
    return null
  }

  // Extract data from the first payload item
  const data = payload[0].payload

  const date = new Date(data.date);

  const formattedDate = date.toLocaleDateString("es-ES", { day: 'numeric', month: 'short'});

  return (
    <div className="bg-white dark:bg-gray-800 p-3 border rounded-lg shadow-sm">
      <p className="text-sm font-medium mb-2">
        {formattedDate} - {data.timestamp}
      </p>

      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2 text-xs mb-1">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span>
            {entry.dataKey === "THDUa"
              ? "THDU Fase A"
              : entry.dataKey === "THDUb"
                ? "THDU Fase B"
                : entry.dataKey === "THDUc"
                  ? "THDU Fase C"
                  : entry.dataKey}
            :
          </span>
          <span className="font-medium">{entry.value} V</span>
        </div>
      ))}
    </div>
  )
}

export default function VoltageChart({ voltageReadings }: { voltageReadings: THDUDataPoint[] }) {
  const formattedData: FormattedTHDUDataPoint[] = voltageReadings.map((item) => ({
    date: `${item.date}`,
    timestamp: `${item.time}`,
    THDUa: item.voltage.THDUa,
    THDUb: item.voltage.THDUb,
    THDUc: item.voltage.THDUc,
  }))

  return (
    <div className="w-full p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
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
          <ChartTooltip content={<CustomTooltip />} />
          <Line
            type="step"
            dataKey="THDUa"
            stroke="var(--color-THDUa)"
            strokeWidth={1}
            dot={false}
            activeDot={{ r: 4 }}
          />
          <Line
            type="step"
            dataKey="THDUb"
            stroke="var(--color-THDUb)"
            strokeWidth={1}
            dot={false}
            activeDot={{ r: 4 }}
          />
          <Line
            type="step"
            dataKey="THDUc"
            stroke="var(--color-THDUc)"
            strokeWidth={1}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ChartContainer>
    </div>
  )
}

