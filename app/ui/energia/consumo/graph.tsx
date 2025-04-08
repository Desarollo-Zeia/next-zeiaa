"use client"

import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Datos expandidos para mostrar una tendencia más clara
const expandedData = [
  {
    period: null,
    first_reading: "2025-04-07T01:57:50.057127-05:00",
    last_reading: "2025-04-07T01:57:50.057127-05:00",
    indicator: "EQpos",
    first_value: 34.44,
    last_value: 34.44,
    difference: null,
    device: { id: 1, name: "Device 1", dev_eui: "24e124468d440660" },
    measurement_point: { id: 1, name: "Unidad 1" },
  },
  {
    period: null,
    first_reading: "2025-04-07T01:58:50.092507-05:00",
    last_reading: "2025-04-07T01:58:50.092507-05:00",
    indicator: "EQpos",
    first_value: 34.44,
    last_value: 34.44,
    difference: null,
    device: { id: 1, name: "Device 1", dev_eui: "24e124468d440660" },
    measurement_point: { id: 1, name: "Unidad 1" },
  },
  {
    period: null,
    first_reading: "2025-04-07T03:00:00.000000-05:00",
    last_reading: "2025-04-07T03:00:00.000000-05:00",
    indicator: "EQpos",
    first_value: 35.12,
    last_value: 35.12,
    difference: null,
    device: { id: 1, name: "Device 1", dev_eui: "24e124468d440660" },
    measurement_point: { id: 1, name: "Unidad 1" },
  },
  {
    period: null,
    first_reading: "2025-04-07T06:30:00.000000-05:00",
    last_reading: "2025-04-07T06:30:00.000000-05:00",
    indicator: "EQpos",
    first_value: 36.78,
    last_value: 36.78,
    difference: null,
    device: { id: 1, name: "Device 1", dev_eui: "24e124468d440660" },
    measurement_point: { id: 1, name: "Unidad 1" },
  },
  {
    period: null,
    first_reading: "2025-04-07T09:15:00.000000-05:00",
    last_reading: "2025-04-07T09:15:00.000000-05:00",
    indicator: "EQpos",
    first_value: 35.89,
    last_value: 35.89,
    difference: null,
    device: { id: 1, name: "Device 1", dev_eui: "24e124468d440660" },
    measurement_point: { id: 1, name: "Unidad 1" },
  },
  {
    period: null,
    first_reading: "2025-04-07T12:00:00.000000-05:00",
    last_reading: "2025-04-07T12:00:00.000000-05:00",
    indicator: "EQpos",
    first_value: 37.22,
    last_value: 37.22,
    difference: null,
    device: { id: 1, name: "Device 1", dev_eui: "24e124468d440660" },
    measurement_point: { id: 1, name: "Unidad 1" },
  },
  {
    period: null,
    first_reading: "2025-04-07T15:45:00.000000-05:00",
    last_reading: "2025-04-07T15:45:00.000000-05:00",
    indicator: "EQpos",
    first_value: 38.05,
    last_value: 38.05,
    difference: null,
    device: { id: 1, name: "Device 1", dev_eui: "24e124468d440660" },
    measurement_point: { id: 1, name: "Unidad 1" },
  },
  {
    period: null,
    first_reading: "2025-04-07T18:30:00.000000-05:00",
    last_reading: "2025-04-07T18:30:00.000000-05:00",
    indicator: "EQpos",
    first_value: 37.65,
    last_value: 37.65,
    difference: null,
    device: { id: 1, name: "Device 1", dev_eui: "24e124468d440660" },
    measurement_point: { id: 1, name: "Unidad 1" },
  },
  {
    period: null,
    first_reading: "2025-04-07T21:15:00.000000-05:00",
    last_reading: "2025-04-07T21:15:00.000000-05:00",
    indicator: "EQpos",
    first_value: 36.92,
    last_value: 36.92,
    difference: null,
    device: { id: 1, name: "Device 1", dev_eui: "24e124468d440660" },
    measurement_point: { id: 1, name: "Unidad 1" },
  },
  {
    period: null,
    first_reading: "2025-04-08T00:00:00.000000-05:00",
    last_reading: "2025-04-08T00:00:00.000000-05:00",
    indicator: "EQpos",
    first_value: 35.78,
    last_value: 35.78,
    difference: null,
    device: { id: 1, name: "Device 1", dev_eui: "24e124468d440660" },
    measurement_point: { id: 1, name: "Unidad 1" },
  },
]

// Formatear los datos para el gráfico


export default function Graph({ readingsGraph }) {

  const chartData = readingsGraph.map((item) => ({
    date: new Date(item.first_reading),
    value: item.first_value,
    formattedDate: format(new Date(item.first_reading), "dd/MM HH:mm", { locale: es }),
    deviceName: item.device.name,
    measurementPoint: item.measurement_point.name,
    indicator: item.indicator,
    }))
      
  return (
    <div className={`flex-1 flex flex-col justify-center gap-6 bg-white`}>
        <ChartContainer
        config={{
            value: {
            label: "Valor EQpos",
            color: "hsl(var(--chart-1))",
            },
        }}
        >
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
                dataKey="formattedDate"
                angle={-45}
                textAnchor="end"
                height={70}
                tickMargin={20}
                tickLine={false}
                axisLine={false}
            />
            <YAxis domain={["auto", "auto"]} tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip />
            <Line
                type="monotone"
                dataKey="value"
                stroke="var(--color-value)"
                strokeWidth={1}
                activeDot={{
                r: 4,
                fill: "var(--color-value)",
                strokeWidth: 0,
                }}
            />
            </LineChart>
        </ResponsiveContainer>
        </ChartContainer>
    </div>
  )
}
