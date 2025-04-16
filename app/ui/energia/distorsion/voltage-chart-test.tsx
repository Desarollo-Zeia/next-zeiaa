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
import "chartjs-adapter-date-fns";
import { es } from 'date-fns/locale';
import { format } from "date-fns";

export type VoltageReading = {
    date: string; // Ejemplo: '2025-04-16'
    time: string; // Ejemplo: '00:01'
    voltage: {
      THDUa: number;
      THDUb: number;
      THDUc: number;
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
  
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  const options : any = {
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
          callback: function (value : any) {
            const date = new Date(value);
            return format(date, "PP", { locale: es });
          }
        },
      },
      y: {
        display: false,
        title: {
          display: true,
          text: "THDU (%)",
        },
        grid: {
          display: false
        },
        tricks: {
          display: false
        }
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default VoltageChartTest;
