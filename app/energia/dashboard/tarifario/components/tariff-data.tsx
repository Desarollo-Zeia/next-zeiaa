import { Suspense } from "react"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
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

export const maxDuration = 300

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

  const [
    calculatorResult,
    firstCalculatorResultMonthly,
    secondCalculatorResultMonthly,
    invoiceResult,
    tariffResult,
  ] = await Promise.all([
    consumptionCalculator({
      headquarterId,
      date_after: formattedDateAfter,
      date_before: formattedDateBefore,
      token: authToken!
    }),
    consumptionCalculatorMonthly({
      headquarterId,
      date_after: formattedDateAfter1,
      date_before: formattedDateBefore1,
      token: authToken!
    }),
    consumptionCalculatorMonthly({
      headquarterId,
      date_after: formattedDateAfter2,
      date_before: formattedDateBefore2,
      token: authToken!
    }),
    consumptionInvoice({
      headquarterId,
      token: authToken!
    }),
    consumptionTariff({
      headquarterId,
      token: authToken!
    })
  ])

  return (
    <>
      {calculatorResult?.detail ? (
        <NoResultsFound message="No hay datos de consumo" suggestion="Intente revisar otros módulos" />
      ) : (
        <div className="mb-6 max-w-2xl mx-auto">
          <p className="text-xs text-gray-500 mb-1 text-left">
            <span className="font-bold">Período</span>: {format(parseISO(formattedDateAfter), 'dd MMM yyyy', { locale: es })} - {format(parseISO(formattedDateBefore), 'dd MMM yyyy', { locale: es })}
          </p>
          <h3 className="font-bold text-center py-2 bg-[#E0F6F9] text-[#00b0c7] rounded-t-lg">
            CONSUMO TOTAL DE ENERGÍA
          </h3>
          <div className="flex shadow-lg rounded-b-lg bg-[#E0F6F9] bg-[#F3FCFD]">
            <div className="p-6 text-center flex-1 border-r border-white/30">
              <p className="text-xl font-bold text-[#4D5A63] text-nowrap">{formatNumberWithCommas(calculatorResult?.consumption?.total)} {calculatorResult?.consumption?.unit}</p>
              <p className="text-[10px] text-gray-600 mt-2 text-left">
                Punta: {formatNumberWithCommas(calculatorResult?.consumption?.peak)} {calculatorResult?.consumption?.unit}
              </p>
              <p className="text-[10px] text-gray-600 text-left text-nowrap">
                Fuera de Punta: {formatNumberWithCommas(calculatorResult?.consumption?.off_peak)} {calculatorResult?.consumption?.unit}
              </p>
            </div>
            <div className="flex items-center px-2">
              <span className="text-2xl font-bold text-[#4D5A63]">=</span>
            </div>
            <div className="p-6 text-center flex-1 border-l border-white/30">
              <p className="text-xl font-bold text-[#4D5A63]">{calculatorResult?.cost?.unit}{formatNumberWithCommas(calculatorResult?.cost?.total)}</p>
              <p className="text-[10px] text-gray-600 mt-2 text-left">
                Punta: {calculatorResult?.cost?.unit}{formatNumberWithCommas(calculatorResult?.cost?.peak)}
              </p>
              <p className="text-[10px] text-gray-600 text-left">
                Fuera de Punta: {calculatorResult?.cost?.unit}{formatNumberWithCommas(calculatorResult?.cost?.off_peak)}
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
