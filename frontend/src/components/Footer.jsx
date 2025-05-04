import React from 'react'
import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer>
        <div className="container">
            <p>copyright &copy; {new Date().getFullYear()} developed by <Link to="https://www.linkedin.com/in/rokayanasr/">Rokaya Nasr</Link></p>
        </div>
    </footer>
  )
}

export default Footer