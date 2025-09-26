import { detailAmbiental } from "@/app/sevices/enterprise/data"
import { getRoomsAmbiental } from "@/app/sevices/filters/data"
import { readingsDataAmbiental, roomGeneralDataAmbiental, roomLastDataAmbiental } from "@/app/sevices/readings/data"
import { Indicator, SearchParams, Unit } from "@/app/type"
import FiltersContainer from "@/app/ui/filters/filters-container"
import RoomSelect from "@/app/ui/filters/room-select"
import ChartComponent from "@/app/ui/monitoreo/chart"
import TableComponent from "@/app/ui/monitoreo/table"

type Result = {
  indicator: string,
  value: string,
  unit: string,
  status: string,
  hours: string,
  date: string
}

interface Room {
  id: number
  name: string
  status: string
  is_activated: boolean,
  devices: { dev_eui: string, id: number, type_sensor: string }[],
  headquarter: { id: number, name: string }
}

export default async function page({ searchParams }: SearchParams) {

  const { room, indicator = 'CO2', unit = 'PPM' } = await searchParams

  const { first_room: firstRoom } = await detailAmbiental()

  const currentFirstRoom = room ? room : firstRoom

  const rooms = await getRoomsAmbiental()
  const data = await roomLastDataAmbiental({ roomId: currentFirstRoom })
  const { results } = await readingsDataAmbiental({ roomId: currentFirstRoom, indicator, unit })

  const { name } = rooms.find((room: Room) => room.id === Number(currentFirstRoom))


  const sortResults = (results: Result[]): Result[] => {
    return results.sort((a, b) => {

      const [aHours] = a.hours ? a.hours.split(' ') : ['00:00'];
      const [bHours] = b.hours ? b.hours.split(' ') : ['00:00'];

      const timeA = new Date(`1970-01-01T${aHours}`);
      const timeB = new Date(`1970-01-01T${bHours}`);

      return timeA.getTime() - timeB.getTime();
    });
  };

  const generalRoomData = await roomGeneralDataAmbiental({ roomId: currentFirstRoom })

  const devUI = generalRoomData?.devices[0]?.dev_eui

  return (
    <div>
      <FiltersContainer>
        <RoomSelect firstRoom={firstRoom} rooms={rooms} />
      </FiltersContainer>
      <TableComponent data={data} name={name} devUI={devUI} room={currentFirstRoom} status={'GOOD'} />
      <br />
      <ChartComponent results={sortResults(results)} generalRoomData={generalRoomData} indicator={indicator as Indicator} unit={unit as Unit} />
    </div>
  )
}
