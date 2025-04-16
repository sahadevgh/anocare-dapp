import { Header } from '@/app/components/Header'
import UserDashboard from '@/app/components/dashboard/UserDashboard'
import Footer from '@/app/components/homepage/Footer'
import React from 'react'

function page() {
  return (
    <div>
        <Header />
        <UserDashboard />
        <Footer />
    </div>
  )
}

export default page