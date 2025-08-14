import React from 'react';

interface InventoryRotationCardProps {
  rotation: string;
}

export const InventoryRotationCard: React.FC<InventoryRotationCardProps> = ({
  rotation,
}) => {
  return (
    <article className='flex h-full flex-col items-center rounded-lg bg-white p-4 shadow-sm'>
      <h2 className='font-family-mondwest mb-6 w-full text-sm text-[#232323]'>
        Inventory Rotation
      </h2>
      <div className='mt-3 text-3xl font-light text-[#3C6EDD]'>{rotation}</div>
    </article>
  );
};
