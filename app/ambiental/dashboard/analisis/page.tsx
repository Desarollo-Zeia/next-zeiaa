import { getToken } from "@/app/lib/auth";
import { detailAmbiental } from "@/app/sevices/enterprise/data";
import { getRoomsAmbiental } from "@/app/sevices/filters/data";
import { readingsDataAmbiental, roomGeneralDataAmbiental } from "@/app/sevices/readings/data";
import { Indicator, SearchParams, Unit } from "@/app/type";
import TableComponent from "@/app/ui/analisis/table";
import { DatepickerRange } from "@/app/ui/filters/datepicker-range";
import FiltersContainer from "@/app/ui/filters/filters-container";
import RoomSelect from "@/app/ui/filters/room-select";
import StatusSelect from "@/app/ui/filters/status-select";
import { format } from "date-fns";

export default async function page({ searchParams }: SearchParams) {
  const authToken = await getToken()


  const { first_room: firstRoom } = await detailAmbiental()

  const { room, indicator = 'CO2', unit = 'PPM', date_after = '', date_before = '', page, status } = await searchParams

  const currentFirstRoom = room ? room : firstRoom

  const rooms = await getRoomsAmbiental({ token: authToken! })
  const generalRoomData = await roomGeneralDataAmbiental({ roomId: currentFirstRoom, token: authToken! })
  const readings = await readingsDataAmbiental({ roomId: currentFirstRoom, indicator, unit, date_after: format(date_after, "yyyy-MM-dd"), date_before: format(date_before, "yyyy-MM-dd"), page, status, token: authToken! })


  return (
    <div>
      <FiltersContainer>
        <RoomSelect firstRoom={firstRoom} rooms={rooms} />
        <StatusSelect />
        <DatepickerRange />
      </FiltersContainer>
      <TableComponent generalRoomData={generalRoomData} readings={readings} count={readings.count} indicator={indicator as Indicator} unit={unit as Unit} date_after={format(date_after, "yyyy-MM-dd")} date_before={format(date_before, "yyyy-MM-dd")} room={currentFirstRoom} />

    </div>
  )
}
