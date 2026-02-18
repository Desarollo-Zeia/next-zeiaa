'use client'
import IndicatorToggle from "../filters/indicators-toggle"
import { DynamicLine } from "@/components/charts"
import {
  Card,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { INDICATOR_CONVERTED, STATUS_COLOR, STATUS_COLOR_THRESHOLD, STATUS_TO_SPANISH, UNIT_CONVERTED } from "@/app/utils/formatter"
import { Indicator, Unit } from "@/app/type"
import NoResultFound from "../no-result-found"

interface IndicatorStructure {
  indicator: string,
  value: string,
  unit: string,
  status: string,
  hours: string,
  date: string
}

interface IndicatorToogle {
  indicator: string,
  unit: string
}

interface ThresholdLevel {
  value: number
  level: string
}

interface Thresholds {
  [key: string]: {
    levels: ThresholdLevel[]
  }
}

interface RoomDataStructure {
  id: number,
  name: string,
  status: string,
  headquarter: {
    id: number,
    name: string
  }
  indicators_activated: IndicatorToogle[],
  indicators_pollutants: IndicatorToogle[],
  is_activated: boolean,
  thresholds: Thresholds
}

interface ChartComponentProps {
  results: IndicatorStructure[]
  generalRoomData: RoomDataStructure
  indicator: Indicator,
  unit: Unit,
  thresholds: Thresholds
}

export default function ChartComponent({ results, generalRoomData, indicator, unit }: ChartComponentProps) {

  const { indicators_pollutants: indicators, thresholds } = generalRoomData

  const [{ value: domaninY } = {}] = thresholds?.[indicator]?.levels?.slice(-1) ?? [];

  const th = thresholds?.[indicator]?.levels;

  // Preparar datos para Chart.js
  const labels = results.map(item => item.hours)
  const dataPoints = results.map(item => parseFloat(item.value))

  // Calcular el máximo considerando thresholds y valores de datos
  const maxDataValue = dataPoints.length > 0 ? Math.max(...dataPoints) : 0
  const maxY = Math.max(domaninY || 0, maxDataValue) * 1.2

  const indicatorLabel = INDICATOR_CONVERTED[indicator as keyof typeof INDICATOR_CONVERTED] || indicator

  const chartData = {
    labels,
    datasets: [{
      label: indicatorLabel,
      data: dataPoints,
      borderColor: "#00b0c7",
      backgroundColor: "rgba(0, 176, 199, 0.1)",
      tension: 0.4, // type="natural"
      pointRadius: 0,
      borderWidth: 2,
    }]
  }

  // Crear anotaciones dinámicas para los thresholds
  const annotations: Record<string, Record<string, unknown>> = {}
  th?.forEach((threshold: ThresholdLevel, i: number) => {
    annotations[`threshold-${i}`] = {
      type: 'line',
      yMin: threshold.value,
      yMax: threshold.value,
      borderColor: STATUS_COLOR_THRESHOLD[threshold.level as keyof typeof STATUS_COLOR_THRESHOLD],
      borderWidth: 2,
      borderDash: [3, 3],
    }
  })

  const options: Record<string, unknown> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 12 } }
      },
      y: {
        min: 0,
        max: maxY || undefined,
        grid: { color: '#e5e7eb' },
        ticks: {
          font: { size: 12 },
          callback: function(val: number) {
            return `${val} ${UNIT_CONVERTED[unit]}`
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
        annotations
      },
      legend: {
        display: false
      }
    }
  }

  return (
    <Card className="w-full flex-1">
      <CardHeader>
        <div className="flex justify-between items-center gap-2">
          <CardTitle className="text-balance text-lg">Estadísticas en tiempo real</CardTitle>
          <IndicatorToggle indicators={indicators} indicatorParam={indicator} />
        </div>
        <br />
        {
          results.length !== 0 && (
            <div className="w-full">
              <div className="text-xs font-medium mb-2">Umbrales:</div>
              <div className="flex flex-wrap gap-4">
                {th?.map((threshold: ThresholdLevel, i: number) => {
                  return (
                    <div key={i}>
                      <div>
                        <p className={`${STATUS_COLOR[threshold.level as keyof typeof STATUS_COLOR]}`}>-- {STATUS_TO_SPANISH[threshold.level as keyof typeof STATUS_TO_SPANISH]}</p>
                        <p>{threshold.value} {UNIT_CONVERTED[unit]}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        }

      </CardHeader>
      {
        results.length === 0 ? (
          <NoResultFound />
        ) : (
          <div className="px-6 pb-6 h-[300px]">
            <DynamicLine data={chartData} options={options} />
          </div>
        )
      }
    </Card>
  )
}
