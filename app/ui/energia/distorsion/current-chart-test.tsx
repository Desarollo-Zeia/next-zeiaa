'use client'
import React from "react"
import { DynamicLine } from "@/components/charts"
import { es } from 'date-fns/locale'
import { format } from "date-fns"

export type CurrentReading = {
    date: string;
    time: string;
    current: {
        THDIr: number;
        THDIs: number;
        THDIt: number;
    };
  }

const CurrentChartTest = ({ currentReadings } : { currentReadings : CurrentReading[]}) => {

  // Preparar etiquetas y datos
  const labels = currentReadings.map(
    (item: CurrentReading) => `${item.date} ${item.time}`
  )

  const thdirData = currentReadings.map((item) => item.current.THDIr);
  const thdisData = currentReadings.map((item) => item.current.THDIs);
  const thditData = currentReadings.map((item) => item.current.THDIt);

  const data = {
    labels,
    datasets: [
      {
        label: "THDIr",
        data: thdirData,
        borderColor: "#00c7a2",
        backgroundColor: "#00c7a2",
        fill: false,
        stepped: false,
        tension: 0,
        pointRadius: 0,
      },
      {
        label: "THDIs",
        data: thdisData,
        borderColor: "#009ec7",
        backgroundColor: "#009ec7",
        fill: false,
        stepped: false,
        tension: 0,
        pointRadius: 0,
      },
      {
        label: "THDIt",
        data: thditData,
        borderColor: "#00c7b7",
        backgroundColor: "#00c7b7",
        fill: false,
        stepped: false,
        tension: 0,
        pointRadius: 0,
      },
    ],
  }

  const options: Record<string, unknown> = {
    interaction: {
        mode: 'nearest',
        axis: 'x',
        intersect: false
      },
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: false,
        text: "THDI por Fase",
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
            threshold: 2,
          },
           pan: {
            enabled: true,
            mode: "xy",
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
      tooltip: {
        backgroundColor: "white",
        titleColor: "#666",
        bodyColor: "#00b0c7",
        borderColor: "#e5e7eb",
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: (ctx: { dataset: { label?: string }; parsed: { y: number } }) => {
            const label = ctx.dataset.label || ''
            const val = ctx.parsed.y
            return `${label}: ${val.toFixed(2)}%`
          },
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
        },
        grid: {
            color: '#e5e7eb'
        },
        type: "time",
        time: {
          unit: "day",
          displayFormats: {
            minute: "HH:mm",
          },
        },
        ticks: {
            callback: function (value: string | number | Date) {
            const date = new Date(value)
            return format(date, "PP", { locale: es })
            }
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: "THDI (%)",
        },
        grid: {
            color: '#e5e7eb'
        },
        ticks: {
            display: true
        }
      },
    },
  }


  return <DynamicLine data={data} options={options} />;
};

export default CurrentChartTest;
