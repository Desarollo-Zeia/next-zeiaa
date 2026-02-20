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

export default function PowerUsageChart({ readings, group, powers }: { readings: PowerReading[], group?: string, powers: Powers[] }) {

  const { power_contracted, power_max } = powers?.[0] ?? {}

  const [isPending, startTransition] = useTransition()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  const dataPoints = readings?.map((item: PowerReading) => ({
    x: new Date(item?.created_at).toISOString(),
    y: item.values_per_channel?.[0].power,
  })) || []

  const handleGroupChange = (group: string) => {
    startTransition(() => {
      const newParams = new URLSearchParams(searchParams)

      newParams.set('group_by', 'day')

      if (group) {
        newParams.set('group_by', group)
      }

      replace(`${pathname}?${newParams.toString()}`, { scroll: false })
    })
  }

  const data = {
    datasets: [
      {
        label: readings?.[0]?.values_per_channel?.[0]?.measurement_point_name,
        data: dataPoints,
        fill: false,
        borderColor: "#00b0c7",
        stepped: false,
        tension: 0,
        pointRadius: 0,
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
        time: { unit: "day" },
        title: {
          display: false,
          text: "Hora de Lectura",
        },
        grid: {
          color: '#e5e7eb'
        },
      },
      y: {
        grid: {
          color: '#e5e7eb'
        },
        ticks: {
          display: true,
          callback: function (val: string | number) {
            return `${val} kW`
          },
        }
      },
    },
    plugins: {
      tooltip: {
        backgroundColor: "white",
        titleColor: "#666",
        bodyColor: "#00b0c7",
        borderColor: "#e5e7eb",
        borderWidth: 1,
        padding: 12,
        callbacks: {
          title: function (tooltipItems: Array<{ parsed: { x: number } }>) {
            const date = new Date(tooltipItems[0].parsed.x)
            const dateFormatted = capitalizeFirstLetter(format(date, "EEEE d 'de' MMMM", { locale: es }))
            return dateFormatted
          },
          label: function (context: { dataset: { label?: string }; parsed: { y: number } }) {
            let label = context.dataset.label || ""
            if (label) {
              label += ": "
            }
            label += context.parsed.y.toFixed(2) + ' ' + readings?.[0]?.unit
            return label
          },
        },
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
        samples: 20,
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
