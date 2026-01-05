import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import PaginationNumberComponent from '../../pagination-number'

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

export default function TableComponent({ readings }: { readings: PanelReadings }) {

  return (
    <div className='flex flex-col h-fit'>
      <h3 className='p-4 font-semibold text-[#6d6c6c]'>Tablero de distribucion</h3>
      <div className='max-h-[400px] overflow-y-auto border rounded-lg'>
        <Table>
          <TableHeader className='sticky top-0 bg-white z-10'>
            <TableRow>
              <TableHead className='text-center bg-gray-50'>
                Puntos de monitoreo
              </TableHead>
              <TableHead className='text-center bg-gray-50'>
                Llave
              </TableHead>
              <TableHead className='text-center bg-gray-50'>
                Tipo de red
              </TableHead>
              <TableHead className='text-center bg-gray-50'>
                Capacidad
              </TableHead>
              <TableHead className='text-center bg-gray-50'>
                Hardware
              </TableHead>
              <TableHead className='text-center bg-gray-50'>
                Ubicacion
              </TableHead>
              <TableHead className='text-center bg-gray-50'>
                Referencia
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {
              readings.results.map(reading => {
                return (
                  <TableRow key={reading.id} className={`${reading.is_active ? 'bg-white' : 'bg-gray-200'}`}>
                    <TableCell className='text-center'>
                      {reading.name}
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
                    <TableCell className='text-center'>
                      {reading.location_reference || 'No precisa'}
                    </TableCell>
                  </TableRow>
                )
              })
            }
          </TableBody>
        </Table>
      </div>
      <div className='mt-4'>
        <PaginationNumberComponent count={readings.count} itemsPerPage={10} />
      </div>
    </div>
  )
}
