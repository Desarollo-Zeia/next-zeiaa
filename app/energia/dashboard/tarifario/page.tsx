import { getCompanyData } from "@/app/lib/auth"
import { getEnergyCompanyDetails } from "@/app/sevices/energy/enterprise/data"
import { consumptionCalculator, consumptionInvoice } from "@/app/sevices/energy/tarifario/data"
import { SearchParams } from "@/app/type"
import HeadquarterEnergyFilter from "@/app/ui/energia/filters/headquarter-energy-filter"
import PanelsFilterEnergy from "@/app/ui/energia/filters/panels-energy-filter"
import TopConsumeBilling from "@/app/ui/energia/tarifario/top-consume-billing"
// import ConsumptionTable from "@/app/ui/energia/tarifario/consumption-table"
// import HistoricalCosumption from "@/app/ui/energia/tarifario/historical-consumption"
// import OptionBar from "@/app/ui/energia/tarifario/option-bar"
// import TariffTable from "@/app/ui/energia/tarifario/tariff-table"
import { DatepickerRange } from "@/app/ui/filters/datepicker-range"
import FiltersContainer from "@/app/ui/filters/filters-container"
// import { Card } from "@/components/ui/card"
import { format } from "date-fns";
// import { BadgeAlert } from "lucide-react"


export default async function Page({ searchParams }: SearchParams) {

  const { companies } = await getCompanyData()
  
  const { headquarter = '1' , panel = '1',  date_after = new Date(), date_before = new Date()} = await searchParams

const formattedDateAfter = format(date_after, 'yyyy-MM-dd')
  const formattedDateBefore = format(date_before, 'yyyy-MM-dd')

  // 4. Paralelizar todas las peticiones dependientes
  const [
    energyDetails,
    // consumptionGraphReadings,
    // consumptionTableReadings,
    consumptionCalculatorReadings,
    consumptionInvoiceReadings,
    // consumptionTariffReadings
  ] = await Promise.all([
    getEnergyCompanyDetails({ headquarterId: companies[0].id }),
    // consumptionGraph({
    //   panelId: panel,
    //   headquarterId: headquarter,
    //   date_after: formattedDateAfter,
    //   date_before: formattedDateBefore,
    //   group_by
    // }),
    // consumptionTable({
    //   panelId: panel,
    //   headquarterId: headquarter,
    //   date_after: formattedDateAfter,
    //   date_before: formattedDateBefore,
    //   page
    // }),
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
    // consumptionTariff({
    //   panelId: panel,
    //   headquarterId: headquarter
    // })
  ])

  // const { totalDays, daysPassed, daysRemaining } = billingCycleInfo(consumptionInvoiceReadings?.billing_cycle_start, consumptionInvoiceReadings?.billing_cycle_end, new Date())

  return (
    <div className="w-full">
      <FiltersContainer>
          <HeadquarterEnergyFilter energyHeadquarter={energyDetails.energy_headquarters} />
          <PanelsFilterEnergy energyPanels={  energyDetails.energy_headquarters?.[0].electrical_panels} />
          <DatepickerRange />
      </FiltersContainer>
      <div className="w-full flex flex-col gap-24 px-6">
       <TopConsumeBilling consumptionCalculatorReadings={consumptionCalculatorReadings} consumptionInvoiceReadings={consumptionInvoiceReadings} />
        {/* <div className="w-full relative">
          <div className="p-4 w-full">
            {
              selected === 'Resumen de consumos' && (
                <ConsumptionTable consumptionTableReadings={consumptionTableReadings}/> 
              )
            } 
            {
              selected === 'Historial de consumo' && (
                <HistoricalCosumption type={type} group_by={group_by} consumptionGraphReadings={consumptionGraphReadings}/>
              )
            }
            {
              selected === 'Tarifario' && (
                <TariffTable tariffData={consumptionTariffReadings}/>
              )
            }
            
          </div>
          <div className="absolute rounded-t-lg overflow-hidden bg-slate-100 -top-[56px] flex">
            <OptionBar/>
          </div>
        </div> */}
      </div>
    </div>
  )
}
