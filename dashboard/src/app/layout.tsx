import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import GreenLight from '../components/GreenLight'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Team 21 Bioreactor',
  description: 'CS-EEE Eng Challenges Team 21 Bioreactor Dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>

        <div className='w-full top-0 left-0 fixed'>
          <h1 className='font-bold text-2xl m-10'>T21 Bioreactor</h1>

          <div className='absolute top-7 left-[37.5%] w-1/4'>
            <div className='flex justify-evenly flex-row border-solid border-[1px] p-1 border-[#898989] rounded-2xl'>

              <div className='flex flex-row'>
                <GreenLight />
                <div className='pt-1 ml-3'>mqtt broker</div>
              </div>

              <div className='flex flex-row'>
                <GreenLight />
                <div className='pt-1 ml-3'>database</div>
              </div>

            </div>
          </div>

        </div>
        
        {children}
        
        </body>
    </html>
  )
}
