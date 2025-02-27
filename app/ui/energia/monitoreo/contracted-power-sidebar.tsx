"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { HelpCircle } from "lucide-react"

export default function ContractedPowerSidebar() {
  return (
    <Card className="p-4 shadow-md">
      <div className="p-4 space-y-5">
        <div className="space-y-1">
          <h2 className="text-sm text-muted-foreground">Potencia contrada</h2>
          <p className="text-2xl font-bold">200kW</p>
        </div>

        <div className="space-y-1">
          <h3 className="text-sm text-muted-foreground">Tipo</h3>
          <p className="text-base font-medium">Trifásica</p>
        </div>

        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-orange-500"></span>
            <span className="text-sm">Máxima demanda de potencia</span>
            <span className="text-sm font-medium ml-auto text-nowrap">50 kw</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
            <span className="text-sm">Potencia contratada</span>
            <span className="text-sm font-medium ml-auto text-nowrap">45 kw</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500"></span>
            <span className="text-sm">Potencia simulada</span>
            <span className="text-sm font-medium ml-auto text-nowrap">55 kw</span>
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

