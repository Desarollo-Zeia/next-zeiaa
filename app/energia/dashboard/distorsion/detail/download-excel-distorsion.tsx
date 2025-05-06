'use client'
import React from 'react'
import { saveAs } from 'file-saver';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import ExcelIconGreen from "@/public/icons/excel.png"
import { armonicsExcel } from '@/app/sevices/energy/distorsion/data';

export default function DownloadExcelDistorsion({ headquarterId, panelId, data_type, date_after, date_before } : { headquarterId?: string, panelId?: string, data_type?: string, date_after?: string,  date_before?: string}) {

  const handleExcelDownload = async () => {
    try {
      let blob
      
      blob = await armonicsExcel({ headquarterId, panelId, data_type, date_after, date_before });
      
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
