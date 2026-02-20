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
import { PageSkeleton } from "@/app/ui/energia/desbalance/skeletons";

async function DesbalanceContent({ searchParams }: SearchParams) {
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

  const headquarters = await getHeadquarters(authToken!)
  const headquarterId = headquarter || headquarters.results[0]?.id.toString()

  const measurementPointsPanels = await getEnergyMeasurementPointPanels({ headquarterId, token: authToken! })
  const panelId = panel || measurementPointsPanels?.results[0]?.id.toString()

  const measurementPoints = await getMeasurementPoints({ electricalpanelId: panelId, token: authToken! })
  const pointId = point || measurementPoints?.results[0]?.measurement_points[0]?.id.toString()

  const [threeUnbalanced, chartData] = await Promise.all([
    threeMostUnbalanced({ headquarterId, token: authToken! }),
    metric === 'current'
      ? currentGraph({
          headquarterId,
          panelId,
          point: pointId,
          date_after: formattedDateAfter,
          date_before: formattedDateBefore,
          token: authToken!
        })
      : voltageGraph({
          headquarterId,
          panelId,
          point: pointId,
          date_after: formattedDateAfter,
          date_before: formattedDateBefore,
          token: authToken!
        })
  ])

  const { top_unbalanced_measurement_points: [first, second, third] } = threeUnbalanced

  return (
    <div className="w-full space-y-4">
      <FiltersContainer>
        <HeadquarterEnergyFilter energyHeadquarter={headquarters.results} energy={headquarterId} />
        <PanelsFilterEnergy energyPanels={measurementPointsPanels.results} panel={panelId} />
        <MeasurementPointFilter measurementPoints={measurementPoints} point={pointId} />
        <DatepickerRange />
      </FiltersContainer>

      <div className="px-4 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="w-full lg:w-1/3 space-y-2">
            <h3 className="text-lg font-medium text-gray-700">Top 3 equipos con mayor desbalance</h3>
            <div className="grid grid-cols-1 gap-2">
              <MostThreeUnbalanced title={first.measurement_point_name} frequency={first.total_readings} cup={first.current_unbalanced} vup={first.voltage_unbalanced} />
              <MostThreeUnbalanced title={second.measurement_point_name} frequency={second.total_readings} cup={second.current_unbalanced} vup={second.voltage_unbalanced} />
              <MostThreeUnbalanced title={third.measurement_point_name} frequency={third.total_readings} cup={third.current_unbalanced} vup={third.voltage_unbalanced} />
            </div>
          </div>

          <div className="w-full lg:w-2/3 space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-700">Desbalances totales por día</h3>
              <MetricSelector />
            </div>
            <div className="w-full h-[400px]">
              {metric === 'current'
                ? <CurrentChartCount currentReadings={chartData} />
                : <VoltageChartCount voltageReadings={chartData} />
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default async function page({ searchParams }: SearchParams) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <DesbalanceContent searchParams={searchParams} />
    </Suspense>
  )
}
