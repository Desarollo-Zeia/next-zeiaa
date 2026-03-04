'use client'
import React from 'react'
import NoResultsFound from '../../no-result'
import { DynamicBar } from '@/components/charts'
import { capitalizeFirstLetter } from '@/app/utils/func'
import { es } from 'date-fns/locale'
import { format } from 'date-fns'



type Result = {
  date?: string,
  unbalanced_count?: number
}

type VoltageChartCountProps = {
  measurement_point?: {
    measurement_point_id?: number
    measurement_point_name?: string
  }
  device?: {
    device_id?: number
    device_name?: string
    dev_eui?: string
  }
  date_range?: {
    date_after?: string
    date_before?: string
  }
  results?: Result[]
  message?: string
}

export default function VoltageChartCount({ voltageReadings }: { voltageReadings?: VoltageChartCountProps[] }) {

  const { results = [], message } = voltageReadings?.[0] ?? {}

  const dataPoints = results?.map((item: Result) => ({
    x: item.date ? `${item.date}T12:00:00Z` : '',
    y: item.unbalanced_count,
  })) || []

  const data = {
    datasets: [
      {
        label: 'N° de desbalances',
        data: dataPoints,
        backgroundColor: "#00b0c7",
        borderColor: "#00b0c7",
      },
    ],
  }


  const options: Record<string, unknown> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: "time",
        adapters: {
          date: {
            locale: es,
          },
        },
        time: {
          unit: 'day',
          displayFormats: {
            day: "d 'de' MMMM",
          },
        },
        grid: {
          display: false
        },
        ticks: {
          font: { size: 11 },
          callback: function (val: number | string) {
            const date = new Date(Number(val))
            if (Number.isNaN(date.getTime())) return ''
            const formattedDate = format(date, "d 'de' MMMM", { locale: es })
            const [day, month] = formattedDate.split(' de ')
            return month ? `${day} de ${capitalizeFirstLetter(month)}` : formattedDate
          },
        }

      },
      y: {
        grid: {
          color: '#e5e7eb'
        },
        ticks: {
          font: { size: 11 },
          callback: (val: number) =>
            `${val}`,
        },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "white",
        titleColor: "#666",
        bodyColor: "#00b0c7",
        borderColor: "#e5e7eb",
        borderWidth: 1,
        padding: 12,
        callbacks: {
          title: function (tooltipItems: Array<{ parsed?: { x?: number } }>) {
            const x = tooltipItems?.[0]?.parsed?.x
            if (!x) return ''
            const date = new Date(x)
            if (Number.isNaN(date.getTime())) return ''
            return capitalizeFirstLetter(format(date, "EEEE d 'de' MMMM", { locale: es }))
          },
        },
      },
    }
  }

  if (results?.length === 0 || !results) {
    return (
      <div className="w-full h-full">
        <NoResultsFound message={message} />
      </div>
    )
  }

  return (
    <div className="w-full h-full">
      <DynamicBar options={options} data={data} />
    </div>
  )
}
