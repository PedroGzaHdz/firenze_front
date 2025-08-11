import React from "react";
import {Plus, Sparkles, FileText, Telescope, Copy} from "lucide-react";

const ChatComponent = () => {
  return (
    <div className="flex flex-col h-full w-3/5 bg-white mx-auto">
      {/* Header */}
      <div className="bg-white px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-black fill-white" />
          </div>
          <span className="text-gray-900 text-sm font-medium font-family-mondwest">Ask Firenze</span>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 ">{/* Chat messages would go here */}</div>

      {/* Bottom Action Bar */}
      <div className="px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Left buttons */}
          <div className="flex items-center gap-2">
            <button className="w-9 h-9 cursor-pointer bg-white hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors">
              <Plus className="w-4 h-4 text-black" />
            </button>
            <button className="w-9 h-9 cursor-pointer bg-white hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors">
              <Telescope className="w-4 h-4 text-black" />
            </button>
          </div>

          {/* Right buttons */}
          <div className="flex items-center gap-2">
            <button className="w-9 h-9 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center justify-center transition-colors">
              <Copy className="w-4 h-4 text-white" />
            </button>
            <button className="w-9 h-9 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center justify-center transition-colors">
              <FileText className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;
