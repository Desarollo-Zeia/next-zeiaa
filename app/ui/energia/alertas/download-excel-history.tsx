'use client'
import React, { useTransition } from 'react'
import { saveAs } from 'file-saver'
import { Button } from '@/components/ui/button'
import { getVoltageFluctuationAlertsExcel } from '@/app/services/energy/alerts/data'
import { format } from 'date-fns'
import { Loader2 } from 'lucide-react'
import Image from 'next/image'
import ExcelIconGreen from "@/public/icons/excel.png"

export default function DownloadExcelHistory({
  measurement_point,
  fluctuation_subtype,
  date_after,
  date_before,
  time_after,
  time_before,
}: {
  measurement_point: string
  fluctuation_subtype: string
  date_after: string
  date_before: string
  time_after?: string
  time_before?: string
}) {
  const [isPending, startTransition] = useTransition()

  const handleExcelDownload = async () => {
    try {
      startTransition(async () => {
        const blob = await getVoltageFluctuationAlertsExcel({
          measurement_point,
          fluctuation_subtype,
          date_after,
          date_before,
          time_after,
          time_before,
        })
        saveAs(blob, `Historial-Alertas-Voltaje-${fluctuation_subtype}-${format(new Date(), 'yyyy-MM-dd')}.xlsx`)
      })
    } catch (error) {
      console.error('Error al descargar el reporte:', error)
    }
  }

  return (
    <Button
      onClick={handleExcelDownload}
      className="text-white px-4 py-2 rounded bg-[#00b0c7] relative"
    >
      <div className='flex gap-2 items-center'>
        <Image src={ExcelIconGreen} width={16} height={16} alt='excel' />
        <span>Descargar Excel</span>
      </div>
      {isPending && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50">
          <Loader2 className="h-6 w-6 animate-spin text-white" />
        </div>
      )}
    </Button>
  )
}
