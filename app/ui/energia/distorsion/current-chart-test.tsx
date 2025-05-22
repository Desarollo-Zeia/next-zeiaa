// src/components/ThdiLineChart.jsx
'use client'
import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  TimeScale,
  Tooltip,
  Legend,
} from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";
import "chartjs-adapter-date-fns"; // Adaptador para manejo de fechas
import { es } from 'date-fns/locale';
import { format } from "date-fns";

export type CurrentReading = {
    date: string; // Ejemplo: '2025-04-16'
    time: string; // Ejemplo: '00:01'
    current: {
        THDIa: number;
        THDIb: number;
        THDIc: number;
    };
  };

// Registrar los componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  TimeScale,
  zoomPlugin,
  Legend
);

const CurrentChartTest = ({ currentReadings } : { currentReadings : CurrentReading[]}) => {
  // Preparar etiquetas y datos
  const labels = currentReadings.map(
    (item: CurrentReading) => `${item.date} ${item.time}`
  );
  const thdiaData = currentReadings.map((item) => item.current.THDIa);
  const thdibData = currentReadings.map((item) => item.current.THDIb);
  const thdicData = currentReadings.map((item) => item.current.THDIc);

  const data = {
    labels,
    datasets: [
      {
        label: "THDIa",
        data: thdiaData,
        borderColor: "#00c7a2",
        backgroundColor: "#00c7a2",
        fill: false,
        stepped: true,
        tension: 0,
        pointRadius: 2, 
      },
      {
        label: "THDIb",
        data: thdibData,
        borderColor: "#009ec7",
        backgroundColor: "#009ec7",
        fill: false,
        stepped: true,
        tension: 0,
        pointRadius: 2, 
      },
      {
        label: "THDIc",
        data: thdicData,
        borderColor: "#00c7b7",
        backgroundColor: "#00c7b7",
        fill: false,
        stepped: true,
        tension: 0,
        pointRadius: 2, 
      },
    ],
  }

  const options: any = { // eslint-disable-line @typescript-eslint/no-explicit-any
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
            mode: "x", // "x", "y" o "xy"
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
            mode: "xy", // Permite desplazar (pan) solo en el eje X. También puedes usar "y" o "xy".
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
          label: (ctx: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
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
          unit: "day", // Puedes ajustar la unidad a 'hour', 'day', etc.
          displayFormats: {
            minute: "HH:mm",
          },
        },
        ticks: {
            callback: function (value: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
            const date = new Date(value)
            return format(date, "PP", { locale: es }) // Formato de fecha
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
            display: false
        },
        tricks: {
            display: true
        }
      },
    },
  }


  return <Line data={data} options={options} />;
};

export default CurrentChartTest;
