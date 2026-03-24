'use client'

import React, { useState } from 'react'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Building2, Map, Table2 } from 'lucide-react'
import TableComponent from './table'
import FloorPlanViewer from './floor-plan-viewer'
// FloorPlanViewer import hidden - not ready yet
// import FloorPlanViewer from './floor-plan-viewer'

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

export default function PanelViewWrapper({ readings }: PanelViewWrapperProps) {
  const [viewMode, setViewMode] = useState<'table' | 'floorplan'>('table')
  const [selectedFloor, setSelectedFloor] = useState<'ground' | 'first'>('ground')
  const [hoveredPoint, setHoveredPoint] = useState<string | null>(null)

  return (
    <div className='space-y-6'>
      {/* Main Toggle: Table vs Floor Plan */}
      <div className='flex items-center justify-between px-4'>
        <h3 className='font-semibold text-[#6d6c6c]'>
          Tablero de distribución
        </h3>
        {/* <ToggleGroup
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
          <ToggleGroupItem value='floorplan' className='gap-2'>
            <Map className='w-4 h-4' />
            <span className='hidden sm:inline'>Planos</span>
          </ToggleGroupItem>
        </ToggleGroup> */}
      </div>

      {/* Floor selector - hidden - not ready yet */}
      {/* {viewMode === 'floorplan' && (
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
        </div>
      )} */}

      {/* Content */}
      {viewMode === 'table' ? (
        <TableComponent
          readings={readings}
          hoveredPoint={hoveredPoint}
          onRowHover={setHoveredPoint}
        />
      ) : (
        // /* FloorPlanViewer hidden - not ready yet */
        <>
          {/* <FloorPlanViewer
            floor={selectedFloor}
          /> */}
          <TableComponent
            readings={readings}
            hoveredPoint={hoveredPoint}
            onRowHover={setHoveredPoint}
          />
        </>
      )}
    </div>
  )
}
