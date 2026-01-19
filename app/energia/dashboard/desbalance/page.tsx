import { getToken } from "@/app/lib/auth";
import { currentGraph, threeMostUnbalanced, voltageGraph } from "@/app/services/energy/desbalance/data";
import { getEnergyMeasurementPointPanels, getHeadquarters } from "@/app/services/energy/enterprise/data";
import { getMeasurementPoints } from "@/app/services/filters/data";
import { SearchParams } from "@/app/type";
import CurrentChartCount from "@/app/ui/energia/desbalance/current-chart-count";
import { MetricSelector } from "@/app/ui/energia/desbalance/metric-selector";
import MostThreeUnbalanced from "@/app/ui/energia/desbalance/most-three-unbalanced";
import VoltageChartCount from "@/app/ui/energia/desbalance/voltage-chart-count";
import HeadquarterEnergyFilter from "@/app/ui/energia/filters/headquarter-energy-filter";
import PanelsFilterEnergy from "@/app/ui/energia/filters/panels-energy-filter";
import { DatepickerRange } from "@/app/ui/filters/datepicker-range";
import FiltersContainer from "@/app/ui/filters/filters-container";
import MeasurementPointFilter from "@/app/ui/filters/measurement-points-filter";
import { format } from "date-fns";
import { Suspense } from "react";
import { FiltersSkeleton, Top3Skeleton, ChartSkeleton } from "@/app/ui/energia/desbalance/skeletons";

interface ResolvedParams {
  headquarterId: string
  panelId: string
  pointId: string
  formattedDateAfter: string
  formattedDateBefore: string
  metric: string
}

async function resolveFilterIds(
  searchParams: Record<string, any>,
  token: string
): Promise<ResolvedParams> {
  const {
    headquarter,
    panel,
    point,
    date_after = new Date(),
    date_before = new Date(),
    metric = 'current'
  } = searchParams

  const formattedDateAfter = format(date_after, 'yyyy-MM-dd')
  const formattedDateBefore = format(date_before, 'yyyy-MM-dd')

  const headquarters = await getHeadquarters(token)
  const headquarterId = headquarter || headquarters.results[0]?.id.toString()

  const measurementPointsPanels = await getEnergyMeasurementPointPanels({ headquarterId, token })
  const panelId = panel || measurementPointsPanels?.results[0]?.id.toString()

  const measurementPoints = await getMeasurementPoints({ electricalpanelId: panelId, token })
  const pointId = point || measurementPoints?.results[0]?.measurement_points[0]?.id.toString()

  return {
    headquarterId,
    panelId,
    pointId,
    formattedDateAfter,
    formattedDateBefore,
    metric
  }
}

async function FiltersSection({
  token,
  headquarterId,
  panelId,
  pointId
}: {
  token: string
  headquarterId: string
  panelId: string
  pointId: string
}) {
  // Paralelizar las 3 llamadas de filtros (async-parallel)
  const [headquarters, measurementPointsPanels, measurementPoints] = await Promise.all([
    getHeadquarters(token),
    getEnergyMeasurementPointPanels({ headquarterId, token }),
    getMeasurementPoints({ electricalpanelId: panelId, token })
  ])

  return (
    <FiltersContainer>
      <HeadquarterEnergyFilter energyHeadquarter={headquarters.results} energy={headquarterId} />
      <PanelsFilterEnergy energyPanels={measurementPointsPanels.results} panel={panelId} />
      <MeasurementPointFilter measurementPoints={measurementPoints} point={pointId} />
      <DatepickerRange />
    </FiltersContainer>
  )
}

async function Top3Section({
  headquarterId,
  token
}: {
  headquarterId: string
  token: string
}) {
  const threeUnbalanced = await threeMostUnbalanced({ headquarterId, token })
  const { top_unbalanced_measurement_points: [first, second, third] } = threeUnbalanced

  return (
    <div>
      <h3 className="text-lg font-medium text-center mb-3">Top 3 equipos con mayor desbalance del día</h3>
      <div className="flex flex-col gap-3">
        <MostThreeUnbalanced title={first.measurement_point_name} frequency={first.total_readings} cup={first.current_unbalanced} vup={first.voltage_unbalanced} />
        <MostThreeUnbalanced title={second.measurement_point_name} frequency={second.total_readings} cup={second.current_unbalanced} vup={second.voltage_unbalanced} />
        <MostThreeUnbalanced title={third.measurement_point_name} frequency={third.total_readings} cup={third.current_unbalanced} vup={third.voltage_unbalanced} />
      </div>
    </div>
  )
}

async function ChartSection({
  token,
  headquarterId,
  panelId,
  pointId,
  formattedDateAfter,
  formattedDateBefore,
  metric
}: {
  token: string
  headquarterId: string
  panelId: string
  pointId: string
  formattedDateAfter: string
  formattedDateBefore: string
  metric: string
}) {
  // bundle-conditional: Solo cargar el gráfico necesario según metric
  if (metric === 'current') {
    const currentReadings = await currentGraph({
      headquarterId,
      panelId,
      point: pointId,
      date_after: formattedDateAfter,
      date_before: formattedDateBefore,
      token
    })
    return <CurrentChartCount currentReadings={currentReadings} />
  } else {
    const voltageReadings = await voltageGraph({
      headquarterId,
      panelId,
      point: pointId,
      date_after: formattedDateAfter,
      date_before: formattedDateBefore,
      token
    })
    return <VoltageChartCount voltageReadings={voltageReadings} />
  }
}

export default async function page({ searchParams }: SearchParams) {
  const params = await searchParams
  const authToken = await getToken()
  const resolved = await resolveFilterIds(params, authToken!)

  return (
    <div className="w-full h-auto space-y-6">
      <Suspense fallback={<FiltersSkeleton />}>
        <FiltersSection
          token={authToken!}
          headquarterId={resolved.headquarterId}
          panelId={resolved.panelId}
          pointId={resolved.pointId}
        />
      </Suspense>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pl-4">
        <Suspense fallback={<Top3Skeleton />}>
          <Top3Section
            headquarterId={resolved.headquarterId}
            token={authToken!}
          />
        </Suspense>

        <div className="lg:col-span-2">
          <MetricSelector />
          <Suspense fallback={<ChartSkeleton />}>
            <ChartSection
              token={authToken!}
              headquarterId={resolved.headquarterId}
              panelId={resolved.panelId}
              pointId={resolved.pointId}
              formattedDateAfter={resolved.formattedDateAfter}
              formattedDateBefore={resolved.formattedDateBefore}
              metric={resolved.metric}
            />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
