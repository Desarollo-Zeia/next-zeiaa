import { detail } from "@/app/sevices/enterprise/data";
import { readingsGraph } from "@/app/sevices/readings/data";
import { ChartComponent } from "@/app/ui/analisis/estadisticas/chart";
import { DatepickerRange } from "@/app/ui/filters/datepicker-range";
import FiltersContainer from "@/app/ui/filters/filters-container";
import RoomSelectFilter from "@/app/ui/filters/rooms";
import { format } from "date-fns";

export default async function page({ searchParams }) {
  const { first_room: firstRoom} = await detail()

  const { room, indicator = 'CO2', unit = 'PPM', date_after = format(new Date(), "yyyy-MM-dd"), date_before = format(new Date(), "yyyy-MM-dd")} = await searchParams

  const currentFirstRoom = room ? room : firstRoom

  const readings = await readingsGraph({ roomId: currentFirstRoom, indicator, unit, date_after, date_before})

  return (
    <div>
      <FiltersContainer>
        <RoomSelectFilter firstRoom={currentFirstRoom}/>
        <DatepickerRange/>
      </FiltersContainer>
      <ChartComponent readings={readings}/>
    </div>
  )
}
