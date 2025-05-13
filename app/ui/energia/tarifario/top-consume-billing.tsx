'use client'

import { Card } from "@/components/ui/card"
import { BadgeAlert } from "lucide-react"

export default function TopConsumeBilling({ consumptionCalculatorReadings, consumptionInvoiceReadings } : { consumptionCalculatorReadings: any, consumptionInvoiceReadings: any }) { // eslint-disable-line @typescript-eslint/no-explicit-any
  return (
     <div className="w-full flex gap-2">
          <Card className="p-4 flex flex-col gap-2 shadow-md">
            <h3 className="font-semibold">Calculadora de consumos</h3>
            <div className="flex gap-4">
              <div>
                <p className='text-sm font-medium'>Consumo total de energía</p>
                { consumptionCalculatorReadings?.consumption ? <p className="text-4xl font-semibold mt-4">S/ {consumptionCalculatorReadings?.consumption?.toFixed(2)}</p> : <p className="mt-4 font-bold flex flex-col items-center"> Intente otras fechas
                  <BadgeAlert />
                  </p>}
              </div>
              <div>
                <p className='text-sm font-medium'>Consumo total soles</p>
                 { consumptionCalculatorReadings?.consumption ? <p className="text-4xl font-semibold mt-4">S/ {consumptionCalculatorReadings?.cost}</p> : <p className="mt-4 font-bold flex flex-col items-center"> Intente otras fechas
                  <BadgeAlert className="text-center"/>
                  </p>}
              </div>
            </div>
          </Card>
          <Card className="flex-1 p-4 flex flex-col gap-2 shadow-md">
            <h3 className="font-semibold">Consumo del ciclo de facturación actual</h3>
            <div className="w-full grid grid-cols-5 grid-rows-2 gap-2">
              <div className="col-span-2 shadow-sm  rounded-lg p-2">
                <h4 className='text-sm font-medium'>Consumo total energía</h4>
                <p className='text-xs'>{consumptionInvoiceReadings?.total_consumption.toFixed(2)} kWH</p>
              </div>
              <div className="shadow-sm  rounded-lg p-2">
                <h4 className='text-sm font-medium'>Consumo total soles</h4>
                <p className='text-xs'>S/ {consumptionInvoiceReadings?.cost}</p>
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
                <p className='text-xs'>29 de 29 </p>
              </div>
              <div className="col-span-2 shadow-sm rounded-lg p-2">
                <h4 className='text-sm font-medium'>Ciclo de facturación</h4>
                <p className='text-xs'>{consumptionInvoiceReadings?.billing_cycle_start} - {consumptionInvoiceReadings?.billing_cycle_end}</p>
              </div>
            </div>
          </Card>
        </div>
  )
}
