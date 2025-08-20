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
  BarElement,
  Colors
} from "chart.js";
// import zoomPlugin from "chartjs-plugin-zoom";
import "chartjs-adapter-date-fns"; // Adaptador para manejo de fechas
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import NoResultFound from '../../no-result-found';

ChartJS.register(LineElement, PointElement, LinearScale, TimeScale, ArcElement, Tooltip, Legend, CategoryScale, BarElement, Colors)

// const labels = ['Lunes 6 de Julio', 'Martes 7 de Julio', 'Miércoles 8 de Julio', 'Jueves 9 de Julio', 'Viernes 10 de Julio', 'Sábado 11 de Julio', 'Domingo 12 de Julio']
// const data = {
//   labels: labels,
//   datasets: [{
//     label: 'My First Dataset',
//     data: [65, 59, 80, 81, 56, 55, 40],
//     backgroundColor: [
//       'rgba(255, 99, 132, 0.2)',
//       'rgba(255, 159, 64, 0.2)',
//       'rgba(255, 205, 86, 0.2)',
//       'rgba(75, 192, 192, 0.2)',
//       'rgba(54, 162, 235, 0.2)',
//       'rgba(153, 102, 255, 0.2)',
//       'rgba(201, 203, 207, 0.2)'
//     ],
//     borderColor: [
//       'rgb(255, 99, 132)',
//       'rgb(255, 159, 64)',
//       'rgb(255, 205, 86)',
//       'rgb(75, 192, 192)',
//       'rgb(54, 162, 235)',
//       'rgb(153, 102, 255)',
//       'rgb(201, 203, 207)'
//     ],
//     borderWidth: 1
//   }]
// };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function BarChart({ readingsGraph } : { readingsGraph: any}) {

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dataPoints = readingsGraph?.map((item : any ) => ({
    x: new Date(item.first_reading), // Se convierte la fecha a objeto Date
    y: item.difference,
  
  })) || []

    const data = {
      datasets: [
        {
          label: ``, // Se utiliza el indicador como label
          data: dataPoints,
           backgroundColor: [
      'rgba(255, 99, 132, 0.2)',
      'rgba(255, 159, 64, 0.2)',
      'rgba(255, 205, 86, 0.2)',
      'rgba(75, 192, 192, 0.2)',
      'rgba(54, 162, 235, 0.2)',
      'rgba(153, 102, 255, 0.2)',
      'rgba(201, 203, 207, 0.2)'
    ],
          fill: false,
          borderColor: "#00b0c7",
          stepped: true,
          tension: 0,
          pointRadius: 2, 
        },
       
      ],
    }
     // eslint-disable-next-line @typescript-eslint/no-explicit-any
     const options : any = {
       interaction: {
         mode: 'nearest',
         axis: 'x',
         intersect: false
       },
       responsive: true,
       scales: {
         x: {
           type: "time",
           time: {
             unit: "day", // Puedes ajustar la unidad a 'hour', 'day', etc.
             displayFormats: {
               minute: "HH:mm",
             },
           },
           // ticks: {
           //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
           //   callback: function (value: any) {
           //     const date = new Date(value)
           //     return format(date, "PP", { locale: es }) // Formato de fecha
           //    }
           // },
           title: {
             display: false,
             text: readingsGraph[0].unit,
           },
           grid: {
             display: false,
             tickLength: 50
           },
         },
         y: {
           title: {
             display: true,
             text: readingsGraph[0].unit,
           },
           grid: {
             display: false,
             tickLength: 50
           },
           ticks: {
             display: true
           },
         },
       },
       plugins: {
         tooltip: {
           backgroundColor: "rgba(255, 255, 255)", // Cambia el fondo a un color claro
           titleColor: "#333", // Color para el título del tooltip
           bodyColor: "#333", // Color para el contenido del tooltip
           callbacks: {
             // Personalización del título del tooltip (ej. para formatear la fecha)
             // eslint-disable-next-line @typescript-eslint/no-explicit-any
             title: function (tooltipItems: any) {
               // tooltipItems es un array de elementos (en este caso de un único punto)
               const date = new Date(tooltipItems[0].parsed.x);
               return format(date, "PP", { locale: es });
             },
             // Personalización de la etiqueta del tooltip
             // eslint-disable-next-line @typescript-eslint/no-explicit-any
             label: function (context: any) {
               let label = context.dataset.label || "";
               if (label) {
                 label += ": ";
               }
               // Se redondea el valor 'y' a dos decimales
               label += context.parsed.y.toFixed(2) + ' ' + readingsGraph[0].unit;
               return label;
             },
           },
         },
         zoom: {
           // wheel: {
   
           //   enabled: true,
           //   mode: "xy"
           // },
           // pan: {
           //   enabled: true,
           //   mode: "xy", // Permite desplazar (pan) solo en el eje X. También puedes usar "y" o "xy".
           // },
           pan: {
             enabled: true,
             mode: "x", // "x", "y" o "xy"
           },
           zoom: {
            
             wheel: {
               enabled: true,
               mode: "x",
               speed: 0.1,
               threshold: 2,
             },
             pinch: {
               enabled: true,
             },
             mode: "x",
           },
           limits: {
             y: { min: 'original', max: 'original' },
             x: { min: 'original', max: 'original' }
           }
   
         },
         decimation: { 
           enabled: true,
           algorithm: 'lttb',
           samples: 20, // Aumenta este valor para conservar más detalles
           threshold: 5
         },
         legend: {
           display: false
         },
        //   annotation: {
        //    annotations: {
        //       line1: {
        //        display: category === 'voltage' ? true : false,
        //        type: 'line',
        //        yMin: 209,
        //        yMax: 209,
        //        borderColor: '#000',
        //        borderWidth: 2,
        //        borderDash: [5, 5],
        //        label: {
        //          display: true,
        //          color: 'white',
        //          backgroundColor: '#000',
        //          content: ['209 v'],
        //        }
        //      },
        //      line2: {
        //      display: category === 'voltage' ? true : false,
        //      type: 'line',
        //      yMin: 231,
        //      yMax: 231,
        //      borderColor: '#000',
        //      borderWidth: 2,
        //      borderDash: [5, 5],
        //      label: {
        //        display: true,
        //        color: 'white',
        //        backgroundColor: '#000',
        //        content: ['231 v'],
        //      }
        //      },
        //    }
        //  }
       }
      }
       

  return (
    <>
      {
        readingsGraph.length > 0 ?(
          <Bar
          className='w-full h-full'
          options={options}
          data={data}
        />
        ) : (
          <NoResultFound/>
        )
      }
    
      
    </>
  )
}
