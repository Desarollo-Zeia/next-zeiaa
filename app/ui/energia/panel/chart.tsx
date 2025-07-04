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
  ArcElement
} from "chart.js";

ChartJS.register(LineElement, PointElement, LinearScale, TimeScale, ArcElement, Tooltip, Legend)

  const data = {
  labels: ['Red', 'Orange', 'Yellow'],
  datasets: [
    {
      label: 'Dataset 1',
      data: [12, 42, 56], // ✅ Array con los valores
      backgroundColor: [
        '#f1f1f1',
        '#000',
        '#D1A980'
      ], // ✅ Array de colores
    }
  ]
};


export default function ChartComponent() {
  return (
    <div>
      <Pie
           options={
             {
             responsive: true,
             plugins: {
               legend: {
                 position: 'top',
               },
               title: {
                 display: true,
                 text: 'Chart.js Pie Chart'
               }
             }
             }
           }
           data={data}
         />
    </div>
  )
}
