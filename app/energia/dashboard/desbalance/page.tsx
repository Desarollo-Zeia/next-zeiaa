import { currentGraph, threeMostUnbalanced, voltageGraph } from "@/app/sevices/energy/desbalance/data";
import { getEnergyMeasurementPointPanels, getHeadquarters } from "@/app/sevices/energy/enterprise/data";
import { getMeasurementPoints } from "@/app/sevices/filters/data";
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

export default async function page({ searchParams }: SearchParams) {

  const { headquarter, panel, point, date_after = new Date(), date_before = new Date(), metric = 'current' } = await searchParams

  const headquarters = await getHeadquarters()

  const { results } = headquarters

  const firstHeadquarter = headquarter || results[0].id

  const measurementPointsPanels = await getEnergyMeasurementPointPanels({ headquarterId: firstHeadquarter })

  const firstPanel = panel || measurementPointsPanels?.results[0]?.id.toString()

  const measurementPoints = await getMeasurementPoints({ electricalpanelId: firstPanel })

  const firstPoint = point || measurementPoints?.results[0]?.measurement_points[0].id.toString()



  const currentReadings = await currentGraph({
    headquarterId: firstHeadquarter,
    panelId: firstPanel,
    point: firstPoint,
    date_after: format(date_after, "yyyy-MM-dd"),
    date_before: format(date_before, "yyyy-MM-dd"),
  })
  const voltageReadings = await voltageGraph({
    headquarterId: firstHeadquarter,
    panelId: firstPanel,
    point: firstPoint,
    date_after: format(date_after, "yyyy-MM-dd"),
    date_before: format(date_before, "yyyy-MM-dd"),
  })

  const threeUnbalanced = await threeMostUnbalanced({ headquarterId: firstHeadquarter })

  const { top_unbalanced_measurement_points: [first, second, third] } = threeUnbalanced

  return (
    <div className="w-full h-auto">
      <FiltersContainer>
        <HeadquarterEnergyFilter energyHeadquarter={headquarters.results} energy={firstHeadquarter} />
        <PanelsFilterEnergy energyPanels={measurementPointsPanels.results} panel={firstPanel} />
        <MeasurementPointFilter measurementPoints={measurementPoints} point={firstPoint} />
        {/* <PanelsFilterEnergy energyPanels={energyDetails.energy_headquarters[0].electrical_panels} /> */}
        <DatepickerRange />
      </FiltersContainer>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full items-center" >
        <div className="flex flex-col items-center gap-2">
          <h3>Top 3 equipos con mayor desbalance del día</h3>
          <MostThreeUnbalanced title={first.measurement_point_name} frequency={first.total_readings} cup={first.current_unbalanced} vup={first.voltage_unbalanced} />
          <MostThreeUnbalanced title={second.measurement_point_name} frequency={second.total_readings} cup={second.current_unbalanced} vup={second.voltage_unbalanced} />
          <MostThreeUnbalanced title={third.measurement_point_name} frequency={third.total_readings} cup={third.current_unbalanced} vup={third.voltage_unbalanced} />
        </div>
        <div className="flex flex-col gap-4">
          <div>
            <MetricSelector />
          </div>
          <div className="flex justify-center items-center">
            {
              metric === 'current' ? <CurrentChartCount currentReadings={currentReadings} /> : <VoltageChartCount voltageReadings={voltageReadings} />
            }
          </div>
        </div>
      </div>
    </div>
  )
}
