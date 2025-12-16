'use client'
import React, { useTransition } from 'react'
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend,
  ArcElement,
  Colors,
} from "chart.js";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import annotationPlugin from 'chartjs-plugin-annotation';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { DatepickerRange } from '../../filters/datepicker-range';

interface OtherLoads {
  name: string;
  daily_consumption_kwh: number;
  consumption_percentage: number;
  description: string;
}

interface MeasurementPointResult {
  measurement_point_id: number;
  measurement_point_name: string;
  device_name: string;
  is_main: boolean;
  is_active: boolean;
  daily_consumption_kwh: number;
  consumption_percentage: number;
  channel: string;
  type: string;
  capacity: string;
  hardware: string;
  first_reading_value: number;
  last_reading_value: number;
  first_reading_time: string;
  last_reading_time: string;
  total_readings_today: number;
}

interface ElectricalPanelData {
  headquarter_id: number;
  electrical_panel_id: number;
  electrical_panel_name: string;
  main_daily_consumption_kwh: number;
  total_measurement_points: number;
  date: string;
  other_loads: OtherLoads;
  results: MeasurementPointResult[];
}

ChartJS.register(LineElement, PointElement, LinearScale, TimeScale, ArcElement, Tooltip, Legend, Colors, annotationPlugin)

export default function ChartComponent({ electricalPanelData }: { electricalPanelData: ElectricalPanelData }) {

  console.log(electricalPanelData)

  const [isPending, startTransition] = useTransition()
  const searchParams = useSearchParams()
  const { replace } = useRouter()
  const pathname = usePathname()

  const month = searchParams.get('this_month')
  const week = searchParams.get('this_week')

  const currentFrequncy = month ? 'month' : week ? 'week' : ''

  const handleFrequencyChange = (frequency: string) => {

    startTransition(() => {
      const params = new URLSearchParams(searchParams)
      params.delete("date_after")
      params.delete("date_before")
      if (frequency === 'month') {
        params.set("this_month", 'true')
        params.delete("this_week")
      } else {
        params.set("this_week", 'true')
        params.delete("this_month")
      }

      replace(`${pathname}?${params.toString()}`, { scroll: false })
    })
  }

  const graphData = {
    labels: electricalPanelData.results.slice(1).map(electrical => electrical.measurement_point_name),
    datasets: [
      {
        label: '',
        data: electricalPanelData.results.slice(1).map(electrical => (electrical.consumption_percentage)),
        backgroundColor: [
          '#BBDCE5',
          '#D9C4B0',
          '#F7A5A5'
        ]
      }
    ]
  }

  return (
    <div className='flex flex-col gap-4'>
      <div className='relative'>
        <DatepickerRange />
        <ToggleGroup type="single" defaultValue='month' value={currentFrequncy} onValueChange={handleFrequencyChange}>
          <ToggleGroupItem value="month" className='shadow-md'>Este mes</ToggleGroupItem>
          <ToggleGroupItem value="week" className='shadow-md'>Esta semana</ToggleGroupItem>
        </ToggleGroup>
        {isPending && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
          </div>
        )}
      </div>
      {
        electricalPanelData.results.length > 0 ? (
          <>
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
                      display: false,
                      text: 'Chart.js Pie Chart'
                    },
                    tooltip: {
                      callbacks: {
                        label: function (ctx) {
                          return `${ctx.formattedValue}%`
                        }
                      }
                    }
                  }
                }
              }
              data={graphData}
            />
            <Accordion type="single" collapsible defaultValue='item-1'>
              <AccordionItem value="item-1">
                <AccordionTrigger className='bg-[#00b0c7] text-white rounded-lg'>
                  <div className='flex justify-between gap-4 w-full px-4'>
                    <p className='font-semibold'>{electricalPanelData.results[0]?.measurement_point_name}</p>
                    <p>{electricalPanelData.results[0]?.consumption_percentage}%</p>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  {
                    electricalPanelData?.results?.slice(1).map(electrical => {
                      return (
                        <div className='flex justify-between w-full px-4' key={electrical?.measurement_point_name}>
                          <div className='font-semibold flex items-center gap-1 '>
                            <div className='w-2 h-2 rounded-full bg-black' />
                            <p>{electrical?.measurement_point_name}</p>
                          </div>
                          <p className='mr-6'>{electrical?.consumption_percentage}%</p>
                        </div>
                      )
                    })
                  }
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-purple-100 blur-2xl opacity-30 rounded-full"></div>
              <svg
                className="relative w-24 h-24 text-gray-300 mb-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No hay datos disponibles
            </h3>

            <p className="text-gray-500 text-center max-w-md">
              No se encontró información para la fecha seleccionada.
              Intenta seleccionar un rango de fechas diferente.
            </p>
          </div>
        )
      }

    </div>
  )
}
