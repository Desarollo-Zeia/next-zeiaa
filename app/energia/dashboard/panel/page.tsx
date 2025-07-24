import { getHeadquarters } from '@/app/sevices/filters/data'
import { dashboardTable } from '@/app/sevices/panel/data'
import { SearchParams } from '@/app/type'
import HeadquarterEnergyFilter from '@/app/ui/energia/filters/headquarter-energy-filter'
import BarChart from '@/app/ui/energia/panel/bar-chart'
import ChartComponent from '@/app/ui/energia/panel/chart'
import TableComponent from '@/app/ui/energia/panel/table'
import FiltersContainer from '@/app/ui/filters/filters-container'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import React from 'react'

function ButtonSelect() {
  return (
    <Select>
      <SelectTrigger className="w-[180px] bg-[#00b0c7]">
        <SelectValue placeholder="risa" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="light">Jaja</SelectItem>
        <SelectItem value="dark">Jeje</SelectItem>
        <SelectItem value="system">Jiji</SelectItem>
      </SelectContent>
    </Select>
  )
} 

export default async function page({ searchParams }: SearchParams) {

  const { headquarter } = await searchParams

  const headquarters  = await getHeadquarters()

  const { results } = headquarters
  const firstHeadquarter = headquarter || results[0].id.toString()

  const dashboardTableReadings = await dashboardTable({ headquarterId: firstHeadquarter })

  return (
    <div className="relative p-6 flex flex-col justify-center gap-8">
      <FiltersContainer>
        <HeadquarterEnergyFilter energyHeadquarter={headquarters.results} energy={firstHeadquarter}/>
        {/* <PanelsFilterEnergy energyPanels={energyDetails.energy_headquarters?.[0].electrical_panels} /> */}
      </FiltersContainer>
      <div className='w-full flex gap-6 justify-between'>
        <ChartComponent/>
        <TableComponent readings={dashboardTableReadings}/> 
      </div>
      <div className='w-full'>
        <div className='flex justify-between gap-4'>
          <div className='flex flex-col justify-center'>
            <p>Consumo energético (kWh) con umbrales</p>
            <p>Gráfico de lunes a viernes con el filtro de fines de semana</p>
          </div>
          <div className='flex flex-col gap-4'>
            <div className='flex items-end justify-end'>
              <ButtonSelect/>
            </div>
            <div className='flex justify-between gap-4'>
              <div className='flex gap-2'>
                <ButtonSelect/>
                <ButtonSelect/>
                <ButtonSelect/>
              </div>
              <div>
                <ButtonSelect/>
              </div>
            </div>
          </div>
        </div>
        <BarChart/>
      </div>
    </div>
  )
}
