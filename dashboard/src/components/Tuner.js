import React, { useState } from 'react'

export default function Tuner({metric, current_value }) {

    const [newValue, setNewValue] = useState(current_value)
    const [isOpen, setIsOpen] = useState(false)

    function handleSubmit(){
        // Define the data you want to send
        const data = {
            metric: metric, // replace with your actual metric name
            new_value: newValue // replace with your actual value
        };
        
        // Create the fetch POST request
        fetch('/api/update-metric', {
            method: 'POST', // Specify the method
            headers: {
            'Content-Type': 'application/json', // Specify the content type as JSON
            },
            body: JSON.stringify(data), // Convert the JavaScript object to a JSON string
        })
        .then(response => {
            if (!response.ok) {
            // If the response is not okay, throw an error
            throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json(); // Parse the JSON in the response
        })
        .then(data => {
            console.log('Success:', data); // Handle the success
        })
        .catch((error) => {
            console.error('Error:', error); // Handle the error
        });

        setIsOpen(false)

    }

  return (
    <>
        <button 
                    onClick={() => { setIsOpen(true) }}
                    className=' text-blue-500 text-center font-medium'>Modify</button>


        {
            isOpen ?
            <>
                <div className=
                "fixed w-full h-full top-0 left-0 bg-opacity-50 bg-black "
                onClick={() => { setIsOpen(false) }}
                >
                </div>
            
                <div className='bg-white fixed  p-10 rounded-lg w-1/3 top-[25%] left-[33%]' 
                        >

                    <div>
                        <input type='number' className='w-full outline-none p-3 border-b-2 border-gray-400 focus:border-blue-400 transition-all duration-200' value={newValue} placeholder='New value' onChange={(e) => {setNewValue(e.target.value)}} />
                    </div>

                    <div className='w-2/3 flex flex-row justify-evenly mx-auto mt-10'>
                        <button
                        onClick={() => { setIsOpen(false) }}
                        className='py-3 px-5 bg-red-500 hover:bg-red-600 transition-all duration-200 text-white rounded-md '
                        >Close</button>

                        <button
                        disabled={
                            ...newValue == current_value ?
                                true
                            : false
                        }
                        className='disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:bg-blue-500 py-3 px-5 bg-blue-500 hover:bg-blue-600 transition-all duration-200 text-white rounded-md '
                        onClick={handleSubmit}
                        >Submit</button>
                    </div>

                </div>
            </>
            : null
        }
        
            
    </>
  )
}
