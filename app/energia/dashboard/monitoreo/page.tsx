// import { getCompanyData } from "@/app/lib/auth";
import { getToken } from "@/app/lib/auth";
import { getHeadquarters } from "@/app/services/energy/enterprise/data";
import { monitoringGraph, monitoringLastThree } from "@/app/services/energy/monitoreo/data";
import { EnergyHeadquarter, SearchParams } from "@/app/type";
import HeadquarterEnergyFilter from "@/app/ui/energia/filters/headquarter-energy-filter";
// import PanelsFilterEnergy from "@/app/ui/energia/filters/panels-energy-filter";
import ExcessPower from "@/app/ui/energia/monitoreo/excess-power";
import DownloadExcelMonitoreo from "@/app/ui/energia/monitoreo/potencia-excedente/download-excel";
import PowerUsageChart from "@/app/ui/energia/monitoreo/power-dashboard";
import { DatepickerRange } from "@/app/ui/filters/datepicker-range";
import FiltersContainer from "@/app/ui/filters/filters-container";
import { format } from "date-fns";
import { Suspense } from "react";
// import { cacheLife } from "next/cache";

// async function GetHeadquarters(token: string) {
//   'use cache'
//   cacheLife('minutes')
//   return await getHeadquarters(token)
// }

// async function GetMonitoringGraph({ headquarterId, date_after, date_before, group_by, token }: { headquarterId: string, panelId: string, date_after: string, date_before: string, group_by: string, token: string }) {
//   'use cache'
//   cacheLife('minutes')
//   return await monitoringGraph({ headquarterId, date_after, date_before, group_by, token })
// }

// async function GetMonitoringLastThree({ headquarterId, token }: { headquarterId: string, panelId: string, token: string }) {
//   'use cache'
//   cacheLife('minutes')
//   return await monitoringLastThree({ headquarterId, token })
// }

async function MonitoreoContent({ searchParams }: SearchParams) {

  const { headquarter, panel = '1', date_after = new Date(), date_before = new Date(), group_by = 'minute' } = await searchParams

  const authToken = await getToken()
  const headquarters = await getHeadquarters(authToken!)
  const { results } = headquarters
  const firstHeadquarter = headquarter || results[0].id.toString()

  const formattedDateAfter = format(date_after, 'yyyy-MM-dd')
  const formattedDateBefore = format(date_before, 'yyyy-MM-dd')

  const [
    monitoringGraphReadings,
    monitoringLastThreeReadings
  ] = await Promise.all([
    monitoringGraph({
      headquarterId: firstHeadquarter,
      panelId: panel,
      date_after: formattedDateAfter,
      date_before: formattedDateBefore,
      group_by,
      token: authToken!
    }),
    monitoringLastThree({
      headquarterId: firstHeadquarter,
      panelId: panel,
      token: authToken!
    })
  ])

  const { electrical_panels } = headquarters?.results.find((hq: EnergyHeadquarter) => hq.id === Number(firstHeadquarter))

  return (
    <div className="w-full">
      <FiltersContainer>
        <HeadquarterEnergyFilter energyHeadquarter={headquarters.results} energy={firstHeadquarter} />
        {/* <PanelsFilterEnergy energyPanels={energyDetails.energy_headquarters?.[0].electrical_panels} /> */}
        <DatepickerRange />
        <DownloadExcelMonitoreo headquarterId={firstHeadquarter} panelId={panel} />
      </FiltersContainer>
      <div className="flex gap-4 mx-6">
        <div className="flex-1">
          <PowerUsageChart readings={monitoringGraphReadings} group={group_by} powers={results[0].powers} />
          <ExcessPower excessPowerData={monitoringLastThreeReadings} panel={electrical_panels[0]} powers={results[0].powers} />
        </div>
      </div>
    </div>
  )
}

export default async function page({ searchParams }: SearchParams) {
  return (
    <div>
      <Suspense fallback={<div>Cargando...</div>}>
        <MonitoreoContent searchParams={searchParams} />
      </Suspense>
    </div>
  )
}