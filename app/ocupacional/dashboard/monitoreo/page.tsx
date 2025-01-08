import { detail } from "@/app/sevices/enterprise/detail"
import { roomLastData } from "@/app/sevices/readings/last"
import FiltersContainer from "@/app/ui/filters/filters-container"
import IndicatorToggle from "@/app/ui/filters/indicators-toggle"
import RoomSelectFilter from "@/app/ui/filters/rooms"
import ChartComponent from "@/app/ui/monitoreo/chart"
import TableComponent from "@/app/ui/monitoreo/table"

export default async function page({ searchParams }) {

  const { room } = await searchParams

  const { first_room: firstRoom} = await detail()

  const currentFirstRoom = room ? room : firstRoom

  const data = await roomLastData({ roomId: currentFirstRoom})

  return (
    <div>
      <FiltersContainer>
        <RoomSelectFilter/>
        {/* <IndicatorToggle/> */}
      </FiltersContainer>
      <TableComponent data={data}/>
      <br />
      <ChartComponent/>
    </div>
  )
}
