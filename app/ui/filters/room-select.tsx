'use client'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useTransition, useEffect, useState, useMemo } from 'react'
import { useFiltersStore } from '@/app/lib/stores/filters-store';

interface Room {
  id: number
  name: string
  headquarter: {
    id: number
    name: string
  }
  is_activated: boolean
}

function useRoomParam() {
  const searchParams = useSearchParams()
  const roomParam = searchParams.get('room')
  return useMemo(() => roomParam, [roomParam])
}

export default function RoomSelect({ rooms, firstRoom }: { rooms: Room[], firstRoom: string }) {
  const [isPending, startTransition] = useTransition()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()
  const { roomId, setRoom } = useFiltersStore()

  const roomParam = useRoomParam()
  const [selectedRoom, setSelectedRoom] = useState<string>(roomParam ?? firstRoom)

  useEffect(() => {
    if (roomParam && roomParam !== selectedRoom) {
      setSelectedRoom(roomParam)
    }
  }, [roomParam, selectedRoom])

  const handleRoomChange = (newRoomId: string) => {
    if (newRoomId === selectedRoom) return;

    setSelectedRoom(newRoomId)

    setRoom(newRoomId)

    startTransition(() => {
      const newParams = new URLSearchParams(searchParams.toString())

      newParams.set('room', newRoomId)
      newParams.set('page', '1')

      replace(`${pathname}?${newParams.toString()}`, { scroll: false })
    });
  }

  return (
    <div className="relative">
      <Select
        onValueChange={handleRoomChange}
        value={roomParam ?? selectedRoom ?? firstRoom}
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
