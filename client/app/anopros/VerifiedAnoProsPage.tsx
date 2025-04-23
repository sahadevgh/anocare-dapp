'use client';

import React from 'react';
import { Header } from '../components/Header';
import AnoProDisplay from '../components/anopros/AnoProDisplay';
import Footer from '../components/homepage/Footer';

const anopros = [
  {
    alias: 'Dr. Nova',
    specialty: 'Mental Health',
    region: 'West Africa',
    isActive: true,
    address: '123 Health St, West Africa',
    email: 'nova@example.com',
    message: 'Dedicated to mental health awareness.',
    experience: '10',
    phone: '+123456789',
    rating: 4.8,
    credentials: 'PhD in Psychology',
    totalCases: 200,
  },
  {
    alias: 'HealthPro22',
    specialty: 'Nutrition & Wellness',
    region: 'East Africa',
    isActive: false,
    address: '456 Wellness Ave, East Africa',
    email: 'healthpro22@example.com',
    message: 'Promoting healthy living.',
    experience: '5',
    phone: '+987654321',
    rating: 4.5,
    credentials: 'Certified Nutritionist',
    totalCases: 120,
  },
  {
    alias: 'MindGuardian',
    specialty: 'Therapy',
    region: 'Europe',
    isActive: true,
    address: '789 Therapy Rd, Europe',
    email: 'mindguardian@example.com',
    message: 'Your mental health matters.',
    experience: '8',
    phone: '+1122334455',
    rating: 4.9,
    credentials: 'Licensed Therapist',
    totalCases: 150,
  },
];

export default function VerifiedAnoProsPage() {
  return (
    <div>
        <Header />
        <AnoProDisplay 
        anopros={anopros}
         />
         <Footer />
    </div>
  );
}
