"use client"

import { DynamicBar } from "@/components/charts"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import NoResultsFound from "../../no-result"


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


interface ReadingData {
  period: string
  first_reading: string
  last_reading: string
  first_value: number
  last_value: number
  difference: number
  unit?: string
}

export default function DeviceReadingsChart({ data, last_by }: { data: ReadingData[]; last_by: string }) {

  const chartData = data.map((reading: ReadingData) => {

    const weekAndMonthFormat = `${format(new Date(reading.first_reading), "dd", { locale: es })} - ${format(new Date(reading.last_reading), "dd MMM", { locale: es })}`
    const hourLastBy = `${format(new Date(reading.first_reading), "HH:mm", { locale: es })}`

    return (
      {
        name: format(new Date(reading.period), "dd MMM", { locale: es }),
        value: reading.difference,
        originalData: reading,
        weekAndMonthFormat,
        hourLastBy,
        last_by
      }
    )
  })

  const labels = chartData.map((item) => {
    if (last_by === 'day') return item.name
    if (last_by === 'hour') return item.hourLastBy
    return item.weekAndMonthFormat
  })

  const values = chartData.map((item) => item.value)

  const chartJsData = {
    labels,
    datasets: [
      {
        label: 'Consumo',
        data: values,
        backgroundColor: "#00b0c7",
        borderColor: "#00b0c7",
        borderRadius: 4,
      },
    ],
  }

  const options: Record<string, unknown> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "white",
        titleColor: "#333",
        bodyColor: "#333",
        borderColor: "#e5e7eb",
        borderWidth: 1,
        padding: 12,
        callbacks: {
          title: function(context: Array<{ dataIndex: number }>) {
            const index = context[0]?.dataIndex ?? 0
            const item = chartData[index]
            if (!item) return ''
            
            const { date } = formatDateTime(item.originalData.period)
            return date
          },
          label: function(context: { dataIndex: number; parsed: { y: number } }) {
            const index = context.dataIndex
            const item = chartData[index]
            if (!item) return ''
            
            const data = item.originalData
            return [
              `Primera lectura: ${data.first_value.toFixed(2)} ${data.unit}`,
              `Última lectura: ${data.last_value.toFixed(2)} ${data.unit}`,
              `Consumo: ${data.difference > 0 ? "+" : ""}${data.difference.toFixed(2)} ${data.unit}`
            ]
          },
          afterLabel: function(context: { dataIndex: number }) {
            const index = context.dataIndex
            const item = chartData[index]
            if (!item) return ''
            
            const dataLastBy = item.last_by
            const data = item.originalData
            const firstReading = formatDateTime(data.first_reading)
            const secondReading = formatDateTime(data.last_reading)
            
            const firstDate = `${firstReading.date} ${dataLastBy === 'hour' ? firstReading.time : ''}`
            const secondDate = `${secondReading.date} ${dataLastBy === 'hour' ? secondReading.time : ''}`
            
            return [
              `Fecha primera: ${firstDate}`,
              `Fecha última: ${secondDate}`
            ]
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: { size: 11 }
        }
      },
      y: {
        grid: {
          color: '#e5e7eb'
        },
        ticks: {
          font: { size: 12 },
          callback: function(val: number) {
            return `${val.toFixed(0)} KWh`
          }
        }
      }
    }
  }

  return (
    <div className="h-[300px] w-full">
      {
        data.length > 0 ? (
          <DynamicBar data={chartJsData} options={options} />
        ) : (
          <NoResultsFound message="Aún no hay información disponible" />
        )
      }

    </div>
  )
}
