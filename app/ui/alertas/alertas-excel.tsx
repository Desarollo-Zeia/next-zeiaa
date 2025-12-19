'use client'
import React, { useTransition } from 'react'
import { saveAs } from 'file-saver';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import ExcelIconGreen from "@/public/icons/excel.png"
import { alertsExcel } from '@/app/sevices/energy/monitoreo/data';
import { Indicator, Unit } from '@/app/type';

export default function DownloadAlertas({ room, indicator, unit, date_after, date_before }: { room: string, indicator: Indicator, unit: Unit, date_after?: string, date_before?: string }) {

  const [isPending, startTransition] = useTransition()

  const handleExcelDownload = async () => {
    try {
      startTransition(async () => {
        const blob = await alertsExcel({ room, indicator, unit, date_after, date_before });

        saveAs(blob, `Reporte monitoreo potencia excedente`);
      })

    } catch (error) {
      console.error('Error al descargar el reporte:', error);
    }
  };


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
