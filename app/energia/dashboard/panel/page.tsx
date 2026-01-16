import { getEnergyMeasurementPointPanels } from '@/app/services/energy/enterprise/data'
import { getHeadquarters, getMeasurementPoints } from '@/app/services/filters/data'
import { consumeGraph, dashboardTable, lastAlertToday, porcentageGraph } from '@/app/services/panel/data'
import { SearchParams } from '@/app/type'
import HeadquarterEnergyFilter from '@/app/ui/energia/filters/headquarter-energy-filter'
import BarChart from '@/app/ui/energia/panel/bar-chart'
import ChartComponent from '@/app/ui/energia/panel/chart'
import TableComponent from '@/app/ui/energia/panel/table'
import FiltersContainer from '@/app/ui/filters/filters-container'
import MeasurementPointFilter from '@/app/ui/filters/measurement-points-filter'
import MonthFilter from '@/app/ui/filters/month-filter'
import YearFilter from '@/app/ui/filters/year-filter'
import PeriodPickerFilter from '@/app/ui/filters/period-picker-filter'
import { format } from 'date-fns'
import React, { Suspense } from 'react'
import TodayAlertBanner from '@/app/ui/energia/panel/today-alert-banner'
import { getToken } from '@/app/lib/auth'
import PanelsFilterEnergy from '@/app/ui/energia/filters/panels-energy-filter'
import IndicatorEnergyFilter from '@/app/ui/filters/indicator-energy-filter'

function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)
}

function getLastDayOfMonth(year: number, month: number): number {
  const daysInMonth: { [key: number]: number } = {
    1: 31,
    2: isLeapYear(year) ? 29 : 28,
    3: 31,
    4: 30,
    5: 31,
    6: 30,
    7: 31,
    8: 31,
    9: 30,
    10: 31,
    11: 30,
    12: 31,
  }
  return daysInMonth[month]
}

function getMonthDateRange(year: number, month: number): string {
  const startDate = `${year}-${month.toString().padStart(2, '0')}-01`
  const lastDay = getLastDayOfMonth(year, month)
  const endDate = `${year}-${month.toString().padStart(2, '0')}-${lastDay.toString().padStart(2, '0')}`
  return `${startDate}:${endDate}`
}

// Componente que maneja la carga de datos
async function DashboardContent({ searchParams }: SearchParams) {
  const {
    headquarter,
    panel,
    point,
    weekday = '1,2,3,4,5',
    date_start,
    date_end,
    date_after,
    date_before,
    this_month,
    this_week,
    year,
    indicador
  } = await searchParams

  const authToken = await getToken()

  const currentYear = new Date().getFullYear()
  const selectedYear = year ? parseInt(year, 10) : currentYear
  const currentMonth = new Date().getMonth() + 1

  const defaultMonthRange = getMonthDateRange(selectedYear, currentMonth)
  const [defaultStart, defaultFinish] = defaultMonthRange.split(":")

  const formattedDateAfter = date_after ? format(date_after, 'yyyy-MM-dd') : undefined
  const formattedDateBefore = date_before ? format(date_before, 'yyyy-MM-dd') : undefined

  const start = date_start || defaultStart;
  const finish = date_end || defaultFinish;

  const headquarters = await getHeadquarters(authToken!)

  const { results } = headquarters
  const firstHeadquarter = headquarter || results[0].id.toString()

  const measurementPointsPanels = await getEnergyMeasurementPointPanels({
    headquarterId: firstHeadquarter,
    token: authToken!
  })

  const firstPanel = panel || measurementPointsPanels?.results[0]?.id.toString()

  const measurementPoints = await getMeasurementPoints({
    electricalpanelId: firstPanel,
    token: authToken!
  })



  const firstPoint = point || measurementPoints?.results[0]?.measurement_points[0].id.toString()

  const selectedIndicador = indicador || 'EPpos'

  const dashboardTableReadings = await dashboardTable({
    headquarterId: firstHeadquarter,
    token: authToken!,
    date_after: formattedDateAfter,
    date_before: formattedDateBefore,
    point: firstPoint,
    panelId: firstPanel
  })

  const alertToday = await lastAlertToday(authToken!)

  const dashboardPorcentageGraph = await porcentageGraph({
    headquarterId: firstHeadquarter,
    this_month,
    this_week,
    date_after: formattedDateAfter,
    date_before: formattedDateBefore,
    panelId: firstPanel,
    token: authToken!
  })

  const consumeGraphReadings = await consumeGraph({
    date_after: start,
    date_before: finish,
    headquarterId: firstHeadquarter,
    indicador: selectedIndicador,
    panelId: firstPanel,
    point: firstPoint,
    last_by: 'day',
    weekday,
    token: authToken!
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const thresholds = measurementPoints?.results[0]?.measurement_points?.find((mp: any) =>
    mp.id === Number(firstPoint)
  )?.energy_thresholds?.thresholds_values

  return (
    <>
      <FiltersContainer>
        <PanelsFilterEnergy energyPanels={measurementPointsPanels.results} panel={firstPanel} />
        <HeadquarterEnergyFilter energyHeadquarter={headquarters.results} energy={firstHeadquarter} />
      </FiltersContainer>
      {/* <TodayAlertBanner alertToday={alertToday} /> */}
      <ChartComponent electricalPanelData={dashboardPorcentageGraph} />
      <TableComponent readings={dashboardTableReadings} />
      <div className='w-full'>
        <div className='flex justify-between gap-4'>

          <div className='flex flex-col gap-4 px-4'>
            <div className='flex items-end justify-end relative gap-2'>
              <YearFilter year={selectedYear.toString()} />
              <MonthFilter year={selectedYear.toString()} />
            </div>
            <div className='flex justify-between items-center gap-4'>
              <PeriodPickerFilter weekday={weekday} />
              <div className='flex gap-2'>
                <PanelsFilterEnergy energyPanels={measurementPointsPanels.results} panel={firstPanel} />
                <MeasurementPointFilter measurementPoints={measurementPoints} point={firstPoint} />
                <IndicatorEnergyFilter indicador={selectedIndicador} />
              </div>
            </div>
          </div>
        </div>
        <div className='w-[80%] flex justify-center items-center m-auto'>
          <BarChart readingsGraph={consumeGraphReadings} weekday={weekday} thresholds={thresholds} />
        </div>
      </div>
    </>
  )
}

// Skeleton de carga
function DashboardSkeleton() {
  return (
    <div className="relative p-6 flex flex-col justify-center gap-8">
      {/* Filtros skeleton */}
      <div className="h-12 bg-gray-200 rounded animate-pulse"></div>

      {/* Banner de alerta skeleton */}
      <div className="h-16 bg-gray-200 rounded animate-pulse"></div>

      {/* Gráficos y tabla skeleton */}
      <div className='w-full flex gap-8 justify-between'>
        <div className="flex-1 h-64 bg-gray-200 rounded animate-pulse"></div>
        <div className="flex-1 h-64 bg-gray-200 rounded animate-pulse"></div>
      </div>

      {/* Gráfico de barras skeleton */}
      <div className='w-full'>
        <div className='flex justify-between gap-4 mb-4'>
          <div className='flex flex-col gap-2'>
            <div className="h-6 w-64 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-80 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className='flex flex-col gap-4 px-4'>
            <div className="h-10 w-40 bg-gray-200 rounded animate-pulse"></div>
            <div className='flex gap-4'>
              <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-10 w-48 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
        <div className='w-[80%] h-[740px] bg-gray-200 rounded animate-pulse m-auto'></div>
      </div>
    </div>
  )
}

// Componente de página principal
export default function Page({ searchParams }: SearchParams) {
  return (
    <div className="relative p-6 flex flex-col justify-center gap-8">
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent searchParams={searchParams} />
      </Suspense>
    </div>
  )
}