import React, { useState, useEffect } from 'react'
import Tuner from './Tuner'

export default function Target({ metric, current_value, target_value, unit }) {

  const [target, setTarget] = useState(String(target_value))

  useEffect(() => {
    setTarget(String(target_value))
  }, [target_value])

  function handleTargetChange(val){
    setTarget(String(val))
  }

  return (
    <div className='text-center align-middle my-2'>
        <div className='text-center text-2xl'>{target+unit}</div>
        <div className='text-center mb-2'>target</div>
        <Tuner metric={metric} current_value={current_value} changeTarget={(val) => handleTargetChange(val)} />

    </div>
  )
}
