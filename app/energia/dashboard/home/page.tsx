import { consume, consumeGraph } from "@/app/sevices/energy/data"
import FiltersContainer from "@/app/ui/filters/filters-container"
// import { getCompanyData } from "@/app/lib/auth"
import { getEnergyMeasurementPointPanels, getHeadquarters } from "@/app/sevices/energy/enterprise/data"
import HeadquarterEnergyFilter from "@/app/ui/energia/filters/headquarter-energy-filter"
import PanelsFilterEnergy from "@/app/ui/energia/filters/panels-energy-filter"
import MeasurementTable from "@/app/ui/energia/consumo/measurement-table"
import { SearchParams } from "@/app/type"
import { format } from "date-fns"
import { DatepickerRange } from "@/app/ui/filters/datepicker-range"
import Graph from "@/app/ui/energia/consumo/graph"
import DownloadExcel from "@/app/ui/energia/consumo/download-excel"
import { getMeasurementPoints } from "@/app/sevices/filters/data"
import MeasurementPointFilter from "@/app/ui/filters/measurement-points-filter"

export default async function Page({ searchParams }: SearchParams) {
  // const { companies } = await getCompanyData()

  const { headquarter, panel, date_after = new Date(), date_before = new Date(), unit = 'V', indicator = 'P', page = '1', last_by = 'minute', category = 'power', point } = await searchParams

  const formattedDateAfter = format(date_after, 'yyyy-MM-dd')
  const formattedDateBefore = format(date_before, 'yyyy-MM-dd')

  const headquarters = await getHeadquarters()
  const { results } = headquarters

  const firstHeadquarter = headquarter || results[0].id.toString()

  const measurementPointsPanels = await getEnergyMeasurementPointPanels({ headquarterId: firstHeadquarter })

  const firstPanel = panel || measurementPointsPanels?.results[0]?.id.toString()

  const measurementPoints = await getMeasurementPoints({ electricalpanelId: firstPanel })

  const firstPoint = point || measurementPoints?.results[0]?.measurement_points[0].id.toString()

  const [readings, readingsGraph] = await Promise.all([
    consume({
      date_after: formattedDateAfter,
      date_before: formattedDateBefore,
      headquarterId: firstHeadquarter,
      panelId: firstPanel,
      point: firstPoint,
      page,
      category,
    }),
    consumeGraph({
      date_after: formattedDateAfter,
      date_before: formattedDateBefore,
      headquarterId: firstHeadquarter,
      panelId: firstPanel,
      indicador: indicator,
      point: firstPoint,
      category,
      unit,
      last_by,
    }),
  ])


  return (
    <div className="w-full">
      <FiltersContainer>
        <HeadquarterEnergyFilter energyHeadquarter={headquarters.results} energy={firstHeadquarter} />
        <PanelsFilterEnergy energyPanels={measurementPointsPanels.results} panel={firstPanel} />
        <MeasurementPointFilter measurementPoints={measurementPoints} point={firstPoint} />
        <DatepickerRange />
        <DownloadExcel headquarterId={firstHeadquarter} point={firstPoint} panelId={firstPanel} date_after={formattedDateAfter} date_before={formattedDateBefore} unit={unit} />
      </FiltersContainer>
      <div className="flex items-center justify-center min-h-full">
        <MeasurementTable readings={readings} category={category} indicator={indicator} />
        <Graph readingsGraph={readingsGraph} category={category} indicator={indicator} last_by={last_by} readings={readings} />
      </div>
    </div>
  )
}

