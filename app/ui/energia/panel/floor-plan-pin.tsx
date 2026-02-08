'use client'

import React from 'react'
import { Camera, CameraOff } from 'lucide-react'
import Image from 'next/image'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface FloorPlanPinProps {
  name: string
  key_name: string
  type: string
  hasImage: boolean
  imageUrl: string | null
  color: string
  x: number
  y: number
  isHovered: boolean
  onHover: (name: string | null) => void
}

export default function FloorPlanPin({
  name,
  key_name,
  type,
  hasImage,
  imageUrl,
  color,
  x,
  y,
  isHovered,
  onHover,
}: FloorPlanPinProps) {
  const getTooltipPosition = () => {
    if (x > 70) return 'left'
    if (x < 30) return 'right'
    if (y > 70) return 'top'
    return 'bottom'
  }

  const tooltipSide = getTooltipPosition()

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ${
              isHovered ? 'scale-150 z-20' : 'scale-100 z-10 hover:scale-125'
            }`}
            style={{
              left: `${x}%`,
              top: `${y}%`,
            }}
            onMouseEnter={() => onHover(name)}
            onMouseLeave={() => onHover(null)}
          >
            <div
              className={`w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center ${
                hasImage ? 'solid' : 'border-dashed'
              }`}
              style={{
                backgroundColor: color,
                boxShadow: isHovered
                  ? '0 0 20px rgba(0,0,0,0.4)'
                  : '0 2px 8px rgba(0,0,0,0.3)',
              }}
            >
              {hasImage ? (
                <Camera className='w-3 h-3 text-white' />
              ) : (
                <CameraOff className='w-3 h-3 text-white/70' />
              )}
            </div>
          </button>
        </TooltipTrigger>
        <TooltipContent
          side={tooltipSide as 'top' | 'bottom' | 'left' | 'right'}
          className='max-w-sm p-0 overflow-hidden'
          sideOffset={8}
        >
          <div className='space-y-0'>
            {hasImage && imageUrl && (
              <div className='relative w-full h-32 bg-gray-100'>
                <Image
                  src={imageUrl}
                  alt={`Foto de ${name}`}
                  fill
                  className='object-cover'
                  sizes='256px'
                />
              </div>
            )}
            <div className='p-3 space-y-1'>
              <p className='font-semibold text-sm'>{name}</p>
              <p className='text-xs text-gray-600'>Llave: {key_name}</p>
              <p className='text-xs text-gray-600'>Tipo: {type}</p>
              <div className='flex items-center gap-1 mt-1'>
                {hasImage ? (
                  <>
                    <Camera className='w-3 h-3 text-green-600' />
                    <span className='text-xs text-green-600'>Foto disponible</span>
                  </>
                ) : (
                  <>
                    <CameraOff className='w-3 h-3 text-gray-400' />
                    <span className='text-xs text-gray-400'>Sin foto</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
