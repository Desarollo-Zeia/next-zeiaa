import { getCompanyData } from "@/app/lib/auth"
import { getEnergyCompanyDetails } from "@/app/sevices/energy/enterprise/data"
import { consumptionCalculator, consumptionGraph, consumptionInvoice, consumptionTable, consumptionTariff } from "@/app/sevices/energy/tarifario/data"
import { SearchParams } from "@/app/type"
import HeadquarterEnergyFilter from "@/app/ui/energia/filters/headquarter-energy-filter"
import PanelsFilterEnergy from "@/app/ui/energia/filters/panels-energy-filter"
import ConsumeCalculator from "@/app/ui/energia/tarifario/consume-calculator"
import ConsumeCycle from "@/app/ui/energia/tarifario/consume-cycle"
import { DatepickerRange } from "@/app/ui/filters/datepicker-range"
import FiltersContainer from "@/app/ui/filters/filters-container"
// import { Card } from "@/components/ui/card"
import { format } from "date-fns";
import TarrifDetail from "@/app/ui/energia/tarifario/tariff-detail"
// import { BadgeAlert } from "lucide-react"


export default async function Page({ searchParams }: SearchParams) {

  const { companies } = await getCompanyData()
  
  const { headquarter = '1' , panel = '1',  date_after = new Date(), date_before = new Date(), page = '1', group_by = 'hour'} = await searchParams

  const formattedDateAfter = format(date_after, 'yyyy-MM-dd')
  const formattedDateBefore = format(date_before, 'yyyy-MM-dd')

  // 4. Paralelizar todas las peticiones dependientes
  const [
    energyDetails,
    consumptionGraphReadings,
    consumptionTableReadings,
    consumptionCalculatorReadings,
    consumptionInvoiceReadings,
    consumptionTariffReadings
  ] = await Promise.all([
    getEnergyCompanyDetails({ headquarterId: companies[0].id }),
    consumptionGraph({
      panelId: panel,
      headquarterId: headquarter,
      date_after: formattedDateAfter,
      date_before: formattedDateBefore,
      group_by
    }),
    consumptionTable({
            panelId: panel,
            headquarterId: headquarter,
            date_after: formattedDateAfter,
            date_before: formattedDateBefore,
            page
          }),
    consumptionCalculator({
      panelId: panel,
      headquarterId: headquarter,
      date_after: formattedDateAfter,
      date_before: formattedDateBefore
    }),
    consumptionInvoice({
      panelId: panel,
      headquarterId: headquarter
    }),
    consumptionTariff({
      panelId: panel,
      headquarterId: headquarter
    })
  ])


  return (
    <div className="w-full">
      <FiltersContainer>
          <HeadquarterEnergyFilter energyHeadquarter={energyDetails.energy_headquarters} />
          <PanelsFilterEnergy energyPanels={energyDetails.energy_headquarters?.[0].electrical_panels} />
          <DatepickerRange />
      </FiltersContainer> 
      <div className="w-full flex flex-col gap-24 px-6">
        <div className="w-full flex gap-2">
          <ConsumeCalculator consumptionCalculatorReadings={consumptionCalculatorReadings}/>
          <ConsumeCycle consumptionInvoiceReadings={consumptionInvoiceReadings}/>
        </div>
        <div className="w-full shadow-md">
          <TarrifDetail consumptionTariffReadings={consumptionTariffReadings} consumptionTableReadings={consumptionTableReadings} group_by={group_by} consumptionGraphReadings={consumptionGraphReadings}/>
        </div>
      </div>
    </div>
  )
}
