'use client'

import { Card } from '@/components/ui/card'
import { differenceInDays, format, parseISO } from 'date-fns';

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

export default function ConsumeCycle({ consumptionInvoiceReadings } : { consumptionInvoiceReadings : ConsumptionInvoiceReadings }) {


  const fecha1 = parseISO(consumptionInvoiceReadings?.billing_cycle_start)
  const fecha2 = parseISO(consumptionInvoiceReadings?.billing_cycle_end)
  const hoy = new Date()

  const dias = differenceInDays(fecha2, fecha1)
  const count = differenceInDays(hoy, fecha1)

  return (
      <Card className="flex-1 p-4 flex flex-col gap-2 shadow-md">
        <h3 className="font-semibold">Consumo del ciclo de facturación actual</h3>
        <div className="w-full grid grid-cols-5 grid-rows-2 gap-2">
          <div className="col-span-2 shadow-sm  rounded-lg p-2">
            <h4 className='text-sm font-medium'>Consumo total energía</h4>
            <p className='text-xs'>{consumptionInvoiceReadings?.total_consumption?.toFixed(2)} kWH</p>
          </div>
          <div className="shadow-sm  rounded-lg p-2">
            <h4 className='text-sm font-medium'>Consumo total soles</h4>
            <p className='text-xs'>S/ {consumptionInvoiceReadings?.cost?.toFixed(2)}</p>
          </div>
          <div className="shadow-sm  rounded-lg p-2">
            <h4 className='text-sm font-medium'>N° de Suministro</h4>
            <p className='text-xs'>{consumptionInvoiceReadings?.supply_number}</p>
          </div>
          <div className="shadow-sm  rounded-lg p-2">
            <h4 className='text-sm font-medium'>Empresa concesionario</h4>
            <p className='text-xs'>{consumptionInvoiceReadings?.energy_provider}</p>
          </div>

          <div className="shadow-sm  rounded-lg p-2">
            <h4 className='text-sm font-medium'>Potencia contratado</h4>
            <p className='text-xs'>{consumptionInvoiceReadings?.power_contracted} kWh</p>
          </div>
          <div className="shadow-sm  rounded-lg p-2">
            <h4 className='text-sm font-medium'>Tipo</h4>
            <p className='text-xs'>{consumptionInvoiceReadings?.electrical_panel_type}</p>
          </div>
          <div className="shadow-sm  rounded-lg p-2">
            <h4 className='text-sm font-medium'>Días facturados</h4>
            <p className='text-xs'>{count} de {dias}</p>
          </div>
          <div className="col-span-2 shadow-sm rounded-lg p-2">
            <h4 className='text-sm font-medium'>Ciclo de facturación</h4>
            <p className='text-xs'>{format(consumptionInvoiceReadings?.billing_cycle_start, 'dd-MM-yyyy')} - {format(consumptionInvoiceReadings?.billing_cycle_end, 'dd-MM-yyyy')}</p>
          </div>
        </div>
      </Card>
  )
}
