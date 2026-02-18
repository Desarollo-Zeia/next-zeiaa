'use client'
import React from "react"
import { DynamicLine } from "@/components/charts"
import { es } from 'date-fns/locale'
import { format } from "date-fns"

export type VoltageReading = {
    date: string; // Ejemplo: '2025-04-16'
    time: string; // Ejemplo: '00:01'
    voltage: {
      THDUa: number;
      THDUb: number;
      THDUc: number;
    };
  };
  

// Registro centralizado en chart-registry

const VoltageChartTest = ({ voltageReadings } : { voltageReadings : VoltageReading[]}) => {
  // Preparar etiquetas y datos
  const labels = voltageReadings.map(
    (item) => `${item.date} ${item.time}`
  );
  const thduaData = voltageReadings.map((item) => item.voltage.THDUa);
  const thdubData = voltageReadings.map((item) => item.voltage.THDUb);
  const thducData = voltageReadings.map((item) => item.voltage.THDUc);

  const data = {
    labels,
    datasets: [
      {
        label: "THDUa",
        data: thduaData,
        borderColor: "#ff7043",
        backgroundColor: "#ff7043",
        fill: false,
        stepped: true,
        tension: 0,
        pointRadius: 2,
      },
      {
        label: "THDUb",
        data: thdubData,
        borderColor: "#ffb26b",
        backgroundColor: "#ffb26b",
        fill: false,
        stepped: true,
        tension: 0,
        pointRadius: 2,
      },
      {
        label: "THDUc",
        data: thducData,
        borderColor: "#00b0c7",
        backgroundColor: "#00b0c7",
        fill: false,
        stepped: true,
        tension: 0,
        pointRadius: 2,
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
        text: "THDU por Fase",
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
          display: false
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
          text: "THDU (%)",
        },
        grid: {
          display: false
        },
        tricks: {
          display: true
        }
      },
    },
  };

  return <DynamicLine data={data} options={options} />; 
};

export default VoltageChartTest;
