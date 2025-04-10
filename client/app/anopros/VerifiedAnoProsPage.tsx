'use client';

import React from 'react';
import { Header } from '../components/commons/Header';
import AnoProDisplay from '../components/anopros/AnoProDisplay';

const anopros = [
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

export default function VerifiedAnoProsPage() {
  return (
    <div>
        <Header />
        <AnoProDisplay 
        anopros={anopros}
         />
    </div>
  );
}
