'use client';
import { useQuery } from '@tanstack/react-query';
import {
  getDocuementsAcceptedSupabase,
} from '@/actions/documentsActions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  MessageCircle,
  Lightbulb,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';
import AiChat from '@/components/aiChat';


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
  // Obtener documentos con React Query (igual que en Documents)
  const {
    data: documentsData,
    isLoading: loadingDocs,
    isError: errorDocs,
    refetch: refetchDocs,
  } = useQuery({
    queryKey: ['documents'],
    queryFn: async () => {
      const res = await getDocuementsAcceptedSupabase();
      if (res.success && Array.isArray(res.data)) {
        return res.data.map((doc) => ({
          id: doc.id,
          name: doc.name || doc.filename || 'Document',
          vendor: doc.vendor || '-',
          type: doc.cogsCategory || '-',
          amount: doc.total || '-',
          status: doc.status || 'Review',
          uploadDate: doc.created_at
            ? new Date(doc.created_at).toLocaleDateString()
            : '-',
          url: doc.url || '#',
          size: doc.size ? `${(doc.size / (1024 * 1024)).toFixed(1)} MB` : '-',
          confidenceScore: doc.confidenceScore
            ? `${(doc.confidenceScore * 100).toFixed(1)}%`
            : '-',
          lineItems: Array.isArray(doc.lineItems) ? doc.lineItems : [],
          rawData: doc?.rawData || {},
        }));
      } else {
        throw new Error(res.error || 'Error loading documents');
      }
    },
  });
  const documents = documentsData || [];


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
        <AiChat documents={documents} loadingDocs={loadingDocs} />

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
