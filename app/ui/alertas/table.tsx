import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import PaginationNumberComponent from "../pagination-number";
import IndicatorToggle from "../filters/indicators-toggle";
import { GeneralRoomData, Indicator, Measurement, Status, Unit } from "@/app/type";
import { formattedDate } from "@/app/utils/func";
import { STATUS_TO_SPANISH, UNIT_CONVERTED } from "@/app/utils/formatter";
import NoResultFound from "@/app/ui/no-result-found";
import DownloadAlertas from "./alertas-excel";


type Data = Measurement & {
  hours: string,
  level: string,
  resolved: boolean
}

type TableComponentProps = {
  data: Data[],
  count: number,
  generalRoomData: GeneralRoomData,
  indicator: Indicator,
  room: string,
  unit: Unit,
  date_before: string,
  date_after: string
}

export default function TableComponent({ data, count, generalRoomData, indicator, room, unit, date_before, date_after }: TableComponentProps) {

  const { indicators_pollutants: indicators } = generalRoomData

  const avaibleIndicatorsForAlerts = indicators.filter(th => th.indicator !== 'TVOC' && th.indicator !== 'PM10' && th.indicator !== 'PM2_5' && th.indicator !== 'HCHO')

  return (
    <Card className="w-full max-w-6xl mx-auto">
      {/* <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-2xl font-bold">Sala de Conferencias A <br /> <span className="text-sm font-normal text-gray-500">Último datos recibidos</span></CardTitle>
      <Image src='https://utfs.io/f/y8yAFIxNrCH6xltOgtMQNWRFGe0pAcYU5bZ6nSwJOCPqIh4g' alt="face" width={64} height={64} className="object-fit"/>
    </CardHeader> */}
      <CardHeader className="flex flex-row items-center justify-end space-y-0 pb-2 gap-8">
        <IndicatorToggle indicators={avaibleIndicatorsForAlerts} indicatorParam={indicator} />
        {/* <DownloadAlertas room={room} indicator={indicator} unit={unit} date_after={date_after} date_before={date_before} /> */}
      </CardHeader>
      {
        count > 0 ? (
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
                      <TableCell >{formattedDate(indicator.date)}</TableCell>
                      <TableCell >{indicator.hours.toLowerCase()}</TableCell>
                      <TableCell>{indicator.value}</TableCell>
                      <TableCell>{UNIT_CONVERTED[indicator.unit]}</TableCell>
                      <TableCell >{STATUS_TO_SPANISH[indicator.level as Status]}</TableCell>
                    </TableRow>
                  )
                  )
                }
              </TableBody>
            </Table>
          </CardContent>
        ) : (
          <NoResultFound />
        )
      }
      {count > 0 && <PaginationNumberComponent count={count} itemsPerPage={10} />}
    </Card>
  )
}
