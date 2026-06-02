import React, { useState, useEffect } from "react";
import { StatCard } from "../components/ui/StatCard";
import { ProjectCard } from "../components/ui/ProjectCard";
import { SlidePanel } from "../components/ui/SlidePanel";
import { AIBadge } from "../components/shared/AIBadge";
import { SkeletonCard } from "../components/ui/SkeletonCard";
import { mockProjects, mockActivity, aiInsights } from "../data/mockData";
import {
  FolderKanban,
  FileText,
  StickyNote,
  FlaskConical,
  Lightbulb,
  Clock,
} from "lucide-react";

export function Dashboard() {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const project = selectedProject
    ? mockProjects.find((p) => p.id === selectedProject)
    : null;

  return (
    <div className="space-y-6 sm:space-y-7 md:space-y-8">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-sidebar">
          Good morning, Sai 👋
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mt-2">
          Welcome back to your research dashboard
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <>
            <StatCard
              icon={FolderKanban}
              label="Active Projects"
              value={mockProjects.length}
              trend={12}
              iconColor="bg-purple-500"
            />
            <StatCard
              icon={FileText}
              label="Research Papers"
              value={28}
              trend={8}
              iconColor="bg-indigo-500"
            />
            <StatCard
              icon={StickyNote}
              label="Notes"
              value={34}
              trend={15}
              iconColor="bg-teal-500"
            />
            <StatCard
              icon={FlaskConical}
              label="Experiments"
              value={11}
              trend={5}
              iconColor="bg-amber-500"
            />
          </>
        )}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="space-y-4">
          <h2 className="text-lg sm:text-xl font-serif font-bold text-sidebar">
            Recent Activity
          </h2>
          <div className="space-y-2 sm:space-y-3">
            {mockActivity.map((activity) => {
              const icons: Record<string, React.ReactNode> = {
                upload: <FileText size={16} />,
                note: <StickyNote size={16} />,
                experiment: <FlaskConical size={16} />,
                project: <FolderKanban size={16} />,
              };
              return (
                <div
                  key={activity.id}
                  className="flex gap-3 sm:gap-4 p-3 sm:p-4 bg-card border border-border-light rounded-card transition-all duration-200 hover:shadow-md"
                >
                  <div className="flex-shrink-0 w-9 sm:w-10 h-9 sm:h-10 bg-gray-100 rounded-lg flex items-center justify-center text-accent">
                    {icons[activity.type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-sidebar line-clamp-2">
                      {activity.description}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {activity.timestamp}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Insights */}
        <div className="space-y-4">
          <h2 className="text-lg sm:text-xl font-serif font-bold text-sidebar">
            AI Insights
          </h2>
          <div className="bg-card border border-border-light rounded-card p-4 sm:p-5 md:p-6">
            <div className="mb-4">
              <AIBadge />
            </div>
            <div className="space-y-3 sm:space-y-4">
              {aiInsights.map((insight, index) => (
                <div key={index} className="flex gap-2 sm:gap-3">
                  <Lightbulb
                    size={16}
                    className="text-amber-500 flex-shrink-0 mt-0.5"
                  />
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                    {insight}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Projects */}
      <div className="space-y-4">
        <h2 className="text-lg sm:text-xl font-serif font-bold text-sidebar">
          Recent Projects
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {mockProjects.slice(0, 3).map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() => setSelectedProject(project.id)}
            />
          ))}
        </div>
      </div>

      {/* Slide Panel */}
      <SlidePanel
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        title={project?.title || ""}
      >
        {project && (
          <div className="space-y-6">
            <div>
              <h3 className="font-serif font-bold text-lg text-sidebar mb-2">
                {project.title}
              </h3>
              <p className="text-sm text-gray-600">{project.description}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-card">
              <h4 className="font-medium text-sm mb-3">Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Status</span>
                  <span className="font-medium">{project.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium">{project.progress}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Created</span>
                  <span className="font-medium">{project.createdAt}</span>
                </div>
              </div>
            </div>

            <button className="w-full py-2 px-4 bg-accent text-white rounded-button hover:bg-opacity-90 transition-opacity font-medium text-sm">
              Ask AI about this project
            </button>
          </div>
        )}
      </SlidePanel>
    </div>
  );
}
