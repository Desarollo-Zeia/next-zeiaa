"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useState } from "react"

export default function IndicatorsModal() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="w-full flex justify-center p-2 items-center bg-slate-400 text-sm hover:bg-slate-500 transition-colors">
          <p className="text-white">¿Qué se mide?</p>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Indicadores de Distorsión</DialogTitle>
          <DialogDescription>Descripción de los indicadores de distorsión medidos en el sistema.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <h4 className="font-medium flex items-center gap-2">
              <div className="h-4 w-4 bg-yellow-300 rounded-lg"></div>
              Límite de distorsión en voltaje THD (8%)
            </h4>
            <p className="text-sm text-muted-foreground">
              La Distorsión Armónica Total (THD) en voltaje mide la desviación de la forma de onda de voltaje respecto a
              una onda sinusoidal pura. Un valor superior al 8% puede causar sobrecalentamiento en equipos y reducir su
              vida útil.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium flex items-center gap-2">
              <div className="h-4 w-4 bg-red-500 rounded-lg"></div>
              Límite de distorsión en voltaje armónico (5%)
            </h4>
            <p className="text-sm text-muted-foreground">
              La distorsión armónica individual mide la magnitud de cada componente armónico específico. Valores
              superiores al 5% pueden provocar resonancia en el sistema eléctrico y afectar el funcionamiento de equipos
              sensibles.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">Importancia de la medición</h4>
            <p className="text-sm text-muted-foreground">
              Monitorear estos indicadores permite identificar problemas en la calidad de energía, prevenir daños en
              equipos y optimizar el rendimiento del sistema eléctrico. Las mediciones se realizan conforme a estándares
              internacionales como IEEE 519.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
