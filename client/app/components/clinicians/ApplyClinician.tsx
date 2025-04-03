import { styles } from "@/app/styles/styles";
import React from "react";

interface ClinicianFormData {
  address: string;
  alias: string;
  specialty: string;
  region: string;
  message?: string;
  experience?: string;
  credentials?: string;
  availability?: string;
  license?: File | null;
  licenseIssuer?: string;
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
  // File upload handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm((prev) => ({ ...prev, license: file }));
    }
  };
  


  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className={styles.title}>Apply to Become a Verified Clinician</h1>
      <p className="mb-6 text-[--color-text]">
        Anocare ensures only qualified clinicians serve on the platform. Submit
        your credentials and experience to begin the verification process.
      </p>

      {submitted ? (
        <div className="p-4 bg-green-100 text-green-800 rounded-md">
          Your application has been submitted. We will review and get back to
          you shortly.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={styles.label}>Alias</label>
            <input
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
            <label className={styles.label}>Specialty</label>
            <input
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
            <label className={styles.label}>Region of Practice</label>
            <input
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
            <label className={styles.label}>Years of Experience</label>
            <input
              name="experience"
              type="text"
              value={form.experience || ""}
              onChange={handleChange}
              className={styles.input}
              placeholder="e.g., 5 years"
              required
            />
          </div>

          <div>
            <label className={styles.label}>
              Medical License Number or Credential ID
            </label>
            <input
              name="credentials"
              type="text"
              value={form.credentials || ""}
              onChange={handleChange}
              className={styles.input}
              placeholder="Enter registration/license ID"
              required
            />
          </div>

          <div>
            <label className={styles.label}>
              License or Certificate Upload
            </label>
            <input
              name="license"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              className={styles.input}
              title="Upload your license or certificate"
              placeholder="Upload your license or certificate"
              onChange={handleFileChange}
            />
          </div>

          <div>
            <label className={styles.label}>License Issued By</label>
            <input
              name="licenseIssuer"
              type="text"
              value={form.licenseIssuer || ""}
              onChange={handleChange}
              className={styles.input}
              placeholder="e.g., Medical and Dental Council - Ghana"
              required
            />
          </div>

          <div>
            <label className={styles.label}>Motivation</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              className={styles.textarea}
              placeholder="Why do you want to join Anocare as a verified clinician?"
              required
            />
          </div>

          <div>
            <label className={styles.label}>Wallet Address</label>
            <input
              type="text"
              value={address || "Connect Wallet First"}
              disabled
              className={styles.input}
              title="Wallet Address"
            />
          </div>

          <button type="submit" disabled={loading} className="btn btn-accent">
            {loading ? "Submitting..." : "Submit Application"}
          </button>
        </form>
      )}
    </div>
  );
}

export default ApplyClinician;
