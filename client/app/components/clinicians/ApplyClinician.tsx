import { styles } from '@/app/styles/styles';
import React from 'react'

interface ClinicianApplyProps {
    submitted: boolean;
    setSubmitted: (value: boolean) => void;
    setForm: (value: {address: string; alias: string; specialty: string; region: string; message?: string }) => void;
    form: {address: string; alias: string; specialty: string; region: string; message?: string };
    loading: boolean;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleSubmit: (e: React.FormEvent) => void;
    address?: string;
}

function ApplyClinician({address, submitted, form, loading, handleChange, handleSubmit}: ClinicianApplyProps & { address?: string }) {

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
    <h1 className={styles.title}>Apply to Become a Verified Clinician</h1>
    <p className="mb-6 text-[--color-text]">
      Once approved, you will receive an NFT that allows you to register and
      accept consultations on Anocare.
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
          <label className={styles.label}>Region</label>
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

        <label className={styles.label}>
          License or Certificate (optional)
        </label>
        <input
          name="license"
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          className={styles.input}
          title="Upload your license or certificate"
          placeholder="Upload your license or certificate"
        />

        <div>
          <label className={styles.label}>Motivation (optional)</label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            className={styles.textarea}
            placeholder="Tell us why you want to join"
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
  )
}

export default ApplyClinician