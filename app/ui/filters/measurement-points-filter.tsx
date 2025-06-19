import React from 'react'

interface MeasurementPointResults {
  results: Result[]
}

type Result = {
  id: number,
  name: string,
  dev_eui: string,
  model: string,
  phase_type: string,
  number_of_channels: number,
  measurement_points: MeasurementPoint[]
}

type MeasurementPoint = {
  id: number,
  name: string,
  is_active: string,
  channel: string
}

export default function MeasurementPointFilter({ measurementPoints } : { measurementPoints: MeasurementPointResults}) {

  console.log(measurementPoints.results[0])
  return (
    <div>MeasurementPointFilter</div>
  )
}
