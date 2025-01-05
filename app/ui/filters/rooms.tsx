import { fetchWithAuth } from "@/app/lib/api";
import RoomSelect from "./room-select";

export default async function RoomSelectFilter() {

  const rooms = await fetchWithAuth('/enterprise/api/enterprise/basic/room-list/')

  return ( 
    <RoomSelect rooms={rooms}/>
  )

}
