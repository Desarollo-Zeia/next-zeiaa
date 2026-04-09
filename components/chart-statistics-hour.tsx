"use client"

import { useMemo } from "react"
import { DynamicLine } from "@/components/charts/dynamic-charts"
import type { TooltipItem } from "chart.js"

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

interface ChartStatisticsHourProps {
  data: DayData
  selectedDate?: string
  indicator?: string
}

export function ChartStatisticsHour({
  data,
  selectedDate,
  indicator = "CO2",
}: ChartStatisticsHourProps) {
  const chartData = useMemo(() => {
    const dates = Object.keys(data).sort()

    const allHours = new Set<string>()
    Object.values(data).forEach((dayData) => {
      dayData
        .filter((item) => item.indicator === indicator)
        .forEach((item) => allHours.add(item.hour))
    })
    const labels = Array.from(allHours).sort()

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

    const datasets = dates.map((date, index) => {
      const dayData = data[date] || []
      const filteredData = dayData.filter(
        (item) => item.indicator === indicator
      )

      const valueMap = new Map(filteredData.map((item) => [item.hour, item.value]))
      const values = labels.map((hour) => valueMap.get(hour) ?? null)

      const color = colors[index % colors.length]

      return {
        label: date,
        data: values,
        borderColor: color.border,
        backgroundColor: color.bg,
        fill: false,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: color.border,
        spanGaps: true,
      }
    })

    return { labels, datasets }
  }, [data, indicator])

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: "index" as const,
        intersect: false,
      },
      plugins: {
        legend: {
          display: true,
          position: "bottom" as const,
        },
        tooltip: {
          callbacks: {
            label: (context: TooltipItem<"line">) => {
              const value = context.parsed.y
              return value !== null ? `${context.dataset.label}: ${value} PPM` : "Sin datos"
            },
          },
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
            text: "Valor (PPM)",
          },
          beginAtZero: false,
        },
      },
    }),
    []
  )

  return (
    <div className="w-full h-[300px]">
      <DynamicLine data={chartData} options={options} />
    </div>
  )
}

export type { ChartStatisticsHourProps, DayData, DataPoint }