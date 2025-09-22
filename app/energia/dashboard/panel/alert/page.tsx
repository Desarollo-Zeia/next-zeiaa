import { getEnergyMeasurementPointPanels, getHeadquarters } from '@/app/sevices/energy/enterprise/data'
import { getMeasurementPoints } from '@/app/sevices/filters/data'
import { dashboardTableAlerts } from '@/app/sevices/panel/data'
import { SearchParams } from '@/app/type'
// import HeadquarterEnergyFilter from '@/app/ui/energia/filters/headquarter-energy-filter'
import { DatepickerRange } from '@/app/ui/filters/datepicker-range'
import FiltersContainer from '@/app/ui/filters/filters-container'
import MeasurementPointFilter from '@/app/ui/filters/measurement-points-filter'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { format } from 'date-fns'
import React from 'react'

const formatDate = (timestamp: string) => {
  const date = new Date(timestamp)
  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

const formatTime = (timestamp: string) => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
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

const getAlertTypeDescription = (alertType: string, measurement: number) => {
  switch (alertType) {
    case "power_exceeded":
      return `Superó el límite de potencia contratada (${measurement} kW)`
    case "energy_consumption":
      return `Consumo inusual alto en horas no laborables`
    case "load_imbalance":
      return `Desbalance de carga en la fase S`
    default:
      return `Alerta de ${alertType}`
  }
}

export default async function page({ searchParams }: SearchParams) {

  const { headquarter, panel, point, date_after, date_before } = await searchParams

  const formattedDateAfter = date_after ? format(date_after, 'yyyy-MM-dd') : undefined
  const formattedDateBefore = date_before ? format(date_before, 'yyyy-MM-dd') : undefined

  const headquarters = await getHeadquarters()

  const { results } = headquarters
  const firstHeadquarter = headquarter || results[0].id.toString()

  const measurementPointsPanels = await getEnergyMeasurementPointPanels({ headquarterId: firstHeadquarter })

  const firstPanel = panel || measurementPointsPanels?.results[0]?.id.toString()

  const measurementPoints = await getMeasurementPoints({ electricalpanelId: firstPanel })


  const firstPoint = point || measurementPoints?.results[0]?.measurement_points[0].id.toString()

  const dashboardTableAlertsReadings = await dashboardTableAlerts({ headquarterId: firstHeadquarter, point: firstPoint, date_after: formattedDateAfter, date_before: formattedDateBefore })
  return (
    <div className="relative p-6 flex flex-col justify-center gap-8">
      <FiltersContainer>
        {/* <HeadquarterEnergyFilter energyHeadquarter={headquarters.results} energy={firstHeadquarter} /> */}
        <MeasurementPointFilter measurementPoints={measurementPoints} point={firstPoint} />
        <DatepickerRange />
        {/* <PanelsFilterEnergy energyPanels={energyDetails.energy_headquarters?.[0].electrical_panels} /> */}
        {/* <div className='relative flex items-center justify-center'>
                <TriangleAlert className='h-8 w-8' />
                <div className='absolute rounded-full bg-[#59ac77] h-6 w-6 flex items-center justify-center -top-2 -right-2 text-white text-sm p-[2px]'>
                  <p>32</p>
                </div>
              </div> */}
        {/* < AlertTestSheet count={dashboardTableAlertsReadings.count} /> */}
      </FiltersContainer>
      <div>
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
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Equipos</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Fecha/Hora</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Descripción</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Estado</th>
                  </tr>
                </thead>
                <tbody>

                  {dashboardTableAlertsReadings.results.map((alert: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
                    return (

                      <tr key={alert.id} className="border-b hover:bg-muted/50">
                        <td className="py-4 px-4">
                          <div className="font-medium text-black">
                            {/* {alert.alert_threshold.alert_type === "power_exceeded" && "Exceso de potencia"}
                            {alert.alert_threshold.alert_type === "energy_consumption" && "Consumo energético"}
                            {alert.alert_threshold.alert_type === "load_imbalance" && "Desequilibrio de carga"} */}
                            {alert.alert_threshold.name}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="font-medium">{alert.reading.device_name}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="space-y-1">
                            <div className="font-medium">{formatDate(alert.timestamp)}</div>
                            <div className="text-sm text-muted-foreground">{formatTime(alert.timestamp)}</div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="max-w-xs">
                            {getAlertTypeDescription(alert.alert_threshold.alert_type, alert.reading.P)}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="space-y-2">
                            <Badge variant="outline" className={getAlertStatusColor(alert.alert_status)}>
                              {alert.alert_status}
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
        </Card>
      </div>
    </div>
  )
}
