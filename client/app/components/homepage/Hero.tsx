"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  ArrowRightIcon,
  ShieldCheckIcon,
  ChatBubbleBottomCenterTextIcon,
  UserGroupIcon,
  SparklesIcon
} from "@heroicons/react/24/outline";
import Link from "next/link";

const HeroSection = () => {
  return (
    <div className="relative bg-gradient-to-br from-primary/5 to-white dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10 dark:opacity-5">
        <div className="absolute top-0 left-20 w-64 h-64 bg-accent rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
        <div className="absolute top-0 right-20 w-64 h-64 bg-secondary rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-64 h-64 bg-primary rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center md:text-left"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              <span className="block">Healthcare</span>
              <span className="block text-primary">Reimagined</span>
            </h1>
            
            <p className="mt-6 text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-lg">
              Instant access to AI-powered health insights and verified clinicians - all secured by blockchain technology.
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/signup"
                  className="flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary hover:bg-primary/90 shadow-lg md:py-4 md:text-lg md:px-10"
                >
                  Get Started
                  <ArrowRightIcon className="ml-2 h-5 w-5" />
                </Link>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/demo"
                  className="flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-primary bg-white hover:bg-gray-50 shadow md:py-4 md:text-lg md:px-10 dark:bg-gray-700 dark:hover:bg-gray-600"
                >
                  Live Demo
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* Right content - Feature cards */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 gap-6"
          >
            {/* Feature 1 */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 p-3 rounded-lg bg-accent/10">
                  <ChatBubbleBottomCenterTextIcon className="h-6 w-6 text-accent" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold">AI Health Assistant</h3>
                  <p className="mt-1 text-gray-600 dark:text-gray-400">
                    Get instant, confidential health advice anytime, anywhere.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Feature 2 */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 p-3 rounded-lg bg-primary/10">
                  <UserGroupIcon className="h-6 w-6 text-primary" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold">Verified Clinicians</h3>
                  <p className="mt-1 text-gray-600 dark:text-gray-400">
                    Connect with certified healthcare professionals on demand.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Feature 3 */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 p-3 rounded-lg bg-secondary/10">
                  <ShieldCheckIcon className="h-6 w-6 text-secondary" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold">Blockchain Security</h3>
                  <p className="mt-1 text-gray-600 dark:text-gray-400">
                    Your health data remains private and tamper-proof.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Trust indicators */}
      <div className="bg-gray-50 dark:bg-gray-900/50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm uppercase tracking-wider text-gray-500 mb-6">
            Trusted By
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-center">
            {[
              "HealthTech Awards",
              "Blockchain Med Alliance",
              "500+ Clinicians",
              "10,000+ Users"
            ].map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="flex items-center justify-center text-gray-700 dark:text-gray-300 font-medium"
              >
                <SparklesIcon className="h-4 w-4 text-primary mr-2" />
                {item}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Global styles for animations */}
      <style jsx global>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default HeroSection;