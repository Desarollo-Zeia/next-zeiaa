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
import { formattedDate, formattedWithoutMonth } from '@/app/utils/func';

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

  console.log(readingsGraph)
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
  const dataPoints = readingsGraph?.map((item: any) => {
    return (
      {
        x: item.first_reading,
        y: item.difference,
      }
    )
  }
  ) || []

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
        type: "category",
        // time: { unit: "day" },
        ticks: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          callback: function (value: any, index: any) {
            const formattedDateX = formattedWithoutMonth(readingsGraph[index].first_reading)
            return formattedDateX
          }
        }

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
      tooltip: {
        callbacks: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          title: function (tooltipItems: any) {
            const formattedDateX = formattedDate(tooltipItems[0].label)
            return `${formattedDateX}`
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          label: function (context: any) {
            return `Consumo energético: ${context.formattedValue} kWh`
          }
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      }
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
