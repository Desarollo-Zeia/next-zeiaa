'use client'
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  BarElement
} from "chart.js";

ChartJS.register(LineElement, PointElement, LinearScale, TimeScale, ArcElement, Tooltip, Legend, CategoryScale, BarElement)

const labels = ['Lunes 6 de Julio', 'Martes 7 de Julio', 'Miércoles 8 de Julio', 'Jueves 9 de Julio', 'Viernes 10 de Julio', 'Sábado 11 de Julio', 'Domingo 12 de Julio']
const data = {
  labels: labels,
  datasets: [{
    label: 'My First Dataset',
    data: [65, 59, 80, 81, 56, 55, 40],
    backgroundColor: [
      'rgba(255, 99, 132, 0.2)',
      'rgba(255, 159, 64, 0.2)',
      'rgba(255, 205, 86, 0.2)',
      'rgba(75, 192, 192, 0.2)',
      'rgba(54, 162, 235, 0.2)',
      'rgba(153, 102, 255, 0.2)',
      'rgba(201, 203, 207, 0.2)'
    ],
    borderColor: [
      'rgb(255, 99, 132)',
      'rgb(255, 159, 64)',
      'rgb(255, 205, 86)',
      'rgb(75, 192, 192)',
      'rgb(54, 162, 235)',
      'rgb(153, 102, 255)',
      'rgb(201, 203, 207)'
    ],
    borderWidth: 1
  }]
};


export default function BarChart() {
  return (
         <Bar
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
                  }
                },
                  scales: {
                    x: { grid: { display: false } },
                    y: { grid: { display: false } }
                  }
                }  
              }
              data={data}
            />
  )
}
