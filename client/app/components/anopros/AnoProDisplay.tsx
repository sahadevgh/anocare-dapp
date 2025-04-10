import React from 'react';

interface AnoPro {
  alias: string;
  specialty: string;
  region: string;
  isActive: boolean;
}

function AnoProDisplay({ anopros }: { anopros: AnoPro[] }) {
  return (
    <div className="min-h-screen bg-bg dark:bg-bg-dark px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="font-bold mb-2">Verified AnoPros</h1>
        <p className="text-text dark:text-text-dark mb-6">
          These are trusted health professionals who have been verified by the Anocare network.
        </p>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {anopros.map((a: AnoPro, index: number) => (
            <div
              key={index}
              className="bg-bg dark:bg-black border border-gray-500/25 rounded-lg p-4 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-[--color-primary]">{a.alias}</h3>
              <p className="text-sm">{a.specialty}</p>
              <p className="text-sm">{a.region}</p>
              <span
                className={`inline-block mt-2 text-xs font-medium px-2 py-1 rounded ${
                  a.isActive
                    ? 'bg-success/10 text-success'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {a.isActive ? 'Available' : 'Unavailable'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AnoProDisplay;
