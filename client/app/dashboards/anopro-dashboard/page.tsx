import React from 'react'
import ClinicianDashboard from '../../components/dashboard/AnoProDashboard'
import { Header } from '@/app/components/Header'
import Footer from '@/app/components/homepage/Footer'

function page() {
  return (
    <div>
        <Header />
        <ClinicianDashboard />
        <Footer />
    </div>
  )
}

export default page