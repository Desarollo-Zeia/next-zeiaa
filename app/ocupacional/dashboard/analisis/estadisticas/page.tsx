import { detail } from "@/app/sevices/enterprise/data";
import { readingsGraph, roomGeneralData } from "@/app/sevices/readings/data";
import { ChartComponent } from "@/app/ui/analisis/estadisticas/chart";
import { DatepickerRange } from "@/app/ui/filters/datepicker-range";
import FiltersContainer from "@/app/ui/filters/filters-container";
import RoomSelectFilter from "@/app/ui/filters/rooms";
import { format } from "date-fns";

export default async function page({ searchParams }) {
  const { first_room: firstRoom} = await detail()

  const { room, indicator = 'CO2', unit = 'PPM', date_after = new Date(), date_before = new Date()} = await searchParams

  const currentFirstRoom = room ? room : firstRoom

  const readings = await readingsGraph({ roomId: currentFirstRoom, indicator, unit, date_after: format(date_after,"yyyy-MM-dd"), date_before: format(date_before, "yyyy-MM-dd")})
  const generalRoomData = await roomGeneralData({ roomId: currentFirstRoom})

  return (
    <div>
      <FiltersContainer>
        <RoomSelectFilter firstRoom={currentFirstRoom}/>
        <DatepickerRange />
      </FiltersContainer>
      <ChartComponent readings={readings} indicator={indicator} unit={unit} generalRoomData={generalRoomData}/>
    </div>
  )
}
