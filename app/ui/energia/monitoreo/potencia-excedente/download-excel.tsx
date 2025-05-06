'use client'
import React from 'react'
import { saveAs } from 'file-saver';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import ExcelIconGreen from "@/public/icons/excel.png"
import { exceededExcel } from '@/app/sevices/energy/monitoreo/data';


export default function DownloadExcelMonitoreo({ headquarterId, panelId} : { headquarterId?: string, panelId?: string}) {

  const handleExcelDownload = async () => {
    try {
      let blob
      
      blob = await exceededExcel({ headquarterId, panelId });
      
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
