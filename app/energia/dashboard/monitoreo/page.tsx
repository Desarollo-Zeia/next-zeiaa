import { getCompanyData } from "@/app/lib/auth";
import { getEnergyCompanyDetails } from "@/app/sevices/energy/enterprise/data";
import { monitoringGraph, monitoringLastThree } from "@/app/sevices/energy/monitoreo/data";
import { SearchParams } from "@/app/type";
import HeadquarterEnergyFilter from "@/app/ui/energia/filters/headquarter-energy-filter";
import PanelsFilterEnergy from "@/app/ui/energia/filters/panels-energy-filter";
import ExcessPower from "@/app/ui/energia/monitoreo/excess-power";
import PowerUsageChart from "@/app/ui/energia/monitoreo/power-dashboard";
import { DatepickerRange } from "@/app/ui/filters/datepicker-range";
import FiltersContainer from "@/app/ui/filters/filters-container";
import { format } from "date-fns";

export default async function page({ searchParams } : SearchParams) {

  const { companies } = await getCompanyData()

  const { headquarter = '1' , panel = '1',  date_after = new Date(), date_before = new Date(), group_by} = await searchParams

  // 1) Formateamos fechas solo una vez
  const formattedDateAfter = format(date_after, 'yyyy-MM-dd')
  const formattedDateBefore = format(date_before, 'yyyy-MM-dd')

  // 2) Parale­lizamos las llamadas
  const [
    energyDetails,
    monitoringGraphReadings,
    monitoringLastThreeReadings
  ] = await Promise.all([
    getEnergyCompanyDetails({
      headquarterId: companies[0].id
    }),
    monitoringGraph({
      headquarterId: headquarter,
      panelId: panel,
      date_after: formattedDateAfter,
      date_before: formattedDateBefore,
      group_by: 'hour'
    }),
    monitoringLastThree({
      headquarterId: headquarter,
      panelId: panel
    })
  ])

  // 3) Desestructuramos solo lo que necesitamos
  const hq = energyDetails.energy_headquarters[0]
  const currentPanel = hq.electrical_panels?.find(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (item : any ) => item.id === Number(panel)
  )
  const currentPowers = hq.powers

  return (
    <div className="w-full">
      <FiltersContainer>
        <HeadquarterEnergyFilter energyHeadquarter={energyDetails.energy_headquarters} />
        <PanelsFilterEnergy energyPanels={energyDetails.energy_headquarters[0].electrical_panels} />
        <DatepickerRange />
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
