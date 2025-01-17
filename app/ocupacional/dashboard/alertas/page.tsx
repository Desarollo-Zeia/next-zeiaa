import { alerts } from "@/app/sevices/alerts/data";
import { detail } from "@/app/sevices/enterprise/data";
import { roomGeneralData } from "@/app/sevices/readings/data";
import TableComponent from "@/app/ui/alertas/table";
import { DatepickerRange } from "@/app/ui/filters/datepicker-range";
import FiltersContainer from "@/app/ui/filters/filters-container";
import RoomSelectFilter from "@/app/ui/filters/rooms";
import { format } from "date-fns";

export default async function page({ searchParams }) {

    const { first_room: firstRoom} = await detail()
  
    const { room, indicator = 'CO2', unit = 'PPM', date_after = new Date(), date_before = new Date(), page = '1' } = await searchParams
  
    const currentFirstRoom = room ? room : firstRoom

    const readings = await alerts({ roomId: currentFirstRoom, indicator, unit, date_after: format(date_after,"yyyy-MM-dd"), date_before: format(date_before, "yyyy-MM-dd"), page})
    const generalRoomData = await roomGeneralData({ roomId: currentFirstRoom})

  return (
    <div>
        <FiltersContainer>
          <RoomSelectFilter firstRoom={currentFirstRoom}/>
          <DatepickerRange/>
        </FiltersContainer>
        <TableComponent data={readings.results} count={readings.count} generalRoomData={generalRoomData} indicator={indicator} />

    </div>
  )
}
