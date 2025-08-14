import { ChevronLeft, MonitorCheck } from 'lucide-react';

function HeaderWholefoodsComponent() {
  return (
    <main className='flex w-full flex-row gap-5 rounded-lg bg-[#F4F4F4] px-5 py-3'>
      <section>
        <button className='flex h-[40px] w-[40px] items-center justify-center rounded-lg bg-[#d9d9d9] transition-colors hover:bg-[#c0c0c0]'>
          <ChevronLeft />
        </button>
      </section>
      <section className='w-full'>
        <h1 className='font-family-mondwest text-xl font-bold text-[#3C6EDD]'>
          Wholefoods
        </h1>
        <article className='grid w-full grid-cols-4 gap-3.5'>
          <div className='flex flex-col gap-2 border-l border-l-black px-3 py-2'>
            <h3 className='font-family-mondwest text-sm'> Description </h3>
            <p className='font-family-mondwest text-xs'>
              It is a long established fact that a reader will be distracted by
              the readable content of a page when looking at its layout. The
              point of using Lorem Ipsum is that it has a more-or-less normal
              distribution.
            </p>
          </div>
          <div className='flex flex-col gap-2 border-l border-l-black px-3 py-2'>
            <h3 className='font-family-mondwest text-sm'> Contract Terms </h3>
            <div className='mt-1 flex flex-row justify-between gap-2'>
              <div className='flex flex-col gap-1'>
                <p className='font-family-mondwest text-xs'>
                  Volumne: <span className='text-[#3C6EDD]'>4SKUS</span>
                </p>
                <p className='font-family-mondwest text-xs'>
                  Payment Terms: <span className='text-[#3C6EDD]'>30 Days</span>
                </p>
                <p className='font-family-mondwest text-xs'>
                  Payment Form: <span className='text-[#3C6EDD]'>ECH</span>
                </p>
              </div>
              <div className='flex flex-col gap-1'>
                <p className='font-family-mondwest text-xs'>
                  LTV: <span className='text-[#3C6EDD]'>$8,700,146</span>
                </p>
                <p className='font-family-mondwest text-xs'>
                  MOQ: <span className='text-[#3C6EDD]'>150</span>
                </p>
                <p className='font-family-mondwest text-xs'>
                  MSA: <span>View MSA</span>
                </p>
              </div>
            </div>
          </div>
          <div className='flex flex-col gap-2 border-l border-l-black px-3 py-2'>
            <h3 className='font-family-mondwest text-sm'> Financials </h3>
            <div className='mt-1 flex flex-row justify-between gap-2'>
              <div className='flex flex-col gap-1'>
                <p className='font-family-mondwest text-xs'>
                  LOC: <span className='text-[#3C6EDD]'>$3,000,000</span>
                </p>
                <p className='font-family-mondwest text-xs'>
                  Credits: $<span className='text-[#3C6EDD]'>220,112</span>
                </p>
                <p className='font-family-mondwest text-xs'>
                  LTV: <span className='text-[#3C6EDD]'>$8,700,146</span>
                </p>
              </div>
              <div className='flex flex-col gap-1'>
                <p className='font-family-mondwest text-xs'>
                  Recivables: <span className='text-[#3C6EDD]'>$1,901,412</span>
                </p>
                <p className='font-family-mondwest text-xs'>
                  On Order: <span className='text-[#3C6EDD]'>$901,412</span>
                </p>
              </div>
            </div>
          </div>
          <div className='flex flex-col justify-center gap-2 border-l border-l-black px-3 py-2'>
            <div className='flex w-full items-center gap-2'>
              <div className='flex h-6 w-6 items-center justify-center rounded-lg bg-[#00AA5B]'>
                <MonitorCheck className='h-4 w-4 text-white' />
              </div>
              <p className='font-family-mondwest text-sm'>Trusted Retailer</p>
            </div>
          </div>
        </article>
      </section>
    </main>
  );
}

export default HeaderWholefoodsComponent;
