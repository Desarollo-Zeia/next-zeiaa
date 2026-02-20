'use client'
import React from 'react'
import NoResultsFound from '../../no-result'
import { DynamicBar } from '@/components/charts'
import { capitalizeFirstLetter, formattedWithoutMonth } from '@/app/utils/func'
import { es } from 'date-fns/locale'
import { format } from 'date-fns'


type Result = {
  date?: string,
  unbalanced_count?: number
}

type CurrentChartCountProps = {
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

export default function CurrentChartCount({ currentReadings }: { currentReadings?: CurrentChartCountProps[] }) {

  const { results = [], message } = currentReadings?.[0] ?? {}

  const dataPoints = results?.map((item: Result) => ({
    x: item.date ? `${item.date}T12:00:00` : '',
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
        type: "category",
        grid: {
          display: false
        },
        ticks: {
          font: { size: 11 }
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
          title: function (tooltipItems: Array<{ label: string }>) {
            const label = tooltipItems[0].label
            const date = new Date(label)
            const dateFormatted = capitalizeFirstLetter(format(date, "EEEE d 'de' MMMM", { locale: es }))
            return dateFormatted
          },
        }
      }
    },

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
