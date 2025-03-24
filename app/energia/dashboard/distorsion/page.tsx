import { getCompanyData } from '@/app/lib/auth'
import { armonics, armonicsGraph } from '@/app/sevices/energy/distorsion/data'
import { getEnergyCompanyDetails } from '@/app/sevices/energy/enterprise/data'
import { SearchParams } from '@/app/type'
import CurrentChart from '@/app/ui/energia/distorsion/current-chart'
import CurrentVoltageToggle from '@/app/ui/energia/distorsion/current-voltage-toggle'
import VoltageChart from '@/app/ui/energia/distorsion/voltage-current'
import { DateRangePicker } from '@/app/ui/energia/filters/datepicker-energy-filter'
import HeadquarterEnergyFilter from '@/app/ui/energia/filters/headquarter-energy-filter'
import PanelsFilterEnergy from '@/app/ui/energia/filters/panels-energy-filter'
import FiltersContainer from '@/app/ui/filters/filters-container'
import { format } from 'date-fns'

export default async function page({ searchParams } : SearchParams) {

  const { companies } = await getCompanyData()
  
    const { headquarter = '1' , panel = '1',  date_after = format(new Date(), 'yyyy-MM-dd'), date_before = format(new Date(), 'yyyy-MM-dd'), data_type = 'current'} = await searchParams
  
    const energyDetails = await getEnergyCompanyDetails({ headquarterId: companies[0].id })

    const armonicsReadings = await armonics({ headquarterId: headquarter, panelId: panel, date_after, date_before, data_type })
    const armonicsGraphReadings = await armonicsGraph({ headquarterId: headquarter, panelId: panel, date_after, date_before, data_type })

    console.log(armonicsReadings)

  return (
    <div className='w-full'>
      <FiltersContainer>
        <HeadquarterEnergyFilter energyHeadquarter={energyDetails.energy_headquarters} />
        <PanelsFilterEnergy energyPanels={energyDetails.energy_headquarters[0].electrical_panels} />
        <DateRangePicker/>
      </FiltersContainer>
      <div className="mx-6">
        <CurrentVoltageToggle type={data_type}/>
        <div>
          {
            data_type === 'current' ? 
            (
              <CurrentChart currentReadings={armonicsGraphReadings}/>
            ) : 
            (
              <VoltageChart voltageReadings={armonicsGraphReadings}/>
            )
          }
        </div>
      </div>
    </div>
  )
}
