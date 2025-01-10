import { detail } from "@/app/sevices/enterprise/data"
import { readingsData, roomGeneralData, roomLastData } from "@/app/sevices/readings/data"
import FiltersContainer from "@/app/ui/filters/filters-container"
import RoomSelectFilter from "@/app/ui/filters/rooms"
import ChartComponent from "@/app/ui/monitoreo/chart"
import TableComponent from "@/app/ui/monitoreo/table"

export default async function page({ searchParams }) {

  const { room, indicator, unit } = await searchParams

  const { first_room: firstRoom} = await detail()

  const currentFirstRoom = room ? room : firstRoom

  const data = await roomLastData({ roomId: currentFirstRoom})
  const { results } = await readingsData({ roomId: currentFirstRoom, indicator, unit })
  const generalRoomData = await roomGeneralData({ roomId: currentFirstRoom})

  return (
    <div>
      <FiltersContainer>
        <RoomSelectFilter/>
      </FiltersContainer>
      <TableComponent data={data}/>
      <br />
      <ChartComponent results={results} generalRoomData={generalRoomData}/>
    </div>
  )
}
