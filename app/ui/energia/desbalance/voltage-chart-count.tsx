'use client'
import React from 'react'
import NoResultsFound from '../../no-result'
import { DynamicBar } from '@/components/charts'



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
        type: "time",
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
