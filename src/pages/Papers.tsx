import React, { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ChevronRight,
  Database,
  FileText,
  Loader2,
  Quote,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { Badge } from "../components/ui/Badge";
import { SlidePanel } from "../components/ui/SlidePanel";
import { SearchBar } from "../components/shared/SearchBar";
import { mockPapers } from "../data/mockData";

/* ────────────────────────── Types ────────────────────────── */

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

type BackendPaper = {
  id: number;
  filename: string;
  uploaded_at: string | null;
  has_analysis: boolean;
  summary_preview: string | null;
  citation_count: number;
  dataset_count: number;
};

type PaperDetailResponse = {
  id: number;
  filename: string;
  file_path: string;
  uploaded_at: string | null;
  analysis: {
    id: number;
    summary: string;
    research_problem: string;
    methodology: string;
    key_findings: string;
    future_work: string;
    created_at: string | null;
  } | null;
  datasets: Array<{ name: string; source: string; url?: string | null }>;
  citations: Array<{ citation_type: string; value: string }>;
};

const API_URL = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000";

/* ────────────────────────── Component ────────────────────── */

export function Papers() {
  const [search, setSearch] = useState("");

  // Upload + inline analysis
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Backend papers
  const [backendPapers, setBackendPapers] = useState<BackendPaper[]>([]);
  const [loadingPapers, setLoadingPapers] = useState(true);

  // Slide panel detail
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelDetail, setPanelDetail] = useState<PaperDetailResponse | null>(null);
  const [panelLoading, setPanelLoading] = useState(false);

  // Delete confirmation
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Toast
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  /* ── Fetch papers on mount ── */

  const fetchPapers = useCallback(async () => {
    setLoadingPapers(true);
    try {
      const res = await fetch(`${API_URL}/papers`);
      if (res.ok) {
        const data: BackendPaper[] = await res.json();
        setBackendPapers(data);
      }
    } catch {
      // Backend may be offline — not an error for the user
    } finally {
      setLoadingPapers(false);
    }
  }, []);

  useEffect(() => {
    fetchPapers();
  }, [fetchPapers]);

  /* ── Filtered mock papers ── */

  const filteredMock = useMemo(
    () =>
      mockPapers.filter(
        (paper) =>
          paper.title.toLowerCase().includes(search.toLowerCase()) ||
          paper.authors.some((a) => a.toLowerCase().includes(search.toLowerCase())),
      ),
    [search],
  );

  const filteredBackend = useMemo(
    () =>
      backendPapers.filter((p) =>
        p.filename.toLowerCase().includes(search.toLowerCase()),
      ),
    [backendPapers, search],
  );

  /* ── File change handler ── */

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    setError(null);
    setSelectedFile(event.target.files?.[0] ?? null);
  }

  /* ── Upload & Analyze ── */

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
      const response = await fetch(`${API_URL}/analyze`, {
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
      showToast("Paper analyzed and saved successfully!", "success");

      // Refresh the papers list so the new paper appears
      fetchPapers();

      // Reset file input
      setSelectedFile(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed.");
    } finally {
      setIsAnalyzing(false);
    }
  }

  /* ── View paper detail (slide panel) ── */

  async function handleViewPaper(paperId: number) {
    setPanelOpen(true);
    setPanelLoading(true);
    setPanelDetail(null);

    try {
      const res = await fetch(`${API_URL}/papers/${paperId}`);
      if (!res.ok) throw new Error("Failed to load paper.");
      const data: PaperDetailResponse = await res.json();
      setPanelDetail(data);
    } catch {
      showToast("Could not load paper details.", "error");
      setPanelOpen(false);
    } finally {
      setPanelLoading(false);
    }
  }

  /* ── Delete paper ── */

  async function handleDelete(paperId: number) {
    setDeletingId(paperId);
    try {
      const res = await fetch(`${API_URL}/papers/${paperId}`, { method: "DELETE" });
      if (!res.ok && res.status !== 204) throw new Error("Delete failed.");
      setBackendPapers((prev) => prev.filter((p) => p.id !== paperId));
      showToast("Paper deleted.", "success");
      if (panelDetail?.id === paperId) setPanelOpen(false);
    } catch {
      showToast("Could not delete paper.", "error");
    } finally {
      setDeletingId(null);
    }
  }

  /* ── Toast helper ── */

  function showToast(message: string, type: "success" | "error") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  }

  /* ── Render ── */

  return (
    <div className="space-y-5 md:space-y-6">
      {/* ─── Header ─── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-sidebar">
            Research Papers
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Upload PDFs for AI-powered analysis · {backendPapers.length} analyzed paper
            {backendPapers.length !== 1 && "s"} stored
          </p>
        </div>
      </div>

      {/* ─── Upload Section ─── */}
      <section className="rounded-card border border-border-light bg-white p-4 sm:p-5 space-y-4 shadow-soft">
        <h2 className="text-sm font-semibold text-sidebar flex items-center gap-2">
          <Upload size={16} className="text-accent" />
          Upload &amp; Analyze
        </h2>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <label className="flex min-h-[48px] flex-1 cursor-pointer items-center gap-3 rounded-button border border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-700 hover:border-accent transition-colors">
            <FileText size={18} className="text-accent" />
            <span className="truncate">
              {selectedFile ? selectedFile.name : "Choose a PDF paper…"}
            </span>
            <input
              className="hidden"
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
            />
          </label>
          <button
            id="analyze-button"
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-button bg-accent px-5 py-3 text-sm font-medium text-white transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isAnalyzing ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
            {isAnalyzing ? "Analyzing…" : "Upload & Analyze"}
          </button>
        </div>

        {/* Error banner */}
        {error && (
          <div className="flex items-start gap-2 rounded-card border border-red-200 bg-red-50 p-3 text-sm text-red-700 animate-in">
            <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Inline analysis result (latest upload) */}
        {analysis && analysis.summary && (
          <div className="grid gap-4 xl:grid-cols-[1.3fr_0.7fr] animate-in">
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
                icon={<Database size={14} className="text-teal-600" />}
                emptyText="No datasets detected."
                items={analysis.datasets.map((d) => ({
                  label: d.name,
                  meta: d.source,
                  url: d.url,
                }))}
              />
              <ListBlock
                title="Citations"
                icon={<Quote size={14} className="text-indigo-600" />}
                emptyText="No citations detected."
                items={analysis.citations.slice(0, 12).map((c) => ({
                  label: c.value,
                  meta: c.citation_type,
                }))}
              />
              {analysis.logs && analysis.logs.length > 0 && (
                <ListBlock
                  title="Progress Logs"
                  emptyText=""
                  items={analysis.logs.map((log) => ({ label: log, meta: "log" }))}
                />
              )}
            </div>
          </div>
        )}
      </section>

      {/* ─── Search ─── */}
      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search papers by title, author, or filename…"
      />

      {/* ─── Analyzed Papers (backend) ─── */}
      {(loadingPapers || filteredBackend.length > 0) && (
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
            AI-Analyzed Papers
          </h2>
          <div className="overflow-x-auto rounded-card border border-border-light bg-white shadow-soft">
            <table className="w-full text-sm">
              <thead className="border-b border-border-light bg-gray-50/80">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Filename</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 hidden md:table-cell">Uploaded</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 hidden sm:table-cell">Citations</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 hidden sm:table-cell">Datasets</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loadingPapers ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <tr key={`skel-${i}`} className="border-b border-border-light animate-pulse">
                      <td className="px-4 py-4"><div className="h-4 bg-gray-200 rounded w-3/4" /></td>
                      <td className="px-4 py-4 hidden md:table-cell"><div className="h-4 bg-gray-200 rounded w-20" /></td>
                      <td className="px-4 py-4 hidden sm:table-cell"><div className="h-4 bg-gray-200 rounded w-8" /></td>
                      <td className="px-4 py-4 hidden sm:table-cell"><div className="h-4 bg-gray-200 rounded w-8" /></td>
                      <td className="px-4 py-4"><div className="h-5 bg-gray-200 rounded w-20" /></td>
                      <td className="px-4 py-4"><div className="h-8 bg-gray-200 rounded w-16 ml-auto" /></td>
                    </tr>
                  ))
                ) : (
                  filteredBackend.map((paper) => (
                    <tr
                      key={`bp-${paper.id}`}
                      className="border-b border-border-light hover:bg-accent/[.03] transition-colors cursor-pointer group"
                      onClick={() => handleViewPaper(paper.id)}
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <FileText size={16} className="text-accent flex-shrink-0" />
                          <span className="font-medium text-sidebar truncate max-w-[260px]">{paper.filename}</span>
                        </div>
                        {paper.summary_preview && (
                          <p className="text-xs text-gray-400 mt-1 line-clamp-1 max-w-xs">
                            {paper.summary_preview}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-4 text-gray-500 hidden md:table-cell">
                        {paper.uploaded_at ? formatDate(paper.uploaded_at) : "—"}
                      </td>
                      <td className="px-4 py-4 text-gray-600 hidden sm:table-cell">{paper.citation_count}</td>
                      <td className="px-4 py-4 text-gray-600 hidden sm:table-cell">{paper.dataset_count}</td>
                      <td className="px-4 py-4">
                        <Badge variant={paper.has_analysis ? "summarized" : "pending"}>
                          {paper.has_analysis ? "Analyzed" : "Pending"}
                        </Badge>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDelete(paper.id); }}
                            disabled={deletingId === paper.id}
                            className="p-2 rounded-button text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                            title="Delete paper"
                          >
                            {deletingId === paper.id ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <Trash2 size={16} />
                            )}
                          </button>
                          <ChevronRight size={16} className="text-gray-300 group-hover:text-accent transition-colors" />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            {!loadingPapers && filteredBackend.length === 0 && (
              <div className="py-10 text-center text-sm text-gray-400">
                No analyzed papers found. Upload a PDF above to get started.
              </div>
            )}
          </div>
        </section>
      )}

      {/* ─── Reference Papers (mock) ─── */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
          Reference Library
        </h2>
        <div className="overflow-x-auto rounded-card border border-border-light bg-white shadow-soft">
          <table className="w-full text-sm">
            <thead className="border-b border-border-light bg-gray-50/80">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Title</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 hidden md:table-cell">Authors</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 hidden sm:table-cell">Year</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">AI Summary</th>
              </tr>
            </thead>
            <tbody>
              {filteredMock.map((paper) => (
                <tr key={paper.id} className="border-b border-border-light hover:bg-accent/[.03] transition-colors">
                  <td className="px-4 py-4 font-medium text-sidebar">{paper.title}</td>
                  <td className="px-4 py-4 text-gray-600 hidden md:table-cell">
                    {paper.authors.slice(0, 2).join(", ")}
                  </td>
                  <td className="px-4 py-4 text-gray-600 hidden sm:table-cell">{paper.year}</td>
                  <td className="px-4 py-4">
                    <Badge variant={paper.aiSummaryStatus}>{paper.aiSummaryStatus}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ─── Detail Slide Panel ─── */}
      <SlidePanel
        isOpen={panelOpen}
        onClose={() => setPanelOpen(false)}
        title={panelDetail?.filename ?? "Paper Details"}
      >
        {panelLoading ? (
          <div className="space-y-4 animate-pulse">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i}>
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-full mb-1" />
                <div className="h-3 bg-gray-100 rounded w-5/6" />
              </div>
            ))}
          </div>
        ) : panelDetail ? (
          <div className="space-y-5">
            {panelDetail.uploaded_at && (
              <p className="text-xs text-gray-400">
                Uploaded {formatDate(panelDetail.uploaded_at)}
              </p>
            )}

            {panelDetail.analysis ? (
              <>
                <PanelSection title="Summary" value={panelDetail.analysis.summary} />
                <PanelSection title="Research Problem" value={panelDetail.analysis.research_problem} />
                <PanelSection title="Methodology" value={panelDetail.analysis.methodology} />
                <PanelSection title="Key Findings" value={panelDetail.analysis.key_findings} />
                <PanelSection title="Future Work" value={panelDetail.analysis.future_work} />
              </>
            ) : (
              <p className="text-sm text-gray-500 italic">No analysis available for this paper.</p>
            )}

            {panelDetail.datasets.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold uppercase text-gray-400 mb-2">Datasets</h3>
                <ul className="space-y-1.5">
                  {panelDetail.datasets.map((d, i) => (
                    <li key={i} className="text-sm flex items-start gap-2">
                      <Database size={14} className="text-teal-500 mt-0.5 flex-shrink-0" />
                      <span>
                        <span className="text-gray-700">{d.name}</span>
                        <span className="ml-1.5 text-xs text-gray-400">({d.source})</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {panelDetail.citations.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold uppercase text-gray-400 mb-2">
                  Citations ({panelDetail.citations.length})
                </h3>
                <ul className="space-y-1.5 max-h-60 overflow-y-auto">
                  {panelDetail.citations.slice(0, 20).map((c, i) => (
                    <li key={i} className="text-sm flex items-start gap-2">
                      <Quote size={12} className="text-indigo-400 mt-1 flex-shrink-0" />
                      <span className="text-gray-600 break-all text-xs leading-relaxed">
                        <span className="font-medium text-gray-500 uppercase mr-1">[{c.citation_type}]</span>
                        {c.value}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="pt-4 border-t border-border-light">
              <button
                onClick={() => { handleDelete(panelDetail.id); }}
                disabled={deletingId === panelDetail.id}
                className="inline-flex items-center gap-2 rounded-button border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50"
              >
                {deletingId === panelDetail.id ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Trash2 size={16} />
                )}
                Delete Paper
              </button>
            </div>
          </div>
        ) : null}
      </SlidePanel>

      {/* ─── Toast ─── */}
      {toast && (
        <div
          className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-card border px-4 py-3 text-sm font-medium shadow-lg animate-in ${
            toast.type === "success"
              ? "border-green-200 bg-green-50 text-green-800"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          <span>{toast.message}</span>
          <button onClick={() => setToast(null)} className="p-0.5 hover:opacity-70">
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}

/* ────────────────────────── Helpers ────────────────────────── */

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

/* ────────────────────── Sub-Components ───────────────────── */

function AnalysisBlock({ title, value }: { title: string; value: string }) {
  if (!value) return null;
  return (
    <section className="rounded-card border border-border-light p-4 bg-white">
      <h2 className="mb-2 text-sm font-semibold text-sidebar">{title}</h2>
      <p className="whitespace-pre-wrap text-sm leading-6 text-gray-700">{value}</p>
    </section>
  );
}

function PanelSection({ title, value }: { title: string; value: string }) {
  if (!value) return null;
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase text-gray-400 mb-1.5">{title}</h3>
      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{value}</p>
    </div>
  );
}

function ListBlock({
  title,
  emptyText,
  icon,
  items,
}: {
  title: string;
  emptyText: string;
  icon?: React.ReactNode;
  items: Array<{ label: string; meta: string; url?: string | null }>;
}) {
  return (
    <section className="rounded-card border border-border-light p-4 bg-white">
      <h2 className="mb-3 text-sm font-semibold text-sidebar flex items-center gap-1.5">
        {icon}
        {title}
        {items.length > 0 && (
          <span className="text-xs font-normal text-gray-400 ml-1">({items.length})</span>
        )}
      </h2>
      {items.length === 0 ? (
        <p className="text-sm text-gray-500">{emptyText}</p>
      ) : (
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li key={`${item.label}-${index}`} className="text-sm">
              <span className="mr-2 rounded bg-gray-100 px-2 py-0.5 text-xs uppercase text-gray-500 font-medium">
                {item.meta}
              </span>
              {item.url ? (
                <a
                  className="break-all text-accent hover:underline"
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                >
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
