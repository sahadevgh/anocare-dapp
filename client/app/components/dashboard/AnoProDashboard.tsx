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
import { motion, AnimatePresence } from "framer-motion";
import {
  ANOCARE_CONTRACT_ADDRESS,
  getContract,
  VERIFIED_NFT_ADDRESS,
} from "../constants";
import {
  AnoCareContract_ABI,
  VerifiedAnoProNFTContract_ABI,
} from "../contracts/abis";
import { useRouter } from "next/navigation";
import { Button } from "../ui/Button";
import { useUserData } from "@/app/hooks/useUserData";

const AnoProDashboard = () => {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [isActiveLoading, setIsActiveLoading] = useState<boolean>(false);

  const {
    userData,
    isLoading,
    refetch,
  } = useUserData();

  const checkAdmin = async () => {
    if (!isConnected || !address) return;

    try {
      const anocareContract = await getContract(
        ANOCARE_CONTRACT_ADDRESS,
        AnoCareContract_ABI
      );
      const anoproContract = await getContract(
        VERIFIED_NFT_ADDRESS,
        VerifiedAnoProNFTContract_ABI
      );
      if (anocareContract && anoproContract) {
        const isAdmin = await anocareContract.isAdmin(address);
        if (isAdmin) {
          router.push("/dashboards/admin-dashboard");
        } else if (
          (await anoproContract.isVerified(address)) ||
          userData?.status === "approved"
        ) {
          setIsVerified(true);
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
    const runChecks = async () => {
      if (!isConnected || !address) return;
      await checkAdmin();
    };
    runChecks();
  }, [address, isConnected]);

  const handleUserStatusChange = async () => {
    if (!isConnected || !address) return;
    setIsActiveLoading(true);
    try {
      const response = await fetch(`/api/user-status/${address}`, {
        method: "PUT",
      });
      if (!response.ok) {
        throw new Error("Failed to change user status");
      }
      await refetch();
    } catch (error) {
      console.error("Error changing user status:", error);
    } finally {
      setIsActiveLoading(false);
    }
  };

  const isActive = userData?.isActive ?? false;
  // const hasPendingRequests = userData?.hasPendingRequests ?? false;
  const anocareContract = async () => {
    const anocareContract = await getContract(
      ANOCARE_CONTRACT_ADDRESS,
      AnoCareContract_ABI
    );
    return anocareContract;
  };

  const [cases, setCases] = useState<PendingCase[]>([]);
  interface PendingCase {
    caseId: string;
    status: string;
    patient: string;
    [key: string]: string | number | boolean | undefined; // Adjust this to include all known properties of a case
  }

  const [allPendingCases, setAllPendingCases] = useState<PendingCase[]>([]);
  const [hasPendingRequests, setHasPendingRequests] = useState(false);
  const [earnings, setEarnings] = useState<number>(0);

  useEffect(() => {
    const fetchContractData = async () => {
      const contract = await anocareContract();
      const caseIds = await contract?.anoProCaseIds(address);
      if (!caseIds) {
        console.error("No case IDs found for this address");
        return;
      }

      // All pending cases from the cases mapping using the case IDs
      const allCases = await Promise.all(
        caseIds.map(async (caseId: string) => {
          const caseData = await contract?.cases(caseId);
          return {
            caseId,
            ...caseData,
          };
        })
      );
      setCases(allCases);

      const pendingCases = allCases.filter(
        (caseData) => caseData.status === "pending"
      );
      setHasPendingRequests(pendingCases.length > 0);
      setAllPendingCases(pendingCases);

      const anoPro = await contract?.getAnoPro(address);
      if (anoPro) {
        const earnings = await contract?.getEarnings(address);
        setEarnings(earnings);
      }
    };

    if (isConnected && address) {
      fetchContractData();
    }
  }, [isConnected, address]);



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
            className="p-4 rounded-full bg-gray-100 dark:bg-gray-800"
            whileHover={{ scale: 1.1 }}
          >
            <UserIcon className="h-16 w-16 text-gray-400 dark:text-gray-300" />
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Wallet Not Connected
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-md">
            Please connect your wallet to access the AnoPro dashboard.
          </p>
        </motion.div>
      </AnimatePresence>
    );
  }

  if (isLoading) {
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
            <CheckBadgeIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </motion.div>
        </motion.div>
      </div>
    );
  }

  if (!isVerified) {
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
            <CheckBadgeIcon className="h-12 w-12 text-red-500 dark:text-red-400" />
          </motion.div>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Verification Required
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-md">
              You need to be a verified AnoPro to access this dashboard.
            </p>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              asLink
              href="/apply"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Apply for Verification
              <ArrowRightCircleIcon className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
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
              className="p-3 rounded-lg bg-green-100 dark:bg-green-900/50"
              whileHover={{ scale: 1.1 }}
            >
              <CheckBadgeIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                AnoPro Dashboard
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Welcome, {address?.slice(0, 6)}...{address?.slice(-4)}
              </p>
            </div>
          </div>
          <motion.div
            className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center ${
              isActive
                ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400"
                : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
            }`}
            whileHover={{ scale: 1.05 }}
          >
            <div
              className={`h-3 w-3 rounded-full mr-2 ${
                isActive ? "bg-green-500" : "bg-gray-500"
              }`}
            />
            {isActive ? "Active" : "Inactive"}
          </motion.div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Consultations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            whileHover={{
              y: -5,
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
            }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Consultations Today
                </p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  3
                </h3>
              </div>
              <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/50">
                <CalendarIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-600 dark:text-green-400">
              <ArrowPathIcon className="h-4 w-4 mr-1" />
              <span>1 new in last hour</span>
            </div>
          </motion.div>

          {/* Pending Requests */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            whileHover={{
              y: -5,
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
            }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Pending Requests
                </p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {allPendingCases.length}
                </h3>
              </div>
              <div className="p-3 rounded-lg bg-amber-100 dark:bg-amber-900/50">
                <BellIcon className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-600 dark:text-green-400">
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
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{
              y: -5,
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
            }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Total Earnings
                </p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {earnings} ETH
                </h3>
              </div>
              <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/50">
                <CheckBadgeIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-600 dark:text-green-400">
              <ArrowPathIcon className="h-4 w-4 mr-1" />
              <span>Available for withdrawal</span>
            </div>
          </motion.div>
        </div>

        {/* Main Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Availability */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            whileHover={{
              scale: 1.02,
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
            }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div
                className={`p-3 rounded-lg ${
                  isActive
                    ? "bg-green-100 dark:bg-green-900/50"
                    : "bg-gray-100 dark:bg-gray-800"
                }`}
              >
                <UserIcon
                  className={`h-6 w-6 ${
                    isActive
                      ? "text-green-600 dark:text-green-400"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Availability Status
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
              {isActive
                ? "You're currently available for consultations."
                : "You're not currently accepting new consultations."}
            </p>
            <Button
              onClick={handleUserStatusChange}
              disabled={isActiveLoading}
              className={`w-full ${
                !isActive
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-green-500 hover:bg-green-600"
              } text-white`}
            >
              {isActiveLoading
                ? "Updating..."
                : isActive
                ? "Set Inactive"
                : "Set Active"}
            </Button>
          </motion.div>

          {/* Requests */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{
              scale: 1.02,
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
            }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/50">
                <BellIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Consultation Requests
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
              {hasPendingRequests
                ? "You have new consultation requests waiting."
                : "No pending consultation requests."}
            </p>
            <div className="space-y-4">
              {hasPendingRequests ? (
                <>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    View Requests ({allPendingCases.length})
                  </Button>
                  <div className="flex items-center text-xs text-blue-600 dark:text-blue-400">
                    <ClockIcon className="h-4 w-4 mr-1" />
                    <span>Response time: 12hr average</span>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
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
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Upcoming Schedule
          </h3>
          <div className="space-y-4">
            {cases.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ backgroundColor: "#f9fafb", scale: 1.01 }}
                className="flex items-center p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 transition-colors"
              >
                <div className="flex-shrink-0 mr-4">
                  <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
                    <UserIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-medium text-gray-900 dark:text-white">
                    Consultation with {item?.patient}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Today at {item?.scheduledDate}
                  </p>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {item?.status}
                </div>
              </motion.div>
            ))}
            <div className="flex items-center justify-center p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <ClockIcon className="h-5 w-5 mr-2" />
                <span>No more appointments today</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AnoProDashboard;
