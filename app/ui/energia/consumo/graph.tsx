"use client"

import { useTransition } from "react"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend,
} from "chart.js"
import zoomPlugin from "chartjs-plugin-zoom"
import annotationPlugin from "chartjs-plugin-annotation"
import "chartjs-adapter-date-fns"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { ELECTRIC_PARAMETERS } from "@/app/utils/formatter"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import DeviceReadingsChart from "./measurement-graph"
import NoResultsFound from "../../no-result"

ChartJS.register(LineElement, PointElement, LinearScale, TimeScale, Tooltip, Legend, zoomPlugin, annotationPlugin)

const energyToggleArray = [
  { label: "Hora", value: "none" },
  { label: "Dia", value: "day" },
  { label: "Semana", value: "week" },
  { label: "Mes", value: "month" },
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SimpleLineChart = ({ readingsGraph, category, indicator, last_by, readings, dateAfter, dateBefore }: { readingsGraph: any, category: any, indicator: any, last_by: any, readings: any, dateAfter?: string, dateBefore?: string }) => {
  const [isPending, startTransition] = useTransition()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  const indicatorsObject = readings?.results?.[0]?.indicators?.values
  const avaibleIndicators = [] as Array<string>

  for (const key in indicatorsObject) {
    if (indicatorsObject[key] !== null) {
      avaibleIndicators.push(key)
    }
  }

  const parameterLabel = ELECTRIC_PARAMETERS[indicator as keyof typeof ELECTRIC_PARAMETERS]?.parameter || indicator

  // Procesar datos para Chart.js
  const dataPoints = readingsGraph
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((item: any) => ({
      x: new Date(item.first_reading).toISOString(),
      y: item.first_value,
    })) || []

  const unit = readingsGraph?.[0]?.unit || ''

  // Determinar si es el mismo día (mostrar solo horas) o rango de fechas
  const isSameDay = dateAfter === dateBefore

  const handleFrequency = (frequency: string) => {
    startTransition(() => {
      const newParams = new URLSearchParams(searchParams)
      newParams.set('last_by', frequency)

      if (frequency === 'none' && category !== 'energy') {
        newParams.delete('last_by')
      } else if (frequency === 'none' && category === 'energy') {
        newParams.set('last_by', 'hour')
      }

      replace(`${pathname}?${newParams.toString()}`, { scroll: false })
    })
  }

  const chartData = {
    datasets: [{
      label: parameterLabel,
      data: dataPoints,
      borderColor: "#00b0c7",
      backgroundColor: "rgba(0, 176, 199, 0.1)",
      stepped: true,
      tension: 0,
      pointRadius: 0,
      borderWidth: 2,
    }]
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    },
    scales: {
      x: {
        type: "time",
        adapters: {
          date: {
            locale: es
          }
        },
        time: {
          unit: isSameDay ? "hour" : "day",
          displayFormats: {
            hour: isSameDay ? "HH:mm" : "dd MMM HH:mm",
            day: "dd MMM"
          }
        },
        grid: { color: '#e5e7eb' },
        ticks: { font: { size: 12 } }
      },
      y: {
        grid: { color: '#e5e7eb' },
        ticks: {
          font: { size: 12 },
          callback: function (val: number) {
            return `${val.toFixed(0)} ${unit}`
          }
        }
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
          title: function (tooltipItems: any) {
            const date = new Date(tooltipItems[0].parsed.x)
            const fechaFormateada = format(date, "EEEE d 'de' MMMM, HH:mm", { locale: es })
            return fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1)
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          label: function (context: any) {
            return `${parameterLabel}: ${context.parsed.y.toFixed(2)} ${unit}`
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
      annotation: {
        annotations: category === 'voltage' ? {
          line209: {
            type: 'line',
            yMin: 209,
            yMax: 209,
            borderColor: '#000',
            borderWidth: 1,
            borderDash: [5, 5],
            label: {
              display: true,
              content: '209 v',
              position: 'end',
              backgroundColor: 'transparent',
              color: '#000',
              font: { size: 12 }
            }
          },
          line231: {
            type: 'line',
            yMin: 231,
            yMax: 231,
            borderColor: '#000',
            borderWidth: 1,
            borderDash: [5, 5],
            label: {
              display: true,
              content: '231 v',
              position: 'end',
              backgroundColor: 'transparent',
              color: '#000',
              font: { size: 12 }
            }
          }
        } : {}
      },
      legend: {
        display: false
      }
    }
  }

  return (
    <div className="w-full min-h-full p-4 bg-white flex flex-col justify-center items-center relative">
      <div className="pb-4 mb-4">
        {avaibleIndicators?.length > 0 && (
          <h2 className="font-semibold text-xl">
            Grafica de {parameterLabel}
          </h2>
        )}
      </div>

      {readingsGraph?.length > 0 && (
        <ToggleGroup
          type="single"
          value={last_by}
          onValueChange={handleFrequency}
          aria-label="Frequency"
          className="flex gap-2 mb-4"
        >
          {category === 'energy' && (
            energyToggleArray.map(times => (
              <ToggleGroupItem
                key={times.value}
                value={times.value}
                className={`w-[120px] h-[40px] ${times.value === last_by
                  ? 'bg-[#00b0c7] text-white'
                  : 'bg-gray-100 text-black'
                  } ${last_by === 'hour' && times.value === 'none' ? 'bg-[#00b0c7] text-white' : ''}`}
              >
                {isPending ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
                  </div>
                ) : (
                  times.label
                )}
              </ToggleGroupItem>
            ))
          )}
        </ToggleGroup>
      )}

      {avaibleIndicators?.length === 0 ? (
        <NoResultsFound message="Aun no hay informacion disponible" />
      ) : (
        <>
          {last_by === 'minute' ? (
            <div className="w-full h-[350px]">
              {dataPoints.length > 0 ? (
                <Line data={chartData} options={options} />
              ) : (
                <NoResultsFound message="Aun no hay informacion disponible" />
              )}
            </div>
          ) : (
            <DeviceReadingsChart data={readingsGraph} last_by={last_by} />
          )}
        </>
      )}
    </div>
  )
}

export default SimpleLineChart
