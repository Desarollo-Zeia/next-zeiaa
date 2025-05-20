"use client"

import type { TooltipProps } from "recharts"
import NoResultFound from "../../no-result-found"
import { format } from "date-fns"
import { es } from 'date-fns/locale';
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  PointElement,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend,
} from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";
import "chartjs-adapter-date-fns"; // Adaptador para manejo de fechas

ChartJS.register(LineElement, BarElement, PointElement, LinearScale, TimeScale, Tooltip, Legend, zoomPlugin)

const dateFormatWithHour = (dateStr: string) => {
  return format(new Date(dateStr), "PP", { locale: es })
}

interface DataPoint {
    date: string;
    consumption: number;
    cost: number;
    first_value: number;
    last_value: number;
    date_first_value: string;
    date_last_value: string;
    timestamp: string;
  }

  export interface ConsumoTooltipProps extends TooltipProps<any, any> { // eslint-disable-line @typescript-eslint/no-explicit-any
      active?: boolean
      payload?: any[] // eslint-disable-line @typescript-eslint/no-explicit-any
    }


  export function ConsumoTooltip({ active, payload }: ConsumoTooltipProps) {
    if (!active || !payload || payload.length === 0) {
      return null
    }
  
    // Extract data from the first payload item
    const data = payload[0].payload
    
    return (
      <div className="bg-white dark:bg-gray-800 p-3 border rounded-lg shadow-sm">
        <p className="text-sm font-medium mb-2">
          {dateFormatWithHour(data.date)}
        </p>
  
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 text-xs mb-1">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span>{entry.dataKey === "consumption" ? "Consumo" : entry.dataKey}:</span>
            <span className="font-medium">{entry?.value?.toFixed(2)} kWh</span>
          </div>
        ))}
  
        {/* <div className="mt-2 pt-2 border-t text-xs">
          <div className="flex justify-between">
            <span>Valor inicial:</span>
            <span className="font-medium">{data.first_value}</span>
          </div>
          <div className="flex justify-between">
            <span>Valor final:</span>
            <span className="font-medium">{data.last_value}</span>
          </div>
        </div> */}
      </div>
    )
  }
  

export default function ConsumoChart({ data } : { data: DataPoint[], group_by?: string}) {

  console.log(data)

  const dataPoints = data?.map((item : any ) => ({ // eslint-disable-line @typescript-eslint/no-explicit-any
    x: new Date(item.date), // Se convierte la fecha a objeto Date
    y: item.consumption,
    
  })) || [];

   const dataLine = {
      datasets: [
        {
          label: `hola`, // Se utiliza el indicador como label
          data: dataPoints,
          fill: false,
          borderColor: "#00b0c7",
          stepped: true,
          tension: 0,
          pointRadius: 2, 
        },
      ],
    }

      const options : any = {  // eslint-disable-line @typescript-eslint/no-explicit-any
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
            // ticks: {
            //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
            //   callback: function (value: any) {
            //     const date = new Date(value)
            //     return format(date, "PP", { locale: es }) // Formato de fecha
            //    }
            // },
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
            },
          },
        },
        plugins: {
          tooltip: {
            backgroundColor: "rgba(255, 255, 255)", // Cambia el fondo a un color claro
            titleColor: "#333", // Color para el título del tooltip
            bodyColor: "#333", // Color para el contenido del tooltip
            callbacks: {
              // Personalización del título del tooltip (ej. para formatear la fecha)
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              title: function (tooltipItems: any) {
                // tooltipItems es un array de elementos (en este caso de un único punto)
                const date = new Date(tooltipItems[0].parsed.x);
                return format(date, "PP p", { locale: es });
              },
              // Personalización de la etiqueta del tooltip
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              label: function (context: any) {
                let label = context.dataset.label || "";
                if (label) {
                  label += ": ";
                }
                // Se redondea el valor 'y' a dos decimales
                label += context.parsed.y.toFixed(2);
                return label;
              },
            },
          },
          zoom: {
            // wheel: {
    
            //   enabled: true,
            //   mode: "xy"
            // },
            // pan: {
            //   enabled: true,
            //   mode: "xy", // Permite desplazar (pan) solo en el eje X. También puedes usar "y" o "xy".
            // },
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
          decimation: { 
            enabled: true,
            algorithm: 'lttb',
            samples: 20, // Aumenta este valor para conservar más detalles
            threshold: 5
          },
          legend: {
            display: false
          }
        }
      }
  
  // const formattedData = data?.map((item) => {
  //   const dateHours = `${dateFormatWithHour(item.date_first_value)}`
  //   const dateMonth = `${dateFormatWithDay(item.date_first_value)} - ${dateFormatWithDay(item.date_last_value)}`

  //   const formattedTooltip = group_by === 'day' ? dateHours : dateMonth
  //   return {
  //     ...item,
  //     formattedTooltip,
  //   }
  // })

  return (
    <div className="min-w-[640px] min-h-[540px] bg-white rounded-lg shadow">
      {
        data.length > 0 ? (
          <Bar data={dataLine} options={options} className="w-full h-full"/>
        ) : (
          <NoResultFound/>
        )
      }
  
    </div>
  )
}

