'use client'

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
import NoResultsFound from '../../no-result';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

type DayValues = {
  superior: number
  inferior: number
}

type VoltageByDay = {
  workdays: DayValues
  saturday: DayValues
  sunday: DayValues
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function BarChart({ readingsGraph, weekday, thresholds }: { readingsGraph: any[], weekday?: string, thresholds?: VoltageByDay }) {

  const inferiorThreshold =
    weekday === '1,2,3,4,5'
      ? thresholds?.workdays.inferior
      : weekday === '6'
        ? thresholds?.saturday.inferior
        : thresholds?.sunday.inferior

  const superiorThreshold =
    weekday === '1,2,3,4,5'
      ? thresholds?.workdays.superior
      : weekday === '6'
        ? thresholds?.saturday.superior
        : thresholds?.sunday.superior

  // 🔹 Normalizar fechas como ISO string -> determinista
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dataPoints = readingsGraph?.map((item: any) => ({
    x: new Date(item.first_reading).toISOString(),
    y: item.difference,
  })) || []

  const data = {
    datasets: [
      {
        label: 'Consumo',
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
            `${val.toFixed(2)} ${readingsGraph[0]?.unit || ''}`,
        },
      },
    },
    plugins: {
      legend: { display: false },
      annotation: {
        annotations: {
          inferior: inferiorThreshold ? {
            type: 'line',
            yMin: inferiorThreshold,
            yMax: inferiorThreshold,
            borderColor: '#59AC77',
            borderWidth: 2,
            borderDash: [5, 5],
            label: {
              display: true,
              color: 'white',
              backgroundColor: '#59AC77',
              content: [`${inferiorThreshold} KWh`],
              xAdjust: 80,
            },
          } : undefined,
          superior: superiorThreshold ? {
            type: 'line',
            yMin: superiorThreshold,
            yMax: superiorThreshold,
            borderColor: '#DC143C',
            borderWidth: 2,
            borderDash: [5, 5],
            label: {
              display: true,
              color: 'white',
              backgroundColor: '#DC143C',
              content: [`${superiorThreshold} KWh`],
              xAdjust: -80,
            },
          } : undefined,
        },
      },
    },
  }

  return (
    <div className="w-full h-full">
      {readingsGraph?.length > 0 ? (
        <Bar options={options} data={data} />
      ) : (
        <NoResultsFound message='No se encontraron datos para el gráfico' />
      )}
    </div>
  )
}
