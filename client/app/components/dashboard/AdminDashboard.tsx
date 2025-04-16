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
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import { ANOCARE_CONTRACT_ADDRESS, getContract, VERIFIED_NFT_ADDRESS } from "../constants";
import { useRouter } from "next/navigation";
import { AnoCareContract_ABI, VerifiedAnoProNFTContract_ABI } from "../contracts/abis";
import { Button } from "../ui/Button";

const AdminDashboard = () => {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [adminChecked, setAdminChecked] = useState<boolean>(false);

  // Check if user is an admin and redirect if so
  const checkAdmin = async () => {
    if (!isConnected || !address) return;

    try {
      const anocareContract = await getContract(ANOCARE_CONTRACT_ADDRESS, AnoCareContract_ABI);
      const anoproContract = await getContract(VERIFIED_NFT_ADDRESS, VerifiedAnoProNFTContract_ABI);
      if (anocareContract && anoproContract) {
        const isAdmin = await anocareContract.isAdmin(address);
        if (isAdmin) {
          setAdminChecked(true);
          router.push("/dashboards/admin-dashboard");
        } else if (await anoproContract?.isVerified(address)) {
          router.push("/dashboards/anopro-dashboard");
        } else {
          router.push("/dashboards/user-dashboard");
        }
      }
    } catch (err) {
      console.error("Error checking admin status:", err);
    }
  };

  useEffect(() => {
    if (!isConnected || !address) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setAdminChecked(false);
    checkAdmin();
    setIsLoading(false);
  }, [address, isConnected, router]);

  if (isLoading && isConnected && !adminChecked) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="h-16 w-16 rounded-full border-4 border-blue-600 dark:border-blue-400 border-t-transparent"
        >
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ShieldCheckIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </motion.div>
        </motion.div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center justify-center h-screen space-y-6 text-center bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800"
        >
          <motion.div
            className="p-4 rounded-full bg-red-100 dark:bg-red-900/30"
            whileHover={{ scale: 1.1 }}
          >
            <XCircleIcon className="h-16 w-16 text-red-500 dark:text-red-400" />
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Wallet Not Connected
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-md">
            Please connect your wallet to access the admin dashboard.
          </p>
        </motion.div>
      </AnimatePresence>
    );
  }

  if (isConnected && !adminChecked) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center justify-center h-screen space-y-6 text-center bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800"
        >
          <motion.div
            className="p-4 rounded-full bg-red-100 dark:bg-red-900/30"
            whileHover={{ scale: 1.1 }}
          >
            <ShieldCheckIcon className="h-16 w-16 text-red-500 dark:text-red-400" />
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Access Denied
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-md">
            You don&#39;t have admin privileges for this dashboard.
          </p>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-6"
        >
          <div className="flex items-center space-x-4">
            <motion.div
              className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/50"
              whileHover={{ scale: 1.1 }}
            >
              <ShieldCheckIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Admin Dashboard
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Connected as: {address?.slice(0, 6)}...{address?.slice(-4)}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Pending Applications
                </p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  12
                </h3>
              </div>
              <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/50">
                <ClipboardDocumentCheckIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-600 dark:text-green-400">
              <ArrowPathIcon className="h-4 w-4 mr-1" />
              <span>3 new today</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Verified Clinicians
                </p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  142
                </h3>
              </div>
              <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/50">
                <CheckBadgeIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-600 dark:text-green-400">
              <ArrowPathIcon className="h-4 w-4 mr-1" />
              <span>5 new this week</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Total Revenue
                </p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  $24,589
                </h3>
              </div>
              <div className="p-3 rounded-lg bg-amber-100 dark:bg-amber-900/50">
                <ChartBarIcon className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-600 dark:text-green-400">
              <ArrowPathIcon className="h-4 w-4 mr-1" />
              <span>12% from last month</span>
            </div>
          </motion.div>
        </div>

        {/* Main Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            whileHover={{ scale: 1.02, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/50">
                <ClipboardDocumentCheckIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Clinician Applications
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
              Review and approve new clinician verification requests.
            </p>
            <Button
              asLink
              href="/dashboards/admin-dashboard/manage-applications"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Manage Applications
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            whileHover={{ scale: 1.02, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/50">
                <Cog6ToothIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Platform Settings
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
              Set membership prices, consult fees, and manage sponsor pool.
            </p>
            <Button
              className="w-full bg-green-500 hover:bg-green-600 text-white"
            >
              Configure Settings
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ scale: 1.02, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 rounded-lg bg-amber-100 dark:bg-amber-900/50">
                <ChartBarIcon className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Transactions & Reports
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
              View consultation activity, payments, and disbursements.
            </p>
            <Button
              className="w-full bg-amber-500 hover:bg-amber-600 text-white"
            >
              View Reports
            </Button>
          </motion.div>
        </div>

        {/* Recent Activity Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Recent Activity
          </h3>
          <div className="space-y-4">
            {[1, 2, 3].map((item, index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ backgroundColor: "#f9fafb", scale: 1.01 }}
                className="flex items-center p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 transition-colors"
              >
                <div className="flex-shrink-0 mr-4">
                  <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                    <CheckBadgeIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-medium text-gray-900 dark:text-white">
                    New clinician application approved
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                    Dr. Sarah Johnson - Cardiology Specialist
                  </p>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  2 hours ago
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;