// import { getCompanyData } from "@/app/lib/auth";
import { getEnergyCompanyDetails, getHeadquarters } from "@/app/sevices/energy/enterprise/data";
import { monitoringGraph, monitoringLastThree } from "@/app/sevices/energy/monitoreo/data";
import { SearchParams } from "@/app/type";
import HeadquarterEnergyFilter from "@/app/ui/energia/filters/headquarter-energy-filter";
// import PanelsFilterEnergy from "@/app/ui/energia/filters/panels-energy-filter";
import ExcessPower from "@/app/ui/energia/monitoreo/excess-power";
import DownloadExcelMonitoreo from "@/app/ui/energia/monitoreo/potencia-excedente/download-excel";
import PowerUsageChart from "@/app/ui/energia/monitoreo/power-dashboard";
import { DatepickerRange } from "@/app/ui/filters/datepicker-range";
import FiltersContainer from "@/app/ui/filters/filters-container";
import { format } from "date-fns";

export default async function page({ searchParams } : SearchParams) {


  const { headquarter = '1' , panel = '1',  date_after = new Date(), date_before = new Date(), group_by = 'day'} = await searchParams

  const headquarters  = await getHeadquarters()
  const energyDetails = await getEnergyCompanyDetails()
  const { results } = headquarters
  const firstHeadquarter = headquarter || results[0].id

  // 1) Formateamos fechas solo una vez
  const formattedDateAfter = format(date_after, 'yyyy-MM-dd')
  const formattedDateBefore = format(date_before, 'yyyy-MM-dd')

  // 2) Parale­lizamos las llamadas
  const [
    monitoringGraphReadings,
    monitoringLastThreeReadings
  ] = await Promise.all([
    monitoringGraph({
      headquarterId: firstHeadquarter,
      panelId: panel,
      date_after: formattedDateAfter,
      date_before: formattedDateBefore,
      group_by
    }),
    monitoringLastThree({
      headquarterId: firstHeadquarter,
      panelId: panel
    })
  ])

  // 3) Desestructuramos solo lo que necesitamos
  const hq = energyDetails.energy_headquarters[0]
  const currentPanel = hq.electrical_panels?.find(
    (item : any ) => item.id === Number(panel) // eslint-disable-line @typescript-eslint/no-explicit-any
  )
  const currentPowers = hq.powers

  return (
    <div className="w-full">
      <FiltersContainer>
        <HeadquarterEnergyFilter energyHeadquarter={headquarters.results} energy={firstHeadquarter}/>
        {/* <PanelsFilterEnergy energyPanels={energyDetails.energy_headquarters?.[0].electrical_panels} /> */}
        <DatepickerRange />
        <DownloadExcelMonitoreo headquarterId={headquarter} panelId={panel}/>
      </FiltersContainer>
      <div className="flex gap-4 mx-6">
        <div className="flex-1">
          <PowerUsageChart readings={monitoringGraphReadings} group={group_by} powers={currentPowers}/>
          <ExcessPower excessPowerData={monitoringLastThreeReadings} panel={currentPanel} powers={currentPowers}/>
        </div>
      </div>
    </div>
  )
}
