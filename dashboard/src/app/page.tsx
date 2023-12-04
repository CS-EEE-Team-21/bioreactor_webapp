'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import io from 'socket.io-client';
import Temperature from '../components/temperature/Temperature'
import Ph from '../components/ph/Ph'
import Rotations from '../components/rotations/Rotations'

interface Metric {
  _id: string;
  type: string;
  value: number;
}

export default function Home() {

  const [currentTemp, setCurrentTemp] = useState(0.0)
  const [currentPh, setCurrentPh] = useState(0.0)
  const [currentRots, setCurrentRots] = useState(0)

  const [temperatures, setTemperatures] = useState<number[]>([]);
  const [phs, setPhs] = useState<number[]>([]);
  const [rotations, setRotations] = useState<number[]>([]);

  const [metrics, setMetrics] = useState<Metric[]>([]);

  useEffect(() => {
    fetch('/api/get-target-metrics')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      if (data.target_metrics && Array.isArray(data.target_metrics)) {
        setMetrics(data.target_metrics);
      }
    })
    .catch(error => {
      console.error('Fetch error:', error);
    });
  }, [])

  useEffect(() => {
    // Connect to the server
    const socket = io('http://localhost:3000');

    // Event listener for when the connection is established
    socket.on('connect', () => {
        console.log('Connected to WebSocket');
    });

    // Event listener for receiving messages
    socket.on('message', (data) => {
        let type = data[0]
        let value = data[1]
        console.log(data)

        if (type == "temp"){
          setCurrentTemp(value)
          setTemperatures(oldArray => [...oldArray, value])
        } else if (type == "ph"){
          setCurrentPh(value)
          setPhs(oldArray => [...oldArray, value])
        } else if (type == "rots"){
          setCurrentRots(value)
          setRotations(oldArray => [...oldArray, value])
        }

  });

    // Event listener for when the connection is closed
    socket.on('disconnect', () => {
        console.log('Disconnected from WebSocket');
    });

    // Clean up the effect
    return () => {
        socket.disconnect();
    };

    

}, []);

 // Finding the target temperature
 const targetTemperature = metrics.find(metric => metric.type === 'temperature')?.value;
 // Finding the target pH
 const targetPh = metrics.find(metric => metric.type === 'ph')?.value;
 // Finding the target rotations
 const targetRotations = metrics.find(metric => metric.type === 'rotations')?.value;


  return (
    <main className=" h-full min-h-full  items-center  flex-nowrap p-24 scroll-smooth overflow-x-auto block whitespace-nowrap">
        <Temperature liveTemp={currentTemp} target={targetTemperature} values={temperatures} />
        <Ph livePh={currentPh} target={targetPh} values={phs} />
        <Rotations liveRots={currentRots} target={targetRotations} values={rotations} />
    </main>
  )
}
