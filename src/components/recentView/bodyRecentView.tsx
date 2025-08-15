'use client';
import React from 'react';
import NavbarInter from '@/components/recentView/navbarInter';
import GeneralTab from '@/components/recentView/generalTab';
import AssessmentsTab from '@/components/recentView/assessmentsTab';

export const BodyRecentView: React.FC = () => {
  const [step, setStep] = React.useState<number>(0);

  const onView = React.useCallback(() => {
    switch (step) {
      case 1:
        return <AssessmentsTab />;
      case 0:
      default:
        return <GeneralTab />;
    }
  }, [step]);

  return (
    <main className='w-full bg-[#F4F4F4] p-6'>
      <NavbarInter step={step} setStep={setStep} />
      {onView()}
    </main>
  );
};

export default BodyRecentView;
