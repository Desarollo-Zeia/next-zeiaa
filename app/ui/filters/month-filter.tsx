'use client'
import React from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'


function MonthFilter() {
   const handleMonth = (month: string) => {
    const [start, finish] = month.split(':')

    console.log({
      start,
      finish
    })
  }
  return (
      <Select onValueChange={handleMonth}>
      <SelectTrigger className="w-[180px] bg-[#00b0c7]">
        <SelectValue placeholder="Meses" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="2025-01-01:2025-01-31">Enero</SelectItem>
        <SelectItem value="2025-02-01:2025-02-28">Febrero</SelectItem>
        <SelectItem value="2025-03-01:2025-03-31">Marzo</SelectItem>
        <SelectItem value="2025-04-01:2025-04-30">Abril</SelectItem>
        <SelectItem value="2025-05-01:2025-05-31">Mayo</SelectItem>
        <SelectItem value="2025-06-01:2025-06-30">Junio</SelectItem>
        <SelectItem value="2025-07-01:2025-07-31">Julio</SelectItem>
        <SelectItem value="2025-08-01:2025-08-31">Agosto</SelectItem>
        <SelectItem value="2025-09-01:2025-09-30">Septiembre</SelectItem>
        <SelectItem value="2025-10-01:2025-10-31">Octubre</SelectItem>
        <SelectItem value="2025-11-01:2025-11-30">Noviembre</SelectItem>
        <SelectItem value="2025-12-01:2025-12-31">Diciembre</SelectItem>
      </SelectContent>
    </Select>
  )
}

export default MonthFilter