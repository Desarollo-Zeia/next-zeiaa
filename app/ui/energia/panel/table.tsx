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
  electrical_panel: string,
  location_reference: string,

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
            <TableHead className='text-center'>
              Pinza
            </TableHead>
            <TableHead className='text-center'>
              Puntos de monitoreo
            </TableHead>
            <TableHead className='text-center'>
              Referencia
            </TableHead>
            <TableHead className='text-center'>
              Llave
            </TableHead>
            <TableHead className='text-center'>
              Tipo de red
            </TableHead>
            <TableHead className='text-center'>
              Capacidad
            </TableHead>
            <TableHead className='text-center'>
              Hardware
            </TableHead>
            <TableHead className='text-center'>
              Ubicación
            </TableHead>
          
          </TableRow>
        </TableHeader>
        <TableBody>
          {
            readings.results.map(reading => {
              return (
                <TableRow key={reading.id} className={`${reading.is_active ? 'bg-white' : 'bg-gray-200'}`}>
                  <TableCell className='text-center'>
                    {reading.channel}
                  </TableCell>
                  <TableCell className='text-center'>
                    {reading.key}
                  </TableCell>
                  <TableCell className='text-center'>
                    {reading.location_reference}
                  </TableCell>
                  <TableCell className='text-center'>
                    {reading.key}
                  </TableCell>
                  <TableCell className='text-center'>
                    {reading.type}
                  </TableCell>
                  <TableCell className='text-center'>
                    {reading.capacity}
                  </TableCell>
                  <TableCell className='text-center'>
                    {reading.hardware}
                  </TableCell>
                  <TableCell className='text-center'>
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
