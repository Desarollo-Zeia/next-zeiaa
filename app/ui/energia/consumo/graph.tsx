"use client";
import React, { useTransition } from "react";
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
import zoomPlugin from "chartjs-plugin-zoom";
import "chartjs-adapter-date-fns"; // Adaptador para manejo de fechas
import { es } from 'date-fns/locale';
import { format } from "date-fns";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ELECTRIC_PARAMETERS } from "@/app/utils/formatter";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import DeviceReadingsChart from "./measurement-graph";
import NoResultFound from "../../no-result-found";
import annotationPlugin from 'chartjs-plugin-annotation';

// Registro de componentes en ChartJS
ChartJS.register(LineElement, PointElement, LinearScale, TimeScale, Tooltip, Legend, zoomPlugin, annotationPlugin)

const energyToggleArray =  [
  { label: "Hora", value: "none" },
  { label: "Día", value: "day" },
  { label: "Semana", value: "week" },
  { label: "Mes", value: "month" },
]
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SimpleLineChart = ({ readingsGraph, category, indicator, last_by } : { readingsGraph: any, category: any, indicator: any, last_by: any}) => { 

  console.log(readingsGraph)

  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const pathname = usePathname()
  const { replace } = useRouter()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dataPoints = readingsGraph?.map((item : any ) => ({
    x: new Date(item.first_reading), // Se convierte la fecha a objeto Date
    y: item.first_value,
    
  })) || []

  const handleFrequency = (frequency: string) => {
    startTransition(() => {
      const newParams = new URLSearchParams(searchParams)
    
      newParams.set('last_by', frequency);

      if (frequency) {
        newParams.set('last_by', frequency)
      }

      if (frequency === 'none') {
        newParams.delete('last_by')
      }

      replace(`${pathname}?${newParams.toString()}`, { scroll: false });
    });
  }

  // Estructura de los datos para el gráfico
  const data = {
    datasets: [
      {
        label: `${ELECTRIC_PARAMETERS[indicator as keyof typeof ELECTRIC_PARAMETERS].parameter}`, // Se utiliza el indicador como label
        data: dataPoints,
        fill: false,
        borderColor: "#00b0c7",
        stepped: true,
        tension: 0,
        pointRadius: 2, 
      },
     
    ],
  }

  // Opciones para configurar el gráfico, usando una escala de tiempo en el eje X
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const options : any = {
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
          display: true,
          text: "",
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
      },
       annotation: {
        annotations: {
           line1: {
            display: category === 'voltage' ? true : false,
            type: 'line',
            yMin: 209,
            yMax: 209,
            borderColor: '#000',
            borderWidth: 2,
            borderDash: [5, 5],
            label: {
              display: true,
              color: 'white',
              backgroundColor: '#000',
              content: ['209 v'],
            }
          },
          line2: {
          display: category === 'voltage' ? true : false,
          type: 'line',
          yMin: 231,
          yMax: 231,
          borderColor: '#000',
          borderWidth: 2,
          borderDash: [5, 5],
          label: {
            display: true,
            color: 'white',
            backgroundColor: '#000',
            content: ['231 v'],
          }
          },
        }
      }
    },
    
  }

  return (
    <div className="flex-1 w-full h-lvh p-4 bg-white flex flex-col justify-center items-center relative">
      {
        readingsGraph?.length > 0 && (
          <ToggleGroup type="single"  defaultValue={last_by || 'none'} onValueChange={handleFrequency}   aria-label="Frequency" className="flex gap-2 top-0 mt-4 absolute">
            {
              category !== 'energy'? 
              (
                <ToggleGroupItem value="hour" className={"w-[120px] h-[40px] bg-[#00b0c7] text-white"} disabled>
                  Hora
                </ToggleGroupItem>
              ) : (
                <>
                  {
                    energyToggleArray.map(times => (
                      <ToggleGroupItem
                        key={times.value}
                        value={times.value}
                        className={`w-[120px] h-[40px] ${times.value === last_by ? 'bg-[#00b0c7] text-white' : 'bg-gray-100 text-black'}`}
                      >
                        {
                          isPending ? 
                          (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50">
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                            </div>
                          ) : (
                            <>
                              {times.label}
                            </>
                          )
                        }
                      </ToggleGroupItem>
                    ))
                  }
                </>
              )
            }
            
          </ToggleGroup>
        )
      }
    
      { readingsGraph.length > 0  && <h2 className="mb-4 font-semibold text-xl">Gráfica de {ELECTRIC_PARAMETERS[indicator as keyof typeof ELECTRIC_PARAMETERS].parameter}</h2>}
      <>
        {
          readingsGraph.length <= 0 ? (
            <NoResultFound/>
          ) : (
            <>
              {
                last_by === 'minute' ? (
                  <div className="w-full">
                    <Line data={data} options={options} />
                  </div>
                ) : (
                  <DeviceReadingsChart data={readingsGraph} last_by={last_by}/>
                )
              }
            </>
          )
        }
      </>
    </div>
  );
};

export default SimpleLineChart;
