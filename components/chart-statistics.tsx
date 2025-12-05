"use client"

import { useState, useMemo } from "react"
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
  ReferenceLine,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import IndicatorToggle from "@/app/ui/filters/indicators-toggle"

// Types
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
  description?: string,
  indicators?: any // eslint-disable-line @typescript-eslint/no-explicit-any
}

// Configuration for each indicator type
const indicatorConfig: Record<IndicatorType, { label: string; defaultUnit: string }> = {
  CO2: { label: "CO2", defaultUnit: "PPM" },
  TEMPERATURE: { label: "Temperatura", defaultUnit: "°C" },
  HUMIDITY: { label: "Humedad", defaultUnit: "%" },
}

// Color palette for rooms (will cycle if more than 10 rooms)
const colorPalette = [
  "#3b82f6", // blue
  "#10b981", // emerald
  "#f59e0b", // amber
  "#8b5cf6", // violet
  "#ef4444", // red
  "#06b6d4", // cyan
  "#ec4899", // pink
  "#84cc16", // lime
  "#6366f1", // indigo
  "#14b8a6", // teal
]

function getRoomColor(index: number): string {
  return colorPalette[index % colorPalette.length]
}

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number)
  return hours * 60 + minutes
}

function mergeReadings(roomsData: RoomData[]): Record<string, string | number | null>[] {
  const allTimes = new Set<string>()

  // Collect all unique times
  roomsData.forEach((room) => {
    room.readings.forEach((reading) => {
      allTimes.add(reading.hour)
    })
  })

  // Sort times chronologically
  const sortedTimes = Array.from(allTimes).sort((a, b) => timeToMinutes(a) - timeToMinutes(b))

  // Create data points for each time
  return sortedTimes.map((time) => {
    const dataPoint: Record<string, string | number | null> = { hour: time }

    roomsData.forEach((room) => {
      const reading = room.readings.find((r) => r.hour === time)
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
  payload?: Array<{ name: string; value: number; color: string }>
  label?: string
  unit: string
  roomsData: RoomData[]
  roomColors: Map<number, string>
}) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-card p-3 shadow-md">
        <p className="font-medium text-card-foreground mb-2">Hora: {label}</p>
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

export function ReadingsChart({
  roomsData,
  indicator,
  unit,
  title = "Monitor de Calidad Ambiental",
  description,
  indicators
}: ReadingsChartProps) {
  const [selectedRoomId, setSelectedRoomId] = useState<string>(
    roomsData.length > 0 ? roomsData[0].room_id.toString() : "",
  )

  // Create color mapping for rooms
  const roomColors = useMemo(() => {
    const colors = new Map<number, string>()
    roomsData.forEach((room, index) => {
      colors.set(room.room_id, getRoomColor(index))
    })
    return colors
  }, [roomsData])

  // Merge readings from all rooms into chart-compatible format
  const chartData = useMemo(() => mergeReadings(roomsData), [roomsData])

  // Calculate Y axis domain based on data
  const yAxisDomain = useMemo(() => {
    const allValues = roomsData.flatMap((room) => room.readings.map((r) => r.value))
    if (allValues.length === 0) return [0, 100]
    const min = Math.min(...allValues)
    const max = Math.max(...allValues)
    const padding = (max - min) * 0.15
    return [Math.floor(min - padding), Math.ceil(max + padding)]
  }, [roomsData])

  const selectedRoom = roomsData.find((r) => r.room_id === Number(selectedRoomId))
  const config = indicatorConfig[indicator]
  const displayUnit = unit || config.defaultUnit

  // Format unit for display
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
        {/* Room selector for thresholds */}
        <div className="mb-4 flex items-center gap-2">
          <Label htmlFor="room-select" className="text-sm font-medium whitespace-nowrap">
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
          </Select>
          <IndicatorToggle indicators={indicators} indicatorParam={indicator} />
        </div>

        {/* Thresholds display */}
        {selectedRoom && indicator === "CO2" && (
          <CO2ThresholdsDisplay
            thresholds={selectedRoom.thresholds.co2}
            roomName={selectedRoom.room_name}
            roomColor={roomColors.get(selectedRoom.room_id) || "#3b82f6"}
          />
        )}
        {selectedRoom && indicator === "TEMPERATURE" && (
          <MinMaxThresholdsDisplay
            thresholds={selectedRoom.thresholds.temperature}
            roomName={selectedRoom.room_name}
            roomColor={roomColors.get(selectedRoom.room_id) || "#3b82f6"}
            indicatorLabel="Temperatura"
            unit={formattedUnit}
          />
        )}
        {selectedRoom && indicator === "HUMIDITY" && (
          <MinMaxThresholdsDisplay
            thresholds={selectedRoom.thresholds.humidity}
            roomName={selectedRoom.room_name}
            roomColor={roomColors.get(selectedRoom.room_id) || "#3b82f6"}
            indicatorLabel="Humedad"
            unit={formattedUnit}
          />
        )}

        {/* Chart */}
        <div className="h-[450px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="hour"
                tick={{ fontSize: 11, fill: "#6b7280" }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                domain={yAxisDomain}
                tick={{ fontSize: 12, fill: "#6b7280" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}${formattedUnit === "°C" ? "°" : formattedUnit === "%" ? "%" : ""}`}
              />
              <Tooltip content={<CustomTooltip unit={formattedUnit} roomsData={roomsData} roomColors={roomColors} />} />
              <Legend
                formatter={(value) => {
                  const roomId = Number(value.replace("room_", ""))
                  const room = roomsData.find((r) => r.room_id === roomId)
                  return room?.room_name || value
                }}
              />

              {/* Reference lines for CO2 */}
              {selectedRoom && indicator === "CO2" && (
                <>
                  <ReferenceLine
                    y={selectedRoom.thresholds.co2.good}
                    stroke="#22c55e"
                    strokeDasharray="5 5"
                    strokeWidth={1.5}
                    label={{
                      value: `Bueno ${selectedRoom.thresholds.co2.good}`,
                      position: "insideTopRight",
                      fill: "#22c55e",
                      fontSize: 10,
                    }}
                  />
                  <ReferenceLine
                    y={selectedRoom.thresholds.co2.moderate}
                    stroke="#eab308"
                    strokeDasharray="5 5"
                    strokeWidth={1.5}
                    label={{
                      value: `Moderado ${selectedRoom.thresholds.co2.moderate}`,
                      position: "insideTopRight",
                      fill: "#eab308",
                      fontSize: 10,
                    }}
                  />
                  <ReferenceLine
                    y={selectedRoom.thresholds.co2.unhealthy}
                    stroke="#f97316"
                    strokeDasharray="5 5"
                    strokeWidth={1.5}
                    label={{
                      value: `No saludable ${selectedRoom.thresholds.co2.unhealthy}`,
                      position: "insideTopRight",
                      fill: "#f97316",
                      fontSize: 10,
                    }}
                  />
                </>
              )}

              {/* Reference lines for Temperature */}
              {selectedRoom && indicator === "TEMPERATURE" && (
                <>
                  <ReferenceLine
                    y={selectedRoom.thresholds.temperature.min}
                    stroke="#3b82f6"
                    strokeDasharray="5 5"
                    strokeWidth={2}
                    label={{
                      value: `Mín ${selectedRoom.thresholds.temperature.min}${formattedUnit}`,
                      position: "insideTopLeft",
                      fill: "#3b82f6",
                      fontSize: 11,
                    }}
                  />
                  <ReferenceLine
                    y={selectedRoom.thresholds.temperature.max}
                    stroke="#ef4444"
                    strokeDasharray="5 5"
                    strokeWidth={2}
                    label={{
                      value: `Máx ${selectedRoom.thresholds.temperature.max}${formattedUnit}`,
                      position: "insideTopLeft",
                      fill: "#ef4444",
                      fontSize: 11,
                    }}
                  />
                </>
              )}

              {/* Reference lines for Humidity */}
              {selectedRoom && indicator === "HUMIDITY" && (
                <>
                  <ReferenceLine
                    y={selectedRoom.thresholds.humidity.min}
                    stroke="#3b82f6"
                    strokeDasharray="5 5"
                    strokeWidth={2}
                    label={{
                      value: `Mín ${selectedRoom.thresholds.humidity.min}${formattedUnit}`,
                      position: "insideTopLeft",
                      fill: "#3b82f6",
                      fontSize: 11,
                    }}
                  />
                  <ReferenceLine
                    y={selectedRoom.thresholds.humidity.max}
                    stroke="#ef4444"
                    strokeDasharray="5 5"
                    strokeWidth={2}
                    label={{
                      value: `Máx ${selectedRoom.thresholds.humidity.max}${formattedUnit}`,
                      position: "insideTopLeft",
                      fill: "#ef4444",
                      fontSize: 11,
                    }}
                  />
                </>
              )}

              {/* Lines for each room */}
              {roomsData.map((room) => (
                <Line
                  key={room.room_id}
                  type="monotone"
                  dataKey={`room_${room.room_id}`}
                  name={`room_${room.room_id}`}
                  stroke={roomColors.get(room.room_id)}
                  strokeWidth={2}
                  dot={{ fill: roomColors.get(room.room_id), strokeWidth: 2, r: 3 }}
                  activeDot={{ r: 5, strokeWidth: 2 }}
                  connectNulls={true}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Room legend */}
        <div className="mt-4 flex flex-wrap gap-4 justify-center">
          {roomsData.map((room) => (
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

// Export types for external use
export type { RoomData, Reading, IndicatorType, CO2Thresholds, MinMaxThresholds, ReadingsChartProps }
