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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ELECTRIC_PARAMETERS } from "@/app/utils/formatter";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import DeviceReadingsChart from "./measurement-graph";
import NoResultFound from "../../no-result-found";
import annotationPlugin from 'chartjs-plugin-annotation';

ChartJS.register(LineElement, PointElement, LinearScale, TimeScale, Tooltip, Legend, zoomPlugin, annotationPlugin)

const energyToggleArray = [
  { label: "Hora", value: "none" },
  { label: "Día", value: "day" },
  { label: "Semana", value: "week" },
  { label: "Mes", value: "month" },
]
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SimpleLineChart = ({ readingsGraph, category, indicator, last_by, readings }: { readingsGraph: any, category: any, indicator: any, last_by: any, readings: any }) => {


  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const pathname = usePathname()
  const { replace } = useRouter()

  const indicatorsObject = readings?.results?.[0]?.indicators?.values

  const avaibleIndicators = [] as Array<string>

  for (const key in indicatorsObject) {
    if (indicatorsObject[key] !== null) {
      avaibleIndicators.push(key)
    }
  }

  console.log(avaibleIndicators?.length === 0)

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString)

    // Formatear la fecha como "Jueves, 12 de noviembre"
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      day: "numeric",
      month: "long"
    }
    let formattedDate = date.toLocaleDateString("es-ES", options)

    // Capitalizar la primera letra en caso de que no lo esté
    formattedDate =
      formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)

    // Formatear la hora como HH:MM
    const hours = date.getHours().toString().padStart(2, "0")
    const minutes = date.getMinutes().toString().padStart(2, "0")
    const formattedTime = `${hours}:${minutes}`

    return { date: formattedDate, time: formattedTime }
  }


  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dataPoints = readingsGraph?.map((item: any) => ({
    x: new Date(item.first_reading).toISOString(),
    y: item.first_value,

  })) || []

  const handleFrequency = (frequency: string) => {
    startTransition(() => {
      const newParams = new URLSearchParams(searchParams);

      // Por defecto, establece last_by al valor de frequency
      // Esto asegura que si frequency es 'day', 'week', etc., se establezca correctamente.
      newParams.set('last_by', frequency);

      // CASO ESPECIAL 1: frequency es 'none' y category NO es 'energy'
      // En este caso, eliminamos 'last_by'
      if (frequency === 'none' && category !== 'energy') {
        newParams.delete('last_by');
      }
      // CASO ESPECIAL 2: frequency es 'none' y category SÍ es 'energy'
      // En este caso, last_by debe ser 'hour'.
      // Esta condición se activa después de que 'last_by' ya se haya establecido a 'none'
      // por la línea por defecto, por lo que la sobrescribimos.
      else if (frequency === 'none' && category === 'energy') {
        newParams.set('last_by', 'hour');
      }
      // Para todos los demás casos (frequency no es 'none'),
      // newParams.set('last_by', frequency) ya hizo el trabajo correcto.
      // No necesitamos un 'else' que sobrescriba con 'hour'.

      replace(`${pathname}?${newParams.toString()}`, { scroll: false });
    });
  };

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const options: any = {
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    },
    responsive: true,
    scales: {
      x: {
        type: "time",
        time: { unit: "day" },
        title: {
          display: false,
          text: "Hora de Lectura",
        },
        grid: {
          display: true,
          tickLength: 50
        },

      },
      y: {
        title: {
          display: true,
          // text: readingsGraph[0]?.unit,
        },
        grid: {
          display: true,
          tickLength: 50
        },
        ticks: {
          display: true,
          callback: function (val: any) { // eslint-disable-line @typescript-eslint/no-explicit-any 
            // Hide every 2nd tick label
            return `${val.toFixed(2)} ${readingsGraph[0]?.unit}`
          },
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
            // const date = new Date(tooltipItems[0].parsed.x);
            const { date, time } = formatDateTime(tooltipItems[0].parsed.x)
            return `${date} ${time}`; // Formato personalizado
          },
          // Personalización de la etiqueta del tooltip
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          label: function (context: any) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            // Se redondea el valor 'y' a dos decimales
            label += context.parsed.y.toFixed(2) + ' ' + readingsGraph[0]?.unit;
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
    <div className="flex-1 w-full min-h-full p-4 bg-white flex flex-col justify-center items-center relative">
      {
        readingsGraph?.length > 0 && (
          <ToggleGroup type="single" defaultValue={last_by || 'none'} value={last_by || 'none'} onValueChange={handleFrequency} aria-label="Frequency" className="flex gap-2 top-0 mt-4 absolute">
            {
              category !== 'energy' ?
                (
                  // <ToggleGroupItem value="hour" className={"w-[120px] h-[40px] bg-[#00b0c7] text-white"} disabled>
                  //   Hora
                  // </ToggleGroupItem>
                  <></>
                ) : (
                  <>
                    {
                      energyToggleArray.map(times => (
                        <ToggleGroupItem
                          key={times.value}
                          value={times.value}
                          className={`w-[120px] h-[40px] ${times.value === last_by
                            ? 'bg-[#00b0c7] text-white'
                            : 'bg-gray-100 text-black'
                            } ${last_by === 'hour' && times.value === 'none' ? 'bg-[#00b0c7] text-white' : 'bg-gray-100 text-black'}`}
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

      {avaibleIndicators?.length === 0 ? <h2 className="mb-4 font-semibold text-xl">Gráfica de {ELECTRIC_PARAMETERS[indicator as keyof typeof ELECTRIC_PARAMETERS].parameter}</h2> : ''}
      <>
        {
          avaibleIndicators?.length === 0 ? (
            <NoResultFound />
          ) : (
            <>
              {
                last_by === 'minute' ? (
                  <div className="w-full">
                    <Line data={data} options={options} />
                  </div>
                ) : (
                  <DeviceReadingsChart data={readingsGraph} last_by={last_by} />
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
