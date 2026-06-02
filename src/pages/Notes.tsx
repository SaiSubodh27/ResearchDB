import React, { useState } from "react";
import { Plus, Wand2, Tag, Search } from "lucide-react";
import { SearchBar } from "../components/shared/SearchBar";
import { AIBadge } from "../components/shared/AIBadge";
import { mockNotes } from "../data/mockData";

export function Notes() {
  const [search, setSearch] = useState("");
  const [selectedNoteId, setSelectedNoteId] = useState<string>(mockNotes[0].id);
  const [notes, setNotes] = useState(mockNotes);
  const [aiResult, setAiResult] = useState<{
    type: "summarize" | "tags" | "papers";
    content: string;
  } | null>(null);

  const filtered = notes.filter((n) =>
    n.title.toLowerCase().includes(search.toLowerCase()),
  );
  const selectedNote = notes.find((n) => n.id === selectedNoteId);

  const handleAiAction = (type: "summarize" | "tags" | "papers") => {
    const results = {
      summarize:
        "The IonCast model uses a physics-constrained dual-predictor architecture with Arrhenius constraints. Key findings include R²=0.9387 on OBLiEx benchmark with insights on structural descriptors.",
      tags: "Added tags: Physics-Constraints, Arrhenius-Equation, ML-Architecture, Performance-Metrics",
      papers:
        'Related papers found: "NASICON Review 2023" (methodology match), "Graph Neural Networks for Materials" (architecture comparison)',
    };
    setAiResult({ type, content: results[type] });
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 sm:gap-5 md:gap-6 h-auto md:h-[calc(100vh-100px)]">
      {/* Left Pane - Notes List */}
      <div className="w-full md:w-80 md:min-w-96 flex flex-col border border-border-light rounded-card overflow-hidden">
        <div className="p-3 sm:p-4 space-y-3 border-b border-border-light">
          <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-accent text-white rounded-button hover:bg-opacity-90 transition-opacity font-medium text-sm min-h-[44px] touch-target">
            <Plus size={16} />
            <span className="hidden sm:inline">New Note</span>
            <span className="sm:hidden">New</span>
          </button>
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search notes..."
          />
        </div>

        <div className="flex-1 overflow-y-auto">
          {filtered.map((note) => (
            <button
              key={note.id}
              onClick={() => setSelectedNoteId(note.id)}
              className={`w-full text-left px-3 sm:px-4 py-3 border-b border-border-light hover:bg-gray-50 transition-colors min-h-[56px] ${
                selectedNoteId === note.id
                  ? "bg-blue-50 border-l-4 border-l-accent"
                  : ""
              }`}
            >
              <p className="font-medium text-xs sm:text-sm text-sidebar line-clamp-1">
                {note.title}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">{note.projectId}</p>
              <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">
                {note.content.substring(0, 40)}...
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Right Pane - Note Editor */}
      {selectedNote ? (
        <div className="flex-1 flex flex-col overflow-hidden gap-4">
          {/* Editor */}
          <div className="flex-1 bg-card border border-border-light rounded-card overflow-hidden flex flex-col min-h-[300px] md:min-h-auto">
            <input
              type="text"
              defaultValue={selectedNote.title}
              className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-lg sm:text-2xl font-serif font-bold text-sidebar border-b border-border-light outline-none bg-white"
              placeholder="Note title"
            />
            <textarea
              defaultValue={selectedNote.content}
              className="flex-1 px-3 sm:px-4 md:px-6 py-3 sm:py-4 outline-none resize-none text-xs sm:text-sm bg-white"
              placeholder="Write your note here..."
            />
          </div>

          {/* Toolbar */}
          <div className="p-3 sm:p-4 bg-card border border-border-light rounded-card space-y-3">
            <h4 className="text-xs sm:text-sm font-medium text-gray-700">
              AI Actions
            </h4>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => handleAiAction("summarize")}
                className="flex items-center gap-2 px-3 py-2 bg-indigo-100 text-indigo-700 rounded-button text-xs font-medium hover:bg-indigo-200 transition-colors min-h-[36px]"
              >
                <Wand2 size={14} />
                Summarize
              </button>
              <button
                onClick={() => handleAiAction("tags")}
                className="flex items-center gap-2 px-3 py-2 bg-purple-100 text-purple-700 rounded-button text-xs font-medium hover:bg-purple-200 transition-colors"
              >
                <Tag size={14} />
                Generate Tags
              </button>
              <button
                onClick={() => handleAiAction("papers")}
                className="flex items-center gap-2 px-3 py-2 bg-teal-100 text-teal-700 rounded-button text-xs font-medium hover:bg-teal-200 transition-colors"
              >
                <Search size={14} />
                Find Papers
              </button>
            </div>

            {aiResult && (
              <div className="bg-indigo-50 border border-indigo-200 rounded-card p-3 mt-3">
                <div className="flex items-center gap-2 mb-2">
                  <AIBadge />
                </div>
                <p className="text-xs text-gray-700">{aiResult.content}</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Search size={48} className="text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">Select a note to view</p>
          </div>
        </div>
      )}
    </div>
  );
}
