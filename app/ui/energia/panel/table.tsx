'use client'

import React, { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Camera, X } from 'lucide-react'
import Image from 'next/image'

type Reading = {
  id: number,
  name: string,
  is_active: boolean,
  channel: string,
  type: string,
  key: string,
  capacity: string,
  hardware: string,
  device: string,
  dev_eui: string,
  electrical_panel: string,
  location_reference: string,
}

interface PanelReadings {
  count: number,
  next: string,
  previous: string,
  results: Reading[]
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

interface TableComponentProps {
  readings: PanelReadings
  hoveredPoint?: string | null
  onRowHover?: (pointName: string | null) => void
}

export default function TableComponent({ readings, hoveredPoint, onRowHover }: TableComponentProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedPointName, setSelectedPointName] = useState<string>('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  return (
    <div className='flex flex-col'>
      <h3 className='p-4 font-semibold text-[#6d6c6c]'>Tablero de distribucion</h3>
      <div className='border rounded-lg'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='text-center bg-gray-50'>
                Puntos de monitoreo
              </TableHead>
              <TableHead className='text-center bg-gray-50'>
                Llave
              </TableHead>
              <TableHead className='text-center bg-gray-50'>
                Tipo de red
              </TableHead>
              <TableHead className='text-center bg-gray-50'>
                Capacidad
              </TableHead>
              <TableHead className='text-center bg-gray-50'>
                Hardware
              </TableHead>
              <TableHead className='text-center bg-gray-50'>
                Ubicacion
              </TableHead>
              <TableHead className='text-center bg-gray-50'>
                Referencia
              </TableHead>
              <TableHead className='text-center bg-gray-50'>
                Foto
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {readings.results.map(reading => (
              <TableRow 
                key={reading.id} 
                className={`transition-colors ${hoveredPoint === reading.name ? 'bg-blue-50' : 'bg-white hover:bg-gray-50'}`}
                onMouseEnter={() => onRowHover?.(reading.name)}
                onMouseLeave={() => onRowHover?.(null)}
              >
                <TableCell className='text-center'>
                  {reading.name}
                </TableCell>
                <TableCell className='text-center'>
                  {reading.key}
                </TableCell>
                <TableCell className='text-center'>
                  {reading.type}
                </TableCell>
                <TableCell className='text-center'>
                  {reading.capacity}
                </TableCell>
                <TableCell className='text-center'>
                  {reading.hardware}
                </TableCell>
                <TableCell className='text-center'>
                  {reading.electrical_panel}
                </TableCell>
                <TableCell className='text-center'>
                  {reading.location_reference || 'No precisa'}
                </TableCell>
                <TableCell className='text-center'>
                  {(() => {
                    const imagePath = getTableroImage(reading.name, reading.key)
                    if (imagePath) {
                      return (
                        <button
                          onClick={() => {
                            setSelectedImage(imagePath)
                            setSelectedPointName(reading.name)
                            setIsModalOpen(true)
                          }}
                          className='p-2 hover:bg-gray-100 rounded-full transition-colors'
                          title='Ver foto del tablero'
                        >
                          <Camera className='w-5 h-5 text-gray-600' />
                        </button>
                      )
                    }
                    return <span className='text-gray-400'>-</span>
                  })()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className='max-w-4xl p-0 overflow-hidden'>
          <DialogTitle className='sr-only'>Foto del tablero - {selectedPointName}</DialogTitle>
          <div className='relative'>
            <button
              onClick={() => setIsModalOpen(false)}
              className='absolute right-4 top-4 z-10 rounded-full bg-black/50 p-2 text-white backdrop-blur-sm transition-opacity hover:bg-black/70'
            >
              <X className='w-5 h-5' />
            </button>
            {selectedImage && (
              <div className='flex flex-col'>
                <div className='bg-gray-100 px-6 py-3 border-b'>
                  <h4 className='font-semibold text-gray-800'>{selectedPointName}</h4>
                </div>
                <div className='relative w-full h-[600px]'>
                  <Image
                    src={selectedImage}
                    alt={`Foto del tablero - ${selectedPointName}`}
                    fill
                    className='object-contain'
                    sizes='(max-width: 896px) 100vw, 896px'
                  />
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
