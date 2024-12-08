import { fetchWithAuth } from "@/app/lib/api"
import RoomStatusCard from "@/app/ui/rooms/room-status-card"

export default async function Page() {

  const rooms = await fetchWithAuth('enterprise/api/enterprise/basic/room-list/')

  return (
    <div className="p-4">
      <RoomStatusCard/>
    </div>
  )
}

