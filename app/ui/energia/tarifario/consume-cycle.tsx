'use client'

import { Card } from '@/components/ui/card'
import { use } from 'react';

interface ConsumptionInvoiceReadings {
  power_contracted: number;
  electrical_panel_type: string; // Podría ser un tipo de unión si hay valores específicos permitidos ('monofasico', 'bifasico', 'trifasico', etc.)
  electrical_panel_threads: number | null; // Asumiendo que puede ser un número o nulo
  energy_provider: string;
  supply_number: number; // O podrías usar string si puede contener caracteres no numéricos
  billing_cycle_start: string; // Representando una fecha como string
  billing_cycle_end: string; // Representando una fecha como string
  ratedays: number;
  total_consumption: number | null; // Asumiendo que es un número o nulo
  cost: number | null; // Asumiendo que es un número o nulo
  first_value: number | null; // Asumiendo que es un número (lectura) o nulo
  last_value: number | null; // Asumiendo que es un número (lectura) o nulo
  date_first_value: string | null; // Representando una fecha como string o nulo
  date_last_value: string | null; // Representando una fecha como string o nulo
}

type ConsumptionInvoiceReadingsPromise = 
  Promise<ConsumptionInvoiceReadings>

export default function ConsumeCycle({ consumptionInvoiceReadings } : { consumptionInvoiceReadings : ConsumptionInvoiceReadingsPromise }) {

  const readings = use(consumptionInvoiceReadings)

  return (
      <Card className="flex-1 p-4 flex flex-col gap-2 shadow-md">
        <h3 className="font-semibold">Consumo del ciclo de facturación actual</h3>
        <div className="w-full grid grid-cols-5 grid-rows-2 gap-2">
          <div className="col-span-2 shadow-sm  rounded-lg p-2">
            <h4 className='text-sm font-medium'>Consumo total energía</h4>
            <p className='text-xs'>{readings?.total_consumption?.toFixed(2)} kWH</p>
          </div>
          <div className="shadow-sm  rounded-lg p-2">
            <h4 className='text-sm font-medium'>Consumo total soles</h4>
            <p className='text-xs'>S/ {readings?.cost}</p>
          </div>
          <div className="shadow-sm  rounded-lg p-2">
            <h4 className='text-sm font-medium'>N° de Suministro</h4>
            <p className='text-xs'>{readings?.supply_number}</p>
          </div>
          <div className="shadow-sm  rounded-lg p-2">
            <h4 className='text-sm font-medium'>Empresa concesionario</h4>
            <p className='text-xs'>{readings?.energy_provider}</p>
          </div>

          <div className="shadow-sm  rounded-lg p-2">
            <h4 className='text-sm font-medium'>Potencia contratado</h4>
            <p className='text-xs'>{readings?.power_contracted} kWh</p>
          </div>
          <div className="shadow-sm  rounded-lg p-2">
            <h4 className='text-sm font-medium'>Tipo</h4>
            <p className='text-xs'>{readings?.electrical_panel_type}</p>
          </div>
          <div className="shadow-sm  rounded-lg p-2">
            <h4 className='text-sm font-medium'>Días facturados</h4>
            <p className='text-xs'>29 de 29 </p>
          </div>
          <div className="col-span-2 shadow-sm rounded-lg p-2">
            <h4 className='text-sm font-medium'>Ciclo de facturación</h4>
            <p className='text-xs'>{readings?.billing_cycle_start} - {readings?.billing_cycle_end}</p>
          </div>
        </div>
      </Card>
  )
}
