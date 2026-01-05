"use client"

import { useTransition } from "react"
import { LineChart, Line, XAxis, YAxis, Tooltip, ReferenceLine, ResponsiveContainer } from "recharts"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { ELECTRIC_PARAMETERS } from "@/app/utils/formatter"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import DeviceReadingsChart from "./measurement-graph"
import NoResultsFound from "../../no-result"

const energyToggleArray = [
  { label: "Hora", value: "none" },
  { label: "Dia", value: "day" },
  { label: "Semana", value: "week" },
  { label: "Mes", value: "month" },
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const value = payload[0].value
    const date = new Date(payload[0].payload.timestamp)
    const unit = payload[0].payload.unit
    const parameter = payload[0].payload.parameter
    const fechaFormateada = format(date, "EEEE d 'de' MMMM, HH:mm", { locale: es })
    const fechaCapitalizada = fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1)

    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-md">
        <p className="text-gray-600 text-sm mb-1">{fechaCapitalizada}</p>
        <p className="text-[#00b0c7] font-semibold">
          {parameter}: {value.toFixed(2)} {unit}
        </p>
      </div>
    )
  }
  return null
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SimpleLineChart = ({ readingsGraph, category, indicator, last_by, readings }: { readingsGraph: any, category: any, indicator: any, last_by: any, readings: any }) => {
  const [isPending, startTransition] = useTransition()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  const indicatorsObject = readings?.results?.[0]?.indicators?.values
  const avaibleIndicators = [] as Array<string>

  for (const key in indicatorsObject) {
    if (indicatorsObject[key] !== null) {
      avaibleIndicators.push(key)
    }
  }

  const parameterLabel = ELECTRIC_PARAMETERS[indicator as keyof typeof ELECTRIC_PARAMETERS]?.parameter || indicator

  // Procesar datos para Recharts
  const chartData = readingsGraph
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ?.filter((item: any) => item.first_value !== 0)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((item: any) => ({
      timestamp: new Date(item.first_reading).getTime(),
      value: item.first_value,
      unit: item.unit,
      parameter: parameterLabel
    })) || []

  const handleFrequency = (frequency: string) => {
    startTransition(() => {
      const newParams = new URLSearchParams(searchParams)
      newParams.set('last_by', frequency)

      if (frequency === 'none' && category !== 'energy') {
        newParams.delete('last_by')
      } else if (frequency === 'none' && category === 'energy') {
        newParams.set('last_by', 'hour')
      }

      replace(`${pathname}?${newParams.toString()}`, { scroll: false })
    })
  }

  const unit = chartData[0]?.unit || ''

  return (
    <div className="w-full min-h-full p-4 bg-white flex flex-col justify-center items-center relative">
      <div className="pb-4 mb-4">
        {avaibleIndicators?.length > 0 && (
          <h2 className="font-semibold text-xl">
            Grafica de {parameterLabel}
          </h2>
        )}
      </div>

      {readingsGraph?.length > 0 && (
        <ToggleGroup
          type="single"
          value={last_by}
          onValueChange={handleFrequency}
          aria-label="Frequency"
          className="flex gap-2 mb-4"
        >
          {category === 'energy' && (
            energyToggleArray.map(times => (
              <ToggleGroupItem
                key={times.value}
                value={times.value}
                className={`w-[120px] h-[40px] ${
                  times.value === last_by
                    ? 'bg-[#00b0c7] text-white'
                    : 'bg-gray-100 text-black'
                } ${last_by === 'hour' && times.value === 'none' ? 'bg-[#00b0c7] text-white' : ''}`}
              >
                {isPending ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
                  </div>
                ) : (
                  times.label
                )}
              </ToggleGroupItem>
            ))
          )}
        </ToggleGroup>
      )}

      {avaibleIndicators?.length === 0 ? (
        <NoResultsFound message="Aun no hay informacion disponible" />
      ) : (
        <>
          {last_by === 'minute' ? (
            <div className="w-full h-[350px]">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  >
                    <XAxis
                      dataKey="timestamp"
                      tickFormatter={(value: number) => format(new Date(value), "dd MMM HH:mm", { locale: es })}
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={{ stroke: '#e5e7eb' }}
                    />
                    <YAxis
                      tickFormatter={(val: number) => `${val.toFixed(0)} ${unit}`}
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={{ stroke: '#e5e7eb' }}
                      width={80}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="stepAfter"
                      dataKey="value"
                      stroke="#00b0c7"
                      strokeWidth={2}
                      dot={false}
                      isAnimationActive={true}
                    />

                    {category === 'voltage' && (
                      <>
                        <ReferenceLine
                          y={209}
                          stroke="#000"
                          strokeDasharray="5 5"
                          label={{ value: '209 v', position: 'right', fontSize: 12 }}
                        />
                        <ReferenceLine
                          y={231}
                          stroke="#000"
                          strokeDasharray="5 5"
                          label={{ value: '231 v', position: 'right', fontSize: 12 }}
                        />
                      </>
                    )}
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <NoResultsFound message="Aun no hay informacion disponible" />
              )}
            </div>
          ) : (
            <DeviceReadingsChart data={readingsGraph} last_by={last_by} />
          )}
        </>
      )}
    </div>
  )
}

export default SimpleLineChart
