import React from 'react';

interface PromoItem {
  title: string;
  dateRange: string;
  sku: string;
}

interface UpcomingPromosProps {
  promos: PromoItem[];
}

export const UpcomingPromos: React.FC<UpcomingPromosProps> = ({ promos }) => {
  return (
    <main className='grid grid-rows-2 gap-3'>
      <section className='w-full grid-rows-2 flex-col items-center gap-3 rounded-lg bg-white p-4 shadow-sm'>
        <h2 className='font-family-mondwest mb-6 w-full text-sm text-[#232323]'>
          Upcoming Promo
        </h2>
        <article className='font-family-mondwest mt-3 flex w-full flex-col items-center justify-center'>
          <h3 className='text-3xl text-[#3C6EDD]'>{promos?.[0]?.title}</h3>
          <p className='mt-4 text-xs'>{promos?.[0]?.dateRange}</p>
          <p className='text-xs'>{promos?.[0]?.sku}</p>
        </article>
      </section>

      <section className='w-full grid-rows-2 flex-col items-center gap-3 rounded-lg bg-white p-4 shadow-sm'>
        <h2 className='font-family-mondwest mb-6 w-full text-sm text-[#232323]'>
          Upcoming Promo
        </h2>
        <article className='font-family-mondwest mt-3 flex w-full flex-col items-center justify-center'>
          <h3 className='text-3xl text-[#3C6EDD]'>{promos?.[1]?.title}</h3>
          <p className='mt-4 text-xs'>{promos?.[1]?.dateRange}</p>
          <p className='text-xs'>{promos?.[1]?.sku}</p>
        </article>
      </section>
    </main>
  );
};
