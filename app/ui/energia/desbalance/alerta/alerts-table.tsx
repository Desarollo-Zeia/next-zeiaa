import { Card } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import React from 'react'
import { MetricSelector } from '../metric-selector'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import PaginationNumberComponent from '@/app/ui/pagination-number'
import NoResultFound from '@/app/ui/no-result-found'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function AlertTable({ readings, metric }: any) {

  // Aplanamos las lecturas, usando "first_reading" en caso de que "period" sea nulo.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  const readingsData = readings?.results?.flatMap((reading: any) =>
// eslint-disable-next-line @typescript-eslint/no-explicit-any
    reading.values_per_channel.map((channel: any) => ({
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
      measurement_point: reading.measurement_point.name,
    }))
  )

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
                  </TableRow>
                </TableHeader>
                <TableBody>

                  {/* Renderizamos las filas de la tabla usando "readingsData" format (date, "hh:mm")*/}
                  {/* // eslint-disable-next-line @typescript-eslint/no-explicit-any*/}
                  {readingsData?.map((reading: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any 
                    const date = new Date(reading.created_at)
                    return (
                      <TableRow key={`${reading.id}-${reading.channel}`}>
                        {/* Formateamos la fecha y la hora usando date-fns */}
                        <TableCell className="text-sm">{format(date, "eeee, dd MMMM yyyy", { locale: es })}</TableCell>
                        <TableCell className="text-sm">{format(date, "hh:mm")}</TableCell>
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
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
              <PaginationNumberComponent count={readings.count} itemsPerPage={5}/>
            </>
          ) : (
            <NoResultFound/>
          )
          
        }
        
      </div>
    </Card>
  )
}
