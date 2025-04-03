import { consume, consumeGraph } from "@/app/sevices/energy/data"
import FiltersContainer from "@/app/ui/filters/filters-container"
import { getCompanyData } from "@/app/lib/auth"
import { getEnergyCompanyDetails } from "@/app/sevices/energy/enterprise/data"
import HeadquarterEnergyFilter from "@/app/ui/energia/filters/headquarter-energy-filter"
import PanelsFilterEnergy from "@/app/ui/energia/filters/panels-energy-filter"
import { DateRangePicker } from "@/app/ui/energia/filters/datepicker-energy-filter"
import MeasurementTable from "@/app/ui/energia/consumo/measurement-table"
import MeasurementGraph from "@/app/ui/energia/consumo/measurement-graph"
import { SearchParams } from "@/app/type"
import { format } from "date-fns"


export default async function Page({ searchParams }: SearchParams) {
  const { companies } = await getCompanyData()

  const { headquarter = '1', panel = '1', date_after = format(new Date(), 'yyyy-MM-dd'), date_before = format(new Date(), 'yyyy-MM-dd'), unit = 'V', indicator = 'P', page = '1', last_by = 'hour', category = 'power' } = await searchParams

  const readings = await consume({
    date_after,
    date_before,
    headquarterId: headquarter,
    panelId: panel,
    page,
    category

  })

  const readingsGraph = await consumeGraph({
    date_after,
    date_before,
    headquarterId: headquarter,
    panelId: panel,
    indicador: indicator,
    category,
    unit,
    last_by
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
        <MeasurementTable readings={readings} category={category} indicator={indicator}/>
        <MeasurementGraph data={readingsGraph} unit={unit} count={readings.count} frequency={last_by} category={category}/>
      </div>
    </div>
  )
}

