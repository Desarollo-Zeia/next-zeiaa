"use client"

import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, ReferenceLine, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { useMemo } from "react"
import IndicatorToggle from "../../filters/indicators-toggle"
import { UNIT_INDICATOR_THRESHOLD } from "@/app/utils/threshold"

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

const generateColors = (numColors) => {
  const colors = new Set(); // Usamos un Set para evitar duplicados

  while (colors.size < numColors) {
    // Generar un color aleatorio en formato hexadecimal
    const color = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
    colors.add(color);
  }

  return Array.from(colors); // Convertir el Set a un Array
};  

export function ChartComponent({ readings, generalRoomData, indicator, unit }) {

  const { indicators_pollutants: indicators } = generalRoomData

  const chartData = useMemo(() => {
    const allHours = Array.from(new Set(Object.values(readings).flatMap(points => points.map(p => p.hour)))).sort()

    return allHours.map(hour => {
      const point = { hour, indicator, unit }
      Object.entries(readings).forEach(([date, points]) => {
        const dataPoint = points.find(p => p.hour === hour)
        point[date] = dataPoint ? dataPoint.value : null
      })
      return point
    })
  }, [readings, indicator, unit])

  const chartLines = useMemo(() => {
    const chartDataObject = Object.keys(chartData[0])
    const dates = chartDataObject.filter(ref => ref !== 'hour' && ref !== 'indicator' && ref !== 'unit')

    return dates.map(date => ({ key: date, stroke: generateColors(1)}))

  }, [chartData])

  let thresholdPointer

  if (indicator === 'TVOC') {
    thresholdPointer = unit
  } else {
    thresholdPointer = indicator
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Line Chart - Multiple</CardTitle>
            <CardDescription>January - June 2024</CardDescription>
          </div>
          <IndicatorToggle indicators={indicators} indicatorParam={indicator}/>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="hour"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              // ticks={horas.filter((_, index) => index % 2 === 0)}   
              // tickFormatter={(value) => value.slice(0, 3)}
            />
             <YAxis
                tickLine={false}
                axisLine={false}
                hide={true}
                tickMargin={8}
                dataKey="value"
                // tickFormatter={}
                domain={[0, UNIT_INDICATOR_THRESHOLD[thresholdPointer]?.top * 1.1]}
              />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            {
              chartLines.map(data => (
                <Line
                key={data.key}
                dataKey={data.key}
                type="monotone"
                stroke={data.stroke}
                strokeWidth={2}
                dot={false}
                />
              ))
            }
            <ReferenceLine y={UNIT_INDICATOR_THRESHOLD[thresholdPointer]?.bottom} stroke="yellow" strokeWidth={2} strokeDasharray="3 3" isFront={true}/>
            <ReferenceLine y={UNIT_INDICATOR_THRESHOLD[thresholdPointer]?.center} stroke="orange" strokeWidth={2} strokeDasharray="3 3" isFront={true}/>
            <ReferenceLine y={UNIT_INDICATOR_THRESHOLD[thresholdPointer]?.top} stroke="red" strokeWidth={2} strokeDasharray="3 3" isFront={true}/>
          </LineChart>
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
