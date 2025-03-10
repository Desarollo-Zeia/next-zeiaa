import { getCompanyData } from "@/app/lib/auth";
import { getEnergyCompanyDetails } from "@/app/sevices/energy/enterprise/data";
import { DateRangePicker } from "@/app/ui/energia/filters/datepicker-energy-filter";
import HeadquarterEnergyFilter from "@/app/ui/energia/filters/headquarter-energy-filter";
import PanelsFilterEnergy from "@/app/ui/energia/filters/panels-energy-filter";
import ContractedPowerSidebar from "@/app/ui/energia/monitoreo/contracted-power-sidebar";
import PowerUsageChart from "@/app/ui/energia/monitoreo/power-dashboard";
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
      <div className="flex gap-4">
        <ContractedPowerSidebar />
        <PowerUsageChart />
      </div>
    </div>
  )
}
