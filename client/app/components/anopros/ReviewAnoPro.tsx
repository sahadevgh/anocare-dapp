/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  CheckIcon,
  XMarkIcon,
  DocumentTextIcon,
  ClockIcon,
  UserIcon,
  AcademicCapIcon,
  MapPinIcon,
  BriefcaseIcon,
  ShieldCheckIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import {
  ANOCARE_CONTRACT_ADDRESS,
  getContract,
  VERIFIED_NFT_ADDRESS,
} from "../constants";
import { middleEllipsis } from "@/app/lib/middleEllipsis";
import {
  AnoCareContract_ABI,
  VerifiedAnoProNFTContract_ABI,
} from "../contracts/abis";
import { ethers } from "ethers";
import { useAccount } from "wagmi";
import CryptoJS from "crypto-js";
import { Button } from "../ui/Button";


interface FileData {
  cid: string;
  key: string;
}

interface Applicant {
  id: string;
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
  isActive: boolean;
  createdAt: string;
  submittedAt: string;
}

const ReviewAnoPro = () => {
  const { address } = useAccount();
  const [applications, setApplications] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [decryptingFiles, setDecryptingFiles] = useState<
    Record<string, boolean>
  >({});

  // Fetch applications on mount
  useEffect(() => {
    setLoading(true);
    getApplications();
    setLoading(false);
  }, []);

  // DECRYPT FUNCTION
  const decryptFile = useCallback(
    async (cid: string, key: string) => {
      try {
        const contract = await getContract(
          ANOCARE_CONTRACT_ADDRESS,
          AnoCareContract_ABI
        );
        const isAdmin = await contract?.isAdmin(address);
        if (!isAdmin) throw new Error("Admin access required");

        const res = await fetch(`https://ipfs.io/ipfs/${cid}`);
        const encryptedBase64 = await res.text();

        // Decrypt the file using CryptoJS
        const decrypted = CryptoJS.AES.decrypt(encryptedBase64, key);

        const decryptedDataUrl = decrypted.toString(CryptoJS.enc.Utf8);

        if (!decryptedDataUrl || decryptedDataUrl.trim() === "") {
          throw new Error("Decryption returned empty string");
        }

        return { file: decryptedDataUrl };
      } catch (error) {
        console.error("Error decrypting file:", error);
        throw new Error("Decryption failed");
      }
    },
    [address]
  );

  const handleViewDocument = async (fileData: FileData) => {
    setDecryptingFiles((prev) => ({ ...prev, [fileData.cid]: true }));

    try {
      const decryptedContent = await decryptFile(fileData.cid, fileData.key);
      const dataUrl = decryptedContent.file;

      if (!dataUrl.startsWith("data:")) {
        throw new Error("Decryption output is not a valid data URL");
      }

      // Extract MIME type and base64 content
      const [prefix, base64] = dataUrl.split(",");
      const mimeMatch = prefix.match(/^data:(.*);base64$/);
      if (!mimeMatch || !base64) {
        throw new Error("Invalid base64 format");
      }

      const mimeType = mimeMatch[1]; // e.g., image/jpeg, application/pdf
      const binaryString = atob(base64);
      const byteArray = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        byteArray[i] = binaryString.charCodeAt(i);
      }

      // Create blob and open in new tab
      const blob = new Blob([byteArray], { type: mimeType });
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error decrypting file:", error);
      alert("Could not open file. Check console for details.");
    } finally {
      setDecryptingFiles((prev) => ({ ...prev, [fileData.cid]: false }));
    }
  };

  const handleApprove = async (address: string) => {
    const contract = await getContract(
      VERIFIED_NFT_ADDRESS,
      VerifiedAnoProNFTContract_ABI
    );
    if (!contract) {
      console.error("Contract not loaded");
      return;
    }
    try {
      const tx = await contract.mint(address);
      await tx.wait();
      console.log("Minted NFT successfully");

      if (tx) {
        const response = await fetch("/api/approve-applicant", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ address }),
        });

        if (response.ok) {
          setApplications((prev) =>
            prev.filter((app) => app.address !== address)
          );
        } else {
          console.error("Fetch failed");
        }
      } else {
        console.error("Approval transaction failed");
      }
    } catch (error) {
      console.error("Error approving applicant:", error);
    }
  };

  const handleReject = async (address: string) => {
    try {
      const response = await fetch("/api/reject-applicant", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address }),
      });

      if (response.ok) {
        setApplications((prev) =>
          prev.filter((app) => app.address !== address)
        );
      } else {
        console.error("Rejection failed");
      }
    } catch (error) {
      console.error("Error rejecting applicant:", error);
    }
  };

  const getApplications = async () => {
    try {
      const response = await fetch("/api/get-applicants");
      const data = await response.json();
      setApplications(data.applicants || []);
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 dark:bg-gray-900">
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
            <DocumentTextIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </motion.div>
        </motion.div>
      </div>
    );
  }

  if (!applications.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center justify-center h-64 text-center p-6 bg-gray-50 dark:bg-gray-900 rounded-xl"
      >
        <motion.div
          className="p-4 rounded-full bg-gray-100 dark:bg-gray-800"
          whileHover={{ scale: 1.1 }}
        >
          <DocumentTextIcon className="h-12 w-12 text-gray-400 dark:text-gray-300" />
        </motion.div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-4">
          No Pending Applications
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          All AnoPro applications have been processed.
        </p>
        <Button
          onClick={getApplications}
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white"
        >
          Refresh
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="sm:flex sm:items-center mb-8"
      >
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            AnoPro Applications
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            Review and verify new AnoPro credentials.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Button
            onClick={getApplications}
            className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <ClockIcon className="h-5 w-5 mr-2" />
            Refresh
          </Button>
        </div>
      </motion.div>

      {/* Applications Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {applications.map((app, index) => (
          <motion.div
            key={app.id || `${app.address}-${app.submittedAt}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            {/* Card Header */}
            <div className="px-6 py-5 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {app.alias}
                </h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  Applied on {formatDate(app.submittedAt)}
                </p>
              </div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-400">
                {app.specialty}
              </span>
            </div>

            {/* Card Body */}
            <div className="px-6 py-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <UserIcon className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Alias
                      </p>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {app.alias}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <AcademicCapIcon className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Credentials
                      </p>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {app.credentials}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <BriefcaseIcon className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Experience
                      </p>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {app.experience}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <MapPinIcon className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Region
                      </p>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {app.region}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <ShieldCheckIcon className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        License Issuer
                      </p>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {app.licenseIssuer}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <DocumentTextIcon className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Wallet Address
                      </p>
                      <p className="text-sm font-mono text-gray-900 dark:text-white">
                        {middleEllipsis(app.address, 4)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Motivation Message
                </h4>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 dark:text-gray-300 break-words">
                    {app.message || "No message provided."}
                  </p>
                </div>
              </div>

              {app.licenseFile && (
                <div className="mt-4">
                  <Button
                    onClick={() => handleViewDocument(app.licenseFile!)}
                    disabled={decryptingFiles[app.licenseFile.cid]}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <EyeIcon className="h-5 w-5 mr-2" />
                    {decryptingFiles[app.licenseFile.cid]
                      ? "Decrypting..."
                      : "View License"}
                  </Button>
                </div>
              )}

              {app.nationalIdFile && (
                <div className="mt-4">
                  <Button
                    onClick={() => handleViewDocument(app.nationalIdFile!)}
                    disabled={decryptingFiles[app.nationalIdFile.cid]}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <EyeIcon className="h-5 w-5 mr-2" />
                    {decryptingFiles[app.nationalIdFile.cid]
                      ? "Decrypting..."
                      : "View ID Document"}
                  </Button>
                </div>
              )}

              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Status
                </h4>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {app.status || "Pending"}
                  </p>
                </div>
              </div>
            </div>

            {/* Card Footer */}
            <div className="px-6 py-4 flex justify-end space-x-3 border-t border-gray-200 dark:border-gray-700">
              <Button
                onClick={() => handleReject(app.address)}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                <XMarkIcon className="h-5 w-5 mr-2" />
                Reject
              </Button>
              <Button
                onClick={() => handleApprove(app.address)}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                <CheckIcon className="h-5 w-5 mr-2" />
                Approve
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ReviewAnoPro;