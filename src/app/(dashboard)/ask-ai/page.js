'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  MessageCircle,
  Send,
  Lightbulb,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';

const suggestions = [
  'Why did this margin drop?',
  'Suggest alternatives',
  "What's the inventory status?",
  'Analyze sales trends',
];

const insights = [
  {
    type: 'warning',
    title: 'Low Inventory Alert',
    message:
      'Pistachios (Raw) inventory is running low. Consider reordering soon.',
    icon: AlertTriangle,
    color: 'text-yellow-600 bg-yellow-100',
  },
  {
    type: 'trend',
    title: 'Sales Trend',
    message:
      'Pistakio Classic sales increased 15% this week compared to last week.',
    icon: TrendingUp,
    color: 'text-green-600 bg-green-100',
  },
  {
    type: 'insight',
    title: 'Cost Optimization',
    message:
      'Switching to bulk packaging could reduce costs by 8% for high-volume SKUs.',
    icon: Lightbulb,
    color: 'text-blue-600 bg-blue-100',
  },
];

export default function AskAIPage() {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    {
      type: 'ai',
      message:
        "Hello, I'm your SKU Margin Assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    // Add user message
    setChatHistory((prev) => [
      ...prev,
      {
        type: 'user',
        message: message,
        timestamp: new Date(),
      },
    ]);

    // Simulate AI response
    setTimeout(() => {
      setChatHistory((prev) => [
        ...prev,
        {
          type: 'ai',
          message:
            "I understand you're asking about that. Let me analyze your data and provide insights based on your current inventory and sales patterns.",
          timestamp: new Date(),
        },
      ]);
    }, 1000);

    setMessage('');
  };

  const handleSuggestionClick = (suggestion) => {
    setMessage(suggestion);
  };

  return (
    <div className='space-y-6 p-6'>
      {/* Header */}
      <div className='flex items-center gap-3'>
        <div className='flex h-10 w-10 items-center justify-center rounded-full bg-blue-100'>
          <MessageCircle className='h-5 w-5 text-blue-600' />
        </div>
        <div>
          <h1 className='text-3xl font-semibold text-gray-900'>AI Assistant</h1>
          <p className='text-gray-600'>Get insights and recommendations</p>
        </div>
      </div>

      <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
        {/* Chat Interface */}
        <div className='lg:col-span-2'>
          <Card className='flex h-[600px] flex-col'>
            <CardHeader className='border-b'>
              <CardTitle className='text-lg'>Chat with AI Assistant</CardTitle>
            </CardHeader>
            <CardContent className='flex flex-1 flex-col p-0'>
              {/* Chat Messages */}
              <div className='flex-1 space-y-4 overflow-y-auto p-4'>
                {chatHistory.map((chat, index) => (
                  <div
                    key={index}
                    className={`flex ${chat.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        chat.type === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className='text-sm'>{chat.message}</p>
                      <p className='mt-1 text-xs opacity-70'>
                        {chat.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className='border-t p-4'>
                <div className='flex gap-2'>
                  <Input
                    placeholder='Ask a question about your margins...'
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className='flex-1'
                  />
                  <Button
                    onClick={handleSendMessage}
                    className='bg-blue-600 hover:bg-blue-700'
                  >
                    <Send className='h-4 w-4' />
                  </Button>
                </div>

                {/* Quick Suggestions */}
                <div className='mt-3 flex flex-wrap gap-2'>
                  {suggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant='outline'
                      size='sm'
                      onClick={() => handleSuggestionClick(suggestion)}
                      className='text-xs'
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Insights Panel */}
        <div className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle className='text-lg'>Quick Insights</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              {insights.map((insight, index) => (
                <div key={index} className='rounded-lg border p-3'>
                  <div className='flex items-start gap-3'>
                    <div className={`rounded-full p-2 ${insight.color}`}>
                      <insight.icon className='h-4 w-4' />
                    </div>
                    <div className='flex-1'>
                      <h4 className='mb-1 text-sm font-medium text-gray-900'>
                        {insight.title}
                      </h4>
                      <p className='text-xs text-gray-600'>{insight.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='text-lg'>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className='space-y-3'>
              <div className='text-sm'>
                <div className='mb-1 flex items-center gap-2'>
                  <div className='h-2 w-2 rounded-full bg-blue-500'></div>
                  <span className='font-medium'>Inventory Updated</span>
                </div>
                <p className='text-xs text-gray-600'>
                  Pistachios (Raw) - 2500 lbs
                </p>
                <p className='text-xs text-gray-400'>2 hours ago</p>
              </div>
              <div className='text-sm'>
                <div className='mb-1 flex items-center gap-2'>
                  <div className='h-2 w-2 rounded-full bg-green-500'></div>
                  <span className='font-medium'>Production Run Completed</span>
                </div>
                <p className='text-xs text-gray-600'>5000 units finished</p>
                <p className='text-xs text-gray-400'>4 hours ago</p>
              </div>
              <div className='text-sm'>
                <div className='mb-1 flex items-center gap-2'>
                  <div className='h-2 w-2 rounded-full bg-yellow-500'></div>
                  <span className='font-medium'>Low Stock Alert</span>
                </div>
                <p className='text-xs text-gray-600'>
                  Primary Packaging below threshold
                </p>
                <p className='text-xs text-gray-400'>6 hours ago</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
