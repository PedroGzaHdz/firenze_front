import React from 'react';
import { ArrowDownWideNarrow, Sparkles } from 'lucide-react';

interface Anomaly {
  type: string;
  description: string;
}

interface AnomaliesSectionProps {
  anomalies: Anomaly[];
}

export const AnomaliesSection: React.FC<AnomaliesSectionProps> = ({
  anomalies,
}) => {
  return (
    <main className='h-[35vh] overflow-auto rounded-lg border border-gray-200 bg-white px-6 py-3 shadow-sm'>
      <section className='mb-4 flex items-center justify-between gap-2'>
        <h2 className='font-family-mondwest text-sm text-gray-900'>
          Anomalies
        </h2>
        <button className='flex items-center gap-1'>
          <div className='flex h-4 w-4 items-center justify-center rounded-sm bg-white'>
            <Sparkles className='h-2.5 w-2.5 fill-white text-black' />
          </div>
          <span className='font-family-mondwest text-xs font-medium text-gray-900'>
            Ask Firenze
          </span>
        </button>
      </section>

      <section className='space-y-4'>
        {anomalies.map((anomaly, index) => (
          <article key={index} className='flex gap-3'>
            <ArrowDownWideNarrow className='mt-0.5 h-5 w-5 flex-shrink-0 text-red-500' />
            <div>
              <h3 className='font-family-mondwest mb-1 text-sm'>
                {anomaly.type}
              </h3>
              <p className='font-family-mondwest text-xs leading-relaxed text-gray-600'>
                {anomaly.description}
              </p>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
};
