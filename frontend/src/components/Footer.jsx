import React from 'react'
import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className=' bg-primary'>
        <div className="container mx-auto">
            <p className='text-white text-center py-2'>copyright &copy; {new Date().getFullYear()} developed by <Link to="https://www.linkedin.com/in/rokayanasr/" className='text-white'>Rokaya Nasr</Link></p>
        </div>
    </footer>
  )
}

export default Footer