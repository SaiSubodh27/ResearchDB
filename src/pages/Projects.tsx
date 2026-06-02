import React, { useState } from "react";
import { Plus } from "lucide-react";
import { ProjectCard } from "../components/ui/ProjectCard";
import { Modal } from "../components/ui/Modal";
import { SlidePanel } from "../components/ui/SlidePanel";
import { mockProjects } from "../data/mockData";
import { ProjectStatus } from "../types";

export function Projects() {
  const [filter, setFilter] = useState<ProjectStatus | "all">("all");
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    status: "planning" as ProjectStatus,
  });

  const filteredProjects =
    filter === "all"
      ? mockProjects
      : mockProjects.filter((p) => p.status === filter);
  const project = selectedProject
    ? mockProjects.find((p) => p.id === selectedProject)
    : null;

  return (
    <div className="space-y-4 sm:space-y-5 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-sidebar">
          Projects
        </h1>
        <button
          onClick={() => setShowNewProjectModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-button hover:bg-opacity-90 transition-opacity font-medium text-sm sm:text-base min-h-[44px] touch-target"
        >
          <Plus size={18} />
          <span className="hidden sm:inline">New Project</span>
          <span className="sm:hidden">New</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:-mx-5 sm:px-5 md:-mx-6 md:px-6">
        {(
          ["all", "planning", "in_progress", "completed", "archived"] as const
        ).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-3 sm:px-4 py-2 rounded-button whitespace-nowrap font-medium text-xs sm:text-sm transition-colors min-h-[36px] ${
              filter === status
                ? "bg-accent text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300"
            }`}
          >
            {status === "all" ? "All" : status.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* Project Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
        {filteredProjects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onClick={() => setSelectedProject(project.id)}
          />
        ))}
      </div>

      {/* New Project Modal */}
      <Modal
        isOpen={showNewProjectModal}
        onClose={() => setShowNewProjectModal(false)}
        title="Create New Project"
        actions={
          <>
            <button
              onClick={() => setShowNewProjectModal(false)}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-button transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                setShowNewProjectModal(false);
                setNewProject({
                  title: "",
                  description: "",
                  status: "planning",
                });
              }}
              className="px-4 py-2 bg-accent text-white rounded-button hover:bg-opacity-90 transition-opacity font-medium"
            >
              Create
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={newProject.title}
              onChange={(e) =>
                setNewProject({ ...newProject, title: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-button text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="Project title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={newProject.description}
              onChange={(e) =>
                setNewProject({ ...newProject, description: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-button text-sm focus:outline-none focus:ring-2 focus:ring-accent resize-none"
              rows={4}
              placeholder="Project description"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={newProject.status}
              onChange={(e) =>
                setNewProject({
                  ...newProject,
                  status: e.target.value as ProjectStatus,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-button text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="idea">Idea</option>
              <option value="planning">Planning</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </Modal>

      {/* Project Detail Panel */}
      <SlidePanel
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        title={project?.title || ""}
      >
        {project && (
          <div className="space-y-6">
            <p className="text-gray-600">{project.description}</p>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-sm text-gray-700 mb-2">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-badge text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-card space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Papers</span>
                  <span className="text-sm font-medium">
                    {project.papersCount}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Notes</span>
                  <span className="text-sm font-medium">
                    {project.notesCount}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Experiments</span>
                  <span className="text-sm font-medium">
                    {project.experimentsCount}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </SlidePanel>
    </div>
  );
}
