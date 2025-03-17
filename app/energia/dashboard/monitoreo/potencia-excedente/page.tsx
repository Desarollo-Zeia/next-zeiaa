import { getCompanyData } from "@/app/lib/auth";
import { getEnergyCompanyDetails } from "@/app/sevices/energy/enterprise/data";
import { DateRangePicker } from "@/app/ui/energia/filters/datepicker-energy-filter";
import HeadquarterEnergyFilter from "@/app/ui/energia/filters/headquarter-energy-filter";
import PanelsFilterEnergy from "@/app/ui/energia/filters/panels-energy-filter";
import PowerConsumptionTable from "@/app/ui/energia/monitoreo/potencia-excedente/power-consumption-table";
import FiltersContainer from "@/app/ui/filters/filters-container";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function page() {

  const { companies } = await getCompanyData()
  const energyDetails = await getEnergyCompanyDetails({ headquarterId: companies[0].id })

  return (
    <div className="w-full">
      <FiltersContainer>
        <Link href={'/energia/dashboard/monitoreo/'}
          className="bg-[#00b0c7] rounded-lg absolute top-1/2 left-6 p-2
            transform -translate-y-1/2 cursor-pointer text-white hover:bg-gray-100 hover:text-black"
        >
          <ArrowLeft className="h-4 w-4 "/>
        </Link>
        <HeadquarterEnergyFilter energyHeadquarter={energyDetails.energy_headquarters} />
        <PanelsFilterEnergy energyPanels={energyDetails.energy_headquarters[0].electrical_panels} />
        <DateRangePicker/>
      </FiltersContainer>
      <PowerConsumptionTable/>
    </div>
  )
}
