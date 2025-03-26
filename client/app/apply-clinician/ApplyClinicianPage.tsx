"use client";

import React, { useState } from "react";
import { useAccount } from "wagmi";
import ApplyClinician from "../components/clinicians/ApplyClinician";
import { Header } from "../components/Header";

export default function ApplyClinicianPage() {
  const { address } = useAccount();
  const [form, setForm] = useState<{
    address: string;
    alias: string;
    specialty: string;
    region: string;
    message?: string;
  }>({
    address: address || "",
    alias: "",
    specialty: "",
    region: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.alias || !form.specialty || !form.region) return;

    try {
      setLoading(true);
      // Replace this with your contract interaction logic or API
      
      console.log(form);
      await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <ApplyClinician
        submitted={submitted}
        setSubmitted={setSubmitted}
        form={form}
        setForm={setForm}
        loading={loading}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        address={address}
      />
    </div>
  );
}
