'use client'

import { useMemo } from 'react'
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
  type ChartOptions,
  type TooltipItem,
  type Scale,
} from "chart.js";
import "chartjs-adapter-date-fns";
import NoResultsFound from '../../no-result';
import { formattedDate, formattedWithoutMonth } from '@/app/utils/func';
import { getThresholdsByWeekday, type VoltageByDay } from '@/app/utils/thresholds';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

interface ReadingGraphItem {
  first_reading: string
  difference: number
  unit?: string
}

export default function BarChart({ readingsGraph, weekday, thresholds }: { readingsGraph: ReadingGraphItem[], weekday?: string, thresholds?: VoltageByDay }) {
  const { inferior: inferiorThreshold, superior: superiorThreshold } = useMemo(
    () => getThresholdsByWeekday(thresholds, weekday || ''),
    [thresholds, weekday]
  )

  // 🔹 Normalizar fechas como ISO string -> determinista
  const dataPoints = readingsGraph?.map((item: ReadingGraphItem) => {
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

  const options: ChartOptions<'bar'> = {
    responsive: true,
    scales: {
      x: {
        type: "category",
        ticks: {
          callback: function (_value: string | number, index: number) {
            const formattedDateX = formattedWithoutMonth(readingsGraph[index].first_reading)
            return formattedDateX
          }
        }

      },
      y: {
        ticks: {
          callback: function(this: Scale, val: string | number) {
            const numVal = typeof val === 'string' ? parseFloat(val) : val
            return `${numVal.toFixed(2)} ${readingsGraph[0]?.unit || ''}`
          },
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
              content: `${inferiorThreshold} KWh`,
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
              content: `${superiorThreshold} KWh`,
              xAdjust: -80,
            },
          } : undefined,
        },
      },
      tooltip: {
        callbacks: {
          title: function (tooltipItems: TooltipItem<'bar'>[]) {
            const formattedDateX = formattedDate(tooltipItems[0].label)
            return `${formattedDateX}`
          },
          label: function (context: TooltipItem<'bar'>) {
            return `Consumo energético: ${context.formattedValue} kWh`
          }
        },
      }
    },
  }

  return (
    <div className="w-full h-[400px]">
      {readingsGraph?.length > 0 ? (
        <Bar options={options} data={data} />
      ) : (
        <NoResultsFound message='No se encontraron datos para el gráfico' />
      )}
    </div>
  )
}
