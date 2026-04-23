'use client'
import React, { useTransition, useEffect } from 'react'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useFiltersStore } from '@/app/lib/stores/filters-store'

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
  results: Device[],
}

export default function MeasurementPointFilter({ measurementPoints, point }: { measurementPoints: MeasurementPointResults, point: string }) {

  const [isPending, startTransition] = useTransition()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()
  const { pointId, setPoint, syncFromUrl } = useFiltersStore()

  useEffect(() => {
    syncFromUrl(searchParams)
  }, [searchParams, syncFromUrl])

  const currentPointId = pointId || searchParams.get('point') || point

  const handlePointChange = (point: string) => {
    setPoint(point === 'none' ? '' : point)

    startTransition(() => {
      const newParams = new URLSearchParams(searchParams)

      newParams.set('page', '1')

      if (point && point !== 'none') {
        newParams.set('point', point)
      }

      if (point === 'none') {
        newParams.delete('point')
      }

      replace(`${pathname}?${newParams.toString()}`, { scroll: false })
    })
  }



  return (
    <div className='relative'>
      <Select
        onValueChange={handlePointChange}
        disabled={isPending}
        value={currentPointId || point}
      >
        <SelectTrigger className="w-[240px] bg-[#E8E5E5] border-[#E8E5E5] ring-[#E8E5E5] focus:ring-[#E8E5E5] focus:ring-offset-0 text-[#929292] font-medium">
          <SelectValue className="text-[#929292]" placeholder="Puntos de medición" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {
              measurementPoints.results
                .map((device) => {
                  return (
                    <React.Fragment key={device.id}>
                      <SelectLabel>{device.name}</SelectLabel>
                      {
                        device.measurement_points.map((point) =>
                        (
                          <SelectItem value={point.id.toString()} key={point.id} disabled={!point.is_active} >
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
