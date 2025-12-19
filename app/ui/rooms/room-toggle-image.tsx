'use client'
import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent } from '@/components/ui/dialog'
import { X } from 'lucide-react'
import { useState } from 'react'
import Image, { StaticImageData } from 'next/image'

// Mantén tus importaciones de imágenes igual...
import ResonadorMagnetico from '@/public/rooms/resonador-magnetico.png';
import SalaOperaciones1 from '@/public/rooms/sala-de-operaciones-1.png';
import SalaOperaciones2 from '@/public/rooms/sala-de-operaciones-2.png';
import SalaOperaciones4 from '@/public/rooms/sala-de-operaciones-4.png';
import SalaOperacionesGral from '@/public/rooms/sala-de-operaciones.png';
import SalaTecnica from '@/public/rooms/sala-tecnica.png';
import SalaTomografia from '@/public/rooms/sala-tomografia.png';
import SalaUps from '@/public/rooms/sala-ups.png';
import SubestacionElectrica from '@/public/rooms/sub-estacion-electrica.png';
import { DialogTitle } from '@radix-ui/react-dialog'

export const roomPhotos = [
  { id: 325, image: ResonadorMagnetico, name: 'Ducto resonador magnetico' },
  { id: 297, image: SalaOperaciones1, name: 'Sala de Operaciones 1' },
  { id: 298, image: SalaOperaciones2, name: 'Sala de Operaciones 2' },
  { id: 299, image: SalaOperacionesGral, name: 'Sala de Operaciones 3' },
  { id: 300, image: SalaOperaciones4, name: 'Sala de Operaciones 4' },
  { id: 294, image: SalaTomografia, name: 'Sala de tomografía' },
  { id: 292, image: SalaTecnica, name: 'Sala técnica' },
  { id: 295, image: SubestacionElectrica, name: 'Subestación eléctrica' },
  { id: 296, image: SalaUps, name: 'Sala UPS' }
];

export default function RoomToggleImage({ roomId, name }: { roomId: number, name: string }) {
  const [isImageOpen, setIsImageOpen] = useState(false)
  const currentImage = roomPhotos.find(room => room.id === roomId)?.image

  return (
    <>
      <Button
        onClick={() => setIsImageOpen(true)}
        className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
      >
        Ver foto de la sala
      </Button>

      <Dialog open={isImageOpen} onOpenChange={setIsImageOpen}>
        {/* max-w-lg limita el ancho total del modal para que no use toda la pantalla */}

        <DialogTitle>

        </DialogTitle>
        <DialogContent className="max-w-lg p-0 overflow-hidden border-none">
          <div className="relative flex flex-col">
            <DialogClose className="absolute right-4 top-4 z-20 rounded-full bg-black/50 p-2 text-white backdrop-blur-sm transition-opacity hover:bg-black/70">
              <X className="h-4 w-4" />
            </DialogClose>

            {/* Contenedor de imagen con relación de aspecto fija (16:9) */}
            <div className="relative aspect-video w-full overflow-hidden bg-muted">
              {currentImage ? (
                <Image
                  src={currentImage}
                  alt={name}
                  fill // Ocupa todo el contenedor relativo
                  className="object-cover" // Ajusta la imagen sin deformarla
                  sizes="(max-width: 768px) 100vw, 512px"
                  priority
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-gray-200">
                  <span className="text-muted-foreground text-sm">Imagen no disponible</span>
                </div>
              )}
            </div>

            <div className="p-5 bg-background">
              <h3 className="text-lg font-bold text-foreground mb-1">{name}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Área monitoreada: {name}. Instalaciones equipadas con sensores de última generación para control ambiental.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}