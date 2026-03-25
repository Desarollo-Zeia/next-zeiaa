import { Suspense } from "react"
import {
  consumptionCalculator, consumptionCalculatorMonthly,
  consumptionInvoice,
  consumptionTariff,
} from "@/app/services/energy/tarifario/data"
import CostDifferenceChecker from "@/app/ui/energia/tarifario/cost-difference-checker"
import CycleClientInfoTable from "@/app/ui/energia/tarifario/cycle-clientinfo-table"
import TariffTable from "@/app/ui/energia/tarifario/tariff-table"
import NoResultsFound from "@/app/ui/no-result"
import { getToken } from "@/app/lib/auth"
import { formatNumberWithCommas } from "@/app/utils/func"

interface TariffDataProps {
  headquarterId: string
  panel: string
  formattedDateAfter: string
  formattedDateBefore: string
  firstmonth: string
  secondmonth: string
  formattedDateAfter1: string
  formattedDateBefore1: string
  formattedDateAfter2: string
  formattedDateBefore2: string
}

async function TariffDataContent({
  headquarterId,
  panel,
  formattedDateAfter,
  formattedDateBefore,
  firstmonth,
  secondmonth,
  formattedDateAfter1,
  formattedDateBefore1,
  formattedDateAfter2,
  formattedDateBefore2
}: TariffDataProps) {

  const authToken = await getToken()
  const startTotal = Date.now()

  const [
    calculatorResult,
    firstCalculatorResultMonthly,
    secondCalculatorResultMonthly,
    invoiceResult,
    tariffResult,
  ] = await Promise.all([
    (async () => {
      const start = Date.now()
      const result = await consumptionCalculator({
        headquarterId,
        token: authToken!
      })
      console.log(`[TIMING] consumptionCalculator: ${Date.now() - start}ms`)
      return result
    })(),
    (async () => {
      const start = Date.now()
      const result = await consumptionCalculatorMonthly({
        headquarterId,
        date_after: formattedDateAfter1,
        date_before: formattedDateBefore1,
        token: authToken!
      })
      console.log(`[TIMING] consumptionCalculatorMonthly (1): ${Date.now() - start}ms`)
      return result
    })(),
    (async () => {
      const start = Date.now()
      const result = await consumptionCalculatorMonthly({
        headquarterId,
        date_after: formattedDateAfter2,
        date_before: formattedDateBefore2,
        token: authToken!
      })
      console.log(`[TIMING] consumptionCalculatorMonthly (2): ${Date.now() - start}ms`)
      return result
    })(),
    (async () => {
      const start = Date.now()
      const result = await consumptionInvoice({
        headquarterId,
        token: authToken!
      })
      console.log(`[TIMING] consumptionInvoice: ${Date.now() - start}ms`)
      return result
    })(),
    (async () => {
      const start = Date.now()
      const result = await consumptionTariff({
        headquarterId,
        token: authToken!
      })
      console.log(`[TIMING] consumptionTariff: ${Date.now() - start}ms`)
      return result
    })()
  ])

  console.log(`[TIMING] TOTAL TariffData requests: ${Date.now() - startTotal}ms`)

  return (
    <>
      {calculatorResult?.detail ? (
        <NoResultsFound message="No hay datos de consumo" suggestion="Intente revisar otros módulos" />
      ) : (
        <div className="mb-6 max-w-2xl mx-auto">
          <h3 className="font-semibold text-white text-center py-2 bg-[#00b0c7] rounded-t-lg">
            Consumo total de energía
          </h3>
          <div className="grid grid-cols-2 shadow-lg rounded-b-lg">
            <div className="p-6 bg-cyan-100 text-center">
              <p className="text-xs text-gray-600 mb-1">Consumo total</p>
              <p className="text-xl font-bold text-gray-900">{formatNumberWithCommas(calculatorResult?.consumption?.total)} kWh</p>
              <p className="text-[10px] text-gray-600 mt-2">
                Punta: {formatNumberWithCommas(calculatorResult?.consumption?.peak)} kWh
              </p>
              <p className="text-[10px] text-gray-600">
                Fuera de Punta: {formatNumberWithCommas(calculatorResult?.consumption?.off_peak)} kWh
              </p>
            </div>
            <div className="p-6 bg-cyan-100 text-center">
              <p className="text-xs text-gray-600 mb-1">Costo total</p>
              <p className="text-xl font-bold text-gray-900">S/ {formatNumberWithCommas(calculatorResult?.cost?.total)}</p>
              <p className="text-[10px] text-gray-600 mt-2">
                Punta: S/ {formatNumberWithCommas(calculatorResult?.cost?.peak)}
              </p>
              <p className="text-[10px] text-gray-600">
                Fuera de Punta: S/ {formatNumberWithCommas(calculatorResult?.cost?.off_peak)}
              </p>
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
            formattedDateAfter1={formattedDateAfter1}
            formattedDateBefore1={formattedDateBefore1}
            formattedDateAfter2={formattedDateAfter2}
            formattedDateBefore2={formattedDateBefore2}
          />
        </>
      )}
      <div className="py-2">
        <h2 className="text-lg font-semibold">Facturación Actual</h2>
      </div>

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
      <div className="mb-6 max-w-2xl mx-auto">
        <div className="h-8 bg-gray-200 animate-pulse rounded-t-lg" />
        <div className="grid grid-cols-2 shadow-lg rounded-b-lg">
          <div className="p-6 bg-white text-center">
            <div className="h-4 w-20 bg-gray-200 animate-pulse rounded mx-auto mb-2" />
            <div className="h-7 w-32 bg-gray-200 animate-pulse rounded mx-auto mb-3" />
            <div className="h-3 w-24 bg-gray-200 animate-pulse rounded mx-auto mb-1" />
            <div className="h-3 w-28 bg-gray-200 animate-pulse rounded mx-auto" />
          </div>
          <div className="p-6 bg-cyan-100 text-center">
            <div className="h-4 w-20 bg-gray-200 animate-pulse rounded mx-auto mb-2" />
            <div className="h-7 w-32 bg-gray-200 animate-pulse rounded mx-auto mb-3" />
            <div className="h-3 w-24 bg-gray-200 animate-pulse rounded mx-auto mb-1" />
            <div className="h-3 w-28 bg-gray-200 animate-pulse rounded mx-auto" />
          </div>
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