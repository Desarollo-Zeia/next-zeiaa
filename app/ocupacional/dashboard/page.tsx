import RoomStatusCard from '@/app/ui/rooms/room-status-card'
import React from 'react'
import styles from '/app/ui/home.module.css'
import RoomSearchFilter from '@/app/ui/filters/search'
import FiltersContainer from '@/app/ui/filters/filters-container'
import { roomsList } from '@/app/sevices/enterprise/room-list'
import HeadquarterSelectFilter from '@/app/ui/filters/headquearter'

interface Room {
  id: number
  name: string
  status: string
  is_activated: boolean
}

interface PageProps { 
  searchParams: {
    search?: string,
    status?: string,
    headquarter?: string,
    page?: string,
    limit?: string
  }
}

export default async function page({ searchParams } : PageProps ) {

  const { search, status, headquarter, page, limit } = await searchParams

  const rooms = await roomsList({ search, status, headquarter, page, limit })

  return (
    <div>
      <FiltersContainer>
        <RoomSearchFilter/>
        <HeadquarterSelectFilter/>
      </FiltersContainer>
      <section className={styles.roomCardsContainer}>
        {
          rooms?.results.map((room: Room) => (
            <RoomStatusCard
              key={room.id}
              name={room.name}
              status={room.status}
              isActivated={room.is_activated}
            />
          ))
        }
        
      </section>
    </div>
  )
}
