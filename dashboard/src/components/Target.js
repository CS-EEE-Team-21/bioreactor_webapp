import React from 'react'
import Tuner from './Tuner'

export default function Target({ metric, current_value, target_value, unit }) {

  return (
    <div className='text-center align-middle my-2'>
        <div className='text-center text-2xl'>{String(target_value)+unit}</div>
        <div className='text-center mb-2'>target</div>
        <Tuner metric={metric} current_value={current_value} />

    </div>
  )
}
