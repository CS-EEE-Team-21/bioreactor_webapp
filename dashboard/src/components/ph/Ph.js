import React from 'react'
import LiveMetric from '../LiveMetric'
import Target from '../Target'

export default function Ph({ livePh, target }) {
  return (
    <div className=' shadow-lg rounded-xl p-16'>
        <h2 className=' font-medium text-xl'>pH</h2>
        
        <div className='w-full flex justify-between mt-10'>
            <LiveMetric value={livePh} unit="" target={target} />
            <Target metric="ph" current_value={livePh} target_value={target} unit="" />
        </div>

    </div>
  )
}
