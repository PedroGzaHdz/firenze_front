import React, { useState, useRef, useEffect } from 'react';
import {
  CubeIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  CloudArrowDownIcon,
  Square3Stack3DIcon,
  ArrowUturnUpIcon,
  UserIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  CameraIcon,
} from '@heroicons/react/24/outline';
import { EyeIcon } from 'lucide-react';
import { SiGmail, SiDropbox } from 'react-icons/si';
import Image from 'next/image';
import Logo from '../assets/logo.png';
import { useGlobalContext } from '@/context/globalContext';
import SidebarItem from '@/components/navbar/sidebarItem';
import { usePathname, useRouter } from 'next/navigation';
import RecentViewSideBar from '@/components/navbar/recentViewSideBar';
import { useAuth } from '@workos-inc/authkit-nextjs/components';
import { handleSignOut } from '@/actions/auth';

const Sidebar = ({ children }) => {
  const router = useRouter();
  const pathName = usePathname();
  const { flowStep, setFlowStep } = useGlobalContext();
  const [activeItem, setActiveItem] = useState(1);
  const [showInformationalView, setShowInformationalView] = useState(false);
  const [showInformationalNavbar, setShowInformationalNavbar] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const { user } = useAuth();
  const dropdownRef = useRef(null);

  const [invoices] = useState([
    {
      id: 1,
      provider: 'Provider A',
      amount: '$1,200.00',
      nameFile: 'Invoice_A.pdf',
    },
    {
      id: 2,
      provider: 'Provider B',
      amount: '$850.00',
      nameFile: 'Invoice_B.pdf',
    },
    {
      id: 3,
      provider: 'Provider C',
      amount: '$2,450.00',
      nameFile: 'Invoice_C.pdf',
    },
    {
      id: 4,
      provider: 'Provider D',
      amount: '$3,300.00',
      nameFile: 'Invoice_D.pdf',
    },
    {
      id: 5,
      provider: 'Provider E',
      amount: '$1,750.00',
      nameFile: 'Invoice_E.pdf',
    },
  ]);

  const handleItemClick = (index) => {
    setActiveItem(index);
    // Mostrar el panel informacional cuando se hace clic en el primer item (BookOpenIcon)
    if (index === 1) {
      setShowInformationalView(!showInformationalView);
      setShowInformationalNavbar(false);
    }

    if (index === 0) {
      setShowInformationalNavbar(!showInformationalNavbar);
      setShowInformationalView(false);
    }
  };

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Función para manejar logout (puedes conectar tu lógica aquí)
  const handleLogout = async () => {
    console.log('Logout clicked');
    setShowDropdown(false);
  };
  if (pathName === '/login' || pathName === '/signup') {
    return <>{children}</>;
  }
  return (
    <main className='flex h-screen flex-col bg-slate-950'>
      {/* Header superior que abarca todo el ancho */}
      <nav className='flex h-[10vh] w-full items-center justify-between border-b border-slate-700/50 bg-slate-900/50 px-6 py-2'>
        {/* Logo */}
        <div className='flex items-center gap-3 rounded-lg'>
          <Image src={Logo} alt='logo' width={29} height={29} />
        </div>

        {/* Barra de búsqueda alineada a la izquierda */}
        <div className='mx-10 w-full flex-1'>
          <div className='relative my-2'>
            <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
              <MagnifyingGlassIcon className='h-4 w-4 text-black' />
            </div>
            <input
              type='text'
              placeholder='Search SKUs, Contracts, Vendors'
              className='font-family-mondwest block w-1/3 rounded-full border border-slate-600/50 bg-[#D9D9D9] py-2.5 pr-3 pl-10 text-black placeholder-black transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none'
            />
          </div>
        </div>

        {/* Avatar y elementos del usuario */}
        <div className='flex items-center gap-2'>
          {/* Avatar con dropdown */}
          <div className='relative' ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className='group relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-sm transition-all duration-200 hover:from-blue-600 hover:to-purple-700 hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 overflow-hidden'
            >
              {user?.profilePictureUrl ? (
                <img
                  src={user.profilePictureUrl}
                  alt='Profile'
                  className='h-full w-full object-cover'
                />
              ) : (
                <UserIcon className='h-5 w-5 group-hover:scale-110 transition-transform duration-200' />
              )}
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className='absolute right-0 mt-2 w-56 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-50'>
                <div className='py-1'>
                  {/* Perfil Header */}
                  <div className='px-4 py-3 border-b border-gray-100'>
                    <div className='flex items-center gap-3'>
                      <div className='relative h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden'>
                        {user?.profilePictureUrl ? (
                          <img
                            src={user.profilePictureUrl}
                            alt='Profile'
                            className='h-full w-full object-cover'
                          />
                        ) : (
                          <UserIcon className='h-5 w-5 text-white' />
                        )}
                      </div>
                      <div>
                        <p className='text-sm font-medium text-gray-900'>{user?.firstName + ' ' + user?.lastName}</p>
                        <p className='text-xs text-gray-500'>{user?.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Cambiar foto de perfil */}
                  {/* <button
                    onClick={() => fileInputRef.current?.click()}
                    className='w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors'
                  >
                    <CameraIcon className='h-4 w-4' />
                    Cambiar foto de perfil
                  </button> */}

                  {/* Configuraciones */}
                  {/* <button
                    onClick={handleSettings}
                    className='w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors'
                  >
                    <Cog6ToothIcon className='h-4 w-4' />
                    Configuraciones
                  </button> */}

                  {/* Separador */}
                  {/* <div className='border-t border-gray-100 my-1'></div> */}

                  {/* Logout */}
                  <form action={handleSignOut}>

                    <button
                      type='submit'
                      className='w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors'
                    >
                      <ArrowRightOnRectangleIcon className='h-4 w-4' />
                      SignOut
                    </button>
                  </form>

                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Contenido principal */}
      <div className='flex flex-1'>
        {/* Sidebar lateral - solo 2 iconos */}
        <div className='flex flex-col border-r border-slate-700/50 bg-slate-900/50'>
          <div className='w-20 p-4'>
            <nav className='space-y-2'>
              <SidebarItem
                icon={<Square3Stack3DIcon className='h-5 w-5' />}
                active={activeItem === 0}
                onClick={() => {
                  handleItemClick(0);
                  router.push('/deep');
                }}
              />
              <SidebarItem
                href='/'
                icon={<CubeIcon className='h-5 w-5' />}
                active={activeItem === 1}
                onClick={() => {
                  handleItemClick(1);
                  router.push('/');
                }}
              />
              <SidebarItem
                icon={<ArrowUturnUpIcon className='h-5 w-5' />}
                active={activeItem === 2}
                onClick={() => handleItemClick(2)}
              />
              <SidebarItem
                icon={<CloudArrowDownIcon className='h-5 w-5' />}
                active={activeItem === 3}
                onClick={() => handleItemClick(3)}
              />
            </nav>
          </div>
        </div>

        {/* Panel informacional (condicional) */}
        {showInformationalView && (
          <div className='flex w-80 flex-col border-r border-slate-700/50 bg-slate-800/30'>
            <div className='flex items-center justify-between border-b border-slate-700/30 p-4'>
              <div>
                <h3 className='font-family-mondwest text-lg font-medium text-[#3C6EDD]'>
                  Informational View
                </h3>
                <p className='font-family-founders mt-1 text-base font-light text-white'>
                  {flowStep === 0 &&
                    'Needed documents will update with each prompt.'}
                  {flowStep === 1 && 'All documents for: SPF 30 Sunscreen'}
                  {flowStep === 2 && 'All documents for: SPF 30 Sunscreen'}
                </p>
              </div>
              <div className='flex h-full items-start'>
                <button
                  onClick={() => {
                    setFlowStep(3);
                  }}
                  className='rounded p-1 text-white transition-colors hover:bg-slate-700/50 hover:text-white'
                >
                  <PlusIcon className='h-4 w-4' />
                </button>
              </div>
            </div>

            {flowStep > 0 && (
              <>
                {/* Invoices by providers */}
                <div className='flex flex-row items-start justify-between p-4'>
                  <p className='font-family-mondwest text-lg font-medium text-[#3C6EDD]'>
                    Invoices by providers
                  </p>
                  <button
                    className='font-family-mondwest text-xs font-medium text-[#3C6EDD]'
                    onClick={() => setFlowStep(2)}
                  >
                    Add more
                  </button>
                </div>
                {invoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    className='font-family-editorial mx-2 flex cursor-pointer flex-row justify-between border-b border-slate-700/30 p-2 transition-all duration-200 hover:bg-slate-700/20'
                  >
                    <p className='text-sm font-light text-white'>
                      {invoice.nameFile}
                    </p>
                    <p className='text-sm font-light text-white'>
                      {invoice.provider}
                    </p>
                    <button className='mt-1 text-sm font-light text-[#2A59FF]'>
                      <EyeIcon className='h-4 w-4' />
                    </button>
                  </div>
                ))}
                <div className='flex flex-row items-start justify-between p-4'>
                  <p className='text-sm font-medium text-[#3C6EDD]'>
                    MSA with providers
                  </p>
                  <button className='text-sm font-medium text-[#3C6EDD]'>
                    Add more
                  </button>
                </div>
                {invoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    className='font-family-editorial mx-2 flex cursor-pointer flex-row justify-between border-b border-slate-700/30 p-2 transition-all duration-200 hover:bg-slate-700/20'
                  >
                    <p className='text-sm font-light text-white'>
                      {invoice.nameFile}
                    </p>
                    <p className='text-sm font-light text-white'>
                      {invoice.provider}
                    </p>
                    <button className='mt-1 text-sm font-light text-[#2A59FF]'>
                      <EyeIcon className='h-4 w-4' />
                    </button>
                  </div>
                ))}
                <div className='flex flex-row items-start justify-between p-4'>
                  <p className='text-sm font-medium text-[#3C6EDD]'>
                    Linked Accounts
                  </p>
                  <button className='text-sm font-medium text-[#3C6EDD]'>
                    Add more
                  </button>
                </div>
                <div className='mx-2 flex cursor-pointer flex-row justify-between border-b border-slate-700/30 p-2 transition-all duration-200 hover:bg-slate-700/20'>
                  <div className='flex flex-row items-center'>
                    <span className='text-sm font-light text-white'>
                      <SiGmail className='mr-2 inline h-4 w-4' />
                    </span>
                    <p className='font-family-editorial text-sm font-light text-white'>
                      Gmail
                    </p>
                  </div>
                  <p className='font-family-editorial text-sm font-light text-white'>
                    g@vendorconnect.ai
                  </p>
                </div>
                <div className='mx-2 flex cursor-pointer flex-row justify-between border-b border-slate-700/30 p-2 transition-all duration-200 hover:bg-slate-700/20'>
                  <div className='flex flex-row items-center'>
                    <span className='text-sm font-light text-white'>
                      <SiDropbox className='mr-2 inline h-4 w-4' />
                    </span>
                    <p className='font-family-editorial text-sm font-light text-white'>
                      Dropbox
                    </p>
                  </div>

                  <p className='font-family-editorial text-sm font-light text-white'>
                    g@vendorconnect.ai
                  </p>
                </div>
              </>
            )}
          </div>
        )}

        {showInformationalNavbar ? <RecentViewSideBar /> : null}

        {/* Área principal para chat */}
        <div className='flex h-[90vh] flex-1 flex-col bg-slate-100'>
          {children}
        </div>
      </div>
    </main>
  );
};

export default Sidebar;
