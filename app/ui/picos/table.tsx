'use client'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import IndicatorToggle from "../filters/indicators-toggle";
import PaginationNumberComponent from '../pagination-number';
import { Wind, Calendar, Clock } from 'lucide-react'
import { GeneralRoomData, Indicator, Readings } from "@/app/type";
import { STATUS_TO_SPANISH, UNIT_CONVERTED } from "@/app/utils/formatter";
import { formattedDate } from "@/app/utils/func";
import NoResultsFound from "../no-result";
import NoResultFound from "../no-result-found";

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
        {
          readings.count > 0 ? (
            <>
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
                      Nivel más alto ({STATUS_TO_SPANISH[reading.status]})
                    </div>
                  </CardHeader>
                  <CardContent className="pt-8">
                    {
                      <ul className="space-y-4" >
                          <li className="flex items-center space-x-3">
                          <Wind className="h-5 w-5 text-muted-foreground" aria-hidden="true" /> 
                          <span className="text-sm">{reading.indicator}: {reading.value} {UNIT_CONVERTED[reading.unit]}</span>
                          </li>
                          <li className="flex items-center space-x-3">
                          <Calendar className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                          <span className="text-sm">{formattedDate(reading.date)}</span>
                          </li>
                          <li className="flex items-center space-x-3">
                          <Clock className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                          <span className="text-sm">{reading.hour.toLowerCase()}</span>
                          </li>
                      </ul> 
                    }
                  </CardContent>
                </Card>
              ))
            }
          </CardContent>
            </>
          ) : (
            <div className="flex items-center justify-center min-h-[300px] px-16">
              <NoResultsFound message="No se encontraron salas contaminadas"/>
            </div>
          )
        }
      </Card>
      <Card className="w-full flex-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <IndicatorToggle indicators={indicators} indicatorParam={indicator}/>
        </CardHeader>
        {
          readings.count > 0 ? (
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
                      <TableCell>{formattedDate(indicator.date)}</TableCell>
                      <TableCell>{indicator.hour.toLowerCase()}</TableCell>
                      <TableCell>{indicator.value}</TableCell>
                      <TableCell>{UNIT_CONVERTED[indicator.unit]}</TableCell>
                      <TableCell >{STATUS_TO_SPANISH[indicator.status]}</TableCell>
                      </TableRow>
                  )
                  )
                }
              
              </TableBody>
            </Table>
          </CardContent>
          ) : (
            <CardContent className="flex items-center justify-center min-h-[400px] shadow-sm border-t border-gray-100">
              <NoResultFound/>
            </CardContent>
          )
        }
        { readings.count > 0 && <PaginationNumberComponent count={readings.count} itemsPerPage={10}/> }
        
      </Card>
      
    </div>
  )
}
