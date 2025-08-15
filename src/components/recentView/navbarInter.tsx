import React from 'react';

interface Props {
  step: number;
  setStep: (value: number) => void;
}

const NavbarInter = ({ step, setStep }: Props) => {
  return (
    <nav className='my-3 flex w-full flex-row gap-4 py-3 text-sm'>
      <button className='cursor-pointer' onClick={() => setStep(0)}>
        <span className={`${step == 0 ? 'text-[#3C6EDD]' : ''}`}>General</span>
      </button>
      <button className='cursor-pointer' onClick={() => setStep(1)}>
        <span className={`${step == 1 ? 'text-[#3C6EDD]' : ''}`}>
          Assessments
        </span>
      </button>
      <button className='cursor-pointer' onClick={() => setStep(2)}>
        <span className={`${step == 2 ? 'text-[#3C6EDD]' : ''}`}>
          Documents
        </span>
      </button>
    </nav>
  );
};

export default NavbarInter;
