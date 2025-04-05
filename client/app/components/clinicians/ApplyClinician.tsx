import React from "react";
import { styles } from "@/app/styles/styles";
import { NFTStorage } from 'nft.storage';


interface ClinicianFormData {
  address: string;
  alias: string;
  specialty: string;
  region: string;
  message?: string;
  experience?: string;
  credentials?: string;
  availability?: string;
  licenseCID?: string;
  licenseIssuer?: string;
  nationalIdCID?: string;
}

interface ClinicianApplyProps {
  submitted: boolean;
  setSubmitted: (value: boolean) => void;
  setForm: React.Dispatch<React.SetStateAction<ClinicianFormData>>;
  form: ClinicianFormData;
  loading: boolean;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleSubmit: (e: React.FormEvent) => void;
  address?: string;
}

function ApplyClinician({
  address,
  submitted,
  form,
  loading,
  handleChange,
  handleSubmit,
  setForm
}: ClinicianApplyProps & { address?: string }) {

  function makeStorageClient() {
    return new NFTStorage({ token: process.env.NEXT_PUBLIC_NFTSTORAGE_TOKEN! });
  }
  

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof ClinicianFormData,
    label: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Assuming makeStorageClient is imported or available in scope
      const client = makeStorageClient();
      const cid = await client.storeBlob(new Blob([file]));
      setForm((prev) => ({ ...prev, [field]: cid }));
    } catch (error) {
      console.error(`${label} upload failed:`, error);
      // Consider adding error state to show to user
    }
  };

  if (submitted) {
    return (
      <div className="p-4 bg-green-100 text-green-800 rounded-md">
        Your application has been submitted. We will review and get back to
        you shortly.
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className={styles.title}>Apply to Become a Verified Clinician</h1>
      <p className="mb-6 text-[--color-text]">
        Anocare ensures only qualified clinicians serve on the platform. Submit
        your credentials and experience to begin the verification process.
      </p>

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
            aria-required="true"
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
            aria-required="true"
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
            aria-required="true"
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
            value={form.experience || ""}
            onChange={handleChange}
            className={styles.input}
            placeholder="e.g., 5 years"
            required
            aria-required="true"
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
            value={form.credentials || ""}
            onChange={handleChange}
            className={styles.input}
            placeholder="Enter registration/license ID"
            required
            aria-required="true"
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
            onChange={(e) => handleFileUpload(e, "licenseCID", "license")}
            required
            aria-required="true"
          />
          {form.licenseCID && (
            <p className="text-green-600 text-sm mt-2">
              ✅ Uploaded to IPFS — CID: {form.licenseCID.slice(0, 10)}...
            </p>
          )}
        </div>

        <div>
          <label htmlFor="licenseIssuer" className={styles.label}>
            License Issued By
          </label>
          <input
            id="licenseIssuer"
            name="licenseIssuer"
            type="text"
            value={form.licenseIssuer || ""}
            onChange={handleChange}
            className={styles.input}
            placeholder="e.g., Medical and Dental Council - Ghana"
            required
            aria-required="true"
          />
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
            onChange={(e) => handleFileUpload(e, "nationalIdCID", "national-id")}
            required
            aria-required="true"
          />
          {form.nationalIdCID && (
            <p className="text-green-600 text-sm mt-2">
              ✅ National ID uploaded — CID: {form.nationalIdCID.slice(0, 10)}...
            </p>
          )}
        </div>

        <div>
          <label htmlFor="message" className={styles.label}>
            Motivation
          </label>
          <textarea
            id="message"
            name="message"
            value={form.message}
            onChange={handleChange}
            className={styles.textarea}
            placeholder="Why do you want to join Anocare as a verified clinician?"
            required
            aria-required="true"
            rows={5}
          />
        </div>

        <div>
          <label htmlFor="walletAddress" className={styles.label}>
            Wallet Address
          </label>
          <input
            id="walletAddress"
            type="text"
            value={address || "Connect Wallet First"}
            disabled
            className={styles.input}
            title="Wallet Address"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`btn btn-accent ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? "Submitting..." : "Submit Application"}
        </button>
      </form>
    </div>
  );
}

export default ApplyClinician;