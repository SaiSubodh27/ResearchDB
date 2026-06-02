import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { Dashboard } from "./pages/Dashboard";
import { Projects } from "./pages/Projects";
import { Papers } from "./pages/Papers";
import { Notes } from "./pages/Notes";
import { Resources } from "./pages/Resources";
import { Experiments } from "./pages/Experiments";
import { KnowledgeGraph } from "./pages/KnowledgeGraph";
import { AskAI } from "./pages/AskAI";
import { Settings } from "./pages/Settings";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="projects" element={<Projects />} />
          <Route path="papers" element={<Papers />} />
          <Route path="notes" element={<Notes />} />
          <Route path="resources" element={<Resources />} />
          <Route path="experiments" element={<Experiments />} />
          <Route path="knowledge-graph" element={<KnowledgeGraph />} />
          <Route path="ask-ai" element={<AskAI />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
