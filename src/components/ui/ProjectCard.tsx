import React from "react";
import { Project } from "../../types";
import { Badge } from "./Badge";
import { ProgressBar } from "./ProgressBar";
import { FileText, StickyNote, FlaskConical } from "lucide-react";

interface ProjectCardProps {
  project: Project;
  onClick?: () => void;
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-card border border-border-light rounded-card p-4 sm:p-5 md:p-6 shadow-soft hover:shadow-lg transition-all duration-200 cursor-pointer active:scale-95 md:active:scale-100 touch-target"
    >
      <div className="flex items-start justify-between gap-3 mb-3 sm:mb-4">
        <h3 className="font-serif font-bold text-base sm:text-lg text-sidebar flex-1 line-clamp-2">
          {project.title}
        </h3>
        <div className="flex-shrink-0">
          <Badge variant={project.status}>
            {project.status.replace("_", " ")}
          </Badge>
        </div>
      </div>

      <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 mb-3 sm:mb-4">
        {project.description}
      </p>

      <div className="mb-3 sm:mb-4">
        <ProgressBar progress={project.progress} />
      </div>

      <div className="flex gap-2 mb-3 sm:mb-4 flex-wrap">
        {project.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-badge truncate"
          >
            {tag}
          </span>
        ))}
        {project.tags.length > 3 && (
          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-badge">
            +{project.tags.length - 3}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 border-t border-border-light pt-3 sm:pt-4 flex-wrap">
        <div className="flex items-center gap-1">
          <FileText size={16} className="flex-shrink-0" />
          <span className="truncate">{project.papersCount} papers</span>
        </div>
        <div className="flex items-center gap-1">
          <StickyNote size={16} className="flex-shrink-0" />
          <span className="truncate">{project.notesCount} notes</span>
        </div>
        <div className="flex items-center gap-1">
          <FlaskConical size={16} />
          <span>{project.experimentsCount} exp</span>
        </div>
      </div>
    </div>
  );
}
