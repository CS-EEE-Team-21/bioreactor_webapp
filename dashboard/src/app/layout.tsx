import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

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
        </div>
        
        {children}
        
        </body>
    </html>
  )
}
