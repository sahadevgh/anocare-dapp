"use client";

import React, { useState } from "react";
import { useAccount } from "wagmi";
import ApplyClinician from "../components/clinicians/ApplyClinician";
import { Header } from "../components/commons/Header";

export default function ApplyClinicianPage() {
  const { address } = useAccount();
  const [form, setForm] = useState<{
    address: string;
    alias: string;
    specialty: string;
    region: string;
    experience?: string;
    credentials?: string;
    licenseIssuer?: string;
    message?: string;
    license?: File | null;
  }>({
    address: address || "",
    alias: "",
    specialty: "",
    region: "",
    experience: "",
    credentials: "",
    licenseIssuer: "",
    message: "",
    license: null,
  });

  // const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    let fileBase64 = "";
    if (form.license) {
      fileBase64 = await convertFileToBase64(form.license);
    }
  
    const payload = {
      ...form,
      address: address || "",
      file: fileBase64,
    };
  
    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        alert(data.error || "Submission failed.");
      }
    } catch (error) {
      console.error("Error submitting application:", error);
    }
  };
  

  return (
    <div>
      <Header />
      {
        address ? (
          <ApplyClinician
          submitted={submitted}
          setSubmitted={setSubmitted}
          form={form}
          setForm={setForm}
          loading={false}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          address={address}
        />
        ) : (
          <div className="text-center text-lg mt-4">
            Please connect your wallet to apply.
          </div>
        ) 
      }
     
    </div>
  );
}
