import React from 'react'

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


const options = {
    scales: {
        y: {
            max: 30,
            min: 0,
            ticks: {
                stepSize: 0.5
            }
        }
    }
};



export default function LiveChart({ labels, data }) {



  return (
    <div className='w-full mt-10'>
        <Line options={options} data={data} />
    </div>
  )
}


