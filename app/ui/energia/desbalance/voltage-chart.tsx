"use client"

import { Line, LineChart, Tooltip, XAxis, YAxis } from "recharts"
import { ChartContainer } from "@/components/ui/chart"
import { format } from "date-fns"
import { es } from "date-fns/locale"
// TypeScript interfaces for the JSON data
interface VoltageValues {
  Uab: number
  Ubc: number
  Uac: number
}

interface Channel {
  channel: number
  values: VoltageValues
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
  measurement_point: MeasurementPoint,
  message?: string
}

// Interface for processed data used in charts
interface ProcessedDataPoint {
  timestamp: number
  id: number
  measurementPoint: string
  channel: number
  Uab: number
  Ubc: number
  Uac: number
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
  return data?.map((item) => {
    const timestamp = new Date(item.created_at).getTime()
    const channel = item.values_per_channel[0]
    return {
      timestamp,
      id: item.id,
      measurementPoint: item.device.name,
      channel: channel.channel,
      Uab: channel.values.Uab,
      Ubc: channel.values.Ubc,
      Uac: channel.values.Uac,
    }
  })
    .sort((a, b) => a.timestamp - b.timestamp)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function VoltageCharts({ voltageReadings }: { voltageReadings: MeasurementData[] }) {

  if ("message" in voltageReadings) {
    // Caso cuando NO hay datos
    console.log("Mensaje:", voltageReadings.message)
    return <div>No hay datos disponibles</div>
  }

  const processedData = processData(voltageReadings)

  return (
    <div className="flex flex-col w-full">
      <ChartContainer
        config={{
          Uab: {
            label: "Uab",
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
          <YAxis hide={true} domain={[0, 500]} />
          <Tooltip content={<CustomTooltip />} />
          <Line type="stepAfter" dataKey="Uab" stroke="#00b0c7" strokeWidth={2} dot={false} isAnimationActive={true} />
        </LineChart>
      </ChartContainer>
      <ChartContainer
        config={{
          Ubc: {
            label: "Ubc",
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
          <YAxis type="number" hide={true} domain={[200, 500]} />
          <Tooltip content={<CustomTooltip />} />
          <Line type="stepAfter" dataKey="Ubc" stroke="#00b0c7" strokeWidth={2} dot={false} isAnimationActive={true} />
        </LineChart>
      </ChartContainer>
      <ChartContainer
        config={{
          Uac: {
            label: "Uac",
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
          <Line type="stepAfter" dataKey="Uac" stroke="#00b0c7" strokeWidth={2} dot={false} isAnimationActive={true} />
        </LineChart>
      </ChartContainer>

    </div >
  )
}

