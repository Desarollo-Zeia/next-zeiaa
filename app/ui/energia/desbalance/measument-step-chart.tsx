"use client"

import { useState } from "react"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { DynamicLine } from "@/components/charts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
  const processedData = data.map((item) => {
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
  const values = processedData.map((item) => item[selectedMetric])
  const maxValue = Math.max(...values) * 1.1 || 10 // Default to 10 if all values are 0
  const minValue = Math.min(...values) * 0.9 || 0

  const labels = processedData.map((item) => item.formattedTime)

  const chartData = {
    labels,
    datasets: [{
      label: `Corriente Fase ${selectedMetric.charAt(1)}`,
      data: processedData.map((item) => item[selectedMetric]),
      borderColor: "#00b0c7",
      backgroundColor: "rgba(0, 176, 199, 0.2)",
      fill: true,
      stepped: true,
      borderWidth: 2,
      pointRadius: 0,
      pointHoverRadius: 6,
    }]
  }

  const options: Record<string, unknown> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 11 } }
      },
      y: {
        min: minValue,
        max: maxValue,
        grid: { color: '#e5e7eb' },
        ticks: {
          font: { size: 11 },
          callback: function(val: number) {
            return `${val}A`
          }
        }
      }
    },
    plugins: {
      tooltip: {
        backgroundColor: "white",
        titleColor: "#333",
        bodyColor: "#00b0c7",
        borderColor: "#e5e7eb",
        borderWidth: 1,
        padding: 12,
        bodyFont: { weight: 'bold' },
        callbacks: {
          title: function(tooltipItems: Array<{ dataIndex: number }>) {
            const index = tooltipItems[0].dataIndex
            const item = processedData[index]
            return `${item.formattedTime}\n${item.deviceName} - ${item.measurementPoint}`
          },
          label: function(context: { parsed: { y: number } }) {
            return `Fase ${selectedMetric.charAt(1)}: ${context.parsed.y}A`
          }
        }
      },
      zoom: {
        pan: {
          enabled: true,
          mode: "x",
        },
        zoom: {
          wheel: {
            enabled: true,
            mode: "x",
            speed: 0.1,
          },
          pinch: {
            enabled: true,
          },
          mode: "x",
        },
        limits: {
          y: { min: 'original', max: 'original' },
          x: { min: 'original', max: 'original' }
        }
      },
      legend: {
        display: false,
      }
    }
  }

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
          <DynamicLine data={chartData} options={options} />
        </div>
      </CardContent>
    </Card>
  )
}

