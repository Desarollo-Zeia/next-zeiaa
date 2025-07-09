'use client'
import React from 'react'
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend,
  ArcElement
} from "chart.js";
import { Button } from '@/components/ui/button'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

ChartJS.register(LineElement, PointElement, LinearScale, TimeScale, ArcElement, Tooltip, Legend)

  const data = {
  labels: ['Aire Acondicionado', 'Equipo 1', 'Equipo 2'],
  datasets: [
    {
      label: 'Dataset 1',
      data: [30, 20, 50], // ✅ Array con los valores
      backgroundColor: [
        'red',
        'purple',
        'orange'
      ], // ✅ Array de colores
    }
  ]
};


export default function ChartComponent() {
  return (
    <div className='flex flex-col gap-4'>
      <div className='flex justify-end'>
        <Button className='bg-gray-500 px-2 py-1 text-sm'>
          Ver historial
        </Button>
      </div>
      <div>
        <p className='text-balance'>Distribución de consumo en tiempo real</p>
      </div>
      <Pie
           options={
             {
             responsive: true,
             plugins: {
               legend: {
                display: false,
                position: 'top',
               },
               title: {
                 display: true,
                 text: 'Chart.js Pie Chart'
               }
             }
             }  
           }
           data={data}
         />
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger className='bg-[#00b0c7] text-white rounded-lg'>
            <div className='flex justify-between w-full px-4'>
              <p className='font-semibold'>Tablero General</p>
              <p>100%</p>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className='flex justify-between w-full px-4'>
              <p className='font-semibold flex items-center gap-1 '><div className='w-2 h-2 rounded-full bg-red-400'/> Aire Acondicionado</p>
              <p className='mr-6'>30%</p>
            </div>
            <div className='flex justify-between w-full px-4'>
              <p className='font-semibold flex items-center gap-1 '><div className='w-2 h-2 rounded-full bg-purple-400'/>Equipo 1</p>
              <p className='mr-6'>20%</p>
            </div>
            <div className='flex justify-between w-full px-4'>
              <p className='font-semibold flex items-center gap-1 '><div className='w-2 h-2 rounded-full bg-orange-300'/>Equipo 2</p>
              <p className='mr-6'>50%</p>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
