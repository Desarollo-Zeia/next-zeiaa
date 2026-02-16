'use client'

import React, { useMemo } from 'react'
import Image from 'next/image'
import { Camera, CameraOff, ImageIcon } from 'lucide-react'
import FloorPlanPin from './floor-plan-pin'

interface PanelData {
  id: number
  name: string
  key: string
  type: string
  hasImage: boolean
  imageUrl: string | null
}

interface FloorPlanViewerProps {
  floor: 'ground' | 'first'
  panels: PanelData[]
  hoveredPoint: string | null
  onPointHover: (panelName: string | null) => void
}

const COLOR_MAP: Record<string, string> = {
  'llave-general': '#ef4444', // Rojo
  'medical': '#3b82f6', // Azul
  'climatization': '#22c55e', // Verde
  'infrastructure': '#eab308', // Amarillo
  'services': '#a855f7', // Púrpura
  'distribution': '#f97316', // Naranja
}

// Coordenadas de tableros según las imágenes proporcionadas
// Planta Baja: Cuarto de bombas, TG P1, TGA-N
const GROUND_FLOOR_PANELS: Record<string, { x: number; y: number }> = {
  'Cuarto de bombas': { x: 15, y: 45 },
  'TG P1': { x: 75, y: 25 },
  'TGA-N': { x: 50, y: 55 },
  // Fallback para otros tableros que puedan existir
  'default': { x: 50, y: 50 },
}

// Primer Piso: Tablero en el centro
const FIRST_FLOOR_PANELS: Record<string, { x: number; y: number }> = {
  'Tablero Principal': { x: 50, y: 50 },
  // Fallback
  'default': { x: 50, y: 50 },
}

const LEGEND_ITEMS = [
  { color: COLOR_MAP['llave-general'], label: 'Llaves Generales' },
  { color: COLOR_MAP['medical'], label: 'Equipos Médicos' },
  { color: COLOR_MAP['climatization'], label: 'Climatización' },
  { color: COLOR_MAP['infrastructure'], label: 'Infraestructura' },
  { color: COLOR_MAP['services'], label: 'Servicios' },
  { color: COLOR_MAP['distribution'], label: 'Distribución' },
]

function getPanelColor(name: string): string {
  const lowerName = name.toLowerCase()
  if (lowerName.includes('bombas') || lowerName.includes('fuerza')) return COLOR_MAP['infrastructure']
  if (lowerName.includes('tg') || lowerName.includes('llave')) return COLOR_MAP['llave-general']
  if (lowerName.includes('tga') || lowerName.includes('distribución')) return COLOR_MAP['distribution']
  return COLOR_MAP['distribution']
}

export default function FloorPlanViewer({
  floor,
  panels,
  hoveredPoint,
  onPointHover,
}: FloorPlanViewerProps) {
  const coordinateMap = floor === 'ground' ? GROUND_FLOOR_PANELS : FIRST_FLOOR_PANELS

  const panelsWithCoordinates = useMemo(() => {
    return panels.map((panel, index) => {
      // Buscar coordenadas específicas o usar posición por defecto
      const coords = coordinateMap[panel.name] || coordinateMap['default']
      
      // Si es default, distribuirlos en grid
      let finalCoords = coords
      if (!coordinateMap[panel.name]) {
        const row = Math.floor(index / 3)
        const col = index % 3
        finalCoords = {
          x: 25 + (col * 25),
          y: 30 + (row * 20),
        }
      }
      
      return {
        ...panel,
        x: finalCoords.x,
        y: finalCoords.y,
        color: getPanelColor(panel.name),
      }
    })
  }, [panels, coordinateMap])

  const totalPanels = panelsWithCoordinates.length
  const panelsWithImages = panelsWithCoordinates.filter((p) => p.hasImage).length

  return (
    <div className='flex flex-col gap-4'>
      {/* Header */}
      <div className='flex items-center justify-between px-4'>
        <h3 className='font-semibold text-[#6d6c6c]'>
          {floor === 'ground' ? 'Planta Baja' : 'Primer Piso'}
        </h3>
        <div className='text-sm text-gray-600'>
          {panelsWithImages} de {totalPanels} tableros con foto
        </div>
      </div>

      {/* Floor Plan Container */}
      <div className='flex gap-6'>
        {/* Main Image Area */}
        <div className='relative flex-1 border rounded-lg overflow-hidden bg-gray-100'>
          <div className='relative w-full aspect-[4/3]'>
            {/* Placeholder cuando no hay imagen */}
            <div className='absolute inset-0 flex items-center justify-center bg-gray-200'>
              <div className='text-center'>
                <ImageIcon className='w-16 h-16 mx-auto text-gray-400 mb-2' />
                <p className='text-gray-500 text-sm'>Imagen no disponible</p>
                <p className='text-gray-400 text-xs mt-1'>
                  {floor === 'ground' ? 'Planta Baja' : 'Primer Piso'}
                </p>
              </div>
            </div>
            
            {/* Pins Layer */}
            <div className='absolute inset-0'>
              {panelsWithCoordinates.map((panel) => (
                <FloorPlanPin
                  key={panel.id}
                  name={panel.name}
                  key_name={panel.key}
                  type={panel.type}
                  hasImage={panel.hasImage}
                  imageUrl={panel.imageUrl}
                  color={panel.color}
                  x={panel.x}
                  y={panel.y}
                  isHovered={hoveredPoint === panel.name}
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
          
          {/* Lista de tableros */}
          <div className='mt-4 pt-4 border-t border-gray-200'>
            <h5 className='font-medium text-xs mb-2 text-gray-700'>Tableros en este piso</h5>
            <div className='space-y-1'>
              {panelsWithCoordinates.map((panel) => (
                <div 
                  key={panel.id}
                  className='text-xs text-gray-600 flex items-center gap-2'
                >
                  <div 
                    className='w-2 h-2 rounded-full'
                    style={{ backgroundColor: panel.color }}
                  />
                  <span className='truncate'>{panel.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
