'use client'
import { Card } from '@/components/ui/card'
import { BadgeAlert } from 'lucide-react'
import React, { use } from 'react'

interface ConsumptionCalculatorReadings  {
  consumption?: number,
  cost?: number,
  first_value?: number,
  last_value?: number,
  date_first_value?: string,
  date_last_value?: string
}

type ConsumptionCalculatorReadingsPromise =
  Promise<ConsumptionCalculatorReadings>;

export default function ConsumeCalculator({ consumptionCalculatorReadings } : { consumptionCalculatorReadings : ConsumptionCalculatorReadingsPromise}) {

  const readings = use(consumptionCalculatorReadings)

  return (
       <Card className="p-4 flex flex-col gap-2 shadow-md">
          <h3 className="font-semibold">Calculadora de consumos</h3>
          <div className="flex gap-4">
            <div>
              <p className='text-sm font-medium'>Consumo total de energía</p>
              { readings?.consumption ? <p className="text-4xl font-semibold mt-4">S/ {readings?.consumption?.toFixed(2)}</p> : <p className="mt-4 font-bold flex flex-col items-center"> Intente otras fechas
                <BadgeAlert />
                </p>}
            </div>
            <div>
              <p className='text-sm font-medium'>Consumo total soles</p>
                { readings?.consumption ? <p className="text-4xl font-semibold mt-4">S/ {readings?.cost}</p> : <p className="mt-4 font-bold flex flex-col items-center"> Intente otras fechas
                <BadgeAlert className="text-center"/>
                </p>}
            </div>
          </div>
        </Card>
  )
}
