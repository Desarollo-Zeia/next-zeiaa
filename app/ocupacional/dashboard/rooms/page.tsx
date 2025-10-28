import RoomStatusCard from '@/app/ui/rooms/room-status-card'
import React from 'react'
import styles from '/app/ui/home.module.css'
import RoomSearchFilter from '@/app/ui/filters/search'
import FiltersContainer from '@/app/ui/filters/filters-container'
import NoResultFound from '@/app/ui/no-result-found'
import PaginationComponent from '@/app/ui/pagination'
import { roomsList } from '@/app/sevices/enterprise/data'
import HeadquarterSelect from '@/app/ui/filters/headquarter-select'
import { getHeadquartersOcupacional } from '@/app/sevices/filters/data'
import { SearchParams } from '@/app/type'
// import StatusSelect from '@/app/ui/filters/status-select'

interface Room {
  id: number
  name: string
  status: string
  is_activated: boolean,
  devices: { dev_eui: string, id: number, type_sensor: string }[],
  headquarter: { id: number, name: string }
}

export default async function page({ searchParams }: SearchParams) {

  const { search, status, headquarter, page, limit, offset } = await searchParams
  const headquarters = await getHeadquartersOcupacional()
  const rooms = await roomsList({ search, status, headquarter, page, limit, offset })

  return (
    <div>
      <FiltersContainer>
        {/* <StatusSelect /> */}
        <HeadquarterSelect headquarters={headquarters} />
        <RoomSearchFilter />
      </FiltersContainer>
      {
        rooms?.results.length > 0 ? (
          <section className={styles.roomCardsContainer}>
            {
              rooms?.results.map((room: Room) => {
                return (
                  <RoomStatusCard
                    key={room.id}
                    name={room.name}
                    status={room.status}
                    isActivated={room.is_activated}
                    room={room.id}
                    devEUI={room.devices[0]?.dev_eui}
                    headquarter={room.headquarter.name}
                  />
                )
              })
            }
          </section>
        ) : (
          <NoResultFound />
        )
      }
      {rooms?.count > 0 && <PaginationComponent count={rooms?.count} itemsPerPage={10} />}
    </div>
  )
}
