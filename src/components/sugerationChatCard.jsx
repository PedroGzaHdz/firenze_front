import React from "react";
import { ChevronRight, FileText } from "lucide-react";

export default function ForecastCard({ body, onClick, footerText }) {
  return (
    <div className="relative w-1/4  mr-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 max-w-sm flex flex-col justify-between h-50">
      <div className="mb-6 text-left">
        <p className="text-gray-800 text-base leading-relaxed">{body}</p>
      </div>

      <button
        className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 bg-blue-500 hover:bg-blue-600 transition-colors duration-200 rounded-full p-3 shadow-lg"
        onClick={onClick}
      >
        <ChevronRight className="w-5 h-5 text-white" />
      </button>

      <div className="flex items-center text-blue-500 text-sm">
        {/*<FileText className="w-4 h-4 mr-2" />*/}
        <span className="hover:text-blue-600 cursor-pointer transition-colors duration-200">
          {footerText}
        </span>
      </div>
    </div>
  );
}
