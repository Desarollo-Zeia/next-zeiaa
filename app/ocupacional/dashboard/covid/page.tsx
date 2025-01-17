import { detail } from "@/app/sevices/enterprise/data";
import { readingsCovid, readingsCovidBaselines } from "@/app/sevices/readings/data";
import TableComponent from "@/app/ui/covid/table";
import { DatepickerRange } from "@/app/ui/filters/datepicker-range";
import FiltersContainer from "@/app/ui/filters/filters-container";
import RoomSelectFilter from "@/app/ui/filters/rooms";
import { format } from "date-fns";

export default async function page({ searchParams }) {

   const { first_room: firstRoom} = await detail()
  
    const { room, indicator = 'CO2', unit = 'PPM', date_after = new Date(), date_before = new Date(), page = '1' } = await searchParams
  
    const currentFirstRoom = room ? room : firstRoom

    const readings = await readingsCovid({ roomId: currentFirstRoom, indicator, unit, date_after: format(date_after,"yyyy-MM-dd"), date_before: format(date_before, "yyyy-MM-dd"), page })

    const covidBaselines = await readingsCovidBaselines({date_after: format(date_after,"yyyy-MM-dd"), date_before: format(date_before, "yyyy-MM-dd"), roomId: currentFirstRoom  })

  return (
    <div>
      <FiltersContainer>
        <RoomSelectFilter firstRoom={currentFirstRoom}/>
        <DatepickerRange/>
      </FiltersContainer>
     <TableComponent data={readings.results} count={readings.count} baselines={covidBaselines}/>
    </div>
  )
}
