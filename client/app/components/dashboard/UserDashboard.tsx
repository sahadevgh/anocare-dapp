"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import {
  CheckCircleIcon,
  SparklesIcon,
  ChatBubbleBottomCenterTextIcon,
  UserGroupIcon,
  ArrowRightCircleIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { ethers } from "ethers";
import CryptoJS from "crypto-js";
import { motion, AnimatePresence } from "framer-motion";
import ApplyAnoPro from "../anopros/ApplyAnoPro";
import { AnoCareContract_ABI, AnoPassNFTContract_ABI } from "../contracts/abis";
import {
  ANOCARE_CONTRACT_ADDRESS,
  ANOPASS_NFT_ADDRESS,
  checkAnoTokenBalance,
  getContract,
} from "../constants";
import { Button } from "../ui/Button";


interface Activity {
  id: number;
  type: string;
  date: string;
  title: string;
}

interface FileData {
  cid: string;
  key: string;
}

interface AnoProFormData {
  address: string;
  alias: string;
  email: string;
  specialty: string;
  region: string;
  message: string;
  experience: string;
  credentials: string;
  status?: string;
  licenseIssuer: string;
  licenseFile?: FileData | null;
  nationalIdFile?: FileData | null;
}

const UserDashboard = () => {
  const { address, isConnected } = useAccount();
  const router = useRouter();

  const [hasPremium, setHasPremium] = useState(false);
  const [loading, setLoading] = useState(true);
  const [applicationStatus, setApplicationStatus] = useState<
    "not_applied" | "pending" | "approved"
  >("not_applied");
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState<AnoProFormData>({
    address: address || "",
    alias: "",
    email: "",
    specialty: "",
    region: "",
    experience: "",
    credentials: "",
    licenseIssuer: "",
    message: "",
    status: "pending",
    licenseFile: null,
    nationalIdFile: null,
  });

  // Update form state when address changes
  useEffect(() => {
    if (address) {
      setForm((prev) => ({ ...prev, address }));
    }
  }, [address]);

  // Fetch user data
  const fetchUserData = useCallback(async () => {
    if (!isConnected || !address) return;
    try {
      const res = await fetch(`/api/user/${address}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        console.log("Failed to fetch user data");
        return;
      }

      const data = await res.json();
      setApplicationStatus(data?.applicationStatus || "not_applied");
    } catch (err) {
      console.error("Error fetching user data:", err);
    } finally {
      setLoading(false);
    }
  }, [isConnected, address]);

  // Check if user type and redirect if so
  const checkUserType = async () => {
    if (!isConnected || !address) return;

    try {
      const anoPassContract = await getContract(
        ANOPASS_NFT_ADDRESS,
        AnoPassNFTContract_ABI
      );
      const contract = await getContract(
        ANOCARE_CONTRACT_ADDRESS,
        AnoCareContract_ABI
      );
      if (contract) {
        const isAdmin = await contract.isAdmin(address);
        const isPremium = await anoPassContract?.isActive(address);
        if (isAdmin) {
          router.push("/dashboards/admin-dashboard");
        } else if (applicationStatus === "approved") {
          router.push("/dashboards/anopro-dashboard");
        } else if (isPremium) {
          setHasPremium(true);
        } else {
          router.push("/dashboards/user-dashboard");
        }
      }
    } catch (err) {
      console.error("Error checking admin status:", err);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchUserData();
    checkUserType();
    setLoading(false);
  }, [address, isConnected, router,]);

  useEffect(() => {
    // Mock recent activity data
    setRecentActivity([
      {
        id: 1,
        type: "ai_chat",
        date: "2 hours ago",
        title: "Follow-up questions",
      },
      {
        id: 2,
        type: "premium_view",
        date: "1 day ago",
        title: "Viewed specialists",
      },
    ]);
  }, []);

  // Handle file upload
  const handleFileUpload = useCallback(
    async (file: File, field: "licenseFile" | "nationalIdFile") => {
      if (!address) return alert("Please connect your wallet first");

      try {
        const fileKey = ethers.hexlify(ethers.randomBytes(32));
        const reader = new FileReader();
        const encryptedContent = await new Promise<string>((resolve) => {
          reader.onload = (e) => {
            const encrypted = CryptoJS.AES.encrypt(
              e.target!.result as string,
              fileKey
            ).toString();
            resolve(encrypted);
          };
          reader.readAsDataURL(file);
        });

        const formData = new FormData();
        formData.append("file", new Blob([encryptedContent]));

        const res = await fetch(
          "https://api.pinata.cloud/pinning/pinFileToIPFS",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT!}`,
            },
            body: formData,
          }
        );

        if (!res.ok) throw new Error("IPFS upload failed");
        const { IpfsHash: cid } = await res.json();

        setForm((prev) => ({
          ...prev,
          [field]: { cid, key: fileKey },
        }));
      } catch (err) {
        console.error(err);
        alert(
          `Upload failed: ${
            err instanceof Error ? err.message : "Unknown error"
          }`
        );
      }
    },
    [address]
  );

  // Handle form input changes
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!address) return;

      setLoading(true);
      try {
        const hasTokens = await checkAnoTokenBalance(address);
        if (!hasTokens) {
          alert("You must hold at least 100 ANO tokens to apply.");
          return setLoading(false);
        }

        const res = await fetch(`/api/anopro-application/${address}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(errorText || "Submission failed");
        }

        const contentType = res.headers.get("content-type");
        if (contentType?.includes("application/json")) {
          const data = await res.json();
          if (!data.success) {
            throw new Error(data.message || "Submission failed");
          }
        }

        setSubmitted(true);
        setApplicationStatus("pending");
      } catch (err) {
        console.error("Submission error:", err);
        alert(err instanceof Error ? err.message : "Submission failed");
      } finally {
        setLoading(false);
      }
    },
    [address, form]
  );

  const ApplicationStatusBanner = () => {
    if (applicationStatus === "not_applied") return null;

    const isPending = applicationStatus === "pending";

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`p-6 rounded-xl flex items-center gap-4 bg-gradient-to-r ${
          isPending
            ? "from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30"
            : "from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30"
        } border border-gray-200 dark:border-gray-700 shadow-sm`}
      >
        <motion.div
          className={`p-3 rounded-full ${
            isPending
              ? "bg-amber-200 dark:bg-amber-700/50 text-amber-600 dark:text-amber-300"
              : "bg-green-200 dark:bg-green-700/50 text-green-600 dark:text-green-300"
          }`}
          whileHover={{ scale: 1.1 }}
        >
          {isPending ? (
            <ClockIcon className="h-6 w-6" />
          ) : (
            <CheckCircleIcon className="h-6 w-6" />
          )}
        </motion.div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {isPending ? "Application Under Review" : "Application Approved"}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            {isPending
              ? "Your application is being reviewed by our team."
              : "Congratulations! You are now an approved AnoPro."}
          </p>
        </div>
      </motion.div>
    );
  };

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
            className="p-4 rounded-full bg-blue-100 dark:bg-blue-900/50"
            whileHover={{ scale: 1.1 }}
          >
            <SparklesIcon className="h-12 w-12 text-blue-600 dark:text-blue-400" />
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome to Anocare
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-md">
            Please connect your wallet to access our private healthcare services.
          </p>
        </motion.div>
      </AnimatePresence>
    );
  }

  if (loading) {
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
            <SparklesIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </motion.div>
        </motion.div>
      </div>
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
              <SparklesIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Your Dashboard
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {address
                  ? `${address.slice(0, 6)}...${address.slice(-4)}`
                  : "Not connected"}
              </p>
            </div>
          </div>
          <motion.div
            className={`px-4 py-2 rounded-full text-sm font-semibold ${
              hasPremium
                ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400"
                : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
            }`}
            whileHover={{ scale: 1.05 }}
          >
            {hasPremium ? "Premium" : "Free Tier"}
          </motion.div>
        </motion.div>

        <ApplicationStatusBanner />

        {showApplicationForm ? (
          <ApplyAnoPro
            submitted={submitted}
            setSubmitted={setSubmitted}
            form={form}
            loading={loading}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            handleFileUpload={handleFileUpload}
            setShowApplicationForm={setShowApplicationForm}
            address={address}
          />
        ) : (
          <>
            {/* Membership Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              whileHover={{ scale: 1.01, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-8"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Membership Status
                  </h3>
                  {hasPremium ? (
                    <div className="flex items-center text-green-600 dark:text-green-400 gap-2">
                      <CheckCircleIcon className="h-6 w-6" />
                      <span className="text-lg">Premium Active</span>
                    </div>
                  ) : (
                    <p className="text-gray-600 dark:text-gray-400">
                      Upgrade to unlock full access to Anocare’s features.
                    </p>
                  )}
                </div>
                {!hasPremium && (
                  <Button
                    asLink
                    href="/premium"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Upgrade Now
                    <ArrowRightCircleIcon className="ml-2 h-5 w-5" />
                  </Button>
                )}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* AI Chat Card */}
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
                    <ChatBubbleBottomCenterTextIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    AI Health Assistant
                  </h3>
                </div>
                <Button
                  asLink
                  href="/chat"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Start Chat
                </Button>
              </motion.div>

              {/* AnoPros Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                whileHover={{ scale: 1.02, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/50">
                    <UserGroupIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Become an AnoPro
                  </h3>
                </div>
                {applicationStatus === "pending" ? (
                  <Button
                    className="w-full bg-gray-500 text-white cursor-not-allowed"
                    disabled
                  >
                    Pending Approval
                  </Button>
                ) : (
                  <Button
                    onClick={() => setShowApplicationForm(true)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Apply Now
                  </Button>
                )}
              </motion.div>
            </div>

            {/* Recent Activity */}
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
              {recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex items-center p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex-shrink-0 mr-4">
                        <div className="h-12 w-12 rounded-full flex items-center justify-center bg-blue-100 dark:bg-blue-900/50">
                          {activity.type === "ai_chat" ? (
                            <ChatBubbleBottomCenterTextIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                          ) : (
                            <UserGroupIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                          )}
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-base font-medium text-gray-900 dark:text-white">
                          {activity.title}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {activity.date}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                  No recent activity yet. Start exploring Anocare!
                </p>
              )}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;