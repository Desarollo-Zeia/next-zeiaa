'use client'
import React, { use, useState } from 'react'
import TariffTable from './tariff-table'
import ConsumptionTable from './consumption-table'
import HistoricalCosumption from './historical-consumption'

interface RateConsumptionResume {
  date: string;
  consumption: number;
  cost: number;
  first_value: number;
  last_value: number;
  date_first_value: string;
  date_last_value: string;
}

interface ConsumptionTableReadings {
  count: number;
  next: string | null;
  previous: string | null;
  results: RateConsumptionResume[];
}

type ConsumptionTableReadingsPromise = 
  Promise<ConsumptionTableReadings>

interface TariffData {
  billing_data: BillingData;
  consumption: Consumption;
  importe: Importe;
}

type TariffDataPromise = 
  Promise<TariffData>

interface BillingData {
  tariff_rating: boolean;
  billing_data_type: string;
  billing_cycle_start: string; // Formato de fecha: YYYY-MM-DD
  billing_cycle_end: string;   // Formato de fecha: YYYY-MM-DD
  cargo_fijo_mensual: number;
  cargo_por_energia_activa_en_punta: number;
  cargo_por_energia_activa_fuera_de_punta: number;
  cargo_por_potencia_activa_de_generacion_para_usuarios: {
    presentes_en_punta: number;
    presentes_fuera_de_punta: number;
  };
  cargo_por_potencia_activa_de_redes_de_distribucion_para_usuarios: {
    presentes_en_punta: number;
    presentes_fuera_de_punta: number;
  };
  "cargo_por_energia_reactiva_que_exceda_el_30%_del_total_de_energia_activa": number;
}

interface Consumption {
  energy_peak: number;
  energy_off_peak: number;
  power_generation: number;
  power_distribution: number;
  energy_reactive: number;
}

interface Importe {
  cargo_fijo: number;
  cargo_por_energia_activa_en_punta: number;
  cargo_por_energia_activa_fuera_de_punta: number;
  cargo_por_potencia_activa_generacion: number;
  cargo_por_potencia_activa_distribucion: number;
  cargo_por_energia_reactiva: number | null;
  total: number;
}

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

type DataPointPromise = 
  Promise<DataPoint[]>

const options = ['Resumen de consumo', 'Tarifario', 'Historial de consumo']


export default function TarrifDetail({consumptionTariffReadings, consumptionTableReadings, group_by, consumptionGraphReadings}: {consumptionTariffReadings: TariffDataPromise, consumptionTableReadings: ConsumptionTableReadingsPromise, group_by: string, consumptionGraphReadings: DataPointPromise}) {

  const tariffReadings = use(consumptionTariffReadings)
  const tableReadings = use(consumptionTableReadings)
  const graphReadings = use(consumptionGraphReadings)

  const [option, setOption] = useState<string>('Resumen de consumo')


  return (
    <div className='relative'>
      <div className='flex  absolute -top-14 left-0 z-10 rounded-t-lg overflow-hidden'>
        {
         options.map((o, index) => (
          <div key={index} className={`p-4 rounded-md shadow-md cursor-pointer bg-gray-100 ${o === option && 'bg-gray-200'}`} onClick={() => setOption(o)}>
            {o}
          </div>
         )) 
        }
      </div>
      {
        option === 'Resumen de consumo' && (
          <ConsumptionTable consumptionTableReadings={tableReadings}/> 
        )
      } 
      {
        option === 'Historial de consumo' && (
          <HistoricalCosumption group_by={group_by} consumptionGraphReadings={graphReadings}/>
        )
      }
      {
        option === 'Tarifario' && (
          <TariffTable tariffData={tariffReadings}/>
        )
      }
    </div>
  )
}
