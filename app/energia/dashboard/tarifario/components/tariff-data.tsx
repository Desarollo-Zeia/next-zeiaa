import { Suspense } from "react"
import {
  consumptionCalculator, consumptionCalculatorMonthly,
  consumptionInvoice,
  consumptionTariff,
} from "@/app/sevices/energy/tarifario/data"
import CostDifferenceChecker from "@/app/ui/energia/tarifario/cost-difference-checker"
import CycleClientInfoTable from "@/app/ui/energia/tarifario/cycle-clientinfo-table"
import TariffTable from "@/app/ui/energia/tarifario/tariff-table"
import NoResultsFound from "@/app/ui/no-result"

interface TariffDataProps {
  headquarterId: string
  panel: string
  formattedDateAfter: string
  formattedDateBefore: string
  firstmonth: string
  secondmonth: string
}

async function TariffDataContent({ 
  headquarterId, 
  panel, 
  formattedDateAfter, 
  formattedDateBefore, 
  firstmonth, 
  secondmonth 
}: TariffDataProps) {
  const [
    calculatorResult,
    firstCalculatorResultMonthly,
    secondCalculatorResultMonthly,
    invoiceResult,
    tariffResult,
  ] = await Promise.all([
    consumptionCalculator({
      panelId: panel,
      headquarterId,
      date_after: formattedDateAfter,
      date_before: formattedDateBefore,
    }),
    consumptionCalculatorMonthly({
      headquarterId,
      filter_month: firstmonth || '',
    }),
    consumptionCalculatorMonthly({
      headquarterId,
      filter_month: secondmonth || '',
    }),
    consumptionInvoice({
      panelId: panel,
      headquarterId,
    }),
    consumptionTariff({
      panelId: panel,
      headquarterId,
    })
  ])

  return (
    <>
      {calculatorResult?.detail ? (
        <NoResultsFound message="No hay datos de consumo" suggestion="Intente revisar otros módulos" />
      ) : (
        <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
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
      )}
      
      {!calculatorResult?.detail && (
        <>
          <div>
            <h2 className="text-lg font-semibold">Comparador de Facturación</h2>
          </div>
          <CostDifferenceChecker 
            firstCalculatorResultMonthly={firstCalculatorResultMonthly} 
            secondCalculatorResultMonthly={secondCalculatorResultMonthly} 
          />
        </>
      )}
      
      <div className="w-full shadow-md">
        <CycleClientInfoTable tariffData={invoiceResult} />
        <TariffTable tariffData={tariffResult} />
      </div>
    </>
  )
}

function TariffDataSkeleton() {
  return (
    <div className="w-full flex flex-col gap-4">
      <div className="mb-6 p-4 bg-gray-100 rounded-lg border">
        <div className="h-6 w-48 bg-gray-200 animate-pulse rounded mb-3" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="text-center">
              <div className="h-4 w-24 bg-gray-200 animate-pulse rounded mb-2 mx-auto" />
              <div className="h-6 w-16 bg-gray-200 animate-pulse rounded mx-auto" />
            </div>
          ))}
        </div>
      </div>
      <div className="h-8 w-56 bg-gray-200 animate-pulse rounded mb-4" />
      <div className="h-32 w-full bg-gray-200 animate-pulse rounded mb-4" />
      <div className="w-full shadow-md">
        <div className="h-40 w-full bg-gray-200 animate-pulse rounded-t" />
        <div className="h-60 w-full bg-gray-200 animate-pulse rounded-b" />
      </div>
    </div>
  )
}

export default function TariffData(props: TariffDataProps) {
  return (
    <Suspense fallback={<TariffDataSkeleton />}>
      <TariffDataContent {...props} />
    </Suspense>
  )
}