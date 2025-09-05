'use client';

import { useState, useEffect } from 'react';
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

const initialDocuments = [
  {
    id: 1,
    name: 'Invoice_INV-2024-001.pdf',
    vendor: 'ACME Foods',
    type: 'Invoice',
    amount: '$12,340.00',
    status: 'Review',
    uploadDate: '1/14/2024',
    size: '2.3 MB',
  },
  {
    id: 2,
    name: 'PO_456_Inventory.pdf',
    vendor: 'Supply Chain Co',
    type: 'PO',
    amount: '$50,000.00',
    status: 'Pending',
    uploadDate: '1/13/2024',
    size: '1.8 MB',
  },
  {
    id: 3,
    name: 'Contract_Distribution.pdf',
    vendor: 'Retail Giant',
    type: 'Contract',
    amount: '-',
    status: 'Approved',
    uploadDate: '1/12/2024',
    size: '5.2 MB',
  },
];

export default function DocumentsPage() {
  const [documents, setDocuments] = useState(initialDocuments);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedDocs, setSelectedDocs] = useState([]);
  const [notification, setNotification] = useState(null);

  // Simular notificación después de cargar
  useEffect(() => {
    const timer = setTimeout(() => {
      const pendingCount = documents.filter(
        (doc) => doc.status === 'Review' || doc.status === 'Pending',
      ).length;
      if (pendingCount > 0) {
        setNotification({
          type: 'warning',
          message: `${pendingCount} documents require your attention`,
        });
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [documents]);

  // Auto-hide notification after 5 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.vendor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'All Status' || doc.status === statusFilter;
    const matchesType = typeFilter === 'All Types' || doc.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const toggleSelectAll = () => {
    if (selectedDocs.length === filteredDocuments.length) {
      setSelectedDocs([]);
    } else {
      setSelectedDocs(filteredDocuments.map((doc) => doc.id));
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file, index) => {
      setTimeout(() => {
        const newDoc = {
          id: Date.now() + index,
          name: file.name,
          vendor: 'Auto-detected',
          type: file.name.toLowerCase().includes('invoice')
            ? 'Invoice'
            : file.name.toLowerCase().includes('po')
              ? 'PO'
              : 'Contract',
          amount: '-',
          status: 'Review',
          uploadDate: new Date().toLocaleDateString(),
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        };

        setDocuments((prev) => [newDoc, ...prev]);
        setNotification({
          type: 'success',
          message: `${file.name} uploaded successfully`,
        });
      }, index * 200);
    });
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

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    files.forEach((file, index) => {
      setTimeout(() => {
        const newDoc = {
          id: Date.now() + index,
          name: file.name,
          vendor: 'Auto-detected',
          type: file.name.toLowerCase().includes('invoice')
            ? 'Invoice'
            : file.name.toLowerCase().includes('po')
              ? 'PO'
              : 'Contract',
          amount: '-',
          status: 'Review',
          uploadDate: new Date().toLocaleDateString(),
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        };

        setDocuments((prev) => [newDoc, ...prev]);
        setNotification({
          type: 'success',
          message: `${file.name} uploaded successfully`,
        });
      }, index * 200);
    });
  };

  const handleDocumentAction = (action, doc) => {
    switch (action) {
      case 'approve':
        setDocuments((prev) =>
          prev.map((d) => (d.id === doc.id ? { ...d, status: 'Approved' } : d)),
        );
        setNotification({
          type: 'success',
          message: `${doc.name} approved successfully`,
        });
        break;
      case 'delete':
        setDocuments((prev) => prev.filter((d) => d.id !== doc.id));
        setNotification({
          type: 'info',
          message: `${doc.name} deleted`,
        });
        break;
      case 'download':
        setNotification({
          type: 'info',
          message: `Downloading ${doc.name}...`,
        });
        break;
      case 'view':
        setNotification({
          type: 'info',
          message: `Opening ${doc.name}...`,
        });
        break;
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
            onClick={() => document.getElementById('file-upload').click()}
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
              <Button className='bg-blue-600 hover:bg-blue-700'>
                Choose Files
              </Button>
              <input
                id='file-upload'
                type='file'
                multiple
                className='hidden'
                onChange={handleFileSelect}
                accept='.pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg'
              />
            </div>
            {isDragOver && (
              <div className='bg-opacity-50 absolute inset-0 rounded-lg bg-blue-50'></div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Status Cards */}
      <div className='grid grid-cols-3 gap-6'>
        <Card className='border-l-4 border-l-yellow-400'>
          <CardContent className='p-6'>
            <div className='text-center'>
              <div className='mb-1 text-3xl font-bold text-yellow-600'>2</div>
              <div className='text-sm text-gray-600'>Pending</div>
            </div>
          </CardContent>
        </Card>
        <Card className='border-l-4 border-l-red-400'>
          <CardContent className='p-6'>
            <div className='text-center'>
              <div className='mb-1 text-3xl font-bold text-red-600'>3</div>
              <div className='text-sm text-gray-600'>Review</div>
            </div>
          </CardContent>
        </Card>
        <Card className='border-l-4 border-l-green-400'>
          <CardContent className='p-6'>
            <div className='text-center'>
              <div className='mb-1 text-3xl font-bold text-green-600'>3</div>
              <div className='text-sm text-gray-600'>Approved</div>
            </div>
          </CardContent>
        </Card>
      </div>

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
            <SelectItem value='Review'>Review</SelectItem>
            <SelectItem value='Approved'>Approved</SelectItem>
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
                    <div className='flex items-center gap-3'>
                      <input
                        type='checkbox'
                        checked={
                          selectedDocs.length === filteredDocuments.length &&
                          filteredDocuments.length > 0
                        }
                        onChange={toggleSelectAll}
                        className='rounded border-gray-300'
                      />
                      Document Name
                    </div>
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
                        <input
                          type='checkbox'
                          checked={selectedDocs.includes(doc.id)}
                          onChange={() => toggleDocSelection(doc.id)}
                          className='rounded border-gray-300'
                        />
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
                        {doc.status}
                      </Badge>
                    </td>
                    <td className='p-4 text-gray-600'>{doc.uploadDate}</td>
                    <td className='p-4'>
                      <div className='flex gap-2'>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => handleDocumentAction('download', doc)}
                          className='hover:bg-gray-100'
                        >
                          <Download className='h-4 w-4' />
                        </Button>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => handleDocumentAction('view', doc)}
                          className='hover:bg-gray-100'
                        >
                          <Eye className='h-4 w-4' />
                        </Button>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => handleDocumentAction('edit', doc)}
                          className='hover:bg-gray-100'
                        >
                          <Edit className='h-4 w-4' />
                        </Button>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => handleDocumentAction('delete', doc)}
                          className='hover:bg-red-100 hover:text-red-600'
                        >
                          <Trash2 className='h-4 w-4' />
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
