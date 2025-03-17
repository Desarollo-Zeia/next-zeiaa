import { getCompanyData } from "@/app/lib/auth";
import { getEnergyCompanyDetails } from "@/app/sevices/energy/enterprise/data";
import { StatusAlert } from "@/app/ui/energia/desbalance/alert-balance";
import { CurrentMeter } from "@/app/ui/energia/desbalance/current-meter";
import { MetricSelector } from "@/app/ui/energia/desbalance/metric-selector";
import { DateRangePicker } from "@/app/ui/energia/filters/datepicker-energy-filter";
import HeadquarterEnergyFilter from "@/app/ui/energia/filters/headquarter-energy-filter";
import PanelsFilterEnergy from "@/app/ui/energia/filters/panels-energy-filter";
import FiltersContainer from "@/app/ui/filters/filters-container";

export default async function page() {

  const { companies } = await getCompanyData()

  const energyDetails = await getEnergyCompanyDetails({ headquarterId: companies[0].id })

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
            {/* <div className="flex justify-between p-4 bg-slate-300 rounded-lg">
              <div className="flex flex-col justify-start">
                <p>Neutro</p>
                <p>Min 0.0A</p>
              </div>
              <div className="flex flex-col justify-end">
                <p className="text-2xl font-medium">368.33 A</p>
              </div>
            </div> */}
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
            currentValue={245.67}
            status={"normal"}
            />
          </div>
        </div>
        <div className="flex-1 flex justify-end gap-2">
          <div>
            <MetricSelector />  
          </div>

        </div>
      </div>
    </div>
  )
}
