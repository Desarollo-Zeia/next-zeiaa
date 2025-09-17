import { current, voltage } from "@/app/sevices/energy/desbalance/data";
import { getEnergyMeasurementPointPanels, getHeadquarters } from "@/app/sevices/energy/enterprise/data";
import { getMeasurementPoints } from "@/app/sevices/filters/data";
import { SearchParams } from "@/app/type";
import AlertTable from "@/app/ui/energia/desbalance/alerta/alerts-table";
import HeadquarterEnergyFilter from "@/app/ui/energia/filters/headquarter-energy-filter";
import PanelsFilterEnergy from "@/app/ui/energia/filters/panels-energy-filter";
import { DatepickerRange } from "@/app/ui/filters/datepicker-range";
import FiltersContainer from "@/app/ui/filters/filters-container";
import MeasurementPointFilter from "@/app/ui/filters/measurement-points-filter";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function page({ searchParams }: SearchParams) {


  const { headquarter, panel, point, date_after = new Date(), date_before = new Date(), metric = 'current', page = '1' } = await searchParams

  const headquarters = await getHeadquarters()

  const { results } = headquarters

  const firstHeadquarter = headquarter || results[0].id

  const measurementPointsPanels = await getEnergyMeasurementPointPanels({ headquarterId: firstHeadquarter })

  const firstPanel = panel || measurementPointsPanels?.results[0]?.id.toString()

  const measurementPoints = await getMeasurementPoints({ electricalpanelId: firstPanel })

  const firstPoint = point || measurementPoints?.results[0]?.measurement_points[0].id.toString()

  const currentReadings = await current({
    headquarterId: firstHeadquarter,
    panelId: firstPanel,
    point: firstPoint,
    date_after: format(date_after, "yyyy-MM-dd"),
    date_before: format(date_before, "yyyy-MM-dd"),
    page,
    status: 'unbalanced'
  })

  const voltageReadings = await voltage({
    headquarterId: firstHeadquarter,
    panelId: firstPanel,
    point: firstPoint,
    date_after: format(date_after, "yyyy-MM-dd"),
    date_before: format(date_before, "yyyy-MM-dd"),
    page,
    status: 'unbalanced'
  })

  return (
    <div>
      <FiltersContainer>
        <Link href={'/energia/dashboard/desbalance'}
          className="bg-[#00b0c7] rounded-lg absolute top-1/2 left-6 p-2
            transform -translate-y-1/2 cursor-pointer text-white hover:bg-gray-100 hover:text-black"
        >
          <ArrowLeft className="h-4 w-4 " />
        </Link>
        <HeadquarterEnergyFilter energyHeadquarter={headquarters.results} energy={firstHeadquarter} />
        <PanelsFilterEnergy energyPanels={measurementPointsPanels.results} panel={firstPanel} />
        <MeasurementPointFilter measurementPoints={measurementPoints} point={firstPoint} />
        <DatepickerRange />
      </FiltersContainer>
      <AlertTable readings={metric === 'current' ? currentReadings : voltageReadings} metric={metric} />
    </div>

  )
}
