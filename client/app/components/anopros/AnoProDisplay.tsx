import React from 'react';
import { FaUserMd, FaMapMarkerAlt, FaStar, FaBriefcaseMedical, FaCertificate, FaEnvelope, FaCheckCircle } from 'react-icons/fa';
import { IoMdTime } from 'react-icons/io';
import { MdWork, MdHealthAndSafety } from 'react-icons/md';

interface AnoPro {
  address: string;
  alias: string;
  email: string;
  specialty: string;
  region: string;
  message: string;
  experience: string;
  credentials: string;
  status?: string;
  isActive: boolean;
  totalCases: number;
  rating: number;
  imageUrl?: string;
}

function AnoProDisplay({ anopros }: { anopros: AnoPro[] }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Verified AnoPros</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Trusted health professionals verified by the Anocare network. Each specialist undergoes rigorous screening for your safety.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {anopros.map((a: AnoPro, index: number) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 dark:border-gray-700"
            >
              {/* Profile Header */}
              <div className="relative">
                <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600"></div>
                <div className="absolute -bottom-12 left-4">
                  <div className="h-24 w-24 rounded-full border-4 border-white dark:border-gray-800 bg-white overflow-hidden">
                    {a.imageUrl ? (
                      <img src={a.imageUrl} alt={a.alias} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                        <FaUserMd className="text-3xl text-gray-500 dark:text-gray-400" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="absolute top-4 right-4">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                      a.isActive
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {a.isActive ? (
                      <>
                        <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                        Available
                      </>
                    ) : (
                      <>
                        <span className="w-2 h-2 rounded-full bg-gray-500 mr-2"></span>
                        Unavailable
                      </>
                    )}
                  </span>
                </div>
              </div>

              {/* Profile Content */}
              <div className="pt-16 px-6 pb-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                      {a.alias}
                      <FaCheckCircle className="ml-2 text-blue-500 text-sm" />
                    </h3>
                    <p className="text-blue-600 dark:text-blue-400 font-medium">{a.specialty}</p>
                  </div>
                  <div className="flex items-center bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded">
                    <FaStar className="text-yellow-500 mr-1" />
                    <span className="font-semibold text-yellow-700 dark:text-yellow-300">{a.rating?.toFixed(1)}</span>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-start">
                    <FaMapMarkerAlt className="text-gray-500 dark:text-gray-400 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Location</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{a.region}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <MdWork className="text-gray-500 dark:text-gray-400 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Experience</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{a.experience}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <FaCertificate className="text-gray-500 dark:text-gray-400 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Credentials</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{a.credentials}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <MdHealthAndSafety className="text-gray-500 dark:text-gray-400 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Cases Handled</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{a.totalCases} successful cases</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center border-t border-gray-200 dark:border-gray-700 pt-4">
                  <button className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center">
                    <FaEnvelope className="mr-2" />
                    Contact
                  </button>
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200">
                    View Profile
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AnoProDisplay;