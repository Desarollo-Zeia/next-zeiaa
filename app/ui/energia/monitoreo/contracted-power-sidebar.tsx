"use client"

import { capitalizeFirstLetter } from "@/app/utils/func";
import { Button } from "@/components/ui/button"
import { HelpCircle } from "lucide-react"

interface Panel {
  id: number;
  name: string;
  is_active: boolean;
  type: "monofasico"; // O bien: string, en caso de admitir otros tipos.
  threads: any[] | null; // Se puede refinar el tipo en función de los datos esperados.
}

interface Powers {
  id: number;
  power_installed: number;
  power_contracted: number;
  power_max: number;
}


export default function ContractedPowerSidebar({ panel, powers } : { panel: Panel[], powers: Powers[]}) {
  // Usando el primer elemento del array de resultados
  return (
    <div className="p-4">
      <div className="p-4 space-y-5">
        <div className="flex gap-2">
          <div className="flex-1 bg-gray-100 flex flex-col items-center gap-2 p-2 rounded-lg">
            <p className="text-nowrap text-xs">Potencia contratada</p>
            <p className="font-semibold font-sm">{powers?.[0].power_contracted} kW</p>
          </div>

          <div className="flex-1 bg-gray-100 flex flex-col items-center gap-2 p-2 rounded-lg">
            <p className="text-nowrap text-xs">Tipo</p>
            <p className="font-semibold font-sm">{capitalizeFirstLetter(panel?.[0].type)}</p>
          </div>
        </div>

        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-orange-500"></span>
            <span className="text-sm">Máxima demanda de potencia</span>
            <span className="text-sm font-medium ml-auto text-nowrap">{powers?.[0].power_max} kW</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
            <span className="text-sm">Potencia contratada</span>
            <span className="text-sm font-medium ml-auto text-nowrap">{powers?.[0].power_contracted} kW</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500"></span>
            <span className="text-sm">Potencia instalada</span>
            <span className="text-sm font-medium ml-auto text-nowrap">{powers?.[0].power_installed} kW</span>
          </div>
        </div>

        <Button variant="secondary" className="w-full gap-2 text-sm h-8">
          <HelpCircle className="w-3.5 h-3.5" />
          ¿Qué se mide?
        </Button>
      </div>
    </div>
  )
}

