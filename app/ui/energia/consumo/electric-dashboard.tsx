"use client"

import { useState, useMemo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { mockData } from "./mock-data"
import { ELECTRIC_PARAMETERS } from "./electric-parameters"
import { PARAMETER_GROUPS } from "./parameter-groups"

export default function ElectricDashboard() {
  const [selectedGroup, setSelectedGroup] = useState("Voltaje (V)")
  const [selectedParameter, setSelectedParameter] = useState<string | null>(null)

  // Group parameters by measurement type
  const parametersByGroup = useMemo(() => {
    const groups: Record<string, string[]> = {}
    Object.entries(ELECTRIC_PARAMETERS).forEach(([key, value]) => {
      const groupEntry = Object.entries(PARAMETER_GROUPS).find(([_, unit]) => unit === value.unit)
      if (groupEntry) {
        const [groupName] = groupEntry
        if (!groups[groupName]) {
          groups[groupName] = []
        }
        groups[groupName].push(key)
      }
    })
    return groups
  }, [])

  // Filter and transform data for the table
  const tableData = useMemo(() => {
    return mockData.results
      .map((reading) => {
        const values = reading.indicators[0].values_per_channel[0].values
        const timestamp = new Date(reading.created_at)
        return {
          date: format(timestamp, "EEEE, d 'de' MMMM", { locale: es }),
          time: format(timestamp, "HH:mm:ss"),
          timestamp: format(timestamp, "HH:mm"),
          ...values,
        }
      })
      .reverse()
  }, [])

  // Prepare chart data for selected parameter
  const chartData = useMemo(() => {
    if (!selectedParameter) return []
    return tableData.map((row) => ({
      timestamp: row.timestamp,
      value: row[selectedParameter],
    }))
  }, [tableData, selectedParameter])

  // Get filtered columns based on selected group
  const filteredColumns = parametersByGroup[selectedGroup] || []

  return (
    <div className="space-y-4 p-4">
      <Select value={selectedGroup} onValueChange={setSelectedGroup}>
        <SelectTrigger className="w-[280px]">
          <SelectValue placeholder="Seleccionar tipo de medida" />
        </SelectTrigger>
        <SelectContent>
          {Object.keys(parametersByGroup).map((groupName) => (
            <SelectItem key={groupName} value={groupName}>
              {groupName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[200px]">Fecha</TableHead>
              <TableHead>Hora</TableHead>
              {filteredColumns.map((param) => (
                <TableHead
                  key={param}
                  className="cursor-pointer hover:bg-muted"
                  onClick={() => setSelectedParameter(param)}
                  title={ELECTRIC_PARAMETERS[param].parameter}
                >
                  {param}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableData.map((row, idx) => (
              <TableRow key={idx}>
                <TableCell className="capitalize">{row.date}</TableCell>
                <TableCell>{row.time}</TableCell>
                {filteredColumns.map((param) => (
                  <TableCell key={param}>{row[param]?.toFixed(2) || "-"}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedParameter && (
        <Card className="p-4">
          <h3 className="mb-4 text-lg font-medium text-black">{ELECTRIC_PARAMETERS[selectedParameter].parameter}</h3>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" angle={-45} textAnchor="end" height={60} style={{ fill: "black" }} />
                <YAxis
                  style={{ fill: "black" }}
                  label={{
                    value: ELECTRIC_PARAMETERS[selectedParameter].unit,
                    angle: -90,
                    position: "insideLeft",
                    stroke: "black",
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #ccc",
                    color: "black",
                  }}
                  labelStyle={{ color: "black" }}
                  itemStyle={{ color: "black" }}
                />
                <Bar dataKey="value" fill="#00b0c7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}
    </div>
  )
}

