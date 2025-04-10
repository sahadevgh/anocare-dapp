import React from "react";
import { SparklesIcon } from "@heroicons/react/24/outline";

function Footer() {
  return (
    <footer>
      {/* Trust indicators */}
      <div className="bg-gray-50 dark:bg-gray-900/50 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm uppercase tracking-wider text-gray-500 mb-8">
            Trusted By
          </p>
          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center justify-center"
          >
            {[
              "HealthTech Awards",
              "Blockchain Med Alliance",
              "500+ AnoPros",
              "10,000+ Users",
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-center text-gray-700 dark:text-gray-300 font-medium"
              >
                <SparklesIcon className="h-4 w-4 text-primary mr-2" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
