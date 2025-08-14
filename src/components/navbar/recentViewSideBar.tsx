import React from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';

const RecentViewSideBar = () => {
  return (
    <main className='flex w-80 flex-col border-r border-slate-700/50 bg-slate-800/30'>
      <section className='flex items-center justify-between border-b border-slate-700/30 p-4'>
        <article>
          <h3 className='font-family-mondwest text-lg font-medium text-[#3C6EDD]'>
            Recent View
          </h3>
          <p className='mt-1 text-base font-light text-white'></p>
        </article>
        <article className='flex h-full items-start'>
          <button className='rounded p-1 text-white transition-colors hover:bg-slate-700/50 hover:text-white'>
            <PlusIcon className='h-4 w-4' />
          </button>
        </article>
      </section>
      <section className='flex flex-col items-center justify-between gap-5 p-4'>
        <article className='w-full flex-col items-start'>
          <h1 className='font-cus text-white'>Wholefoods</h1>
        </article>
        <article className='w-full flex-col items-start'>
          <h1 className='text-white'>3M</h1>
        </article>
        <article className='w-full flex-col items-start'>
          <h1 className='text-white'>Walmart</h1>
        </article>
      </section>
    </main>
  );
};

export default RecentViewSideBar;
