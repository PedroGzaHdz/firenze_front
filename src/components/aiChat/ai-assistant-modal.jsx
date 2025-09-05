'use client';

import { useState } from 'react';
import { X, Send, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function AIAssistantModal({ isOpen, onClose, onMinimize }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      type: 'assistant',
      content:
        "Hello, I'm your SKU Margin Assistant. How can I help you today?",
      isWelcome: true,
    },
  ]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    setMessages((prev) => [...prev, { type: 'user', content: message }]);
    setMessage('');

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          type: 'assistant',
          content:
            'Based on your current inventory and sales data, I can help you optimize margins by analyzing vendor contracts and suggesting cost-saving opportunities.',
        },
      ]);
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className='fixed inset-0 z-40 bg-black/20 backdrop-blur-sm'
        onClick={onClose}
      />

      <div
        className={`fixed top-0 right-0 z-50 h-full w-96 transform border-l border-gray-200 bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } flex flex-col`}
      >
        {/* Header */}
        <div className='flex items-center justify-between bg-[#1a1f36] p-4 text-white'>
          <div className='flex items-center gap-3'>
            <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-[#4f7cff]'>
              <Bot className='h-5 w-5 text-white' />
            </div>
            <div>
              <h3 className='font-semibold text-white'>AI Assistant</h3>
              <p className='text-xs text-slate-400'>
                Get insights and recommendations
              </p>
            </div>
          </div>
          <Button
            variant='ghost'
            size='sm'
            onClick={onClose}
            className='h-8 w-8 p-0 text-white hover:bg-slate-700'
          >
            <X className='h-4 w-4' />
          </Button>
        </div>

        {/* Messages */}
        <div className='flex-1 space-y-4 overflow-y-auto bg-gray-50 p-4'>
          {messages.map((msg, index) => (
            <div key={index}>
              {msg.type === 'assistant' && (
                <div className='flex gap-3'>
                  <div className='flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#4f7cff]'>
                    <Bot className='h-4 w-4 text-white' />
                  </div>
                  <div className='max-w-[280px] rounded-lg border border-gray-100 bg-white p-3 shadow-sm'>
                    <p className='text-sm text-gray-800'>{msg.content}</p>
                  </div>
                </div>
              )}

              {msg.type === 'user' && (
                <div className='flex justify-end'>
                  <div className='max-w-[280px] rounded-lg bg-[#4f7cff] p-3 text-white'>
                    <p className='text-sm'>{msg.content}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Input */}
        <div className='border-t border-gray-200 bg-white p-4'>
          <div className='flex gap-2'>
            <Input
              placeholder='Ask a question about your margins...'
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className='flex-1 text-sm'
            />
            <Button
              onClick={handleSendMessage}
              size='sm'
              className='bg-[#4f7cff] hover:bg-[#3d63cc]'
            >
              <Send className='h-4 w-4' />
            </Button>
          </div>
          <p className='mt-2 text-xs text-gray-500'>
            Try: "Why did this margin drop?" or "Suggest alternatives"
          </p>
        </div>
      </div>
    </>
  );
}
