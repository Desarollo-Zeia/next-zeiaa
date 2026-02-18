'use client'
import { Card } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import React from 'react'
import { MetricSelector } from '../metric-selector'
import PaginationNumberComponent from '@/app/ui/pagination-number'
import NoResultFound from '@/app/ui/no-result-found'

interface ChannelReading {
  channel: string
  values: {
    Uab: number
    Ubc: number
    Uac: number
    Ia: number
    Ib: number
    Ic: number
  }
}

interface ReadingResult {
  id: number
  created_at: string
  device: {
    name: string
  }
  values_per_channel: ChannelReading[]
  balance_status: string
  cuf_percentage: number
  vuf_percentage: number
}

interface ReadingsData {
  count: number
  results: ReadingResult[]
}

interface FlattenedReading {
  id: number
  created_at: string
  device: string
  channel: string
  Uab: number
  Ubc: number
  Uac: number
  Ia: number
  Ib: number
  Ic: number
  balance_status: string
  measurement_point: string
  cuf_percentage: number
  vuf_percentage: number
}

export default function AlertTable({ readings, metric }: { readings: ReadingsData; metric: string }) {

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString)

    // Formatear la fecha como "Jueves, 12 de noviembre"
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      day: "numeric",
      month: "long"
    }
    let formattedDate = date.toLocaleDateString("es-ES", options)

    // Capitalizar la primera letra en caso de que no lo esté
    formattedDate =
      formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)

    // Formatear la hora como HH:MM
    const hours = date.getHours().toString().padStart(2, "0")
    const minutes = date.getMinutes().toString().padStart(2, "0")
    const formattedTime = `${hours}:${minutes}`

    return { date: formattedDate, time: formattedTime }
  }

  // Aplanamos las lecturas, usando "first_reading" en caso de que "period" sea nulo.
  const readingsData: FlattenedReading[] = readings?.results?.flatMap((reading: ReadingResult) =>
    reading.values_per_channel.map((channel: ChannelReading) => ({
      id: reading.id,
      created_at: reading.created_at, // Se asume que first_reading es igual a created_at
      device: reading.device.name,
      channel: channel.channel,
      Uab: channel.values.Uab,
      Ubc: channel.values.Ubc,
      Uac: channel.values.Uac,
      Ia: channel.values.Ia,
      Ib: channel.values.Ib,
      Ic: channel.values.Ic,
      balance_status: reading.balance_status,
      measurement_point: reading.device.name,
      cuf_percentage: reading.cuf_percentage,
      vuf_percentage: reading.vuf_percentage
    }))
  ) || []

  return (
    <Card className="w-full p-6 flex flex-col gap-4">
      <div className="p-4 bg-slate-100 flex items-center justify-between rounded-md">
        <p className="text-sm">Tabla general</p>
        <MetricSelector dontShowIt="hidden" />
      </div>
      <div className="overflow-x-auto">
        {
          readings?.results?.length > 0 ? (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-sm font-medium text-muted-foreground">Fecha</TableHead>
                    <TableHead className="text-sm font-medium text-muted-foreground">Hora</TableHead>
                    <TableHead className="text-sm font-medium text-muted-foreground">R</TableHead>
                    <TableHead className="text-sm font-medium text-muted-foreground">S</TableHead>
                    <TableHead className="text-sm font-medium text-muted-foreground">T</TableHead>
                    <TableHead className="text-sm font-medium text-muted-foreground">{metric === 'current' ? 'CUF' : 'VUF'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>

                  {/* Renderizamos las filas de la tabla usando "readingsData" format (date, "hh:mm")*/}
                  {readingsData?.map((reading: FlattenedReading) => {
                    const { date, time } = formatDateTime(reading.created_at)
                    return (
                      <TableRow key={`${reading.id}-${reading.channel}`}>
                        {/* Formateamos la fecha y la hora usando date-fns */}
                        <TableCell className="text-sm">{date}</TableCell>
                        <TableCell className="text-sm">{time}</TableCell>
                        {/* Renderizamos los valores de forma condicional según "metric" */}
                        <TableCell className="text-sm">
                          {metric === 'current' ? reading.Ia : reading.Uab}
                        </TableCell>
                        <TableCell className="text-sm">
                          {metric === 'current' ? reading.Ib : reading.Ubc}
                        </TableCell>
                        <TableCell className="text-sm">
                          {metric === 'current' ? reading.Ic : reading.Uac}
                        </TableCell>
                        <TableCell className="text-sm">
                          {metric === 'current' ? reading.cuf_percentage : reading.vuf_percentage}%
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
              <PaginationNumberComponent count={readings.count} itemsPerPage={5} />
            </>
          ) : (
            <NoResultFound />
          )

        }

      </div>
    </Card>
  )
}
