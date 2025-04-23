import React from 'react'
import { Header } from '../components/Header'
import Footer from '../components/homepage/Footer'
import Litepaper from '../components/Litepaper'

function page() {
  return (
    <div>
        <Header />
        <Litepaper />
        {/* <Footer /> */}
        <Footer />
    </div>
  )
}

export default page