'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  MessageCircle,
  LayoutDashboard,
  FileText,
  TrendingUp,
  Factory,
  Settings,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/utils/tailwind';

const navigation = [
  { name: 'Ask AI', href: '/ask-ai', icon: MessageCircle },
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Documents', href: '/documents', icon: FileText },
];

const operations = [
  { name: 'Sales & Forecast', href: '/sales-forecast', icon: TrendingUp },
  { name: 'Plan Production', href: '/plan-production', icon: Factory },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className='flex h-screen w-64 flex-col bg-slate-800 text-white'>
      {/* Logo */}
      <div className='flex h-16 items-center border-b border-slate-700 px-6'>
        <div className='text-2xl font-bold text-green-400'>pistakio</div>
      </div>

      {/* Navigation */}
      <nav className='flex-1 space-y-1 px-4 py-4'>
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white',
              )}
            >
              <item.icon className='h-5 w-5' />
              {item.name}
            </Link>
          );
        })}

        {/* Operations Section */}
        <div className='pt-6'>
          <div className='px-3 pb-2'>
            <p className='text-xs font-semibold tracking-wider text-slate-400 uppercase'>
              OPERATIONS
            </p>
          </div>
          {operations.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white',
                )}
              >
                <item.icon className='h-5 w-5' />
                {item.name}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Settings */}
      <div className='border-t border-slate-700 p-4'>
        <div
          className={cn(
            'flex cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium opacity-60 transition-colors',
            'text-slate-400',
          )}
        >
          <Settings className='h-5 w-5' />
          <span>Settings</span>
          <span className='ml-auto rounded bg-slate-600 px-2 py-1 text-xs text-slate-300'>
            Próximamente
          </span>
        </div>
      </div>

      {/* Footer */}
      {/*<div className='border-t border-slate-700 p-4'>*/}
      {/*  <div className='mb-2 text-xs text-slate-400'>Free Plan</div>*/}
      {/*  <div className='mb-2 text-xs text-slate-400'>Actions left: 27/50</div>*/}
      {/*  <button className='text-xs text-blue-400 hover:text-blue-300'>*/}
      {/*    Upgrade*/}
      {/*  </button>*/}

      {/*  <div className='mt-3 flex items-center gap-2 rounded-lg border border-teal-700 bg-teal-900/50 p-2'>*/}
      {/*    <div className='flex h-6 w-6 items-center justify-center rounded bg-teal-500'>*/}
      {/*      <ChevronRight className='h-3 w-3 text-white' />*/}
      {/*    </div>*/}
      {/*    <div className='text-xs'>*/}
      {/*      <div className='font-medium text-teal-300'>Vendor</div>*/}
      {/*      <div className='font-medium text-teal-300'>Connect</div>*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*</div>*/}
    </div>
  );
}
