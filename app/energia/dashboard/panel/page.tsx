import { getEnergyMeasurementPointPanels } from '@/app/sevices/energy/enterprise/data'
import { getHeadquarters, getMeasurementPoints } from '@/app/sevices/filters/data'
import { consumeGraph, dashboardTable, porcentageGraph } from '@/app/sevices/panel/data'
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

export default async function page({ searchParams }: SearchParams) {


  const { headquarter, panel, point, weekday = '1,2,3,4,5', date_start, date_end, date_after, date_before, this_month, this_week } = await searchParams

  const currentMonthNumber = monthDateRanges[new Date().getMonth() + 1]
  const [defaultStart, defaultFinish] = currentMonthNumber.split(":")

  const formattedDateAfter  = date_after ?  format(date_after,  'yyyy-MM-dd') : undefined
  const formattedDateBefore = date_before ? format(date_before, 'yyyy-MM-dd') : undefined

  const start = date_start || defaultStart;
  const finish = date_end || defaultFinish;

  const headquarters  = await getHeadquarters()

  const { results } = headquarters
  const firstHeadquarter = headquarter || results[0].id.toString()

  const measurementPointsPanels = await getEnergyMeasurementPointPanels({ headquarterId: firstHeadquarter})
  
  const firstPanel = panel || measurementPointsPanels?.results[0]?.id.toString()

  const measurementPoints = await getMeasurementPoints({ electricalpanelId: firstPanel })

  const firstPoint = point || measurementPoints?.results[0]?.measurement_points[0].id.toString()

  const dashboardTableReadings = await dashboardTable({ headquarterId: firstHeadquarter })

  const dashboardPorcentageGraph = await porcentageGraph({ headquarterId: firstHeadquarter, this_month, this_week, date_after:formattedDateAfter , date_before: formattedDateBefore })

  const consumeGraphReadings = await  consumeGraph({
      date_after:  start,
      date_before: finish,
      headquarterId: firstHeadquarter,
      panelId:       firstPanel,
      indicador:     'EPpos',
      point: firstPoint,
      // category,
      // unit,
      last_by: 'day',
      weekday
    })


  return (
    <div className="relative p-6 flex flex-col justify-center gap-8">
      <FiltersContainer>
        <HeadquarterEnergyFilter energyHeadquarter={headquarters.results} energy={firstHeadquarter}/>
        {/* <PanelsFilterEnergy energyPanels={energyDetails.energy_headquarters?.[0].electrical_panels} /> */}
      </FiltersContainer>
      <div className='w-full flex gap-8 justify-between'>
        <ChartComponent electricalPanelData={dashboardPorcentageGraph}/>
        <TableComponent readings={dashboardTableReadings}/> 
      </div>
      <div className='w-full'>
        <div className='flex justify-between gap-4'>
          <div className='flex flex-col justify-center'>
            <p>Consumo energético (kWh) con umbrales</p>
            <p>Gráfico de lunes a viernes con el filtro de fines de semana</p>
          </div>
          <div className='flex flex-col gap-4 px-4'>
            <div className='flex items-end justify-end relative'>
              <MonthFilter/>
            </div>
            <div className='flex justify-between items-center gap-4'>
                <PeriodPickerFilter/>
              <div>
                <MeasurementPointFilter measurementPoints={measurementPoints} point={firstPoint}/>
              </div>
            </div>
          </div>
        </div>
        <div className='w-[80%] h-[740px] flex justify-center items-center m-auto'> 
          <BarChart readingsGraph={consumeGraphReadings}/>
        </div>
      </div>
    </div>
  )
}
