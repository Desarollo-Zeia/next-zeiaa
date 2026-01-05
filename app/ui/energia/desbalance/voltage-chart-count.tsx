'use client'
import React from 'react'
import NoResultsFound from '../../no-result'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";
import "chartjs-adapter-date-fns";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);



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


  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const options: any = {
    responsive: true,
    scales: {
      x: {
        type: "time",
        time: { unit: "day" },

      },
      y: {
        ticks: {
          callback: (val: number) =>
            `${val}`,
        },
      },
    },
    plugins: {
      legend: { display: false },
    }
  }

  return (
    <div className="w-full h-full">
      {results?.length > 0 ? (
        <Bar options={options} data={data} />
      ) : (
        <NoResultsFound message={message} />
      )}
    </div>
  )
}
