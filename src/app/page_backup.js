'use client';
import React from 'react';
import SugerationChatCard from '@/components/sugerationChatCard';
import ChatComponent from '@/components/chatComponent';
import { ChevronDown } from 'lucide-react';
import DocumentTermsCard from '@/components/documentsTermsCard';
import UploadDocumentsModal from '@/components/uploadDocumentsModal';
import { useGlobalContext } from '@/context/globalContext';
import { useAuth } from '@workos-inc/authkit-nextjs/components';
import { getVendors } from '@/actions/getVendors';


export default function HomePage() {
  const { flowStep, setFlowStep } = useGlobalContext();
  const [openModal, setOpenModal] = React.useState(false);
  const { user } = useAuth({ ensureSignedIn: true });
  const [vendors, setVendors] = React.useState([]);

  React.useEffect(() => {
    async function fetchVendors() {
      const vendorsData = await getVendors();
      setVendors(vendorsData);
    }
    fetchVendors().then();
  }, []);

  function handleClose() {
    setFlowStep(3);
    setOpenModal(false);
  }
  React.useEffect(() => {
    if (flowStep === 2) {
      setOpenModal(true);
    }
  }, [flowStep]);


  return (
    <div className='h-[90vh]'>
      {/* Área de mensajes del chat */}
      <main className='flex h-[100%] flex-1 flex-col justify-between overflow-auto'>
        <section className='h-[78%] w-full overflow-auto px-20 py-8'>
          {/* Mensaje de bienvenida */}
          <article className='mb-8 text-center'>
            <h1 className='font-mondwest mb-4 bg-gradient-to-r bg-clip-text text-left text-5xl font-bold text-blue-600'>
              {
                `Hey ${user?.firstName}!`
              }
            </h1>
            <p className='font-mondwest mb-8 text-left text-3xl font-bold text-blue-600'>
              What can we discover for you today?
            </p>

            {/* Sugerencias de chat */}
            {flowStep === 0 && (
              <>
                <div className='mt-16 mb-8 flex w-full flex-row gap-4'>
                  <SugerationChatCard
                    onClick={() => setFlowStep(1)}
                    body='Create a new peoduct line and add the needed vendor lists...'
                    footerText='3 additional documents required'
                  />
                  <SugerationChatCard
                    onClick={() => setFlowStep(1)}
                    body='Create a forecast outlining out cash conversion  rate for the next 3 months...'
                    footerText='All documents available'
                  />
                  <SugerationChatCard
                    onClick={() => setFlowStep(1)}
                    body='What vendors should we prepay in order to boost margins on X product?...'
                    footerText='1 previus selection required'
                  />
                </div>
                {/* Load more button */}
                <div className='flex items-center justify-between text-left'>
                  <button className='font-family-mondwest ml-2 flex items-center gap-2 font-medium text-blue-500 transition-colors duration-200 hover:text-blue-600'>
                    Load 4 more options
                  </button>
                </div>
              </>
            )}
            {flowStep > 0 && (
              <>
                <div className='mt-8'>
                  <div className='w-2/5 rounded-xl border border-gray-100 bg-white p-4 shadow-sm'>
                    <div className='flex items-center justify-between gap-4'>
                      <p className='font-family-founders flex-1 text-left text-sm leading-relaxed text-gray-600'>
                        What vendors should we prepay in order to boost margins
                        on X product?
                      </p>

                      <div className='relative flex-shrink-0'>
                        <button className='flex w-full items-center justify-between rounded-lg bg-white px-3 py-2.5 transition-colors hover:border-gray-300 focus:ring-1 focus:ring-blue-500 focus:outline-none'>
                          <span className='font-family-mondwest text-sm font-medium text-blue-500'>
                            SPF 30 Sunscreen
                          </span>
                          <ChevronDown
                            className={`h-4 w-4 text-blue-500 transition-transform`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                {flowStep >= 3 && <DocumentTermsCard />}
              </>
            )}
          </article>
          {/* Área de mensajes del chat (vacía por ahora) */}
          <article className='mb-2 space-y-4'>
            {/* Aquí irán los mensajes del chat */}
          </article>
        </section>
        {/* ChatComponent centrado y abajo */}
        <section className='flex h-[20%] w-full items-end justify-center px-20 py-0'>
          <div className='h-full w-full'>
            <ChatComponent />
          </div>
        </section>
      </main>
      <UploadDocumentsModal isOpen={openModal} onClose={handleClose} />
    </div>
  );
}
