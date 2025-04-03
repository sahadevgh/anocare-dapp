"use client";

import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { 
  CheckCircleIcon, 
  SparklesIcon,
  ChatBubbleBottomCenterTextIcon,
  UserGroupIcon,
  ArrowPathIcon,
  ArrowRightCircleIcon
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const UserDashboard = () => {
  const { address, isConnected } = useAccount();
  const [hasPremium, setHasPremium] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  interface Activity {
    id: number;
    type: string;
    date: string;
    title: string;
  }

  const [recentActivity, setRecentActivity] = useState<Array<Activity>>([]);

  // Simulated check (replace with contract call)
  useEffect(() => {
    if (isConnected && address) {
      // TODO: Replace this with actual smart contract call to check premium NFT
      setTimeout(() => {
        setHasPremium(false); // simulate no premium by default
        setRecentActivity([
          { id: 1, type: 'ai_chat', date: '2 hours ago', title: 'Follow-up questions about headaches' },
          { id: 2, type: 'premium_view', date: '1 day ago', title: 'Viewed cardiology specialists' }
        ]);
        setLoading(false);
      }, 1200);
    }
  }, [isConnected, address]);

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
          <p className="text-gray-500 max-w-md">
            Please connect your wallet to access personalized health services
          </p>
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
            <h1 className="text-2xl font-bold">Your Health Dashboard</h1>
            <p className="text-sm text-gray-500">
              Wallet: {address?.slice(0, 6)}...{address?.slice(-4)}
            </p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${hasPremium ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'}`}>
          {hasPremium ? 'Premium Member' : 'Free Tier'}
        </div>
      </motion.div>

      {/* Membership Status */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-8"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">Your Membership</h3>
            {hasPremium ? (
              <div className="flex items-center text-green-600 dark:text-green-400 gap-2">
                <CheckCircleIcon className="h-5 w-5" />
                <span>Premium benefits active</span>
              </div>
            ) : (
              <p className="text-gray-500 text-sm max-w-lg">
                Upgrade to unlock full access to AI + real clinicians, priority support, and advanced health insights.
              </p>
            )}
          </div>
          {!hasPremium && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/premium"
                className="inline-flex items-center px-6 py-3 rounded-lg bg-gradient-to-r from-primary to-primary/80 text-white font-medium shadow-sm hover:from-primary/90 hover:to-primary/70 transition-all"
              >
                Upgrade to Premium
                <ArrowRightCircleIcon className="ml-2 h-5 w-5" />
              </Link>
            </motion.div>
          )}
        </div>
        {hasPremium && (
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                <p className="text-xs text-gray-500">Consultations</p>
                <p className="font-medium">Unlimited</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                <p className="text-xs text-gray-500">AI Access</p>
                <p className="font-medium">Priority</p>
              </div>
              <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                <p className="text-xs text-gray-500">Response Time</p>
                <p className="font-medium">Under 2h</p>
              </div>
              <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                <p className="text-xs text-gray-500">Renewal</p>
                <p className="font-medium">Monthly</p>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 rounded-lg bg-accent/10">
              <ChatBubbleBottomCenterTextIcon className="h-6 w-6 text-accent" />
            </div>
            <h3 className="font-semibold text-lg">AI Health Assistant</h3>
          </div>
          <p className="text-gray-500 text-sm mb-6">
            Get instant answers to your health questions from our AI assistant.
          </p>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/chat"
              className="inline-flex items-center justify-center w-full bg-accent text-white px-4 py-3 rounded-lg text-sm font-medium shadow-sm hover:bg-accent/90 transition-colors"
            >
              <SparklesIcon className="h-5 w-5 mr-2" />
              Start AI Chat
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border ${hasPremium ? 'border-gray-100 dark:border-gray-700' : 'border-gray-200 dark:border-gray-600'}`}
        >
          <div className="flex items-center space-x-4 mb-4">
            <div className={`p-3 rounded-lg ${hasPremium ? 'bg-primary/10' : 'bg-gray-100 dark:bg-gray-700'}`}>
              <UserGroupIcon className={`h-6 w-6 ${hasPremium ? 'text-primary' : 'text-gray-400'}`} />
            </div>
            <h3 className="font-semibold text-lg">Clinician Consultations</h3>
          </div>
          <p className="text-gray-500 text-sm mb-6">
            {hasPremium 
              ? "Connect with verified healthcare professionals" 
              : "Upgrade to premium for access to real clinicians"}
          </p>
          {hasPremium ? (
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/clinicians"
                className="inline-flex items-center justify-center w-full bg-primary text-white px-4 py-3 rounded-lg text-sm font-medium shadow-sm hover:bg-primary/90 transition-colors"
              >
                Browse Clinicians
              </Link>
            </motion.div>
          ) : (
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700 text-center">
              <p className="text-sm text-gray-500">Premium feature</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Recent Activity</h3>
          <button className="text-sm text-primary flex items-center">
            <ArrowPathIcon className="h-4 w-4 mr-1" />
            Refresh
          </button>
        </div>
        
        {recentActivity.length > 0 ? (
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <motion.div 
                key={activity.id}
                whileHover={{ backgroundColor: "#f9fafb" }}
                className="flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
              >
                <div className="flex-shrink-0 mr-4">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                    activity.type === 'ai_chat' 
                      ? 'bg-accent/10' 
                      : 'bg-primary/10'
                  }`}>
                    {activity.type === 'ai_chat' ? (
                      <ChatBubbleBottomCenterTextIcon className="h-5 w-5 text-accent" />
                    ) : (
                      <UserGroupIcon className="h-5 w-5 text-primary" />
                    )}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">
                    {activity.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    {activity.date}
                  </p>
                </div>
                <ArrowRightCircleIcon className="h-5 w-5 text-gray-400" />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-gray-500">No recent activity yet</p>
          </div>
        )}
      </motion.div>

      {/* Health Tips (Conditional for free tier) */}
      {!hasPremium && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 bg-gradient-to-r from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20 rounded-xl p-6 border border-primary/20"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <SparklesIcon className="h-5 w-5 text-primary" />
                Unlock Premium Benefits
              </h3>
              <p className="text-gray-500 text-sm">
                Get 24/7 access to verified clinicians, faster responses, and personalized care plans.
              </p>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/premium"
                className="inline-flex items-center px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-medium shadow-sm hover:bg-primary/90 transition-colors"
              >
                Learn More
              </Link>
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default UserDashboard;