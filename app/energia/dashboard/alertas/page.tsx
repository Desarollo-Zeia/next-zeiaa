import { getEnergyMeasurementPointPanels, getFavorites, getHeadquarters } from "@/app/services/energy/enterprise/data"
import FiltersContainer from "@/app/ui/filters/filters-container"
import HeadquarterEnergyFilter from "@/app/ui/energia/filters/headquarter-energy-filter"
import PanelsFilterEnergy, { ElectricalPanel } from "@/app/ui/energia/filters/panels-energy-filter"
import { EnergyHeadquarter, MeasurementPointResults, SearchParams } from "@/app/type"
import { format } from "date-fns"
import { DatepickerRange } from "@/app/ui/filters/datepicker-range"
import { getMeasurementPoints } from "@/app/services/filters/data"
import MeasurementPointFilter from "@/app/ui/filters/measurement-points-filter"
import { getToken } from "@/app/lib/auth"
import { Suspense } from "react"
import { FiltersSkeleton, TableSkeleton } from "@/app/ui/energia/consumo/skeletons"
import Favorites from "@/app/ui/filters/favorites"
import { getVoltageFluctuationLatestByPhase } from "@/app/services/alerts/data"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Bell } from "lucide-react"
import FluctuationSubtypeToggle from "@/app/ui/energia/alertas/fluctuation-toggle"
import DownloadExcelAlert from "@/app/ui/energia/alertas/download-excel-alert"
import NoResultFound from "@/app/ui/no-result-found"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface Favorite {
    id: number
    name: string
    measurement_point: number
    enterprise_id: number
    energy_headquarter_id: number
    electrical_panel_id: number
}

interface Favorites {
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
    measurementPointName?: string
    favorites: Favorites
}

interface LatestAlert {
    id: number
    indicator_name: string
    subindicator_name: string
    origin: string
    date: string
    time: string
    limit: number
    value: number
    device_id: number
    device_name: string
    measurement_point_id: number
    measurement_point_name: string
    status: string
    alert_status: string
    notes: string
}

interface LatestByPhaseResponse {
    today_count: number
    results: LatestAlert[]
}

async function resolveFilterIds(
    searchParams: Record<string, any>,
    token: string
): Promise<ResolvedParams> {
    const {
        headquarter,
        panel,
        date_after = new Date(),
        date_before = new Date(),
        unit = 'V',
        indicator = 'P',
        page = '1',
        last_by = 'minute',
        category = 'power',
        point
    } = searchParams

    const formattedDateAfter = format(date_after, 'yyyy-MM-dd')
    const formattedDateBefore = format(date_before, 'yyyy-MM-dd')

    const favorites = await getFavorites(token)
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
        headquarters,
        panels,
        measurementPoints,
        favorites
    } = await resolvedPromise

    return (
        <FiltersContainer>
            <HeadquarterEnergyFilter energyHeadquarter={headquarters} energy={headquarterId} />
            <PanelsFilterEnergy energyPanels={panels as ElectricalPanel[]} panel={panelId} />
            <MeasurementPointFilter measurementPoints={measurementPoints} point={pointId} />
            <Favorites data={favorites} />
            {/* <DatepickerRange /> */}
        </FiltersContainer>
    )
}

async function AlertsSummarySection({
    pointId,
    fluctuationSubtype,
    token,
}: {
    pointId: string
    fluctuationSubtype: string
    token: string
}) {
    const latestAlerts: LatestByPhaseResponse = await getVoltageFluctuationLatestByPhase({
        measurement_point: pointId,
        fluctuation_subtype: fluctuationSubtype,
        token,
    })

    return (
        <div className="space-y-6">
            {/* Card de alertas del día */}
            <div className="flex flex-col items-center w-full gap-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Bell className="h-5 w-5" />
                    <span className="text-sm font-medium">Total de alertas registradas hoy</span>
                </div>
                <Card className="w-full max-w-xs overflow-hidden">
                    <CardHeader className="bg-[#00b0c7] py-3 flex items-center justify-center">
                        <span className="text-md font-semibold text-white uppercase tracking-wide">Voltaje</span>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center gap-3 py-6">
                        <div className="text-4xl font-bold text-[#64656B]">{latestAlerts.today_count}</div>
                        <span className="text-sm text-muted-foreground font-medium">Alertas</span>
                    </CardContent>
                </Card>
            </div>

            {/* Título de la sección */}
            <div className="space-y-1">
                <h2 className="text-lg font-semibold text-gray-900">Tabla de últimas alertas registradas</h2>
                <p className="text-sm text-muted-foreground">Selecciona el origen de la alerta que necesitas verificar</p>
            </div>

            {/* Botón de historial arriba */}
            <div className="flex justify-end">
                <Link href="/energia/dashboard/alertas/historial">
                    <Button className="text-white px-4 py-2 rounded bg-[#00b0c7]">
                        Ver historial de alertas
                    </Button>
                </Link>
            </div>

            {/* Toggle de fluctuation_subtype y botón de descarga */}
            <div className="flex justify-between items-center">
                <FluctuationSubtypeToggle />
                <DownloadExcelAlert
                    measurement_point={pointId}
                    fluctuation_subtype={fluctuationSubtype}
                />
            </div>

            {/* Tabla de últimas alertas por fase */}
            <Card className="w-full">
                <CardContent className="px-6 py-4">
                    {latestAlerts.results && latestAlerts.results.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-sm font-medium text-muted-foreground px-4">Indicador</TableHead>
                                    <TableHead className="text-sm font-medium text-muted-foreground px-4">Subindicador</TableHead>
                                    <TableHead className="text-sm font-medium text-muted-foreground px-4">Origen</TableHead>
                                    <TableHead className="text-sm font-medium text-muted-foreground px-4">Fecha</TableHead>
                                    <TableHead className="text-sm font-medium text-muted-foreground px-4">Hora</TableHead>
                                    <TableHead className="text-sm font-medium text-muted-foreground px-4">Límite</TableHead>
                                    <TableHead className="text-sm font-medium text-muted-foreground px-4">Valor</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {latestAlerts.results.map((alert) => (
                                    <TableRow key={alert.id}>
                                        <TableCell className="text-sm px-4">{alert.indicator_name}</TableCell>
                                        <TableCell className="text-sm px-4">{alert.subindicator_name}</TableCell>
                                        <TableCell className="text-sm px-4">{alert.origin}</TableCell>
                                        <TableCell className="text-sm px-4">{alert.date}</TableCell>
                                        <TableCell className="text-sm px-4">{alert.time}</TableCell>
                                        <TableCell className="text-sm px-4">{alert.limit}</TableCell>
                                        <TableCell className="text-sm px-4">{alert.value}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="py-8">
                            <NoResultFound />
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export default async function page({ searchParams }: SearchParams) {
    const params = await searchParams
    const authToken = await getToken()
    const resolvedPromise = resolveFilterIds(params, authToken!)
    const resolved = await resolvedPromise
    const fluctuationSubtype = params.fluctuation_subtype ?? 'undervoltage'

    return (
        <div className="w-full space-y-6 px-6 md:px-10 py-6">
            <Suspense fallback={<FiltersSkeleton />}>
                <FiltersSection resolvedPromise={resolvedPromise} />
            </Suspense>

            <Suspense fallback={<TableSkeleton />}>
                <AlertsSummarySection
                    pointId={resolved.pointId}
                    fluctuationSubtype={fluctuationSubtype as string}
                    token={authToken!}
                />
            </Suspense>
        </div>
    )
}
