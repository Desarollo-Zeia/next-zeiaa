"use client"

import type { TooltipProps } from "recharts"
import NoResultFound from "../../no-result-found"
import { DynamicBar } from "@/components/charts"
import { format } from "date-fns"
import { es } from 'date-fns/locale'

interface TooltipPayloadItem {
  payload: {
    formattedTooltip: string
  }
  color: string
  dataKey: string
  value: number
}

export interface CustomTooltipProps {
  active?: boolean
  payload?: TooltipPayloadItem[]
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

  export function CustomTooltip({ active, payload }: CustomTooltipProps) {
    if (!active || !payload || payload.length === 0) {
      return null
    }
  
    // Extract data from the first payload item
    const data = payload[0].payload

    return (
      <div className="bg-white dark:bg-gray-800 p-3 border rounded-lg shadow-sm">
        <p className="text-sm font-medium mb-2">
          {data.formattedTooltip}
        </p>
  
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 text-xs mb-1">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span>
              {entry.dataKey === "THDIa"
                ? "THDI Fase A"
                : entry.dataKey === "THDIb"
                  ? "THDI Fase B"
                  : entry.dataKey === "THDIc"
                    ? "THDI Fase C"
                    : entry.dataKey}
              :
            </span>
            <span className="font-medium">S/ {entry.value}</span>
          </div>
        ))}
      </div>
    )
  }

export default function TarifarioChart({ data, group_by } : { data: DataPoint[], group_by?: string}) {

    const dataPoints = data?.map((item: DataPoint) => ({
      x: new Date(item.date), // Se convierte la fecha a objeto Date
      y: item.cost,
    })) || [];
  
     const dataLine = {
        datasets: [
          {
            label: `Costo`, // Se utiliza el indicador como label
            data: dataPoints,
            fill: false,
            backgroundColor: "#00b0c7",
            borderColor: "#00b0c7",
            stepped: true,
            tension: 0,
            pointRadius: 2, 
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
          scales: {
            x: {
              type: "time",
              time: {
                unit: group_by === 'day' ? 'day' : 'month', // Puedes ajustar la unidad a 'hour', 'day', etc.
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
                display: true,
                text: "Valor",
              },
              grid: {
                display: false,
                tickLength: 50
              },
              ticks: {
                display: true
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
                title: function (tooltipItems: Array<{ parsed: { x: number } }>) {
                  // tooltipItems es un array de elementos (en este caso de un único punto)
                  const date = new Date(tooltipItems[0].parsed.x);
                  return format(date, "PP p", { locale: es });
                },
                // Personalización de la etiqueta del tooltip
                label: function (context: { dataset: { label?: string }; parsed: { y: number } }) {
                  let label = context.dataset.label || "";
                  if (label) {
                    label += ": ";
                  }
                  // Se redondea el valor 'y' a dos decimales
                  label += `S/ ${context.parsed.y.toFixed(2)}`;
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

  // Formatear las fechas para mostrar solo el día y mes
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
    <div className="w-full p-6 bg-white rounded-lg">
      {
        data.length > 0 ? 
        (
           <DynamicBar data={dataLine} options={options}/>
        ) : 
        (
          <NoResultFound/>
        )
      }
  
    </div>
  )
}

