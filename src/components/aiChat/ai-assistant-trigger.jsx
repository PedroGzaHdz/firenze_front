'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import AIAssistantModal from './ai-assistant-modal';

export default function AIAssistantTrigger() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        variant='outline'
        className='flex items-center gap-2'
      >
        <MessageCircle className='h-4 w-4' />
        Ask Agent
      </Button>

      <AIAssistantModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onMinimize={() => setIsModalOpen(false)}
      />
    </>
  );
}
