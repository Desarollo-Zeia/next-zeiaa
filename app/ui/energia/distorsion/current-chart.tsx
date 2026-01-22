"use client"

import { DynamicLine } from "@/components/charts"

// Definición de tipos para los datos THDI
interface THDICurrent {
  THDIa: number
  THDIb: number
  THDIc: number
}

interface THDIDataPoint {
  date: string
  time: string
  current: THDICurrent
}

// Colores para las fases
const PHASE_COLORS = {
  THDIa: "#2563eb", // blue
  THDIb: "#16a34a", // green
  THDIc: "#dc2626", // red
}

const dateFormat = (date: string) => {
  const dateObject = new Date(date)

  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    day: "numeric",
    month: "long",
  }

  const formattedDate = new Intl.DateTimeFormat("es-ES", options).format(
    dateObject
  );

  const finalDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)

  return finalDate
}

export default function CurrentChart({ currentReadings }: { currentReadings: THDIDataPoint[] }) {
  const labels = currentReadings.map((item) => item.time)
  const formattedDates = currentReadings.map((item) => dateFormat(item.date))

  const chartData = {
    labels,
    datasets: [
      {
        label: "THDI Fase A",
        data: currentReadings.map((item) => item.current.THDIa),
        borderColor: PHASE_COLORS.THDIa,
        backgroundColor: "transparent",
        stepped: true,
        borderWidth: 1,
        pointRadius: 0,
        pointHoverRadius: 4,
      },
      {
        label: "THDI Fase B",
        data: currentReadings.map((item) => item.current.THDIb),
        borderColor: PHASE_COLORS.THDIb,
        backgroundColor: "transparent",
        stepped: true,
        borderWidth: 1,
        pointRadius: 0,
        pointHoverRadius: 4,
      },
      {
        label: "THDI Fase C",
        data: currentReadings.map((item) => item.current.THDIc),
        borderColor: PHASE_COLORS.THDIc,
        backgroundColor: "transparent",
        stepped: true,
        borderWidth: 1,
        pointRadius: 0,
        pointHoverRadius: 4,
      },
    ],
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      x: {
        grid: { 
          display: true,
          color: '#e5e7eb',
          drawBorder: false,
        },
        ticks: { 
          font: { size: 12 },
          maxRotation: 45,
          minRotation: 45,
        }
      },
      y: {
        grid: { 
          color: '#e5e7eb',
          drawBorder: false,
        },
        ticks: { font: { size: 12 } }
      }
    },
    plugins: {
      tooltip: {
        backgroundColor: "white",
        titleColor: "#333",
        bodyColor: "#666",
        borderColor: "#e5e7eb",
        borderWidth: 1,
        padding: 12,
        callbacks: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          title: function(tooltipItems: any) {
            const index = tooltipItems[0].dataIndex
            return `${formattedDates[index]} - ${labels[index]}`
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          label: function(context: any) {
            return `${context.dataset.label}: ${context.parsed.y} %`
          }
        }
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
      legend: {
        display: true,
        position: 'top',
      }
    }
  }

  return (
    <div className="w-full p-6 bg-white dark:bg-gray-800 rounded-lg">
      <div className="h-[350px]">
        <DynamicLine data={chartData} options={options} />
      </div>
    </div>
  )
}

