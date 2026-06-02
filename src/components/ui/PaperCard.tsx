import React from "react";
import { Eye, Sparkles, Trash2 } from "lucide-react";
import { Badge } from "./Badge";
import { Paper } from "../../types";

interface PaperCardProps {
  paper: Paper;
  onView: () => void;
  onAnalyze: () => void;
  onDelete: () => void;
}

export function PaperCard({
  paper,
  onView,
  onAnalyze,
  onDelete,
}: PaperCardProps) {
  return (
    <div className="bg-white border border-border-light rounded-card p-4 sm:p-5 md:p-6 hover:shadow-md transition-shadow">
      {/* Header with title and year */}
      <div className="mb-3 sm:mb-4">
        <h3 className="text-base sm:text-lg font-semibold text-sidebar line-clamp-2">
          {paper.title}
        </h3>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">{paper.year}</p>
      </div>

      {/* Authors */}
      <p className="text-xs sm:text-sm text-gray-600 line-clamp-1 mb-3">
        {paper.authors.slice(0, 2).join(", ")}
        {paper.authors.length > 2 && ` +${paper.authors.length - 2}`}
      </p>

      {/* Problem/Research Topic */}
      {paper.problem && (
        <div className="mb-3 sm:mb-4">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
            Problem
          </p>
          <p className="text-xs sm:text-sm text-gray-700 line-clamp-2">
            {paper.problem}
          </p>
        </div>
      )}

      {/* Dataset */}
      {paper.dataset && (
        <div className="mb-3 sm:mb-4">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
            Dataset
          </p>
          <p className="text-xs sm:text-sm text-gray-700 line-clamp-1">
            {paper.dataset}
          </p>
        </div>
      )}

      {/* Tags */}
      {paper.tags && paper.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3 sm:mb-4">
          {paper.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="inline-block px-2 py-1 bg-indigo-50 text-indigo-700 text-xs rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Status and Actions Footer */}
      <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-border-light">
        <Badge variant={paper.aiSummaryStatus}>
          {paper.aiSummaryStatus}
        </Badge>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={onView}
            className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0 min-h-[36px] min-w-[36px] flex items-center justify-center"
            title="View details"
          >
            <Eye size={16} className="text-gray-600" />
          </button>
          <button
            onClick={onAnalyze}
            className="p-1.5 sm:p-2 hover:bg-amber-50 rounded-lg transition-colors flex-shrink-0 min-h-[36px] min-w-[36px] flex items-center justify-center"
            title="AI analysis"
          >
            <Sparkles size={16} className="text-amber-500" />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 sm:p-2 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0 min-h-[36px] min-w-[36px] flex items-center justify-center"
            title="Delete"
          >
            <Trash2 size={16} className="text-red-500" />
          </button>
        </div>
      </div>
    </div>
  );
}
