'use client'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import IndicatorToggle from "../filters/indicators-toggle";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useState } from 'react';
import PaginationNumberComponent from '../pagination-number';
import { UnhealthyFace } from '@/components/status-faces';
import { readinsgExcel } from '@/app/sevices/readings/data';
import { saveAs } from 'file-saver';
import Image from "next/image";
import ExcelIconGreen from "@/public/icons/excel.png"
import { UNIT_INDICATOR_THRESHOLD } from "@/app/utils/threshold";
import { UNIT_CONVERTED } from "@/app/utils/formatter";

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
          <CardTitle className="text-2xl font-bold text-center">Límite Máximo Permisible (LMP)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {lmpLevels.map((level, index) => (
              <div key={index} className="flex items-center space-x-4 p-2 rounded-lg bg-gray-100">
                <div className={`${level.color}`}>{level.icon}</div>
                <div>
                  <p className="font-semibold">{level.label}</p>
                  <p className="text-sm text-gray-600">{level.range}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-center space-x-4">
            <Dialog open={isWhatMeasuredOpen} onOpenChange={setIsWhatMeasuredOpen}>
              <DialogTrigger asChild>
                <Button className='hover:bg-black hover:text-white' variant="outline">¿Qué se mide?</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle >¿Qué se mide?</DialogTitle>
                  <DialogDescription>
                    El CO2 es el indicador de riesgo de contagio y transmisión de virus para el COVID-19, regulado por el Minsa en su anexo 10.

                    El CO2 indica el grado de ventilación que tiene un espacio, se estima que el 1 % del aire que se respira ya fue respirado por otra persona, las personas exhalan CO2 por lo que la acumulación de este gas es un buen indicador de la acumulación de aerosoles que podrían transmitir la COVID-19.
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>

            <Dialog open={isWhatCausesOpen} onOpenChange={setIsWhatCausesOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className='hover:bg-black hover:text-white'>¿Qué ocasiona?</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>¿Qué ocasiona?</DialogTitle>
                  <DialogDescription>
                    Niveles elevados de CO2 pueden causar:
                      <p>- Dolores de cabeza</p>
                      <p>- Fatiga y somnolencia</p>
                      <p>- Dificultad para concentrarse</p>
                      <p>- Disminución del rendimiento cognitivo</p>
                      <p>- En casos extremos, problemas respiratorios</p>
                    {/* <ul className="list-disc list-inside mt-2">
                      <li>Dolores de cabeza</li>
                      <li>Fatiga y somnolencia</li>
                      <li>Dificultad para concentrarse</li>
                      <li>Disminución del rendimiento cognitivo</li>
                      <li>En casos extremos, problemas respiratorios</li>
                    </ul> */}
                    Es importante mantener una buena ventilación para prevenir la acumulación de CO2.
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
      <Card className="w-full flex-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <IndicatorToggle indicators={indicators} indicatorParam={indicator}/>
          <Button className="bg-[#00b0c7] hover:bg-[#00b0c7]" onClick={async () => {
            const blob = await readinsgExcel({roomId: room, indicator, unit, date_before, date_after})
            saveAs(blob, `Reporte: ${date_after} - ${date_before}`);
          }}>
            <Image src={ExcelIconGreen} width={16} height={16} alt="excel-image"/>
            Descargar Excel</Button>
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
                readings.results?.map((indicator, i) => 
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
