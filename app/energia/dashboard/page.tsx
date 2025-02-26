import { consume } from "@/app/sevices/energy/data"
import TableComponent from "@/app/ui/energia/consumo/table"
import FiltersContainer from "@/app/ui/filters/filters-container"
import { getCompanyData } from "@/app/lib/auth"
import { getEnergyCompanyDetails } from "@/app/sevices/energy/enterprise/data"
import HeadquarterEnergyFilter from "@/app/ui/energia/filters/headquarter-energy-filter"
import PanelsFilterEnergy from "@/app/ui/energia/filters/panels-energy-filter"
import { DateRangePicker } from "@/app/ui/energia/filters/datepicker-energy-filter"
import ElectricDashboard from "@/app/ui/energia/consumo/electric-dashboard"

interface PageProps {
  searchParams: {
    headquarter?: string
    panel?: string
    date_after?: string
    date_before?: string
  }
}


export default async function Page({ searchParams }: PageProps) {
  const { companies } = await getCompanyData()

  // Obtener los parámetros de la URL
  // const headquarterId = searchParams.headquarter
  // const panelId = searchParams.panel
  // const dateAfter = searchParams.date_after
  // const dateBefore = searchParams.date_before

  // const readings = await consume({
  //   date_after: dateAfter,
  //   date_before: dateBefore,
  //   headquarterId: headquarterId, // Añadir headquarter_id si existe
  //   panelId: panelId, // Añadir panel_id si existe
  // })

  const energyDetails = await getEnergyCompanyDetails({ headquarterId: companies[0].id })

  return (
    <div className="w-full">
      <FiltersContainer>
        <HeadquarterEnergyFilter energyHeadquarter={energyDetails.energy_headquarters} />
        <PanelsFilterEnergy energyPanels={energyDetails.energy_headquarters[0].electrical_panels} />
        <DateRangePicker/>
      </FiltersContainer>
      {/* <TableComponent readings={readings.results} count={readings.count} />
       */}
       <ElectricDashboard />
    </div>
  )
}

