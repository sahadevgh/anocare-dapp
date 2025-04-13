"use client";

import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import {
  CheckBadgeIcon,
  ClockIcon,
  UserIcon,
  CalendarIcon,
  BellIcon,
  ArrowPathIcon,
  ArrowRightCircleIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ANOCARE_CONTRACT_ADDRESS, getContract, VERIFIED_NFT_ADDRESS } from "../constants";
import { AnoCareContract_ABI, VerifiedAnoProNFTContract_ABI } from "../contracts/abis";
import { useRouter } from "next/navigation";

const AnoProDashboard = () => {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const [isActive, setIsActive] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasPendingRequests, setHasPendingRequests] = useState<boolean>(false);
  const [isVerified, setIsVerified] = useState<boolean>(false);

  // Check if user is an admin and redirect if so
      const checkAdmin = async () => {
        if (!isConnected || !address) return;
    
        try {
          const anocareContract = await getContract(ANOCARE_CONTRACT_ADDRESS, AnoCareContract_ABI);
          const anoproContract = await getContract(VERIFIED_NFT_ADDRESS, VerifiedAnoProNFTContract_ABI);
          if (anocareContract && anoproContract) {
            const isAdmin = await anocareContract.isAdmin(address);
            if (isAdmin) {
              router.push("/dashboards/admin-dashboard");
            } else if (await anoproContract?.isVerified(address)) {
              setIsVerified(true);
              router.push("/dashboards/anopro-dashboard");
            } else {
              router.push("/dashboards/user-dashboard");
            }
          }
        } catch (err) {
          console.error("Error checking admin status:", err);
        }
      }
    
      useEffect(() => {
        if (!isConnected || !address) {
          setIsLoading(false);
          return;
        }
        setIsLoading(true);
        checkAdmin();
        setIsLoading(false);
        setHasPendingRequests(false);
      }, [address, isConnected, router]);

  if (!isConnected) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center h-screen space-y-4 text-center"
        >
          <UserIcon className="h-16 w-16 text-gray-400" />
          <h2 className="text-2xl font-bold">Wallet Not Connected</h2>
          <p className="text-gray-500 max-w-md">
            Please connect your wallet to access the AnoPro dashboard
          </p>
        </motion.div>
      </AnimatePresence>
    );
  }

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

  if (!isVerified) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center h-screen space-y-6 text-center"
        >
          <div className="p-4 rounded-full bg-red-100 dark:bg-red-900/30">
            <CheckBadgeIcon className="h-12 w-12 text-red-500" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Verification Required</h2>
            <p className="text-gray-500 max-w-md">
              You need to be a verified AnoPro to access this dashboard
            </p>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/apply"
              className="inline-flex items-center px-6 py-3 rounded-lg bg-primary text-white font-medium shadow-sm hover:bg-primary/90 transition-colors"
            >
              Apply for Verification
              <ArrowRightCircleIcon className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <div className="min-h-screen w-[90%] mx-auto bg-gray-50 dark:bg-gray-900 p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
      >
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/20">
            <CheckBadgeIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">AnoPro Dashboard</h1>
            <p className="text-sm text-gray-500">
              Welcome, {address?.slice(0, 6)}...{address?.slice(-4)}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div
            className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${
              isActive
                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
            }`}
          >
            <div
              className={`h-2 w-2 rounded-full mr-2 ${
                isActive ? "bg-green-500" : "bg-gray-500"
              }`}
            />
            {isActive ? "Active" : "Inactive"}
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Consultations */}
        <motion.div
          whileHover={{ y: -5 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Consultations Today</p>
              <h3 className="text-2xl font-bold mt-1">3</h3>
            </div>
            <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/20">
              <CalendarIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-500">
            <ArrowPathIcon className="h-4 w-4 mr-1" />
            <span>1 new in last hour</span>
          </div>
        </motion.div>

        {/* Pending Requests */}
        <motion.div
          whileHover={{ y: -5 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Pending Requests</p>
              <h3 className="text-2xl font-bold mt-1">
                {hasPendingRequests ? "2" : "0"}
              </h3>
            </div>
            <div className="p-3 rounded-lg bg-amber-100 dark:bg-amber-900/20">
              <BellIcon className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-500">
            <ArrowPathIcon className="h-4 w-4 mr-1" />
            <span>
              {hasPendingRequests
                ? "New requests available"
                : "No pending requests"}
            </span>
          </div>
        </motion.div>

        {/* Earnings */}
        <motion.div
          whileHover={{ y: -5 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Earnings</p>
              <h3 className="text-2xl font-bold mt-1">$1,240</h3>
            </div>
            <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/20">
              <CheckBadgeIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-500">
            <ArrowPathIcon className="h-4 w-4 mr-1" />
            <span>Available for withdrawal</span>
          </div>
        </motion.div>
      </div>

      {/* Main Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Availability */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center space-x-4 mb-4">
            <div
              className={`p-3 rounded-lg ${
                isActive
                  ? "bg-green-100 dark:bg-green-900/20"
                  : "bg-gray-100 dark:bg-gray-700"
              }`}
            >
              <UserIcon
                className={`h-6 w-6 ${
                  isActive
                    ? "text-green-600 dark:text-green-400"
                    : "text-gray-500"
                }`}
              />
            </div>
            <h3 className="font-semibold text-lg">Availability Status</h3>
          </div>
          <p className="text-gray-500 text-sm mb-6">
            {isActive
              ? "You're currently available for consultations"
              : "You're not currently accepting new consultations"}
          </p>
          <motion.button
            whileHover={{
              backgroundColor: isActive ? "#ef4444" : "#10b981",
            }}
            onClick={() => setIsActive(!isActive)}
            className={`w-full px-4 py-3 rounded-lg text-sm font-medium text-white ${
              isActive
                ? "bg-red-500 hover:bg-red-600"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {isActive ? "Set Inactive" : "Set Active"}
          </motion.button>
        </motion.div>

        {/* Requests */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/20">
              <BellIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold text-lg">Consultation Requests</h3>
          </div>
          <p className="text-gray-500 text-sm mb-6">
            {hasPendingRequests
              ? "You have new consultation requests waiting"
              : "No pending consultation requests"}
          </p>
          <div className="space-y-4">
            {hasPendingRequests ? (
              <>
                <motion.button
                  whileHover={{ backgroundColor: "#3b82f6" }}
                  className="w-full bg-blue-500 text-white px-4 py-3 rounded-lg text-sm font-medium"
                >
                  View Requests (2)
                </motion.button>
                <div className="flex items-center text-xs text-blue-500">
                  <ClockIcon className="h-4 w-4 mr-1" />
                  <span>Response time: 12hr average</span>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                <div className="flex items-center text-gray-500">
                  <ClockIcon className="h-5 w-5 mr-2" />
                  <span>No pending requests</span>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Schedule */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
      >
        <h3 className="font-semibold text-lg mb-4">Upcoming Schedule</h3>
        <div className="space-y-4">
          {[1, 2].map((item) => (
            <motion.div
              key={item}
              whileHover={{ backgroundColor: "#f9fafb" }}
              className="flex items-center p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-100 dark:border-gray-700"
            >
              <div className="flex-shrink-0 mr-4">
                <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                  <UserIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">
                  Consultation with Patient #{item}
                </p>
                <p className="text-sm text-gray-500">
                  Today at {item === 1 ? "2:00 PM" : "4:30 PM"}
                </p>
              </div>
              <div className="text-xs text-gray-400">
                {item === 1 ? "Confirmed" : "Pending"}
              </div>
            </motion.div>
          ))}
          <div className="flex items-center justify-center p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
            <div className="flex items-center text-gray-500">
              <ClockIcon className="h-5 w-5 mr-2" />
              <span>No more appointments today</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AnoProDashboard;
