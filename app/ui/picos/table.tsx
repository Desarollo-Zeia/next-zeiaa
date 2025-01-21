'use client'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import IndicatorToggle from "../filters/indicators-toggle";
import PaginationNumberComponent from '../pagination-number';
import { Wind, Calendar, Clock } from 'lucide-react'
import { GeneralRoomData, Indicator, Readings } from "@/app/type";

type TableComponentProps = {
  indicator: Indicator
  generalRoomData: GeneralRoomData,
  readings: Readings
}

export default function TableComponent( { generalRoomData, readings, indicator} : TableComponentProps) {

  const { indicators_pollutants: indicators } = generalRoomData


  const colorByLever = {
    GOOD: "bg-green-600",
    UNHEALTHY: "bg-orange-600",
    DANGEROUS: "bg-red-600",
    CRITICAL: "bg-red-600",
    MODERATE: "bg-yellow-600"
  }
  return (
    <div className='flex gap-4 mx-8'>
      <Card className="min-w-96">
        <CardHeader className="w-full px-16">
          <CardTitle className="text-2xl font-bold text-center">Top 3 de niveles altos</CardTitle>
          <p className="text-[#00b0c7] text-xs text-left">Las salas más contaminadas</p>
        </CardHeader>
        <CardContent className="w-full flex flex-col gap-8">
          {
            readings?.top.map(reading => (
              <Card className="w-full shadow-lg"  key={reading.date}>
                <CardHeader className="relative pb-0">
                  <div className={`absolute left-12 -top-2 px-4 py-2 rounded-lg text-white text-sm font-medium ${colorByLever[reading.status]} shadow-lg`}>
                    Nivel más alto ({reading.status})
                  </div>
                </CardHeader>
                <CardContent className="pt-8">
                  {
                    <ul className="space-y-4" >
                        <li className="flex items-center space-x-3">
                        <Wind className="h-5 w-5 text-muted-foreground" aria-hidden="true" /> 
                        <span className="text-sm">{reading.indicator}: {reading.value} {reading.unit}</span>
                        </li>
                        <li className="flex items-center space-x-3">
                        <Calendar className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                        <span className="text-sm">{reading.date}</span>
                        </li>
                        <li className="flex items-center space-x-3">
                        <Clock className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                        <span className="text-sm">{reading.hour}</span>
                        </li>
                    </ul>
                  }
                </CardContent>
              </Card>
            ))
          }
        </CardContent>
      </Card>
      <Card className="w-full flex-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <IndicatorToggle indicators={indicators} indicatorParam={indicator}/>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Hora</TableHead>
                <TableHead>Cantidad</TableHead>
                <TableHead>Unidad</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
            {
                readings.result?.map((indicator, i) => 
                ( 
                    <TableRow key={i}>
                    <TableCell>{indicator.date}</TableCell>
                    <TableCell>{indicator.hour}</TableCell>
                    <TableCell>{indicator.value}</TableCell>
                    <TableCell>{indicator.unit}</TableCell>
                    <TableCell >{indicator.status}</TableCell>
                    </TableRow>
                )
                )
              }
            
            </TableBody>
          </Table>
        </CardContent>
        <PaginationNumberComponent count={readings.count} itemsPerPage={10}/>
      </Card>
      
    </div>
  )
}
