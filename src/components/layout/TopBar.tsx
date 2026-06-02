import React from "react";
import { Search } from "lucide-react";

interface TopBarProps {
  title: string;
}

export function TopBar({ title }: TopBarProps) {
  return (
    <div className="fixed top-0 left-0 md:left-64 right-0 h-16 sm:h-16 md:h-16 bg-white border-b border-border-light flex items-center justify-between px-4 sm:px-5 md:px-6 shadow-soft z-20 md:z-30">
      <h1 className="text-base sm:text-lg md:text-lg font-bold text-sidebar truncate">
        {title}
      </h1>

      <div className="flex items-center gap-2 sm:gap-4 ml-4">
        {/* Mobile Search Icon */}
        <button className="md:hidden flex-shrink-0 p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Search size={20} className="text-gray-500" />
        </button>

        {/* Desktop Search Bar */}
        <div className="hidden sm:flex items-center gap-2 bg-gray-100 rounded-button px-3 sm:px-4 py-2 flex-1 sm:w-48 md:w-64 transition-all">
          <Search size={18} className="text-gray-500 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none text-sm flex-1 min-w-0"
          />
        </div>
      </div>
    </div>
  );
}
