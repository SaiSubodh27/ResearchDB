import React from "react";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <Icon size={64} className="text-gray-300 mb-4" />
      <h3 className="font-serif font-bold text-lg text-sidebar mb-2">
        {title}
      </h3>
      <p className="text-gray-600 text-center mb-6 max-w-md">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-2 bg-accent text-white rounded-button hover:bg-opacity-90 transition-opacity font-medium"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
