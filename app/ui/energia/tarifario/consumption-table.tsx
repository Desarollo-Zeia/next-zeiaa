'use client'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import PaginationNumberComponent from "@/app/ui/pagination-number"
import NoResultFound from "../../no-result-found";
import { format } from "date-fns";
import { es } from 'date-fns/locale';

interface RateConsumptionResume {
  date: string;
  consumption: number;
  cost: number;
  first_value: number;
  last_value: number;
  date_first_value: string;
  date_last_value: string;
}

interface RateConsumptionResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: RateConsumptionResume[];
}

export default function ConsumptionTable({ consumptionTableReadings } : { consumptionTableReadings: RateConsumptionResponse }) {

  return (
    <>
      {
        consumptionTableReadings.count > 0 ? 
        (
          <>
            <Table>
            <TableHeader>
              <TableRow>
                  <TableHead className="text-sm font-medium text-muted-foreground">Fecha</TableHead>
                  <TableHead className="text-sm font-medium text-muted-foreground">Consumo</TableHead>
                  <TableHead className="text-sm font-medium text-muted-foreground">Costo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {
                consumptionTableReadings.results.map((reading) => (
                  <TableRow key={reading.date}>
                    <TableCell className="text-sm">{format(new Date(reading.date), "EEEE d 'de' MMMM", { locale: es})}</TableCell>
                    <TableCell className="text-sm">{reading.consumption.toFixed(2)} kWh</TableCell>
                    <TableCell className="text-sm">S/ {reading.cost}</TableCell>
                  </TableRow>
                ))
              }
            
            </TableBody>
            </Table>
            <PaginationNumberComponent count={consumptionTableReadings.count} itemsPerPage={5}/>
          </>
        ) : 
        (
          <NoResultFound/>
        )
      }
     
    </>
  )
}
