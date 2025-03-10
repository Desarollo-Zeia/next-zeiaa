"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { HelpCircle } from "lucide-react"

export default function ContractedPowerSidebar() {
  // Usando el primer elemento del array de resultados
  const firstResult = {
    created_at: "2025-02-21T09:53:46.405834-05:00",
    device: {
      id: 1,
      dev_eui: "24e124468d440660",
      name: "Device 1",
    },
    indicators: [
      {
        id: 9122,
        measurement_point_name: "Unidad 1",
        power: 588.31,
        exceeded_thresholds: [
          {
            threshold: "Potencia instalada",
            power_exceeded: 568.31,
          },
          {
            threshold: "Potencia contratada",
            power_exceeded: 538.31,
          },
          {
            threshold: "Potencia máxima",
            power_exceeded: 488.31,
          },
        ],
      },
    ],
  }

  const indicator = firstResult.indicators[0]
  const currentPower = indicator.power

  // Valores directos de los umbrales excedidos
  const installedPowerExceeded =
    indicator.exceeded_thresholds.find((t) => t.threshold === "Potencia instalada")?.power_exceeded || 0
  const contractedPowerExceeded =
    indicator.exceeded_thresholds.find((t) => t.threshold === "Potencia contratada")?.power_exceeded || 0
  const maxPowerExceeded =
    indicator.exceeded_thresholds.find((t) => t.threshold === "Potencia máxima")?.power_exceeded || 0

  // Calculando los valores reales (la diferencia entre la potencia actual y el exceso)
  const installedPower = currentPower - installedPowerExceeded
  const contractedPower = currentPower - contractedPowerExceeded
  const maxPower = currentPower - maxPowerExceeded

  return (
    <Card className="p-4 shadow-md">
      <div className="p-4 space-y-5">
        <div className="space-y-1">
          <h2 className="text-sm text-muted-foreground">Potencia contratada</h2>
          <p className="text-2xl font-bold">{contractedPower.toFixed(0)}kW</p>
        </div>

        <div className="space-y-1">
          <h3 className="text-sm text-muted-foreground">Modelo</h3>
          <p className="text-base font-medium">Trifásico</p>
        </div>

        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-orange-500"></span>
            <span className="text-sm">Potencia máxima</span>
            <span className="text-sm font-medium ml-auto text-nowrap">{maxPower.toFixed(0)} kW</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
            <span className="text-sm">Potencia contratada</span>
            <span className="text-sm font-medium ml-auto text-nowrap">{contractedPower.toFixed(0)} kW</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500"></span>
            <span className="text-sm">Potencia instalada</span>
            <span className="text-sm font-medium ml-auto text-nowrap">{installedPower.toFixed(0)} kW</span>
          </div>
        </div>

        <Button variant="secondary" className="w-full gap-2 text-sm h-8">
          <HelpCircle className="w-3.5 h-3.5" />
          ¿Qué se mide?
        </Button>
      </div>
    </Card>
  )
}

