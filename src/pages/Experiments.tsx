import React, { useState } from "react";
import { Plus, ChevronDown } from "lucide-react";
import { Badge } from "../components/ui/Badge";
import { SlidePanel } from "../components/ui/SlidePanel";
import { AIBadge } from "../components/shared/AIBadge";
import { mockExperiments } from "../data/mockData";

export function Experiments() {
  const [selectedExperiment, setSelectedExperiment] = useState<string | null>(
    null,
  );
  const [aiGenerated, setAiGenerated] = useState<string | null>(null);

  const experiment = selectedExperiment
    ? mockExperiments.find((e) => e.id === selectedExperiment)
    : null;

  return (
    <div className="space-y-4 sm:space-y-5 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-sidebar">
          Experiments
        </h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-button hover:bg-opacity-90 transition-opacity font-medium text-sm sm:text-base min-h-[44px] touch-target">
          <Plus size={18} />
          <span className="hidden sm:inline">New Experiment</span>
          <span className="sm:hidden">New</span>
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-card border border-border-light">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-border-light">
            <tr>
              <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-700">
                Name
              </th>
              <th className="hidden sm:table-cell px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-700">
                Project
              </th>
              <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-700">
                Status
              </th>
              <th className="hidden md:table-cell px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-700">
                Objective
              </th>
              <th className="hidden lg:table-cell px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-700">
                Parameters
              </th>
              <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-700">
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {mockExperiments.map((exp) => (
              <tr
                key={exp.id}
                onClick={() => setSelectedExperiment(exp.id)}
                className="border-b border-border-light hover:bg-gray-50 cursor-pointer transition-colors active:bg-blue-50"
              >
                <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium text-sidebar">
                  {exp.name}
                </td>
                <td className="hidden sm:table-cell px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-600">
                  {exp.projectId}
                </td>
                <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                  <Badge variant={exp.status}>{exp.status}</Badge>
                </td>
                <td className="hidden md:table-cell px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-600 max-w-xs truncate">
                  {exp.objective}
                </td>
                <td className="hidden lg:table-cell px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-600">
                  {Object.keys(exp.parameters).length} params
                </td>
                <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-600">
                  {exp.createdAt}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Panel */}
      <SlidePanel
        isOpen={!!selectedExperiment}
        onClose={() => {
          setSelectedExperiment(null);
          setAiGenerated(null);
        }}
        title={experiment?.name || ""}
      >
        {experiment && (
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Objective</h4>
              <p className="text-sm text-gray-600">{experiment.objective}</p>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Parameters</h4>
              <div className="bg-gray-50 rounded-card overflow-hidden">
                {Object.entries(experiment.parameters).map(([key, value]) => (
                  <div
                    key={key}
                    className="px-4 py-2 border-b border-gray-200 flex justify-between last:border-b-0"
                  >
                    <span className="text-sm text-gray-600">{key}</span>
                    <span className="text-sm font-medium text-sidebar">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Observations</h4>
              <p className="text-sm text-gray-600">{experiment.observations}</p>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Results</h4>
              <p className="text-sm text-gray-600">{experiment.results}</p>
            </div>

            {experiment.aiAnalysis ? (
              <div className="bg-indigo-50 border border-indigo-200 rounded-card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AIBadge />
                </div>
                <p className="text-sm text-gray-700">{experiment.aiAnalysis}</p>
              </div>
            ) : (
              <>
                {!aiGenerated && (
                  <button
                    onClick={() =>
                      setAiGenerated(
                        "Strong performance consistency across NASICON, Garnet, and Perovskite subtypes. Recommend further tuning on Perovskite subset which shows slightly higher error (MAE=0.61).",
                      )
                    }
                    className="w-full py-2 px-4 bg-amber-100 text-amber-700 rounded-button hover:bg-amber-200 transition-colors font-medium text-sm"
                  >
                    Generate AI Analysis
                  </button>
                )}
                {aiGenerated && (
                  <div className="bg-indigo-50 border border-indigo-200 rounded-card p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AIBadge />
                    </div>
                    <p className="text-sm text-gray-700">{aiGenerated}</p>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </SlidePanel>
    </div>
  );
}
