import { getEnergyMeasurementPointPanels } from '@/app/sevices/energy/enterprise/data'
import { getHeadquarters, getMeasurementPoints } from '@/app/sevices/filters/data'
import { consumeGraph, dashboardTable, lastAlertToday, porcentageGraph } from '@/app/sevices/panel/data'
import { SearchParams } from '@/app/type'
import HeadquarterEnergyFilter from '@/app/ui/energia/filters/headquarter-energy-filter'
import BarChart from '@/app/ui/energia/panel/bar-chart'
import ChartComponent from '@/app/ui/energia/panel/chart'
import TableComponent from '@/app/ui/energia/panel/table'
import FiltersContainer from '@/app/ui/filters/filters-container'
import MeasurementPointFilter from '@/app/ui/filters/measurement-points-filter'
import MonthFilter from '@/app/ui/filters/month-filter'
import PeriodPickerFilter from '@/app/ui/filters/period-picker-filter'
import { format } from 'date-fns'
import React from 'react'
import TodayAlertBanner from '@/app/ui/energia/panel/today-alert-banner'
import { cacheLife } from 'next/cache'
import { getToken } from '@/app/lib/auth'

const monthDateRanges: { [key: number]: string } = {
  1: "2025-01-01:2025-01-31",
  2: "2025-02-01:2025-02-28",
  3: "2025-03-01:2025-03-31",
  4: "2025-04-01:2025-04-30",
  5: "2025-05-01:2025-05-31",
  6: "2025-06-01:2025-06-30",
  7: "2025-07-01:2025-07-31",
  8: "2025-08-01:2025-08-31",
  9: "2025-09-01:2025-09-30",
  10: "2025-10-01:2025-10-31",
  11: "2025-11-01:2025-11-30",
  12: "2025-12-01:2025-12-31",
}

// async function GetHeadquarters(token: string) {
//   'use cache'
//   cacheLife('hours')
//   return await getHeadquarters(token)
// }

// async function GetMeasurementPointsPanels({ token, headquarterId }: { token: string, headquarterId: string }) {
//   'use cache'
//   return await getEnergyMeasurementPointPanels({ headquarterId, token })
// }

// async function GetMeasurementPoints({ electricalpanelId, token }: { electricalpanelId: string, token: string }) {
//   'use cache'
//   return await getMeasurementPoints({ electricalpanelId, token })
// }

// async function GetDashboardTable({ headquarterId, date_after, date_before, unit, page, category, point, token }: { headquarterId: string, date_after?: string, date_before?: string, unit?: string, page?: string, category?: string, point?: string, token: string }) {
//   'use cache'
//   cacheLife('minutes')
//   return await dashboardTable({ headquarterId, date_after, date_before, unit, page, category, point, token })
// }


// async function GetPorcentageGraph({ headquarterId, this_week, this_month, date_after, date_before, token }: { headquarterId: string, this_week?: string, this_month?: string, date_after?: string, date_before?: string, token: string }) {
//   'use cache'
//   return await porcentageGraph({ headquarterId, this_week, this_month, date_after, date_before, token })
// }

// async function GetConsumeGraph({ date_after, date_before, headquarterId, indicador, panelId, point, category, unit, last_by, weekday, token }: { date_after?: string, date_before?: string, headquarterId: string, indicador: string, panelId: string, point: string, category?: string, unit?: string, last_by: string, weekday: string, token: string }) {
//   'use cache'
//   cacheLife('minutes')
//   return await consumeGraph({ date_after, date_before, headquarterId, indicador, panelId, point, category, unit, last_by, weekday, token })
// }

export default async function page({ searchParams }: SearchParams) {

  const { headquarter, panel, point, weekday = '1,2,3,4,5', date_start, date_end, date_after, date_before, this_month, this_week } = await searchParams

  const authToken = await getToken()

  const currentMonthNumber = monthDateRanges[new Date().getMonth() + 1]
  const [defaultStart, defaultFinish] = currentMonthNumber.split(":")

  const formattedDateAfter = date_after ? format(date_after, 'yyyy-MM-dd') : undefined
  const formattedDateBefore = date_before ? format(date_before, 'yyyy-MM-dd') : undefined

  const start = date_start || defaultStart;
  const finish = date_end || defaultFinish;

  const headquarters = await getHeadquarters(authToken!)

  const { results } = headquarters
  const firstHeadquarter = headquarter || results[0].id.toString()

  const measurementPointsPanels = await getEnergyMeasurementPointPanels({ headquarterId: firstHeadquarter, token: authToken! })

  const firstPanel = panel || measurementPointsPanels?.results[0]?.id.toString()

  const measurementPoints = await getMeasurementPoints({ electricalpanelId: firstPanel, token: authToken! })


  const firstPoint = point || measurementPoints?.results[0]?.measurement_points[0].id.toString()


  const dashboardTableReadings = await dashboardTable({ headquarterId: firstHeadquarter, token: authToken!, date_after: formattedDateAfter, date_before: formattedDateBefore, point: firstPoint, page: '1' })

  const alertToday = await lastAlertToday(authToken!)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any

  const dashboardPorcentageGraph = await porcentageGraph({ headquarterId: firstHeadquarter, this_month, this_week, date_after: formattedDateAfter, date_before: formattedDateBefore, token: authToken! })

  const consumeGraphReadings = await consumeGraph({
    date_after: start,
    date_before: finish,
    headquarterId: firstHeadquarter,
    indicador: 'EPpos',
    panelId: firstPanel,
    point: firstPoint,
    // category,
    // unit,
    last_by: 'day',
    weekday,
    token: authToken!
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const thresholds = measurementPoints?.results[0]?.measurement_points.find((mp: any) => mp.id === Number(firstPoint))?.energy_thresholds?.thresholds_values

  return (
    <div className="relative p-6 flex flex-col justify-center gap-8">
      <FiltersContainer>
        <HeadquarterEnergyFilter energyHeadquarter={headquarters.results} energy={firstHeadquarter} />
      </FiltersContainer>
      <TodayAlertBanner alertToday={alertToday} />
      <div className='w-full flex gap-8 justify-between'>
        <ChartComponent electricalPanelData={dashboardPorcentageGraph} />
        <TableComponent readings={dashboardTableReadings} />
      </div>
      <div className='w-full'>
        <div className='flex justify-between gap-4'>
          <div className='flex flex-col justify-center'>
            <p>Consumo energético (kWh) con umbrales</p>
            <p>Gráfico de lunes a viernes con el filtro de fines de semana</p>
          </div>
          <div className='flex flex-col gap-4 px-4'>
            <div className='flex items-end justify-end relative'>
              <MonthFilter />
            </div>
            <div className='flex justify-between items-center gap-4'>
              <PeriodPickerFilter weekday={weekday} />
              <div>
                <MeasurementPointFilter measurementPoints={measurementPoints} point={firstPoint} />
              </div>
            </div>
          </div>
        </div>
        <div className='w-[80%] h-[740px] flex justify-center items-center m-auto'>
          <BarChart readingsGraph={consumeGraphReadings} weekday={weekday} thresholds={thresholds} />
        </div>
      </div>
    </div>
  )
}
