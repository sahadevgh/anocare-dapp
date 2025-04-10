import React from "react";
import { styles } from "@/app/styles/styles";

interface FileData {
  file: File;
  encryptedData?: ArrayBuffer;
  iv?: Uint8Array;
  key?: CryptoKey;
  cid?: string;
  encryptionKey?: string;
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
}

function ApplyAnoPro({
  submitted,
  form,
  loading,
  handleChange,
  handleSubmit,
  handleFileUpload,
  setShowApplicationForm
}: AnoProApplyProps) {
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

  if (submitted) {
    return (
      <div className="p-4 bg-green-100 text-green-800 rounded-md">
        Your application has been submitted. We will review and get back to you
        shortly.
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-6 flex flex-col items-start relative">
        <h1 className={styles.title}>Apply to Become a Verified AnoPro</h1>
        <p className="text-text dark:text-gray-400 mb-4">
          Anocare ensures only qualified AnoPros serve on the platform. Submit
          your credentials and experience to begin the verification process.
        </p>

        <div
          onClick={() => setShowApplicationForm(false)}
        className="border rounded-3xl px-4 absolute right-0 bottom-0 text-sm text-gray-500 bg-gray-50 dark:bg-gray-800 dark:text-gray-400 border-gray-500/25 shadow-lg cursor-pointer hover:scale-95">
          Go back
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="alias" className={styles.label}>
            Alias
          </label>
          <input
            id="alias"
            name="alias"
            type="text"
            value={form.alias}
            onChange={handleChange}
            className={styles.input}
            placeholder="DrHopeful"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className={styles.label}>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className={styles.input}
            placeholder="user@example.com"
            required
          />
        </div>

        <div>
          <label htmlFor="specialty" className={styles.label}>
            Specialty
          </label>
          <input
            id="specialty"
            name="specialty"
            type="text"
            value={form.specialty}
            onChange={handleChange}
            className={styles.input}
            placeholder="e.g., Mental Health, Nutrition"
            required
          />
        </div>

        <div>
          <label htmlFor="region" className={styles.label}>
            Region of Practice
          </label>
          <input
            id="region"
            name="region"
            type="text"
            value={form.region}
            onChange={handleChange}
            className={styles.input}
            placeholder="e.g., West Africa"
            required
          />
        </div>

        <div>
          <label htmlFor="experience" className={styles.label}>
            Years of Experience
          </label>
          <input
            id="experience"
            name="experience"
            type="text"
            value={form.experience}
            onChange={handleChange}
            className={styles.input}
            placeholder="e.g., 5 years"
            required
          />
        </div>

        <div>
          <label htmlFor="credentials" className={styles.label}>
            Medical License Number or Credential ID
          </label>
          <input
            id="credentials"
            name="credentials"
            type="text"
            value={form.credentials}
            onChange={handleChange}
            className={styles.input}
            placeholder="Enter registration/license ID"
            required
          />
        </div>

        <div>
          <label htmlFor="licenseUpload" className={styles.label}>
            License or Certificate Upload
          </label>
          <input
            id="licenseUpload"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            className={styles.input}
            onChange={(e) => onFileChange(e, "licenseFile")}
            required
          />
          {form.licenseFile && (
            <p className="text-green-600 text-sm mt-2">
              ✅ {form.licenseFile.file.name} uploaded successfully
            </p>
          )}
        </div>

        <div>
          <label htmlFor="nationalIdUpload" className={styles.label}>
            Upload National ID Document
          </label>
          <input
            id="nationalIdUpload"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            className={styles.input}
            onChange={(e) => onFileChange(e, "nationalIdFile")}
            required
          />
          {form.nationalIdFile && (
            <p className="text-green-600 text-sm mt-2">
              ✅ {form.nationalIdFile.file.name} uploaded successfully
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`${styles.button} ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Submitting..." : "Submit Application"}
        </button>
      </form>
    </div>
  );
}

export default ApplyAnoPro;
