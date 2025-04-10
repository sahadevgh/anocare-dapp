"use client";

import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { 
  ShieldCheckIcon,
  ClipboardDocumentCheckIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  ArrowPathIcon,
  CheckBadgeIcon,
  XCircleIcon
} from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const ADMIN_ADDRESS = "0xYourAdminWalletHere"; // TODO: Replace with actual admin wallet

const AdminDashboard = () => {
  const { address, isConnected } = useAccount();
  const [isAdmin, setIsAdmin] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (isConnected && address?.toLowerCase() === ADMIN_ADDRESS.toLowerCase()) {
    
      // TODO: Have to replace this with the actual function
      setTimeout(() => {
        setIsAdmin(true);
        setIsLoading(false);
      }, 1000); // Simulate loading
    } else {
      setIsLoading(false);
    }
  }, [isConnected, address]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent"
        />
      </div>
    );
  }

  if (!isConnected) {
    return (
      <AnimatePresence>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center h-screen space-y-4"
        >
          <XCircleIcon className="h-16 w-16 text-red-500" />
          <h2 className="text-2xl font-bold">Wallet Not Connected</h2>
          <p className="text-gray-500">Please connect your wallet to access the admin dashboard</p>
        </motion.div>
      </AnimatePresence>
    );
  }

  if (!isAdmin) {
    return (
      <AnimatePresence> 
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center h-screen space-y-4"
        >
          <ShieldCheckIcon className="h-16 w-16 text-red-500" />
          <h2 className="text-2xl font-bold">Access Denied</h2>
          <p className="text-gray-500">You don&#39;t have admin privileges for this dashboard</p>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <div className="min-h-screen w-[90%] mx-auto bg-gray-50 dark:bg-gray-900 p-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center mb-8"
      >
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <ShieldCheckIcon className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
            <span className="text-gray-500">Connected as:</span>{" "}
            <span className="font-medium">{address?.slice(0, 6)}...{address?.slice(-4)}</span>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Pending Applications</p>
              <h3 className="text-2xl font-bold mt-1">12</h3>
            </div>
            <div className="p-3 rounded-lg bg-secondary/10">
              <ClipboardDocumentCheckIcon className="h-6 w-6 text-secondary" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-500">
            <ArrowPathIcon className="h-4 w-4 mr-1" />
            <span>3 new today</span>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Verified Clinicians</p>
              <h3 className="text-2xl font-bold mt-1">142</h3>
            </div>
            <div className="p-3 rounded-lg bg-primary/10">
              <CheckBadgeIcon className="h-6 w-6 text-primary" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-500">
            <ArrowPathIcon className="h-4 w-4 mr-1" />
            <span>5 new this week</span>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Revenue</p>
              <h3 className="text-2xl font-bold mt-1">$24,589</h3>
            </div>
            <div className="p-3 rounded-lg bg-accent/10">
              <ChartBarIcon className="h-6 w-6 text-accent" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-500">
            <ArrowPathIcon className="h-4 w-4 mr-1" />
            <span>12% from last month</span>
          </div>
        </motion.div>
      </div>

      {/* Main Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 rounded-lg bg-secondary/10">
              <ClipboardDocumentCheckIcon className="h-6 w-6 text-secondary" />
            </div>
            <h3 className="font-semibold text-lg">Clinician Applications</h3>
          </div>
          <p className="text-gray-500 text-sm mb-6">
            Review and approve new clinician verification requests.
          </p>
          <Link href="/dashboards/admin-dashboard/manage-applications">
          <motion.button 
            whileHover={{ backgroundColor: "#4f46e5" }} // Assuming primary is indigo-600
            className="w-full bg-primary text-white px-4 py-3 rounded-lg text-sm font-medium"
          >
            Manage Applications
          </motion.button>
          </Link>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <Cog6ToothIcon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg">Platform Settings</h3>
          </div>
          <p className="text-gray-500 text-sm mb-6">
            Set membership prices, consult fees, and manage sponsor pool.
          </p>
          <motion.button 
            whileHover={{ backgroundColor: "#10b981" }} // Assuming secondary is emerald-500
            className="w-full bg-secondary text-white px-4 py-3 rounded-lg text-sm font-medium"
          >
            Configure Settings
          </motion.button>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 rounded-lg bg-accent/10">
              <ChartBarIcon className="h-6 w-6 text-accent" />
            </div>
            <h3 className="font-semibold text-lg">Transactions & Reports</h3>
          </div>
          <p className="text-gray-500 text-sm mb-6">
            View consultation activity, payments, and disbursements.
          </p>
          <motion.button 
            whileHover={{ backgroundColor: "#f59e0b" }} // Assuming accent is amber-500
            className="w-full bg-accent text-white px-4 py-3 rounded-lg text-sm font-medium"
          >
            View Reports
          </motion.button>
        </motion.div>
      </div>

      {/* Recent Activity Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-8 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
      >
        <h3 className="font-semibold text-lg mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <motion.div 
              key={item}
              whileHover={{ backgroundColor: "#f9fafb" }}
              className="flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <div className="flex-shrink-0 mr-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckBadgeIcon className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">
                  New clinician application approved
                </p>
                <p className="text-sm text-gray-500 truncate">
                  Dr. Sarah Johnson - Cardiology Specialist
                </p>
              </div>
              <div className="text-xs text-gray-400">
                2 hours ago
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;