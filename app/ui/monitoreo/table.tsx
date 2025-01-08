'use client'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import Image from "next/image"

interface IndicatorStructure {
  indicator: string,
  value: string,
  unit: string,
  status: string,
  hours: string,
  date: string
}

interface TableComponentProps {
  data: IndicatorStructure[]
}
  
export default function TableComponent({ data } : TableComponentProps) {

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">Sala de Conferencias A <br /> <span className="text-sm font-normal text-gray-500">Último datos recibidos</span></CardTitle>
        <Image src='https://utfs.io/f/y8yAFIxNrCH6xltOgtMQNWRFGe0pAcYU5bZ6nSwJOCPqIh4g' alt="face" width={64} height={64} className="object-fit"/>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Estado</TableHead>
              <TableHead className="w-[100px]">Indicador</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Hora</TableHead>
              <TableHead className="text-right">Valor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
              {
                data?.map((indicator, i) => 
                  ( 
                    <TableRow key={i}>
                      <TableCell className="font-medium"><div className="w-4 h-4 rounded-full bg-yellow-400"></div></TableCell>
                      <TableCell className="font-medium">{indicator.indicator}</TableCell>
                      <TableCell>{indicator.date}</TableCell>
                      <TableCell>{indicator.hours}</TableCell>
                      <TableCell className="text-right">{indicator.value} {indicator.unit}</TableCell>
                    </TableRow>
                  )
                )
              }
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
