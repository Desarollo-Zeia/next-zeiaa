import { consume, consumeGraph } from "@/app/sevices/energy/data"
import FiltersContainer from "@/app/ui/filters/filters-container"
import { getCompanyData } from "@/app/lib/auth"
import { getEnergyCompanyDetails } from "@/app/sevices/energy/enterprise/data"
import HeadquarterEnergyFilter from "@/app/ui/energia/filters/headquarter-energy-filter"
import PanelsFilterEnergy from "@/app/ui/energia/filters/panels-energy-filter"
import MeasurementTable from "@/app/ui/energia/consumo/measurement-table"
import { SearchParams } from "@/app/type"
import { format } from "date-fns"
import { DatepickerRange } from "@/app/ui/filters/datepicker-range"
import Graph from "@/app/ui/energia/consumo/graph"
import DownloadExcel from "@/app/ui/energia/consumo/download-excel"



export default async function Page({ searchParams }: SearchParams) {
  const { companies } = await getCompanyData()

  const { headquarter = '1', panel = '1', date_after = new Date(), date_before = new Date(), unit = 'V', indicator = 'P', page = '1', last_by = 'hour', category = 'power' } = await searchParams

  const readings = await consume({
    date_after: format(date_after, 'yyyy-MM-dd'),
    date_before: format(date_before, 'yyyy-MM-dd'),
    headquarterId: headquarter,
    panelId: panel,
    page,
    category

  })

  const readingsGraph = await consumeGraph({
    date_after: format(date_after, 'yyyy-MM-dd'),
    date_before: format(date_before, 'yyyy-MM-dd'),
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
        <DatepickerRange />
        <DownloadExcel headquarterId={headquarter} panelId={panel} date_after={format(date_after, 'yyyy-MM-dd')} date_before={format(date_before, 'yyyy-MM-dd')} unit={unit}/>
      </FiltersContainer>
      <div className="flex">
        <MeasurementTable readings={readings} category={category} indicator={indicator}/>
        <Graph readingsGraph={readingsGraph} category={category} indicator={indicator} last_by={last_by}/>
      </div>
    </div>
  )
}

