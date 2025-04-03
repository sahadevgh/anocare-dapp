import React from 'react'
import ClinicianDashboard from '../../components/dashboard/ClinicianDashboard'
import { Header } from '@/app/components/commons/Header'

function page() {
  return (
    <div>
        <Header />
        <ClinicianDashboard />
    </div>
  )
}

export default page