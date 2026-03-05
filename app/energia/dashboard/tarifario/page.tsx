import { getHeadquarters, getEnergyMeasurementPointPanels } from "@/app/services/energy/enterprise/data"
import TariffData from "./components/tariff-data"
import { SearchParams } from "@/app/type"
import HeadquarterEnergyFilter from "@/app/ui/energia/filters/headquarter-energy-filter"
import FiltersContainer from "@/app/ui/filters/filters-container"
import { format, subMonths } from "date-fns"
import { getToken } from "@/app/lib/auth"


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

  const today = new Date()
  const previousMonthDate = subMonths(today, 1)
  const currentMonth = today.getMonth() + 1
  const previousMonth = previousMonthDate.getMonth() + 1
  const defaultMonth = monthMap[currentMonth]
  const startDefaultMonth = monthMap[previousMonth]

  const thirtyDaysAgo = new Date(today)
  thirtyDaysAgo.setDate(today.getDate() - 30)

  const { headquarter, panel, date_after = thirtyDaysAgo, date_before = today, firstmonth = startDefaultMonth, secondmonth = defaultMonth } = await searchParams

  const formattedDateAfter = format(date_after, 'yyyy-MM-dd')
  const formattedDateBefore = format(date_before, 'yyyy-MM-dd')

  const headquartersPromise = getHeadquarters(authToken!)
  const panelsPromise = headquarter
    ? getEnergyMeasurementPointPanels({ headquarterId: String(headquarter), token: authToken! })
    : null

  const headquarters = await headquartersPromise
  const { results } = headquarters
  const firstHeadquarter = headquarter || results[0].id.toString()

  const measurementPointsPanels = panelsPromise ?? await getEnergyMeasurementPointPanels({
    headquarterId: firstHeadquarter,
    token: authToken!
  })

  const firstPanel = panel || measurementPointsPanels?.results[0]?.id.toString()


  return (
    <div className="w-full">
      <FiltersContainer>
        <HeadquarterEnergyFilter energyHeadquarter={headquarters.results} energy={firstHeadquarter} />
      </FiltersContainer>
      <div className="w-full flex flex-col gap-4 px-6">
        <TariffData
          headquarterId={firstHeadquarter}
          panel={firstPanel}
          formattedDateAfter={formattedDateAfter}
          formattedDateBefore={formattedDateBefore}
          firstmonth={firstmonth || ''}
          secondmonth={secondmonth || ''}
        />
      </div>
    </div>
  )
}
