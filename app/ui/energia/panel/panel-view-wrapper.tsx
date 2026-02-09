'use client'

import React, { useState, useMemo } from 'react'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Table2, Map, Building2 } from 'lucide-react'
import TableComponent from './table'
import FloorPlanViewer from './floor-plan-viewer'

interface PointData {
  id: number
  name: string
  key: string
  type: string
  is_active: boolean
  channel: string
  capacity: string
  hardware: string
  device: string
  dev_eui: string
  electrical_panel: string
  location_reference: string
}

interface PanelViewWrapperProps {
  readings: {
    count: number
    next: string
    previous: string
    results: PointData[]
  }
}

function getTableroImage(name: string, key: string): string | null {
  const searchText = (name + ' ' + key).toLowerCase()

  if (searchText.includes('tn-p') || searchText.includes('te-p') || searchText.includes('tn-te')) {
    return '/images/tableros/tn-te-TGA.JPG'
  }
  if (searchText.includes('pediatria') || searchText.includes('semisotano')) {
    return '/images/tableros/tablero-pediatria-semisotano-TGA.JPG'
  }
  if (searchText.includes('tomografo') || searchText.includes('tg-rt')) {
    return '/images/tableros/tomografo-TG-RT.jpg'
  }
  if (searchText.includes('llave general') && searchText.includes('p1')) {
    return '/images/tableros/llave-general-TG-P1.JPG'
  }
  if (searchText.includes('llave general') && searchText.includes('tga')) {
    return '/images/tableros/llave-general-TGA.JPG'
  }
  if (searchText.includes('bombas') || searchText.includes('fuerza')) {
    return '/images/tableros/llave-general-bombas-FUERZA.jpg'
  }
  if (searchText.includes('aire acondicionado') || searchText.includes('ac')) {
    return '/images/tableros/aire-acondicionado-TGA.JPG'
  }
  if (searchText.includes('ascensor')) {
    return '/images/tableros/ascensor-derecho-TGA.JPG'
  }
  if (searchText.includes('data center') || searchText.includes('ups')) {
    return '/images/tableros/data-center-ups-TGA.JPG'
  }
  if (searchText.includes('hemodialisis')) {
    return '/images/tableros/hemodialisis-TGA.JPG'
  }
  if (searchText.includes('resonador')) {
    return '/images/tableros/resonador-TGA.JPG'
  }
  if (searchText.includes('rx') || searchText.includes('pb')) {
    return '/images/tableros/rx-pb-TGA.JPG'
  }
  if (searchText.includes('sala operaciones') || searchText.includes('qx')) {
    return '/images/tableros/sala-operaciones-TGA.JPG'
  }

  return null
}

function isGroundFloor(name: string): boolean {
  const firstFloorOnly = ['tomografo']
  const lowerName = name.toLowerCase()
  return !firstFloorOnly.some(keyword => lowerName.includes(keyword))
}

export default function PanelViewWrapper({ readings }: PanelViewWrapperProps) {
  const [viewMode, setViewMode] = useState<'table' | 'floorplan'>('table')
  const [selectedFloor, setSelectedFloor] = useState<'ground' | 'first'>('ground')
  const [hoveredPoint, setHoveredPoint] = useState<string | null>(null)

  const pointsForFloorPlan = useMemo(() => {
    return readings.results.map(reading => {
      const imageUrl = getTableroImage(reading.name, reading.key)
      return {
        id: reading.id,
        name: reading.name,
        key: reading.key,
        type: reading.type,
        hasImage: !!imageUrl,
        imageUrl: imageUrl,
      }
    })
  }, [readings.results])

  const groundFloorPoints = useMemo(() => {
    return pointsForFloorPlan.filter(point => isGroundFloor(point.name))
  }, [pointsForFloorPlan])

  const firstFloorPoints = useMemo(() => {
    return pointsForFloorPlan.filter(point => !isGroundFloor(point.name))
  }, [pointsForFloorPlan])

  const currentFloorPoints = selectedFloor === 'ground' ? groundFloorPoints : firstFloorPoints

  return (
    <div className='space-y-6'>
      {/* Main Toggle: Table vs Floor Plan */}
      <div className='flex items-center justify-between px-4'>
        <h3 className='font-semibold text-[#6d6c6c]'>
          {viewMode === 'table' ? 'Tablero de distribución' : 'Planos de ubicación'}
        </h3>
        <ToggleGroup
          type='single'
          value={viewMode}
          onValueChange={(value) => {
            if (value) setViewMode(value as 'table' | 'floorplan')
          }}
          className='border rounded-lg p-1'
        >
          <ToggleGroupItem value='table' className='gap-2'>
            <Table2 className='w-4 h-4' />
            <span className='hidden sm:inline'>Tabla</span>
          </ToggleGroupItem>
          {/* Temporarily hidden - Planos not complete
          <ToggleGroupItem value='floorplan' className='gap-2'>
            <Map className='w-4 h-4' />
            <span className='hidden sm:inline'>Planos</span>
          </ToggleGroupItem>
          */}
        </ToggleGroup>
      </div>

      {/* Floor Selector temporarily hidden - Planos not complete
      {viewMode === 'floorplan' && (
        <div className='flex items-center gap-4 px-4 pb-2'>
          <span className='text-sm text-gray-600'>Piso:</span>
          <ToggleGroup
            type='single'
            value={selectedFloor}
            onValueChange={(value) => {
              if (value) setSelectedFloor(value as 'ground' | 'first')
            }}
            className='border rounded-lg p-1'
          >
            <ToggleGroupItem value='ground' className='gap-2'>
              <Building2 className='w-4 h-4' />
              <span>Planta Baja</span>
            </ToggleGroupItem>
            <ToggleGroupItem value='first' className='gap-2'>
              <Building2 className='w-4 h-4' />
              <span>Primer Piso</span>
            </ToggleGroupItem>
          </ToggleGroup>
          <span className='text-sm text-gray-500'>
            ({currentFloorPoints.length} puntos)
          </span>
        </div>
      )}
      */}

      {/* Content - Table only (Planos temporarily hidden) */}
      <TableComponent
        readings={readings}
        hoveredPoint={hoveredPoint}
        onRowHover={setHoveredPoint}
      />
    </div>
  )
}
