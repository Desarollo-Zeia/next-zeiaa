'use client'
import IndicatorToggle from "../filters/indicators-toggle";
import { CartesianGrid, Line, LineChart, ReferenceLine, XAxis, YAxis } from "recharts"
import {
  Card,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { STATUS_COLOR, STATUS_COLOR_THRESHOLD, STATUS_TO_SPANISH, UNIT_CONVERTED } from "@/app/utils/formatter";
// import { UNIT_INDICATOR_THRESHOLD, UNIT_INDICATOR_THRESHOLD_AMBIENTAL } from "@/app/utils/threshold";
import { Indicator, Unit } from "@/app/type";
// import { usePathname } from "next/navigation";
import NoResultFound from "../no-result-found";

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
  is_activated: boolean,
  thresholds: any // eslint-disable-line @typescript-eslint/no-explicit-any
}

interface ChartComponentProps {
  results: IndicatorStructure[]
  generalRoomData: RoomDataStructure
  indicator: Indicator,
  unit: Unit,
  thresholds: any // eslint-disable-line @typescript-eslint/no-explicit-any
}

const chartConfig = {
  desktop: {
    color: "#00b0c7",
  },

} satisfies ChartConfig


export default function ChartComponent({ results, generalRoomData, indicator, unit }: ChartComponentProps) {

  const { indicators_pollutants: indicators, thresholds } = generalRoomData

  const [{ value: domaninY }] = thresholds[indicator].levels.slice(-1)

  const th = thresholds[indicator].levels

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <div className="flex justify-between items-center gap-2">
          <CardTitle className="text-balance text-lg">Estadísticas en tiempo real</CardTitle>
          <IndicatorToggle indicators={indicators} indicatorParam={indicator} />
        </div>
        <br />
        {
          results.length !== 0 && (
            <div className="w-full">
              <div className="text-xs font-medium mb-2">Umbrales:</div>
              <div className="flex flex-wrap gap-4">
                {th?.map((threshold: any, i: any) => {  // eslint-disable-line @typescript-eslint/no-explicit-any
                  return (
                    <div key={i}>
                      <div>
                        <p className={`${STATUS_COLOR[threshold.level as keyof typeof STATUS_COLOR]}`}>-- {STATUS_TO_SPANISH[threshold.level as keyof typeof STATUS_TO_SPANISH]}</p>
                        <p>{threshold.value} {UNIT_CONVERTED[unit]}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        }

      </CardHeader>
      {
        results.length === 0 ? (
          <NoResultFound />
        ) : (
          <ChartContainer config={chartConfig}>
            <LineChart
              accessibilityLayer
              data={results}
              margin={{ top: 20, right: 0, left: 0, bottom: 0 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="hours"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                hide={false}
                tickMargin={8}
                dataKey="value"
                domain={[0, domaninY * 1.4]}
                tickFormatter={(a) => `${a} ${UNIT_CONVERTED[unit]}`}
                style={{ paddingTop: '40px' }}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent />}
              />
              {

                th?.map((threshold: any, i: number) => ( // eslint-disable-line @typescript-eslint/no-explicit-any
                  <ReferenceLine
                    key={`${threshold.level}-${i}`}
                    y={threshold.value}
                    stroke={STATUS_COLOR_THRESHOLD[threshold.level as keyof typeof STATUS_COLOR_THRESHOLD]}
                    strokeWidth={2}
                    strokeDasharray="3 3"
                    isFront={true}
                  />
                ))
              }
              <Line
                dataKey="value"
                type="natural"
                stroke="var(--color-desktop)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        )
      }


    </Card>
  )
}
