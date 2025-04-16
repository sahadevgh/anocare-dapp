import React, { useEffect, useState } from "react";
import { checkAnoTokenBalance } from "../constants";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Button } from "../ui/Button";

interface FileData {
  cid: string; // IPFS CID
  key: string; // base64-encoded encrypted symmetric key
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

interface AnoProApplyProps {
  submitted: boolean;
  setSubmitted: (value: boolean) => void;
  form: AnoProFormData;
  loading: boolean;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleFileUpload: (
    file: File,
    field: "licenseFile" | "nationalIdFile"
  ) => Promise<void>;
  setShowApplicationForm: (value: boolean) => void;
  address?: string;
}

const ApplyAnoPro: React.FC<AnoProApplyProps> = ({
  submitted,
  form,
  loading,
  handleChange,
  handleSubmit,
  handleFileUpload,
  setShowApplicationForm,
  address,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [ownsAnoToken, setOwnsToken] = useState(false);

  const onFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "licenseFile" | "nationalIdFile"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await handleFileUpload(file, field);
    } catch (error) {
      console.error(`File upload failed:`, error);
      alert(
        `File upload failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  useEffect(() => {
    setIsLoading(true);
    const checkBalance = async () => {
      if (!address) return;
      const isAnoHolder = await checkAnoTokenBalance(address);
      setOwnsToken(isAnoHolder);
    };

    checkBalance();
    setIsLoading(false);
  }, [address]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="h-16 w-16 rounded-full border-4 border-blue-600 dark:border-blue-400 border-t-transparent"
        />
      </div>
    );
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto px-4 py-10"
      >
        <div className="p-6 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold text-green-800 dark:text-green-300">
            Application Submitted
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Your application has been submitted. We will review and get back to
            you shortly.
          </p>
          <Button
            onClick={() => setShowApplicationForm(false)}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Go Back
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 relative">
      <div className="w-full relative">
        <Button
          onClick={() => setShowApplicationForm(false)}
          className="relative left-0 top-0 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Go Back
        </Button>
      </div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-8 flex flex-col items-start relative mt-4"
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
          Apply to Become a Verified AnoPro
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg">
          Anocare ensures only qualified AnoPros serve on the platform. Submit
          your credentials and experience to begin the verification process.
        </p>
      </motion.div>

      {/* Form */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 sm:p-8 shadow-sm border border-gray-200 dark:border-gray-700 space-y-6"
      >
        {!ownsAnoToken && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 p-4 rounded-lg text-sm text-red-700 dark:text-red-300"
          >
            🚫 You must hold at least <strong>100 ANO</strong> tokens to apply
            as an AnoPro.
          </motion.div>
        )}

        {/* Alias */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <label
            htmlFor="alias"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Alias
          </label>
          <input
            id="alias"
            name="alias"
            type="text"
            value={form.alias}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="DrHopeful"
            required
            disabled={!ownsAnoToken}
          />
        </motion.div>

        {/* Email */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="user@example.com"
            required
            disabled={!ownsAnoToken}
          />
        </motion.div>

        {/* Specialty */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <label
            htmlFor="specialty"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Specialty
          </label>
          <input
            id="specialty"
            name="specialty"
            type="text"
            value={form.specialty}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="e.g., Mental Health, Nutrition"
            required
            disabled={!ownsAnoToken}
          />
        </motion.div>

        {/* Region */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <label
            htmlFor="region"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Region of Practice
          </label>
          <input
            id="region"
            name="region"
            type="text"
            value={form.region}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="e.g., West Africa"
            required
            disabled={!ownsAnoToken}
          />
        </motion.div>

        {/* Experience */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <label
            htmlFor="experience"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Years of Experience
          </label>
          <input
            id="experience"
            name="experience"
            type="text"
            value={form.experience}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="e.g., 5 years"
            required
            disabled={!ownsAnoToken}
          />
        </motion.div>

        {/* Credentials */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <label
            htmlFor="credentials"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Medical License Number or Credential ID
          </label>
          <input
            id="credentials"
            name="credentials"
            type="text"
            value={form.credentials}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="Enter registration/license ID"
            required
            disabled={!ownsAnoToken}
          />
        </motion.div>

        {/* License Issuer */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <label
            htmlFor="licenseIssuer"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            License Issuer
          </label>
          <input
            id="licenseIssuer"
            name="licenseIssuer"
            type="text"
            value={form.licenseIssuer}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="Enter your license issuing organization"
            required={form.licenseFile === null}
            disabled={!ownsAnoToken}
          />
        </motion.div>

        {/* License Upload */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <label
            htmlFor="licenseUpload"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            License or Certificate Upload
          </label>
          <input
            id="licenseUpload"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 dark:file:bg-blue-900 dark:file:text-blue-400 dark:hover:file:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
            onChange={(e) => onFileChange(e, "licenseFile")}
            required={form.nationalIdFile === null}
            disabled={!ownsAnoToken}
          />
          <AnimatePresence>
            {form.licenseFile && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-green-600 dark:text-green-400 text-sm mt-2"
              >
                ✅ License upload successful. CID: {form.licenseFile.cid}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* National ID Upload */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <label
            htmlFor="nationalIdUpload"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Upload National ID Document
          </label>
          <input
            id="nationalIdUpload"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 dark:file:bg-blue-900 dark:file:text-blue-400 dark:hover:file:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
            onChange={(e) => onFileChange(e, "nationalIdFile")}
            required
            disabled={!ownsAnoToken}
          />
          <AnimatePresence>
            {form.nationalIdFile && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-green-600 dark:text-green-400 text-sm mt-2"
              >
                ✅ National ID upload successful. CID: {form.nationalIdFile.cid}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Message (Optional)
          </label>
          <textarea
            id="message"
            name="message"
            value={form.message}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none min-h-[120px] disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="Add any additional information..."
            disabled={!ownsAnoToken}
          />
        </motion.div>

        {/* Submit Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <Button
            type="submit"
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white ${
              loading || !ownsAnoToken ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading || !ownsAnoToken}
          >
            {loading ? "Submitting..." : "Submit Application"}
          </Button>
        </motion.div>
      </motion.form>
    </div>
  );
};

export default ApplyAnoPro;
