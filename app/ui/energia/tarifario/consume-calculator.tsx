'use client'
import { Card } from '@/components/ui/card'
import { BadgeAlert, PiggyBank } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

interface ConsumptionCalculatorReadings  {
  consumption?: number,
  cost?: number,
  first_value?: number,
  last_value?: number,
  date_first_value?: string,
  date_last_value?: string
}

export default function ConsumeCalculator({ consumptionCalculatorReadings } : { consumptionCalculatorReadings : ConsumptionCalculatorReadings}) {

  return (
       <Card className="p-4 flex flex-col gap-2 shadow-md justify-between">
          <h3 className="font-semibold text-center text-base">Calculadora de consumos</h3>
          <div className="flex gap-4">
            <div>
              <p className='text-sm font-medium'>Consumo total de energía</p>
              { consumptionCalculatorReadings?.consumption ? <p className="text-4xl font-semibold mt-2">S/ {consumptionCalculatorReadings?.consumption?.toFixed(2)}</p> : <p className="mt-2 font-bold flex flex-col items-center"> Intente otras fechas
                <BadgeAlert />
                </p>}
            </div>
            <div>
              <p className='text-sm font-medium'>Consumo total soles</p>
                { consumptionCalculatorReadings?.consumption ? <p className="text-4xl font-semibold mt-2">S/ {consumptionCalculatorReadings?.cost}</p> : <p className="mt-2 font-bold flex flex-col items-center"> Intente otras fechas
                <BadgeAlert className="text-center"/>
                </p>}
            </div>
          </div>
          <Link href={'/energia/dashboard/tarifario/historial-consumo'}>
            <div className='bg-[#01b7ca] flex justify-center items-center p-4 rounded-lg gap-2'>
              <PiggyBank color='white'/>
              <p className='text-white'>Visualizar historial de consumo</p>
            </div>
          </Link>
        </Card>
  )
}
