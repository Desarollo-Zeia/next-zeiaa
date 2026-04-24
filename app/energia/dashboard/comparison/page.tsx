import React, { Suspense } from 'react'
import { EnergyHeadquarter, MeasurementPointResults, SearchParams } from "@/app/type"
import { format } from "date-fns"
import { getEnergyMeasurementPointPanels, getFavorites, getHeadquarters } from '@/app/services/energy/enterprise/data'
import { getMeasurementPoints } from '@/app/services/filters/data'
import FiltersContainer from '@/app/ui/filters/filters-container'
import HeadquarterEnergyFilter from '@/app/ui/energia/filters/headquarter-energy-filter'
import PanelsFilterEnergy, { ElectricalPanel } from '@/app/ui/energia/filters/panels-energy-filter'
import MeasurementPointFilter from '@/app/ui/filters/measurement-points-filter'
import { DatepickerRange } from '@/app/ui/filters/datepicker-range'
import { FiltersSkeleton, GraphSkeleton } from '@/app/ui/energia/consumo/skeletons'
import { getToken } from '@/app/lib/auth'
import { consume, consumeGraphSpecific } from '@/app/services/energy/data'
import ComparisonGraph from '@/app/ui/energia/comparison/comparison-graph'
import ElectricUnitFilter from '@/app/ui/energia/filters/unit-energy-filter'
import Favorites from '@/app/ui/filters/favorites'

interface Favorite {
    id: number,
    name: string,
    measurement_point: number,
    enterprise_id: number,
    energy_headquarter_id: number,
    electrical_panel_id: number
}


interface FavoriteResults {
    results: Favorite[]
}


interface ResolvedParams {
    headquarterId: string
    panelId: string
    pointId: string
    formattedDateAfter: string
    formattedDateBefore: string
    unit: string
    indicator: string
    page: string
    last_by: string
    category: string
    headquarters: EnergyHeadquarter[]
    panels: Array<{ id: number; name: string }>
    measurementPoints: MeasurementPointResults
    headquarterName?: string
    panelName?: string
    measurementPointName?: string,
    favorites: FavoriteResults
}

async function resolveFilterIds(
    searchParams: Record<string, any>,
    token: string
): Promise<ResolvedParams> {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const {
        headquarter,
        panel,
        date_after = today.toISOString(),
        date_before = today.toISOString(),
        unit = 'V',
        indicator = 'P',
        page = '1',
        last_by = 'minute',
        category = 'power',
        point
    } = searchParams

    const parsedDateAfter = new Date(date_after)
    const parsedDateBefore = new Date(date_before)
    const formattedDateAfter = format(parsedDateAfter, 'yyyy-MM-dd')
    const formattedDateBefore = format(parsedDateBefore, 'yyyy-MM-dd')

    const favorites = await getFavorites(token)

    const headquartersPromise = getHeadquarters(token)
    const headquarters = await getHeadquarters(token)
    const headquarterId = headquarter || headquarters.results[0]?.id.toString()
    const headquarterName = headquarters.results.find((h: EnergyHeadquarter) => h.id.toString() === headquarterId)?.name

    const measurementPointsPanels = await getEnergyMeasurementPointPanels({ headquarterId, token })
    const panelId = panel || measurementPointsPanels?.results[0]?.id.toString()
    const panelName = measurementPointsPanels.results.find((p: { id: number; name: string }) => p.id.toString() === panelId)?.name


    const measurementPoints = await getMeasurementPoints({ electricalpanelId: panelId, token })
    const pointId = point || measurementPoints?.results[0]?.measurement_points[0]?.id.toString()
    const measurementPointName = measurementPoints.results
        .flatMap((d: { measurement_points: Array<{ id: number; name: string }> }) => d.measurement_points)
        .find((mp: { id: number; name: string }) => mp.id.toString() === pointId)?.name

    return {
        headquarterId,
        panelId,
        pointId,
        formattedDateAfter,
        formattedDateBefore,
        unit,
        indicator,
        page,
        last_by,
        category,
        headquarters: headquarters.results,
        panels: measurementPointsPanels.results,
        measurementPoints,
        headquarterName,
        panelName,
        measurementPointName,
        favorites
    }
}

async function FiltersSection({
    resolvedPromise,
}: {
    resolvedPromise: Promise<ResolvedParams>
}) {
    const {
        headquarterId,
        panelId,
        pointId,
        formattedDateAfter,
        formattedDateBefore,
        unit,
        headquarters,
        panels,
        measurementPoints,
        favorites
    } = await resolvedPromise

    const energyPanel = (panels.find((p) => p.id.toString() === panelId) as ElectricalPanel | undefined) ?? null
    const energyMeasurementPoint = measurementPoints.results
        .flatMap((device) => device.measurement_points)
        .find((mp) => mp.id.toString() === pointId)?.name ?? ''

    return (
        <FiltersContainer>
            <HeadquarterEnergyFilter energyHeadquarter={headquarters} energy={headquarterId} />
            <PanelsFilterEnergy energyPanels={panels as ElectricalPanel[]} panel={panelId} />
            <MeasurementPointFilter measurementPoints={measurementPoints} point={pointId} />
            <Favorites data={favorites} />
            <DatepickerRange />
        </FiltersContainer>
    )
}


async function GraphicSpecificSection({
    resolvedPromise,
    token
}: {
    token: string
    resolvedPromise: Promise<ResolvedParams>
}) {
    const {
        headquarterId,
        panelId,
        pointId,
        formattedDateAfter,
        formattedDateBefore,
        category,
        indicator,
        unit,
        last_by,
        headquarterName,
        panelName,
        measurementPointName,
    } = await resolvedPromise

    const [readingsGraph] = await Promise.all([
        consumeGraphSpecific({
            date_after: formattedDateAfter,
            date_before: formattedDateBefore,
            headquarterId,
            panelId,
            indicador: 'EPpos',
            point: pointId,
            category: 'energy',
            unit,
            last_by: 'hour',
            token
        }),
        // consume({
        //     date_after: formattedDateAfter,
        //     date_before: formattedDateBefore,
        //     headquarterId,
        //     panelId,
        //     point: pointId,
        //     category,
        //     token
        // })
    ])

    // const indicatorsObject = readings.results?.[0]?.indicators?.values

    // const allIndicators = [] as Array<string>

    // for (const key in indicatorsObject) {
    //     allIndicators.push(key)
    // }

    // const avaibleIndicators = category === 'voltage'
    //     ? allIndicators.filter((indicator) => {
    //         return readings.results?.some((reading: any) => {
    //             const value = reading.indicators.values[indicator]
    //             return value && value > 0
    //         })
    //     })
    //     : allIndicators


    return (
        <ComparisonGraph mock={readingsGraph} category={category} currentIndicator={'EPpos'}
        />
    )
}

export default async function page({ searchParams }: SearchParams) {

    const params = await searchParams
    const authToken = await getToken()
    const resolvedPromise = resolveFilterIds(params, authToken!)


    return (
        <div className='w-full'>
            <Suspense fallback={<FiltersSkeleton />}>
                <FiltersSection resolvedPromise={resolvedPromise} />
                {/* <ElectricUnitFilter /> */}
            </Suspense>
            <div className="w-full">
                <Suspense fallback={<GraphSkeleton />}>
                    <GraphicSpecificSection token={authToken!} resolvedPromise={resolvedPromise} />
                </Suspense>
            </div>
        </div>
    )
}
