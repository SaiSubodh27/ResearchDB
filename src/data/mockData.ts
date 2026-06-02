import {
  Project,
  Paper,
  Note,
  Resource,
  Experiment,
  ActivityItem,
} from "../types";
import { mockAnalyses } from "./mockAnalyses";

export const mockProjects: Project[] = [
  {
    id: "1",
    title: "IonCast",
    description:
      "ML system for predicting ionic conductivity from CIF files using Arrhenius physics-constrained dual-predictor.",
    status: "in_progress",
    progress: 72,
    tags: ["ML", "SSE", "IonCast", "Ionic Conductivity"],
    papersCount: 8,
    notesCount: 14,
    experimentsCount: 5,
    updatedAt: "2024-01-15",
    createdAt: "2023-09-01",
  },
  {
    id: "2",
    title: "HES Framework",
    description:
      "Holistic Electrolyte Score framework with 321-material dataset and four scoring pillars.",
    status: "in_progress",
    progress: 58,
    tags: ["HES", "DRF", "Scoring", "Materials"],
    papersCount: 5,
    notesCount: 9,
    experimentsCount: 3,
    updatedAt: "2024-01-12",
    createdAt: "2023-10-15",
  },
  {
    id: "3",
    title: "SSE Screening Pipeline",
    description:
      "High-throughput screening of Li-ion solid-state electrolyte candidates from Materials Project.",
    status: "completed",
    progress: 100,
    tags: ["Screening", "Li-ion", "Materials Project"],
    papersCount: 12,
    notesCount: 20,
    experimentsCount: 8,
    updatedAt: "2023-12-20",
    createdAt: "2023-06-01",
  },
  {
    id: "4",
    title: "VGNN Architecture",
    description:
      "Self-supervised phonon feature extraction outputting Ea*, ν₀*, ZPE* scalars with physics-informed loss.",
    status: "planning",
    progress: 20,
    tags: ["GNN", "Phonon", "Self-supervised"],
    papersCount: 3,
    notesCount: 5,
    experimentsCount: 1,
    updatedAt: "2024-01-10",
    createdAt: "2024-01-01",
  },
];

export const mockPapers: Paper[] = [
  {
    id: "1",
    title:
      "Physics-Informed Machine Learning for Ionic Conductivity Prediction in Solid Electrolytes",
    authors: ["Zhang, W.", "Liu, H.", "Chen, X."],
    year: 2023,
    projectId: "1",
    tags: ["ML", "Ionic Conductivity", "SSE"],
    aiSummaryStatus: "summarized",
    abstract:
      "We present a physics-informed ML framework for predicting ionic conductivity in solid electrolytes using Arrhenius-constrained neural networks...",
    problem: "Predicting ionic conductivity from crystal structures",
    dataset: "OBLiEx",
    aiSummary:
      "This paper presents a dual-output ML model predicting activation energy (Ea) and pre-exponential factor (A) simultaneously, constrained by Arrhenius physics. Achieves R²=0.94 on the OBLiEx benchmark dataset.",
    keyContributions: [
      "Arrhenius-constrained dual predictor",
      "OBLiEx benchmark evaluation",
      "Feature importance analysis for structural descriptors",
    ],
    methodology:
      "Ensemble of LightGBM and XGBoost trained on 343 Magpie features extracted from CIF files.",
    results: "R²=0.9387, MAE=0.4843 across 292 OBLiEx materials.",
    limitations:
      "Limited to crystalline materials, does not account for grain boundary effects.",
    uploadedAt: "2024-01-14",
    analysis: mockAnalyses[0],
    citationCount: 47,
    datasetCount: 1,
  },
  {
    id: "2",
    title: "NASICON-Type Solid Electrolytes: A Comprehensive Review",
    authors: ["Park, S.", "Kim, J."],
    year: 2022,
    projectId: "1",
    tags: ["NASICON", "Review", "SSE"],
    aiSummaryStatus: "summarized",
    abstract:
      "A comprehensive review of NASICON-type solid electrolytes covering synthesis, ionic transport mechanisms...",
    problem:
      "Understanding structure-conductivity relationships in NASICON materials",
    dataset: "NASICON Database",
    aiSummary:
      "Reviews 200+ NASICON compositions, identifies key structural features driving high conductivity. Highlights Li1.3Al0.3Ti1.7(PO4)3 as benchmark with σ=7×10⁻⁴ S/cm at room temperature.",
    keyContributions: [
      "Systematic comparison of 200+ compositions",
      "Structure-conductivity correlation analysis",
    ],
    methodology:
      "Literature review with meta-analysis of experimental conductivity data.",
    results:
      "Identifies bottleneck ion migration pathways in NASICON framework.",
    limitations: "Primarily focused on room-temperature measurements.",
    uploadedAt: "2024-01-12",
    analysis: mockAnalyses[1],
    citationCount: 32,
    datasetCount: 2,
  },
  {
    id: "3",
    title:
      "Garnet-Type Li7La3Zr2O12: Processing and Electrochemical Properties",
    authors: ["Murugan, R.", "Thangadurai, V."],
    year: 2021,
    projectId: "1",
    tags: ["Garnet", "LLZO", "Li-ion"],
    aiSummaryStatus: "pending",
    abstract:
      "We report the synthesis and characterization of garnet-type Li7La3Zr2O12 solid electrolyte...",
    uploadedAt: "2024-01-13",
    analysis: mockAnalyses[2],
    citationCount: 0,
    datasetCount: 0,
  },
  {
    id: "4",
    title: "Graph Neural Networks for Materials Property Prediction",
    authors: ["Chen, C.", "Ong, S.P."],
    year: 2022,
    projectId: "4",
    tags: ["GNN", "Materials", "Deep Learning"],
    aiSummaryStatus: "not_started",
    abstract:
      "We develop a graph neural network architecture for predicting materials properties from crystal structures...",
    uploadedAt: "2024-01-10",
    citationCount: 0,
    datasetCount: 0,
  },
];

export const mockNotes: Note[] = [
  {
    id: "1",
    title: "IonCast Model Architecture Notes",
    content: `## Overview\nIonCast uses a physics-constrained dual-predictor architecture.\n\n## Key Design Decisions\n- **Dual output**: Predicts Ea and log₁₀(A) simultaneously\n- **Physics constraint**: Arrhenius equation enforced in loss function\n- **Features**: 343 Magpie structural features from CIF files\n\n## Performance\n- R² = 0.9387\n- MAE = 0.4843 log₁₀(S/cm)\n- Evaluated on 292 OBLiEx materials\n\n## Next Steps\n- Integrate VGNN backend\n- Add uncertainty quantification`,
    projectId: "1",
    tags: ["IonCast", "Architecture", "ML"],
    createdAt: "2024-01-10",
    updatedAt: "2024-01-15",
  },
  {
    id: "2",
    title: "HES Framework — Pillar Definitions",
    content: `## Four Scoring Pillars\n1. **Kinetics** — Activation energy from Arrhenius fit\n2. **Transport** — Room temperature conductivity\n3. **Stability** — Electrochemical window\n4. **Robustness** — Mechanical and thermal stability\n\n## Known Issues\n- Score collapse due to multiplicative architecture\n- Remedies: geometric mean normalization`,
    projectId: "2",
    tags: ["HES", "Framework", "Scoring"],
    createdAt: "2024-01-08",
    updatedAt: "2024-01-12",
  },
  {
    id: "3",
    title: "OBLiEx Dataset Validation Notes",
    content: `## Critical Issues Found\n- Rank column mislabeling\n- ~44% materials missing experimental conductivity\n- Duplicate formula entries with conflicting σ values\n\n## Resolution\n- Cross-referenced with Liverpool Li-ion database\n- Removed duplicates with lower confidence scores`,
    projectId: "1",
    tags: ["Dataset", "Validation", "OBLiEx"],
    createdAt: "2024-01-05",
    updatedAt: "2024-01-05",
  },
];

export const mockResources: Resource[] = [
  {
    id: "1",
    title: "Materials Project Database",
    type: "dataset",
    link: "https://materialsproject.org",
    projectId: "3",
    tags: ["Dataset", "DFT", "Materials"],
    createdAt: "2023-09-15",
  },
  {
    id: "2",
    title: "Pymatgen Documentation",
    type: "website",
    link: "https://pymatgen.org",
    projectId: "1",
    tags: ["Library", "Python", "Materials"],
    createdAt: "2023-09-20",
  },
  {
    id: "3",
    title: "Crystal Graph Convolutional Neural Networks",
    type: "research_paper",
    link: "https://arxiv.org/abs/1710.10324",
    projectId: "4",
    tags: ["GNN", "Crystal", "ML"],
    createdAt: "2023-11-01",
  },
  {
    id: "4",
    title: "Solid State Ionics — Elsevier Journal",
    type: "website",
    link: "https://www.sciencedirect.com/journal/solid-state-ionics",
    projectId: "1",
    tags: ["Journal", "SSE", "Reference"],
    createdAt: "2023-10-05",
  },
];

export const mockExperiments: Experiment[] = [
  {
    id: "1",
    name: "Surrogate Model v5 — OBLiEx Benchmark",
    projectId: "1",
    status: "completed",
    objective:
      "Evaluate surrogate model performance on full OBLiEx dataset using ensemble of LightGBM, XGBoost, CatBoost.",
    parameters: {
      n_estimators: "500",
      learning_rate: "0.05",
      max_depth: "6",
      features: "343 Magpie",
      train_split: "80/20",
      random_seed: "42",
    },
    observations:
      "CatBoost slightly outperforms LightGBM on activation energy prediction. Feature importance shows lattice parameters dominate.",
    results:
      "R²=0.9387, MAE=0.4843 log₁₀(S/cm). Ensemble outperforms any single model by ~8%.",
    aiAnalysis:
      "Strong performance consistency across NASICON, Garnet, and Perovskite subtypes. Recommend further tuning on Perovskite subset which shows slightly higher error (MAE=0.61).",
    createdAt: "2024-01-08",
  },
  {
    id: "2",
    name: "HES Score Collapse Investigation",
    projectId: "2",
    status: "completed",
    objective:
      "Diagnose why HES scores collapse to near-zero for majority of materials.",
    parameters: {
      architecture: "multiplicative pillars",
      penalty: "exponential",
      dataset_size: "321 materials",
    },
    observations:
      "Multiplicative architecture with exponential penalties causes score collapse. Even one low pillar score drives total to ~0.",
    results:
      "Geometric mean normalization resolves collapse. Score distribution improved from 82% near-zero to uniform distribution.",
    aiAnalysis:
      "Root cause confirmed as multiplicative aggregation. Geometric mean is theoretically sound as it treats pillars as independent factors rather than sequential gates.",
    createdAt: "2024-01-03",
  },
  {
    id: "3",
    name: "VGNN Phonon Feature Extraction — Pilot",
    projectId: "4",
    status: "running",
    objective:
      "Test VGNN architecture for extracting phonon features (Ea*, ν₀*, ZPE*, θD*) from crystal graph representations.",
    parameters: {
      graph_cutoff: "5.0 Å",
      hidden_dim: "128",
      n_layers: "4",
      batch_size: "32",
    },
    observations:
      "Training loss converging but slower than expected. Physics-informed loss constraints adding ~40% training time.",
    results:
      "Preliminary: Ea* correlation r=0.71 on validation set. Needs more epochs.",
    createdAt: "2024-01-12",
  },
];

export const mockActivity: ActivityItem[] = [
  {
    id: "1",
    type: "upload",
    description: 'Uploaded "NASICON Review 2023.pdf" to IonCast',
    timestamp: "2 hours ago",
  },
  {
    id: "2",
    type: "note",
    description: 'Updated "IonCast Model Architecture Notes"',
    timestamp: "5 hours ago",
  },
  {
    id: "3",
    type: "experiment",
    description: 'Logged results for "Surrogate Model v5"',
    timestamp: "1 day ago",
  },
  {
    id: "4",
    type: "project",
    description: 'Created project "VGNN Architecture"',
    timestamp: "2 days ago",
  },
  {
    id: "5",
    type: "upload",
    description: 'Uploaded "Garnet LLZO Paper.pdf" to IonCast',
    timestamp: "3 days ago",
  },
];

export const aiInsights = [
  'Papers "NASICON Review" and "Garnet LLZO" share methodology — consider a comparative note',
  "Experiment #3 (VGNN Pilot) has been running for 3 days with no logged observations",
  "IonCast project has 3 untagged resources — add tags for better searchability",
];
