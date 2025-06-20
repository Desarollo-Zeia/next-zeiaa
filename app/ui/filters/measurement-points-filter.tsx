import React from 'react'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type MeasurementPoint = {
  id: number,
  name: string,
  is_active: string,
  channel: string
}


type Device = {
  id: number,
  name: string,
  dev_eui: string,
  model: string,
  phase_type: string,
  number_of_channels: number,
  measurement_points: MeasurementPoint[]
}

interface MeasurementPointResults {
  results: Device[]
}

export default function MeasurementPointFilter({ measurementPoints } : { measurementPoints: MeasurementPointResults}) {

  console.log(measurementPoints.results)
  return (
    <div className='relative'>
      <Select>
        <SelectTrigger className="w-[240px] bg-[#00b0c7]">
          <SelectValue placeholder="Puntos de medición" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {
              measurementPoints.results.map((device) => {
                return (
                  <React.Fragment key={device.id}>
                    <SelectLabel>{device.name}</SelectLabel>
                    {
                      device.measurement_points.map((point) => 
                        (
                          <SelectItem value={point.name} key={point.id}>
                              {point.name}
                          </SelectItem>
                        )
                      )
                    }
                  </React.Fragment>
                )
              })
            }
            
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}
