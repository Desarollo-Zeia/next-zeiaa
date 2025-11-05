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
import NoResultFound from "../no-result-found"
import { useRouter } from "next/navigation"

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
  devUI: string,
  room?: string,
  status: string
}

export default function TableComponent({ data }: TableComponentProps) {


  const filterData = data.filter((item: IndicatorStructure) => item.indicator !== 'PIR' && item.indicator !== 'LUX')

  const router = useRouter()

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">Resumen de indicadores<br /><span className="text-sm font-normal text-gray-500">Datos por agente, en tiempo real</span></CardTitle>
      </CardHeader>
      {
        filterData.length === 0 ? (
          <NoResultFound />
        ) : (
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Indicador</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Hora</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {
                  filterData?.map((indicator, i) => {
                    return (
                      <TableRow key={i} onClick={() => router.push(`/ocupacional/dashboard/analisis/indicadores?indicator=${indicator.indicator}&unit=${indicator.unit}`)} className="cursor-pointer">
                        <TableCell className="font-normal">{INDICATOR_CONVERTED[indicator.indicator as Indicator]}</TableCell>
                        <TableCell className="font-normal">{formattedDate(indicator.date)}</TableCell>
                        <TableCell className="font-normal">{indicator.hours.toLocaleLowerCase()}</TableCell>
                        <TableCell className="font-normal text-right text-nowrap">{indicator.value} {UNIT_CONVERTED[indicator.unit as Unit]}</TableCell>
                      </TableRow>
                    )
                  }

                  )
                }
              </TableBody>
            </Table>
          </CardContent>
        )
      }

    </Card>
  )
}
