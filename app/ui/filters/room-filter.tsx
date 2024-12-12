'use client'

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"

export default function RoomFilter() {
  
  return (
    <div className="flex space-x-4 mb-4">
      <div className="relative">
        <Input
          type="text"
          placeholder="Search rooms..."
          className="max-w-xs"
        />
        <div className="absolute inset-y-0 right-0 flex items-center px-3">
          <Search className="h-5 w-5"/>
        </div>
      </div>
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

