import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import PaginationNumberComponent from "../pagination-number";
import IndicatorToggle from "../filters/indicators-toggle";
import { GeneralRoomData, Indicator, Measurement } from "@/app/type";

type Data = Measurement & {
  hours: string,
  level: string,
  resolved: boolean
}

type TableComponentProps = {
  data: Data[],
  count: number,
  generalRoomData: GeneralRoomData,
  indicator: Indicator
}

export default function TableComponent({ data, count, generalRoomData, indicator } : TableComponentProps) {

  const { indicators_pollutants: indicators } = generalRoomData

  return (
    <Card className="w-full max-w-6xl mx-auto">
    {/* <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-2xl font-bold">Sala de Conferencias A <br /> <span className="text-sm font-normal text-gray-500">Último datos recibidos</span></CardTitle>
      <Image src='https://utfs.io/f/y8yAFIxNrCH6xltOgtMQNWRFGe0pAcYU5bZ6nSwJOCPqIh4g' alt="face" width={64} height={64} className="object-fit"/>
    </CardHeader> */}
    <CardHeader className="flex flex-row items-center justify-end space-y-0 pb-2">
      <IndicatorToggle indicators={indicators} indicatorParam={indicator}/>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead >Fecha</TableHead>
            <TableHead >Hora</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Unidad</TableHead>
            <TableHead>Estado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
            {
              data?.map((indicator, i) => 
                ( 
                  <TableRow key={i}>
                    <TableCell >{indicator.date}</TableCell>
                    <TableCell >{indicator.hours}</TableCell>
                    <TableCell>{indicator.value}</TableCell>
                    <TableCell>{indicator.unit}</TableCell>
                    <TableCell >{indicator.level}</TableCell>
                  </TableRow>
                )
              )
            }
        </TableBody>
      </Table>
    </CardContent>
    <PaginationNumberComponent count={count} itemsPerPage={10}/>
    </Card>
  )
}
