import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

const pageNames: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/projects": "Projects",
  "/papers": "Research Papers",
  "/notes": "Notes",
  "/resources": "Resources",
  "/experiments": "Experiments",
  "/knowledge-graph": "Knowledge Graph",
  "/ask-ai": "Ask AI",
  "/settings": "Settings",
};

export function Layout() {
  const location = useLocation();
  const title = pageNames[location.pathname] || "ResearchOS";

  return (
    <div className="min-h-screen bg-bg-primary">
      <Sidebar />

      <div className="md:ml-64">
        <TopBar title={title} />

        <main className="pt-20 sm:pt-18 md:pt-16 px-4 sm:px-5 md:px-6 py-4 sm:py-5 md:py-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
