import { getCompanyData } from "@/app/lib/auth";
import { getEnergyCompanyDetails } from "@/app/sevices/energy/enterprise/data";
import { monitoringGraph, monitoringLastThree } from "@/app/sevices/energy/monitoreo/data";
import { SearchParams } from "@/app/type";
import { DateRangePicker } from "@/app/ui/energia/filters/datepicker-energy-filter";
import HeadquarterEnergyFilter from "@/app/ui/energia/filters/headquarter-energy-filter";
import PanelsFilterEnergy from "@/app/ui/energia/filters/panels-energy-filter";
import ExcessPower from "@/app/ui/energia/monitoreo/excess-power";
import PowerUsageChart from "@/app/ui/energia/monitoreo/power-dashboard";
import FiltersContainer from "@/app/ui/filters/filters-container";
import { format } from "date-fns";

export default async function page({ searchParams } : SearchParams) {

  const { companies } = await getCompanyData()

  const { headquarter = '1' , panel = '1',  date_after = format(new Date(), 'yyyy-MM-dd'), date_before = format(new Date(), 'yyyy-MM-dd'), group_by = 'day'} = await searchParams

  const energyDetails = await getEnergyCompanyDetails({ headquarterId: companies[0].id })

  const currentPanel = energyDetails.energy_headquarters[0].electrical_panels?.filter((item : any) => item.id ===  Number(panel)) // eslint-disable-line @typescript-eslint/no-explicit-any
  const currentPowers = energyDetails.energy_headquarters[0].powers

  const monitoringGraphReadings = await monitoringGraph({ headquarterId: headquarter, panelId: panel, date_after, date_before, group_by })
  const monitoringLastThreeReadings = await monitoringLastThree({ headquarterId: headquarter, panelId: panel })

  return (
    <div className="w-full">
      <FiltersContainer>
        <HeadquarterEnergyFilter energyHeadquarter={energyDetails.energy_headquarters} />
        <PanelsFilterEnergy energyPanels={energyDetails.energy_headquarters[0].electrical_panels} />
        <DateRangePicker/>
      </FiltersContainer>
      <div className="flex gap-4 mx-6">
        <div className="flex-1">
          <PowerUsageChart readings={monitoringGraphReadings} group={group_by}/>
          <ExcessPower excessPowerData={monitoringLastThreeReadings} panel={currentPanel} powers={currentPowers}/>
        </div>
      </div>
    </div>
  )
}
