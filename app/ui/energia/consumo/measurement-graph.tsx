"use client"

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from "recharts"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"

// Custom tooltip component
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload.originalData

    return (
      <div className="bg-white p-4 border rounded-md shadow-md text-sm">
        <p className="font-semibold mb-2">{format(new Date(data.period), "dd MMM yyyy", { locale: es })}</p>
        <div className="border-t my-2"></div>
        <p className="text-gray-700 mb-1">
          <span className="font-medium">Primera lectura:</span> {data.first_value.toFixed(2)}
        </p>
        <p className="text-gray-700 mb-1">
          <span className="font-medium">Fecha:</span>{" "}
          {format(parseISO(data.first_reading), "dd MMM yyyy HH:mm", { locale: es })}
        </p>
        <div className="border-t my-2"></div>
        <p className="text-gray-700 mb-1">
          <span className="font-medium">Última lectura:</span> {data.last_value.toFixed(2)}
        </p>
        <p className="text-gray-700 mb-1">
          <span className="font-medium">Fecha:</span>{" "}
          {format(parseISO(data.last_reading), "dd MMM yyyy HH:mm", { locale: es })}
        </p>
        <div className="border-t my-2"></div>
        <p
          className={`font-semibold ${
            data.difference > 0 ? "text-green-500" : data.difference < 0 ? "text-red-500" : "text-gray-500"
          }`}
        >
          <span className="font-medium">Diferencia:</span> {data.difference > 0 ? "+" : ""}
          {data.difference.toFixed(2)}
        </p>
      </div>
    )
  }

  return null
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function DeviceReadingsChart({ data, last_by } : { data: any; last_by: string }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chartData = data.map((reading: any) => {

    const weekAndMonthFormat = `${format(new Date(reading.first_reading), "dd", { locale: es })} - ${format(new Date(reading.last_reading), "dd MMM", { locale: es })}`

    return (
      {
      name: format(new Date(reading.period), "dd MMM", { locale: es }),
      value: reading.difference,
      // Almacena los datos originales para el tooltip
      originalData: reading,
      weekAndMonthFormat
     }
  )
  })

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 20,
          }}
        >
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis dataKey={`${last_by === 'day' ? 'name' : 'weekAndMonthFormat'}`} tickLine={false} axisLine={false} className="text-xs"/>
          {/* <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `${value.toFixed(2)}`} /> */}
          <Tooltip content={<CustomTooltip />} cursor={false} />
          {/* Utilizamos un color fijo "#00b0c7" en todas las barras */}
          <Bar dataKey="value" radius={[4, 4, 0, 0]} fill="#00b0c7" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
