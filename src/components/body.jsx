import { Outlet } from 'react-router'
import React from 'react'
import MainNavbar from './NavBar'
import Footer from './footer'

const body = () => {
  return (
    <div>
      <MainNavbar/>
      <Outlet/>
      <Footer/>
    </div>
  )
}

export default body
