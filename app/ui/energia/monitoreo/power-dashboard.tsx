"use client"

import { useTransition } from "react"
import { format } from "date-fns"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { useSearchParams, usePathname, useRouter } from 'next/navigation'
import NoResultFound from "../../no-result-found"
import { DynamicLine } from "@/components/charts"
import { es } from 'date-fns/locale'
import { capitalizeFirstLetter } from "@/app/utils/func"

interface DeviceInfo {
  id: number
  name: string
  dev_eui: string
}

interface MeasurementPoint {
  id: number
  measurement_point_name: string
  power: number
}

interface PowerReading {
  created_at: string
  device: DeviceInfo
  values_per_channel: MeasurementPoint[]
  unit: string
}

interface Powers {
  id: number
  power_installed: number
  power_contracted: number
  power_max: number
}

// Transformar los datos del JSON al formato esperado por el gráfico

// Convertir los datos al formato esperado por el gráfico

// const CustomTooltip = ({ active, payload, label }: any) => {  
//   // eslint-disable-line @typescript-eslint/no-explicit-any

//   const date = new Date(label)
//   const hour = date.getHours()
//   const minute = date.getMinutes()

//   const hourFormatted = hour.toString().padStart(2, "0")
//   const minuteFormatted = minute.toString().padStart(2, "0")

//   const current = `${hourFormatted}:${minuteFormatted}`

//   const start = hoursToMinutes('18:00')
//   const end = hoursToMinutes('23:00')
//   const compared = hoursToMinutes(current)

//   if (active && payload && payload.length) {  

//     return (
//       <div className="bg-white p-3 border rounded-lg shadow-sm">
//         {/* <p className="text-sm font-medium mb-2">{formatTime(label)}</p> */}
//         <div className="flex items-center gap-2 text-xs">
//           <span className="w-2 h-2 rounded-full bg-[#0ea5e9]" />
//           <span>Potencia actual:</span>
//           <span className="font-medium">{payload[0].value} kW</span>
//         </div>
//         {compared > start && compared < end && 
//           <div className="flex items-center gap-2 text-xs">
//             <div className="w-2 h-2 rounded-full bg-red-600"/>
//             <span>Dentro de la hora punta</span>
//           </div>
//         }
//       </div>
//     )
//   }
//   return null
// }

export default function PowerUsageChart({ readings, group, powers }: { readings: PowerReading[], group?: string, powers: Powers[] }) {

  const { power_contracted, power_max } = powers?.[0]

  const [isPending, startTransition] = useTransition()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  const dataPoints = readings?.map((item: any) => ({ // eslint-disable-line @typescript-eslint/no-explicit-any
    x: new Date(item?.created_at).toISOString(),
    y: item.values_per_channel?.[0].power,
  })) || []

  const handleGroupChange = (group: string) => {
    startTransition(() => {
      const newParams = new URLSearchParams(searchParams);

      newParams.set('group_by', 'day');

      if (group) {
        newParams.set('group_by', group);
      }

      // if (group === 'hour') {
      //   newParams.delete('group_by');
      // }

      replace(`${pathname}?${newParams.toString()}`, { scroll: false })
    })
  }

  const data = {
    datasets: [
      {
        label: readings?.[0]?.values_per_channel?.[0]?.measurement_point_name, // Se utiliza el indicador como label
        data: dataPoints,
        fill: false,
        borderColor: "#00b0c7",
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
        grid: {
          display: true,
          tickLength: 50
        },

        ticks: {
          display: true,
          callback: function (val: any) { // eslint-disable-line @typescript-eslint/no-explicit-any 
            // Hide every 2nd tick label
            return `${val} kW`
          },
        }
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
            const date = new Date(tooltipItems[0].parsed.x)
            const dateFormatted = capitalizeFirstLetter(format(date, "EEEE d 'de' MMMM", { locale: es }))
            return dateFormatted
          },
          // Personalización de la etiqueta del tooltip
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          label: function (context: any) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            // Se redondea el valor 'y' a dos decimales
            label += context.parsed.y.toFixed(2) + ' ' + readings?.[0]?.unit;
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
      annotation: {
        annotations: {
          line1: {
            type: 'line',
            display: power_max ? true : false,
            yMin: power_max ? power_max : null,
            yMax: power_max ? power_max : null,
            borderColor: '#d9c308',
            borderWidth: 2,
            borderDash: [5, 5],
            label: {
              display: true,
              color: 'white',
              backgroundColor: '#d9c308',
              content: ['Máxima demanda de potencia'],
            }
          },
          line2: {
            type: 'line',
            display: power_contracted ? true : false,
            yMin: power_contracted,
            yMax: power_contracted,
            borderColor: 'orange',
            borderWidth: 2,
            borderDash: [5, 5],
            label: {
              display: true,
              color: 'white',
              backgroundColor: 'orange',
              content: ['Potencia contratada'],
            }
          }
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

  return (
    <div className="flex-1 p-6">
      <div className="flex justify-end">
        <ToggleGroup type="single" className="relative" onValueChange={handleGroupChange} defaultValue={group}>
          {isPending && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-md z-10">
              <span className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></span>
            </div>
          )}
          <ToggleGroupItem value="minute" aria-label="minute">
            <p>Hora</p>
          </ToggleGroupItem>
          <ToggleGroupItem value="day" aria-label="day">
            <p>Día</p>
          </ToggleGroupItem>

        </ToggleGroup>
      </div>
      <div className="w-[80%] h-[740px] mx-auto flex justify-center items-center">
        {
          readings?.length > 0 ? (
            <DynamicLine data={data} options={options} />
          ) : (
            <NoResultFound />
          )
        }
      </div>
    </div>
  )
}

