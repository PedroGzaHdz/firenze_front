'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  getDocumentsSupabase,
  logicDeleteDocumentSupabase,
  updateStatusDocumentSupabase,
} from '@/actions/documentsActions';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Download,
  Edit,
  FileText,
  Mail,
  Search,
  Trash2,
  Upload,
  CheckCircle,
  AlertCircle,
  Eye,
} from 'lucide-react';
import AIAssistantTrigger from '@/components/aiChat/ai-assistant-trigger';

export default function DocumentsPage() {
  // React Query para documentos
  const {
    data: documentsData,
    isLoading: loadingDocs,
    isError: errorDocs,
    refetch: refetchDocs,
  } = useQuery({
    queryKey: ['documents'],
    queryFn: async () => {
      const res = await getDocumentsSupabase();
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
        }));
      } else {
        throw new Error(res.error || 'Error loading documents');
      }
    },
  });
  const documents = documentsData || [];
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedDocs, setSelectedDocs] = useState([]);
  const [notification, setNotification] = useState(null);
  const [deletingDocId, setDeletingDocId] = useState(null);

  // Eliminado: useEffect de consulta inicial, migrará a React Query

  // Totales dinámicos para status cards (status en minúsculas)
  const pendingDocs = useMemo(
    () =>
      documents.filter((doc) => (doc.status || '').toLowerCase() === 'pending')
        .length,
    [documents],
  );
  const rejectDocs = useMemo(
    () =>
      documents.filter((doc) => (doc.status || '').toLowerCase() === 'rejected')
        .length,
    [documents],
  );
  const approvedDocs = useMemo(
    () =>
      documents.filter((doc) => (doc.status || '').toLowerCase() === 'accepted')
        .length,
    [documents],
  );

  // Auto-hide notification after 5 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      (doc.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doc.vendor || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'All Status' ||
      (doc.status || '').toLowerCase() === statusFilter.toLowerCase();
    const docType = doc.cogsCategory || doc.type || '';
    const matchesType = typeFilter === 'All Types' || docType === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const toggleSelectAll = () => {
    if (selectedDocs.length === filteredDocuments.length) {
      setSelectedDocs([]);
    } else {
      setSelectedDocs(filteredDocuments.map((doc) => doc.id));
    }
  };

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    setUploading(true);
    for (let index = 0; index < files.length; index++) {
      const file = files[index];
      const formData = new FormData();
      formData.append('file', file);
      try {
        const res = await fetch('/api/upload-document', {
          method: 'POST',
          body: formData,
        });
        if (!res.ok) throw new Error('Upload failed');
        setNotification({
          type: 'success',
          message: `${file.name} uploaded successfully`,
        });
        // Refrescar documentos después de subir
        const docsRes = await getDocumentsSupabase();
        if (docsRes.success) {
          refetchDocs();
        }
      } catch (err) {
        setNotification({
          type: 'warning',
          message: `Error uploading ${file.name}: ${err.message || err}`,
        });
      }
    }
    setUploading(false);
    e.target.value = null; // Reset file input
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    setUploading(true);
    for (let index = 0; index < files.length; index++) {
      const file = files[index];
      const formData = new FormData();
      formData.append('file', file);
      try {
        const res = await fetch('/api/upload-document', {
          method: 'POST',
          body: formData,
        });
        if (!res.ok) throw new Error('Upload failed');
        setNotification({
          type: 'success',
          message: `${file.name} uploaded successfully`,
        });
        // Refrescar documentos después de subir
        const docsRes = await getDocumentsSupabase();
        if (docsRes.success) {
          await refetchDocs();
        }
      } catch (err) {
        setNotification({
          type: 'warning',
          message: `Error uploading ${file.name}: ${err.message || err}`,
        });
      }
    }
    setUploading(false);
  };

  const handleDeleteDocument = async (docID) => {
    setDeletingDocId(docID);
    try {
      const responseDelete = await logicDeleteDocumentSupabase(docID);
      if (responseDelete.success) {
        setNotification({
          type: 'success',
          message: 'Document deleted successfully',
        });
        await refetchDocs();
      } else {
        throw new Error(responseDelete.error || 'Error deleting document');
      }
    } catch (err) {
      setNotification({
        type: 'warning',
        message: `Error deleting document: ${err.message || err}`,
      });
    }
    setDeletingDocId(null);
  };

  const handleStatusChange = async (doc, newStatus) => {
    const prevStatus = doc.status;
    setNotification({ type: 'info', message: 'Updating status...' });
    try {
      const res = await updateStatusDocumentSupabase(doc.id, newStatus);
      if (res.success) {
        setNotification({ type: 'success', message: 'Status updated!' });
        await refetchDocs();
      } else {
        throw new Error(res.error || 'Error updating status');
      }
    } catch (err) {
      setNotification({
        type: 'warning',
        message: `Error updating status: ${err.message || err}`,
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Review':
        return 'bg-red-100 text-red-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Invoice':
        return 'bg-blue-100 text-blue-800';
      case 'PO':
        return 'bg-purple-100 text-purple-800';
      case 'Contract':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className='space-y-6 p-6'>
      {/* Banner superior menos invasivo para pendientes */}
      {/* Mostrar banner solo cuando los datos estén listos y hay documentos */}
      {!loadingDocs && documents.length > 0 && pendingDocs > 0 && (
        <div className='mb-4 flex w-full items-center gap-2 rounded border border-yellow-200 bg-yellow-50 px-4 py-2 text-yellow-800'>
          <AlertCircle className='h-5 w-5 text-yellow-500' />
          <span className='text-sm font-medium'>
            {pendingDocs} documents require your attention
          </span>
        </div>
      )}
      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 max-w-sm rounded-lg p-4 shadow-lg transition-all duration-300 ${
            notification.type === 'success'
              ? 'border border-green-200 bg-green-50'
              : notification.type === 'warning'
                ? 'border border-yellow-200 bg-yellow-50'
                : 'border border-blue-200 bg-blue-50'
          }`}
        >
          <div className='flex items-center gap-2'>
            {notification.type === 'success' && (
              <CheckCircle className='h-5 w-5 text-green-500' />
            )}
            {notification.type === 'warning' && (
              <AlertCircle className='h-5 w-5 text-yellow-500' />
            )}
            {notification.type === 'info' && (
              <FileText className='h-5 w-5 text-blue-500' />
            )}
            <span
              className={`text-sm font-medium ${
                notification.type === 'success'
                  ? 'text-green-800'
                  : notification.type === 'warning'
                    ? 'text-yellow-800'
                    : 'text-blue-800'
              }`}
            >
              {notification.message}
            </span>
            <button
              onClick={() => setNotification(null)}
              className='text-gray-400 hover:text-gray-600'
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-semibold text-gray-900'>Documents</h1>
          <p className='mt-1 text-sm text-gray-500'>
            {filteredDocuments.length} of {documents.length} documents
            {selectedDocs.length > 0 && ` • ${selectedDocs.length} selected`}
          </p>
        </div>
        <div className='flex items-center gap-3'>
          {selectedDocs.length > 0 && (
            <Button variant='outline' size='sm'>
              Bulk Actions ({selectedDocs.length})
            </Button>
          )}
          <AIAssistantTrigger />
        </div>
      </div>

      {/* Email Forwarding Card */}
      <Card className='border-blue-200 bg-blue-50'>
        <CardContent className='p-4'>
          <div className='flex items-center gap-3'>
            <Mail className='h-5 w-5 text-blue-600' />
            <div>
              <h3 className='font-medium text-blue-900'>Email Forwarding</h3>
              <p className='text-sm text-blue-700'>
                Forward invoices, POs, or contracts to:
              </p>
              <p className='mt-1 font-mono text-sm text-blue-800'>
                invoices@brand.vendorconnect.ai
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upload Section */}
      <Card>
        <CardContent className='p-0'>
          <div
            className={`relative border-2 border-dashed p-8 transition-all duration-200 ${
              isDragOver
                ? 'border-blue-400 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() =>
              !uploading && document.getElementById('file-upload').click()
            }
          >
            <div className='cursor-pointer text-center'>
              <div
                className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full transition-colors ${
                  isDragOver ? 'bg-blue-200' : 'bg-blue-100'
                }`}
              >
                <Upload
                  className={`h-8 w-8 transition-colors ${
                    isDragOver ? 'text-blue-700' : 'text-blue-600'
                  }`}
                />
              </div>
              <h3 className='mb-2 text-lg font-medium text-gray-900'>
                {isDragOver ? 'Drop files here' : 'Upload Documents'}
              </h3>
              <p className='mb-4 text-gray-500'>
                {isDragOver
                  ? 'Release to upload files'
                  : 'Drag & drop files here or click to browse'}
              </p>
              <Button
                className='bg-blue-600 hover:bg-blue-700'
                disabled={uploading}
              >
                {uploading ? 'Uploading...' : 'Choose Files'}
              </Button>
              <input
                id='file-upload'
                type='file'
                multiple
                className='hidden'
                onChange={handleFileSelect}
                accept='.pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg'
                disabled={uploading}
              />
              {uploading && (
                <div className='bg-opacity-70 absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-white'>
                  <svg
                    className='h-8 w-8 animate-spin text-blue-600'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                  >
                    <circle
                      className='opacity-25'
                      cx='12'
                      cy='12'
                      r='10'
                      stroke='currentColor'
                      strokeWidth='4'
                    ></circle>
                    <path
                      className='opacity-75'
                      fill='currentColor'
                      d='M4 12a8 8 0 018-8v8z'
                    ></path>
                  </svg>
                  <span className='ml-3 font-medium text-blue-700'>
                    Uploading and processing...
                  </span>
                </div>
              )}
            </div>
            {isDragOver && (
              <div className='bg-opacity-50 absolute inset-0 rounded-lg bg-blue-50'></div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Status Cards dinámicos solo cuando los datos estén listos */}
      {!loadingDocs && (
        <div className='grid grid-cols-3 gap-6'>
          <Card className='border-l-4 border-l-yellow-400'>
            <CardContent className='p-6'>
              <div className='text-center'>
                <div className='mb-1 text-3xl font-bold text-yellow-600'>
                  {pendingDocs || 0}
                </div>
                <div className='text-sm text-gray-600'>Pending</div>
              </div>
            </CardContent>
          </Card>
          <Card className='border-l-4 border-l-red-400'>
            <CardContent className='p-6'>
              <div className='text-center'>
                <div className='mb-1 text-3xl font-bold text-red-600'>
                  {rejectDocs || 0}
                </div>
                <div className='text-sm text-gray-600'>Rejected</div>
              </div>
            </CardContent>
          </Card>
          <Card className='border-l-4 border-l-green-400'>
            <CardContent className='p-6'>
              <div className='text-center'>
                <div className='mb-1 text-3xl font-bold text-green-600'>
                  {approvedDocs || 0}
                </div>
                <div className='text-sm text-gray-600'>Accepted</div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <div className='flex items-center gap-4'>
        <div className='relative flex-1'>
          <Search className='absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400' />
          <Input
            placeholder='Search by document name or vendor...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='pl-10'
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className='w-40'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent className='bg-white'>
            <SelectItem value='All Types'>All Types</SelectItem>
            <SelectItem value='Invoice'>Invoice</SelectItem>
            <SelectItem value='PO'>PO</SelectItem>
            <SelectItem value='Contract'>Contract</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className='w-40'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent className='bg-white'>
            <SelectItem value='All Status'>All Status</SelectItem>
            <SelectItem value='Pending'>Pending</SelectItem>
            <SelectItem value='rejected'>Rejected</SelectItem>
            <SelectItem value='accepted'>Accepted</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Documents Table */}
      <Card>
        <CardContent className='p-0'>
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead className='border-b bg-gray-50'>
                <tr>
                  <th className='p-4 text-left font-medium text-gray-900'>
                    <div className='flex items-center gap-3'>Document Name</div>
                  </th>
                  <th className='p-4 text-left font-medium text-gray-900'>
                    Vendor
                  </th>
                  <th className='p-4 text-left font-medium text-gray-900'>
                    Type
                  </th>
                  <th className='p-4 text-left font-medium text-gray-900'>
                    Amount
                  </th>
                  <th className='p-4 text-left font-medium text-gray-900'>
                    Status
                  </th>
                  <th className='p-4 text-left font-medium text-gray-900'>
                    Upload Date
                  </th>
                  <th className='p-4 text-left font-medium text-gray-900'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredDocuments.map((doc) => (
                  <tr
                    key={doc.id}
                    className='border-b transition-colors hover:bg-gray-50'
                  >
                    <td className='p-4'>
                      <div className='flex items-center gap-3'>
                        <FileText className='h-4 w-4 text-gray-400' />
                        <span className='font-medium text-gray-900'>
                          {doc.name}
                        </span>
                      </div>
                    </td>
                    <td className='p-4 text-gray-600'>{doc.vendor}</td>
                    <td className='p-4'>
                      <Badge className={getTypeColor(doc.type)}>
                        {doc.type}
                      </Badge>
                    </td>
                    <td className='p-4 font-medium text-gray-900'>
                      {doc.amount}
                    </td>
                    <td className='p-4'>
                      <Badge className={getStatusColor(doc.status)}>
                        <Select
                          value={(doc.status || '').toLowerCase()}
                          onValueChange={(value) =>
                            handleStatusChange(doc, value)
                          }
                          disabled={deletingDocId === doc.id || uploading}
                        >
                          <SelectTrigger className='h-7 w-28 text-xs'>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className='bg-white'>
                            <SelectItem value='pending'>Pending</SelectItem>
                            <SelectItem value='accepted'>Accepted</SelectItem>
                            <SelectItem value='rejected'>Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                      </Badge>
                    </td>
                    <td className='p-4 text-gray-600'>{doc.uploadDate}</td>
                    <td className='p-4'>
                      <div className='flex gap-2'>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={async () => {
                            try {
                              const response = await fetch(doc.url);
                              const blob = await response.blob();
                              const url = window.URL.createObjectURL(blob);

                              const link = document.createElement('a');
                              link.href = url;
                              link.download = doc.name || 'document.pdf';
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);

                              window.URL.revokeObjectURL(url); // liberar memoria
                            } catch (error) {
                              // Error al descargar el archivo
                            }
                          }}
                          className='hover:bg-gray-100'
                        >
                          <Download className='h-4 w-4' />
                        </Button>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => {
                            window.open(doc.url, '_blank');
                          }}
                          className='hover:bg-gray-100'
                        >
                          <Eye className='h-4 w-4' />
                        </Button>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => handleDeleteDocument(doc.id)}
                          className={`hover:bg-red-100 hover:text-red-600 ${deletingDocId === doc.id ? 'pointer-events-none opacity-50' : ''}`}
                          disabled={deletingDocId === doc.id}
                        >
                          {deletingDocId === doc.id ? (
                            <svg
                              className='h-4 w-4 animate-spin text-red-600'
                              xmlns='http://www.w3.org/2000/svg'
                              fill='none'
                              viewBox='0 0 24 24'
                            >
                              <circle
                                className='opacity-25'
                                cx='12'
                                cy='12'
                                r='10'
                                stroke='currentColor'
                                strokeWidth='4'
                              ></circle>
                              <path
                                className='opacity-75'
                                fill='currentColor'
                                d='M4 12a8 8 0 018-8v8z'
                              ></path>
                            </svg>
                          ) : (
                            <Trash2 className='h-4 w-4' />
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
