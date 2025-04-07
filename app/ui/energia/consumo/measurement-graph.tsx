"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ReferenceLine, LineChart, Line } from "recharts"
import { format } from "date-fns"
import { es } from "date-fns/locale"

import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { ELECTRIC_PARAMETERS } from "@/app/utils/formatter"
import NoResultsFound from "../../no-result"
import FrequencyEnergyFilter from "../filters/frequency-energy-filter"
// Tipos para los parámetros eléctricos
export interface ElectricParameter {
  parameter: string
  unit: string
}

export interface ElectricParameters {
  [key: string]: ElectricParameter
}

// Tipos para los datos de entrada
export interface Device {
  id?: number
  name: string
  dev_eui?: string
}

export interface MeasurementPoint {
  id?: number
  name: string
}

export interface EnergyReading {
  period: string
  first_reading: string
  last_reading: string
  indicator: string
  first_value: number
  last_value: number
  difference: number
  device: Device
  measurement_point: MeasurementPoint
}

// Tipos para los datos formateados para la gráfica
export interface FormattedEnergyReading extends EnergyReading {
  formattedDate: string
  parameterName: string
  unit: string
  firstReadingFormatted: string
  lastReadingFormatted: string
  color: string
  registeredAt: string
}

// Tipos para las props del componente principal
export interface EnergyDifferenceChartProps {
  data?: EnergyReading[]
  electricParameters?: ElectricParameters
  title?: string
  className?: string
  unit?: string
  count?: number
  frequency?: string,
  category?: string,
}

// Tipos para las props del tooltip
export interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{
    payload?: FormattedEnergyReading
    value?: any // eslint-disable-line @typescript-eslint/no-explicit-any
    dataKey?: any // eslint-disable-line @typescript-eslint/no-explicit-any
    name?: any // eslint-disable-line @typescript-eslint/no-explicit-any
  }>
  label?: any // eslint-disable-line @typescript-eslint/no-explicit-any
  frequency: any // eslint-disable-line @typescript-eslint/no-explicit-any
}

type Frequency = "hour" | "day" | "week" | "month"

export default function MeasurementGraph({
  data,
  electricParameters = ELECTRIC_PARAMETERS,
  title,
  unit,
  count = 0,
  frequency,
  className = "",
  category,
}: EnergyDifferenceChartProps) {

  const xAxisFormatter = {
    hour: "HH:mm",
    day: "dd MMM",
    week: (date: Date) => {
      const endDate = new Date(date)
      endDate.setDate(endDate.getDate() + 6) // Assuming a week is 7 days
      return `${format(date, "dd MMM", { locale: es })} - ${format(endDate, "dd MMM", { locale: es })}`
    },
    month: "MMM",
  }

  const frequencyFormatter = {
    hour: "dd MMM HH:mm",
    day: "dd MMM HH:mm",
    week: "dd MMM",
    month: "dd MMM",
  }

  const chartData: FormattedEnergyReading[] =
    data?.map((item) => {
      // Obtener el parámetro completo del diccionario
      const paramInfo = electricParameters[item.indicator] || {
        parameter: item.indicator,
        unit,
      }

      // Formatear las fechas para mostrar en el tooltip
      const firstReadingDate = new Date(item.first_reading)
      const lastReadingDate = new Date(item.last_reading)

      return {
        ...item,
        formattedDate:
          typeof xAxisFormatter[frequency as Frequency] === "function"
            ? (xAxisFormatter[frequency as Frequency] as any )(new Date(item?.period))  // eslint-disable-line @typescript-eslint/no-explicit-any 
            : (format(new Date(item?.period), xAxisFormatter[frequency as Frequency] as string, { locale: es }) ?? ""),
        registeredAt: format(new Date(item?.period), "dd MMM", { locale: es }) ?? "",
        parameterName: paramInfo.parameter,
        unit: paramInfo.unit,
        firstReadingFormatted: format(firstReadingDate, frequencyFormatter[frequency as Frequency], { locale: es }),
        lastReadingFormatted: format(lastReadingDate, frequencyFormatter[frequency as Frequency], { locale: es }),
        // Determinar el color de la barra según el valor
        color:
          item.difference > 0
            ? "var(--color-positive)"
            : item.difference < 0
              ? "var(--color-negative)"
              : "var(--color-neutral)",
      }
    }) ?? []

  // Obtener el parámetro del primer elemento para el título
  const parameterInfo = electricParameters[data?.[0]?.indicator as string] || {
    parameter: data?.[0]?.indicator,
    unit,
  }

  // Usar el título proporcionado o el nombre del parámetro
  const chartTitle = title || parameterInfo.parameter

  return (
    <>
      {count > 0 ? (
        <div className={`flex-1 flex flex-col justify-center gap-6 bg-white ${className}`}>
          <FrequencyEnergyFilter category={category as string} frequencyP={frequency as string}/>
          <h2 className="text-xl font-bold mb-2 text-center">{chartTitle}</h2>
          <ChartContainer
            config={{
              difference: {
                label: "Diferencia",
                color: "hsl(190, 100%, 39%)",
              },
              positive: {
                label: "Positivo",
                color: "hsl(142, 76%, 36%)",
              },
              negative: {
                label: "Negativo",
                color: "hsl(0, 84%, 60%)",
              },
              neutral: {
                label: "Sin cambio",
                color: "hsl(220, 14%, 80%)",
              },
            }}
            className="min-h-[350px]"
          >
            {frequency === "hour" || frequency === "day" ? (
              // Gráfico lineal para hora o día
              <LineChart data={chartData} margin={{ left: 50, right: 50 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="formattedDate"
                  tickLine={false}
                  axisLine={true}
                  tick={{ fill: "hsl(var(--foreground))" }}
                />
                <YAxis tickLine={false} axisLine={true} tick={{ fill: "hsl(var(--foreground))" }} hide={true}/>
                <ReferenceLine y={0} stroke="hsl(var(--foreground))" strokeWidth={1} />
                <ChartTooltip content={(props) => <CustomTooltip frequency={frequency} {...props} />} />
                <Line
                  type="monotone"
                  dataKey="difference"
                  stroke="var(--color-difference)"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6 }}
                  isAnimationActive={true}
                />
              </LineChart>
            ) : (
              // Gráfico de barras para semana o mes
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="formattedDate"
                  tickLine={false}
                  axisLine={true}
                  tick={{ fill: "hsl(var(--foreground))" }}
                />
                <YAxis tickLine={false} axisLine={true} tick={{ fill: "hsl(var(--foreground))" }} hide={true}/>
                <ReferenceLine y={0} stroke="hsl(var(--foreground))" strokeWidth={1} />
                <ChartTooltip content={(props) => <CustomTooltip frequency={frequency} {...props} />} />
                <Bar
                  dataKey="difference"
                  radius={[4, 4, 0, 0]}
                  fill="var(--color-difference)"
                  fillOpacity={0.9}
                  name="Diferencia"
                  isAnimationActive={true}
                >
                  {chartData.map((entry, index) => (
                    <rect key={`rect-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            )}
          </ChartContainer>
        </div>
      ) : (
        <NoResultsFound />
      )}
    </>
  )
}

// Componente personalizado para el tooltip
function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload || !payload.length || !payload[0].payload) {
    return null
  }

  const data = payload[0].payload
  const diffValue = data.difference
  const diffClass =
    diffValue > 0 ? "text-[hsl(142,76%,36%)]" : diffValue < 0 ? "text-[hsl(0,84%,60%)]" : "text-[hsl(220,14%,80%)]"

  return (
    <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md max-w-xs">
      <h3 className="font-bold text-sm mb-1">{data.parameterName}</h3>
      {/* <p className="text-xs mb-2">Fecha: {label}</p> */}

      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
        <span className="text-gray-500">Primera lectura:</span>
        <span>{data.firstReadingFormatted}</span>

        <span className="text-gray-500">Valor inicial:</span>
        <span>
          {data.first_value} {data.unit}
        </span>

        <span className="text-gray-500">Última lectura:</span>
        <span>{data.lastReadingFormatted}</span>

        <span className="text-gray-500">Valor final:</span>
        <span>
          {data.last_value} {data.unit}
        </span>

        <span className="text-gray-500 font-medium">Diferencia:</span>
        <span className={`font-medium ${diffClass}`}>
          {diffValue.toFixed(2)} {data.unit}
        </span>
      </div>
    </div>
  )
}

