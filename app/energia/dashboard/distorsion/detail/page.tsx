import { getCompanyData } from "@/app/lib/auth"
import { armonics } from "@/app/sevices/energy/distorsion/data"
import { getEnergyCompanyDetails } from "@/app/sevices/energy/enterprise/data"
import { SearchParams } from "@/app/type"
import CurrentVoltageToggle from "@/app/ui/energia/distorsion/current-voltage-toggle"
import CurrentTable from "@/app/ui/energia/distorsion/detail/current-table"
import VoltageTable from "@/app/ui/energia/distorsion/detail/voltage-table"
import { DateRangePicker } from "@/app/ui/energia/filters/datepicker-energy-filter"
import HeadquarterEnergyFilter from "@/app/ui/energia/filters/headquarter-energy-filter"
import PanelsFilterEnergy from "@/app/ui/energia/filters/panels-energy-filter"
import FiltersContainer from "@/app/ui/filters/filters-container"
import NoResultFound from "@/app/ui/no-result-found"
import { Card } from "@/components/ui/card"
import { format } from "date-fns"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function page({ searchParams } : SearchParams) {

const { companies } = await getCompanyData()
    
const { headquarter = '1' , panel = '1',  date_after = new Date(), date_before = new Date(), data_type = 'current', page = '1'} = await searchParams

const energyDetails = await getEnergyCompanyDetails({ headquarterId: companies[0].id })

 const armonicsReadings = await armonics({ headquarterId: headquarter, panelId: panel, date_after: format(date_after, 'yyyy-MM-dd'), date_before: format(date_before, 'yyyy-MM-dd'), data_type, page })

  return (
    <div className="w-full">
        <FiltersContainer>
            <Link href={'/energia/dashboard/distorsion'}
            className="bg-[#00b0c7] rounded-lg absolute top-1/2 left-6 p-2
                transform -translate-y-1/2 cursor-pointer text-white hover:bg-gray-100 hover:text-black"
            >
            <ArrowLeft className="h-4 w-4 "/>
            </Link>
            <HeadquarterEnergyFilter energyHeadquarter={energyDetails.energy_headquarters} />
            <PanelsFilterEnergy energyPanels={energyDetails.energy_headquarters[0].electrical_panels} />
            <DateRangePicker/>
        </FiltersContainer>
        <Card className="w-full p-6 flex flex-col gap-4">
            <CurrentVoltageToggle type={data_type}/>
            <div className="overflow-x-auto">
                {
                armonicsReadings?.count > 0 ? 
                (
                    data_type === 'current' ? 
                    (
                        <CurrentTable readings={armonicsReadings}/>
                    ) : 
                    (
                        <VoltageTable readings={armonicsReadings}/>
                    )
                ) : 
                (
                    <NoResultFound/>
                )
                }
            
            </div>
        </Card>

    </div>
  )
}
