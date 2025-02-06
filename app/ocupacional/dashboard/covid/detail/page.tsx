import { readingsCovidBaselines, readingsCovidDetail } from "@/app/sevices/readings/data"
import { SearchParams } from "@/app/type"
import TableComponent from "@/app/ui/covid/detail/table"
import FiltersContainer from "@/app/ui/filters/filters-container"
import RiskFilter from "@/app/ui/filters/risk-filter"
import { TimeRangeSlider } from "@/app/ui/filters/time-range-slider"
import { format } from "date-fns"

export default async function page({ searchParams } : SearchParams) {


  const { date = '', page = '1', room, start, end, risk = '' } = await searchParams

  const readings = await readingsCovidDetail({ date, page, roomId: room,  hour_before: end, hour_after: start, risk })
  const covidBaselines = await readingsCovidBaselines({date_after: format(date ,"yyyy-MM-dd"), date_before: format(date, "yyyy-MM-dd"), roomId: room})

  return (
    <div>
      <FiltersContainer>
        <RiskFilter/>
        <TimeRangeSlider/>
      </FiltersContainer>
      <TableComponent data={readings.results} count={readings.count} baselines={covidBaselines}/>
    </div>
  )
}
