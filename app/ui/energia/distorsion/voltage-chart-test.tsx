'use client'
import React from "react"
import { DynamicLine } from "@/components/charts"
import { es } from 'date-fns/locale'
import { format } from "date-fns"

export type VoltageReading = {
    date: string;
    time: string;
    voltage: {
      THDVr: number;
      THDVs: number;
      THDVt: number;
    };
  };
  

const VoltageChartTest = ({ voltageReadings } : { voltageReadings : VoltageReading[]}) => {
  // Preparar etiquetas y datos
  const labels = voltageReadings.map(
    (item) => `${item.date} ${item.time}`
  );
  const thdvrData = voltageReadings.map((item) => item.voltage.THDVr);
  const thdvsData = voltageReadings.map((item) => item.voltage.THDVs);
  const thdvtData = voltageReadings.map((item) => item.voltage.THDVt);

  const data = {
    labels,
    datasets: [
      {
        label: "THDVr",
        data: thdvrData,
        borderColor: "#ff7043",
        backgroundColor: "#ff7043",
        fill: false,
        stepped: false,
        tension: 0,
        pointRadius: 0,
      },
      {
        label: "THDVs",
        data: thdvsData,
        borderColor: "#ffb26b",
        backgroundColor: "#ffb26b",
        fill: false,
        stepped: false,
        tension: 0,
        pointRadius: 0,
      },
      {
        label: "THDVt",
        data: thdvtData,
        borderColor: "#00b0c7",
        backgroundColor: "#00b0c7",
        fill: false,
        stepped: false,
        tension: 0,
        pointRadius: 0,
      },
    ],
  };

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
        text: "THDV por Fase",
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
            const date = new Date(value);
            return format(date, "PP", { locale: es });
          }
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: "THDV (%)",
        },
        grid: {
          color: '#e5e7eb'
        },
        ticks: {
          display: true
        }
      },
    },
  };

  return <DynamicLine data={data} options={options} />; 
};

export default VoltageChartTest;
