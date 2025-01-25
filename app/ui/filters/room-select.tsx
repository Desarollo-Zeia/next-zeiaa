'use client'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

interface Room {
  id:number
  name:string
  headquarter: {
    id: number
    name: string
  }
  is_activated: boolean
}

export default function RoomSelect({ rooms, firstRoom } : { rooms: Room[], firstRoom: string }) {

  const searchParams = useSearchParams()
  const currentRoom = searchParams.get('room') as string
  const params = new URLSearchParams(searchParams);
  const pathname = usePathname()
  const { replace } = useRouter()

  const handleRoomChange = (room: string) => {

    params.set('indicator', 'CO2')
    params.set('unit', 'PPM')
    params.set('page', '1')
  
    if (room) {
      params.set('room', room);
    } 

    if (room === 'none') {
      params.delete('room');
    }

    replace(`${pathname}?${params.toString()}`, { scroll: false });
  }
  
  return (
    <Select onValueChange={handleRoomChange} value={currentRoom ? currentRoom : firstRoom.toString()}>
      <SelectTrigger className="w-[240px] bg-[#00b0c7]">
        <SelectValue placeholder="Selecciona un sala" className="text-white font-bold"/>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value='none'>Sin sala</SelectItem>
        {
          rooms?.map((room : Room) => (
            <SelectItem key={room.id} value={String(room.id)} className={room.is_activated ? 'text-black' : 'text-gray-300'}>{room.name}</SelectItem>
          ))
        }
      </SelectContent>
    </Select>
  )
}
