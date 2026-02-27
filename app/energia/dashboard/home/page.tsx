import { consume, consumeGraph } from "@/app/services/energy/data"
import { dashboardTable } from "@/app/services/panel/data"
import FiltersContainer from "@/app/ui/filters/filters-container"
import { getEnergyMeasurementPointPanels, getHeadquarters } from "@/app/services/energy/enterprise/data"
import HeadquarterEnergyFilter from "@/app/ui/energia/filters/headquarter-energy-filter"
import PanelsFilterEnergy, { ElectricalPanel } from "@/app/ui/energia/filters/panels-energy-filter"
import MeasurementTable from "@/app/ui/energia/consumo/measurement-table"
import { EnergyHeadquarter, MeasurementPointResults, SearchParams } from "@/app/type"
import { format } from "date-fns"
import { DatepickerRange } from "@/app/ui/filters/datepicker-range"
import Graph from "@/app/ui/energia/consumo/graph"
import DownloadExcel from "@/app/ui/energia/consumo/download-excel"
import { getMeasurementPoints } from "@/app/services/filters/data"
import MeasurementPointFilter from "@/app/ui/filters/measurement-points-filter"
import { getToken } from "@/app/lib/auth"
import { Suspense } from "react"
import { FiltersSkeleton, TableSkeleton, GraphSkeleton } from "@/app/ui/energia/consumo/skeletons"

interface ResolvedParams {
  headquarterId: string
  panelId: string
  pointId: string
  formattedDateAfter: string
  formattedDateBefore: string
  unit: string
  indicator: string
  page: string
  last_by: string
  category: string
  headquarterName?: string
  panelName?: string
  measurementPointName?: string
}

async function resolveFilterIds(
  searchParams: Record<string, any>,
  token: string
): Promise<ResolvedParams> {
  const {
    headquarter,
    panel,
    date_after = new Date(),
    date_before = new Date(),
    unit = 'V',
    indicator = 'P',
    page = '1',
    last_by = 'minute',
    category = 'power',
    point
  } = searchParams

  const formattedDateAfter = format(date_after, 'yyyy-MM-dd')
  const formattedDateBefore = format(date_before, 'yyyy-MM-dd')

  const headquarters = await getHeadquarters(token)
  const headquarterId = headquarter || headquarters.results[0]?.id.toString()
  const headquarterName = headquarters.results.find((h: EnergyHeadquarter) => h.id.toString() === headquarterId)?.name

  const measurementPointsPanels = await getEnergyMeasurementPointPanels({ headquarterId, token })
  const panelId = panel || measurementPointsPanels?.results[0]?.id.toString()
  const panelName = measurementPointsPanels.results.find((p: { id: number; name: string }) => p.id.toString() === panelId)?.name

  const measurementPoints = await getMeasurementPoints({ electricalpanelId: panelId, token })
  const pointId = point || measurementPoints?.results[0]?.measurement_points[0]?.id.toString()
  const measurementPointName = measurementPoints.results
    .flatMap((d: { measurement_points: Array<{ id: number; name: string }> }) => d.measurement_points)
    .find((mp: { id: number; name: string }) => mp.id.toString() === pointId)?.name

  return {
    headquarterId,
    panelId,
    pointId,
    formattedDateAfter,
    formattedDateBefore,
    unit,
    indicator,
    page,
    last_by,
    category,
    headquarterName,
    panelName,
    measurementPointName
  }
}

async function FiltersSection({
  token,
  headquarterId,
  panelId,
  pointId,
  formattedDateAfter,
  formattedDateBefore,
  unit
}: {
  token: string
  headquarterId: string
  panelId: string
  pointId: string
  formattedDateAfter: string
  formattedDateBefore: string
  unit: string
}) {
  const [headquarters, measurementPointsPanels, measurementPoints]: [
    { results: EnergyHeadquarter[] },
    { results: Array<{ id: number; name: string }> },
    MeasurementPointResults
  ] = await Promise.all([
    getHeadquarters(token),
    getEnergyMeasurementPointPanels({ headquarterId, token }),
    getMeasurementPoints({ electricalpanelId: panelId, token })
  ])

  const energyPanel = (measurementPointsPanels.results.find((p) => p.id.toString() === panelId) as ElectricalPanel | undefined) ?? null
  const energyMeasurementPoint = measurementPoints.results
    .flatMap((device) => device.measurement_points)
    .find((mp) => mp.id.toString() === pointId)?.name ?? ''

  return (
    <FiltersContainer>
      <HeadquarterEnergyFilter energyHeadquarter={headquarters.results} energy={headquarterId} />
      <PanelsFilterEnergy energyPanels={measurementPointsPanels.results as ElectricalPanel[]} panel={panelId} />
      <MeasurementPointFilter measurementPoints={measurementPoints} point={pointId} />
      <DatepickerRange />
      <DownloadExcel
        headquarterId={headquarterId}
        point={pointId}
        panelId={panelId}
        date_after={formattedDateAfter}
        date_before={formattedDateBefore}
        unit={unit}
        energyPanel={energyPanel}
        measurementPoint={energyMeasurementPoint}
      />
    </FiltersContainer>
  )
}

async function TableSection({
  token,
  headquarterId,
  panelId,
  pointId,
  formattedDateAfter,
  formattedDateBefore,
  category,
  indicator,
  page
}: {
  token: string
  headquarterId: string
  panelId: string
  pointId: string
  formattedDateAfter: string
  formattedDateBefore: string
  category: string
  indicator: string
  page: string
}) {
  const readings = await consume({
    date_after: formattedDateAfter,
    date_before: formattedDateBefore,
    headquarterId,
    panelId,
    point: pointId,
    page,
    category,
    token
  })

  return <MeasurementTable readings={readings} category={category} indicator={indicator} />
}

async function GraphSection({
  token,
  headquarterId,
  panelId,
  pointId,
  formattedDateAfter,
  formattedDateBefore,
  category,
  indicator,
  unit,
  last_by,
  headquarterName,
  panelName,
  measurementPointName
}: {
  token: string
  headquarterId: string
  panelId: string
  pointId: string
  formattedDateAfter: string
  formattedDateBefore: string
  category: string
  indicator: string
  unit: string
  last_by: string
  headquarterName?: string
  panelName?: string
  measurementPointName?: string
}) {

  const [readings, readingsGraph, tableData] = await Promise.all([
    consume({
      date_after: formattedDateAfter,
      date_before: formattedDateBefore,
      headquarterId,
      panelId,
      point: pointId,
      category,
      token
    }),
    consumeGraph({
      date_after: formattedDateAfter,
      date_before: formattedDateBefore,
      headquarterId,
      panelId,
      indicador: indicator,
      point: pointId,
      category,
      unit,
      last_by,
      token
    }),
    dashboardTable({
      headquarterId,
      panelId,
      point: pointId,
      token
    })
  ])

  let thresholdLower: number | undefined
  let thresholdUpper: number | undefined
  let capacity: string | undefined

  if (category === 'voltage' && tableData?.results) {
    const pointData = tableData.results.find((p: { id: number }) => p.id.toString() === pointId)
    if (pointData?.capacity) {
      capacity = pointData.capacity
      const voltageMatch = pointData.capacity.match(/^(\d+)v\//i)
      if (voltageMatch) {
        const voltage = parseInt(voltageMatch[1], 10)
        thresholdLower = voltage * 0.95
        thresholdUpper = voltage * 1.05
      }
    }
  }

  return (
    <Graph
      readingsGraph={readingsGraph}
      category={category}
      indicator={indicator}
      last_by={last_by}
      readings={readings}
      dateAfter={formattedDateAfter}
      dateBefore={formattedDateBefore}
      panelId={panelId}
      headquarterId={headquarterId}
      measurementPointId={pointId}
      capacity={capacity}
      thresholdLower={thresholdLower}
      thresholdUpper={thresholdUpper}
      panelName={panelName}
      measurementPointName={measurementPointName}
      headquarterName={headquarterName}
    />
  )
}

export default async function page({ searchParams }: SearchParams) {
  const params = await searchParams
  const authToken = await getToken()

  const resolved = await resolveFilterIds(params, authToken!)

  return (
    <div className="w-full">
      <Suspense fallback={<FiltersSkeleton />}>
        <FiltersSection
          token={authToken!}
          headquarterId={resolved.headquarterId}
          panelId={resolved.panelId}
          pointId={resolved.pointId}
          formattedDateAfter={resolved.formattedDateAfter}
          formattedDateBefore={resolved.formattedDateBefore}
          unit={resolved.unit}
        />
      </Suspense>

      <div className="flex gap-4 min-h-full">
        <div className="w-2/5">
          <Suspense fallback={<TableSkeleton />}>
            <TableSection
              token={authToken!}
              headquarterId={resolved.headquarterId}
              panelId={resolved.panelId}
              pointId={resolved.pointId}
              formattedDateAfter={resolved.formattedDateAfter}
              formattedDateBefore={resolved.formattedDateBefore}
              category={resolved.category}
              indicator={resolved.indicator}
              page={resolved.page}
            />
          </Suspense>
        </div>
        <div className="w-3/5">
          <Suspense fallback={<GraphSkeleton />}>
            <GraphSection
              token={authToken!}
              headquarterId={resolved.headquarterId}
              panelId={resolved.panelId}
              pointId={resolved.pointId}
              formattedDateAfter={resolved.formattedDateAfter}
              formattedDateBefore={resolved.formattedDateBefore}
              category={resolved.category}
              indicator={resolved.indicator}
              unit={resolved.unit}
              last_by={resolved.last_by}
              headquarterName={resolved.headquarterName}
              panelName={resolved.panelName}
              measurementPointName={resolved.measurementPointName}
            />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
