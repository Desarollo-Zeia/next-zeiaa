'use server'
import { fetchWithAuth } from '@/app/lib/api'
import RoomStatusCard from '@/app/ui/rooms/room-status-card'
import React from 'react'
import styles from '/app/ui/home.module.css'


export default async function page() {
  const roomList = await fetchWithAuth('enterprise/api/enterprise/room-list/') 
  
  console.log(roomList)
  return (
    <section className={styles.roomCardsContainer}>
      {
        roomList?.results.map(room => (
          <RoomStatusCard
            key={room.id}
            name={room.name}
            status={room.status}
            isActivated={room.is_activated}
          />
        ))
      }
      
    </section>
  )
}
