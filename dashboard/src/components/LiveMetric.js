import React, { useState, useEffect } from 'react'

export default function LiveMetric({ value, unit, target }) {

  const [difference, setDifference] = useState(0)

  useEffect(() => {
    let diff = Math.abs(target - value)
    setDifference(diff)
  }, [value])

  return (
        <div className=
        {
          'text-center w-auto h-auto rounded-full p-10 ' + (difference < 0.5 ? 'border-green-400' : difference < 1 ? 'border-orange-400' : 'border-red-400') + ' border-[3px] align-middle my-2'
        }
        
        >
            <div className='text-2xl text-center'>{String(value)+unit}</div>
            <div className='text-center'>current</div>
        </div>
  )
}
