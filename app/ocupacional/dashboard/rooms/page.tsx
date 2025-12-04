import RoomStatusCard from '@/app/ui/rooms/room-status-card'
import styles from '@/app/ui/home.module.css'
import RoomSearchFilter from '@/app/ui/filters/search'
import FiltersContainer from '@/app/ui/filters/filters-container'
import NoResultFound from '@/app/ui/no-result-found'
import PaginationComponent from '@/app/ui/pagination'
import { roomsList } from '@/app/sevices/enterprise/data'
import HeadquarterSelect from '@/app/ui/filters/headquarter-select'
import { getHeadquartersOcupacional } from '@/app/sevices/filters/data'
import { SearchParams } from '@/app/type'
import { getToken } from '@/app/lib/auth'
// import { cacheLife } from 'next/cache'
// import StatusSelect from '@/app/ui/filters/status-select'

interface Room {
  id: number
  name: string
  status: string
  is_activated: boolean,
  devices: { dev_eui: string, id: number, type_sensor: string }[],
  headquarter: { id: number, name: string }
}


// async function GetRoomsList({ search, status, headquarter, page, limit, offset, token }: any) {
//   'use cache'
//   cacheLife('minutes')
//   const rooms = await roomsList({ search, status, headquarter, page, limit, offset, token })

//   return rooms
// }


export default async function page({ searchParams }: SearchParams) {


  const { search, status, headquarter, page, limit, offset } = await searchParams

  const authToken = await getToken()

  const getRoomsList = await roomsList({ search, status, headquarter, page, limit, offset, token: authToken })

  const headquarters = await getHeadquartersOcupacional()

  return (
    <div>
      <FiltersContainer>
        {/* <StatusSelect /> */}
        <HeadquarterSelect headquarters={headquarters} />
        <RoomSearchFilter />
      </FiltersContainer>
      {
        getRoomsList?.results.length > 0 ? (
          <section className={styles.roomCardsContainer}>
            {
              getRoomsList?.results.map((room: Room) => {
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
      {getRoomsList?.count > 0 && <PaginationComponent count={getRoomsList?.count} itemsPerPage={10} />}
    </div>
  )
}
