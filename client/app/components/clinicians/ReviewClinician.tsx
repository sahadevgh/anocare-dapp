"use client";

import React, { useEffect, useState } from "react";
import { CheckIcon, XMarkIcon, DocumentTextIcon, ClockIcon, UserIcon, AcademicCapIcon, MapPinIcon, BriefcaseIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { getContract, VERIFIED_NFT_ADDRESS } from "../constants";
import { VerifiedClinicianNFT_ABI } from "../contracts/abis";
import { middleEllipsis } from "@/app/lib/middleEllipsis";

interface Applicant {
  id: string;
  alias: string;
  specialty: string;
  region: string;
  experience: string;
  credentials: string;
  licenseIssuer: string;
  availability: string;
  address: string;
  message: string;
  license?: {
    public_id: string;
    url: string;
  };
  status: string;
  isActive: boolean;
  createdAt: string;
  submittedAt: string;
}

const ReviewClinician = () => {
  const [applications, setApplications] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);

  const getApplications = async () => {
    setLoading(true);
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

  useEffect(() => {
    getApplications();
  }, []);


  const handleApprove = async (address: string) => {
    const contract = await getContract(VERIFIED_NFT_ADDRESS, VerifiedClinicianNFT_ABI);
    if (!contract) {
      console.error("Contract not loaded");
      return;
    }
    try {
        // Call the mint function on the contract
        const tx = await contract.mint(address);
        await tx.wait();
        console.log("Minted NFT successfully");
        
      // Call the approval API endpoint with the address
      const response = await fetch("/api/approve-applicant", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address }),
      });
      
      if (response.ok) {
        setApplications(prev => prev.filter(app => app.address !== address));
      } else {
        console.error("Approval failed");
      }
    } catch (error) {
      console.error("Error approving applicant:", error);
    }
  };

  const handleReject = async (address: string) => {
    try {
      // Call your rejection API endpoint
      const response = await fetch("/api/reject-applicant", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address }),
      });
      
      if (response.ok) {
        setApplications(prev => prev.filter(app => app.address !== address));
      } else {
        console.error("Rejection failed");
      }
    } catch (error) {
      console.error("Error rejecting applicant:", error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent"
        />
      </div>
    );
  }

  if (!applications.length) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center p-6">
        <DocumentTextIcon className="h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-xl font-medium text-gray-900 dark:text-white">No pending applications</h3>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          All clinician applications have been processed
        </p>
        <button
          onClick={getApplications}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none"
        >
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold leading-tight text-gray-900 dark:text-white">
            Clinician Applications
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Review and verify new clinician credentials
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={getApplications}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <ClockIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
            Refresh
          </button>
        </div>
      </div>

      <div className="mt-8 space-y-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {applications.map((app) => (
          <motion.div
            key={app.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg divide-y divide-gray-200 dark:divide-gray-700"
          >
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {app.alias}
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Applied on {formatDate(app.submittedAt)}
                </p>
              </div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                {app.specialty}
              </span>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <UserIcon className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
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
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
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
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
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
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
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
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
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
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
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
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Motivation Message
                </h4>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {app.message}
                  </p>
                </div>
              </div>

              {app.license && (
                <div className="mt-6">
                  <a
                    href={app.license.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                  >
                    <DocumentTextIcon className="-ml-1 mr-2 h-5 w-5" />
                    View License Document
                  </a>
                </div>
              )}

                <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Status
                </h4>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {app.status}
                  </p>
                </div>
              </div>
            </div>
            <div className="px-4 py-4 sm:px-6 flex justify-end space-x-3">
              <button
                onClick={() => handleReject(app.address)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none"
              >
                <XMarkIcon className="-ml-1 mr-2 h-5 w-5" />
                Reject
              </button>
              <button
                onClick={() => handleApprove(app.address)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none"
              >
                <CheckIcon className="-ml-1 mr-2 h-5 w-5" />
                Approve
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ReviewClinician;