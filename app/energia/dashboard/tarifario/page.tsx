// import { getCompanyData } from "@/app/lib/auth"
import { getHeadquarters } from "@/app/sevices/energy/enterprise/data"
import {
  consumptionCalculator, consumptionCalculatorMonthly,
  consumptionInvoice,
  consumptionTariff,
  // consumptionTariff
} from "@/app/sevices/energy/tarifario/data"
import { SearchParams } from "@/app/type"
import HeadquarterEnergyFilter from "@/app/ui/energia/filters/headquarter-energy-filter"
// import PanelsFilterEnergy from "@/app/ui/energia/filters/panels-energy-filter"
// import ConsumeCalculator from "@/app/ui/energia/tarifario/consume-calculator"
// import ConsumeCycle from "@/app/ui/energia/tarifario/consume-cycle"
import CostDifferenceChecker from "@/app/ui/energia/tarifario/cost-difference-checker"
import CycleClientInfoTable from "@/app/ui/energia/tarifario/cycle-clientinfo-table"
import TariffTable from "@/app/ui/energia/tarifario/tariff-table"
import { DatepickerRange } from "@/app/ui/filters/datepicker-range"
import FiltersContainer from "@/app/ui/filters/filters-container"
// import MonthFilter from "@/app/ui/filters/month-filter"
// import MonthPicker from "@/app/ui/filters/month-picker"
import NoResultsFound from "@/app/ui/no-result"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import NoResultFound from "@/app/ui/no-result-found"
// import { Card } from "@/components/ui/card"
import { format } from "date-fns";
// import { Suspense } from "react"
// import TariffTable from "@/app/ui/energia/tarifario/tariff-table"
// import { BadgeAlert } from "lucide-react"


export default async function Page({ searchParams }: SearchParams) {

  const monthMap: Record<number, string> = {
    1: "january",
    2: "february",
    3: "march",
    4: "april",
    5: "may",
    6: "june",
    7: "july",
    8: "august",
    9: "september",
    10: "october",
    11: "november",
    12: "december",
  }

  const currentMonth = new Date().getMonth() + 1

  const defaultMonth = monthMap[currentMonth]
  const startDefaultMonth = monthMap[currentMonth - 1]

  const { headquarter, panel = '1', date_after = new Date(), date_before = new Date(), firstmonth = startDefaultMonth, secondmonth = defaultMonth } = await searchParams

  const formattedDateAfter = format(date_after, 'yyyy-MM-dd')
  const formattedDateBefore = format(date_before, 'yyyy-MM-dd')

  const headquarters = await getHeadquarters()
  const { results } = headquarters
  const firstHeadquarter = headquarter || results?.[0]?.id?.toString() || ''

  if (!firstHeadquarter) {
    return <div>No hay sede disponible</div>
  }
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

  const firstConsumptionCalculatorMonthlyPromise = consumptionCalculatorMonthly({
    headquarterId: firstHeadquarter,
    filter_month: firstmonth || '',
  })

  const secondConsumptionCalculatorMonthlyPromise = consumptionCalculatorMonthly({
    headquarterId: firstHeadquarter,
    filter_month: secondmonth || '',
  })

  const consumptionTariffPromise = consumptionTariff({
    panelId: panel,
    headquarterId: firstHeadquarter,
  })

  const [
    calculatorResult,
    firstCalculatorResultMonthly,
    secondCalculatorResultMonthly,
    invoiceResult,
    tariffResult,
  ] = await Promise.all([
    consumptionCalculatorPromise,
    firstConsumptionCalculatorMonthlyPromise,
    secondConsumptionCalculatorMonthlyPromise,
    consumptionInvoicePromise,
    consumptionTariffPromise
  ])


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
              <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 bg-green-500 rounded-full animate-pulse`} />
                    <h3 className="font-semibold text-green-800">Consumo del día transcurrido</h3>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Energía punta</p>
                    <p className="text-lg font-bold">{calculatorResult?.consumption?.peak.toFixed(2)} kWh</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Energía fuera punta</p>
                    <p className="text-lg font-bold">{calculatorResult?.consumption?.off_peak.toFixed(2)} kWh</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Costo punta</p>
                    <p className="text-lg font-bold">S/ {calculatorResult?.cost?.peak.toFixed(2)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Costo fuera punta</p>
                    <p className="text-lg font-bold">S/ {calculatorResult?.cost?.off_peak.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            )
        }
        {calculatorResult?.detail ? '' : <div> <h2 className="text-lg font-semibold">Comparador de Facturación</h2> </div>}
        {
          calculatorResult?.detail ? (
            ''
          ) : (
            <CostDifferenceChecker firstCalculatorResultMonthly={firstCalculatorResultMonthly} secondCalculatorResultMonthly={secondCalculatorResultMonthly} />
          )
        }
        <div className="w-full shadow-md">
          <CycleClientInfoTable tariffData={invoiceResult} />
          <TariffTable tariffData={tariffResult} />
        </div>

      </div>
    </div>
  )
}
