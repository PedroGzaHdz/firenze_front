import { useState } from "react";
import { EyeIcon } from "lucide-react";

export default function UploadDocumentsModal({ isOpen, onClose, setFlowStep }) {
  const [documents] = useState([
    { id: 1, name: "MSA.pdf" },
    { id: 2, name: "MSA.pdf" },
    { id: 3, name: "MSA.pdf" },
    { id: 4, name: "MSA.pdf" },
    { id: 5, name: "MSA.pdf" },
    { id: 6, name: "MSA.pdf" },
  ]);

  const tableData = [
    {
      vendor: "ACME",
      submitted: "12/03/25",
      status: "Approved",
      report: "Pertains to product SKU 922818827",
      docType: "Invoice",
      amount: "$12,340.00",
    },
    {
      vendor: "ACME",
      submitted: "12/03/25",
      status: "In Review",
      report: "Pertains to product SKU 922818827",
      docType: "Invoice",
      amount: "$12,340.00",
    },
    {
      vendor: "Supplychain.co",
      submitted: "12/03/25",
      status: "In Review",
      report: "Pertains to product SKU 922818827",
      docType: "Invoice",
      amount: "$12,340.00",
    },
    {
      vendor: "Supplychain.co",
      submitted: "12/03/25",
      status: "Approved",
      report: "Pertains to product SKU 922818827",
      docType: "Invoice",
      amount: "$12,340.00",
    },
    {
      vendor: "Masters & Sons",
      submitted: "12/03/25",
      status: "Approved",
      report: "Pertains to product SKU 922818827",
      docType: "Invoice",
      amount: "$12,340.00",
    },
  ];

  if (!isOpen) return null;

  return (
    <div className="h-[100vh] w-[100vw] bg-opacity-50 fixed inset-0 z-50">
      <div className="fixed right-0 top-0 bottom-0 w-2/5 bg-black bg-opacity-70 z-50">
        <div className="bg-[#13132f] rounded-lg w-full h-full overflow-y-auto text-white flex flex-col">
          <div className="p-6 flex-grow overflow-y-auto">
            <h2 className="text-blue-400 text-xl font-medium mb-4">
              Upload documents
            </h2>

            {/* Document Cards Grid */}
            <div className="bg-gray-200 bg-opacity-90 p-6 rounded-lg mb-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="bg-white rounded-lg p-2 flex flex-col items-center"
                  >
                    <div className="w-full h-20 bg-amber-50 rounded mb-2 flex items-center justify-center">
                      <img
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5ratk3Gc3zutXXlq36tG09B9KxnpHIL4upA&s"
                        alt="Document thumbnail"
                        className="h-full object-cover"
                      />
                    </div>
                    <p className="text-black text-sm font-medium">{doc.name}</p>
                    <button className="text-blue-500 text-xs">Comments</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-white">
                    <th className="py-6 pr-6 text-sm font-medium">Vendor</th>
                    <th className="py-6 pr-6 text-sm font-medium">Submitted</th>
                    <th className="py-6 pr-6 text-sm font-medium">Status</th>
                    <th className="py-6 pr-6 text-sm font-medium">
                      AI Analysis Report
                    </th>
                    <th className="py-6 pr-6 text-sm font-medium w-[120px]">
                      Doc Type
                    </th>
                    <th className="py-6 pr-6 text-sm font-medium">Amount</th>
                    <th className="py-6 pr-2 text-sm font-sm"></th>
                  </tr>
                </thead>
                <tbody className="font-light">
                  {tableData.map((row, index) => (
                    <tr
                      key={index}
                      className="border-t text-sm border-gray-700 hover:bg-gray-800/30"
                    >
                      <td className="py-8 pr-2">{row.vendor}</td>
                      <td className="py-8 pr-2">{row.submitted}</td>
                      <td className="py-8 pr-2">
                        <span
                          className={`flex items-center ${
                            row.status === "Approved"
                              ? "text-green-500"
                              : "text-yellow-500"
                          }`}
                        >
                          {row.status}
                          <svg
                            className="ml-1 w-3 h-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d={
                                row.status === "Approved"
                                  ? "M19 9l-7 7-7-7"
                                  : "M19 9l-7 7-7-7"
                              }
                            />
                          </svg>
                        </span>
                      </td>
                      <td className="py-8 pr-2 truncate max-w-[180px]">
                        {row.report}
                      </td>
                      <td className="py-8 pr-2">
                        <span className="bg-gray-300 text-gray-800 text-xs px-2 py-1 rounded-full">
                          {row.docType}
                        </span>
                      </td>
                      <td className="py-8 pr-2">{row.amount}</td>
                      <td className="py-8 pr-2 text-right">
                        <EyeIcon className="h-4 w-4 text-blue-800 inline-block" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom Action Buttons */}
          <div className="flex justify-end space-x-3 p-6 mt-auto border-gray-700">
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-transparent border border-gray-500 text-white text-sm"
            >
              Cancel
            </button>
            <button
              className="px-4 py-1.5 rounded-lg bg-blue-500 text-white text-sm"
              onClick={onClose}
            >
              Upload and file
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
