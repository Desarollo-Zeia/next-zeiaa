'use client'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import IndicatorToggle from "../filters/indicators-toggle";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useState } from 'react';
import { saveAs } from 'file-saver';
import PaginationNumberComponent from '../pagination-number';
import { readinsgExcel, readinsgExcelAmbiental } from '@/app/sevices/readings/data';
import Image from "next/image";
import ExcelIconGreen from "@/public/icons/excel.png"
import { UNIT_INDICATOR_THRESHOLD, UNIT_INDICATOR_THRESHOLD_AMBIENTAL } from "@/app/utils/threshold";
import { INDICATOR_CONSEQUENCES_TEXT, INDICATOR_CONVERTED, INDICATOR_MEASUREMENT_TEXT, STATUS_COLOR_BG, STATUS_TO_SPANISH, UNIT_CONVERTED } from "@/app/utils/formatter";
import { GeneralRoomData, Indicator, Measurement, Unit } from "@/app/type";
import { formattedDate } from "@/app/utils/func";
import { usePathname } from "next/navigation";
import NoResultFound from "../no-result-found";
import IndicatorThreshold from "../umbrales";
import { useTransition } from 'react';
import OrderingFilter from "../filters/ordering-filter";
// import { TimeRangeSlider } from "../filters/time-range-slider";

type ModifiedMeasurement = Omit<Measurement, 'hour'> & {
  hours: string;
}

type TableComponentProps = {
  generalRoomData: GeneralRoomData,
  readings: {
    count: number,
    next: string,
    previous: string | null,
    results: ModifiedMeasurement[],
  },
  count: number,
  indicator: Indicator,
  unit: Unit,
  date_after: string,
  date_before: string,
  room: string,

}

export default function TableComponent({ generalRoomData, readings, count, indicator, unit, room, date_before, date_after }: TableComponentProps) {

  const [isWhatMeasuredOpen, setIsWhatMeasuredOpen] = useState(false)
  const [isWhatCausesOpen, setIsWhatCausesOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const pathname = usePathname()
  // eslint-disable-next-line @next/next/no-assign-module-variable
  const module = pathname.split('/')[1]

  const { indicators_activated: indicators } = generalRoomData

  let thresholdPointer
  let thresholds

  if (indicator === 'TVOC') {
    thresholdPointer = unit as Extract<Unit, 'PPB' | 'ICA'>
  } else {
    thresholdPointer = indicator
  }

  // const lmpLevels = [
  //   { range: `< ${UNIT_INDICATOR_THRESHOLD[thresholdPointer]?.bottom} ${UNIT_CONVERTED[unit]}`, icon: <GoodFace width={24} height={24}/>, label: "Bueno", color: "text-green-600", obj: UNIT_INDICATOR_THRESHOLD[thresholdPointer] },
  //   { range: `${UNIT_INDICATOR_THRESHOLD[thresholdPointer]?.bottom} ${UNIT_CONVERTED[unit]} - ${UNIT_INDICATOR_THRESHOLD[thresholdPointer]?.center} ${UNIT_CONVERTED[unit]}`, icon: <ModerateFace width={24} height={24}/>, label: "Moderado", color: "text-yellow-600", obj: UNIT_INDICATOR_THRESHOLD[thresholdPointer] },
  //   { range: `${UNIT_INDICATOR_THRESHOLD[thresholdPointer]?.center} ${UNIT_CONVERTED[unit]} - ${UNIT_INDICATOR_THRESHOLD[thresholdPointer]?.top} ${UNIT_CONVERTED[unit]}`, icon: <UnhealthyFace width={24} height={24}/>, label: "Insalubre", color: "text-orange-600", obj: UNIT_INDICATOR_THRESHOLD[thresholdPointer] },
  //   { range: `> ${UNIT_INDICATOR_THRESHOLD[thresholdPointer]?.top} ${UNIT_CONVERTED[unit]}`, icon: <DangerousFace width={24} height={24}/>, label: "Peligroso", color: "text-red-600", obj: UNIT_INDICATOR_THRESHOLD[thresholdPointer] },
  // ]

  if (module === 'ocupacional') {
    thresholds = Object.values(UNIT_INDICATOR_THRESHOLD[thresholdPointer])
  }

  if (module === 'ambiental') {
    thresholds = Object.values(UNIT_INDICATOR_THRESHOLD_AMBIENTAL[thresholdPointer])
  }

  const handleExcelDownload = async () => {
    startTransition(async () => {
      try {
        let blob;
        if (module === 'ocupacional') {
          blob = await readinsgExcel({
            room,
            indicator,
            unit,
            date_before,
            date_after,
          });
        }

        if (module === 'ambiental') {
          blob = await readinsgExcelAmbiental({
            room,
            indicator,
            unit,
            date_before,
            date_after,
          });
        }

        if (blob) {
          saveAs(blob, `Reporte: ${date_after} - ${date_before}`);
        }
      } catch (error) {
        console.error('Error al descargar el reporte:', error);
      }
    });
  };

  return (
    <div className='flex gap-4 mx-8'>
      <Card className="shadow-md" >
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Límite Máximo Permisible (LMP)</CardTitle>
        </CardHeader>
        <CardContent>
          <IndicatorThreshold thresholds={thresholds} unit={unit} />
          <div className="mt-6 flex justify-center space-x-4">
            <Dialog open={isWhatMeasuredOpen} onOpenChange={setIsWhatMeasuredOpen}>
              <DialogTrigger asChild>
                <Button className='hover:bg-black hover:text-white' variant="outline">¿Qué se mide?</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle >¿Qué se mide?</DialogTitle>
                  <DialogDescription>
                    {INDICATOR_MEASUREMENT_TEXT[indicator]}
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
                    Niveles elevados de {INDICATOR_CONVERTED[indicator]} pueden causar:
                    {INDICATOR_CONSEQUENCES_TEXT[indicator].map((consequence, i) => (
                      <p key={i} className="text-gray-600">- {consequence}</p>
                    ))}
                    Es importante mantener una buena ventilación para prevenir la acumulación de {INDICATOR_CONVERTED[indicator]}.
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
      <div className="w-full flex-1">

        <IndicatorToggle indicators={indicators} indicatorParam={indicator} />
        <Card className="w-full flex-1 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <h2 className="font-semibold text-lg">Tabla de datos recolectados</h2>
              <p className="text-sm font-medium">Ingreso de valores cada 5 min</p>
            </div>
            <Button
              className="bg-[#00b0c7] hover:bg-[#00b0c7] relative"
              onClick={handleExcelDownload}
              disabled={isPending}
            >
              <Image src={ExcelIconGreen} width={16} height={16} alt="excel-image" />
              Descargar Excel
              {
                isPending && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  </div>
                )
              }
            </Button>

            <OrderingFilter />
          </CardHeader>
          {
            count > 0 ? (
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
                          <TableCell>{formattedDate(indicator.date)}</TableCell>
                          <TableCell>{indicator.hours.toLocaleLowerCase()}</TableCell>
                          <TableCell>{indicator.value}</TableCell>
                          <TableCell>{UNIT_CONVERTED[indicator.unit]}</TableCell>
                          <div className="flex items-center justify-center">
                            <div className={`${STATUS_COLOR_BG[indicator.status]} w-2 h-2 rounded-full`} />
                            <TableCell>{STATUS_TO_SPANISH[indicator.status]}</TableCell>
                          </div>
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
      </div>

    </div>
  )
}
