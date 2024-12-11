'use client'

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function RoomFilter() {
  
  return (
    <div className="flex space-x-4 mb-4">
      <Input
        type="text"
        placeholder="Search rooms..."
        className="max-w-xs"
      />
      <Select>
        <SelectTrigger className="w-[240px] bg-[#00b0c7]">
          <SelectValue placeholder="Selecciona un sala" className="text-white font-bold"/>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="salas">Salas</SelectItem>
          <SelectItem value='none'>None</SelectItem>
        </SelectContent>
      </Select>
      <Select>
        <SelectTrigger className="w-[240px] bg-[#00b0c7]">
          <SelectValue placeholder="Selecciona un estado" className="text-white font-bold"/>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="salas">Salas</SelectItem>
          <SelectItem value='none'>None</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

