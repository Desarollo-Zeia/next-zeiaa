'use client'
import IndicatorToggle from "../filters/indicators-toggle";
import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, ReferenceLine, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
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
}

  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "#00b0c7",
    },
    value: {
      label: "CO2",
    }
    
  } satisfies ChartConfig
  

export default function ChartComponent({ results, generalRoomData} : ChartComponentProps) {

  const { indicators_pollutants: indicators } = generalRoomData

  return (
    <Card className="w-full max-w-4xl mx-auto">
        <IndicatorToggle indicators={indicators}/>
        <CardHeader>
            <CardTitle>Estadísticas</CardTitle>
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
                    domain={[0, 2000]}
                  />
                    
                <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel/>}
                />
                <ReferenceLine y={1000} stroke="red" strokeWidth={2} strokeDasharray="3 3" isFront={true}/>
                <ReferenceLine y={800} stroke="orange" strokeWidth={2} strokeDasharray="3 3" isFront={true}/>
                <Line
                  dataKey="value" 
                  type="natural"
                  stroke="var(--color-desktop)"
                  strokeWidth={2}
                  dot={false}
                  
                />
                {/* <Legend verticalAlign="bottom" height={36}/> */}
            </LineChart>
            </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="flex gap-2 font-medium leading-none">
            Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="leading-none text-muted-foreground">
            Showing total visitors for the last 6 months
            </div>
          
        </CardFooter>
    </Card>
  )
}
