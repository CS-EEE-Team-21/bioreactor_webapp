'use client'

import React, { useEffect, useState } from 'react'
import LiveMetric from '../LiveMetric'
import Target from '../Target'
import LiveChart from '../LiveChart'

export default function Temperature({ liveTemp, target, values }) {

  const [labels, setLabels] = useState([])

  function getCurrentTimeString() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const ampm = hours >= 12 ? 'pm' : 'am';

    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const hoursStr = String(hours).padStart(2, '0');
    const minutesStr = String(minutes).padStart(2, '0');
    const secondsStr = String(seconds).padStart(2, '0');

    return `${hoursStr}:${minutesStr}:${secondsStr} ${ampm}`;
  }

  const [data, setData] = useState({
  labels: labels,
  datasets: [{
      label: 'Temperature',
      data: values,
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
  }]
  });

  useEffect(() => {

    if(values != [] && values.length != labels.length){

      let new_date = getCurrentTimeString()

      console.log(values)

      setLabels(oldArray => [...oldArray, new_date])

    }

    setData(
      {
        labels: labels,
        datasets: [{
            label: 'Temperature',
            data: values,
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
        }]
        }
    )

  }, [values])

  return (
    <div className=' shadow-xl rounded-xl p-16 w-1/2 inline-block mr-24'>
        <h2 className=' font-medium text-xl'>Temperature</h2>
        <div className='w-full flex justify-evenly flex-row mt-10'>
            <LiveMetric value={liveTemp} unit="°C" target={target} />
            <Target metric="temperature" current_value={liveTemp} target_value={target} unit="°C" />
        </div>

        <LiveChart labels={labels} data={data} range={[10, 45]} />

    </div>
  )
}