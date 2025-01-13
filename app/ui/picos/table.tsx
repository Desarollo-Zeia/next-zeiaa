'use client'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import IndicatorToggle from "../filters/indicators-toggle";
import { useState } from 'react';
import PaginationNumberComponent from '../pagination-number';
import { UnhealthyFace } from '@/components/status-faces';
import { UNIT_INDICATOR_THRESHOLD } from "@/app/utils/threshold";
import { UNIT_CONVERTED } from "@/app/utils/formatter";
import { Wind, Calendar, Clock } from 'lucide-react';

export default function TableComponent( { generalRoomData, readings, count, indicator, unit, date_after, date_before, room }) {

  const [isWhatMeasuredOpen, setIsWhatMeasuredOpen] = useState(false)
  const [isWhatCausesOpen, setIsWhatCausesOpen] = useState(false)

  const { indicators_pollutants: indicators } = generalRoomData

  let thresholdPointer

  if (indicator === 'TVOC') {
    thresholdPointer = unit
  } else {
    thresholdPointer = indicator
  }

  const colorByLever = {
    HEALTHY: "bg-green-600",
    UNHEALTHY: "bg-orange-600",
    DANGEROUS: "bg-red-600",
    MODERATE: "bg-yellow-600"
  }

  const lmpLevels = [
    { range: `< ${UNIT_INDICATOR_THRESHOLD[thresholdPointer]?.bottom} ${UNIT_CONVERTED[unit]}`, icon: <UnhealthyFace/>, label: "Bueno", color: "text-green-600" },
    { range: `${UNIT_INDICATOR_THRESHOLD[thresholdPointer]?.bottom} ${UNIT_CONVERTED[unit]} - ${UNIT_INDICATOR_THRESHOLD[thresholdPointer]?.center} ${UNIT_CONVERTED[unit]}`, icon: <UnhealthyFace />, label: "Moderado", color: "text-yellow-600" },
    { range: `${UNIT_INDICATOR_THRESHOLD[thresholdPointer]?.center} ${UNIT_CONVERTED[unit]} - ${UNIT_INDICATOR_THRESHOLD[thresholdPointer]?.top} ${UNIT_CONVERTED[unit]}`, icon: <UnhealthyFace/>, label: "Insalubre", color: "text-orange-600" },
    { range: `> ${UNIT_INDICATOR_THRESHOLD[thresholdPointer]?.top} ${UNIT_CONVERTED[unit]}`, icon: <UnhealthyFace/>, label: "Peligroso", color: "text-red-600" },
  ]

  return (
    <div className='flex gap-4 mx-8'>
      <Card >
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-left">Top 3 de niveles altos</CardTitle>
          <p className="text-[#00b0c7] text-xs">Las salas más contaminadas</p>
        </CardHeader>
        <CardContent>
          {
            readings?.top.map(reading => (
                <Card className="w-full max-w-sm"  key={reading.date}>
                <CardHeader className="relative pb-0 ">
                  <div className={`absolute left-4 -top-3 px-4 py-2 rounded-lg text-white text-sm font-medium ${colorByLever[reading.status]}`}>
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
          {/* <Button className="bg-[#00b0c7] hover:bg-[#00b0c7]" onClick={async () => {
            const blob = await readinsgExcel({roomId: room, indicator, unit, date_before, date_after})
            saveAs(blob, `Reporte: ${date_after} - ${date_before}`);
          }}>
            <Image src={ExcelIconGreen} width={16} height={16} alt="excel-image"/>
            Descargar Excel</Button> */}
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
                    <TableCell>{indicator.hours}</TableCell>
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
        <PaginationNumberComponent count={count} itemsPerPage={10}/>
      </Card>
      
    </div>
  )
}
