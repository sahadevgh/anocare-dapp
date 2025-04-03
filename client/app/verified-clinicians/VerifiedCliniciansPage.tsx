'use client';

import React from 'react';
import Clinicians from '../components/clinicians/Clinicians';
import { Header } from '../components/commons/Header';

const clinicians = [
  {
    alias: 'Dr. Nova',
    specialty: 'Mental Health',
    region: 'West Africa',
    isActive: true,
  },
  {
    alias: 'HealthPro22',
    specialty: 'Nutrition & Wellness',
    region: 'East Africa',
    isActive: false,
  },
  {
    alias: 'MindGuardian',
    specialty: 'Therapy',
    region: 'Europe',
    isActive: true,
  },
];

export default function VerifiedCliniciansPage() {
  return (
    <div>
        <Header />
        <Clinicians clinicians={clinicians} />
    </div>
  );
}
