"use client"

import { Line, LineChart, Tooltip, XAxis, YAxis } from "recharts"
import { ChartContainer } from "@/components/ui/chart"
import { format } from "date-fns"
import { es } from "date-fns/locale"

// TypeScript interfaces for the JSON data
interface CurrentValues {
  Ia: number
  Ib: number
  Ic: number
}

interface Channel {
  channel: number
  values: CurrentValues
}

interface Device {
  id: number
  name: string
  dev_eui: string
}

interface MeasurementPoint {
  id: number
  name: string
}

interface MeasurementData {
  id: number
  created_at: string
  device: Device
  values_per_channel: Channel[]
  balance_status: string
  measurement_point: MeasurementPoint
}

// Interface for processed data used in charts
interface ProcessedDataPoint {
  timestamp: number
  id: number
  measurementPoint: string
  channel: number
  Ia: number
  Ib: number
  Ic: number
}

// Componente CustomTooltip que recibe props específicas
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const iaValue = payload[0].value
    const date = new Date(payload[0].payload.timestamp)
    const dataKey = payload[0].dataKey
    const fechaFormateada = format(date, "d 'de' MMMM, HH:mm", { locale: es })

    return (
      <div className="bg-white dark:bg-gray-800 p-3.5 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md">
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-1.5">{`Fecha: ${fechaFormateada}`}</p>
        <p className="text-primary font-semibold text-base">{`${dataKey}: ${iaValue} A`}</p>
      </div>
    )
  }

  return null
}

// Process data for charts
const processData = (data: MeasurementData[]): ProcessedDataPoint[] => {
  return data
    .map((item) => {
      const timestamp = new Date(item.created_at).getTime()

      console.log(timestamp)
      const channel = item.values_per_channel[0]
      return {
        timestamp,
        id: item.id,
        measurementPoint: item.measurement_point.name,
        channel: channel.channel,
        Ia: channel.values.Ia,
        Ib: channel.values.Ib,
        Ic: channel.values.Ic,
      }
    })
    .sort((a, b) => a.timestamp - b.timestamp)
}

export default function CurrentCharts({ currentReadings }: { currentReadings: MeasurementData[] }) {
  const processedData = processData(currentReadings)

  return (
    <div className="flex flex-col w-full">
      <ChartContainer
        config={{
          Ia: {
            label: "Ia",
            color: "#00b0c7",
          },
        }}
        className="w-full h-[150px]"
      >
        <LineChart data={processedData}>
          <XAxis
            dataKey="timestamp"
            tickFormatter={(value: number) => {
              const date = new Date(value)
              return `${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")}`
            }}
          />
          <YAxis hide={true} />
          <Tooltip content={<CustomTooltip />} />
          <Line type="stepAfter" dataKey="Ia" stroke="#00b0c7" strokeWidth={2} dot={false} isAnimationActive={true} />
        </LineChart>
      </ChartContainer>
      <ChartContainer
        config={{
          Ib: {
            label: "Ib",
            color: "#00b0c7",
          },
        }}
        className="w-full h-[150px]"
      >
        <LineChart data={processedData}>
          <XAxis
            dataKey="timestamp"
            tickFormatter={(value: number) => {
              const date = new Date(value)
              return `${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")}`
            }}
          />
          <YAxis hide={true} />
          <Tooltip content={<CustomTooltip />} />
          <Line type="stepAfter" dataKey="Ib" stroke="#00b0c7" strokeWidth={2} dot={false} isAnimationActive={true} />
        </LineChart>
      </ChartContainer>
      <ChartContainer
        config={{
          Ic: {
            label: "Ic",
            color: "#00b0c7",
          },
        }}
        className="w-full h-[150px]"
      >
        <LineChart data={processedData}>
          <XAxis
            dataKey="timestamp"
            tickFormatter={(value: number) => {
              const date = new Date(value)
              return `${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")}`
            }}
          />
          <YAxis hide={true} />
          <Tooltip content={<CustomTooltip />} />
          <Line type="stepAfter" dataKey="Ic" stroke="#00b0c7" strokeWidth={2} dot={false} isAnimationActive={true} />
        </LineChart>
      </ChartContainer>
    </div>
  )
}

