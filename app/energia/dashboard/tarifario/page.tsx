// import { getCompanyData } from "@/app/lib/auth"
import { getHeadquarters } from "@/app/sevices/energy/enterprise/data"
import {
  consumptionCalculator, consumptionCalculatorMonthly,
  // consumptionTariff
} from "@/app/sevices/energy/tarifario/data"
import { SearchParams } from "@/app/type"
import HeadquarterEnergyFilter from "@/app/ui/energia/filters/headquarter-energy-filter"
// import PanelsFilterEnergy from "@/app/ui/energia/filters/panels-energy-filter"
// import ConsumeCalculator from "@/app/ui/energia/tarifario/consume-calculator"
// import ConsumeCycle from "@/app/ui/energia/tarifario/consume-cycle"
import CostDifferenceChecker from "@/app/ui/energia/tarifario/cost-difference-checker"
import { DatepickerRange } from "@/app/ui/filters/datepicker-range"
import FiltersContainer from "@/app/ui/filters/filters-container"
// import MonthFilter from "@/app/ui/filters/month-filter"
// import MonthPicker from "@/app/ui/filters/month-picker"
import NoResultsFound from "@/app/ui/no-result"
import { Card } from "@/components/ui/card"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import NoResultFound from "@/app/ui/no-result-found"
// import { Card } from "@/components/ui/card"
import { format } from "date-fns";
// import { Suspense } from "react"
// import TariffTable from "@/app/ui/energia/tarifario/tariff-table"
// import { BadgeAlert } from "lucide-react"


export default async function Page({ searchParams }: SearchParams) {


  const { headquarter, panel = '1', date_after = new Date(), date_before = new Date(), firstmonth, secondmonth } = await searchParams

  const formattedDateAfter = format(date_after, 'yyyy-MM-dd')
  const formattedDateBefore = format(date_before, 'yyyy-MM-dd')

  const headquarters = await getHeadquarters()
  const { results } = headquarters
  const firstHeadquarter = headquarter || results[0].id.toString()
  // Fetch energy details first as it's needed for filters


  const consumptionCalculatorPromise = consumptionCalculator({
    panelId: panel,
    headquarterId: firstHeadquarter,
    date_after: formattedDateAfter,
    date_before: formattedDateBefore,
  })

  // const consumptionInvoicePromise = consumptionInvoice({
  //   panelId: panel,
  //   headquarterId: firstHeadquarter,
  // })

  const firstConsumptionCalculatorMonthlyPromise = consumptionCalculatorMonthly({
    headquarterId: firstHeadquarter,
    filter_month: firstmonth || '',
  })

  const secondConsumptionCalculatorMonthlyPromise = consumptionCalculatorMonthly({
    headquarterId: firstHeadquarter,
    filter_month: secondmonth || '',
  })


  // const consumptionTariffPromise = consumptionTariff({
  //   panelId: panel,
  //   headquarterId: firstHeadquarter,
  // })

  const [
    calculatorResult,
    firstCalculatorResultMonthly,
    secondCalculatorResultMonthly,
    // tariffData,
  ] = await Promise.all([
    consumptionCalculatorPromise,
    firstConsumptionCalculatorMonthlyPromise,
    secondConsumptionCalculatorMonthlyPromise
  ])

  console.log('Holaa', calculatorResult)


  return (
    <div className="w-full">
      <FiltersContainer>
        <HeadquarterEnergyFilter energyHeadquarter={headquarters.results} energy={firstHeadquarter} />
        <DatepickerRange />
      </FiltersContainer>
      <div className="w-full flex flex-col gap-4 px-6">
        {
          calculatorResult?.detail ? (
            <NoResultsFound message="No hay datos de consumo" suggestion="Intente revisar otros módulos" />
          ) :
            (
              <div className="w-full flex items-center justify-center gap-2">
                {/* <Suspense fallback={<p>Cargando...</p>}>
            <ConsumeCalculator consumptionCalculatorReadings={calculatorResult}/>
          </Suspense> */}
                <Card className="p-4 flex flex-col gap-2 shadow-md justify-between">
                  <h3 className="font-semibold text-center text-base">Consumo del día</h3>
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between gap-4">
                      <div className="flex flex-col justify-center items-center">
                        <p className='text-sm font-medium'>Consumo energía en punta</p>
                        <p className="text-center">{calculatorResult?.consumption?.peak.toFixed(2)} KWh</p>
                      </div>
                      <div className="flex flex-col justify-center items-center">
                        <p className='text-sm font-medium'>Consumo energía fuera de punta</p>
                        <p className="text-center">{calculatorResult?.consumption?.off_peak.toFixed(2)} KWh</p>
                      </div>
                    </div>
                    <div className="flex justify-between gap-4">
                      <div className="flex flex-col justify-center items-center">
                        <p className='text-sm font-medium'>Consumo en soles en punta</p>
                        <p className="text-center">S/ {calculatorResult?.cost?.peak.toFixed(2)}</p>
                      </div>
                      <div className="flex flex-col justify-center items-center">
                        <p className='text-sm font-medium'>Consumo en soles fuera de punta</p>
                        <p className="text-center">S/ {calculatorResult?.cost?.off_peak.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                </Card>
                {/* <Suspense fallback={<p>Cargando...</p>}>
            <ConsumeCycle consumptionInvoiceReadings={invoiceResult}/>
          </Suspense> */}
              </div>
            )
        }
        {calculatorResult?.detail ? '' : <div> <h2>Calculadora de cosumo de energía</h2> </div>}
        {/* <div className="flex justify-between">
          <div className="flex-1">
            <MonthPicker/>
            <Card className="p-4 flex flex-col gap-2 shadow-md justify-between">
              <div className="flex flex-col gap-4">
                <div className="flex justify-evenly gap-4">
                  <div className="flex flex-col justify-center items-center">
                    <p className='text-sm font-medium'>En punta</p>
                    <p className="text-center">25 KWh</p>
                  </div>
                  <div>
                    =
                  </div>
                  <div className="flex flex-col justify-center items-center">
                    <div className="flex flex-col justify-center items-center">
                      <p className='text-sm font-medium'>En punta</p>
                      <p className="text-center">25 KWh</p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-evenly gap-4">
                  <div className="flex flex-col justify-center items-center">
                    <p className='text-sm font-medium'>En punta</p>
                    <p className="text-center">25 KWh</p>
                  </div>
                  <div>
                    =
                  </div>
                  <div className="flex flex-col justify-center items-center">
                    <div className="flex flex-col justify-center items-center">
                      <p className='text-sm font-medium'>En punta</p>
                      <p className="text-center">25 KWh</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
          <div className="flex items-center px-6">
            <p className="text-2xl">VS</p>
          </div>
          <div className="flex-1">
            <MonthPicker/>
            <Card className="p-4 flex flex-col gap-2 shadow-md justify-between">
              <div className="flex flex-col gap-4">
                <div className="flex justify-evenly gap-4">
                  <div className="flex flex-col justify-center items-center">
                    <p className='text-sm font-medium'>En punta</p>
                    <p className="text-center">25 KWh</p>
                  </div>
                  <div>
                    =
                  </div>
                  <div className="flex flex-col justify-center items-center">
                    <div className="flex flex-col justify-center items-center">
                      <p className='text-sm font-medium'>En punta</p>
                      <p className="text-center">25 KWh</p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-evenly gap-4">
                  <div className="flex flex-col justify-center items-center">
                    <p className='text-sm font-medium'>En punta</p>
                    <p className="text-center">25 KWh</p>
                  </div>
                  <div>
                    =
                  </div>
                  <div className="flex flex-col justify-center items-center">
                    <div className="flex flex-col justify-center items-center">
                      <p className='text-sm font-medium'>En punta</p>
                      <p className="text-center">25 KWh</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div> */}
        {
          calculatorResult?.detail ? (
            ''
          ) : (
            <CostDifferenceChecker firstCalculatorResultMonthly={firstCalculatorResultMonthly} secondCalculatorResultMonthly={secondCalculatorResultMonthly} />
          )
        }
        {/* <div className="w-full shadow-md">
          <TariffTable tariffData={tariffData}/>
        </div> */}

      </div>
    </div>
  )
}
