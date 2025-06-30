import { dashboardTable } from '@/app/sevices/panel/data'
import { SearchParams } from '@/app/type'
import TableComponent from '@/app/ui/energia/panel/table'
import React from 'react'

export default async function page({ searchParams }: SearchParams) {

  const { headquarter = '1' , panel = '1',  date_after = new Date(), date_before = new Date()} = await searchParams

  console.log({
    panel,
    date_after,
    date_before
  })

  const dashboardTableReadings = await dashboardTable({ headquarterId: headquarter })

  return (
    <div className="relative p-6">
      <TableComponent readings={dashboardTableReadings}/>
    </div>
  )
}
