"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Eye } from "lucide-react"
import Link from "next/link"

const excessPowerEvents = [
  {
    date: "Miércoles 12 de julio",
    time: "8:00am",
    power: "150kw",
    status: "Consumo excedente",
  },
  {
    date: "Miércoles 12 de julio",
    time: "10:00am",
    power: "150kw",
    status: "Consumo excedente",
  },
  {
    date: "Miércoles 12 de julio",
    time: "11:00am",
    power: "150kw",
    status: "Consumo excedente",
  },
]

export default function ExcessPower() {
  return (
    <Card className="w-full">
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-lg font-medium">Potencia excedente</h2>
            <p className="text-sm text-muted-foreground">Durante el período seleccionado en el filtro de fecha</p>
          </div>
          <Link href={'/energia/dashboard/monitoreo/potencia-excedente'}>
            <Button variant="secondary" size="sm" className="gap-2">
                <Eye className="w-4 h-4" />
                Ver detalles
            </Button>
          </Link>
        </div>

        <div className="space-y-1">
          {excessPowerEvents.map((event, index) => (
            <div key={index} className="p-3 rounded-lg text-sm flex items-center gap-1 bg-sky-50/50">
              <span>
                El {event.date} a las {event.time} con{" "}
              </span>
              <span className="font-medium">{event.power}</span>
              <span>(</span>
              <span className="text-red-500">{event.status}</span>
              <span>)</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}

