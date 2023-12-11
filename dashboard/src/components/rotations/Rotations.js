import React, { useState, useEffect } from 'react'
import LiveMetric from '../LiveMetric'
import Target from '../Target'
import LiveChart from '../LiveChart'
import ViewMore from '../ViewMore'

export default function Rotations({ liveRots, target, values }) {

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
      label: 'Rotations',
      data: values,
      fill: false,
      borderColor: '#0000FF',
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
            label: 'Rotations',
            data: values,
            fill: false,
            borderColor: '#0000FF',
            tension: 0.1
        }]
        }
    )

  }, [values])

  return (
    <div className=' shadow-xl hover:shadow-2xl transition-all duration-200  rounded-xl p-16 w-1/2 inline-block'>
        <h2 className=' font-medium text-xl'>Rotations</h2>
        
        <div className='w-full flex justify-evenly mt-10'>
            <LiveMetric value={liveRots} unit=" rpm" target={target} />
            <Target metric="rotations" current_value={liveRots} target_value={target} unit=" rpm" />
        </div>

        <LiveChart data={data} range={[150, 400]} />

        <ViewMore metric="rotations" range={[150, 400]} />

    </div>
  )
}
