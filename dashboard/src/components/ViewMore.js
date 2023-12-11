import React, { useState, useEffect } from 'react'
import LiveChart from './LiveChart';

export default function ViewMore({ metric, range }) {

  const [isOpen, setIsOpen] = useState(false);
  const [period, setPeriod] = useState("");
  const [labels, setLabels] = useState([])
  const [values, setValues] = useState([])

  function handleOpen(){
    if(period == ""){
      setPeriod("1d");
    }
    setIsOpen(true)
  }


  async function getData(metric, period){
    const response = await fetch('/api/get-period?&metric='+metric+'&period='+period)
    const fetched = await response.json();
    setValues(fetched.values)
    setLabels(fetched.dates)
  }

  useEffect(() => {
    if(period != ""){
      getData(metric, period)
    }
  }, [period])



  const [data, setData] = useState({
    labels: labels,
    datasets: [{
        label: metric,
        data: values,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
    }]
    });
  
    useEffect(() => {

      console.log("Values: " + values)
      console.log("Labels: " + labels)
  
      setData(
        {
          labels: labels,
          datasets: [{
              label: metric,
              data: values,
              fill: false,
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1
          }]
          }
      )
  
    }, [values])  

  return (
    <>
      {
        isOpen ?
        <>
            <div className=
            "fixed w-full h-full top-0 left-0 bg-opacity-50 bg-black "
            onClick={() => { setIsOpen(false) }}
            >
            </div>

            <div className='bg-white fixed  p-10 rounded-lg w-2/3 top-[10%] left-[17%]'>

                <div>
                  Period:
                  <select onChange={(e) => setPeriod(e.target.value)}>
                    <option value="1h"> Last hour</option>
                    <option selected value="1d"> Last 24h</option>
                    <option value="1w"> Last week</option>
                    <option value="1m"> Last month</option>
                  </select>
                </div>

                <LiveChart data={data} range={range} />

                <div className='w-2/3 flex flex-row justify-evenly mx-auto mt-10'>
                    <button
                    onClick={() => { setIsOpen(false) }}
                    className='py-3 px-5 bg-red-500 hover:bg-red-600 transition-all duration-200 text-white rounded-md '
                    >Close</button>
                </div>

            </div>
        </>
        : null
    }
      <div className='text-blue-600 underline mt-3 cursor-pointer' onClick={handleOpen}>view more →</div>
    </>
  );
}
