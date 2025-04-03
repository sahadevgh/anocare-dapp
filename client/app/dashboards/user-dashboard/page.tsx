import { Header } from '@/app/components/commons/Header'
import UserDashboard from '@/app/components/dashboard/UserDashboard'
import React from 'react'

function page() {
  return (
    <div>
        <Header />
        <UserDashboard />
    </div>
  )
}

export default page