import React from 'react'

interface Clinician {
  alias: string;
  specialty: string;
  region: string;
  isActive: boolean;
}

function Clinicians({ clinicians }: { clinicians: Clinician[] }) {
  return (
<div className="min-h-screen bg-bg dark:bg-bg-dark px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="font-bold mb-2">Verified Clinicians</h1>
        <p className="text-text dark:text-text-dark mb-6">
          These are trusted health professionals who have been verified by the Anocare network.
        </p>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {clinicians.map((c: Clinician, index: number) => (
            <div
              key={index}
              className="bg-bg dark:bg-black border border-gray-500/25 rounded-lg p-4 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-[--color-primary]">{c.alias}</h3>
              <p className="text-sm ">{c.specialty}</p>
              <p className="text-sm text-">{c.region}</p>
              <span
                className={`inline-block mt-2 text-xs font-medium px-2 py-1 rounded ${
                  c.isActive
                    ? 'bg-success/10 text-success'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {c.isActive ? 'Available' : 'Unavailable'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Clinicians