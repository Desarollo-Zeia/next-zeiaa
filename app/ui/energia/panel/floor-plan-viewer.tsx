'use client'

import React, { useMemo } from 'react'
import Image from 'next/image'
import { Camera, CameraOff } from 'lucide-react'
import FloorPlanPin from './floor-plan-pin'

interface PointData {
  id: number
  name: string
  key: string
  type: string
  hasImage: boolean
  imageUrl: string | null
}

interface FloorPlanViewerProps {
  floor: 'ground' | 'first'
  points: PointData[]
  hoveredPoint: string | null
  onPointHover: (pointName: string | null) => void
}

const COLOR_MAP: Record<string, string> = {
  'llave-general': '#ef4444', // Rojo
  'medical': '#3b82f6', // Azul
  'climatization': '#22c55e', // Verde
  'infrastructure': '#eab308', // Amarillo
  'services': '#a855f7', // Púrpura
  'distribution': '#f97316', // Naranja
}

const POINT_CATEGORIES: Record<string, string> = {
  'Llave General': 'llave-general',
  'Tomógrafo': 'medical',
  'Resonador': 'medical',
  'RX': 'medical',
  'Aire Acondicionado': 'climatization',
  'Ascensor': 'infrastructure',
  'Data Center': 'infrastructure',
  'UPS': 'infrastructure',
  'Hemodiálisis': 'services',
  'Sala Operaciones': 'services',
  'TN-P': 'distribution',
  'TE-P': 'distribution',
  'TN-TE': 'distribution',
  'Pediatría': 'distribution',
  'Bomba': 'llave-general',
}

function getPointCategory(name: string): string {
  for (const [keyword, category] of Object.entries(POINT_CATEGORIES)) {
    if (name.toLowerCase().includes(keyword.toLowerCase())) {
      return category
    }
  }
  return 'distribution'
}

function getPointColor(name: string): string {
  const category = getPointCategory(name)
  return COLOR_MAP[category] || COLOR_MAP['distribution']
}

const GROUND_FLOOR_POINTS: Record<string, { x: number; y: number }> = {
  'TN-P-12/TE-P-12': { x: 20, y: 30 },
  'Llave General TGA': { x: 50, y: 20 },
  'Llave General P1': { x: 75, y: 25 },
  'Bombas de Fuerza': { x: 85, y: 40 },
  'Aire Acondicionado TGA': { x: 15, y: 55 },
  'Ascensor Derecho': { x: 40, y: 60 },
  'Data Center UPS': { x: 60, y: 50 },
  'Hemodiálisis': { x: 25, y: 75 },
  'Resonador': { x: 55, y: 70 },
  'RX PB': { x: 80, y: 65 },
  'Sala Operaciones': { x: 45, y: 85 },
  'Tablero Pediatría Semisótano': { x: 70, y: 80 },
}

const FIRST_FLOOR_POINTS: Record<string, { x: number; y: number }> = {
  'Tomógrafo TG-RT': { x: 50, y: 50 },
}

const LEGEND_ITEMS = [
  { color: COLOR_MAP['llave-general'], label: 'Llaves Generales' },
  { color: COLOR_MAP['medical'], label: 'Equipos Médicos' },
  { color: COLOR_MAP['climatization'], label: 'Climatización' },
  { color: COLOR_MAP['infrastructure'], label: 'Infraestructura' },
  { color: COLOR_MAP['services'], label: 'Servicios' },
  { color: COLOR_MAP['distribution'], label: 'Distribución' },
]

export default function FloorPlanViewer({
  floor,
  points,
  hoveredPoint,
  onPointHover,
}: FloorPlanViewerProps) {
  const imageSrc = floor === 'ground' 
    ? '/images/planos/planta-baja.jpg' 
    : '/images/planos/primer-piso.jpg'

  const coordinateMap = floor === 'ground' ? GROUND_FLOOR_POINTS : FIRST_FLOOR_POINTS

  const pointsWithCoordinates = useMemo(() => {
    return points.map((point, index) => {
      const coords = coordinateMap[point.name] || {
        x: 20 + (index * 15) % 70,
        y: 20 + (index * 20) % 60,
      }
      
      return {
        ...point,
        x: coords.x,
        y: coords.y,
        color: getPointColor(point.name),
      }
    })
  }, [points, coordinateMap])

  const totalPoints = pointsWithCoordinates.length
  const pointsWithImages = pointsWithCoordinates.filter((p) => p.hasImage).length

  return (
    <div className='flex flex-col gap-4'>
      {/* Header */}
      <div className='flex items-center justify-between px-4'>
        <h3 className='font-semibold text-[#6d6c6c]'>
          {floor === 'ground' ? 'Planta Baja' : 'Primer Piso'}
        </h3>
        <div className='text-sm text-gray-600'>
          {pointsWithImages} de {totalPoints} puntos con foto
        </div>
      </div>

      {/* Floor Plan Container */}
      <div className='flex gap-6'>
        {/* Main Image Area */}
        <div className='relative flex-1 border rounded-lg overflow-hidden bg-gray-100'>
          <div className='relative w-full aspect-[4/3]'>
            <Image
              src={imageSrc}
              alt={`Plano ${floor === 'ground' ? 'Planta Baja' : 'Primer Piso'}`}
              fill
              className='object-contain'
              sizes='(max-width: 1200px) 100vw, 800px'
              priority
            />
            
            {/* Pins Layer */}
            <div className='absolute inset-0'>
              {pointsWithCoordinates.map((point) => (
                <FloorPlanPin
                  key={point.id}
                  name={point.name}
                  key_name={point.key}
                  type={point.type}
                  hasImage={point.hasImage}
                  imageUrl={point.imageUrl}
                  color={point.color}
                  x={point.x}
                  y={point.y}
                  isHovered={hoveredPoint === point.name}
                  onHover={onPointHover}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className='w-64 bg-gray-50 rounded-lg p-4 h-fit'>
          <h4 className='font-semibold text-sm mb-3 text-gray-700'>Leyenda</h4>
          <div className='space-y-2'>
            {LEGEND_ITEMS.map((item) => (
              <div key={item.label} className='flex items-center gap-2'>
                <div
                  className='w-4 h-4 rounded-full border border-white shadow'
                  style={{ backgroundColor: item.color }}
                />
                <span className='text-xs text-gray-600'>{item.label}</span>
              </div>
            ))}
          </div>
          
          <div className='mt-4 pt-4 border-t border-gray-200'>
            <div className='flex items-center gap-2 mb-2'>
              <div className='w-4 h-4 rounded-full bg-gray-400 border border-white shadow flex items-center justify-center'>
                <CameraOff className='w-2 h-2 text-white' />
              </div>
              <span className='text-xs text-gray-600'>Sin foto</span>
            </div>
            <div className='flex items-center gap-2'>
              <div className='w-4 h-4 rounded-full bg-gray-400 border border-white shadow flex items-center justify-center'>
                <Camera className='w-2 h-2 text-white' />
              </div>
              <span className='text-xs text-gray-600'>Con foto</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
