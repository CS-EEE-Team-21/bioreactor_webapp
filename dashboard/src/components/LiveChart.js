import React, { useEffect, useState } from 'react'

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);


// let options = {
//     scales: {
//         y: {
//             max: 30,
//             min: 0,
//             ticks: {
//                 stepSize: 0.5
//             }
//         }
//     }
// };



export default function LiveChart({ data, range }) {

    const [options, setOptions] = useState(
        {
            scales: {
                y: {
                    max: range[1],
                    min: range[0],
                    // ticks: {
                    //     stepSize: 0.5
                    // }
                }
            },
            elements: {
                point:{
                    radius: 0
                }
            }
        }
    )
    
  return (
    <div className='w-full mt-10'>
        <Line options={options} data={data} />
    </div>
  )
}


