"use client"

import { useState, useMemo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { format } from "date-fns"
import { mockData } from "./mock-data"
import { ELECTRIC_PARAMETERS } from "./electric-parameters"
import { PARAMETER_GROUPS } from "./parameter-groups"

const ITEMS_PER_PAGE = 10

export default function ElectricDashboard() {
  const [selectedGroup, setSelectedGroup] = useState("Voltaje (V)")
  const [selectedParameter, setSelectedParameter] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

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

  // Transform all data
  const allTableData = useMemo(() => {
    return mockData.results
      .map((reading) => {
        const values = reading.indicators[0].values_per_channel[0].values
        const timestamp = new Date(reading.created_at)
        return {
          date: format(timestamp, "yyyy-MM-dd"),
          time: format(timestamp, "HH:mm:ss"),
          timestamp: format(timestamp, "HH:mm"),
          ...values,
        }
      })
      .reverse()
  }, [])

  // Paginate data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    return allTableData.slice(startIndex, endIndex)
  }, [allTableData, currentPage])

  // Calculate total pages
  const totalPages = Math.ceil(allTableData.length / ITEMS_PER_PAGE)

  // Prepare chart data for selected parameter
  const chartData = useMemo(() => {
    if (!selectedParameter) return []
    return allTableData.map((row) => ({
      timestamp: row.timestamp,
      value: row[selectedParameter],
    }))
  }, [allTableData, selectedParameter])

  // Get filtered columns based on selected group
  const filteredColumns = parametersByGroup[selectedGroup] || []

  // Generate pagination items
  const paginationItems = useMemo(() => {
    const items = []
    const maxVisiblePages = 5
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(i)
    }

    return items
  }, [currentPage, totalPages])

  return (
    <div className="p-4 h-screen flex flex-col">
      <div className="mb-4">
        <Select value={selectedGroup} onValueChange={setSelectedGroup}>
          <SelectTrigger className="w-[280px] bg-[#00b0c7]">
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
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0">
        {/* Tabla y Paginación */}
        <div className="flex flex-col min-h-0">
          <div className="flex-1 overflow-auto rounded-md border">
            <Table>
              <TableHeader className="sticky top-0 bg-background">
                <TableRow>
                  <TableHead className="sticky left-0 bg-background">Fecha</TableHead>
                  <TableHead className="sticky left-[81px] bg-background">Hora</TableHead>
                  {filteredColumns.map((param) => (
                    <TableHead
                      key={param}
                      className="cursor-pointer hover:bg-muted whitespace-nowrap"
                      onClick={() => setSelectedParameter(param)}
                      title={ELECTRIC_PARAMETERS[param].parameter}
                    >
                      {param}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="sticky left-0 bg-background">{row.date}</TableCell>
                    <TableCell className="sticky left-[81px] bg-background">{row.time}</TableCell>
                    {filteredColumns.map((param) => (
                      <TableCell key={param} className="whitespace-nowrap">
                        {row[param]?.toFixed(2) || "-"}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <Pagination className="justify-center mt-4">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    if (currentPage > 1) setCurrentPage(currentPage - 1)
                  }}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              {paginationItems[0] > 1 && (
                <>
                  <PaginationItem>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        setCurrentPage(1)
                      }}
                    >
                      1
                    </PaginationLink>
                  </PaginationItem>
                  {paginationItems[0] > 2 && <PaginationEllipsis />}
                </>
              )}

              {paginationItems.map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      setCurrentPage(page)
                    }}
                    isActive={currentPage === page}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}

              {paginationItems[paginationItems.length - 1] < totalPages && (
                <>
                  {paginationItems[paginationItems.length - 1] < totalPages - 1 && <PaginationEllipsis />}
                  <PaginationItem>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        setCurrentPage(totalPages)
                      }}
                    >
                      {totalPages}
                    </PaginationLink>
                  </PaginationItem>
                </>
              )}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    if (currentPage < totalPages) setCurrentPage(currentPage + 1)
                  }}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>

        {/* Gráfica */}
        <div className="h-full">
          <Card className="p-4 h-full">
            {selectedParameter ? (
              <>
                <h3 className="mb-4 text-lg font-medium">{ELECTRIC_PARAMETERS[selectedParameter].parameter}</h3>
                <div className="h-[calc(100%-3rem)]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="timestamp" angle={-45} textAnchor="end" height={60} />
                      <YAxis
                        label={{
                          value: ELECTRIC_PARAMETERS[selectedParameter].unit,
                          angle: -90,
                          position: "insideLeft",
                        }}
                      />
                      <Tooltip />
                      <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                Selecciona una columna para ver la gráfica
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}

