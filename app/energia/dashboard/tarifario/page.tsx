// import { getCompanyData } from "@/app/lib/auth"
import { getHeadquarters } from "@/app/sevices/energy/enterprise/data"
import { consumptionCalculator, consumptionInvoice, 
  // consumptionTariff
 } from "@/app/sevices/energy/tarifario/data"
import { SearchParams } from "@/app/type"
import HeadquarterEnergyFilter from "@/app/ui/energia/filters/headquarter-energy-filter"
// import PanelsFilterEnergy from "@/app/ui/energia/filters/panels-energy-filter"
import ConsumeCalculator from "@/app/ui/energia/tarifario/consume-calculator"
import ConsumeCycle from "@/app/ui/energia/tarifario/consume-cycle"
import { DatepickerRange } from "@/app/ui/filters/datepicker-range"
import FiltersContainer from "@/app/ui/filters/filters-container"
import NoResultsFound from "@/app/ui/no-result"
// import NoResultFound from "@/app/ui/no-result-found"
// import { Card } from "@/components/ui/card"
import { format } from "date-fns";
import { Suspense } from "react"
// import TariffTable from "@/app/ui/energia/tarifario/tariff-table"
// import { BadgeAlert } from "lucide-react"


export default async function Page({ searchParams }: SearchParams) {

  
  const { headquarter , panel = '1',  date_after = new Date(), date_before = new Date()} = await searchParams

  const formattedDateAfter = format(date_after, 'yyyy-MM-dd')
  const formattedDateBefore = format(date_before, 'yyyy-MM-dd')

    const headquarters  = await getHeadquarters()
    const { results } = headquarters
    const firstHeadquarter = headquarter || results[0].id.toString()
  // Fetch energy details first as it's needed for filters


  const consumptionCalculatorPromise = consumptionCalculator({
    panelId: panel,
    headquarterId: firstHeadquarter,
    date_after: formattedDateAfter,
    date_before: formattedDateBefore,
  })

  const consumptionInvoicePromise = consumptionInvoice({
    panelId: panel,
    headquarterId: firstHeadquarter,
  })

  // const consumptionTariffPromise = consumptionTariff({
  //   panelId: panel,
  //   headquarterId: firstHeadquarter,
  // })

  const [
  calculatorResult,
  invoiceResult,
  // tariffData,
] = await Promise.all([
  consumptionCalculatorPromise,
  consumptionInvoicePromise,
  // consumptionTariffPromise,
])

  return (
    <div className="w-full">
      <FiltersContainer>
          <HeadquarterEnergyFilter energyHeadquarter={headquarters.results} energy={firstHeadquarter}/>
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
        {/* <div className="w-full shadow-md">
          <TariffTable tariffData={tariffData}/>
        </div> */}
        <div>
          <NoResultsFound message="No hay detalle tarifario por ahora" suggestion="Intente revisar otros datos"/>
        </div>
      </div>
    </div>
  )
}
