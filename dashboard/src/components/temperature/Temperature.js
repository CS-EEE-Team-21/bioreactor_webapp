import React from 'react'
import LiveMetric from '../LiveMetric'
import Target from '../Target'

export default function Temperature({ liveTemp, target }) {
  return (
    <div className=' shadow-lg rounded-xl p-16'>
        <h2 className=' font-medium text-xl'>Temperature</h2>
        <div className='w-full flex justify-evenly flex-row mt-10'>
            <LiveMetric value={liveTemp} unit="°C" target={target} />
            <Target metric="temperature" current_value={liveTemp} target_value={target} unit="°C" />
        </div>

    </div>
  )
}