'use client'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

export default function RoomSelectToggle({ rooms }: { rooms: Array<{ id: number, name: string }> }) {

  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  const addedToParams = (roomId: string) => {

    const newParams = new URLSearchParams(searchParams);
    const arrRoomIds = newParams.getAll('roomId')

    if (arrRoomIds.includes(roomId)) {
      newParams.delete('roomId')

      arrRoomIds
        .filter(id => id !== roomId)
        .forEach(id => newParams.append('roomId', id))

    } else {
      newParams.append('roomId', roomId)
    }

    replace(`${pathname}?${newParams.toString()}`, { scroll: false })
  }

  return (
    <div className='relative'>
      {
        rooms.map(room => (
          <div key={room.id} className='flex' onClick={() => addedToParams(room.id.toString())}>
            <p className={`h-4 w-4 rounded-full `}>

            </p>
            <span>{room.name}</span>
          </div>
        ))
      }
    </div>
  )
}
