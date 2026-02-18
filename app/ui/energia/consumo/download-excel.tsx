'use client'
import React, { useTransition } from 'react'
import { saveAs } from 'file-saver';
import { Button } from '@/components/ui/button';
import { consumeExcel } from '@/app/services/energy/data';
import Image from 'next/image';
import ExcelIconGreen from "@/public/icons/excel.png"
import { formatFromUS } from '@/app/utils/func';
import { START_DATE } from '@/app/utils/formatter';


interface EnergyPanel {
  id: number
  name: string
  is_active: boolean
}

export default function DownloadExcel({ headquarterId, panelId, date_after = START_DATE, date_before = START_DATE, unit, point, energyPanel, measurementPoint }: { headquarterId?: string, panelId?: string, date_after?: string, date_before?: string, unit?: string, point: string, energyPanel: EnergyPanel | null, measurementPoint: string }) {

  const [isPending, startTransition] = useTransition()

  const handleExcelDownload = async () => {

    try {
      startTransition(async () => {

        const blob = await consumeExcel({ headquarterId, panelId, date_after, date_before, unit, point });

        saveAs(blob, `${energyPanel?.name} - ${measurementPoint} - ${formatFromUS(date_after!)} - ${formatFromUS(date_before!)}`);
      })
    } catch (error) {
      console.error('Error al descargar el reporte:', error);
    }
  }

  return (
    <Button onClick={handleExcelDownload} className="text-white px-4 py-2 rounded bg-[#00b0c7] relative">
      <div className='flex gap-2 items-center'>
        <Image src={ExcelIconGreen} width={16} height={16} alt='excel' />
        <span>Descargar Excel</span>
      </div>
      {isPending && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
        </div>
      )}
    </Button>
  )
}
