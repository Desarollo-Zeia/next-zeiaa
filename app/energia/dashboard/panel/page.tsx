import { getEnergyMeasurementPointPanels } from '@/app/sevices/energy/enterprise/data'
import { getHeadquarters, getMeasurementPoints } from '@/app/sevices/filters/data'
import { dashboardTable, porcentageGraph } from '@/app/sevices/panel/data'
import { SearchParams } from '@/app/type'
import HeadquarterEnergyFilter from '@/app/ui/energia/filters/headquarter-energy-filter'
import BarChart from '@/app/ui/energia/panel/bar-chart'
import ChartComponent from '@/app/ui/energia/panel/chart'
import TableComponent from '@/app/ui/energia/panel/table'
import FiltersContainer from '@/app/ui/filters/filters-container'
import MeasurementPointFilter from '@/app/ui/filters/measurement-points-filter'
import MonthFilter from '@/app/ui/filters/month-filter'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import React from 'react'

export default async function page({ searchParams }: SearchParams) {

  const { headquarter, panel, point } = await searchParams

  const headquarters  = await getHeadquarters()

  const { results } = headquarters
  const firstHeadquarter = headquarter || results[0].id.toString()

  const measurementPointsPanels = await getEnergyMeasurementPointPanels({ headquarterId: firstHeadquarter})
  
  const firstPanel = panel || measurementPointsPanels?.results[0]?.id.toString()

  const measurementPoints = await getMeasurementPoints({ electricalpanelId: firstPanel })

  const firstPoint = point || measurementPoints?.results[0]?.measurement_points[0].id.toString()

  const dashboardTableReadings = await dashboardTable({ headquarterId: firstHeadquarter })

  const dashboardPorcentageGraph = await porcentageGraph({ headquarterId: firstHeadquarter })

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
            <div className='flex items-end justify-end'>
              <MonthFilter/>
            </div>
            <div className='flex justify-between items-center gap-4'>
              <ToggleGroup type="single" defaultValue='a'>
                <ToggleGroupItem value="a">Lunes a viernes</ToggleGroupItem>
                <ToggleGroupItem value="b">Sábado</ToggleGroupItem>
                <ToggleGroupItem value="c">Domingo</ToggleGroupItem>
              </ToggleGroup>
              <div>
                <MeasurementPointFilter measurementPoints={measurementPoints} point={firstPoint}/>
              </div>
            </div>
          </div>
        </div>
        <div className='w-[80%] h-[740px] flex justify-center items-center m-auto'> 
          <BarChart/>
        </div>
      </div>
    </div>
  )
}
