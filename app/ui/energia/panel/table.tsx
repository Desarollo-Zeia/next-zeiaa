import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

type Reading = {
  id: number,
  name: string,
  is_active: boolean,
  channel: string,
  type: string,
  key: string,
  capacity: string,
  hardware: string,
  device: string,
  dev_eui: string,
  electrical_panel: string

}

interface PanelReadings {
  count: number,
  next: string,
  previous: string,
  results: Reading[]
}

export default function TableComponent({ readings } : { readings : PanelReadings}) {


  return (
    <div className='flex-1'>
      <h3 className='p-4 font-semibold text-[#6d6c6c]'>Tablero de distribución</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              Pinza
            </TableHead>
            <TableHead>
              Puntos de monitoreo
            </TableHead>
            <TableHead>
              Llave
            </TableHead>
            <TableHead>
              Tipo de red
            </TableHead>
            <TableHead>
              Capacidad
            </TableHead>
            <TableHead>
              Hardware
            </TableHead>
            <TableHead>
              Ubicación
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {
            readings.results.map(reading => {
              return (
                <TableRow key={reading.id} className={`${reading.is_active ? 'bg-white' : 'bg-gray-200'}`}>
                  <TableCell>
                    {reading.channel}
                  </TableCell>
                  <TableCell>
                    {reading.name}
                  </TableCell>
                  <TableCell>
                    {reading.key}
                  </TableCell>
                  <TableCell>
                    {reading.type}
                  </TableCell>
                  <TableCell>
                    {reading.capacity}
                  </TableCell>
                  <TableCell>
                    {reading.hardware}
                  </TableCell>
                  <TableCell>
                    {reading.electrical_panel}
                  </TableCell>
                </TableRow>
              )
            })
          }
         
        </TableBody>
      </Table>
    </div>
  )
}
