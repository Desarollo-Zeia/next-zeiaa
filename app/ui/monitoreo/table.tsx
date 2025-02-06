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
import { INDICATOR_CONVERTED, UNIT_CONVERTED } from "@/app/utils/formatter"
import { Indicator, Unit } from "@/app/type"
import { formattedDate } from "@/app/utils/func"
import { usePathname, useRouter } from "next/navigation"

interface IndicatorStructure {
  indicator: string,
  value: string,
  unit: string,
  status: string,
  hours: string,
  date: string
}

interface TableComponentProps {
  data: IndicatorStructure[],
  name: string,
  devUI: string
}
  
export default function TableComponent({ data, name, devUI } : TableComponentProps) {

  const router = useRouter();
  const pathname = usePathname()
  const newPath = pathname.split('/').slice(0, 3).join('/')

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">{ name }<br /><span className="text-sm font-normal text-gray-500">Sensor: {'    '}{ devUI }</span></CardTitle>
        {/* <Image src='https://utfs.io/f/y8yAFIxNrCH6xltOgtMQNWRFGe0pAcYU5bZ6nSwJOCPqIh4g' alt="face" width={64} height={64} className="object-fit"/> */}
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
                    <TableRow key={i} onClick={() => 
                      router.replace(`${newPath}/analisis?indicator=${indicator.indicator}&unit=${indicator.unit}`)
                      // router.replace(`${newPath}/analisis?indicator=${indicator.indicator}&unit=${indicator.unit}`)
                    } className="cursor-pointer"
                    >
                      <TableCell className="font-normal"><div className="w-4 h-4 rounded-full bg-yellow-400"></div></TableCell>
                      <TableCell className="font-normal">{INDICATOR_CONVERTED[indicator.indicator as Indicator] }</TableCell>
                      <TableCell className="font-normal">{formattedDate(indicator.date)}</TableCell>
                      <TableCell className="font-normal">{indicator.hours.toLocaleLowerCase()}</TableCell>
                      <TableCell  className="font-normal text-right">{indicator.value} {UNIT_CONVERTED[indicator.unit as Unit]}</TableCell>
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
