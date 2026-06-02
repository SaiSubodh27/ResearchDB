export type ProjectStatus =
  | "idea"
  | "planning"
  | "in_progress"
  | "completed"
  | "archived";
export type ResourceType =
  | "research_paper"
  | "dataset"
  | "book"
  | "video"
  | "website"
  | "tool";
export type ExperimentStatus = "planning" | "running" | "completed" | "failed";
export type AISummaryStatus = "summarized" | "pending" | "not_started";
export type AnalysisStatus = "completed" | "in_progress" | "failed" | "pending";

export interface Analysis {
  id: string;
  paperId: string;
  status: AnalysisStatus;
  summary?: string;
  keywords?: string[];
  citations?: number;
  datasets?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalPapers: number;
  totalAnalyses: number;
  totalDatasets: number;
  totalCitations: number;
  recentUploads: Paper[];
  analysisTrend: { date: string; count: number }[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  progress: number;
  tags: string[];
  papersCount: number;
  notesCount: number;
  experimentsCount: number;
  updatedAt: string;
  createdAt: string;
}

export interface Paper {
  id: string;
  title: string;
  authors: string[];
  year: number;
  projectId: string;
  tags: string[];
  aiSummaryStatus: AISummaryStatus;
  abstract: string;
  problem?: string;
  dataset?: string;
  aiSummary?: string;
  keyContributions?: string[];
  methodology?: string;
  results?: string;
  limitations?: string;
  uploadedAt?: string;
  analysis?: Analysis;
  citationCount?: number;
  datasetCount?: number;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  projectId: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Resource {
  id: string;
  title: string;
  type: ResourceType;
  link: string;
  projectId: string;
  tags: string[];
  createdAt: string;
}

export interface Experiment {
  id: string;
  name: string;
  projectId: string;
  status: ExperimentStatus;
  objective: string;
  parameters: Record<string, string>;
  observations: string;
  results: string;
  aiAnalysis?: string;
  createdAt: string;
}

export interface ActivityItem {
  id: string;
  type: "upload" | "note" | "experiment" | "project";
  description: string;
  timestamp: string;
}
