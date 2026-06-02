import React, { useState } from "react";
import { Plus, ExternalLink, Edit2, Trash2, MessageCircle } from "lucide-react";
import { Badge } from "../components/ui/Badge";
import { mockResources } from "../data/mockData";
import { ResourceType } from "../types";

const resourceIcons: Record<ResourceType, React.ReactNode> = {
  research_paper: "📄",
  dataset: "📊",
  book: "📚",
  video: "🎥",
  website: "🌐",
  tool: "🛠️",
};

export function Resources() {
  const [filter, setFilter] = useState<ResourceType | "all">("all");
  const [resources, setResources] = useState(mockResources);

  const filtered =
    filter === "all" ? resources : resources.filter((r) => r.type === filter);

  return (
    <div className="space-y-4 sm:space-y-5 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-sidebar">
          Resources
        </h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-button hover:bg-opacity-90 transition-opacity font-medium text-sm sm:text-base min-h-[44px] touch-target">
          <Plus size={18} />
          <span className="hidden sm:inline">Add Resource</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      {/* Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:-mx-5 sm:px-5 md:-mx-6 md:px-6">
        {(
          [
            "all",
            "research_paper",
            "dataset",
            "book",
            "video",
            "website",
            "tool",
          ] as const
        ).map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-3 sm:px-4 py-2 rounded-button whitespace-nowrap font-medium text-xs sm:text-sm transition-colors min-h-[36px] ${
              filter === type
                ? "bg-accent text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300"
            }`}
          >
            {type === "all" ? "All" : type.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
        {filtered.map((resource) => (
          <div
            key={resource.id}
            className="bg-card border border-border-light rounded-card p-4 sm:p-5 md:p-6 shadow-soft hover:shadow-lg transition-all duration-200 group"
          >
            <div className="flex items-start justify-between mb-3 sm:mb-4 gap-4">
              <div className="text-2xl sm:text-3xl flex-shrink-0">
                {resourceIcons[resource.type]}
              </div>
              <div className="hidden group-hover:flex gap-1 sm:gap-2 flex-shrink-0">
                <button className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors min-h-[32px] min-w-[32px]">
                  <Edit2 size={16} className="text-gray-600" />
                </button>
                <button
                  onClick={() =>
                    setResources(resources.filter((r) => r.id !== resource.id))
                  }
                  className="p-1.5 sm:p-2 hover:bg-red-100 rounded-lg transition-colors min-h-[32px] min-w-[32px]"
                >
                  <Trash2 size={16} className="text-red-500" />
                </button>
                <button className="p-1.5 sm:p-2 hover:bg-blue-100 rounded-lg transition-colors min-h-[32px] min-w-[32px]">
                  <MessageCircle size={16} className="text-blue-500" />
                </button>
              </div>
            </div>

            <h3 className="font-medium text-sm sm:text-base text-sidebar mb-2 line-clamp-2">
              {resource.title}
            </h3>

            <div className="flex gap-2 mb-3 sm:mb-4">
              <Badge variant={resource.type}>
                {resource.type.replace("_", " ")}
              </Badge>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {resource.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-badge"
                >
                  {tag}
                </span>
              ))}
            </div>

            <p className="text-xs text-gray-500 mb-3">{resource.createdAt}</p>

            <a
              href={resource.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-accent hover:text-indigo-700 text-sm font-medium"
            >
              Open Link
              <ExternalLink size={14} />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
