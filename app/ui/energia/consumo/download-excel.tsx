'use client'
import React from 'react'
import { saveAs } from 'file-saver';
import { Button } from '@/components/ui/button';
import { consumeExcel } from '@/app/sevices/energy/data';
import Image from 'next/image';
import ExcelIconGreen from "@/public/icons/excel.png"


export default function DownloadExcel({ headquarterId, panelId, date_after, date_before, unit} : { headquarterId?: string, panelId?: string, date_after?: string,  date_before?: string, unit?: string}) {

  const handleExcelDownload = async () => {
    try {
      let blob
      
      blob = await consumeExcel({ headquarterId, panelId, date_after, date_before, unit });
      
      saveAs(blob, `Reporte:`);
    } catch (error) {
      console.error('Error al descargar el reporte:', error);
    }
  };


  return (
    <Button onClick={handleExcelDownload} className="text-white px-4 py-2 rounded bg-[#00b0c7]">
      <Image src={ExcelIconGreen} width={16} height={16} alt='excel'/>
      Descargar Excel
    </Button>
  )
}
