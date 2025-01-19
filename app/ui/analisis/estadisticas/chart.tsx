"use client"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
} from "@/components/ui/chart"
import { useState } from "react"
import IndicatorToggle from "../../filters/indicators-toggle"
import { UNIT_INDICATOR_THRESHOLD } from "@/app/utils/threshold"
import 'chart.js/auto';
import { Line } from 'react-chartjs-2'
import { Chart, Colors } from 'chart.js/auto'
import { format, getTime, parse } from "date-fns"
import 'chartjs-adapter-date-fns';
import annotationPlugin from 'chartjs-plugin-annotation';
import { UNIT_CONVERTED } from "@/app/utils/formatter"
import { es } from 'date-fns/locale';
import { capitalizeFirstLetter } from "@/app/utils/func"
import { Button } from "@/components/ui/button"
import { GeneralRoomData, Indicator, Measurement, Unit } from "@/app/type"

Chart.register(Colors, annotationPlugin)


type Readings = Record<string, Omit<Measurement, 'date'>>[];

type ChartComponentProps = {
  readings: Readings,
  generalRoomData: GeneralRoomData,
  indicator: Indicator,
  unit: Unit
}

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

function hours (readings : Readings) {
    
  const dataRecopilationFromAllDays = []  
  for (const i in readings) {
    const data = []
    for (let e = 0; e < Object.keys(readings[i]).length; e++) {
      const aaa = parse(readings[i][e].hour, 'HH:mm', new Date())
      const milliseconds = getTime(aaa);
      data.push({
        x: milliseconds,
        y: readings[i][e].value
      })
    }
    dataRecopilationFromAllDays.push({
      data,
      date: i,
      tension: 0.8,
      pointRadius: 0,
    })
  }

  return dataRecopilationFromAllDays
  }

function days (readings : Readings) {
const dataRecopilationFromAllDays = []
for (const i in readings) {
  for (let e = 0; e < Object.keys(readings[i]).length; e++) {
    const dateTemplate = `${i} ${readings[i][e].hour}`
    const date = parse(dateTemplate, 'yyyy-MM-dd HH:mm', new Date())
    const milliseconds = getTime(date);
    dataRecopilationFromAllDays.push({
      x: milliseconds,
      y: readings[i][e].value
    })
  }
}

return [
  {
    data: dataRecopilationFromAllDays,
    tension: 0.2,
    pointRadius: 0,
    label: 'Tendencia',
     }
    ]
  }


export function ChartComponent({ readings, generalRoomData, indicator, unit } : ChartComponentProps) {

  const [toggleChart, setToggleChart] = useState(true)

  const { indicators_pollutants: indicators } = generalRoomData


  let thresholdPointer

  if (indicator === 'TVOC') {
    thresholdPointer = unit as Extract<Unit, 'PPB' | 'ICA'>
  } else {
    thresholdPointer = indicator
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
        
          <div className="flex flex-col">
            <CardTitle>Estadísticas</CardTitle>
            <br/>
            <div className="w-full">
              <div className="text-xs font-medium mb-2">Umbrales:</div>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <div className="text-yellow-500 font-bold">---</div>
                  <span className="font-normal">{UNIT_INDICATOR_THRESHOLD[thresholdPointer]?.bottom} {UNIT_CONVERTED[unit]}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-orange-500 font-bold">---</div>
                  <span className="font-normal">{UNIT_INDICATOR_THRESHOLD[thresholdPointer]?.center} {UNIT_CONVERTED[unit]}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-red-500 font-bold">---</div>
                  <span className="font-normal">{UNIT_INDICATOR_THRESHOLD[thresholdPointer]?.top} {UNIT_CONVERTED[unit]}</span>
                </div>
              </div>
            </div>
          </div>
          <IndicatorToggle indicators={indicators} indicatorParam={indicator}/>
        </div>
      </CardHeader>
      <CardContent className="relative">
        <Button className="absolute right-0 mt-8 mr-10" onClick={() => setToggleChart(prev => !prev)}>Cambiar formato</Button>

        <ChartContainer config={chartConfig}>
          
          <Line
            data={{ datasets: toggleChart ?  days(readings) : hours(readings) }}
            options={{
                animation: false,
                parsing: false,
                responsive: true,
                interaction: {
                  mode: 'nearest',
                  axis: 'x',
                  intersect: false
                },
                scales: {
                  x: {
                    type: 'time',
                    time: {
                      displayFormats: {
                        hour: 'HH:mm'
                      },
                      unit: toggleChart ? 'day' : 'hour'
                    },
                    alignToPixels: true,
                    grid: {
                      display: false,
                      tickLength: 50
                    },
                    ticks: {
                      callback: (ctx) => {
                        if (toggleChart) {
                          const date = new Date(ctx)
                          const formattedDate = format(date, 'PP', { locale: es })
                          return `${formattedDate.split(' ')[0]} ${formattedDate.split(' ')[1]} `
                        }

                        const date = new Date(ctx)
                        const formattedDate = format(date, 'p', { locale: es })
                        return formattedDate


                      } 
                    } 
          
                  },
                  y: {
                    grid: {
                      display: false
                    },
                    ticks: {
                      display: false
                    }
                  }
                },
                plugins: {
                  colors: {
                    forceOverride: true
                  },
                  legend: {
                    display: false
                  },
                  annotation: {
                    annotations: {
                      line1: {
                        type: 'line',
                        yMin: UNIT_INDICATOR_THRESHOLD[thresholdPointer].bottom,
                        yMax: UNIT_INDICATOR_THRESHOLD[thresholdPointer].bottom,
                        borderColor: '#d9c308',
                        borderWidth: 2,
                        borderDash: [5, 5],
                        // label: {
                        //   display: true,
                        //   content: [`${UNIT_INDICATOR_THRESHOLD[thresholdPointer].bottom} ${UNIT_CONVERTED[thresholdPointer]}`],
                        //   color: 'white',
                        //   backgroundColor: '#d9c308'
                        // }
                      },
                      line2: {
                        type: 'line',
                        yMin: UNIT_INDICATOR_THRESHOLD[thresholdPointer].center,
                        yMax: UNIT_INDICATOR_THRESHOLD[thresholdPointer].center,
                        borderColor: 'orange',
                        borderWidth: 2,
                        borderDash: [5, 5],
                        // label: {
                        //   display: true,
                        //   content: [`${UNIT_INDICATOR_THRESHOLD[thresholdPointer].center} ${UNIT_CONVERTED[thresholdPointer]}`],
                        //   color: 'white',
                        //   backgroundColor: 'orange'
                        // }
                      },
                      line3: {
                        type: 'line',
                        yMin: UNIT_INDICATOR_THRESHOLD[thresholdPointer].top * 1.05,
                        yMax: UNIT_INDICATOR_THRESHOLD[thresholdPointer].top * 1.05,
                        borderColor: 'red',
                        borderWidth: 2,
                        borderDash: [5, 5],
                        // label: {
                        //   display: true,
                        //   content: [`${UNIT_INDICATOR_THRESHOLD[thresholdPointer].top} ${UNIT_CONVERTED[thresholdPointer]}`],
                        //   color: 'white',
                        //   backgroundColor: 'red'
                        // }
                      }
                    }
                  },
                  decimation: {
                    enabled: true,
                    algorithm: 'lttb',
                    samples: 100,
                    threshold: 5
                  },
                  tooltip: {
                    callbacks: {
                      title: (ctx) => {
                        if (toggleChart) {
                          return 'Reporte diario'
                        }
                        return ctx[0].label.split(',')[2]
                      },
                      label: (ctx) => {
                        if (toggleChart) {
                          const date = parse(ctx.label, 'MMM dd, yyyy, h:mm:ss a', new Date())
                          const formattedDate = format(date, 'EEEE, dd \'de\' MMMM \'de\' yyyy', { locale: es });
                          return capitalizeFirstLetter(formattedDate) 
                        }
                        const date = parse(ctx.dataset.date, 'MMM dd, yyyy, h:mm:ss a', new Date())
                        const formattedDate = format(date, 'EEEE, dd \'de\' MMMM \'de\' yyyy', { locale: es })
                        return `${capitalizeFirstLetter(formattedDate)}: ${ctx.formattedValue} ${UNIT_CONVERTED[unit]}`
                      }
                    }
                  }
                }
            }}
          />
        </ChartContainer>
      </CardContent>
      {/* <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Showing total visitors for the last 6 months
            </div>
          </div>
        </div>
      </CardFooter> */}
    </Card>
  )
}
