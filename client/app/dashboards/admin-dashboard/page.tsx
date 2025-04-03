import { Header } from '@/app/components/commons/Header'
import AdminDashboard from '@/app/components/dashboard/AdminDashboard'
import React from 'react'

function page() {
  return (
    <div>
        <Header />
        <AdminDashboard />
    </div>
  )
}

export default page