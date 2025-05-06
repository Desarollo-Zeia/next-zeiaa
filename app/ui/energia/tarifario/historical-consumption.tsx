import React from 'react'
import ChartFilters from './chart-seletectors-filter'
import ConsumoChart from './consumption-chart'
import TarifarioChart from './tarifario-chart'

interface DataPoint {
  date: string;
  consumption: number;
  cost: number;
  first_value: number;
  last_value: number;
  date_first_value: string;
  date_last_value: string;
  timestamp: string;
}

export default function HistoricalCosumption({ type, group_by, consumptionGraphReadings } : { type: string, group_by: string, consumptionGraphReadings: DataPoint[]}) {

  console.log(consumptionGraphReadings)
  return (
    <>
      <div className="flex justify-between items-center">
        <div>
          <h4>Consumo energético (kWH)</h4>
          <p className="text-xs">Durante el periodo seleccionado</p>
        </div>
        <ChartFilters type={type} group_by={group_by}/>
      </div>  
      {
        type === 'consumption' ? 
        (
          <ConsumoChart data={consumptionGraphReadings} group_by={group_by}/>
        ) : 
        (
          <TarifarioChart data={consumptionGraphReadings} group_by={group_by}/>
        )
      }
    
    </>
  )
}
