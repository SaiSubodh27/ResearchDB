import { Analysis, DashboardStats, Paper } from "../types";

export const mockAnalyses: Analysis[] = [
  {
    id: "a1",
    paperId: "1",
    status: "completed",
    summary:
      "Physics-informed ML model for ionic conductivity with dual-output Arrhenius prediction achieving R²=0.94",
    keywords: [
      "machine learning",
      "ionic conductivity",
      "neural networks",
      "solid electrolytes",
      "physics-informed",
    ],
    citations: 47,
    datasets: ["OBLiEx", "Magpie Features"],
    createdAt: "2024-01-14",
    updatedAt: "2024-01-14",
  },
  {
    id: "a2",
    paperId: "2",
    status: "completed",
    summary:
      "Comprehensive review of 200+ NASICON compositions with structure-conductivity analysis and benchmark identification",
    keywords: [
      "NASICON",
      "solid electrolytes",
      "ionic transport",
      "structure-property",
      "review",
    ],
    citations: 32,
    datasets: ["NASICON Compositions", "Conductivity Database"],
    createdAt: "2024-01-12",
    updatedAt: "2024-01-12",
  },
  {
    id: "a3",
    paperId: "3",
    status: "in_progress",
    summary:
      "Analysis of garnet-type Li7La3Zr2O12 processing and electrochemical properties pending...",
    keywords: [],
    citations: 0,
    datasets: [],
    createdAt: "2024-01-13",
    updatedAt: "2024-01-13",
  },
];

export const generateDashboardStats = (
  papers: Paper[],
  analyses: Analysis[],
): DashboardStats => {
  const completedAnalyses = analyses.filter((a) => a.status === "completed");
  const totalDatasets = new Set(
    completedAnalyses.flatMap((a) => a.datasets || []),
  ).size;
  const totalCitations = completedAnalyses.reduce(
    (sum, a) => sum + (a.citations || 0),
    0,
  );

  // Sort papers by upload date (mock: use id for now)
  const recentUploads = [...papers].slice(-5).reverse();

  // Generate analysis trend for last 7 days
  const analysisTrend = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dayAnalyses = completedAnalyses.filter(
      (a) => new Date(a.createdAt).toDateString() === date.toDateString(),
    ).length;
    return {
      date: date.toISOString().split("T")[0],
      count: dayAnalyses,
    };
  });

  return {
    totalPapers: papers.length,
    totalAnalyses: completedAnalyses.length,
    totalDatasets,
    totalCitations,
    recentUploads,
    analysisTrend,
  };
};
