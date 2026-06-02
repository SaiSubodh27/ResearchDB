import React from "react";

interface ProgressBarProps {
  progress: number;
  label?: string;
}

export function ProgressBar({ progress, label }: ProgressBarProps) {
  return (
    <div>
      {label && (
        <p className="text-xs font-medium text-gray-600 mb-1">{label}</p>
      )}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-accent h-2 rounded-full transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-xs text-gray-500 mt-1">{progress}%</p>
    </div>
  );
}
