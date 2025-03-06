"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ReferenceLine } from "recharts"
import { format } from "date-fns"
import { es } from "date-fns/locale"

import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
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
  }
  
  // Tipos para las props del componente principal
  export interface EnergyDifferenceChartProps {
    data?: EnergyReading[]
    electricParameters?: ElectricParameters
    title?: string
    className?: string,
    unit?: string
  }
  
  // Tipos para las props del tooltip
  export interface CustomTooltipProps {
    active?: boolean
    payload?: Array<{
      payload: FormattedEnergyReading
      value: number
      dataKey: string
      name?: string
    }>
    label?: string
  }
  
  

// Diccionario de parámetros eléctricos
const ELECTRIC_PARAMETERS: ElectricParameters = {
  Ua: { parameter: "Voltaje de fase A", unit: "V" },
  Ub: { parameter: "Voltaje de fase B", unit: "V" },
  Uc: { parameter: "Voltaje de fase C", unit: "V" },
  Uab: { parameter: "Voltaje entre AB", unit: "V" },
  Ubc: { parameter: "Voltaje entre BC", unit: "V" },
  Uac: { parameter: "Voltaje entre AC", unit: "V" },
  Ia: { parameter: "Corriente de la fase A", unit: "A" },
  Ib: { parameter: "Corriente de la fase B", unit: "A" },
  Ic: { parameter: "Corriente de la fase C", unit: "A" },
  In: { parameter: "Vector suma de las  fases", unit: "A" },
  Pa: { parameter: "Potencia activa de la fase A", unit: "KW" },
  Pb: { parameter: "Potencia activa de la fase B", unit: "KW" },
  Pc: { parameter: "Potencia activa de la fase C", unit: "KW" },
  P: { parameter: "Potencia activa total", unit: "KW" },
  Qa: { parameter: "Potencia reactiva de la fase A", unit: "KVar" },
  Qb: { parameter: "Potencia reactiva de la fase B", unit: "KVar" },
  Qc: { parameter: "Potencia reactiva de la fase C", unit: "KVar" },
  Q: { parameter: "Potencia reactiva total", unit: "KVar" },
  Sa: { parameter: "Potencia aparente de la fase A", unit: "KVA" },
  Sb: { parameter: "Potencia aparente de la fase B", unit: "KVA" },
  Sc: { parameter: "Potencia aparente de la fase C", unit: "KVA" },
  S: { parameter: "Potencia aparente total", unit: "KVA" },
  PFa: { parameter: "Factor de potencia de la fase A", unit: "-" },
  PFb: { parameter: "Factor de potencia de la fase B", unit: "-" },
  PFc: { parameter: "Factor de potencia de la fase C", unit: "-" },
  PF: { parameter: "Factor de potencia total", unit: "-" },
  F: { parameter: "Frecuencia", unit: "Hz" },
  Et: { parameter: "Consumo total de energía", unit: "KWh" },
  EPtA: { parameter: "Consumo total de energía en la fase A", unit: "KWh" },
  EPtB: { parameter: "Consumo total de energía en la fase B", unit: "KWh" },
  EPtC: { parameter: "Consumo total de energía en la fase C", unit: "KWh" },
  THDUa: { parameter: "Distorsión armónica total en voltaje de la fase A", unit: "%" },
  THDUb: { parameter: "Distorsión armónica total en voltaje de la fase B", unit: "%" },
  THDUc: { parameter: "Distorsión armónica total en voltaje de la fase C", unit: "%" },
  THDIa: { parameter: "Distorsión armónica total en corriente de la fase A", unit: "%" },
  THDIb: { parameter: "Distorsión armónica total en corriente de la fase B", unit: "%" },
  THDIc: { parameter: "Distorsión armónica total en corriente de la fase C", unit: "%" },
  EPpos: { parameter: "Consumo de energía activa hacia adelante", unit: "KWh" },
  EPneg: { parameter: "Consumo de energía activa hacia atras", unit: "KWh" },
  EQpos: { parameter: "Consumo de energía reactiva hacia adelante", unit: "KVarh" },
  EQneg: { parameter: "Consumo de energía reactiva hacia atras", unit: "KVarh" },
  EPposA: { parameter: "Consumo de energía activa hacia adelante en la fase A", unit: "KWh" },
  EPnegA: { parameter: "Consumo de energía activa hacia atras en la fase A", unit: "KWh" },
  EQposA: { parameter: "Consumo de energía reactiva hacia adelante en la fase A", unit: "KVarh" },
  EQnegA: { parameter: "Consumo de energía reactiva hacia atras en la fase A", unit: "KVarh" },
  EPposB: { parameter: "Consumo de energía activa hacia adelante en la fase B", unit: "KWh" },
  EPnegB: { parameter: "Consumo de energía activa hacia atras en la fase B", unit: "KWh" },
  EQposB: { parameter: "Consumo de energía reactiva hacia adelante en la fase B", unit: "KVarh" },
  EQnegB: { parameter: "Consumo de energía reactiva hacia atras en la fase B", unit: "KVarh" },
  EPposC: { parameter: "Consumo de energía activa hacia adelante en la fase C", unit: "KWh" },
  EPnegC: { parameter: "Consumo de energía activa hacia atras en la fase C", unit: "KWh" },
  EQposC: { parameter: "Consumo de energía reactiva hacia adelante en la fase C", unit: "KVarh" },
  EQnegC: { parameter: "Consumo de energía reactiva hacia atras en la fase C", unit: "KVarh" },
  VfunA: { parameter: "Voltaje fundamental en la fase A", unit: "V" },
  VfunB: { parameter: "Voltaje fundamental en la fase B", unit: "V" },
  VfunC: { parameter: "Voltaje fundamental en la fase C", unit: "V" },
  IfunA: { parameter: "Corriente fundamental en la fase A", unit: "A" },
  IfunB: { parameter: "Corriente fundamental en la fase B", unit: "A" },
  IfunC: { parameter: "Corriente fundamental en la fase C", unit: "A" },
  V3A: { parameter: "Tercer armonico en voltaje de la fase A", unit: "%" },
  V5A: { parameter: "Quinto armonico en voltaje de la fase A", unit: "%" },
  V7A: { parameter: "Septimo armonico en voltaje de la fase A", unit: "%" },
  V9A: { parameter: "Noveno armonico en voltaje de la fase A", unit: "%" },
  V11A: { parameter: "Undecimo armonico en voltaje de la fase A", unit: "%" },
  V3B: { parameter: "Tercer armonico en voltaje de la fase B", unit: "%" },
  V5B: { parameter: "Quinto armonico en voltaje de la fase B", unit: "%" },
  V7B: { parameter: "Septimo armonico en voltaje de la fase B", unit: "%" },
  V9B: { parameter: "Noveno armonico en voltaje de la fase B", unit: "%" },
  V11B: { parameter: "Undecimo armonico en voltaje de la fase B", unit: "%" },
  V3C: { parameter: "Tercer armonico en voltaje de la fase C", unit: "%" },
  V5C: { parameter: "Quinto armonico en voltaje de la fase C", unit: "%" },
  V7C: { parameter: "Septimo armonico en voltaje de la fase C", unit: "%" },
  V9C: { parameter: "Noveno armonico en voltaje de la fase C", unit: "%" },
  V11C: { parameter: "Undecimo armonico en voltaje de la fase C", unit: "%" },
}

// Datos de ejemplo
const DEFAULT_DATA = [
  {
    period: "2025-02-17T00:00:00-05:00",
    first_reading: "2025-02-17T16:21:33.809667-05:00",
    last_reading: "2025-02-17T16:54:35.147565-05:00",
    indicator: "EPpos",
    first_value: 3.57,
    last_value: 3.57,
    difference: 0.0,
    device: {
      name: "Device 1",
    },
    measurement_point: {
      name: "Unidad 1",
    },
  },
  {
    period: "2025-02-19T00:00:00-05:00",
    first_reading: "2025-02-19T09:26:38.635205-05:00",
    last_reading: "2025-02-19T17:03:11.677283-05:00",
    indicator: "EPpos",
    first_value: 3.57,
    last_value: 3.57,
    difference: 0.0,
    device: {
      name: "Device 1",
    },
    measurement_point: {
      name: "Unidad 1",
    },
  },
  {
    period: "2025-02-24T00:00:00-05:00",
    first_reading: "2025-02-24T14:50:19.873332-05:00",
    last_reading: "2025-02-24T16:56:39.951474-05:00",
    indicator: "EPpos",
    first_value: 4.3,
    last_value: 0.0,
    difference: -4.3,
    device: {
      name: "Device 1",
    },
    measurement_point: {
      name: "Unidad 1",
    },
  },
  {
    period: "2025-02-26T00:00:00-05:00",
    first_reading: "2025-02-26T09:50:15.527837-05:00",
    last_reading: "2025-02-26T17:03:29.615071-05:00",
    indicator: "EPpos",
    first_value: 0.0,
    last_value: 4.3,
    difference: 4.3,
    device: {
      name: "Device 1",
    },
    measurement_point: {
      name: "Unidad 1",
    },
  },
  {
    period: "2025-02-28T00:00:00-05:00",
    first_reading: "2025-02-28T09:08:41.310325-05:00",
    last_reading: "2025-02-28T16:53:31.441364-05:00",
    indicator: "EPpos",
    first_value: 4.3,
    last_value: 5.63,
    difference: 1.33,
    device: {
      name: "Device 1",
    },
    measurement_point: {
      name: "Unidad 1",
    },
  },
]

export default function MeasurementGraph({
  data = DEFAULT_DATA,
  electricParameters = ELECTRIC_PARAMETERS,
  title,
  unit = 'V',
  className = "",
}: EnergyDifferenceChartProps) {
  // Formatear los datos para la gráfica
  const chartData: FormattedEnergyReading[] = data.map((item) => {
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
      formattedDate: format(new Date(item.period), "dd MMM", { locale: es }),
      parameterName: paramInfo.parameter,
      unit: paramInfo.unit,
      firstReadingFormatted: format(firstReadingDate, "dd/MM/yyyy HH:mm", { locale: es }),
      lastReadingFormatted: format(lastReadingDate, "dd/MM/yyyy HH:mm", { locale: es }),
      // Determinar el color de la barra según el valor
      color:
        item.difference > 0
          ? "var(--color-positive)"
          : item.difference < 0
            ? "var(--color-negative)"
            : "var(--color-neutral)",
    }
  })

  // Obtener el parámetro del primer elemento para el título
  const parameterInfo = electricParameters[data[0].indicator] || {
    parameter: data[0].indicator,
    unit: "KWh",
  }

  // Usar el título proporcionado o el nombre del parámetro
  const chartTitle = title || parameterInfo.parameter

  return (
    <div className={`flex-1 bg-white ${className}`}>
      <h2 className="text-xl font-bold mb-2 text-center">{chartTitle}</h2>
      <p className="text-sm text-muted-foreground mb-6 text-center">
        Punto de medición: {chartData[0].measurement_point.name} | Dispositivo: {chartData[0].device.name} | Unidad:{" "}
        {parameterInfo.unit}
      </p>

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
        <BarChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 30,
            bottom: 30,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="formattedDate" tickLine={false} axisLine={true} tick={{ fill: "hsl(var(--foreground))" }} />
          <YAxis
            tickLine={false}
            axisLine={true}
            tick={{ fill: "hsl(var(--foreground))" }}
            // label={{
            //   value: `Diferencia (${parameterInfo.unit})`,
            //   angle: -90,
            //   position: "insideLeft",
            //   style: { textAnchor: "middle", fill: "hsl(var(--foreground))" },
            // }}
          />
          <ReferenceLine y={0} stroke="hsl(var(--foreground))" strokeWidth={1} />
          <ChartTooltip content={(props) => <CustomTooltip {...props} />} />
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
      </ChartContainer>
    </div>
  )
}

// Componente personalizado para el tooltip
function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) {
    return null
  }

  const data = payload[0].payload
  const diffValue = data.difference
  const diffClass =
    diffValue > 0 ? "text-[hsl(142,76%,36%)]" : diffValue < 0 ? "text-[hsl(0,84%,60%)]" : "text-[hsl(220,14%,80%)]"

  return (
    <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md max-w-xs">
      <h3 className="font-bold text-sm mb-1">{data.parameterName}</h3>
      <p className="text-xs mb-2">Fecha: {label}</p>

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
          {diffValue} {data.unit}
        </span>
      </div>
    </div>
  )
}

