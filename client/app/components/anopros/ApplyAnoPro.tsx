import React from "react";
import { styles } from "@/app/styles/styles";

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
}

const ApplyAnoPro: React.FC<AnoProApplyProps> = ({
  submitted,
  form,
  loading,
  handleChange,
  handleSubmit,
  handleFileUpload,
  setShowApplicationForm,
}) => {
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

        <button
          onClick={() => setShowApplicationForm(false)}
          className="border rounded-3xl px-4 py-2 absolute right-0 bottom-0 text-sm text-gray-500 bg-gray-50 dark:bg-gray-800 dark:text-gray-400 border-gray-500/25 shadow-lg cursor-pointer hover:scale-95 transition-transform"
          type="button"
        >
          Go back
        </button>
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
          <label htmlFor="licenseIssuer" className={styles.label}>
            License Issuer
          </label>
          <input
            id="licenseIssuer"
            name="licenseIssuer"
            type="text"
            value={form.licenseIssuer}
            onChange={handleChange}
            className={styles.input}
            placeholder="Enter your license issuing organization"
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
              ✅ License upload successful. CID: {form.licenseFile.cid}
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
              ✅ National ID upload successful. CID: {form.nationalIdFile.cid}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="message" className={styles.label}>
            Message (Optional)
          </label>
          <textarea
            id="message"
            name="message"
            value={form.message}
            onChange={handleChange}
            className={`${styles.input} min-h-[100px]`}
            placeholder="Add any additional information..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`${styles.button!} ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Submitting..." : "Submit Application"}
        </button>
      </form>
    </div>
  );
};

export default ApplyAnoPro;
