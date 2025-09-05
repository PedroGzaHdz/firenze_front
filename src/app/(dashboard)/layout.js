import { Search } from 'lucide-react';
import { Suspense } from 'react';
import Sidebar from '@/components/newSideBar';

export default function DashboardLayout({ children }) {
  return (
    <div className='flex h-screen bg-slate-50'>
      <Sidebar />
      <div className='flex flex-1 flex-col'>
        <Suspense fallback={<div>Loading...</div>}>
          <header className='h-16 border-b bg-slate-800 px-6 py-4'>
            <div className='relative max-w-md'>
              <Search className='absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-slate-400' />
              <input
                type='text'
                placeholder='Search SKU, Contracts, Vendors'
                className='w-full rounded-lg border border-slate-300 bg-white py-2 pr-4 pl-10 text-sm text-slate-900 placeholder-slate-500 focus:border-transparent focus:ring-2 focus:ring-blue-500'
              />
            </div>
          </header>
        </Suspense>
        <main className='flex-1 overflow-auto p-6'>{children}</main>
      </div>
    </div>
  );
}
