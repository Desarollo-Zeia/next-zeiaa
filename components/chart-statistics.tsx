"use client"

import { useState } from "react"
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

const roomsData = [
  {
    room_id: 325,
    room_name: "Ducto resonador magnético",
    thresholds: {
      co2: { good: 800.0, moderate: 1000.0, unhealthy: 1500.0, dangerous: 2500.0 },
      temperature: { min: 15.0, max: 21.0 },
      humidity: { min: 30.0, max: 60.0, unit: "%" },
    },
    readings: [
      { hour: "08:05", indicator: "HUMIDITY", value: 45.2, status: "GOOD" },
      { hour: "08:37", indicator: "HUMIDITY", value: 48.8, status: "GOOD" },
      { hour: "09:12", indicator: "HUMIDITY", value: 52.1, status: "GOOD" },
      { hour: "09:45", indicator: "HUMIDITY", value: 55.5, status: "GOOD" },
      { hour: "10:08", indicator: "HUMIDITY", value: 58.2, status: "GOOD" },
      { hour: "10:33", indicator: "HUMIDITY", value: 62.8, status: "HUMIDITY_MAX" },
      { hour: "11:02", indicator: "HUMIDITY", value: 67.0, status: "HUMIDITY_MAX" },
      { hour: "11:28", indicator: "HUMIDITY", value: 72.5, status: "HUMIDITY_MAX" },
      { hour: "12:15", indicator: "HUMIDITY", value: 71.0, status: "HUMIDITY_MAX" },
      { hour: "12:42", indicator: "HUMIDITY", value: 68.3, status: "HUMIDITY_MAX" },
      { hour: "13:05", indicator: "HUMIDITY", value: 64.5, status: "HUMIDITY_MAX" },
      { hour: "13:38", indicator: "HUMIDITY", value: 61.8, status: "HUMIDITY_MAX" },
      { hour: "14:10", indicator: "HUMIDITY", value: 58.2, status: "GOOD" },
      { hour: "14:45", indicator: "HUMIDITY", value: 55.5, status: "GOOD" },
      { hour: "15:18", indicator: "HUMIDITY", value: 53.2, status: "GOOD" },
      { hour: "15:50", indicator: "HUMIDITY", value: 50.1, status: "GOOD" },
      { hour: "16:22", indicator: "HUMIDITY", value: 48.9, status: "GOOD" },
      { hour: "16:55", indicator: "HUMIDITY", value: 47.4, status: "GOOD" },
      { hour: "17:30", indicator: "HUMIDITY", value: 46.0, status: "GOOD" },
      { hour: "18:05", indicator: "HUMIDITY", value: 44.8, status: "GOOD" },
    ],
  },
  {
    room_id: 326,
    room_name: "Sala de Operaciones 1",
    thresholds: {
      co2: { good: 800.0, moderate: 1000.0, unhealthy: 1500.0, dangerous: 2500.0 },
      temperature: { min: 18.0, max: 24.0 },
      humidity: { min: 40.0, max: 70.0, unit: "%" },
    },
    readings: [
      { hour: "08:00", indicator: "HUMIDITY", value: 56.5, status: "GOOD" },
      { hour: "08:30", indicator: "HUMIDITY", value: 54.5, status: "GOOD" },
      { hour: "09:00", indicator: "HUMIDITY", value: 52.0, status: "GOOD" },
      { hour: "09:30", indicator: "HUMIDITY", value: 50.5, status: "GOOD" },
      { hour: "10:00", indicator: "HUMIDITY", value: 53.2, status: "GOOD" },
      { hour: "10:30", indicator: "HUMIDITY", value: 58.8, status: "GOOD" },
      { hour: "11:00", indicator: "HUMIDITY", value: 63.0, status: "GOOD" },
      { hour: "11:30", indicator: "HUMIDITY", value: 68.5, status: "GOOD" },
      { hour: "12:00", indicator: "HUMIDITY", value: 74.0, status: "HUMIDITY_MAX" },
      { hour: "12:30", indicator: "HUMIDITY", value: 78.3, status: "HUMIDITY_MAX" },
      { hour: "13:00", indicator: "HUMIDITY", value: 75.5, status: "HUMIDITY_MAX" },
      { hour: "13:30", indicator: "HUMIDITY", value: 71.8, status: "HUMIDITY_MAX" },
      { hour: "14:00", indicator: "HUMIDITY", value: 68.2, status: "GOOD" },
      { hour: "14:30", indicator: "HUMIDITY", value: 65.5, status: "GOOD" },
      { hour: "15:00", indicator: "HUMIDITY", value: 62.2, status: "GOOD" },
      { hour: "15:30", indicator: "HUMIDITY", value: 59.1, status: "GOOD" },
      { hour: "16:00", indicator: "HUMIDITY", value: 56.9, status: "GOOD" },
      { hour: "16:30", indicator: "HUMIDITY", value: 54.4, status: "GOOD" },
      { hour: "17:00", indicator: "HUMIDITY", value: 52.0, status: "GOOD" },
      { hour: "17:30", indicator: "HUMIDITY", value: 50.8, status: "GOOD" },
      { hour: "18:00", indicator: "HUMIDITY", value: 49.5, status: "GOOD" },
    ],
  },
  {
    room_id: 327,
    room_name: "UCI Pediátrica",
    thresholds: {
      co2: { good: 700.0, moderate: 900.0, unhealthy: 1200.0, dangerous: 2000.0 },
      temperature: { min: 20.0, max: 26.0 },
      humidity: { min: 35.0, max: 55.0, unit: "%" },
    },
    readings: [
      { hour: "08:10", indicator: "HUMIDITY", value: 38.5, status: "GOOD" },
      { hour: "08:42", indicator: "HUMIDITY", value: 40.5, status: "GOOD" },
      { hour: "09:15", indicator: "HUMIDITY", value: 43.0, status: "GOOD" },
      { hour: "09:48", indicator: "HUMIDITY", value: 46.5, status: "GOOD" },
      { hour: "10:20", indicator: "HUMIDITY", value: 50.2, status: "GOOD" },
      { hour: "10:52", indicator: "HUMIDITY", value: 54.8, status: "GOOD" },
      { hour: "11:25", indicator: "HUMIDITY", value: 58.0, status: "HUMIDITY_MAX" },
      { hour: "11:58", indicator: "HUMIDITY", value: 55.5, status: "HUMIDITY_MAX" },
      { hour: "12:30", indicator: "HUMIDITY", value: 52.0, status: "GOOD" },
      { hour: "13:02", indicator: "HUMIDITY", value: 49.3, status: "GOOD" },
      { hour: "13:35", indicator: "HUMIDITY", value: 47.5, status: "GOOD" },
      { hour: "14:08", indicator: "HUMIDITY", value: 45.8, status: "GOOD" },
      { hour: "14:40", indicator: "HUMIDITY", value: 48.2, status: "GOOD" },
      { hour: "15:12", indicator: "HUMIDITY", value: 51.5, status: "GOOD" },
      { hour: "15:45", indicator: "HUMIDITY", value: 53.2, status: "GOOD" },
      { hour: "16:18", indicator: "HUMIDITY", value: 50.1, status: "GOOD" },
      { hour: "16:50", indicator: "HUMIDITY", value: 47.9, status: "GOOD" },
      { hour: "17:22", indicator: "HUMIDITY", value: 45.4, status: "GOOD" },
      { hour: "17:55", indicator: "HUMIDITY", value: 43.0, status: "GOOD" },
      { hour: "18:28", indicator: "HUMIDITY", value: 41.8, status: "GOOD" },
    ],
  },
]

const roomColors: Record<number, string> = {
  325: "#3b82f6", // azul
  326: "#10b981", // esmeralda
  327: "#f59e0b", // ámbar
}

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number)
  return hours * 60 + minutes
}

function mergeReadings() {
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
}: {
  active?: boolean
  payload?: Array<{ name: string; value: number; color: string }>
  label?: string
}) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-card p-3 shadow-md">
        <p className="font-medium text-card-foreground mb-2">Hora: {label}</p>
        {payload
          .filter((entry) => entry.value !== null)
          .map((entry, index) => {
            const roomId = entry.name.replace("room_", "")
            const room = roomsData.find((r) => r.room_id === Number(roomId))
            return (
              <p key={index} className="text-sm" style={{ color: entry.color }}>
                {room?.room_name}: {entry.value}%
              </p>
            )
          })}
      </div>
    )
  }
  return null
}

export function HumidityChart() {
  const [selectedRoomId, setSelecatedRoomId] = useState<string>(roomsData[0].room_id.toString())
  const chartData = mergeReadings()

  const selectedRoom = roomsData.find((r) => r.room_id === Number(selectedRoomId))
  const thresholds = selectedRoom?.thresholds.humidity

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Lecturas de Humedad Multi-Sala</CardTitle>
        <CardDescription>Niveles de humedad en diferentes salas a lo largo del día</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <Label htmlFor="room-select" className="text-sm font-medium whitespace-nowrap">
              Mostrar umbrales de:
            </Label>
            <Select value={selectedRoomId} onValueChange={setSelecatedRoomId}>
              <SelectTrigger id="room-select" className="w-[280px]">
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
          </div>
        </div>

        {thresholds && (
          <div className="mb-6 p-4 border rounded-lg bg-muted/30">
            <p className="text-sm font-semibold mb-3" style={{ color: roomColors[Number(selectedRoomId)] }}>
              Umbrales de {selectedRoom?.room_name}:
            </p>
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-1 bg-red-500" style={{ borderStyle: "dashed" }} />
                <span className="text-sm">
                  <span className="font-medium">Mínimo:</span> {thresholds.min} {thresholds.unit}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-1 bg-orange-500" style={{ borderStyle: "dashed" }} />
                <span className="text-sm">
                  <span className="font-medium">Máximo:</span> {thresholds.max} {thresholds.unit}
                </span>
              </div>
            </div>
          </div>
        )}

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
                domain={[20, 90]}
                tick={{ fontSize: 12, fill: "#6b7280" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                formatter={(value) => {
                  const roomId = value.replace("room_", "")
                  const room = roomsData.find((r) => r.room_id === Number(roomId))
                  return room?.room_name || value
                }}
              />

              {thresholds && (
                <>
                  <ReferenceLine
                    y={thresholds.min}
                    stroke="#ef4444"
                    strokeDasharray="5 5"
                    strokeWidth={2}
                    label={{
                      value: `Mín ${thresholds.min}%`,
                      position: "insideTopLeft",
                      fill: "#ef4444",
                      fontSize: 11,
                    }}
                  />
                  <ReferenceLine
                    y={thresholds.max}
                    stroke="#f97316"
                    strokeDasharray="5 5"
                    strokeWidth={2}
                    label={{
                      value: `Máx ${thresholds.max}%`,
                      position: "insideTopLeft",
                      fill: "#f97316",
                      fontSize: 11,
                    }}
                  />
                </>
              )}

              {/* Lines for each room - connectNulls handles different timestamps */}
              {roomsData.map((room) => (
                <Line
                  key={room.room_id}
                  type="monotone"
                  dataKey={`room_${room.room_id}`}
                  name={`room_${room.room_id}`}
                  stroke={roomColors[room.room_id]}
                  strokeWidth={2}
                  dot={{ fill: roomColors[room.room_id], strokeWidth: 2, r: 3 }}
                  activeDot={{ r: 5, strokeWidth: 2 }}
                  connectNulls={true}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 flex flex-wrap gap-4 justify-center">
          {roomsData.map((room) => (
            <div key={room.room_id} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: roomColors[room.room_id] }} />
              <span className="text-sm text-muted-foreground">{room.room_name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
