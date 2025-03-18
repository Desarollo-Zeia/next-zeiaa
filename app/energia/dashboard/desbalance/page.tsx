import { getCompanyData } from "@/app/lib/auth";
import { current, currentGraph } from "@/app/sevices/energy/desbalance/data";
import { getEnergyCompanyDetails } from "@/app/sevices/energy/enterprise/data";
import { SearchParams } from "@/app/type";
import { StatusAlert } from "@/app/ui/energia/desbalance/alert-balance";
import CurrentCharts from "@/app/ui/energia/desbalance/current-chart";
import { CurrentMeter } from "@/app/ui/energia/desbalance/current-meter";
import { MetricSelector } from "@/app/ui/energia/desbalance/metric-selector";
import { DateRangePicker } from "@/app/ui/energia/filters/datepicker-energy-filter";
import HeadquarterEnergyFilter from "@/app/ui/energia/filters/headquarter-energy-filter";
import PanelsFilterEnergy from "@/app/ui/energia/filters/panels-energy-filter";
import FiltersContainer from "@/app/ui/filters/filters-container";
// import { addDays, format } from "date-fns";

export default async function page({ searchParams } : SearchParams) {

  const { companies } = await getCompanyData()

   const { headquarter = '1' , panel = '1',  date_after = '2025-02-28', date_before = '2025-02-27', status = 'unbalanced'} = await searchParams
  
  const energyDetails = await getEnergyCompanyDetails({ headquarterId: companies[0].id })

  const currentReadings = await currentGraph({ headquarterId: headquarter, panelId: panel, date_after, date_before, status })

  return (
    <div className="w-full">
      <FiltersContainer>
        <HeadquarterEnergyFilter energyHeadquarter={energyDetails.energy_headquarters} />
        <PanelsFilterEnergy energyPanels={energyDetails.energy_headquarters[0].electrical_panels} />
        <DateRangePicker/>
      </FiltersContainer>
      <div className="flex gap-4 mx-6">
        <div className="min-w-[350px] flex flex-col gap-2">
          <StatusAlert title="Carga detectada" description="Tu sistema está funcionando adecuadamente" variant="success"/>
          <div className="flex flex-col gap-4">
            <CurrentMeter      
            label="Neutro"
            minValue={0.0}
            currentValue={200}
            warningThreshold={300}
            criticalThreshold={400}
            />
            <CurrentMeter      
              label="Fase R"
              minValue={0.0}
              currentValue={268.33}
              status={"normal"}
            />
            <CurrentMeter      
              label="Fase S"
              minValue={0.0}
              currentValue={268.33}
              status={"normal"}
            />
              <CurrentMeter      
              label="Fase T"
              minValue={0.0}
              currentValue={268.33}
              status={"normal"}
            />
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-2">
          <div>
            <MetricSelector />  
          </div>
          <div>
            <CurrentCharts currentReadings={currentReadings}/>
          </div>
        </div>
      </div>
    </div>
  )
}
