'use client'
import { Indicator, Status, Unit } from "@/app/type";
import { INDICATOR_CONVERTED, STATUS_TO_SPANISH, UNIT_CONVERTED } from "@/app/utils/formatter";
import { formattedDate } from "@/app/utils/func";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Calendar, CalendarRange, Clock, Wind, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Thresholds = {
  co2: {
    good: number,
    moderate: number,
    unhealthy: number,
    dangerous: number
  },
  temperature: {
    min: number,
    max: number
  },
  humidity: {
    min: number,
    max: number
  }
}

type TopPeak = {
  created_at: string,
  indicator: string,
  unit: string,
  value: number,
  status: string,
  date: string,
  hour: string
}

interface Peak {
  room_id: number,
  room_name: string,
  thresholds: Thresholds,
  readings_top_3: TopPeak[]
}

interface Readings {
  count: number,
  next: string | null,
  previous: string | null,
  results: Peak[]
}



export default function Peaks({ readings, indicator, indicators }: { readings: Readings, indicator: 'CO2' | 'TEMPERATURE' | 'HUMIDITY', indicators: { unit: string, indicator: string }[] }) {

  const router = useRouter()



  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const currentIndicator = indicator ?? indicators[0].indicator

  // Calcular paginación
  const totalPages = Math.ceil((readings?.results?.length || 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentResults = readings?.results?.slice(startIndex, endIndex) || [];

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const getThresholdInfo = ({ thresholds }: { thresholds: Thresholds }) => {
    switch (currentIndicator) {
      case "CO2":
        return thresholds.co2
          ? [
            { label: "Bueno", value: `< ${thresholds.co2.good} ppm`, color: "text-green-600" },
            {
              label: "Moderado",
              value: `${thresholds.co2.good} - ${thresholds.co2.moderate} ppm`,
              color: "text-yellow-600",
            },
            {
              label: "No saludable",
              value: `${thresholds.co2.moderate} - ${thresholds.co2.unhealthy} ppm`,
              color: "text-orange-600",
            },
            { label: "Peligroso", value: `> ${thresholds.co2.unhealthy} ppm`, color: "text-red-600" },
          ]
          : []
      case "TEMPERATURE":
        return thresholds.temperature
          ? [
            { label: "Mínimo", value: `${thresholds.temperature.min}°C`, color: "text-blue-600" },
            { label: "Máximo", value: `${thresholds.temperature.max}°C`, color: "text-red-600" },
          ]
          : []
      case "HUMIDITY":
        return thresholds.humidity
          ? [
            { label: "Mínimo", value: `${thresholds.humidity.min}%`, color: "text-amber-600" },
            { label: "Máximo", value: `${thresholds.humidity.max}%`, color: "text-blue-600" },
          ]
          : []
    }
  }


  const colorByLever = {
    GOOD: "bg-green-600",
    UNHEALTHY: "bg-orange-600",
    DANGEROUS: "bg-red-600",
    CRITICAL: "bg-red-600",
    MODERATE: "bg-yellow-600",
    MIN: "bg-green-600",
    MAX: "bg-red-600",
  }

  const colorShadowByLever = {
    GOOD: "shadow-green-600",
    UNHEALTHY: "shadow-orange-600",
    DANGEROUS: "shadow-red-600",
    CRITICAL: "shadow-red-600",
    MODERATE: "shadow-yellow-600",
    MIN: "shadow-green-600",
    MAX: "shadow-red-600",
  }

  return (
    <>
      <div>
        {
          currentResults.map(reading => {
            let arr = [...reading.readings_top_3]
            while (arr.length < 3) {
              arr.push(null as any)
            }

            const thresholdInfo = getThresholdInfo({ thresholds: reading.thresholds })
            return (
              <div key={reading.room_id} className="grid grid-cols-4 mt-8 mx-4 mb-8 gap-4">
                <Card className="w-full min-h-[150px] shadow-lg cursor-pointer" onClick={() => router.push(`/ocupacional/dashboard/analisis/picoshistoricos/tabla?room=${reading.room_id.toString()}`)}>
                  <CardHeader className="p-4 bg-[#f9fafb]">
                    <h2 className="text-base font-bold text-foreground">{reading.room_name}</h2>
                    <p className="text-xs text-muted-foreground mt-0">
                      Umbrales de{" "}
                      {currentIndicator === "CO2" ? "CO₂" : currentIndicator === "TEMPERATURE" ? "Temperatura" : "Humedad"}
                    </p>
                  </CardHeader>
                  <CardContent className="pt-4 px-4">
                    <ul className="space-y-3">
                      {thresholdInfo?.map((threshold, idx) => (
                        <li key={idx} className="flex flex-col space-y-0.5 pb-2 border-b border-border last:border-b-0">
                          <span className={`font-semibold text-sm ${threshold.color}`}>{threshold.label}</span>
                          <span className="text-sm text-foreground">{threshold.value}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                <CardContent className="w-full flex justify-between gap-4 col-span-3 p-0">
                  {
                    arr.map(reading => {

                      if (reading === null) {
                        return (
                          <Card className="shadow-lg bg-gray-50 border border-gray-200 p-4 flex flex-col items-center justify-center space-y-1 text-center flex-1 min-h-[150px]">
                            <CalendarRange className="h-6 w-6 text-indigo-500" aria-hidden="true" />

                            <p className="text-sm font-semibold text-gray-700">
                              Extienda las fechas
                            </p>
                            <p className="text-xs text-gray-500 max-w-xs">
                              Ajuste el selector para cargar el contenido.
                            </p>
                          </Card>

                        )
                      }

                      return (
                        <Card className="shadow-lg flex-1" key={reading.date}>
                          <CardHeader className="relative pb-0">
                            <div className={`absolute w-[80%] left-8 -top-2 px-4 py-2 rounded-lg text-white text-sm font-medium ${colorByLever[reading.status as Status] ?? 'bg-[#00b0c7]'} shadow-lg text-balance text-center`}>

                              Nivel más alto {STATUS_TO_SPANISH[reading.status as Status] ? `(${STATUS_TO_SPANISH[reading.status as Status]})` : ''}
                            </div>
                          </CardHeader>
                          <CardContent className="pt-8">
                            {
                              <ul className="space-y-4" >
                                <li className="flex items-center space-x-3">
                                  <Wind className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                                  <span className="text-sm">{INDICATOR_CONVERTED[reading.indicator as Indicator]}: {reading.value} {UNIT_CONVERTED[reading.unit as Unit]}</span>
                                </li>
                                <li className="flex items-center space-x-3">
                                  <Calendar className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                                  <span className="text-sm">{formattedDate(reading.date)}</span>
                                </li>
                                <li className="flex items-center space-x-3">
                                  <Clock className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                                  <span className="text-sm">{reading.hour.toLowerCase()}</span>
                                </li>
                              </ul>
                            }
                          </CardContent>
                        </Card>
                      )
                    })
                  }
                </CardContent>

              </div>
            )
          })
        }

      </div>

      {/* Controles de paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mb-8">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Anterior</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              Página <span className="font-semibold">{currentPage}</span> de <span className="font-semibold">{totalPages}</span>
            </span>
          </div>

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span className="text-sm font-medium">Siguiente</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </>
  )
}