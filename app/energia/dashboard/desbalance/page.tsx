// import { getCompanyData } from "@/app/lib/auth";
import { currentGraph, voltageGraph } from "@/app/sevices/energy/desbalance/data";
import { getHeadquarters } from "@/app/sevices/energy/enterprise/data";
import { SearchParams } from "@/app/type";
import { StatusAlert } from "@/app/ui/energia/desbalance/alert-balance";
import CurrentCharts from "@/app/ui/energia/desbalance/current-chart";
import { CurrentMeter } from "@/app/ui/energia/desbalance/current-meter";
import { MetricSelector } from "@/app/ui/energia/desbalance/metric-selector";
import VoltageCharts from "@/app/ui/energia/desbalance/voltage-chart";
import HeadquarterEnergyFilter from "@/app/ui/energia/filters/headquarter-energy-filter";
// import PanelsFilterEnergy from "@/app/ui/energia/filters/panels-energy-filter";
import { DatepickerRange } from "@/app/ui/filters/datepicker-range";
import FiltersContainer from "@/app/ui/filters/filters-container";
import NoResultFound from "@/app/ui/no-result-found";
import { format } from "date-fns";
// import { addDays, format } from "date-fns";

export default async function page({ searchParams } : SearchParams) {

   const { headquarter, panel = '1',  date_after = new Date(), date_before = new Date(), metric = 'current'} = await searchParams
  
  const headquarters = await getHeadquarters()

  const { results } = headquarters

  const firstHeadquarter = headquarter || results[0].id

  const currentReadings = await currentGraph({
    headquarterId: firstHeadquarter,
    panelId: panel,
    date_after: format(date_after, "yyyy-MM-dd"),
    date_before: format(date_before, "yyyy-MM-dd"),
  })
  const voltageReadings = await voltageGraph({
    headquarterId: firstHeadquarter,
    panelId: panel,
    date_after: format(date_after, "yyyy-MM-dd"),
    date_before: format(date_before, "yyyy-MM-dd"),
  })

  const currentLast =
    currentReadings && currentReadings.length > 0
      ? currentReadings[currentReadings.length - 1]
      : null;
  
  // Get the last voltage reading
  const voltageLast =
    voltageReadings && voltageReadings.length > 0
      ? voltageReadings[voltageReadings.length - 1]
      : null;
  
  // Safely extract the 'values' object
  const currentValues =
    currentLast?.values_per_channel?.[0]?.values ?? null;
  
  const voltageValues =
    voltageLast?.values_per_channel?.[0]?.values ?? null;
  
  // If the values object is defined, use Object.values, otherwise fallback to an empty array
  const lastCurrentReadingArray = currentValues
    ? Object.values(currentValues)
    : [];
  const lastVoltageReadingArray = voltageValues
    ? Object.values(voltageValues)
    : [];

  return (
    <div className="w-full">
      <FiltersContainer>
        <HeadquarterEnergyFilter energyHeadquarter={headquarters.results} energy={firstHeadquarter}/>
        {/* <PanelsFilterEnergy energyPanels={energyDetails.energy_headquarters[0].electrical_panels} /> */}
        <DatepickerRange />
      </FiltersContainer>
      <div className="flex gap-4 mx-6">
        <div className="min-w-[350px] flex flex-col gap-2">
          {
            voltageLast && currentLast ? 
            (
              <>
              {
                  metric === 'current' ? 
                  (
                    currentLast?.balance_status === 'Balanceado' ? (
                      <StatusAlert title={`Carga balanceada`} description="Tu sistema está funcionando adecuadamente" variant="success"/> 
                    ) : (
                      <StatusAlert title={`Carga desbalanceada`} description="Tu sistema no está funcionando adecuadamente" variant="error"/>
                    )
                  ) : (
                    voltageLast?.balance_status === 'Balanceado' ? (
                      <StatusAlert title={`Carga balanceada`} description="Tu sistema está funcionando adecuadamente" variant="success"/> 
                    ) : (
                      <StatusAlert title={`Carga desbalanceada`} description="Tu sistema no está funcionando adecuadamente" variant="error"/>
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
              <NoResultFound/>
            )
          }
      
        </div>
        <div className="flex-1 flex flex-col gap-2">
          <div>
            <MetricSelector/>  
          </div>
          <div> 
            {
              metric === 'current' ? <CurrentCharts currentReadings={currentReadings}/> : <VoltageCharts voltageReadings={voltageReadings}/>
            }
          </div>
        </div>
      </div>
    </div>
  )
}
