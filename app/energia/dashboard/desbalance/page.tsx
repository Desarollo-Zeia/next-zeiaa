// import { getCompanyData } from "@/app/lib/auth";
import { currentGraph, threeMostUnbalanced, voltageGraph } from "@/app/sevices/energy/desbalance/data";
import { getEnergyMeasurementPointPanels, getHeadquarters } from "@/app/sevices/energy/enterprise/data";
import { getMeasurementPoints } from "@/app/sevices/filters/data";
import { SearchParams } from "@/app/type";
// import { StatusAlert } from "@/app/ui/energia/desbalance/alert-balance";
import CurrentCharts from "@/app/ui/energia/desbalance/current-chart";
// import { CurrentMeter } from "@/app/ui/energia/desbalance/current-meter";
import { MetricSelector } from "@/app/ui/energia/desbalance/metric-selector";
import MostThreeUnbalanced from "@/app/ui/energia/desbalance/most-three-unbalanced";
import VoltageCharts from "@/app/ui/energia/desbalance/voltage-chart";
import HeadquarterEnergyFilter from "@/app/ui/energia/filters/headquarter-energy-filter";
import PanelsFilterEnergy from "@/app/ui/energia/filters/panels-energy-filter";
// import PanelsFilterEnergy from "@/app/ui/energia/filters/panels-energy-filter";
import { DatepickerRange } from "@/app/ui/filters/datepicker-range";
import FiltersContainer from "@/app/ui/filters/filters-container";
import MeasurementPointFilter from "@/app/ui/filters/measurement-points-filter";
import { format } from "date-fns";
// import { addDays, format } from "date-fns";

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

  // const currentLast =
  //   currentReadings && currentReadings.length > 0
  //     ? currentReadings[currentReadings.length - 1]
  //     : null;

  // Get the last voltage reading
  // const voltageLast =
  //   voltageReadings && voltageReadings.length > 0
  //     ? voltageReadings[voltageReadings.length - 1]
  //     : null;

  // Safely extract the 'values' object
  // const currentValues =
  //   currentLast?.values_per_channel?.[0]?.values ?? null;

  // const voltageValues =
  //   voltageLast?.values_per_channel?.[0]?.values ?? null;

  // If the values object is defined, use Object.values, otherwise fallback to an empty array
  // const lastCurrentReadingArray = currentValues
  //   ? Object.values(currentValues)
  //   : [];
  // const lastVoltageReadingArray = voltageValues
  //   ? Object.values(voltageValues)
  //   : [];

  return (
    <div className="w-full">
      <FiltersContainer>
        <HeadquarterEnergyFilter energyHeadquarter={headquarters.results} energy={firstHeadquarter} />
        <PanelsFilterEnergy energyPanels={measurementPointsPanels.results} panel={firstPanel} />
        <MeasurementPointFilter measurementPoints={measurementPoints} point={firstPoint} />
        {/* <PanelsFilterEnergy energyPanels={energyDetails.energy_headquarters[0].electrical_panels} /> */}
        <DatepickerRange />
      </FiltersContainer>
      <div className="flex gap-4 mx-6">
        <div>

        </div>
        <div className="min-w-[350px] flex flex-col items-center justify-center gap-2 pt-8">
          <h3>Top 3 equipos con mayor desbalance del día</h3>
          <MostThreeUnbalanced title={first.measurement_point_name} frequency={first.total_readings} cup={first.current_unbalanced} vup={first.voltage_unbalanced} />
          <MostThreeUnbalanced title={second.measurement_point_name} frequency={second.total_readings} cup={second.current_unbalanced} vup={second.voltage_unbalanced} />
          <MostThreeUnbalanced title={third.measurement_point_name} frequency={third.total_readings} cup={third.current_unbalanced} vup={third.voltage_unbalanced} />
          {/* {
            voltageLast && currentLast ?
              (
                <>
                  {
                    metric === 'current' ?
                      (
                        currentLast?.balance_status === 'Balanceado' ? (
                          <StatusAlert title={`Carga balanceada`} description="Tu sistema está funcionando adecuadamente" variant="success" />
                        ) : (
                          <StatusAlert title={`Carga desbalanceada`} description="Tu sistema no está funcionando adecuadamente" variant="error" />
                        )
                      ) : (
                        voltageLast?.balance_status === 'Balanceado' ? (
                          <StatusAlert title={`Carga balanceada`} description="Tu sistema está funcionando adecuadamente" variant="success" />
                        ) : (
                          <StatusAlert title={`Carga desbalanceada`} description="Tu sistema no está funcionando adecuadamente" variant="error" />
                        )
                      )
                  }
                  <div className="flex flex-col gap-4">
                    {
                      metric === 'current' ? (
                        <>
                          <CurrentMeter
                            label="Fase R"
                            minValue={0.0}
                            currentValue={lastCurrentReadingArray[0] as number}
                            status={"normal"}
                          />
                          <CurrentMeter
                            label="Fase S"
                            minValue={0.0}
                            currentValue={lastCurrentReadingArray[1] as number}
                            status={"normal"}
                          />
                          <CurrentMeter
                            label="Fase T"
                            minValue={0.0}
                            currentValue={lastCurrentReadingArray[2] as number}
                            status={"normal"}
                          />
                        </>
                      ) : (
                        <>
                          <CurrentMeter
                            label="Fase R"
                            minValue={0.0}
                            currentValue={lastVoltageReadingArray[0] as number}
                            status={"normal"}
                            unit="V"
                          />
                          <CurrentMeter
                            label="Fase S"
                            minValue={0.0}
                            currentValue={lastVoltageReadingArray[1] as number}
                            status={"normal"}
                            unit="V"
                          />
                          <CurrentMeter
                            label="Fase T"
                            minValue={0.0}
                            currentValue={lastVoltageReadingArray[2] as number}
                            status={"normal"}
                            unit="V"
                          />
                        </>
                      )
                    }

                  </div>
                </>
              ) : (
                <NoResultFound />
              )
          } */}

        </div>
        <div className="flex-1 flex flex-col gap-2">
          <div>
            <MetricSelector />
          </div>
          <div>
            {
              metric === 'current' ? <CurrentCharts currentReadings={currentReadings} /> : <VoltageCharts voltageReadings={voltageReadings} />
            }
          </div>
        </div>
      </div>
    </div>
  )
}
