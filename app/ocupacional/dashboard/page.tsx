import RoomStatusCard from '@/app/ui/rooms/room-status-card'
import React from 'react'
import styles from '/app/ui/home.module.css'
import RoomSearchFilter from '@/app/ui/filters/search'
import FiltersContainer from '@/app/ui/filters/filters-container'
import HeadquarterSelectFilter from '@/app/ui/filters/headquearter'
import NoResultFound from '@/app/ui/no-result-found'
import PaginationComponent from '@/app/ui/pagination'
import { roomsList } from '@/app/sevices/enterprise/data'

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
    limit?: string,
    offset?: string
  }
}

export default async function page({ searchParams } : PageProps ) {

  const { search, status, headquarter, page, limit, offset } = await searchParams

  const rooms = await roomsList({ search, status, headquarter, page, limit, offset })

  return (
    <div>
      <FiltersContainer>
        <RoomSearchFilter/>
        <HeadquarterSelectFilter/>
      </FiltersContainer>
      {
        rooms?.results.length > 0 ? (
          <section className={styles.roomCardsContainer}>
            {
              rooms?.results.map((room: Room) => (
                <RoomStatusCard
                  key={room.id}
                  name={room.name}
                  status={room.status}
                  isActivated={room.is_activated}
                  room={room.id}
                />
              ))
            }
          </section>
        ) : (
          <NoResultFound/>
        )
      }
      <PaginationComponent count={rooms?.count} itemsPerPage={10}/>
    </div>
  )
}
