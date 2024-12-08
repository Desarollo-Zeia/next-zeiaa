'use client'

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function RoomFilter() {
  
  return (
    <div className="flex space-x-4 mb-4">
      <Select >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by location" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">All locations</SelectItem>
          <SelectItem value='none'>None</SelectItem>
        </SelectContent>
      </Select>
      <Input
        type="text"
        placeholder="Search rooms..."
        className="max-w-sm"
      />
    </div>
  )
}

