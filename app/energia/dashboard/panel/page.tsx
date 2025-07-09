import { getHeadquarters } from '@/app/sevices/filters/data'
import { dashboardTable } from '@/app/sevices/panel/data'
import { SearchParams } from '@/app/type'
import HeadquarterEnergyFilter from '@/app/ui/energia/filters/headquarter-energy-filter'
import ChartComponent from '@/app/ui/energia/panel/chart'
import TableComponent from '@/app/ui/energia/panel/table'
import FiltersContainer from '@/app/ui/filters/filters-container'
import React from 'react'

export default async function page({ searchParams }: SearchParams) {

  const { headquarter, panel = '1',  date_after = new Date(), date_before = new Date()} = await searchParams

  console.log({
    panel,
    date_after,
    date_before
  })

  const headquarters  = await getHeadquarters()
  const { results } = headquarters
  const firstHeadquarter = headquarter || results[0].id.toString()

  const dashboardTableReadings = await dashboardTable({ headquarterId: firstHeadquarter })

  return (
    <div className="relative p-6 flex justify-center items-center gap-8">
      <FiltersContainer>
        <HeadquarterEnergyFilter energyHeadquarter={headquarters.results} energy={firstHeadquarter}/>
        {/* <PanelsFilterEnergy energyPanels={energyDetails.energy_headquarters?.[0].electrical_panels} /> */}
      </FiltersContainer>
      <ChartComponent/>
      <TableComponent readings={dashboardTableReadings}/> 
    </div>
  )
}
