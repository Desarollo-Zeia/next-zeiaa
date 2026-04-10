"use client"

import { useMemo, useState } from "react"
import { DynamicLine } from "@/components/charts/dynamic-charts"
import type { TooltipItem } from "chart.js"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface DataPoint {
  hour: string
  indicator: string
  unit: string
  value: number
  status: string
}

interface DayData {
  [date: string]: DataPoint[]
}

interface CO2Thresholds {
  good: number
  moderate: number
  unhealthy: number
  dangerous: number
}

interface MinMaxThresholds {
  min: number
  max: number
}

interface ChartStatisticsHourProps {
  data: DayData | unknown
  selectedDate?: string
  indicator?: string
  unit?: string
  thresholds?: CO2Thresholds | MinMaxThresholds
}

export function ChartStatisticsHour({
  data,
  selectedDate,
  indicator,
  unit,
  thresholds,
}: ChartStatisticsHourProps) {
  const dates = useMemo(() => {
    if (!data || typeof data !== "object") return []
    const dataObj = data as DayData
    return Object.keys(dataObj).sort()
  }, [data])

  const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set(dates))
  const [hasInteracted, setHasInteracted] = useState(false)

  const handleCheckboxChange = (date: string, e: React.MouseEvent<HTMLLabelElement>) => {
    setHasInteracted(true)
    setSelectedDates((prev) => {
      if (!hasInteracted) {
        return new Set([date])
      }
      const newSet = new Set(prev)
      if (newSet.has(date)) {
        if (newSet.size > 1) newSet.delete(date)
      } else {
        newSet.add(date)
      }
      return newSet
    })
  }

  const selectAll = () => setSelectedDates(new Set(dates))

  const chartData = useMemo(() => {
    if (!data || typeof data !== "object") {
      return { labels: [], datasets: [] }
    }

    const dataObj = data as DayData
    const filteredDates = dates.filter((d) => selectedDates.has(d))

    if (filteredDates.length === 0) {
      return { labels: [], datasets: [] }
    }

    const allHours = new Set<string>()
    filteredDates.forEach((date) => {
      const dayData = dataObj[date] || []
      if (Array.isArray(dayData)) {
        dayData
          .filter((item) => item.indicator === indicator)
          .forEach((item) => allHours.add(item.hour))
      }
    })
    const labels = Array.from(allHours).sort()

    if (labels.length === 0) {
      return { labels: [], datasets: [] }
    }

    const colors = [
      { border: "rgb(59, 130, 246)", bg: "rgba(59, 130, 246, 0.1)" },
      { border: "rgb(239, 68, 68)", bg: "rgba(239, 68, 68, 0.1)" },
      { border: "rgb(34, 197, 94)", bg: "rgba(34, 197, 94, 0.1)" },
      { border: "rgb(249, 115, 22)", bg: "rgba(249, 115, 22, 0.1)" },
      { border: "rgb(168, 85, 247)", bg: "rgba(168, 85, 247, 0.1)" },
      { border: "rgb(236, 72, 153)", bg: "rgba(236, 72, 153, 0.1)" },
      { border: "rgb(20, 184, 166)", bg: "rgba(20, 184, 166, 0.1)" },
      { border: "rgb(234, 179, 8)", bg: "rgba(234, 179, 8, 0.1)" },
    ]

    const datasets = filteredDates.map((date, index) => {
      const dayData = dataObj[date] || []
      const filteredData = Array.isArray(dayData)
        ? dayData.filter((item) => item.indicator === indicator)
        : []

      const valueMap = new Map(filteredData.map((item) => [item.hour, item.value]))
      const values = labels.map((hour) => valueMap.get(hour) ?? null)

      const color = colors[index % colors.length]

      return {
        label: date,
        data: values,
        borderColor: color.border,
        backgroundColor: color.bg,
        fill: false,
        pointBackgroundColor: color.border,
        tension: 0.3,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 4,
        spanGaps: true,
      }
    })

    return { labels, datasets }
  }, [data, indicator, dates, selectedDates])

  const options = useMemo(() => {
    const annotations: {
      [key: string]: {
        type: "line"
        yMin: number
        yMax: number
        borderColor: string
        borderWidth: number
        borderDash: number[]
        label: {
          display: boolean
          content: string
          position: "start" | "end"
          backgroundColor: string
          color: string
          font: { size: number; weight: string }
        }
      }
    } = {}

    if (thresholds) {
      const unitLabel = unit || ""
      
      if ('good' in thresholds) {
        const co2 = thresholds as CO2Thresholds
        annotations.co2Good = {
          type: 'line' as const,
          yMin: co2.good,
          yMax: co2.good,
          borderColor: '#166534',
          borderWidth: 3,
          borderDash: [8, 4],
          label: {
            display: true,
            content: `Bueno ${co2.good} ${unitLabel}`,
            position: 'end' as const,
            backgroundColor: '#166534',
            color: '#ffffff',
            font: { size: 11, weight: 'bold' as const }
          }
        }
        annotations.co2Moderate = {
          type: 'line' as const,
          yMin: co2.moderate,
          yMax: co2.moderate,
          borderColor: '#a16207',
          borderWidth: 3,
          borderDash: [8, 4],
          label: {
            display: true,
            content: `Moderado ${co2.moderate} ${unitLabel}`,
            position: 'end' as const,
            backgroundColor: '#a16207',
            color: '#ffffff',
            font: { size: 11, weight: 'bold' as const }
          }
        }
        annotations.co2Unhealthy = {
          type: 'line' as const,
          yMin: co2.unhealthy,
          yMax: co2.unhealthy,
          borderColor: '#c2410c',
          borderWidth: 3,
          borderDash: [8, 4],
          label: {
            display: true,
            content: `No saludable ${co2.unhealthy} ${unitLabel}`,
            position: 'end' as const,
            backgroundColor: '#c2410c',
            color: '#ffffff',
            font: { size: 11, weight: 'bold' as const }
          }
        }
        annotations.co2Dangerous = {
          type: 'line' as const,
          yMin: co2.dangerous,
          yMax: co2.dangerous,
          borderColor: '#991b1b',
          borderWidth: 3,
          borderDash: [8, 4],
          label: {
            display: true,
            content: `Peligroso ${co2.dangerous} ${unitLabel}`,
            position: 'end' as const,
            backgroundColor: '#991b1b',
            color: '#ffffff',
            font: { size: 11, weight: 'bold' as const }
          }
        }
      } else {
        const minMax = thresholds as MinMaxThresholds
        annotations.thresholdMin = {
          type: 'line' as const,
          yMin: minMax.min,
          yMax: minMax.min,
          borderColor: '#1e3a8a',
          borderWidth: 3,
          borderDash: [8, 4],
          label: {
            display: true,
            content: `Mín ${minMax.min} ${unitLabel}`,
            position: 'start' as const,
            backgroundColor: '#1e3a8a',
            color: '#ffffff',
            font: { size: 11, weight: 'bold' as const }
          }
        }
        annotations.thresholdMax = {
          type: 'line' as const,
          yMin: minMax.max,
          yMax: minMax.max,
          borderColor: '#7f1d1d',
          borderWidth: 3,
          borderDash: [8, 4],
          label: {
            display: true,
            content: `Máx ${minMax.max} ${unitLabel}`,
            position: 'start' as const,
            backgroundColor: '#7f1d1d',
            color: '#ffffff',
            font: { size: 11, weight: 'bold' as const }
          }
        }
      }
    }

    return {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: "index" as const,
        intersect: false,
      },
      plugins: {
        legend: {
          display: false,
          position: "bottom" as const,
        },
        tooltip: {
          callbacks: {
            label: (context: TooltipItem<"line">) => {
              const value = context.parsed.y
              const dateStr = context.dataset.label || ""
              if (value === null) return "Sin datos"

              try {
                const formattedDate = format(new Date(dateStr), "EEEE d 'de' MMMM", { locale: es })
                const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)
                return `${capitalizedDate}: ${value} ${unit || ""}`
              } catch {
                return `${dateStr}: ${value} ${unit || ""}`
              }
            },
          },
        },
        zoom: {
          pan: {
            enabled: true,
            mode: "x" as const,
          },
          zoom: {
            wheel: {
              enabled: true,
            },
            pinch: {
              enabled: true,
            },
            mode: "x" as const,
          },
        },
        annotation: {
          annotations: annotations as never,
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Hora",
          },
          grid: {
            display: false,
          },
        },
        y: {
          title: {
            display: true,
            text: `Valor (${unit || "PPM"})`,
          },
          beginAtZero: false,
        },
      },
    }
  }, [unit, thresholds])

  if (chartData.labels.length === 0) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center text-muted-foreground">
        No hay datos disponibles
      </div>
    )
  }

  const [chartKey, setChartKey] = useState(0)

  const handleResetZoom = () => {
    setChartKey((prev) => prev + 1)
  }

  const colors = [
    "rgb(59, 130, 246)",
    "rgb(239, 68, 68)",
    "rgb(34, 197, 94)",
    "rgb(249, 115, 22)",
    "rgb(168, 85, 247)",
    "rgb(236, 72, 153)",
    "rgb(20, 184, 166)",
    "rgb(234, 179, 8)",
  ]

  return (
    <div className="w-full">
      <div className="mb-4 p-3 border rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-medium">Fechas:</span>
          <button onClick={selectAll} className="text-sm text-blue-600 hover:underline">Todos</button>
        </div>
        <div className="flex flex-wrap gap-3">
          {dates.map((date) => {
            const isSelected = selectedDates.has(date)
            return (
              <div
                key={date}
                onClick={(e) => handleCheckboxChange(date, e as unknown as React.MouseEvent<HTMLLabelElement>)}
                className="flex items-center gap-2 cursor-pointer text-sm select-none"
              >
                <div className={`w-4 h-4 border rounded flex items-center justify-center ${isSelected ? 'bg-primary border-primary' : 'border-muted-foreground'}`}>
                  {isSelected && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-primary-foreground" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <span className={isSelected ? "text-foreground font-medium" : "text-muted-foreground"}>
                  {(() => {
                    const formatted = format(new Date(date + "T00:00:00"), "EEEE d 'de' MMMM", { locale: es })
                    const dayName = formatted.split(' ')[0].charAt(0).toUpperCase() + formatted.split(' ')[0].slice(1)
                    const rest = formatted.split(' ').slice(1).join(' ')
                    return `${dayName} ${rest}`
                  })()}
                </span>
              </div>
            )
          })}
        </div>
      </div>
      <div className="mb-2 flex justify-end">
        <button
          onClick={handleResetZoom}
          className="text-xs px-2 py-1 border rounded hover:bg-muted"
        >
          Reiniciar Zoom
        </button>
      </div>
      <div className="w-full h-[300px]" key={chartKey}>
        <DynamicLine data={chartData} options={options} />
      </div>
    </div>
  )
}

export type { ChartStatisticsHourProps, DayData, DataPoint }