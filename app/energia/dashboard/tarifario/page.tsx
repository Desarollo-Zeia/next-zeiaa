import { getCompanyData } from "@/app/lib/auth"
import { getEnergyCompanyDetails } from "@/app/sevices/energy/enterprise/data"
import { consumptionCalculator, consumptionInvoice, consumptionTariff } from "@/app/sevices/energy/tarifario/data"
import { SearchParams } from "@/app/type"
import HeadquarterEnergyFilter from "@/app/ui/energia/filters/headquarter-energy-filter"
import PanelsFilterEnergy from "@/app/ui/energia/filters/panels-energy-filter"
import ConsumeCalculator from "@/app/ui/energia/tarifario/consume-calculator"
import ConsumeCycle from "@/app/ui/energia/tarifario/consume-cycle"
import { DatepickerRange } from "@/app/ui/filters/datepicker-range"
import FiltersContainer from "@/app/ui/filters/filters-container"
// import { Card } from "@/components/ui/card"
import { format } from "date-fns";
import { Suspense } from "react"
import TariffTable from "@/app/ui/energia/tarifario/tariff-table"
// import { BadgeAlert } from "lucide-react"


export default async function Page({ searchParams }: SearchParams) {

  const { companies } = await getCompanyData()  
  
  const { headquarter = '1' , panel = '1',  date_after = new Date(), date_before = new Date()} = await searchParams

  const formattedDateAfter = format(date_after, 'yyyy-MM-dd')
  const formattedDateBefore = format(date_before, 'yyyy-MM-dd')

  // Fetch energy details first as it's needed for filters
  const energyDetails = await getEnergyCompanyDetails({
    headquarterId: companies[0].id,
  })


  const consumptionCalculatorPromise = consumptionCalculator({
    panelId: panel,
    headquarterId: headquarter,
    date_after: formattedDateAfter,
    date_before: formattedDateBefore,
  })

  const consumptionInvoicePromise = consumptionInvoice({
    panelId: panel,
    headquarterId: headquarter,
  })

  const consumptionTariffPromise = consumptionTariff({
    panelId: panel,
    headquarterId: headquarter,
  })

  const [
  calculatorResult,
  invoiceResult,
  tariffResult,
] = await Promise.all([
  consumptionCalculatorPromise,
  consumptionInvoicePromise,
  consumptionTariffPromise,
]);


  return (
    <div className="w-full">
      <FiltersContainer>
      
          <HeadquarterEnergyFilter energyHeadquarter={energyDetails.energy_headquarters} />
          <PanelsFilterEnergy energyPanels={energyDetails.energy_headquarters?.[0].electrical_panels} />
          <DatepickerRange />
      </FiltersContainer> 
      <div className="w-full flex flex-col gap-4 px-6">
        <div className="w-full flex gap-2">
          <Suspense fallback={<p>Cargando...</p>}>
            <ConsumeCalculator consumptionCalculatorReadings={calculatorResult}/>
          </Suspense>
          <Suspense fallback={<p>Cargando...</p>}>
            <ConsumeCycle consumptionInvoiceReadings={invoiceResult}/>
          </Suspense>
        </div>
        <div className="w-full shadow-md">
          <TariffTable tariffData={tariffResult}/>
          {/* <TarrifDetail consumptionTariffReadings={consumptionTariffPromise} consumptionTableReadings={consumptionTablePromise} group_by={group_by} consumptionGraphReadings={consumptionGraphPromise}/> */}
        </div>
      </div>
    </div>
  )
}
