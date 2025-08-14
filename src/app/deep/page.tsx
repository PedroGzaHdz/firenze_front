'use client';
import * as React from 'react';
import ChatComponent from '@/components/chatComponent';
import HeaderWholefoodsComponent from '@/components/recentView/headerRecentView';
import BodyRecentView from '@/components/recentView/bodyRecentView';

const Deep = () => {
  return (
    <main className='flex h-[90vh] flex-col justify-between'>
      <section className='h-[78%] overflow-auto bg-amber-200'>
        <HeaderWholefoodsComponent />
        <BodyRecentView />
      </section>
      <section className='flex h-[20%] w-full items-end justify-center px-20 py-0'>
        <div className='h-full w-full'>
          <ChatComponent />
        </div>
      </section>
    </main>
  );
};

export default Deep;
