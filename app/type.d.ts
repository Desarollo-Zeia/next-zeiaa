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
  thresholds: any // eslint-disable-line @typescript-eslint/no-explicit-any
}
