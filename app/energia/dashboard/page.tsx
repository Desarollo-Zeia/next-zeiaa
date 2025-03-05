import { consume, consumeGraph } from "@/app/sevices/energy/data"
import FiltersContainer from "@/app/ui/filters/filters-container"
import { getCompanyData } from "@/app/lib/auth"
import { getEnergyCompanyDetails } from "@/app/sevices/energy/enterprise/data"
import HeadquarterEnergyFilter from "@/app/ui/energia/filters/headquarter-energy-filter"
import PanelsFilterEnergy from "@/app/ui/energia/filters/panels-energy-filter"
import { DateRangePicker } from "@/app/ui/energia/filters/datepicker-energy-filter"
import MeasurementTable from "@/app/ui/energia/consumo/measurement-table"
import MeasurementGraph from "@/app/ui/energia/consumo/measurement-graph"

interface PageProps {
  searchParams: {
    headquarter?: string
    panel?: string
    date_after?: string
    date_before?: string,
    unit?: string,
    indicador?: string
  }
}


export default async function Page({ searchParams }: PageProps) {
  const { companies } = await getCompanyData()

  const headquarterId = searchParams.headquarter
  const panelId = searchParams.panel
  const dateAfter = searchParams.date_after
  const dateBefore = searchParams.date_before
  const unitSolid = searchParams.unit
  const indicadorSolid = searchParams.indicador ?? 'Uab'

  const readings = await consume({
    // date_after: dateAfter,
    // date_before: dateBefore,
    headquarterId: headquarterId,
    panelId: panelId,
    unit: unitSolid,
    
  })

  const readingsGraph = await consumeGraph({
    // date_after: dateAfter,
    // date_before: dateBefore,
    headquarterId: headquarterId,
    panelId: panelId,
    unit: unitSolid,
    indicador: indicadorSolid,

  })


  const energyDetails = await getEnergyCompanyDetails({ headquarterId: companies[0].id })

  return (
    <div className="w-full">
      <FiltersContainer>
        <HeadquarterEnergyFilter energyHeadquarter={energyDetails.energy_headquarters} />
        <PanelsFilterEnergy energyPanels={energyDetails.energy_headquarters[0].electrical_panels} />
        <DateRangePicker/>
      </FiltersContainer>
      <div className="flex">
        <MeasurementTable readings={readings}/>
        <MeasurementGraph data={readingsGraph}/>
      </div>

    </div>
  )
}

