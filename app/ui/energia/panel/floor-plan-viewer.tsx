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

// ============================================
// PINS DE PRUEBA - COMENTADOS PARA PRODUCCIÓN
// Descomenta para probar en desarrollo
// ============================================
/*
const TEST_PINS_GROUND = [
  {
    name: 'Pin Prueba 1',
    key: 'test1',
    type: 'test',
    x: 28,
    y: 52,
    color: '#ef4444'
  },
  {
    name: 'Pin Prueba 2',
    key: 'test2',
    type: 'test',
    x: 70,
    y: 50,
    color: '#3b82f6'
  },
  {
    name: 'Pin Prueba 3',
    key: 'test3',
    type: 'test',
    x: 56,
    y: 58,
    color: '#22c55e'
  },
]

const TEST_PINS_FIRST = [
  {
    name: 'Pin Prueba 1',
    key: 'test1',
    type: 'test',
    x: 55,
    y: 65,
    color: '#3b82f6'
  },
]
*/
// ============================================

export default function FloorPlanViewer({ floor }: FloorPlanViewerProps) {
  const imageSrc = floor === 'ground'
    ? '/images/planos/planta-baja.jpg'
    : '/images/planos/primer-piso.jpg'

  // const testPins = floor === 'ground' ? TEST_PINS_GROUND : TEST_PINS_FIRST
  const testPins: { name: string; key: string; type: string; x: number; y: number; color: string }[] = []

  return (
    <div className='flex flex-col gap-4'>
      {/* Header */}
      <div className='flex items-center justify-between px-4'>
        <h3 className='font-semibold text-[#6d6c6c]'>
          {floor === 'ground' ? 'Planta Baja' : 'Primer Piso'}
        </h3>
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

            {/* Test Pins - Commented for production */}
            {testPins.length > 0 && (
              <div className='absolute inset-0'>
                {testPins.map((pin, index) => (
                  <FloorPlanPin
                    key={index}
                    name={pin.name}
                    key_name={pin.key}
                    type={pin.type}
                    hasImage={false}
                    imageUrl={null}
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

        {/* Instructions - Commented for production */}
        {testPins.length > 0 && (
          <div className='w-64 bg-gray-50 rounded-lg p-4 h-fit'>
            <h4 className='font-semibold text-sm mb-3 text-gray-700'>Coordenadas</h4>
            <div className='text-xs text-gray-600 space-y-2'>
              {testPins.map((pin, index) => (
                <div key={index}>
                  <p><strong>{pin.name}:</strong></p>
                  <p>X: {pin.x}%, Y: {pin.y}%</p>
                </div>
              ))}
              <hr className='my-2' />
              <p className='italic'>Edita las coordenadas en el código para posicionar los pines</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
