import { getCompanyData } from "@/app/lib/auth";
import { currentGraph, voltageGraph } from "@/app/sevices/energy/desbalance/data";
import { getEnergyCompanyDetails } from "@/app/sevices/energy/enterprise/data";
import { SearchParams } from "@/app/type";
import { StatusAlert } from "@/app/ui/energia/desbalance/alert-balance";
import CurrentCharts from "@/app/ui/energia/desbalance/current-chart";
import { CurrentMeter } from "@/app/ui/energia/desbalance/current-meter";
import { MetricSelector } from "@/app/ui/energia/desbalance/metric-selector";
import VoltageCharts from "@/app/ui/energia/desbalance/voltage-chart";
import HeadquarterEnergyFilter from "@/app/ui/energia/filters/headquarter-energy-filter";
import PanelsFilterEnergy from "@/app/ui/energia/filters/panels-energy-filter";
import FiltersContainer from "@/app/ui/filters/filters-container";
import NoResultFound from "@/app/ui/no-result-found";
import { format } from "date-fns";
// import { addDays, format } from "date-fns";

export default async function page({ searchParams } : SearchParams) {


  const { companies } = await getCompanyData()

   const { headquarter = '1' , panel = '1',  date_after = format(new Date(), "yyyy-MM-dd"), date_before = format(new Date(), "yyyy-MM-dd"), metric = 'current'} = await searchParams
  
  const energyDetails = await getEnergyCompanyDetails({ headquarterId: companies[0].id })

  const currentReadings = await currentGraph({
    headquarterId: headquarter,
    panelId: panel,
    date_after,
    date_before,
  })
  const voltageReadings = await voltageGraph({
    headquarterId: headquarter,
    panelId: panel,
    date_after,
    date_before,
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
        <HeadquarterEnergyFilter energyHeadquarter={energyDetails.energy_headquarters} />
        <PanelsFilterEnergy energyPanels={energyDetails.energy_headquarters[0].electrical_panels} />
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
                          label="Fase T"
                          minValue={0.0}
                          currentValue={lastVoltageReadingArray[0] as number}
                          status={"normal"}
                          unit="V"
                        />
                        <CurrentMeter      
                          label="Fase T"
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
