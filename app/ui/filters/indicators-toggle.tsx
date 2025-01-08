"use client"

import { useState } from "react"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

const indicators = [
  { id: "co2", name: "CO2", value: "850 ppm" },
  { id: "hcho", name: "HCHO", value: "0.03 mg/m3" },
  { id: "temp", name: "Temperatura", value: "24.5 °C" },
  { id: "humidity", name: "Humedad", value: "55%" },
]

export default function IndicatorToggle() {
  const [selectedIndicator, setSelectedIndicator] = useState(indicators[0].id)

  const handleValueChange = (value: string) => {
    if (value) setSelectedIndicator(value)
  }

  return (
    <ToggleGroup type="single" value={selectedIndicator} onValueChange={handleValueChange} className="justify-center">
      {indicators.map((indicator) => (
        <ToggleGroupItem key={indicator.id} value={indicator.id} aria-label={indicator.name}>
          {indicator.name}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}