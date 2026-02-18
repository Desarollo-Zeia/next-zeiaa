export type SearchParams = {
  searchParams: Promise<{ [key: string]: string | undefined }>
}

export type Unit = 'PPM' | 'MG_M3' | 'UG_M3' | 'PERCENT' | 'CELSIUS' | 'ICA' | 'PPB'

export type Indicator = 'CO2' | 'PM10' | 'PM2_5' | 'HCHO' | 'TVOC'

export type Status = 'DANGEROUS' | 'UNHEALTHY' | 'MODERATE' | 'GOOD' | 'CRITICAL'

export type Measurement = {
  date: string,
  hour: string,
  indicator: Indicator,
  status: Status,
  unit: Unit,
  value: number
}


export type Readings = {
  count: number,
  result: Measurement[],
  top: Measurement[]
}

export type GeneralRoomData = {
  headquarter: {
    id: number,
    name: string
  },
  id: number,
  indicators_activated: Indicators[],
  indicators_pollutants: Indicators[],
  is_activated: boolean,
  name: string,
  status: Status,
  thresholds: Record<string, unknown>
}

export interface Room {
  id: number
  name: string
  headquarter: {
    id: number
    name: string
  }
  is_activated: boolean
}

export interface Alert {
  id: number
  alert_status: string
  alert_threshold: {
    id: number
    name: string
    alert_type: string
    measurement: string
    threshold_value: number
    enterprise_id: number
  }
  reading: {
    id: number
    device_id: number
    created_at: string
    EPpos_value?: number
  }
  notes: string
  reported: boolean
}

export interface EnergyHeadquarter {
  id: number
  name: string
  is_active: boolean
  electrical_panels: Array<{
    id: number
    name: string
    is_active: boolean
  }>
  powers: Array<{
    id: number
    type: string
    power_installed: number
    power_contracted: number
    power_max: number
  }>
}

export interface MeasurementPoint {
  id: number
  name: string
  is_active: string
  channel: string
  energy_thresholds?: {
    thresholds_values: unknown
  }
}

export interface Device {
  id: number
  name: string
  dev_eui: string
  model: string
  phase_type: string
  number_of_channels: number
  measurement_points: MeasurementPoint[]
}

export interface MeasurementPointResults {
  results: Device[]
}
