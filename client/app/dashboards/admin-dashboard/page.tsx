import { Header } from "@/app/components/Header";
import AdminDashboard from "@/app/components/dashboard/AdminDashboard";
import Footer from "@/app/components/homepage/Footer";
import React from "react";

function page() {
  return (
    <div>
      <Header />
      <AdminDashboard />
      <Footer />
    </div>
  );
}

export default page;
