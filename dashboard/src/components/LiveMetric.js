import React from 'react'

export default function LiveMetric({ value, unit, target }) {
  return (
        <div className='text-center w-auto h-auto rounded-full p-10 border-green-400 border-[3px] align-middle my-2'>
            <div className='text-2xl text-center'>{String(value)+unit}</div>
            <div className='text-center'>current</div>
        </div>
  )
}
