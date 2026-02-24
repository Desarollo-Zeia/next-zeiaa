'use client'

import React from 'react'
import Image from 'next/image'
import FloorPlanPin from './floor-plan-pin'

interface FloorPlanViewerProps {
  floor: 'ground' | 'first'
  points?: { name: string; key: string; type: string }[]
  hoveredPoint?: string | null
  onPointHover?: (pointName: string | null) => void
}

interface Pin {
  name: string
  key: string
  type: string
  x: number
  y: number
  color: string
  imageUrl: string
}

const PINS_GROUND: Pin[] = [
  {
    name: 'Cuarto de Bombas',
    key: 'cuarto-bombas',
    type: 'electrico',
    x: 28,
    y: 52,
    color: '#ef4444',
    imageUrl: '/images/tableros/CUARTO-DE-BOMBAS.jpg'
  },
  {
    name: 'TG P1',
    key: 'tg-p1',
    type: 'electrico',
    x: 70,
    y: 50,
    color: '#3b82f6',
    imageUrl: '/images/tableros/TG-P1.jpeg'
  },
  {
    name: 'TGA N',
    key: 'tga-n',
    type: 'electrico',
    x: 56,
    y: 58,
    color: '#22c55e',
    imageUrl: '/images/tableros/TGA-N.JPG'
  },
]

const PINS_FIRST: Pin[] = [
  {
    name: 'TG RT',
    key: 'tg-rt',
    type: 'electrico',
    x: 55,
    y: 65,
    color: '#3b82f6',
    imageUrl: '/images/tableros/TOMOGRAFO-TG-RT.jpg'
  },
]

export default function FloorPlanViewer({ floor }: FloorPlanViewerProps) {
  const imageSrc = floor === 'ground'
    ? '/images/planos/planta-baja.jpg'
    : '/images/planos/primer-piso.jpg'

  const pins = floor === 'ground' ? PINS_GROUND : PINS_FIRST

  return (
    <div className='flex flex-col gap-4'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <h3 className='font-semibold text-[#6d6c6c]'>
          {floor === 'ground' ? 'Planta Baja' : 'Primer Piso'}
        </h3>
      </div>

      {/* Floor Plan Container */}
      <div className='rounded-lg overflow-hidden bg-gray-100'>
        <div className='relative w-full aspect-[4/3]'>
          <Image
            src={imageSrc}
            alt={`Plano ${floor === 'ground' ? 'Planta Baja' : 'Primer Piso'}`}
            fill
            className='object-contain'
            sizes='(max-width: 1200px) 100vw, 800px'
            priority
          />

          {/* Pins */}
          {pins.length > 0 && (
            <div className='absolute inset-0'>
              {pins.map((pin: Pin, index: number) => (
                <FloorPlanPin
                  key={index}
                  name={pin.name}
                  key_name={pin.key}
                  type={pin.type}
                  hasImage={true}
                  imageUrl={pin.imageUrl}
                  color={pin.color}
                  x={pin.x}
                  y={pin.y}
                  isHovered={false}
                  onHover={() => { }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
