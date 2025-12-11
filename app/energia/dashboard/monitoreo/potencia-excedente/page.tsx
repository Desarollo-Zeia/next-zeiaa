// import { getCompanyData } from "@/app/lib/auth";
import { getToken } from "@/app/lib/auth";
import { getHeadquarters } from "@/app/sevices/energy/enterprise/data";
import { exceeded } from "@/app/sevices/energy/monitoreo/data";
import { SearchParams } from "@/app/type";
import HeadquarterEnergyFilter from "@/app/ui/energia/filters/headquarter-energy-filter";
// import PanelsFilterEnergy from "@/app/ui/energia/filters/panels-energy-filter";
import DownloadExcelMonitoreo from "@/app/ui/energia/monitoreo/potencia-excedente/download-excel";
import PowerConsumptionTable from "@/app/ui/energia/monitoreo/potencia-excedente/power-consumption-table";
import { DatepickerRange } from "@/app/ui/filters/datepicker-range";
import FiltersContainer from "@/app/ui/filters/filters-container";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";
// import { cacheLife } from "next/cache";
import Link from "next/link";
import { Suspense } from "react";

// async function GetHeadquarters(token: string) {
//   'use cache'
//   cacheLife('hours')
//   return await getHeadquarters(token)
// }

// async function GetExceededPowers({ headquarterId, panelId, date_after, date_before, page, token }: { headquarterId: string, panelId: string, date_after: string, date_before: string, page: string, token: string }) {
//   'use cache'
//   cacheLife('minutes')
//   return await exceeded({ headquarterId, panelId, date_after, date_before, page, token })
// }

async function MonitoreoPotenciaExcedente({ searchParams }: SearchParams) {


  const { headquarter, panel = '1', date_after = new Date(), date_before = new Date(), page = '1' } = await searchParams

  const authToken = await getToken()


  const headquarters = await getHeadquarters(authToken!)
  const { results } = headquarters
  const firstHeadquarter = headquarter || results[0].id.toString()

  const exceededPowers = await exceeded({ headquarterId: firstHeadquarter, panelId: panel, date_after: format(date_after, "yyyy-MM-dd"), date_before: format(date_before, "yyyy-MM-dd"), page, token: authToken! })

  return (
    <div className="w-full">
      <FiltersContainer>
        <Link href={'/energia/dashboard/monitoreo/'}
          className="bg-[#00b0c7] rounded-lg absolute top-1/2 left-6 p-2
            transform -translate-y-1/2 cursor-pointer text-white hover:bg-gray-100 hover:text-black"
        >
          <ArrowLeft className="h-4 w-4 " />
        </Link>
        <HeadquarterEnergyFilter energyHeadquarter={headquarters.results} energy={firstHeadquarter} />
        {/* <PanelsFilterEnergy energyPanels={energyDetails.energy_headquarters[0].electrical_panels} /> */}
        <DatepickerRange />
        <DownloadExcelMonitoreo headquarterId={firstHeadquarter} panelId={panel} />
      </FiltersContainer>
      <PowerConsumptionTable exceeded={exceededPowers} />
    </div>
  )
}


export default async function page({ searchParams }: SearchParams) {
  return (
    <div>
      <Suspense fallback={<div>Cargando...</div>}>
        <MonitoreoPotenciaExcedente searchParams={searchParams} />
      </Suspense>
    </div>
  )
}
