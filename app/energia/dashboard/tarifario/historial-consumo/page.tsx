// import { getCompanyData } from '@/app/lib/auth'
import { getHeadquarters } from '@/app/sevices/energy/enterprise/data'
import { consumptionGraph, consumptionTable } from '@/app/sevices/energy/tarifario/data'
import { SearchParams } from '@/app/type'
import HeadquarterEnergyFilter from '@/app/ui/energia/filters/headquarter-energy-filter'
// import PanelsFilterEnergy from '@/app/ui/energia/filters/panels-energy-filter'
import ConsumptionTable from '@/app/ui/energia/tarifario/consumption-table'
import HistoricalCosumption from '@/app/ui/energia/tarifario/historical-consumption'
import { DatepickerRange } from '@/app/ui/filters/datepicker-range'
import FiltersContainer from '@/app/ui/filters/filters-container'
import { format } from 'date-fns'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export default async function page({ searchParams } : SearchParams) {

  const { headquarter = '1' , panel = '1',  date_after = new Date(), date_before = new Date(), page = '1', group_by = 'day'} = await searchParams

  const formattedDateAfter = format(date_after, 'yyyy-MM-dd')
  const formattedDateBefore = format(date_before, 'yyyy-MM-dd')

  const headquarters  = await getHeadquarters()
  const { results } = headquarters
  const firstHeadquarter = headquarter || results[0].id


    const consumptionGraphPromise = await consumptionGraph({
    panelId: panel,
    headquarterId: firstHeadquarter,
    date_after: formattedDateAfter,
    date_before: formattedDateBefore,
    group_by,
  })

  const consumptionTablePromise = await consumptionTable({
    panelId: panel,
    headquarterId: firstHeadquarter,
    date_after: formattedDateAfter,
    date_before: formattedDateBefore,
    page,
  })
  
  const [
  consumptionGraphReadings,
  consumptionTableReadings,
] = await Promise.all([
  consumptionGraphPromise,
  consumptionTablePromise,
])

  return (
    <div className='w-full'>
      <FiltersContainer>
          <Link href={'/energia/dashboard/tarifario/'}
          className="bg-[#00b0c7] rounded-lg absolute top-1/2 left-6 p-2
            transform -translate-y-1/2 cursor-pointer text-white hover:bg-gray-100 hover:text-black"
            > 
            <ArrowLeft className="h-4 w-4 "/>
          </Link>
          <HeadquarterEnergyFilter energyHeadquarter={headquarters.results} energy={firstHeadquarter}/>
          {/* <PanelsFilterEnergy energyPanels={energyDetails.energy_headquarters?.[0].electrical_panels} /> */}
          <DatepickerRange />
      </FiltersContainer> 
      <section>
        <ConsumptionTable consumptionTableReadings={consumptionTableReadings}/> 
        <HistoricalCosumption group_by={group_by} consumptionGraphReadings={consumptionGraphReadings}/>
      </section>
    </div>  
  )
}
