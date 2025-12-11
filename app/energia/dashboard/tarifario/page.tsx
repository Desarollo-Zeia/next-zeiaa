// import { getCompanyData } from "@/app/lib/auth"
import { getHeadquarters } from "@/app/sevices/energy/enterprise/data"
import TariffData from "./components/tariff-data"
import { SearchParams } from "@/app/type"
import HeadquarterEnergyFilter from "@/app/ui/energia/filters/headquarter-energy-filter"
// import PanelsFilterEnergy from "@/app/ui/energia/filters/panels-energy-filter"
// import ConsumeCalculator from "@/app/ui/energia/tarifario/consume-calculator"
// import ConsumeCycle from "@/app/ui/energia/tarifario/consume-cycle"
import { DatepickerRange } from "@/app/ui/filters/datepicker-range"
import FiltersContainer from "@/app/ui/filters/filters-container"
// import MonthFilter from "@/app/ui/filters/month-filter"
// import MonthPicker from "@/app/ui/filters/month-picker"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import NoResultFound from "@/app/ui/no-result-found"
// import { Card } from "@/components/ui/card"
import { format } from "date-fns";
// import { cacheLife } from "next/cache"
import { getToken } from "@/app/lib/auth"
import { Suspense } from "react"
// import TariffTable from "@/app/ui/energia/tarifario/tariff-table"
// import { BadgeAlert } from "lucide-react"

// async function GetHeadquarters(token: string) {
//   'use cache'
//   cacheLife('minutes')
//   return await getHeadquarters(token)
// }

export default async function Tarifario({ searchParams }: SearchParams) {

  const authToken = await getToken()


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

  const today = new Date()
  const thirtyDaysAgo = new Date(today)
  thirtyDaysAgo.setDate(today.getDate() - 30)

  const { headquarter, panel = '1', date_after = thirtyDaysAgo, date_before = today, firstmonth = startDefaultMonth, secondmonth = defaultMonth } = await searchParams

  const formattedDateAfter = format(date_after, 'yyyy-MM-dd')
  const formattedDateBefore = format(date_before, 'yyyy-MM-dd')

  const headquarters = await getHeadquarters(authToken!)
  const { results } = headquarters
  const firstHeadquarter = headquarter || results[0].id.toString()


  return (
    <div className="w-full">
      <FiltersContainer>
        <HeadquarterEnergyFilter energyHeadquarter={headquarters.results} energy={firstHeadquarter} />
        <DatepickerRange />
      </FiltersContainer>
      <div className="w-full flex flex-col gap-4 px-6">
        <TariffData
          headquarterId={firstHeadquarter}
          panel={panel}
          formattedDateAfter={formattedDateAfter}
          formattedDateBefore={formattedDateBefore}
          firstmonth={firstmonth || ''}
          secondmonth={secondmonth || ''}
        />
      </div>
    </div>
  )
}

export async function page({ searchParams }: SearchParams) {
  return (
    <div>
      <Suspense fallback={<div>Cargando...</div>}>
        <Tarifario searchParams={searchParams} />
      </Suspense>
    </div>
  )
}
