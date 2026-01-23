"use client"

import { useState, useMemo } from "react"
import { DynamicLine } from "@/components/charts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import IndicatorToggle from "@/app/ui/filters/indicators-toggle"
import { DatepickerRange } from "@/app/ui/filters/datepicker-range"
import FrequencyIntervalFilter from "@/app/ui/filters/frequency-interval-filter"

type CO2Thresholds = { good: number; moderate: number; unhealthy: number; dangerous: number }
type MinMaxThresholds = { min: number; max: number }
type IndicatorType = "CO2" | "TEMPERATURE" | "HUMIDITY"

interface Reading {
  room_id: number
  date: string
  hour: string
  indicator: IndicatorType
  unit: string
  value: number
  status: string
}

interface RoomData {
  room_id: number
  room_name: string
  thresholds: {
    co2: CO2Thresholds
    temperature: MinMaxThresholds
    humidity: MinMaxThresholds
  }
  readings: Reading[]
}

interface ReadingsChartProps {
  roomsData: RoomData[]
  indicator: IndicatorType
  unit: string
  title?: string
  description?: string
  indicators: Array<{ indicator: string; unit: string }>
  interval?: string
  dateAfter?: string
  dateBefore?: string
}

const indicatorConfig: Record<IndicatorType, { label: string; defaultUnit: string }> = {
  CO2: { label: "CO2", defaultUnit: "PPM" },
  TEMPERATURE: { label: "Temperatura", defaultUnit: "°C" },
  HUMIDITY: { label: "Humedad", defaultUnit: "%" },
}

const colorPalette = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#ef4444",
  "#06b6d4",
  "#ec4899",
  "#84cc16",
  "#6366f1",
  "#14b8a6",
]

function getRoomColor(index: number): string {
  return colorPalette[index % colorPalette.length]
}

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number)
  return hours * 60 + minutes
}

function dateTimeToTimestamp(date: string, hour: string): number {
  const datePart = date.includes("T") ? date.split("T")[0] : date
  const [year, month, day] = datePart.split("-").map(Number)
  const [hours, minutes] = hour.split(":").map(Number)
  return new Date(year, month - 1, day, hours, minutes).getTime()
}

function formatDateInSpanish(dateStr: string, hour: string): string {
  const months = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ]
  const datePart = dateStr.includes("T") ? dateStr.split("T")[0] : dateStr
  const [year, month, day] = datePart.split("-").map(Number)
  const monthName = months[month - 1]
  return `${day} de ${monthName}, ${hour}`
}

function mergeReadings(roomsData: RoomData[]): Record<string, string | number | null>[] {
  const allTimePoints = new Map<string, { date: string; hour: string }>()

  roomsData.forEach((room) => {
    room.readings.forEach((reading) => {
      const datePart = reading.date.includes("T") ? reading.date.split("T")[0] : reading.date
      const key = `${datePart}_${reading.hour}`
      if (!allTimePoints.has(key)) {
        allTimePoints.set(key, { date: datePart, hour: reading.hour })
      }
    })
  })

  const sortedKeys = Array.from(allTimePoints.keys()).sort((a, b) => {
    const pointA = allTimePoints.get(a)!
    const pointB = allTimePoints.get(b)!
    return dateTimeToTimestamp(pointA.date, pointA.hour) - dateTimeToTimestamp(pointB.date, pointB.hour)
  })

  return sortedKeys.map((key) => {
    const { date, hour } = allTimePoints.get(key)!
    const dataPoint: Record<string, string | number | null> = {
      hour: hour,
      date: date,
      key: key,
    }

    roomsData.forEach((room) => {
      const reading = room.readings.find((r) => {
        const readingDate = r.date.includes("T") ? r.date.split("T")[0] : r.date
        return readingDate === date && r.hour === hour
      })
      dataPoint[`room_${room.room_id}`] = reading ? reading.value : null
    })

    return dataPoint
  })
}

function CustomTooltip({
  active,
  payload,
  label,
  unit,
  roomsData,
  roomColors,
}: {
  active?: boolean
  payload?: Array<{ name: string; value: number; color: string; payload: Record<string, string | number | null> }>
  label?: string
  unit: string
  roomsData: RoomData[]
  roomColors: Map<number, string>
}) {
  if (active && payload && payload.length) {
    const date = payload[0]?.payload?.date as string
    const formattedDateTime = date && label ? formatDateInSpanish(date, label) : label

    return (
      <div className="rounded-lg border bg-card p-3 shadow-md">
        <p className="font-medium text-card-foreground mb-2">Hora: {formattedDateTime}</p>
        {payload
          .filter((entry) => entry.value !== null)
          .map((entry, index) => {
            const roomId = Number(entry.name.replace("room_", ""))
            const room = roomsData.find((r) => r.room_id === roomId)
            return (
              <p key={index} className="text-sm" style={{ color: roomColors.get(roomId) }}>
                {room?.room_name}: {entry.value} {unit}
              </p>
            )
          })}
      </div>
    )
  }
  return null
}

function CO2ThresholdsDisplay({
  thresholds,
  roomName,
  roomColor,
}: {
  thresholds: CO2Thresholds
  roomName: string
  roomColor: string
}) {
  return (
    <div className="mb-6 p-4 border rounded-lg bg-muted/30">
      <p className="text-sm font-semibold mb-3" style={{ color: roomColor }}>
        Umbrales de {roomName} (CO2 - PPM):
      </p>
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-0.5 bg-green-500" />
          <span className="text-sm">
            <span className="font-medium text-green-600">Bueno:</span> {"<"} {thresholds.good} PPM
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-0.5 bg-yellow-500" />
          <span className="text-sm">
            <span className="font-medium text-yellow-600">Moderado:</span> {"<"} {thresholds.moderate} PPM
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-0.5 bg-orange-500" />
          <span className="text-sm">
            <span className="font-medium text-orange-600">No saludable:</span> {"<"} {thresholds.unhealthy} PPM
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-0.5 bg-red-500" />
          <span className="text-sm">
            <span className="font-medium text-red-600">Peligroso:</span> {">="} {thresholds.dangerous} PPM
          </span>
        </div>
      </div>
    </div>
  )
}

function MinMaxThresholdsDisplay({
  thresholds,
  roomName,
  roomColor,
  indicatorLabel,
  unit,
}: {
  thresholds: MinMaxThresholds
  roomName: string
  roomColor: string
  indicatorLabel: string
  unit: string
}) {
  return (
    <div className="mb-6 p-4 border rounded-lg bg-muted/30">
      <p className="text-sm font-semibold mb-3" style={{ color: roomColor }}>
        Umbrales de {roomName} ({indicatorLabel} - {unit}):
      </p>
      <div className="flex flex-wrap gap-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-0.5 bg-blue-500" />
          <span className="text-sm">
            <span className="font-medium text-blue-600">Mínimo:</span> {thresholds.min} {unit}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-0.5 bg-red-500" />
          <span className="text-sm">
            <span className="font-medium text-red-600">Máximo:</span> {thresholds.max} {unit}
          </span>
        </div>
      </div>
    </div>
  )
}

// Componente de gráfica con Chart.js y zoom
function ChartWithZoom({
  chartData,
  visibleRoomsData,
  roomColors,
  yAxisDomain,
  formattedUnit,
  selectedRoom,
  visibleRooms,
  indicator,
  dateAfter,
  dateBefore,
}: {
  chartData: Record<string, string | number | null>[]
  visibleRoomsData: RoomData[]
  roomColors: Map<number, string>
  yAxisDomain: number[]
  formattedUnit: string
  selectedRoom: RoomData | undefined
  visibleRooms: Set<number>
  indicator: IndicatorType
  dateAfter?: string
  dateBefore?: string
}) {
  // Determinar si es el mismo día
  const isSameDay = dateAfter === dateBefore

  // Cambiar formato de labels según si es el mismo día o rango de fechas
  const monthNames = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']

  const labels = isSameDay
    ? chartData.map((item) => item.hour as string)  // Solo hora: "08:00"
    : chartData.map((item) => {
      const date = item.date as string
      if (!date) return item.hour as string
      const [, month, day] = date.split('-')
      return `${day} ${monthNames[parseInt(month) - 1]}`  // "07 ene"
    })

  const datasets = visibleRoomsData.map((room) => ({
    label: room.room_name,
    data: chartData.map((item) => item[`room_${room.room_id}`] as number | null),
    borderColor: roomColors.get(room.room_id),
    backgroundColor: roomColors.get(room.room_id),
    tension: 0.3,
    borderWidth: 2,
    pointRadius: 3,
    pointHoverRadius: 5,
    spanGaps: true,
  }))

  const data = { labels, datasets }

  // Crear anotaciones para las líneas de referencia
  const annotations: Record<string, any> = {} // eslint-disable-line @typescript-eslint/no-explicit-any

  if (selectedRoom && visibleRooms.size < 2) {
    if (indicator === "CO2") {
      annotations.co2Good = {
        type: 'line',
        yMin: selectedRoom.thresholds.co2.good,
        yMax: selectedRoom.thresholds.co2.good,
        borderColor: '#22c55e',
        borderWidth: 1.5,
        borderDash: [5, 5],
        label: {
          display: true,
          content: `Bueno ${selectedRoom.thresholds.co2.good}`,
          position: 'end',
          backgroundColor: 'transparent',
          color: '#22c55e',
          font: { size: 10 }
        }
      }
      annotations.co2Moderate = {
        type: 'line',
        yMin: selectedRoom.thresholds.co2.moderate,
        yMax: selectedRoom.thresholds.co2.moderate,
        borderColor: '#eab308',
        borderWidth: 1.5,
        borderDash: [5, 5],
        label: {
          display: true,
          content: `Moderado ${selectedRoom.thresholds.co2.moderate}`,
          position: 'end',
          backgroundColor: 'transparent',
          color: '#eab308',
          font: { size: 10 }
        }
      }
      annotations.co2Unhealthy = {
        type: 'line',
        yMin: selectedRoom.thresholds.co2.unhealthy,
        yMax: selectedRoom.thresholds.co2.unhealthy,
        borderColor: '#f97316',
        borderWidth: 1.5,
        borderDash: [5, 5],
        label: {
          display: true,
          content: `No saludable ${selectedRoom.thresholds.co2.unhealthy}`,
          position: 'end',
          backgroundColor: 'transparent',
          color: '#f97316',
          font: { size: 10 }
        }
      }
    } else if (indicator === "TEMPERATURE") {
      annotations.tempMin = {
        type: 'line',
        yMin: selectedRoom.thresholds.temperature.min,
        yMax: selectedRoom.thresholds.temperature.min,
        borderColor: '#3b82f6',
        borderWidth: 2,
        borderDash: [5, 5],
        label: {
          display: true,
          content: `Mín ${selectedRoom.thresholds.temperature.min}${formattedUnit}`,
          position: 'start',
          backgroundColor: 'transparent',
          color: '#FA891A',
          font: { size: 11 }
        }
      }
      annotations.tempMax = {
        type: 'line',
        yMin: selectedRoom.thresholds.temperature.max,
        yMax: selectedRoom.thresholds.temperature.max,
        borderColor: '#ef4444',
        borderWidth: 2,
        borderDash: [5, 5],
        label: {
          display: true,
          content: `Máx ${selectedRoom.thresholds.temperature.max}${formattedUnit}`,
          position: 'start',
          backgroundColor: 'transparent',
          color: '#ef4444',
          font: { size: 11 }
        }
      }
    } else if (indicator === "HUMIDITY") {
      annotations.humidityMin = {
        type: 'line',
        yMin: selectedRoom.thresholds.humidity.min,
        yMax: selectedRoom.thresholds.humidity.min,
        borderColor: '#FA891A',
        borderWidth: 2,
        borderDash: [5, 5],
        label: {
          display: true,
          content: `Mín ${selectedRoom.thresholds.humidity.min}${formattedUnit}`,
          position: 'start',
          backgroundColor: 'transparent',
          color: '#FA891A',
          font: { size: 11 }
        }
      }
      annotations.humidityMax = {
        type: 'line',
        yMin: selectedRoom.thresholds.humidity.max,
        yMax: selectedRoom.thresholds.humidity.max,
        borderColor: '#ef4444',
        borderWidth: 2,
        borderDash: [5, 5],
        label: {
          display: true,
          content: `Máx ${selectedRoom.thresholds.humidity.max}${formattedUnit}`,
          position: 'start',
          backgroundColor: 'transparent',
          color: '#ef4444',
          font: { size: 11 }
        }
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      x: {
        grid: {
          color: '#e5e7eb',
          drawBorder: false,
        },
        ticks: {
          font: { size: 11 },
          color: '#6b7280',
        }
      },
      y: {
        min: yAxisDomain[0],
        max: yAxisDomain[1],
        grid: {
          color: '#e5e7eb',
          drawBorder: false,
        },
        ticks: {
          font: { size: 12 },
          color: '#6b7280',
          callback: function (value: number) {
            return `${value}${formattedUnit === "°C" ? "°" : formattedUnit === "%" ? "%" : ""}`
          }
        }
      }
    },
    plugins: {
      tooltip: {
        backgroundColor: "white",
        titleColor: "#333",
        bodyColor: "#666",
        borderColor: "#e5e7eb",
        borderWidth: 1,
        padding: 12,
        callbacks: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          title: function (tooltipItems: any) {
            const index = tooltipItems[0].dataIndex
            const item = chartData[index]
            const date = item?.date as string
            const hour = item?.hour as string
            if (date && hour) {
              return `Hora: ${formatDateInSpanish(date, hour)}`
            }
            return `Hora: ${hour}`
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          label: function (context: any) {
            if (context.parsed.y === null) return null
            return `${context.dataset.label}: ${context.parsed.y} ${formattedUnit}`
          }
        }
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
        annotations
      },
      legend: {
        display: false,
      }
    }
  }

  return (
    <div className="h-[450px] w-full">
      <DynamicLine data={data} options={options} />
    </div>
  )
}

export function ReadingsChart({
  roomsData,
  indicator,
  unit,
  title = "Monitor de Calidad Ambiental",
  description,
  indicators,
  interval,
  dateAfter,
  dateBefore
}: ReadingsChartProps) {
  const [selectedRoomId, setSelectedRoomId] = useState<string>(
    roomsData.length > 0 ? roomsData[0].room_id.toString() : "",
  )

  const [visibleRooms, setVisibleRooms] = useState<Set<number>>(() => {
    // Solo selecciona la primera sala por defecto
    return roomsData.length > 0 ? new Set([roomsData[0].room_id]) : new Set()
  })



  const roomColors = useMemo(() => {
    const colors = new Map<number, string>()
    roomsData.forEach((room, index) => {
      colors.set(room.room_id, getRoomColor(index))
    })
    return colors
  }, [roomsData])

  const visibleRoomsData = useMemo(() => {
    return roomsData.filter((room) => visibleRooms.has(room.room_id))
  }, [roomsData, visibleRooms])

  const chartData = useMemo(() => mergeReadings(visibleRoomsData), [visibleRoomsData])

  const selectedRoom = roomsData.find((r) => visibleRooms.has(r.room_id))





  const yAxisDomain = useMemo(() => {
    const allValues = visibleRoomsData.flatMap((room) => room.readings.map((r) => r.value))
    if (allValues.length === 0) return [0, 100]

    let min = Math.min(...allValues)
    let max = Math.max(...allValues)

    if (selectedRoom) {
      if (indicator === "CO2") {
        const co2Thresholds = selectedRoom.thresholds.co2
        min = Math.min(min, co2Thresholds.good)
        max = Math.max(max, co2Thresholds.dangerous)
      } else if (indicator === "TEMPERATURE") {
        const tempThresholds = selectedRoom.thresholds.temperature
        min = Math.min(min, tempThresholds.min)
        max = Math.max(max, tempThresholds.max)
      } else if (indicator === "HUMIDITY") {
        const humidityThresholds = selectedRoom.thresholds.humidity
        min = Math.min(min, humidityThresholds.min)
        max = Math.max(max, humidityThresholds.max)
      }
    }

    const padding = (max - min) * 0.15
    return [Math.floor(min - padding), Math.ceil(max + padding)]
  }, [visibleRoomsData, selectedRoom, indicator])

  const handleRoomToggle = (roomId: number, checked: boolean) => {
    setVisibleRooms((prev) => {
      const newSet = new Set(prev)
      if (checked) {
        newSet.add(roomId)
      } else {
        if (newSet.size > 1) {
          newSet.delete(roomId)
        }
      }
      return newSet
    })
  }

  const config = indicatorConfig[indicator]
  const displayUnit = unit || config.defaultUnit

  const formatUnit = (u: string) => {
    if (u === "CELSIUS") return "°C"
    if (u === "PERCENT") return "%"
    return u
  }

  const formattedUnit = formatUnit(displayUnit)
  const defaultDescription = `Lecturas de ${config.label} en las salas monitoreadas`

  if (roomsData.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description || defaultDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            No hay datos disponibles para mostrar
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description || defaultDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center justify-end gap-2">
          {/* <Label htmlFor="room-select" className="text-sm font-medium whitespace-nowrap">
            Mostrar umbrales de:
          </Label>
          <Select value={selectedRoomId} onValueChange={setSelectedRoomId}>
            <SelectTrigger id="room-select" className="w-[280px] bg-[#00b0c7]">
              <SelectValue placeholder="Seleccionar sala" />
            </SelectTrigger>
            <SelectContent>
              {roomsData.map((room) => (
                <SelectItem key={room.room_id} value={room.room_id.toString()}>
                  {room.room_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select> */}
          <IndicatorToggle indicators={indicators} indicatorParam={indicator} />
          <DatepickerRange />
          <FrequencyIntervalFilter interval={interval as string} />
        </div>

        <div className="mb-4 p-4 border rounded-lg bg-muted/20">
          <Label className="text-sm font-medium mb-3 block">Salas a mostrar en la gráfica:</Label>
          <div className="flex flex-wrap gap-4">
            {roomsData.map((room) => {
              const isVisible = visibleRooms.has(room.room_id)
              const isOnlyOne = visibleRooms.size === 1 && isVisible
              return (
                <div key={room.room_id} className="flex items-center gap-2">
                  <Checkbox
                    id={`room-visibility-${room.room_id}`}
                    checked={isVisible}
                    disabled={isOnlyOne}
                    onCheckedChange={(checked) => handleRoomToggle(room.room_id, checked as boolean)}
                  />
                  <label
                    htmlFor={`room-visibility-${room.room_id}`}
                    className="text-sm flex items-center gap-2 cursor-pointer"
                  >
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: roomColors.get(room.room_id) }} />
                    {room.room_name}
                  </label>
                </div>
              )
            })}
          </div>
        </div>

        {/* Thresholds display */}
        {selectedRoom && visibleRooms.size < 2 && indicator === "CO2" && (
          <CO2ThresholdsDisplay
            thresholds={selectedRoom.thresholds.co2}
            roomName={selectedRoom.room_name}
            roomColor={roomColors.get(selectedRoom.room_id) || "#FA891A"}
          />
        )}
        {selectedRoom && visibleRooms.size < 2 && indicator === "TEMPERATURE" && (
          <MinMaxThresholdsDisplay
            thresholds={selectedRoom.thresholds.temperature}
            roomName={selectedRoom.room_name}
            roomColor={roomColors.get(selectedRoom.room_id) || "#FA891A"}
            indicatorLabel="Temperatura"
            unit={formattedUnit}
          />
        )}
        {selectedRoom && visibleRooms.size < 2 && indicator === "HUMIDITY" && (
          <MinMaxThresholdsDisplay
            thresholds={selectedRoom.thresholds.humidity}
            roomName={selectedRoom.room_name}
            roomColor={roomColors.get(selectedRoom.room_id) || "#FA891A"}
            indicatorLabel="Humedad"
            unit={formattedUnit}
          />
        )}

        {/* Chart */}
        <ChartWithZoom
          chartData={chartData}
          visibleRoomsData={visibleRoomsData}
          roomColors={roomColors}
          yAxisDomain={yAxisDomain}
          formattedUnit={formattedUnit}
          selectedRoom={selectedRoom}
          visibleRooms={visibleRooms}
          indicator={indicator}
          dateAfter={dateAfter}
          dateBefore={dateBefore}
        />

        <div className="mt-4 flex flex-wrap gap-4 justify-center">
          {visibleRoomsData.map((room) => (
            <div key={room.room_id} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: roomColors.get(room.room_id) }} />
              <span className="text-sm text-muted-foreground">{room.room_name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export type { RoomData, Reading, IndicatorType, CO2Thresholds, MinMaxThresholds, ReadingsChartProps }
