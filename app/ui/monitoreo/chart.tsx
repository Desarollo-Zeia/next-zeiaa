'use client'
import IndicatorToggle from "../filters/indicators-toggle";
import { CartesianGrid, Line, LineChart, ReferenceLine, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardHeader, 
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { UNIT_CONVERTED } from "@/app/utils/formatter";
import { UNIT_INDICATOR_THRESHOLD } from "@/app/utils/threshold";
import { Indicator, Unit } from "@/app/type";

interface IndicatorStructure {
  indicator: string,
  value: string,
  unit: string,
  status: string,
  hours: string,
  date: string
}

interface IndicatorToogle {
  indicator: string,
  unit: string
}

interface RoomDataStructure {
  id: number,
  name: string,
  status: string,
  headquarter: {
    id: number,
    name: string
  }
  indicators_activated: IndicatorToogle[],
  indicators_pollutants: IndicatorToogle[],
  is_activated: boolean
}

interface ChartComponentProps {
  results: IndicatorStructure[]
  generalRoomData: RoomDataStructure
  indicator: Indicator,
  unit: Unit
}

  const chartConfig = {
    desktop: {
      color: "#00b0c7",
    },
    
  } satisfies ChartConfig
  

export default function ChartComponent({ results, generalRoomData, indicator, unit } : ChartComponentProps) {

  const { indicators_pollutants: indicators } = generalRoomData

  let thresholdPointer

  if (indicator === 'TVOC') {
    thresholdPointer = unit as Extract<Unit, 'PPB' | 'ICA'>
  } else {
    thresholdPointer = indicator
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
        <IndicatorToggle indicators={indicators} indicatorParam={indicator}/>
        <CardHeader>
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
        </CardHeader>
        <CardContent>
            <ChartContainer config={chartConfig}>
            <LineChart
                accessibilityLayer
                data={results}
                margin={{
                left: 12,
                right: 12,
                }}
            >
                <CartesianGrid vertical={false} />
                <XAxis
                dataKey="hours"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                // tickFormatter={}
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
                <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel/>}
                />
                <ReferenceLine y={UNIT_INDICATOR_THRESHOLD[thresholdPointer]?.bottom} stroke="yellow" strokeWidth={2} strokeDasharray="3 3" isFront={true}/>
                <ReferenceLine y={UNIT_INDICATOR_THRESHOLD[thresholdPointer]?.center} stroke="orange" strokeWidth={2} strokeDasharray="3 3" isFront={true}/>
                <ReferenceLine y={UNIT_INDICATOR_THRESHOLD[thresholdPointer]?.top} stroke="red" strokeWidth={2} strokeDasharray="3 3" isFront={true}/>
                <Line
                  dataKey="value" 
                  type="natural"
                  stroke="var(--color-desktop)"
                  strokeWidth={2}
                  dot={false}
                />
            </LineChart>
            </ChartContainer>
        </CardContent>
      
    </Card>
  )
}
