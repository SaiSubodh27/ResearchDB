import React, { ChangeEvent, useMemo, useState } from "react";
import { AlertCircle, FileText, Loader2, Upload } from "lucide-react";
import { Badge } from "../components/ui/Badge";
import { SearchBar } from "../components/shared/SearchBar";
import { mockPapers } from "../data/mockData";

type AnalysisResult = {
  paper_id: number;
  filename: string;
  summary: string;
  research_problem: string;
  methodology: string;
  key_findings: string;
  future_work: string;
  datasets: Array<{ name: string; source: string; url?: string | null }>;
  citations: Array<{ citation_type: string; value: string }>;
  logs?: string[];
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000";

export function Papers() {
  const [search, setSearch] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      mockPapers.filter(
        (paper) =>
          paper.title.toLowerCase().includes(search.toLowerCase()) ||
          paper.authors.some((author) =>
            author.toLowerCase().includes(search.toLowerCase()),
          ),
      ),
    [search],
  );

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    setError(null);
    setSelectedFile(event.target.files?.[0] ?? null);
  }

  async function handleAnalyze() {
    if (!selectedFile) {
      setError("Choose a PDF before starting analysis.");
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setAnalysis(null);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch(`${API_BASE_URL}/analyze`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (!response.ok) {
        const detail = data.detail;
        const message =
          typeof detail === "object" && detail?.message
            ? detail.message
            : detail || "Analysis failed.";
        if (typeof detail === "object" && Array.isArray(detail.logs)) {
          setAnalysis({
            paper_id: 0,
            filename: selectedFile.name,
            summary: "",
            research_problem: "",
            methodology: "",
            key_findings: "",
            future_work: "",
            datasets: [],
            citations: [],
            logs: detail.logs,
          });
        }
        throw new Error(message);
      }

      setAnalysis(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed.");
    } finally {
      setIsAnalyzing(false);
    }
  }

  return (
    <div className="space-y-5 md:space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-sidebar">
          Research Papers
        </h1>
      </div>

      <section className="rounded-card border border-border-light bg-white p-4 sm:p-5 space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <label className="flex min-h-[48px] flex-1 cursor-pointer items-center gap-3 rounded-button border border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-700 hover:border-accent">
            <FileText size={18} className="text-accent" />
            <span className="truncate">
              {selectedFile ? selectedFile.name : "Choose a PDF paper"}
            </span>
            <input
              className="hidden"
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
            />
          </label>
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-button bg-accent px-5 py-3 text-sm font-medium text-white transition-opacity hover:bg-opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isAnalyzing ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
            {isAnalyzing ? "Analyzing" : "Upload & Analyze"}
          </button>
        </div>

        {error && (
          <div className="flex items-start gap-2 rounded-card border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {analysis && (
          <div className="grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
            <div className="space-y-4">
              <AnalysisBlock title="Summary" value={analysis.summary} />
              <AnalysisBlock title="Research Problem" value={analysis.research_problem} />
              <AnalysisBlock title="Methodology" value={analysis.methodology} />
              <AnalysisBlock title="Key Findings" value={analysis.key_findings} />
              <AnalysisBlock title="Future Work" value={analysis.future_work} />
            </div>

            <div className="space-y-4">
              <ListBlock
                title="Datasets"
                emptyText="No datasets detected."
                items={analysis.datasets.map((dataset) => ({
                  label: dataset.name,
                  meta: dataset.source,
                  url: dataset.url,
                }))}
              />
              <ListBlock
                title="Citations"
                emptyText="No citations detected."
                items={analysis.citations.slice(0, 12).map((citation) => ({
                  label: citation.value,
                  meta: citation.citation_type,
                }))}
              />
              <ListBlock
                title="Progress Logs"
                emptyText="No progress logs returned."
                items={(analysis.logs ?? []).map((log) => ({
                  label: log,
                  meta: "log",
                }))}
              />
            </div>
          </div>
        )}
      </section>

      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search saved papers by title or author..."
      />

      <div className="overflow-x-auto rounded-card border border-border-light bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-border-light bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Title</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Authors</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Year</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">AI Summary</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((paper) => (
              <tr key={paper.id} className="border-b border-border-light">
                <td className="px-4 py-4 font-medium text-sidebar">{paper.title}</td>
                <td className="px-4 py-4 text-gray-600">{paper.authors.slice(0, 2).join(", ")}</td>
                <td className="px-4 py-4 text-gray-600">{paper.year}</td>
                <td className="px-4 py-4">
                  <Badge variant={paper.aiSummaryStatus}>{paper.aiSummaryStatus}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AnalysisBlock({ title, value }: { title: string; value: string }) {
  return (
    <section className="rounded-card border border-border-light p-4">
      <h2 className="mb-2 text-sm font-semibold text-sidebar">{title}</h2>
      <p className="whitespace-pre-wrap text-sm leading-6 text-gray-700">{value}</p>
    </section>
  );
}

function ListBlock({
  title,
  emptyText,
  items,
}: {
  title: string;
  emptyText: string;
  items: Array<{ label: string; meta: string; url?: string | null }>;
}) {
  return (
    <section className="rounded-card border border-border-light p-4">
      <h2 className="mb-3 text-sm font-semibold text-sidebar">{title}</h2>
      {items.length === 0 ? (
        <p className="text-sm text-gray-500">{emptyText}</p>
      ) : (
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li key={`${item.label}-${index}`} className="text-sm">
              <span className="mr-2 rounded bg-gray-100 px-2 py-1 text-xs uppercase text-gray-600">
                {item.meta}
              </span>
              {item.url ? (
                <a className="break-all text-accent hover:underline" href={item.url} target="_blank" rel="noreferrer">
                  {item.label}
                </a>
              ) : (
                <span className="break-words text-gray-700">{item.label}</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
