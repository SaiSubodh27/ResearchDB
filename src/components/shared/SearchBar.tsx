import React from "react";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
}: SearchBarProps) {
  return (
    <div className="flex items-center gap-2 bg-gray-100 rounded-button px-4 py-2">
      <Search size={18} className="text-gray-500" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-transparent outline-none text-sm flex-1"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="p-1 hover:bg-gray-200 rounded transition-colors"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
