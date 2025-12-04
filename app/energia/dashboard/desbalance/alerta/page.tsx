import { getToken } from "@/app/lib/auth";
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
// import { cacheLife } from "next/cache";
import Link from "next/link";

// async function GetHeadquarters(token: string) {
//   'use cache'
//   cacheLife('minutes')
//   return await getHeadquarters(token)
// }

// async function GetMeasurementPointsPanels({ token, headquarterId }: { token: string, headquarterId: string }) {
//   'use cache'
//   cacheLife('minutes')

//   return await getEnergyMeasurementPointPanels({ headquarterId, token })
// }

// async function GetMeasurementPoints({ electricalpanelId, token }: { electricalpanelId: string, token: string }) {
//   'use cache'
//   cacheLife('minutes')

//   return await getMeasurementPoints({ electricalpanelId, token })
// }

// async function GetCurrent({ headquarterId, panelId, point, date_after, date_before, page, token, status }: { headquarterId: string, panelId: string, point: string, date_after: string, date_before: string, page: string, token?: string, status?: string }) {
//   'use cache'
//   return await current({ headquarterId, panelId, point, date_after, date_before, page, status: 'unbalanced', token })
// }

// async function GetVoltage({ headquarterId, panelId, point, date_after, date_before, page, status, token }: { headquarterId: string, panelId: string, point: string, date_after: string, date_before: string, page: string, status?: string, token?: string }) {
//   'use cache'
//   return await voltage({ headquarterId, panelId, point, date_after, date_before, page, status: 'unbalanced' })
// }

export default async function page({ searchParams }: SearchParams) {


  const { headquarter, panel, point, date_after = new Date(), date_before = new Date(), metric = 'current', page = '1' } = await searchParams

  const authToken = await getToken()


  const headquarters = await getHeadquarters(authToken!)


  const { results } = headquarters

  const firstHeadquarter = headquarter || results[0].id

  const measurementPointsPanels = await getEnergyMeasurementPointPanels({ headquarterId: firstHeadquarter, token: authToken! })


  const firstPanel = panel || measurementPointsPanels?.results[0]?.id.toString()

  const measurementPoints = await getMeasurementPoints({ electricalpanelId: firstPanel, token: authToken! })


  const firstPoint = point || measurementPoints?.results[0]?.measurement_points[0].id.toString()

  const currentReadings = await current({
    headquarterId: firstHeadquarter,
    panelId: firstPanel,
    point: firstPoint,
    date_after: format(date_after, "yyyy-MM-dd"),
    date_before: format(date_before, "yyyy-MM-dd"),
    page,
    status: 'unbalanced',
    token: authToken!
  })

  const voltageReadings = await voltage({
    headquarterId: firstHeadquarter,
    panelId: firstPanel,
    point: firstPoint,
    date_after: format(date_after, "yyyy-MM-dd"),
    date_before: format(date_before, "yyyy-MM-dd"),
    page,
    status: 'unbalanced',
    token: authToken!
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
