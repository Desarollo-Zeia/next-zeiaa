"use client";
import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend,
} from "chart.js";
import "chartjs-adapter-date-fns"; // Adaptador para manejo de fechas
import { es } from 'date-fns/locale';
import { format } from "date-fns";

// Registro de componentes en ChartJS
ChartJS.register(LineElement, PointElement, LinearScale, TimeScale, Tooltip, Legend);

const SimpleLineChart = ({ readingsGraph, category, unit }) => {
  // Se transforma el JSON para obtener un array de puntos de datos
  // En cada punto se toma la fecha de "first_reading" y el valor "first_value"
  const dataPoints = readingsGraph.map((item) => ({
    x: new Date(item.first_reading), // Se convierte la fecha a objeto Date
    y: item.first_value,
    
  }));

  // Estructura de los datos para el gráfico
  const data = {
    datasets: [
      {
        label: "EPpos", // Se utiliza el indicador como label
        data: dataPoints,
        fill: false,
        borderColor: "#00b0c7",
        tension: 0.2,
        pointRadius: 0,
      },
    ],
  };

  // Opciones para configurar el gráfico, usando una escala de tiempo en el eje X
  const options = {
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    },
    responsive: true,
    scales: {
      x: {
        type: "time",
        time: {
          unit: "day", // Puedes ajustar la unidad a 'hour', 'day', etc.
          displayFormats: {
            minute: "HH:mm",
            
          },
        },
        ticks: {
          callback: function (value) {
            console.log(value);
            const date = new Date(value)
            return format(date, "PP", { locale: es }) // Formato de fecha
           }
        },
        title: {
          display: false,
          text: "Hora de Lectura",
        },
        grid: {
          display: false,
          tickLength: 50
        },
      },
      y: {
        title: {
          display: false,
          text: "Valor",
        },
        grid: {
          display: false,
          tickLength: 50
        },
        ticks: {
          display: false
        }
      },
    },
    plugins: {
      decimation: { 
        enabled: true,
        algorithm: 'lttb',
        samples: 10,
        threshold: 5
      },
      legend: {
        display: false
      }
    }
  };

  return (
    <div className="flex-1 w-full h-lvh p-4 bg-white flex flex-col justify-center items-center">
      <h2>Gráfica de Línea de {category}</h2>
      <Line data={data} options={options} />
    </div>
  );
};

export default SimpleLineChart;
