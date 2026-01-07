"use client"

import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from "chart.js"
import zoomPlugin from "chartjs-plugin-zoom"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import NoResultsFound from "../../no-result"

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend, zoomPlugin)

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

// Componente de gráfica individual
function VoltageLineChart({ 
  data, 
  dataKey, 
  label 
}: { 
  data: ProcessedDataPoint[], 
  dataKey: 'Uab' | 'Ubc' | 'Uac',
  label: string 
}) {
  const labels = data.map((item) => {
    const date = new Date(item.timestamp)
    return `${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")}`
  })

  const chartData = {
    labels,
    datasets: [{
      label,
      data: data.map((item) => item[dataKey]),
      borderColor: "#00b0c7",
      backgroundColor: "transparent",
      stepped: true,
      borderWidth: 2,
      pointRadius: 0,
      pointHoverRadius: 4,
    }]
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const options: any = {
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
        display: false,
      }
    },
    plugins: {
      tooltip: {
        backgroundColor: "white",
        titleColor: "#666",
        bodyColor: "#00b0c7",
        borderColor: "#e5e7eb",
        borderWidth: 1,
        padding: 12,
        bodyFont: { weight: 'bold' },
        callbacks: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          title: function(tooltipItems: any) {
            const index = tooltipItems[0].dataIndex
            const timestamp = data[index].timestamp
            return `Fecha: ${format(new Date(timestamp), "d 'de' MMMM, HH:mm", { locale: es })}`
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          label: function(context: any) {
            return `${dataKey}: ${context.parsed.y} A`
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
        display: true,
        position: 'top',
        align: 'start',
      }
    }
  }

  return (
    <div className="h-[150px]">
      <Line data={chartData} options={options} />
    </div>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function VoltageCharts({ voltageReadings }: { voltageReadings: MeasurementData[] }) {

  if ("message" in voltageReadings) {
    // Caso cuando NO hay datos
    return <NoResultsFound message={voltageReadings.message as string} />
  }

  const processedData = processData(voltageReadings)

  return (
    <div className="flex flex-col w-full gap-2">
      <VoltageLineChart data={processedData} dataKey="Uab" label="Uab" />
      <VoltageLineChart data={processedData} dataKey="Ubc" label="Ubc" />
      <VoltageLineChart data={processedData} dataKey="Uac" label="Uac" />
    </div>
  )
}

