'use client'
import { Indicator, Status, Unit } from "@/app/type";
import { INDICATOR_CONVERTED, STATUS_TO_SPANISH, UNIT_CONVERTED } from "@/app/utils/formatter";
import { formattedDate, formattedDateTwo, formattedDateWithHour } from "@/app/utils/func";
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
  readings_highest: TopPeak,
  readings_lowest: TopPeak
}

interface Readings {
  count: number,
  next: string | null,
  previous: string | null,
  results: Peak[]
}



export default function Peaks({ readings, indicator, indicators }: { readings: Readings, indicator: 'CO2' | 'TEMPERATURE' | 'HUMIDITY', indicators: { unit: string, indicator: string }[] }) {

  const router = useRouter()

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 3

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
            { label: "Bueno", value: `< ${thresholds.co2.good} ppm`, color: "text-green-600", background: "bg-green-600" },
            {
              label: "Moderado",
              value: `${thresholds.co2.good} - ${thresholds.co2.moderate} ppm`,
              color: "text-yellow-600",
              background: "bg-yellow-600",
            },
            {
              label: "No saludable",
              value: `${thresholds.co2.moderate} - ${thresholds.co2.unhealthy} ppm`,
              color: "text-orange-600",
              background: "bg-orange-600",
            },
            { label: "Peligroso", value: `> ${thresholds.co2.unhealthy} ppm`, color: "text-red-600", background: "bg-red-600" },
          ]
          : []
      case "TEMPERATURE":
        return thresholds.temperature
          ? [
            { label: "Mínimo permitido", value: `${thresholds.temperature.min}°C`, color: "text-yellow-500", background: "bg-yellow-500" },
            { label: "Máximo permitido", value: `${thresholds.temperature.max}°C`, color: "text-red-600", background: "bg-red-500" },
          ]
          : []
      case "HUMIDITY":
        return thresholds.humidity
          ? [
            { label: "Mínimo permitido", value: `${thresholds.humidity.min}%`, color: "text-yellow-500", background: "bg-yellow-500" },
            { label: "Máximo permitido", value: `${thresholds.humidity.max}%`, color: "text-red-600", background: "bg-red-500" },
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
      <div className="grid grid-cols-3 mt-8 mx-4 mb-8 gap-8">
        {
          currentResults.map(reading => {

            const thresholdInfo = getThresholdInfo({ thresholds: reading.thresholds })
            return (
              <div key={reading.room_id} className="bg-gray-100 p-4 rounded-lg">
                <Card className="w-full min-h-[150px] cursor-pointer bg-gray-100" onClick={() => router.push(`/ocupacional/dashboard/analisis/picoshistoricos/tabla?room=${reading.room_id.toString()}`)}>
                  <CardHeader className="p-4">
                    <h2 className="text-xl font-bold text-foreground">{reading.room_name}</h2>
                    <p className="text-base text-muted-foreground mt-0">
                      Umbrales de{" "}
                      {currentIndicator === "CO2" ? "CO₂" : currentIndicator === "TEMPERATURE" ? "Temperatura" : "Humedad"}
                    </p>
                  </CardHeader>
                  <CardContent className="pt-4 px-4">
                    <div className="flex justify-between items-center">
                      {thresholdInfo?.map((threshold, idx) => (
                        <div className="flex items-center gap-2" key={threshold.value}>
                          <div className={`${threshold.background} w-4 h-4 rounded-full`}></div>
                          <div key={idx} className="flex flex-col gap-1 items-start pb-2 border-b border-border last:border-b-0">
                            <p className={`font-semibold text-sm ${threshold.color}`}>{threshold.label}</p>
                            <p className="text-sm text-foreground">{threshold.value} </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                <div className="flex flex-col gap-8">

                  <CardContent className="w-full flex justify-between gap-4 col-span-3 p-0">
                    <Card className="shadow-lg flex-1" key={formattedDateTwo(reading.readings_highest.created_at)}>
                      <CardHeader className="relative pb-0">
                        <div className={`absolute w-[80%] left-8 -top-2 px-4 py-2 rounded-lg text-white text-sm font-medium bg-red-500 shadow-lg text-balance text-center`}>

                          Nivel más alto
                        </div>
                      </CardHeader>
                      <CardContent className="pt-8">
                        {
                          <ul className="space-y-4" >
                            <li className="flex items-center space-x-3">
                              <Wind className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                              <span className="text-sm">{INDICATOR_CONVERTED[reading.readings_highest.indicator as Indicator]}: {reading.readings_highest.value} {UNIT_CONVERTED[reading.readings_highest.unit as Unit]}</span>
                            </li>
                            <li className="flex items-center space-x-3">
                              <Calendar className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                              <span className="text-sm">{formattedDateTwo(reading.readings_highest.created_at)}</span>
                            </li>
                            <li className="flex items-center space-x-3">
                              <Clock className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                              <span className="text-sm">{formattedDateWithHour(reading.readings_highest.created_at)}</span>
                            </li>
                          </ul>
                        }
                      </CardContent>
                    </Card>
                  </CardContent>
                  <CardContent className="w-full flex justify-between gap-4 col-span-3 p-0">
                    <Card className="shadow-lg flex-1" key={formattedDateTwo(reading.readings_lowest.created_at)}>
                      <CardHeader className="relative pb-0">
                        <div className={`absolute w-[80%] left-8 -top-2 px-4 py-2 rounded-lg text-white text-sm font-medium bg-yellow-500   shadow-lg text-balance text-center`}>
                          Nivel más bajo
                        </div>
                      </CardHeader>
                      <CardContent className="pt-8">
                        {
                          <ul className="space-y-4" >
                            <li className="flex items-center space-x-3">
                              <Wind className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                              <span className="text-sm">{INDICATOR_CONVERTED[reading.readings_lowest.indicator as Indicator]}: {reading.readings_lowest.value} {UNIT_CONVERTED[reading.readings_lowest.unit as Unit]}</span>
                            </li>
                            <li className="flex items-center space-x-3">
                              <Calendar className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                              <span className="text-sm">{formattedDateTwo(reading.readings_lowest.created_at)}</span>
                            </li>
                            <li className="flex items-center space-x-3">
                              <Clock className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                              <span className="text-sm">{formattedDateWithHour(reading.readings_lowest.created_at)}</span>
                            </li>
                          </ul>
                        }
                      </CardContent>
                    </Card>
                  </CardContent>
                </div>
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