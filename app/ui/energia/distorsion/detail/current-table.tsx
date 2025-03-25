import NoResultFound from "@/app/ui/no-result-found";
import PaginationNumberComponent from "@/app/ui/pagination-number";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export interface HarmonicDistortionResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: HarmonicDistortionRecord[];
}

export interface HarmonicDistortionRecord {
  id: number;
  date: string; // Fecha en formato ISO, se puede convertir a Date si es necesario
  time: string; // Hora en formato "HH:mm"
  current: Current;
  voltage: Voltage;
}

export interface Current {
  THDIa?: number;
  THDIb?: number;
  THDIc?: number;
}

export interface Voltage {
  THDUa?: number;
  THDUb?: number;
  THDUc?: number;
}

const dateFormat = (date: string) => {
  const dateObject = new Date(date)

    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    }

    const formattedDate = new Intl.DateTimeFormat("es-ES", options).format(
      dateObject
    );

    const finalDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)

    return finalDate
    
}


export default function CurrentTable({ readings } : { readings: HarmonicDistortionResponse }) {

  const indicators = Object.keys(readings?.results?.[0].current) 

  const voltageReadings = readings?.results.map((reading) => {

    return {
      date: dateFormat(reading.date),
      time: reading.time,
      ...reading.current
    }
  })

  return (
    <Table>
      {
        readings.count > 0 ? 
        (
          <>
            <TableHeader>
              <TableRow>
                  <TableHead className="text-sm font-medium text-muted-foreground">Fecha</TableHead>
                  <TableHead className="text-sm font-medium text-muted-foreground">Hora</TableHead>
                  {
                    indicators.map((indicator) => (
                      <TableHead key={indicator} className="text-sm font-medium text-muted-foreground">{indicator}</TableHead>
                    ))
                  }
              </TableRow>
            </TableHeader>
            <TableBody>
              {
                voltageReadings.map((reading, index) => (
                  <TableRow key={index}>
                  <TableCell className="text-sm">{reading.date}</TableCell>
                  <TableCell className="text-sm">{reading.time}</TableCell>
                  <TableCell className="text-sm">{reading.THDIa}</TableCell>
                  <TableCell className="text-sm">{reading.THDIb}</TableCell>
                  <TableCell className="text-sm">{reading.THDIc}</TableCell>
                </TableRow>
                ))
              }
            </TableBody>
          </>
        ) : 
        (
          <NoResultFound/>
        )
      }
      { readings.count > 0 && <PaginationNumberComponent count={readings.count} itemsPerPage={5}/>}
    </Table>
  )
}
