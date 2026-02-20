'use client'

import { useTransition } from 'react'
import { DynamicPie } from '@/components/charts'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { DatepickerRange } from '../../filters/datepicker-range'

interface OtherLoads {
  name: string
  daily_consumption_kwh: number
  consumption_percentage: number
  description: string
}

interface MeasurementPointResult {
  measurement_point_id: number
  measurement_point_name: string
  device_name: string
  is_main: boolean
  is_active: boolean
  daily_consumption_kwh: number
  consumption_percentage: number
  channel: string
  type: string
  capacity: string
  hardware: string
  first_reading_value: number
  last_reading_value: number
  first_reading_time: string
  last_reading_time: string
  total_readings_today: number
}

interface ElectricalPanelData {
  headquarter_id: number
  electrical_panel_id: number
  electrical_panel_name: string
  main_daily_consumption_kwh: number
  total_measurement_points: number
  date: string
  other_loads: OtherLoads
  results: MeasurementPointResult[]
}

const CHART_COLORS = ['#00b0c7', '#D9C4B0', '#F7A5A5', '#A5D6A7', '#CE93D8', '#90CAF9', '#FFCC80']

export default function ChartComponent({ electricalPanelData }: { electricalPanelData: ElectricalPanelData }) {
  const [isPending, startTransition] = useTransition()
  const searchParams = useSearchParams()
  const { replace } = useRouter()
  const pathname = usePathname()

  const month = searchParams.get('this_month')
  const week = searchParams.get('this_week')

  const currentFrequency = month ? 'month' : week ? 'week' : ''

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

  // Datos para el PieChart (excluyendo la llave general que es el primer elemento)
  const chartData = {
    labels: electricalPanelData.results.slice(1).map((item) => item.measurement_point_name),
    datasets: [
      {
        data: electricalPanelData.results.slice(1).map((item) => item.consumption_percentage),
        backgroundColor: CHART_COLORS,
        borderColor: '#ffffff',
        borderWidth: 2,
      },
    ],
  }

  const options: Record<string, unknown> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
        }
      },
      tooltip: {
        callbacks: {
          label: function(context: { label?: string; parsed: number }) {
            return `${context.label}: ${context.parsed.toFixed(1)}%`
          }
        }
      }
    }
  }

  // Llave general (primer elemento)
  const mainSwitch = electricalPanelData.results[0]

  // Items secundarios para el accordion
  const secondaryItems = electricalPanelData.results.slice(1)

  return (
    <div className='flex flex-col gap-4'>
      {electricalPanelData.results?.length > 0 ? (
        <div className='flex gap-6'>
          {/* Mostrar mensaje de ancho completo cuando no hay datos de distribución */}
          {chartData.labels.length === 0 ? (
            <div className="w-full flex flex-col items-center justify-center py-16 px-4">
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
                No hay datos de distribución
              </h3>
              <p className="text-gray-500 text-center max-w-md">
                Este panel no tiene puntos de monitoreo secundarios configurados.
              </p>
            </div>
          ) : (
            <>
              {/* Columna izquierda: Filtros + PieChart - 50% */}
              <div className='w-1/2 flex flex-col gap-4'>
                {/* Filtros compactos encima del PieChart */}
                <div className='flex items-center gap-3 relative'>
                  <DatepickerRange />
                  <ToggleGroup 
                    type="single" 
                    defaultValue='month' 
                    value={currentFrequency} 
                    onValueChange={handleFrequencyChange}
                  >
                    <ToggleGroupItem 
                      value="month" 
                      className={`shadow-sm border text-sm px-3 py-1 ${currentFrequency === 'month' ? 'bg-[#00b0c7] text-white border-[#00b0c7]' : 'bg-white border-gray-200'}`}
                    >
                      Este mes
                    </ToggleGroupItem>
                    <ToggleGroupItem 
                      value="week" 
                      className={`shadow-sm border text-sm px-3 py-1 ${currentFrequency === 'week' ? 'bg-[#00b0c7] text-white border-[#00b0c7]' : 'bg-white border-gray-200'}`}
                    >
                      Esta semana
                    </ToggleGroupItem>
                  </ToggleGroup>
                  {isPending && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/50 rounded-lg">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#00b0c7]"></div>
                    </div>
                  )}
                </div>

                {/* PieChart */}
                <div className="h-[280px] w-full">
                  <DynamicPie data={chartData} options={options} />
                </div>
              </div>

              {/* Columna derecha: Lista de porcentajes - 50% */}
              <div className='w-1/2'>
                {mainSwitch && (
                  <div className="border rounded-lg overflow-hidden shadow-sm">
                    {/* Título principal */}
                    <div className="bg-[#00b0c7] text-white px-4 py-3">
                      <div className="flex justify-between w-full items-center">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full bg-white/40" />
                          <span className="font-semibold">{mainSwitch.measurement_point_name}</span>
                        </div>
                        <span className="font-bold text-lg">{mainSwitch.consumption_percentage}%</span>
                      </div>
                    </div>
                    
                    {/* Lista de items secundarios (siempre visible) */}
                    <div className="bg-white">
                      {secondaryItems.length > 0 ? (
                        secondaryItems.map((item, index) => (
                          <div
                            key={item.measurement_point_id}
                            className="flex justify-between items-center px-4 py-3 border-b last:border-b-0 hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className="w-3 h-3 rounded-full shrink-0"
                                style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                              />
                              <span className="font-medium text-gray-700">{item.measurement_point_name}</span>
                            </div>
                            <span className="font-semibold text-gray-900">{item.consumption_percentage}%</span>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-6 text-center text-gray-500 text-sm">
                          Este panel no tiene puntos de monitoreo secundarios configurados
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
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
            No hay datos de distribución
          </h3>
          <p className="text-gray-500 text-center max-w-md">
            Este panel no tiene puntos de monitoreo secundarios configurados.
          </p>
        </div>
      )}
    </div>
  )
}
