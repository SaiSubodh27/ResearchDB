import React from "react";
import {
  ProjectStatus,
  ResourceType,
  ExperimentStatus,
  AISummaryStatus,
} from "../../types";

interface BadgeProps {
  variant:
    | ProjectStatus
    | ResourceType
    | ExperimentStatus
    | AISummaryStatus
    | string;
  children: React.ReactNode;
}

const variantStyles: Record<string, string> = {
  // ProjectStatus
  in_progress: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  planning: "bg-amber-100 text-amber-700",
  idea: "bg-gray-100 text-gray-700",
  archived: "bg-slate-100 text-slate-700",

  // AISummaryStatus
  summarized: "bg-green-100 text-green-700",
  pending: "bg-amber-100 text-amber-700",
  not_started: "bg-gray-100 text-gray-700",

  // ExperimentStatus
  running: "bg-blue-100 text-blue-700",
  failed: "bg-red-100 text-red-700",

  // ResourceType
  research_paper: "bg-indigo-100 text-indigo-700",
  dataset: "bg-teal-100 text-teal-700",
  book: "bg-amber-100 text-amber-700",
  video: "bg-red-100 text-red-700",
  website: "bg-blue-100 text-blue-700",
  tool: "bg-green-100 text-green-700",
};

export function Badge({ variant, children }: BadgeProps) {
  const style = variantStyles[variant] || variantStyles["idea"];

  return (
    <span
      className={`inline-block px-3 py-1 rounded-badge text-xs font-medium ${style}`}
    >
      {children}
    </span>
  );
}
