'use client'
import React, { useTransition } from 'react'
import { saveAs } from 'file-saver';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import ExcelIconGreen from "@/public/icons/excel.png"
import { exceededExcel } from '@/app/services/energy/monitoreo/data';

export default function DownloadExcelMonitoreo({ headquarterId, panelId }: { headquarterId?: string, panelId?: string }) {

  const [isPending, startTransition] = useTransition()

  const handleExcelDownload = async () => {
    try {
      startTransition(async () => {
        const blob = await exceededExcel({ headquarterId, panelId });

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
