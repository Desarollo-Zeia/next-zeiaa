"use client"

import { useState, useMemo } from "react"
import { DynamicLine } from "@/components/charts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import IndicatorToggle from "@/app/ui/filters/indicators-toggle"

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

interface MonitoreoMultiSalaProps {
  roomsData: RoomData[]
  indicator: IndicatorType
  unit: string
  indicators: Array<{ indicator: string; unit: string }>
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

function dateTimeToTimestamp(date: string, hour: string): number {
  const datePart = date.includes("T") ? date.split("T")[0] : date
  const [year, month, day] = datePart.split("-").map(Number)
  const [hours, minutes] = hour.split(":").map(Number)
  return new Date(year, month - 1, day, hours, minutes).getTime()
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

function formatUnit(u: string): string {
  if (u === "CELSIUS") return "°C"
  if (u === "PERCENT") return "%"
  return u
}

function getThresholdsForIndicator(
  thresholds: RoomData["thresholds"],
  indicator: IndicatorType
): { min: number; max: number } {
  if (indicator === "CO2") {
    return {
      min: thresholds.co2.good,
      max: thresholds.co2.dangerous,
    }
  } else if (indicator === "TEMPERATURE") {
    return thresholds.temperature
  } else {
    return thresholds.humidity
  }
}

export default function MonitoreoMultiSala({
  roomsData,
  indicator,
  unit,
  indicators,
}: MonitoreoMultiSalaProps) {
  // Filtrar lecturas de la última hora
  const filteredRoomsData = useMemo(() => {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
    return roomsData.map((room) => ({
      ...room,
      readings: room.readings.filter((reading) => {
        const datePart = reading.date.includes("T") ? reading.date.split("T")[0] : reading.date
        const readingTime = new Date(`${datePart}T${reading.hour}`)
        return readingTime >= oneHourAgo
      }),
    }))
  }, [roomsData])

  const [visibleRooms, setVisibleRooms] = useState<Set<number>>(() => {
    return filteredRoomsData.length > 0 ? new Set([filteredRoomsData[0].room_id]) : new Set()
  })

  const roomColors = useMemo(() => {
    const colors = new Map<number, string>()
    filteredRoomsData.forEach((room, index) => {
      colors.set(room.room_id, getRoomColor(index))
    })
    return colors
  }, [filteredRoomsData])

  const visibleRoomsData = useMemo(() => {
    return filteredRoomsData.filter((room) => visibleRooms.has(room.room_id))
  }, [filteredRoomsData, visibleRooms])

  const chartData = useMemo(() => mergeReadings(visibleRoomsData), [visibleRoomsData])

  const selectedRoom = filteredRoomsData.find((r) => visibleRooms.has(r.room_id))

  const maxValuesByRoom = useMemo(() => {
    const maxValues = new Map<number, number>()
    filteredRoomsData.forEach((room) => {
      if (room.readings.length === 0) {
        maxValues.set(room.room_id, 0)
        return
      }
      const maxReading = room.readings.reduce(
        (max, reading) => (reading.value > max.value ? reading : max),
        room.readings[0]
      )
      maxValues.set(room.room_id, maxReading.value)
    })
    return maxValues
  }, [filteredRoomsData])

  const yAxisDomain = useMemo(() => {
    const allValues = visibleRoomsData.flatMap((room) => room.readings.map((r) => r.value))
    if (allValues.length === 0) return [0, 100]

    let min = Math.min(...allValues)
    let max = Math.max(...allValues)

    if (selectedRoom && visibleRooms.size === 1) {
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
  }, [visibleRoomsData, selectedRoom, indicator, visibleRooms.size])

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

  const formattedUnit = formatUnit(unit)

  // Crear datasets para la gráfica
  const labels = chartData.map((item) => item.hour as string)
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

  // Crear anotaciones para umbrales (solo cuando hay 1 sala)
  const annotations: Record<string, object> = {}

  if (selectedRoom && visibleRooms.size === 1) {
    if (indicator === "CO2") {
      annotations.co2Good = {
        type: "line",
        yMin: selectedRoom.thresholds.co2.good,
        yMax: selectedRoom.thresholds.co2.good,
        borderColor: "#22c55e",
        borderWidth: 1.5,
        borderDash: [5, 5],
        label: {
          display: true,
          content: `Bueno ${selectedRoom.thresholds.co2.good}`,
          position: "end",
          backgroundColor: "transparent",
          color: "#22c55e",
          font: { size: 10 },
        },
      }
      annotations.co2Moderate = {
        type: "line",
        yMin: selectedRoom.thresholds.co2.moderate,
        yMax: selectedRoom.thresholds.co2.moderate,
        borderColor: "#eab308",
        borderWidth: 1.5,
        borderDash: [5, 5],
        label: {
          display: true,
          content: `Moderado ${selectedRoom.thresholds.co2.moderate}`,
          position: "end",
          backgroundColor: "transparent",
          color: "#eab308",
          font: { size: 10 },
        },
      }
      annotations.co2Unhealthy = {
        type: "line",
        yMin: selectedRoom.thresholds.co2.unhealthy,
        yMax: selectedRoom.thresholds.co2.unhealthy,
        borderColor: "#f97316",
        borderWidth: 1.5,
        borderDash: [5, 5],
        label: {
          display: true,
          content: `No saludable ${selectedRoom.thresholds.co2.unhealthy}`,
          position: "end",
          backgroundColor: "transparent",
          color: "#f97316",
          font: { size: 10 },
        },
      }
    } else if (indicator === "TEMPERATURE") {
      annotations.tempMin = {
        type: "line",
        yMin: selectedRoom.thresholds.temperature.min,
        yMax: selectedRoom.thresholds.temperature.min,
        borderColor: "#3b82f6",
        borderWidth: 2,
        borderDash: [5, 5],
        label: {
          display: true,
          content: `Mín ${selectedRoom.thresholds.temperature.min}${formattedUnit}`,
          position: "start",
          backgroundColor: "transparent",
          color: "#3b82f6",
          font: { size: 11 },
        },
      }
      annotations.tempMax = {
        type: "line",
        yMin: selectedRoom.thresholds.temperature.max,
        yMax: selectedRoom.thresholds.temperature.max,
        borderColor: "#ef4444",
        borderWidth: 2,
        borderDash: [5, 5],
        label: {
          display: true,
          content: `Máx ${selectedRoom.thresholds.temperature.max}${formattedUnit}`,
          position: "start",
          backgroundColor: "transparent",
          color: "#ef4444",
          font: { size: 11 },
        },
      }
    } else if (indicator === "HUMIDITY") {
      annotations.humidityMin = {
        type: "line",
        yMin: selectedRoom.thresholds.humidity.min,
        yMax: selectedRoom.thresholds.humidity.min,
        borderColor: "#3b82f6",
        borderWidth: 2,
        borderDash: [5, 5],
        label: {
          display: true,
          content: `Mín ${selectedRoom.thresholds.humidity.min}${formattedUnit}`,
          position: "start",
          backgroundColor: "transparent",
          color: "#3b82f6",
          font: { size: 11 },
        },
      }
      annotations.humidityMax = {
        type: "line",
        yMin: selectedRoom.thresholds.humidity.max,
        yMax: selectedRoom.thresholds.humidity.max,
        borderColor: "#ef4444",
        borderWidth: 2,
        borderDash: [5, 5],
        label: {
          display: true,
          content: `Máx ${selectedRoom.thresholds.humidity.max}${formattedUnit}`,
          position: "start",
          backgroundColor: "transparent",
          color: "#ef4444",
          font: { size: 11 },
        },
      }
    }
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    scales: {
      x: {
        grid: {
          color: "#e5e7eb",
        },
        ticks: {
          font: { size: 11 },
          color: "#6b7280",
        },
      },
      y: {
        min: yAxisDomain[0],
        max: yAxisDomain[1],
        grid: {
          color: "#e5e7eb",
        },
        ticks: {
          font: { size: 12 },
          color: "#6b7280",
          callback: function (value: number | string) {
            return `${value}${formattedUnit === "°C" ? "°" : formattedUnit === "%" ? "%" : ""}`
          },
        },
      },
    },
    plugins: {
      tooltip: {
        backgroundColor: "white",
        titleColor: "#333",
        bodyColor: "#666",
        borderColor: "#e5e7eb",
        borderWidth: 1,
        padding: 12,
      },
      zoom: {
        pan: {
          enabled: true,
          mode: "x" as const,
        },
        zoom: {
          wheel: {
            enabled: true,
            speed: 0.1,
          },
          pinch: {
            enabled: true,
          },
          mode: "x" as const,
        },
      },
      annotation: {
        annotations,
      },
      legend: {
        display: false,
      },
    },
  }

  if (filteredRoomsData.length === 0) {
    return (
      <div className="flex gap-4 mx-2">
        <Card className="w-full">
          <CardContent className="pt-6">
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              No hay datos disponibles para mostrar
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex gap-4 mx-2">
      {/* Tabla LEYENDA */}
      <Card className="w-[450px] shrink-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">LEYENDA</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[140px]">Salas monitoreadas</TableHead>
                <TableHead className="text-center w-[70px]">Mostrar</TableHead>
                <TableHead className="text-center" colSpan={2}>
                  <div>Umbral permitido</div>
                  <div className="flex justify-center gap-4 text-xs font-normal text-muted-foreground">
                    <span className="text-yellow-600">---Mínimo</span>
                    <span className="text-red-600">---Máximo</span>
                  </div>
                </TableHead>
                <TableHead className="text-center w-[80px]">
                  Valor máximo alcanzado
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRoomsData.map((room) => {
                const isVisible = visibleRooms.has(room.room_id)
                const isOnlyOne = visibleRooms.size === 1 && isVisible
                const maxValue = maxValuesByRoom.get(room.room_id) || 0
                const thresholds = getThresholdsForIndicator(room.thresholds, indicator)

                return (
                  <TableRow key={room.room_id}>
                    <TableCell className="py-2">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: roomColors.get(room.room_id) }}
                        />
                        <span className="text-sm truncate">{room.room_name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center py-2">
                      <Checkbox
                        checked={isVisible}
                        disabled={isOnlyOne}
                        onCheckedChange={(checked) =>
                          handleRoomToggle(room.room_id, checked as boolean)
                        }
                      />
                    </TableCell>
                    <TableCell className="text-center py-2 text-sm">
                      {thresholds.min}{formattedUnit}
                    </TableCell>
                    <TableCell className="text-center py-2 text-sm">
                      {thresholds.max}{formattedUnit}
                    </TableCell>
                    <TableCell className="text-center py-2 text-sm font-medium">
                      {maxValue}{formattedUnit}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Gráfica */}
      <Card className="flex-1">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Gráfica de datos</CardTitle>
              <p className="text-sm text-muted-foreground">Valores en tiempo real</p>
            </div>
            <IndicatorToggle indicators={indicators} indicatorParam={indicator} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            <DynamicLine data={{ labels, datasets }} options={chartOptions} />
          </div>

          {/* Leyenda inferior */}
          <div className="mt-4 flex flex-wrap gap-4 justify-center">
            {visibleRoomsData.map((room) => (
              <div key={room.room_id} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: roomColors.get(room.room_id) }}
                />
                <span className="text-sm text-muted-foreground">{room.room_name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export type { RoomData, Reading, IndicatorType, CO2Thresholds, MinMaxThresholds }
