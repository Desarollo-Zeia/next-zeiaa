'use client'
import React from 'react'
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend,
  ArcElement,
  Colors
} from "chart.js";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface OtherLoads {
  name: string;
  daily_consumption_kwh: number;
  consumption_percentage: number;
  description: string;
}

interface MeasurementPointResult {
  measurement_point_id: number;
  measurement_point_name: string;
  device_name: string;
  is_main: boolean;
  is_active: boolean;
  daily_consumption_kwh: number;
  consumption_percentage: number;
  channel: string;
  type: string;
  capacity: string;
  hardware: string;
  first_reading_value: number;
  last_reading_value: number;
  first_reading_time: string;
  last_reading_time: string;
  total_readings_today: number;
}

interface ElectricalPanelData {
  headquarter_id: number;
  electrical_panel_id: number;
  electrical_panel_name: string;
  main_daily_consumption_kwh: number;
  total_measurement_points: number;
  date: string;
  other_loads: OtherLoads;
  results: MeasurementPointResult[];
}

ChartJS.register(LineElement, PointElement, LinearScale, TimeScale, ArcElement, Tooltip, Legend, Colors)

export default function ChartComponent({ electricalPanelData } : { electricalPanelData : ElectricalPanelData }) {

  const graphData = {
    labels: electricalPanelData.results.slice(1).map(electrical => electrical.measurement_point_name),
    datasets: [
      {
        label: '',
        data: electricalPanelData.results.slice(1).map(electrical => (electrical.consumption_percentage)),
      //   backgroundColor: [
      //   'red',
      //   'purple',
      //   'orange'
      // ]
      }
    ]
  }

  return (
    <div className='flex flex-col gap-4'>
      {/* <div className='flex justify-end'>
        <Button className='bg-gray-500 px-2 py-1 text-sm'>
          Ver historial
        </Button>
      </div> */}
      {/* <div>
        <p className='text-balance'>Distribución de consumo en tiempo real</p>
      </div> */}
      <Pie
           options={
             {
             responsive: true,
             plugins: {
               legend: {
                display: false,
                position: 'top',
               },
               title: {
                 display: true,
                 text: 'Chart.js Pie Chart'
               },
               tooltip: {
                callbacks: {
                  label: function(ctx) {
                    return `${ctx.formattedValue}%`
                  }
                }
               }
             }
             }  
           }
           data={graphData}
         />
      <Accordion type="single" collapsible> 
        <AccordionItem value="item-1">
          <AccordionTrigger className='bg-[#00b0c7] text-white rounded-lg'>
            <div className='flex justify-between gap-4 w-full px-4'>
              <p className='font-semibold'>{electricalPanelData.results[0]?.measurement_point_name}</p>
              <p>{electricalPanelData.results[0]?.consumption_percentage}%</p>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            {
              electricalPanelData.results.slice(1).map(electrical => {
                return (
                <div className='flex justify-between w-full px-4' key={electrical.measurement_point_name}>
                  <p className='font-semibold flex items-center gap-1 '><div className='w-2 h-2 rounded-full bg-black'/>{electrical?.measurement_point_name}</p>
                  <p className='mr-6'>{electrical?.consumption_percentage}%</p>
                </div>
                )
              })
            }
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
