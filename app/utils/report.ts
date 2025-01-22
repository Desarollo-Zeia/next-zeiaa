'use server'
import { readinsgExcel, readinsgExcelAmbiental } from "../sevices/readings/data";
import { saveAs } from 'file-saver';

export const reportIndicatorAmbiental = async ({room, indicator, unit, date_before, date_after} : { room: string, indicator: string, unit: string, date_before: string, date_after: string}) => {
    const blob = await readinsgExcelAmbiental({roomId: room, indicator, unit, date_before, date_after})
    saveAs(blob, `Reporte: ${date_after} - ${date_before}`);
}

  export const reportIndicatorOcupacional = async ({room, indicator, unit, date_before, date_after} : { room: string, indicator: string, unit: string, date_before: string, date_after: string}) => {
      const blob = await readinsgExcel({roomId: room, indicator, unit, date_before, date_after})
      saveAs(blob, `Reporte: ${date_after} - ${date_before}`);
  }