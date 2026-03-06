import { getToken } from "@/app/lib/auth"
import { currentGraph, threeMostUnbalanced, voltageGraph } from "@/app/services/energy/desbalance/data"
import { getEnergyMeasurementPointPanels, getHeadquarters } from "@/app/services/energy/enterprise/data"
import { getMeasurementPoints } from "@/app/services/filters/data"
import { SearchParams } from "@/app/type"
import CurrentChartCount from "@/app/ui/energia/desbalance/current-chart-count"
import { MetricSelector } from "@/app/ui/energia/desbalance/metric-selector"
import MostThreeUnbalanced from "@/app/ui/energia/desbalance/most-three-unbalanced"
import VoltageChartCount from "@/app/ui/energia/desbalance/voltage-chart-count"
import HeadquarterEnergyFilter from "@/app/ui/energia/filters/headquarter-energy-filter"
import PanelsFilterEnergy from "@/app/ui/energia/filters/panels-energy-filter"
import { DatepickerRange } from "@/app/ui/filters/datepicker-range"
import FiltersContainer from "@/app/ui/filters/filters-container"
import MeasurementPointFilter from "@/app/ui/filters/measurement-points-filter"
import { format } from "date-fns"
import { Suspense } from "react"
import { PageSkeleton } from "@/app/ui/energia/desbalance/skeletons"

interface DesbalanceContext {
  metric: string
  authToken: string
  headquarterId: string
  panelId: string
  pointId: string
  formattedDateAfter: string
  formattedDateBefore: string
  headquarters: Awaited<ReturnType<typeof getHeadquarters>>
  measurementPointsPanels: Awaited<ReturnType<typeof getEnergyMeasurementPointPanels>>
  measurementPoints: Awaited<ReturnType<typeof getMeasurementPoints>>
}

async function resolveDesbalanceContext(searchParams: SearchParams['searchParams']): Promise<DesbalanceContext> {
  const {
    headquarter,
    panel,
    point,
    date_after = new Date(),
    date_before = new Date(),
    metric = 'current'
  } = await searchParams

  const authToken = await getToken()

  const formattedDateAfter = format(date_after, 'yyyy-MM-dd')
  const formattedDateBefore = format(date_before, 'yyyy-MM-dd')

  const headquartersPromise = getHeadquarters(authToken!)


  const headquarters = await headquartersPromise

  if (!headquarters?.results?.length) {
    throw new Error('No hay sedes disponibles')
  }

  const headquarterId = headquarter || headquarters.results[0]?.id.toString()

  const measurementPointsPanels = await getEnergyMeasurementPointPanels({ headquarterId, token: authToken! })

  const panelId = panel || measurementPointsPanels?.results[0]?.id.toString()

  const measurementPoints = await getMeasurementPoints({ electricalpanelId: panelId, token: authToken! })

  const pointId = point || measurementPoints.results[0].measurement_points[0]?.id.toString()

  return {
    metric,
    authToken: authToken!,
    headquarterId,
    panelId,
    pointId,
    formattedDateAfter,
    formattedDateBefore,
    headquarters,
    measurementPointsPanels,
    measurementPoints,
  }
}

async function DesbalanceFiltersSection({ contextPromise }: { contextPromise: Promise<DesbalanceContext> }) {
  const context = await contextPromise

  return (
    <FiltersContainer>
      <HeadquarterEnergyFilter energyHeadquarter={context.headquarters.results} energy={context.headquarterId} />
      <PanelsFilterEnergy energyPanels={context.measurementPointsPanels.results} panel={context.panelId} />
      <MeasurementPointFilter measurementPoints={context.measurementPoints} point={context.pointId} />
      <DatepickerRange />
    </FiltersContainer>
  )
}

async function DesbalanceDataSection({ contextPromise }: { contextPromise: Promise<DesbalanceContext> }) {
  const context = await contextPromise

  const chartDataPromise = context.metric === 'current'
    ? currentGraph({
      headquarterId: context.headquarterId,
      panelId: context.panelId,
      point: context.pointId,
      date_after: context.formattedDateAfter,
      date_before: context.formattedDateBefore,
      token: context.authToken
    })
    : voltageGraph({
      headquarterId: context.headquarterId,
      panelId: context.panelId,
      point: context.pointId,
      date_after: context.formattedDateAfter,
      date_before: context.formattedDateBefore,
      token: context.authToken
    })

  const [threeUnbalanced, chartData] = await Promise.all([
    threeMostUnbalanced({ headquarterId: context.headquarterId, token: context.authToken }),
    chartDataPromise
  ])

  const { top_unbalanced_measurement_points: [first, second, third] } = threeUnbalanced

  return (
    <div className="px-4 pb-4 flex-1 flex flex-col">
      <div className="flex-1 min-h-0 lg:min-h-[calc(100svh-14rem)] flex flex-col lg:flex-row gap-4">
        <div className="w-full lg:w-1/3 space-y-2">
          <h3 className="text-lg font-medium text-gray-700">Top 3 equipos con mayor desbalance del día</h3>
          <div className="grid grid-cols-1 gap-2">
            <MostThreeUnbalanced title={first?.measurement_point_name} frequency={first?.total_readings} cup={first?.current_unbalanced} vup={first?.voltage_unbalanced} />
            <MostThreeUnbalanced title={second?.measurement_point_name} frequency={second?.total_readings} cup={second?.current_unbalanced} vup={second?.voltage_unbalanced} />
            <MostThreeUnbalanced title={third?.measurement_point_name} frequency={third?.total_readings} cup={third?.current_unbalanced} vup={third?.voltage_unbalanced} />
          </div>
        </div>

        <div className="w-full lg:w-2/3 space-y-2 flex flex-col min-h-0">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-700">Desbalances totales por día</h3>
            <MetricSelector />
          </div>
          <div className="w-full h-full flex-1 min-h-[420px]">
            {context.metric === 'current'
              ? <CurrentChartCount currentReadings={chartData} />
              : <VoltageChartCount voltageReadings={chartData} />
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default async function page({ searchParams }: SearchParams) {
  const contextPromise = resolveDesbalanceContext(searchParams)

  return (
    <div className="w-full min-h-[calc(100svh-4rem)] flex flex-col">
      <Suspense fallback={<div className="h-12 rounded bg-gray-200 animate-pulse" />}>
        <DesbalanceFiltersSection contextPromise={contextPromise} />
      </Suspense>
      <Suspense fallback={<PageSkeleton />}>
        <DesbalanceDataSection contextPromise={contextPromise} />
      </Suspense>
    </div>
  )
}
