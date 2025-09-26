import { getEnergyMeasurementPointPanels, getHeadquarters } from '@/app/sevices/energy/enterprise/data'
import { getMeasurementPoints } from '@/app/sevices/filters/data'
import { dashboardTableAlerts } from '@/app/sevices/panel/data'
import { SearchParams } from '@/app/type'
// import HeadquarterEnergyFilter from '@/app/ui/energia/filters/headquarter-energy-filter'
import { DatepickerRange } from '@/app/ui/filters/datepicker-range'
import FiltersContainer from '@/app/ui/filters/filters-container'
import MeasurementPointFilter from '@/app/ui/filters/measurement-points-filter'
import { capitalizeFirstLetter, formattedDateWithHour } from '@/app/utils/func'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { format } from 'date-fns'
import React from 'react'
import { Bell } from "lucide-react"
import PaginationNumberComponent from '@/app/ui/pagination-number'
import NoResultsFound from '@/app/ui/no-result'
import HeadquarterEnergyFilter from '@/app/ui/energia/filters/headquarter-energy-filter'

const formatDate = (timestamp: string) => {
  const date = new Date(timestamp)
  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

const getAlertStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "alto":
      return "bg-red-100 text-red-800 border-red-200"
    case "moderado":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "bajo":
      return "bg-green-100 text-green-800 border-green-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}


export default async function page({ searchParams }: SearchParams) {

  const { headquarter, panel, point, date_after, date_before, page = '1' } = await searchParams

  const formattedDateAfter = date_after ? format(date_after, 'yyyy-MM-dd') : undefined
  const formattedDateBefore = date_before ? format(date_before, 'yyyy-MM-dd') : undefined

  const headquarters = await getHeadquarters()

  const { results } = headquarters
  const firstHeadquarter = headquarter || results[0].id.toString()

  const measurementPointsPanels = await getEnergyMeasurementPointPanels({ headquarterId: firstHeadquarter })

  const firstPanel = panel || measurementPointsPanels?.results[0]?.id.toString()

  const measurementPoints = await getMeasurementPoints({ electricalpanelId: firstPanel })


  const firstPoint = point || measurementPoints?.results[0]?.measurement_points[0].id.toString()

  const dashboardTableAlertsReadings = await dashboardTableAlerts({ headquarterId: firstHeadquarter, point: firstPoint, date_after: formattedDateAfter, date_before: formattedDateBefore, page })

  return (
    <div className="relative h-full p-6 flex flex-col justify-center gap-8">
      <FiltersContainer>
        <HeadquarterEnergyFilter energyHeadquarter={headquarters.results} energy={firstHeadquarter} />
        <MeasurementPointFilter measurementPoints={measurementPoints} point={firstPoint} />
        <DatepickerRange />
      </FiltersContainer>
      <div className='flex-1'>
        {
          dashboardTableAlertsReadings.count > 0 ? (
            <>
              <Card className="relative overflow-hidden w-[350px] mx-auto">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Total de alertas</p>
                      <p className="text-3xl font-bold tracking-tight">{dashboardTableAlertsReadings.count}</p>
                      <p className="text-xs text-muted-foreground">Valor del día actual por defecto.</p>
                    </div>
                    <div className={`rounded-full p-3 bg-accent text-accent-foreground`}>
                      <Bell className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Historial de alertas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Origen de alerta</th>
                          {/* <th className="text-left py-3 px-4 font-medium text-muted-foreground">Equipos</th> */}
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Fecha/Hora</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Descripción</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Estado</th>
                        </tr>
                      </thead>
                      <tbody>

                        {dashboardTableAlertsReadings?.results?.map((alert: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
                          return (

                            <tr key={alert.id} className="border-b hover:bg-muted/50">
                              <td className="py-4 px-4">
                                <div className="font-medium text-black text-md">
                                  {alert.alert_threshold.alert_type}
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                <div className="space-y-1">
                                  <div className="font-medium text-md">{formatDate(alert.reading.created_at)}</div>
                                  <div className="text-sm text-muted-foreground text-md">{formattedDateWithHour(alert.reading.created_at)}</div>
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                <div className="max-w-xs">
                                  {alert.notes}
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                <div className="space-y-2">
                                  <Badge variant="outline" className={getAlertStatusColor(alert.alert_status)}>
                                    {capitalizeFirstLetter(alert.alert_status)}
                                  </Badge>
                                  {alert.reported && (
                                    <Badge variant="secondary" className="block w-fit">
                                      Reportado
                                    </Badge>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )
                        }
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
                <PaginationNumberComponent count={dashboardTableAlertsReadings.count} itemsPerPage={10} />
              </Card>
            </>
          ) : (
            <div className='h-full justify-center items-center'>
              <NoResultsFound message='No se han encontrado alertas con los filtros seleccionados.' />
            </div>
          )
        }

      </div>
    </div>
  )
}
