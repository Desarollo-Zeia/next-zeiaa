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
import { useCallback, useState } from "react"
import IndicatorToggle from "../../filters/indicators-toggle"
import { UNIT_INDICATOR_THRESHOLD, UNIT_INDICATOR_THRESHOLD_AMBIENTAL_CHARTJS_EXLUSIVE_DICTIONARY_IM_SORRY_FOR_THE_NEXT_DEVELOPER } from "@/app/utils/threshold"
import 'chart.js/auto';
import { Line } from 'react-chartjs-2'
import { Chart, Colors } from 'chart.js/auto'
import { format, getTime, parse } from "date-fns"
import 'chartjs-adapter-date-fns';
import annotationPlugin from 'chartjs-plugin-annotation';
import { UNIT_CONVERTED } from "@/app/utils/formatter"
import { es } from 'date-fns/locale';
import { capitalizeFirstLetter, formattedDate } from "@/app/utils/func"
import { Button } from "@/components/ui/button"
import { GeneralRoomData, Indicator, Measurement, Unit } from "@/app/type"
import { TimeRangeSlider } from "@/app/ui/filters/time-range-slider"
import { usePathname } from "next/navigation"
import zoomPlugin from "chartjs-plugin-zoom";
import NoResultsFound from "../../no-result"


Chart.register(Colors, annotationPlugin, zoomPlugin)


type Readings = Record<string, Omit<Measurement, 'date'>[]>;

type ChartComponentProps = {
  readings: Readings,
  generalRoomData: GeneralRoomData,
  indicator: Indicator,
  unit: Unit,
  start: string,
  end: string
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

function hours(readings: Readings) {

  const dataRecopilationFromAllDays = []
  for (const i in readings) {
    const data = []
    for (let e = 0; e < Object.keys(readings[i]).length; e++) {
      if (readings[i][e]?.hour) {
        const aaa = parse(readings[i][e].hour, 'HH:mm', new Date())
        const milliseconds = getTime(aaa);
        data.push({
          x: milliseconds,
          y: readings[i][e].value
        })
      }
    }
    dataRecopilationFromAllDays.push({
      data,
      date: i,
      tension: 0.8,
      pointRadius: 0,
      label: i
    })
  }

  return dataRecopilationFromAllDays
}

function days(readings: Readings) {
  const dataRecopilationFromAllDays = []
  for (const i in readings) {
    for (let e = 0; e < Object.keys(readings[i]).length; e++) {
      if (readings[i][e]?.hour) {
        const dateTemplate = `${i} ${readings[i][e].hour}`
        const date = parse(dateTemplate, 'yyyy-MM-dd HH:mm', new Date())
        const milliseconds = getTime(date);
        dataRecopilationFromAllDays.push({
          x: milliseconds,
          y: readings[i][e].value
        })
      }
    }
  }

  return [
    {
      data: dataRecopilationFromAllDays,
      tension: 0.8,
      pointRadius: 0,
      label: 'Tendencia',
    }
  ]
}
// eslint-disable-next-line @next/next/no-assign-module-variable 
export function ChartComponent({ readings, generalRoomData, indicator, unit, start, end }: ChartComponentProps) {

  // const [isPending, startTransition] = useTransition()
  const [newReadings, setNewReadings] = useState<Readings>({})
  const [toggleChart, setToggleChart] = useState<boolean>(false)

  const dates = Object.keys(readings)

  const chartRenderReadings = Object.keys(newReadings).length > 0 ? newReadings : readings

  const handleSelectedDate = useCallback((date: string) => {
    setNewReadings(prev => {
      if (Object.hasOwn(prev, date)) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [date]: _, ...rest } = prev
        return rest
      }

      return { ...prev, [date]: readings[date] }
    })

  }, [readings])

  const { indicators_pollutants: indicators } = generalRoomData
  const pathname = usePathname()
  // eslint-disable-next-line @next/next/no-assign-module-variable
  const module = pathname.split('/')[1]

  let thresholdPointer
  let thresholds: number[] = []

  if (indicator === 'TVOC') {
    thresholdPointer = unit as Extract<Unit, 'PPB' | 'ICA'>
  } else {
    thresholdPointer = indicator
  }

  if (module === 'ocupacional') {
    thresholds = Object.values(UNIT_INDICATOR_THRESHOLD[thresholdPointer] || {}).filter(Boolean);
  }

  if (module === 'ambiental') {
    thresholds = Object.values(UNIT_INDICATOR_THRESHOLD_AMBIENTAL_CHARTJS_EXLUSIVE_DICTIONARY_IM_SORRY_FOR_THE_NEXT_DEVELOPER[thresholdPointer] || {}).filter(Boolean);
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-end gap-4">
          {!toggleChart ? <TimeRangeSlider initialStart={start} initialEnd={end} /> : ''}
          <IndicatorToggle indicators={indicators} indicatorParam={indicator} />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <CardTitle className="text-2xl">Gráfica de datos</CardTitle>
            <p className="text-sm">Valores en tiempo real</p>
            <br />
            <div className="w-full">
              <div className="text-xs font-medium mb-2">Umbrales:</div>
              <div className="flex flex-wrap gap-4">
                {thresholds?.map((thresholdValue, index) => {
                  const color = (() => {
                    const total = thresholds.length;

                    if (total === 1) return '#ff0000'; // Único umbral rojo
                    if (total === 2) return index === 0 ? '#ffd700' : '#ff0000'; // Amarillo/Rojo
                    return ['#ffd700', '#ffa500', '#ff0000'][index]; // Amarillo/Naranja/Rojo para 3
                  })()

                  return (
                    <div key={index} className="flex flex-col justify-center items-center gap-2">
                      <div className="flex gap-2">
                        <span
                          style={{
                            color,
                            fontWeight: '8px',
                            display: 'block'

                          }}>--</span> <p> {index === 0 ? 'Moderado' : index === 1 ? 'Insalubre' : 'Peligroso'} </p>
                      </div>
                      <div className="flex gap-2">
                        <span
                          style={{
                            color,
                            fontWeight: '8px',

                          }}>--</span>
                        <span className="font-normal">
                          {thresholdValue} {UNIT_CONVERTED[unit]}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <Button className="absolute right-0 mt-8 mr-10" onClick={() => setToggleChart((prev: boolean) => !prev)}>{toggleChart ? 'Mostrar en horas' : 'Mostrar en días'}</Button>
        </div>
      </CardHeader>
      <CardContent className="relative">
        {
          Object.keys(readings).length > 0 ? (
            <ChartContainer config={chartConfig}>
              <Line
                data={{ datasets: toggleChart ? days(chartRenderReadings) : hours(chartRenderReadings) }}
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
                        callback: function (val: any) { // eslint-disable-line @typescript-eslint/no-explicit-any 
                          // Hide every 2nd tick label
                          return `${val} ${UNIT_CONVERTED[unit]}`
                        },
                      }
                    }
                  },
                  plugins: {
                    colors: {
                      forceOverride: true
                    },
                    legend: {
                      display: false,
                      position: "bottom",
                      fullSize: false,       // Si quieres que no ocupe todo el ancho
                      rtl: false,

                      labels: {
                        // @ts-expect-error - Ignorar errores de tipo para esta función
                        generateLabels: (chart: Chart) => {
                          const datasets = chart.data.datasets;

                          return datasets.map((dataset, index) => {
                            // Asegurar valores con defaults
                            const borderColor = dataset.borderColor?.toString() || '#000000';
                            const backgroundColor = dataset.backgroundColor?.toString() || '#CCCCCC';
                            const borderWidth = dataset.borderWidth || 1;

                            return {
                              // @ts-expect-error - Ignorar errores de tipo para esta función
                              text: toggleChart ? dataset.label : formattedDate(dataset.label),
                              fillStyle: backgroundColor,
                              strokeStyle: borderColor,
                              color: backgroundColor,
                              // hidden: chart.isDatasetVisible(index),
                              lineWidth: borderWidth,
                              datasetIndex: index,
                              fontColor: !chart.isDatasetVisible(index) ? '#cccfcc' : '#616161'
                            };
                          });
                        }
                      },
                      onClick: (e, legendItem, legend) => {
                        const chart = legend.chart;
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const clickedIndex = legendItem.datasetIndex as number | undefined | any
                        const allVisible = chart.data.datasets.every(
                          (_, index) => chart.isDatasetVisible(index)
                        );

                        if (allVisible) {
                          // Si todos están visibles, ocultar todos excepto el clickeado
                          chart.data.datasets.forEach((_, index) => {
                            chart.setDatasetVisibility(index, index === clickedIndex);
                          });
                        } else {
                          // Si no, alternar solo el elemento clickeado
                          const isVisible = chart.isDatasetVisible(clickedIndex);
                          chart.setDatasetVisibility(clickedIndex, !isVisible);

                          // Si se está mostrando el último elemento visible, volver a mostrar todos
                          const visibleCount = chart.data.datasets.filter(
                            (_, index) => chart.isDatasetVisible(index)
                          ).length;

                          if (visibleCount === 0) {
                            chart.data.datasets.forEach((_, index) => {
                              chart.setDatasetVisibility(index, true);
                            });
                          }
                        }

                        chart.update();
                      }
                    },
                    annotation: {
                      annotations: {
                        line1: {
                          type: 'line',
                          yMin: UNIT_INDICATOR_THRESHOLD_AMBIENTAL_CHARTJS_EXLUSIVE_DICTIONARY_IM_SORRY_FOR_THE_NEXT_DEVELOPER[thresholdPointer]?.bottom,
                          yMax: UNIT_INDICATOR_THRESHOLD_AMBIENTAL_CHARTJS_EXLUSIVE_DICTIONARY_IM_SORRY_FOR_THE_NEXT_DEVELOPER[thresholdPointer]?.bottom,
                          borderColor: '#d9c308',
                          borderWidth: 2,
                          borderDash: [5, 5],
                          display: UNIT_INDICATOR_THRESHOLD_AMBIENTAL_CHARTJS_EXLUSIVE_DICTIONARY_IM_SORRY_FOR_THE_NEXT_DEVELOPER[thresholdPointer]?.bottom !== 0,
                          // label: {
                          //   display: true,
                          //   content: [`${UNIT_INDICATOR_THRESHOLD[thresholdPointer].bottom} ${UNIT_CONVERTED[thresholdPointer]}`],
                          //   color: 'white',
                          //   backgroundColor: '#d9c308'
                          // }
                        },
                        line2: {
                          type: 'line',
                          yMin: UNIT_INDICATOR_THRESHOLD_AMBIENTAL_CHARTJS_EXLUSIVE_DICTIONARY_IM_SORRY_FOR_THE_NEXT_DEVELOPER[thresholdPointer]?.center,
                          yMax: UNIT_INDICATOR_THRESHOLD_AMBIENTAL_CHARTJS_EXLUSIVE_DICTIONARY_IM_SORRY_FOR_THE_NEXT_DEVELOPER[thresholdPointer]?.center,
                          borderColor: 'orange',
                          borderWidth: 2,
                          borderDash: [5, 5],
                          display: UNIT_INDICATOR_THRESHOLD_AMBIENTAL_CHARTJS_EXLUSIVE_DICTIONARY_IM_SORRY_FOR_THE_NEXT_DEVELOPER[thresholdPointer]?.center !== 0,
                          // label: {
                          //   display: true,
                          //   content: [`${UNIT_INDICATOR_THRESHOLD[thresholdPointer].center} ${UNIT_CONVERTED[thresholdPointer]}`],
                          //   color: 'white',
                          //   backgroundColor: 'orange'
                          // }
                        },
                        line3: {
                          type: 'line',
                          yMin: UNIT_INDICATOR_THRESHOLD_AMBIENTAL_CHARTJS_EXLUSIVE_DICTIONARY_IM_SORRY_FOR_THE_NEXT_DEVELOPER[thresholdPointer]?.top * 1.05,
                          yMax: UNIT_INDICATOR_THRESHOLD_AMBIENTAL_CHARTJS_EXLUSIVE_DICTIONARY_IM_SORRY_FOR_THE_NEXT_DEVELOPER[thresholdPointer]?.top * 1.05,
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
                          const label = ctx.dataset.label as string
                          if (toggleChart) {
                            const date = parse(ctx.label, 'MMM dd, yyyy, h:mm:ss a', new Date())
                            const formattedDate = format(date, 'EEEE, dd \'de\' MMMM \'de\' yyyy', { locale: es });
                            return capitalizeFirstLetter(formattedDate)
                          }

                          const date = parse(label, 'yyyy-MM-dd', new Date())
                          const formattedDate = format(date, 'EEEE, dd \'de\' MMMM \'de\' yyyy', { locale: es })
                          return `${capitalizeFirstLetter(formattedDate)}: ${ctx.formattedValue} ${UNIT_CONVERTED[unit]}`
                        }
                      }
                    },
                    zoom: {
                      pan: {
                        enabled: true,
                        mode: "x", // "x", "y" o "xy"
                      },
                      zoom: {
                        wheel: {
                          enabled: true,
                          speed: 0.1,
                        },
                        pinch: {
                          enabled: true,
                        },
                        mode: "x",
                      },
                      limits: {
                        y: { min: 'original', max: 'original' },
                        x: { min: 'original', max: 'original' }
                      }

                    },
                  }
                }}
              />
            </ChartContainer>
          ) : (
            <NoResultsFound message="No se encontraron resultados" />
          )
        }
        {/* {isPending && <div className="h-full w-full text-xl font-bold">Cargando...</div>} */}
        3
      </CardContent>
      <div>

        {
          Object.keys(readings).length > 0 && !toggleChart && (
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-foreground">Leyenda</h3>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setNewReadings({})}
                    className="bg-slate-400 hover:bg-slate-500 text-white"
                  >
                    Mostrar todos
                  </Button>
                </div>

                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>Selecciona los días que deseas comparar.</p>
                  <p>También puedes cancelar la selección haciendo nuevamente en la fecha.</p>
                </div>

                <div className="space-y-2">
                  {dates.map((date) => {
                    const formatted = parse(date, "yyyy-MM-dd", new Date())
                    const newDate = capitalizeFirstLetter(format(formatted, "EEEE d 'de' MMMM", { locale: es }))
                    return (
                      <button
                        key={date}
                        onClick={() => handleSelectedDate(date)}
                        className={`w-full text-left px-3 py-2 rounded-md transition-colors ${Object.hasOwn(newReadings, date) ? "bg-[#00b0c7] text-white hover:bg-[#00b0c7]" : "text-muted-foreground"
                          }`}
                      >
                        <span className="flex items-center gap-2">
                          {newDate}
                        </span>
                      </button>
                    )
                  }

                  )}
                </div>
              </div>
            </CardContent>
          )
        }
      </div>
    </Card>
  )
}
