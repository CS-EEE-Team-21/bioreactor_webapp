import React from 'react'
import LiveMetric from '../LiveMetric'
import Target from '../Target'

export default function Rotations({ liveRots, target }) {
  return (
    <div className=' shadow-lg rounded-xl p-16'>
        <h2 className=' font-medium text-xl'>Rotations</h2>
        
        <div className='w-full flex justify-evenly mt-10'>
            <LiveMetric value={liveRots} unit=" rpm" target={target} />
            <Target metric="rotations" current_value={liveRots} target_value={target} unit=" rpm" />
            
            <div>
              
            </div>

        </div>



    </div>
  )
}
