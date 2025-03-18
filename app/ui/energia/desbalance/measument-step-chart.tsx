"use client"

import { useState } from "react"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Define the type for our measurement data
interface Measurement {
  id: number
  created_at: string
  device: {
    id: number
    name: string
    dev_eui: string
  }
  values_per_channel: {
    channel: number
    values: {
      Ia: number
      Ib: number
      Ic: number
    }
  }[]
  balance_status: string
  measurement_point: {
    id: number
    name: string
  }
}

interface MeasurementStepChartProps {
  data: Measurement[]
  title?: string
  description?: string
}

export function MeasurementStepChart({
  data,
  title = "Mediciones de Corriente",
  description = "Valores registrados en el tiempo",
}: MeasurementStepChartProps) {
  const [selectedMetric, setSelectedMetric] = useState<"Ia" | "Ib" | "Ic">("Ia")

  // Transform the data for the chart
  const chartData = data.map((item) => {
    // Get the first channel's values (assuming there's always at least one channel)
    const channelValues = item.values_per_channel[0]?.values || { Ia: 0, Ib: 0, Ic: 0 }

    return {
      timestamp: item.created_at,
      Ia: channelValues.Ia,
      Ib: channelValues.Ib,
      Ic: channelValues.Ic,
      formattedTime: format(parseISO(item.created_at), "HH:mm:ss", { locale: es }),
      deviceName: item.device.name,
      measurementPoint: item.measurement_point.name,
    }
  })

  // Get min and max values for the Y axis with some padding
  const values = chartData.map((item) => item[selectedMetric])
  const maxValue = Math.max(...values) * 1.1 || 10 // Default to 10 if all values are 0
  const minValue = Math.min(...values) * 0.9 || 0

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <Select value={selectedMetric} onValueChange={(value) => setSelectedMetric(value as "Ia" | "Ib" | "Ic")}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Seleccionar" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Ia">Fase A (Ia)</SelectItem>
            <SelectItem value="Ib">Fase B (Ib)</SelectItem>
            <SelectItem value="Ic">Fase C (Ic)</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="h-[300px]">
          <ChartContainer
            config={{
              [selectedMetric]: {
                label: `Corriente Fase ${selectedMetric.charAt(1)}`,
                color: "hsl(var(--chart-1))",
              },
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <XAxis
                  dataKey="formattedTime"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  minTickGap={10}
                  tickFormatter={(value) => value}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  domain={[minValue, maxValue]}
                  tickFormatter={(value) => `${value}A`}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      labelFormatter={(label, payload) => {
                        const dataPoint = payload[0]?.payload
                        if (!dataPoint) return label

                        return (
                          <div className="flex flex-col gap-1">
                            <p className="text-sm font-medium">{dataPoint.formattedTime}</p>
                            <p className="text-xs text-muted-foreground">
                              {dataPoint.deviceName} - {dataPoint.measurementPoint}
                            </p>
                          </div>
                        )
                      }}
                      formatter={(value) => [`${value}A`, `Fase ${selectedMetric.charAt(1)}`]}
                    />
                  }
                />
                <Area
                  type="stepAfter"
                  dataKey={selectedMetric}
                  strokeWidth={2}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                  isAnimationActive={true}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  )
}

