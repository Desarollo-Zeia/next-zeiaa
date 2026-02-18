"use client"

import { DynamicLine } from "@/components/charts"

// Definición de tipos para los datos THDU
interface THDUVoltage {
  THDUa: number
  THDUb: number
  THDUc: number
}

interface THDUDataPoint {
  date: string
  time: string
  voltage: THDUVoltage
}

// Colores para las fases
const PHASE_COLORS = {
  THDUa: "#2563eb", // blue
  THDUb: "#16a34a", // green
  THDUc: "#dc2626", // red
}

export default function VoltageChart({ voltageReadings }: { voltageReadings: THDUDataPoint[] }) {
  const labels = voltageReadings.map((item) => item.time)
  
  const chartData = {
    labels,
    datasets: [
      {
        label: "THDU Fase A",
        data: voltageReadings.map((item) => item.voltage.THDUa),
        borderColor: PHASE_COLORS.THDUa,
        backgroundColor: "transparent",
        stepped: true,
        borderWidth: 1,
        pointRadius: 0,
        pointHoverRadius: 4,
      },
      {
        label: "THDU Fase B",
        data: voltageReadings.map((item) => item.voltage.THDUb),
        borderColor: PHASE_COLORS.THDUb,
        backgroundColor: "transparent",
        stepped: true,
        borderWidth: 1,
        pointRadius: 0,
        pointHoverRadius: 4,
      },
      {
        label: "THDU Fase C",
        data: voltageReadings.map((item) => item.voltage.THDUc),
        borderColor: PHASE_COLORS.THDUc,
        backgroundColor: "transparent",
        stepped: true,
        borderWidth: 1,
        pointRadius: 0,
        pointHoverRadius: 4,
      },
    ],
  }

  const options: Record<string, unknown> = {
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
        ticks: { font: { size: 12 } }
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
          title: function(tooltipItems: Array<{ dataIndex: number }>) {
            const index = tooltipItems[0].dataIndex
            const item = voltageReadings[index]
            const date = new Date(item.date)
            const formattedDate = date.toLocaleDateString("es-ES", { day: 'numeric', month: 'short' })
            return `${formattedDate} - ${item.time}`
          },
          label: function(context: { dataset: { label: string }; parsed: { y: number } }) {
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

