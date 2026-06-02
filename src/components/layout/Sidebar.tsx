import React from "react";
import {
  Atom,
  LayoutDashboard,
  FolderKanban,
  FileText,
  StickyNote,
  Bookmark,
  FlaskConical,
  Network,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: FolderKanban, label: "Projects", path: "/projects" },
  { icon: FileText, label: "Papers", path: "/papers" },
  { icon: StickyNote, label: "Notes", path: "/notes" },
  { icon: Bookmark, label: "Resources", path: "/resources" },
  { icon: FlaskConical, label: "Experiments", path: "/experiments" },
  { icon: Network, label: "Knowledge Graph", path: "/knowledge-graph" },
  { icon: MessageSquare, label: "Ask AI", path: "/ask-ai" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export function Sidebar() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 hover:bg-gray-200 rounded-lg transition-colors touch-none"
      >
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full w-64 bg-sidebar text-white flex flex-col transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } md:translate-x-0 z-40 md:z-30`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 p-4 sm:p-5 md:p-6 border-b border-gray-700">
          <Atom size={28} className="text-accent flex-shrink-0" />
          <span className="text-lg sm:text-xl font-bold text-white truncate">
            ResearchOS
          </span>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-1.5 sm:space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-all duration-200 min-h-[44px] touch-target ${
                  isActive
                    ? "bg-accent text-white shadow-md"
                    : "text-gray-300 hover:bg-gray-700 active:bg-gray-600"
                }`}
              >
                <Icon size={20} className="flex-shrink-0" />
                <span className="text-sm sm:text-base font-medium truncate">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Profile */}
        <div className="p-3 sm:p-4 border-t border-gray-700">
          <div className="flex items-center gap-3 mb-3 sm:mb-4">
            <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              S
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">Sai</p>
              <p className="text-xs text-gray-400 truncate">sai@research.ai</p>
            </div>
          </div>
          <button className="w-full flex items-center gap-2 px-3 sm:px-4 py-2 text-sm text-gray-300 hover:text-red-400 transition-colors duration-200 hover:bg-gray-700/50 rounded-lg min-h-[44px]">
            <LogOut size={16} className="flex-shrink-0" />
            Logout
          </button>
        </div>
      </div>

      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-30 transition-opacity duration-300"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}
