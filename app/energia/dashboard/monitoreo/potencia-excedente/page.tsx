// import { getCompanyData } from "@/app/lib/auth";
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
import Link from "next/link";

export default async function page({ searchParams } : SearchParams) {


const { headquarter = '1' , panel = '1',  date_after = new Date(), date_before = new Date(), page = '1'} = await searchParams

  const headquarters  = await getHeadquarters()
  const { results } = headquarters
  const firstHeadquarter = headquarter || results[0].id

const exceededPowers = await exceeded({ headquarterId: firstHeadquarter, panelId: panel, date_after: format(date_after,"yyyy-MM-dd"), date_before: format(date_before,"yyyy-MM-dd"), page})

  return (
    <div className="w-full">
      <FiltersContainer>
        <Link href={'/energia/dashboard/monitoreo/'}
          className="bg-[#00b0c7] rounded-lg absolute top-1/2 left-6 p-2
            transform -translate-y-1/2 cursor-pointer text-white hover:bg-gray-100 hover:text-black"
        >
          <ArrowLeft className="h-4 w-4 "/>
        </Link>
        <HeadquarterEnergyFilter energyHeadquarter={headquarters.results} />
        {/* <PanelsFilterEnergy energyPanels={energyDetails.energy_headquarters[0].electrical_panels} /> */}
        <DatepickerRange />
        <DownloadExcelMonitoreo headquarterId={headquarter} panelId={panel} />
      </FiltersContainer>
      <PowerConsumptionTable exceeded={exceededPowers}/>
    </div>
  )
}
