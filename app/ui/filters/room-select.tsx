'use client'
import { useRoom } from "@/app/utils/func";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useEffect, useTransition } from 'react'

interface Room {
  id: number
  name: string
  headquarter: {
    id: number
    name: string
  }
  is_activated: boolean
}

export default function RoomSelect({ rooms, firstRoom }: { rooms: Room[], firstRoom: string }) {
  const [isPending, startTransition] = useTransition()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  const { changeRoom, roomId } = useRoom()


  useEffect(() => {
    const newParams = new URLSearchParams(searchParams);
    if (!roomId) return changeRoom(firstRoom)
    startTransition(() => {

      newParams.set('indicator', 'CO2')
      newParams.set('unit', 'PPM')
      newParams.set('page', '1')

      newParams.set('room', roomId)

      replace(`${pathname}?${newParams.toString()}`, { scroll: false })
    });

  }, [roomId])

  return (
    <div className="relative">
      <Select
        onValueChange={changeRoom}
        value={roomId.toString()}
        disabled={isPending}
      >
        <SelectTrigger className="w-[240px] bg-[#00b0c7]">
          <SelectValue
            placeholder={isPending ? "Cargando..." : "Selecciona una sala"}
            className="text-white font-bold"
          />
        </SelectTrigger>
        <SelectContent>
          {rooms?.map((room: Room) => (
            <SelectItem
              key={room.id}
              value={String(room.id)}
              className={room.is_activated ? 'text-black' : 'text-gray-300'}
            >
              {room.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {isPending && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
        </div>
      )}
    </div>
  );
}