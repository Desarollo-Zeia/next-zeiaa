'use client'

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CalendarIcon, ClockIcon } from "lucide-react";
import ElectricUnitFilter from "../filters/unit-energy-filter";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";
import PaginationNumberComponent from "../../pagination-number";
import NoResultsFound from "../../no-result";
import { ELECTRIC_PARAMETERS } from "@/app/utils/formatter";


interface Readings {
    count: number;
    next: string | null;
    previous: string | null;
    results: Reading[];
  }
  
  interface Reading {
    created_at: string;
    device: Device;
    indicators: Indicators;
  }
  
  interface Device {
    id: number;
    name: string;
    dev_eui: string;
  }
  
  interface Indicators {
    id: number;
    values_per_channel: ValuePerChannel[];
    measurement_point_name: string;
  }
  
  interface ValuePerChannel {
    values: Values;
    channel: number;
  }
  
  type Values = Record<string, number>


  export default function MeasurementTable({ readings, category, indicator }: { readings: Readings, category?: string, indicator?: string }) {

    console.log(indicator)

    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [isPending, startTransition] = useTransition() 

    const indicatorsObject = readings.results?.[0]?.indicators?.values_per_channel[0].values

    const avaibleIndicators = [] as Array<string>

    for (const key in indicatorsObject) {
       if (indicatorsObject[key] !== null) {
        avaibleIndicators.push(key)
       } 
      }

  
    // Handle indicator selection
    const handleIndicatorSelect = (indicator: string) => {
      setSelectedIndicator(indicator)
      startTransition(() => {
        router.push(pathname + "?" + createQueryString("indicator", indicator), { scroll: false })
      })
    }

    const [selectedIndicator, setSelectedIndicator] = useState('')

    useEffect(() => {
      const params = new URLSearchParams(searchParams.toString())
        params.delete('last_by');
      
      if (avaibleIndicators.length > 0) {
        
        setSelectedIndicator(avaibleIndicators[0])
        params.delete('frequency');
        router.push(pathname + "?" + createQueryString("indicator", avaibleIndicators[0]), { scroll: false })
      }
    }, [category]);

    const createQueryString = useCallback(
      (name: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set(name, value)
        return params.toString()
      },
      [searchParams],
    )

    const formatDateTime = (dateTimeString: string) => {
        const date = new Date(dateTimeString)
      
        // Formatear la fecha como "Jueves, 12 de noviembre"
        const options: Intl.DateTimeFormatOptions = {
          weekday: "long",
          day: "numeric",
          month: "long"
        }
        let formattedDate = date.toLocaleDateString("es-ES", options)
      
        // Capitalizar la primera letra en caso de que no lo esté
        formattedDate =
          formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)
      
        // Formatear la hora como HH:MM
        const hours = date.getHours().toString().padStart(2, "0")
        const minutes = date.getMinutes().toString().padStart(2, "0")
        const formattedTime = `${hours}:${minutes}`
      
        return { date: formattedDate, time: formattedTime }
      }
  
    return (
      <Card className="flex-1">
        <CardHeader>
            <ElectricUnitFilter category={category}/>
        </CardHeader>
        <CardContent>
          {
             readings.count > 0 ? 
             (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4" />
                          Fecha
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center gap-2">
                          <ClockIcon className="h-4 w-4" />
                          Hora
                        </div>
                      </TableHead>
                      {/* {
                        isPending && 
                        <TableHead>
                          cargandoo...
                        </TableHead>
                      } */}
                      {avaibleIndicators?.map((indicator, index) => {
                        return (
                          <TableHead className={`cursor-pointer text-center ${selectedIndicator === indicator ? 'bg-[#00b0c7] opacity-70 text-white font-medium' : ''}`} 
                            key={index}       
                            onClick={() => handleIndicatorSelect(indicator)}
                            >
                              {
                                selectedIndicator === indicator && isPending ? 
                                (
                                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white">
                                    </div>
                                  </div>
                                ) : (
                                  ELECTRIC_PARAMETERS[indicator as keyof typeof ELECTRIC_PARAMETERS].parameter
                                )
                              }
                          </TableHead>
                        )
                      } )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {readings?.results?.map((reading, readingIndex) => {
                      const { date, time } = formatDateTime(reading.created_at)
      
                      // Obtenemos los valores de los indicadores para este reading
                      const indicatorValues = reading.indicators.values_per_channel[0].values

                      return (
                        <TableRow key={readingIndex}>
                          <TableCell className="text-nowrap">{date}</TableCell>
                          <TableCell>{time}</TableCell>
                          {avaibleIndicators?.map((header, headerIndex) => {
                            return indicatorValues[header] === null ? <TableCell key={headerIndex}>-</TableCell> : (
                              <TableCell className={`cursor-pointer text-center ${selectedIndicator === header ? 'bg-[#00b0c7] opacity-70 text-white font-medium' : ''}`} key={headerIndex}>{indicatorValues[header].toFixed(2)}</TableCell>
                            )
                          })}
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
             ) : 
             (
              <NoResultsFound/>
             )
          }
          
        </CardContent>
        { readings.count > 0 && <PaginationNumberComponent count={readings.count} itemsPerPage={10}/>}
        
      </Card>
    )
  }
