'use client';
import React from 'react';
import { ChevronDown, Filter, Plus, ArrowUpDown, X } from 'lucide-react';
import { CategoryBadge } from './categoryBadge';
import { Button } from '@/components/ui/button';
import { getVendors } from '@/actions/getVendors.js';
import { useRouter } from 'next/navigation';

export const VendorsTable = () => {
  const router = useRouter();

  const [vendors, setVendors] = React.useState([]);
  const [originalVendors, setOriginalVendors] = React.useState([]);

  // Sort state
  const [sortField, setSortField] = React.useState(null);
  const [sortOrder, setSortOrder] = React.useState('asc'); // 'asc' or 'desc'
  const [showSortMenu, setShowSortMenu] = React.useState(false);

  // Filter state
  const [filterField, setFilterField] = React.useState(null);
  const [filterValue, setFilterValue] = React.useState('');
  const [showFilterMenu, setShowFilterMenu] = React.useState(false);

  function onSelectVendor(vendor) {
    setSelectedVendor(vendor);
  }

  React.useEffect(() => {
    getVendors()
      .then((response) => {
        console.log(response);
        setVendors(response);
        setOriginalVendors(response);
      })
      .catch((error) => {
        console.error('Error fetching vendors:', error);
      });
  }, []);

  // Close menus when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (showSortMenu || showFilterMenu) {
        const target = event.target;
        const isInsideMenu = target.closest('.relative');
        if (!isInsideMenu) {
          setShowSortMenu(false);
          setShowFilterMenu(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSortMenu, showFilterMenu]);

  // Sort function
  const handleSort = (field) => {
    const newOrder =
      sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(newOrder);

    const sorted = [...vendors].sort((a, b) => {
      let aValue = a[field];
      let bValue = b[field];

      // Handle null/undefined values
      if (!aValue) return 1;
      if (!bValue) return -1;

      // Convert to lowercase for string comparison
      if (typeof aValue === 'string') aValue = aValue.toLowerCase();
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();

      if (aValue < bValue) return newOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return newOrder === 'asc' ? 1 : -1;
      return 0;
    });

    setVendors(sorted);
    setShowSortMenu(false);
  };

  // Filter function
  const handleFilter = (field, value) => {
    setFilterField(field);
    setFilterValue(value);

    if (!value) {
      // If no filter value, show all vendors (respecting current sort)
      const filtered = [...originalVendors];
      if (sortField) {
        filtered.sort((a, b) => {
          let aValue = a[sortField];
          let bValue = b[sortField];
          if (!aValue) return 1;
          if (!bValue) return -1;
          if (typeof aValue === 'string') aValue = aValue.toLowerCase();
          if (typeof bValue === 'string') bValue = bValue.toLowerCase();
          if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
          if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
          return 0;
        });
      }
      setVendors(filtered);
      return;
    }

    const filtered = originalVendors.filter((vendor) => {
      const fieldValue = vendor[field];
      if (!fieldValue) return false;

      if (typeof fieldValue === 'string') {
        return fieldValue.toLowerCase().includes(value.toLowerCase());
      }

      return String(fieldValue).toLowerCase().includes(value.toLowerCase());
    });

    // Apply current sort to filtered results
    if (sortField) {
      filtered.sort((a, b) => {
        let aValue = a[sortField];
        let bValue = b[sortField];
        if (!aValue) return 1;
        if (!bValue) return -1;
        if (typeof aValue === 'string') aValue = aValue.toLowerCase();
        if (typeof bValue === 'string') bValue = bValue.toLowerCase();
        if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }

    setVendors(filtered);
  };

  // Clear filters
  const clearFilters = () => {
    setFilterField(null);
    setFilterValue('');
    const filtered = [...originalVendors];
    if (sortField) {
      filtered.sort((a, b) => {
        let aValue = a[sortField];
        let bValue = b[sortField];
        if (!aValue) return 1;
        if (!bValue) return -1;
        if (typeof aValue === 'string') aValue = aValue.toLowerCase();
        if (typeof bValue === 'string') bValue = bValue.toLowerCase();
        if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }
    setVendors(filtered);
  };

  return (
    <div className='bg-background flex h-[100%] flex-col'>
      {/* Header */}
      <div className='border-border flex items-center justify-end border-b px-4 py-3'>
        {/*<div className="flex items-center gap-2">*/}
        {/*  <Button variant="ghost" size="sm" className="gap-1 text-sm font-medium">*/}
        {/*    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">*/}
        {/*      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M3 12h18M3 17h18" />*/}
        {/*    </svg>*/}
        {/*    Directory*/}
        {/*    <ChevronDown className="w-4 h-4" />*/}
        {/*  </Button>*/}
        {/*  <Button variant="ghost" size="sm" className="gap-1 text-sm">*/}
        {/*    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">*/}
        {/*      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />*/}
        {/*      <path*/}
        {/*        strokeLinecap="round"*/}
        {/*        strokeLinejoin="round"*/}
        {/*        strokeWidth={2}*/}
        {/*        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"*/}
        {/*      />*/}
        {/*    </svg>*/}
        {/*    View settings*/}
        {/*    <ChevronDown className="w-4 h-4" />*/}
        {/*  </Button>*/}
        {/*</div>*/}
        <div className='flex items-center gap-2'>
          {/*<Button variant='ghost' size='sm' className='gap-1 text-sm'>*/}
          {/*  <svg*/}
          {/*    className='h-4 w-4'*/}
          {/*    fill='none'*/}
          {/*    stroke='currentColor'*/}
          {/*    viewBox='0 0 24 24'*/}
          {/*  >*/}
          {/*    <path*/}
          {/*      strokeLinecap='round'*/}
          {/*      strokeLinejoin='round'*/}
          {/*      strokeWidth={2}*/}
          {/*      d='M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4'*/}
          {/*    />*/}
          {/*  </svg>*/}
          {/*  Import / Export*/}
          {/*  <ChevronDown className='h-4 w-4' />*/}
          {/*</Button>*/}
          {/*<Button*/}
          {/*  size='sm'*/}
          {/*  className='bg-primary text-primary-foreground hover:bg-primary/90 gap-1'*/}
          {/*>*/}
          {/*  <Plus className='h-4 w-4' />*/}
          {/*  New Vendor*/}
          {/*</Button>*/}
        </div>
      </div>

      {/* Toolbar */}
      <div className='border-border relative flex items-center gap-2 border-b px-4 py-2'>
        <div className='relative'>
          <Button
            variant='ghost'
            size='sm'
            className='text-muted-foreground gap-1 text-sm'
            onClick={() => {
              setShowSortMenu(!showSortMenu);
              setShowFilterMenu(false);
            }}
          >
            <ArrowUpDown className='h-4 w-4' />
            Sort
            {sortField && <span className='text-xs'>({sortField})</span>}
          </Button>

          {showSortMenu && (
            <div className='border-border absolute top-full left-0 z-50 mt-1 min-w-[200px] rounded-md border bg-white shadow-lg'>
              <div className='py-1'>
                <button
                  className='hover:bg-muted/30 flex w-full items-center justify-between px-4 py-2 text-left text-sm'
                  onClick={() => handleSort('name')}
                >
                  Name
                  {sortField === 'name' && (
                    <span className='text-muted-foreground text-xs'>
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </button>
                <button
                  className='hover:bg-muted/30 flex w-full items-center justify-between px-4 py-2 text-left text-sm'
                  onClick={() => handleSort('state')}
                >
                  State
                  {sortField === 'state' && (
                    <span className='text-muted-foreground text-xs'>
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </button>
                <button
                  className='hover:bg-muted/30 flex w-full items-center justify-between px-4 py-2 text-left text-sm'
                  onClick={() => handleSort('website')}
                >
                  Website
                  {sortField === 'website' && (
                    <span className='text-muted-foreground text-xs'>
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className='relative'>
          <Button
            variant='ghost'
            size='sm'
            className='text-muted-foreground gap-1 text-sm'
            onClick={() => {
              setShowFilterMenu(!showFilterMenu);
              setShowSortMenu(false);
            }}
          >
            <Filter className='h-4 w-4' />
            Filter
            {filterField && <span className='text-xs'>({filterField})</span>}
          </Button>

          {showFilterMenu && (
            <div className='border-border absolute top-full left-0 z-50 mt-1 min-w-[250px] rounded-md border bg-white shadow-lg'>
              <div className='p-3'>
                <div className='mb-2'>
                  <label className='text-muted-foreground mb-1 block text-xs'>
                    Filter by:
                  </label>
                  <select
                    className='border-border w-full rounded border px-2 py-1 text-sm'
                    value={filterField || ''}
                    onChange={(e) => setFilterField(e.target.value || null)}
                  >
                    <option value=''>Select field</option>
                    <option value='name'>Name</option>
                    <option value='state'>State</option>
                    <option value='website'>Website</option>
                    <option value='categories'>Categories</option>
                  </select>
                </div>
                {filterField && (
                  <div className='mb-2'>
                    <label className='text-muted-foreground mb-1 block text-xs'>
                      Value:
                    </label>
                    <input
                      type='text'
                      className='border-border w-full rounded border px-2 py-1 text-sm'
                      placeholder='Enter filter value...'
                      value={filterValue}
                      onChange={(e) => setFilterValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleFilter(filterField, filterValue);
                          setShowFilterMenu(false);
                        }
                      }}
                    />
                  </div>
                )}
                <div className='flex gap-2'>
                  <button
                    className='bg-primary text-primary-foreground hover:bg-primary/90 flex-1 rounded px-3 py-1 text-sm disabled:opacity-50'
                    onClick={() => {
                      handleFilter(filterField, filterValue);
                      setShowFilterMenu(false);
                    }}
                    disabled={!filterField}
                  >
                    Apply
                  </button>
                  <button
                    className='border-border hover:bg-muted/30 rounded border px-3 py-1 text-sm'
                    onClick={() => {
                      clearFilters();
                      setShowFilterMenu(false);
                    }}
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {(filterField || sortField) && (
          <div className='ml-2 flex items-center gap-2'>
            {filterField && (
              <div className='bg-muted flex items-center gap-1 rounded px-2 py-1 text-xs'>
                <span>
                  Filter: {filterField} = "{filterValue}"
                </span>
                <button
                  onClick={clearFilters}
                  className='hover:text-foreground'
                >
                  <X className='h-3 w-3' />
                </button>
              </div>
            )}
            {sortField && (
              <div className='bg-muted flex items-center gap-1 rounded px-2 py-1 text-xs'>
                <span>
                  Sort: {sortField} {sortOrder === 'asc' ? '↑' : '↓'}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Table */}
      <div className='flex-1 overflow-auto'>
        <table className='w-full'>
          <thead className='border-border sticky top-0 border-b bg-white'>
            <tr>
              <th className='text-muted-foreground px-4 py-2 text-left text-xs font-medium'>
                <div className='flex items-center gap-1'>
                  <Plus className='h-3 w-3' />
                  Vendor
                </div>
              </th>
              <th className='text-muted-foreground px-4 py-2 text-left text-xs font-medium'>
                <div className='flex items-center gap-1'>
                  <svg
                    className='h-3 w-3'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z'
                    />
                  </svg>
                  Categories
                </div>
              </th>
              <th className='text-muted-foreground px-4 py-2 text-left text-xs font-medium'>
                <div className='flex items-center gap-1'>
                  <svg
                    className='h-3 w-3'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
                    />
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
                    />
                  </svg>
                  Location · State
                </div>
              </th>
              <th className='text-muted-foreground px-4 py-2 text-left text-xs font-medium'>
                <div className='flex items-center gap-1'>
                  <svg
                    className='h-3 w-3'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9'
                    />
                  </svg>
                  Website
                </div>
              </th>
              <th className='text-muted-foreground px-4 py-2 text-left text-xs font-medium'>
                {/*<Plus className="w-3 h-3" />*/}
              </th>
            </tr>
          </thead>
          <tbody>
            {vendors?.map((vendor) => (
              <tr
                key={vendor.id}
                className='border-border hover:bg-muted/30 cursor-pointer border-b transition-colors'
              >
                <td
                  className='cursor-pointer px-4 py-3'
                  onClick={() => router.push(`/vendor/${vendor.id}`)}
                >
                  <div className='flex items-center gap-2'>
                    <svg
                      className='text-muted-foreground h-4 w-4'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                      />
                    </svg>
                    <span className='text-sm'>{vendor.name}</span>
                  </div>
                </td>
                <td className='px-4 py-3'>
                  <div className='flex flex-wrap gap-1'>
                    {vendor?.categories &&
                      vendor.categories
                        .split(',')
                        .map((category, idx) => (
                          <CategoryBadge key={idx} category={category.trim()} />
                        ))}
                  </div>
                </td>
                <td className='text-foreground px-4 py-3 text-sm'>
                  {vendor.state}
                </td>
                <td className='px-4 py-3'>
                  <a
                    href={vendor.website}
                    onClick={(e) => e.stopPropagation()}
                    className='text-primary text-sm hover:underline'
                  >
                    {vendor.website}
                  </a>
                </td>
                <td className='px-4 py-3'></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className='border-border text-muted-foreground flex items-center justify-between border-t px-4 py-2 text-xs'>
        <div className='flex items-center gap-4'>
          <span>{vendors.length} count</span>
          {/*<Button variant="ghost" size="sm" className="h-6 text-xs text-muted-foreground">*/}
          {/*  <Plus className="w-3 h-3 mr-1" />*/}
          {/*  Add calculation*/}
          {/*</Button>*/}
          {/*<Button variant="ghost" size="sm" className="h-6 text-xs text-muted-foreground">*/}
          {/*  <Plus className="w-3 h-3 mr-1" />*/}
          {/*  Add calculation*/}
          {/*</Button>*/}
          {/*<Button variant="ghost" size="sm" className="h-6 text-xs text-muted-foreground">*/}
          {/*  <Plus className="w-3 h-3 mr-1" />*/}
          {/*  Add calculatio*/}
          {/*</Button>*/}
        </div>
      </div>
    </div>
  );
};
