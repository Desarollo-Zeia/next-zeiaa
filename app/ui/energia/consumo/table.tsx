import React from 'react'
import PaginationNumberComponent from '../../pagination-number'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export default function table() {
  return (  
    <div className='flex gap-4 mx-8'>
      <Card className="w-full flex-1">
        <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead >Fecha</TableHead>
                  <TableHead >Hora</TableHead>
                  <TableHead>Energia activa</TableHead>
                  <TableHead>potencia</TableHead>
                  <TableHead>corriente</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                  <TableRow>
                      <TableCell >Miércoles 12</TableCell>
                      <TableCell >10:30 p.m</TableCell>
                      <TableCell>20 kWh</TableCell>
                      <TableCell>194w</TableCell>
                      <TableCell >0.94</TableCell>
                    </TableRow> 
              </TableBody>
            </Table>
          </CardContent>
          <PaginationNumberComponent count={10} itemsPerPage={10}/>
      </Card>
      <Card className="w-full flex-1">
        <p>asdasd</p>
      </Card>

    </div>
  )
}
