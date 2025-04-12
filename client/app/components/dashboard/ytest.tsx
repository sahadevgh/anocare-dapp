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
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Buffer } from "buffer";
import ApplyAnoPro from "../anopros/ApplyAnoPro";
import { ANOCARE_CONTRACT_ADDRESS, ANOPASS_NFT_ADDRESS, checkAnoTokenBalance, getContract } from "../constants";
import { AnoPassNFTContract_ABI } from "../contracts/abis";
import { LitNodeClient } from "@lit-protocol/lit-node-client";
import { LIT_NETWORK } from "@lit-protocol/constants";
import { encryptFile } from "@lit-protocol/encryption";
import type { AccessControlConditions } from "@lit-protocol/types"; 


if (typeof window !== "undefined") {
  (window as typeof window & { Buffer: typeof Buffer }).Buffer = Buffer;
}

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
  const [litClient, setLitClient] = useState<LitNodeClient | null>(null);
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
    setLoading(true);
  
    try {
      const contract = await getContract(ANOPASS_NFT_ADDRESS, AnoPassNFTContract_ABI);
      if (contract) {
        const isPremium = await contract.isActive(address);
        setHasPremium(isPremium);
      }
  
      const res = await fetch(`/api/user/${address}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json", // ✅ Fix
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

  console.log(applicationStatus)

  useEffect(() => {
    fetchUserData();

     // Mock recent activity data
     setRecentActivity([
      { id: 1, type: "ai_chat", date: "2 hours ago", title: "Follow-up questions" },
      { id: 2, type: "premium_view", date: "1 day ago", title: "Viewed specialists" },
    ]);
  }, [fetchUserData]);

  useEffect(() => {
    if (applicationStatus === "approved") {
      router.push("/anopro-dashboard");
    }
  }, [applicationStatus, router]);


  // Initialize Lit client
  useEffect(() => {
    const initLitClient = async () => {
      const client = new LitNodeClient({ litNetwork: LIT_NETWORK.DatilDev });
      await client.connect();
      setLitClient(client);
    };
    initLitClient();
  }, []);

  // Access control conditions for file encryption
  // This is a placeholder. You should replace it with your actual access control conditions.
  // The contract address and method should be replaced with your the actual contract and method.
  const getAccessControlConditions = (): AccessControlConditions => [
    {
      contractAddress: ANOCARE_CONTRACT_ADDRESS,
      standardContractType: "",
      chain: "arbitrumSepolia",
      method: "isAdmin",
      parameters: [":userAddress"],
      returnValueTest: {
        comparator: "=",
        value: "true",
      },
    },
  ];


  // Handle file upload
  // This function encrypts the file and uploads it to Web3.Storage
  // It then updates the form state with the file data
  // The file data includes the CID and the encryption key
  // The CID is used to retrieve the file from IPFS
  // The encryption key is used to decrypt the file
  const handleFileUpload = useCallback(
    async (file: File, field: "licenseFile" | "nationalIdFile") => {
      if (!litClient || !address) return alert("Please connect your wallet first");

      try {
        if (file.size > 5 * 1024 * 1024) console.log("File size exceeds 5MB limit");

        const { ciphertext, dataToEncryptHash } = await encryptFile(
          {
            accessControlConditions: getAccessControlConditions(),
            file,
            chain: "arbitrumSepolia",
          },
          litClient 
        );
        
        // Upload the encrypted file to NFT.Storage
        const encryptedFile = new File([ciphertext], file.name || `${field}-${Date.now()}.bin`);

        const formData = new FormData();
        formData.append("file", encryptedFile);
  
        const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT!}`,
          },
          body: formData,
        });
  
        if (!res.ok) {
          const err = await res.json();
          console.log(err?.error?.details || "Pinata upload failed");
        }
  
        const result = await res.json();
        const cid = result.IpfsHash;

        const fileData: FileData = {
          cid,
          key: Buffer.from(dataToEncryptHash).toString("base64"),
        };

        console.log(fileData)

        setForm((prev) => ({ ...prev, [field]: fileData }));
      } catch (err) {
        console.error(err);
        alert(`Upload failed: ${err instanceof Error ? err.message : "Unknown error"}`);
      }
    },
    [litClient, address]
  );

  // Handle form input changes
  // This function updates the form state with the new input values
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

        const data = await res.json();
        if (!res.ok || !data.success) console.log(data.message || "Submission failed");

        setSubmitted(true);
        setApplicationStatus("pending");
      } catch (err) {
        console.error(err);
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
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`mb-8 p-4 rounded-xl flex items-start gap-4 ${
          isPending
            ? "bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800"
            : "bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800"
        }`}
      >
        <div
          className={`p-2 rounded-full ${
            isPending
              ? "bg-amber-100 dark:bg-amber-800/30 text-amber-600 dark:text-amber-300"
              : "bg-green-100 dark:bg-green-800/30 text-green-600 dark:text-green-300"
          }`}
        >
          {isPending ? <ClockIcon className="h-5 w-5" /> : <CheckCircleIcon className="h-5 w-5" />}
        </div>
        <div>
          <h3 className="font-medium">
            {isPending ? "Application Under Review" : "Application Approved"}
          </h3>
          <p className="text-sm mt-1">
            {isPending
              ? "Your application is being reviewed."
              : "Congratulations! You are now approved."}
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
          className="flex flex-col items-center justify-center h-screen space-y-4 text-center"
        >
          <div className="p-4 rounded-full bg-gray-100 dark:bg-gray-800">
            <SparklesIcon className="h-12 w-12 text-primary" />
          </div>
          <h2 className="text-2xl font-bold">Welcome to Anocare</h2>
          <p className="text-gray-500 max-w-md">Please connect your wallet to access services</p>
        </motion.div>
      </AnimatePresence>
    );
  }

  if (loading) {
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

  return (
    <div className="min-h-screen w-[90%] mx-auto bg-gray-50 dark:bg-gray-900 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
      >
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-lg bg-primary/10">
            <SparklesIcon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-sm text-gray-500">
              {address
                ? `${address.slice(0, 6)}...${address.slice(-4)}`
                : "Not connected"}
            </p>
          </div>
        </div>
        <div
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            hasPremium
              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
              : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
          }`}
        >
          {hasPremium ? "Premium" : "Free Tier"}
        </div>
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
            whileHover={{ scale: 1.01 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-8"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Membership</h3>
                {hasPremium ? (
                  <div className="flex items-center text-green-600 dark:text-green-400 gap-2">
                    <CheckCircleIcon className="h-5 w-5" />
                    <span>Premium Active</span>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">
                    Upgrade for full access
                  </p>
                )}
              </div>
              {!hasPremium && (
                <Link
                  href="/premium"
                  className="inline-flex items-center px-6 py-3 rounded-lg bg-gradient-to-r from-primary to-primary/80 text-white font-medium shadow-sm hover:from-primary/90 hover:to-primary/70 transition-all"
                >
                  Upgrade
                  <ArrowRightCircleIcon className="ml-2 h-5 w-5" />
                </Link>
              )}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* AI Chat Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 rounded-lg bg-accent/10">
                  <ChatBubbleBottomCenterTextIcon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-semibold text-lg">AI Assistant</h3>
              </div>
              <Link
                href="/chat"
                className="inline-flex items-center justify-center w-full bg-accent px-4 py-3 rounded-lg shadow-sm hover:bg-accent/90 transition-colors"
              >
                <span className="flex items-center gap-2 text-white font-medium text-sm">
                  Start Chat
                </span>
              </Link>
            </motion.div>

            {/* AnoPros Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <UserGroupIcon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">
                  Become Anocare Professional
                  </h3>
                  </div>
              {applicationStatus === "pending" ? (
                <button
                  className="inline-flex items-center justify-center w-full bg-gray-500 text-white px-4 py-3 rounded-lg text-sm font-medium shadow-sm hover:bg-black/90 transition-colors"
                  disabled={applicationStatus === "pending"}
                >
                  Pending Approval
                </button>
              ) : (
                <button
                  onClick={() => setShowApplicationForm(true)}
                  className="inline-flex items-center justify-center w-full bg-primary text-white px-4 py-3 rounded-lg text-sm font-medium shadow-sm hover:bg-primary/90 transition-colors"
                >
                  Apply Now
                </button>
              )}
            </motion.div>
          </div>

          {/* Recent Activity */}
          <motion.div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="font-semibold text-lg mb-4">Recent Activity</h3>
            {recentActivity.length > 0 ? (
              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <div className="flex-shrink-0 mr-4">
                      <div className="h-10 w-10 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                        {activity.type === "ai_chat" ? (
                          <ChatBubbleBottomCenterTextIcon className="h-5 w-5 text-accent" />
                        ) : (
                          <UserGroupIcon className="h-5 w-5 text-primary" />
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-xs text-gray-500">{activity.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                No recent activity
              </p>
            )}
          </motion.div>
        </>
      )}
    </div>
  );
};

export default UserDashboard;
