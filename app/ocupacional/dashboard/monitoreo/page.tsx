import { detail } from "@/app/sevices/enterprise/data"
import { readingsData, roomGeneralData, roomLastData } from "@/app/sevices/readings/data"
import FiltersContainer from "@/app/ui/filters/filters-container"
import RoomSelectFilter from "@/app/ui/filters/rooms"
import ChartComponent from "@/app/ui/monitoreo/chart"
import TableComponent from "@/app/ui/monitoreo/table"

export default async function page({ searchParams }) {

  const { room, indicator = 'CO2', unit = 'PPM' } = await searchParams

  const { first_room: firstRoom} = await detail()

  const currentFirstRoom = room ? room : firstRoom

  const data = await roomLastData({ roomId: currentFirstRoom})
  const { results } = await readingsData({ roomId: currentFirstRoom, indicator, unit })

  const sortResults = results.sort((a, b) => {

    const [aHours] = a.hours.split(' ')
    const [bHours] = b.hours.split(' ')

    const timeA = new Date(`1970-01-01T${aHours}`)
    const timeB = new Date(`1970-01-01T${bHours}`)

    return timeA - timeB;
  })

  const generalRoomData = await roomGeneralData({ roomId: currentFirstRoom})

  return (
    <div>
      <FiltersContainer>
        <RoomSelectFilter firstRoom={firstRoom}/>
      </FiltersContainer>
      <TableComponent data={data}/>
      <br />
      <ChartComponent results={sortResults} generalRoomData={generalRoomData} indicator={indicator} unit={unit}/>
    </div>
  )
}
