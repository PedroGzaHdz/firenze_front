"use client"

import { X, ChevronLeft, ChevronRight, Mail, Calendar, User, ChevronDown, Plus, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation';


export function VendorDetails({ vendor, currentIndex, totalRecords, nextVendorID, previousVendorID }) {
  console.log(vendor, currentIndex, totalRecords );

  const router = useRouter();
  
  // Mock data for demonstration
  const mockNotes = [
    {
      author: "John Doe",
      timestamp: "2 days ago",
      title: "Initial Contact",
      content: "Had a great conversation about potential partnership opportunities. Very interested in our products."
    },
    {
      author: "Jane Smith",
      timestamp: "5 days ago",
      title: "Follow-up Meeting",
      content: "Discussed pricing and delivery schedules. Need to send updated proposal by end of week."
    }
  ];

  const mockTasks = [
    {
      title: "Send updated proposal",
      assignee: "John Doe",
      dueDate: "Oct 10, 2025"
    }
  ];

  const mockActivity = [
    {
      author: "System",
      action: "created this vendor record",
      timestamp: "1 week ago"
    },
    {
      author: "John Doe",
      action: "updated contact information",
      timestamp: "3 days ago"
    },
    {
      author: "Jane Smith",
      action: "added a note",
      timestamp: "5 days ago"
    }
  ];
  
  return (
    <div className="bg-background flex h-full">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="border-b border-border px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button className="cursor-pointer" variant="ghost" size="icon" onClick={() => router.push('/vendors')}>
              <X className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>
                {currentIndex + 1} of {totalRecords} in Directory
              </span>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-6 w-6 cursor-pointer" disabled={!previousVendorID} onClick={() => previousVendorID && router.push(`/vendor/${previousVendorID}`)}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-6 w-6 cursor-pointer" disabled={!nextVendorID} onClick={() => nextVendorID && router.push(`/vendor/${nextVendorID}`)}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <HelpCircle className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                />
              </svg>
            </Button>
          </div>
        </div>

        {/* Title Bar */}
        <div className="border-b border-border px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h1 className="text-xl font-semibold">{vendor?.name || 'Unknown Vendor'}</h1>
            <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
          </div>
          {/* <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1 bg-transparent">
              <Mail className="w-4 h-4" />
              Compose email
            </Button>
            <Button variant="ghost" size="icon">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
            </Button>
            <Button variant="ghost" size="icon">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
            </Button>
            <Button variant="ghost" size="icon">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            </Button>
            <Button variant="ghost" size="icon">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                />
              </svg>
            </Button>
          </div> */}
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-border px-6 flex items-center gap-6">
          <button className="px-1 py-3 text-sm font-medium border-b-2 border-foreground">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
              Overview
            </div>
          </button>
          {/*<button className="px-1 py-3 text-sm text-muted-foreground hover:text-foreground">*/}
          {/*  <div className="flex items-center gap-2">*/}
          {/*    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">*/}
          {/*      <path*/}
          {/*        strokeLinecap="round"*/}
          {/*        strokeLinejoin="round"*/}
          {/*        strokeWidth={2}*/}
          {/*        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"*/}
          {/*      />*/}
          {/*    </svg>*/}
          {/*    Notes*/}
          {/*    <span className="text-xs">2</span>*/}
          {/*  </div>*/}
          {/*</button>*/}
          {/*<button className="px-1 py-3 text-sm text-muted-foreground hover:text-foreground">*/}
          {/*  <div className="flex items-center gap-2">*/}
          {/*    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">*/}
          {/*      <path*/}
          {/*        strokeLinecap="round"*/}
          {/*        strokeLinejoin="round"*/}
          {/*        strokeWidth={2}*/}
          {/*        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"*/}
          {/*      />*/}
          {/*    </svg>*/}
          {/*    Tasks*/}
          {/*    <span className="text-xs">1</span>*/}
          {/*  </div>*/}
          {/*</button>*/}
          {/*<button className="px-1 py-3 text-sm text-muted-foreground hover:text-foreground">*/}
          {/*  <div className="flex items-center gap-2">*/}
          {/*    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">*/}
          {/*      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />*/}
          {/*    </svg>*/}
          {/*    Activity*/}
          {/*  </div>*/}
          {/*</button>*/}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto px-6 py-6">
          {/* Highlights Section */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                />
              </svg>
              <h2 className="text-sm font-semibold">Highlights</h2>
            </div>
              <div className="grid grid-cols-3 gap-3">

                  <div
                    className="border border-border rounded-lg p-3 bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="text-xs text-muted-foreground mb-2">Next due task</div>
                    <div className="text-sm font-medium mb-1">-</div>
                    {/* {highlight.date && <div className="text-xs text-muted-foreground">{highlight.date}</div>} */}
                  </div>
                  <div
                    className="border border-border rounded-lg p-3 bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="text-xs text-muted-foreground mb-2">Contact</div>
                    <div className="text-sm font-medium mb-1">{vendor?.contact || "-"}</div>
                    {/* {highlight.date && <div className="text-xs text-muted-foreground">{highlight.date}</div>} */}
                  </div>
                  <div
                    className="border border-border rounded-lg p-3 bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="text-xs text-muted-foreground mb-2">Email</div>
                    <div className="text-sm font-medium mb-1">{vendor?.emailContact || "-"}</div>
                    {/* {highlight.date && <div className="text-xs text-muted-foreground">{highlight.date}</div>} */}
                  </div>                

              </div>
          </div>


          {/* Notes Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 className="text-xs font-medium">Notes</h3>
                <span className="text-xs text-muted-foreground">{mockNotes.length}</span>
                <ChevronDown className="w-3 h-3 text-muted-foreground" />
              </div>
              <button className="cursor-not-allowed opacity-50" disabled title="Próximamente">
                <Plus className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            <div className="space-y-3">
              {mockNotes.map((note, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                    <User className="w-3 h-3" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">{note.author}</span>
                      <span className="text-xs text-muted-foreground">{note.timestamp}</span>
                    </div>
                    <div className="text-sm font-medium mb-1">{note.title}</div>
                    <div className="text-sm text-muted-foreground">{note.content}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tasks Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <h3 className="text-xs font-medium">Tasks</h3>
                <span className="text-xs text-muted-foreground">{mockTasks.length}</span>
                <ChevronDown className="w-3 h-3 text-muted-foreground" />
              </div>
              <button className="cursor-not-allowed opacity-50" disabled title="Próximamente">
                <Plus className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            <div className="space-y-2">
              {mockTasks.map((task, idx) => (
                <div key={idx} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <svg
                      className="w-4 h-4 text-muted-foreground"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <span className="text-sm">{task.title}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center">
                        <User className="w-3 h-3" />
                      </div>
                      <span className="text-xs text-muted-foreground">{task.assignee}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-red-50 text-red-600">
                        1
                      </span>
                      <Calendar className="w-3 h-3 text-red-600" />
                      <span className="text-red-600">{task.dueDate}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <h3 className="text-xs font-medium">Activity</h3>
                <ChevronDown className="w-3 h-3 text-muted-foreground" />
              </div>
            </div>
            <div className="space-y-3">
              {mockActivity.map((activity, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                    <User className="w-3 h-3" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm">
                      <span className="font-medium">{activity.author}</span>{" "}
                      <span className="text-muted-foreground">{activity.action}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">{activity.timestamp}</div>
                  </div>
                </div>
              ))}
              <button className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
                View all
                <ChevronDown className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-80 border-l border-border flex flex-col">
        <div className="border-b border-border px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-sm font-medium">Details</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                />
              </svg>
              <span className="text-xs">0</span>
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-auto px-4 py-4">
          <div className="mb-4">
            <h3 className="text-xs font-medium mb-3 flex items-center gap-2">
              <ChevronDown className="w-3 h-3" />
              Record Details
            </h3>
            <div className="space-y-3">
              <div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  Vendor ID
                </div>
                <div className="text-xs font-mono text-muted-foreground break-all">{vendor.id}</div>
              </div>
              <div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  Company
                </div>
                <div className="text-sm">{vendor.company || vendor.name}</div>
              </div>
              <div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                  Categories
                </div>
                <div className="text-sm">{vendor.categories}</div>
              </div>
              <div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  About
                </div>
                <div className="text-sm">{vendor.about || '-'}</div>
              </div>
              <div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  Services & Capabilities
                </div>
                <div className="text-sm">{vendor.services || '-'}</div>
              </div>
              <div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                    />
                  </svg>
                  Website
                </div>
                <a href={vendor.website} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline break-all">
                  {vendor.website}
                </a>
              </div>
              <div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  Phone
                </div>
                <div className="text-sm">{vendor.phone || '-'}</div>
              </div>
              <div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Location
                </div>
                <div className="text-sm">{vendor.location || '-'}</div>
              </div>
              <div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  State
                </div>
                <div className="text-sm">{vendor.state}</div>
              </div>
              <div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Contact
                </div>
                <div className="text-sm">{vendor.contact || '-'}</div>
              </div>
              <div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  Email
                </div>
                <div className="text-sm">{vendor?.emailContact || '-'}</div>
              </div>
              <div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  Clients
                </div>
                <div className="text-sm">{vendor.clients || '-'}</div>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <ChevronDown className="w-3 h-3 text-muted-foreground" />
              <h3 className="text-xs font-medium">Lists</h3>
              <button className="cursor-not-allowed opacity-50 ml-auto" disabled title="Próximamente">
                <Plus className="w-3 h-3 text-muted-foreground" />
              </button>
            </div>
            <div className="text-xs text-muted-foreground">This record has not been added to any lists</div>
          </div>
        </div>
      </div>
    </div>
  )
}
