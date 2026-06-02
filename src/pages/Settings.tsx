import React, { useState } from "react";
import { Lock, Trash2 } from "lucide-react";

export function Settings() {
  const [settings, setSettings] = useState({
    name: "Sai Kishan",
    email: "sai@research.ai",
    responseStyle: "balanced" as
      | "concise"
      | "detailed"
      | "balanced"
      | "academic",
  });

  return (
    <div className="max-w-2xl space-y-6 sm:space-y-7 md:space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-sidebar mb-4 sm:mb-6">
          Settings
        </h1>
      </div>

      {/* Profile Card */}
      <div className="bg-card border border-border-light rounded-card p-4 sm:p-5 md:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
          <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-full bg-accent flex items-center justify-center text-white text-xl sm:text-2xl font-bold flex-shrink-0">
            S
          </div>
          <div className="flex-1">
            <h3 className="text-lg sm:text-xl font-serif font-bold text-sidebar mb-1">
              Sai Kishan
            </h3>
            <p className="text-sm text-gray-600 mb-3 sm:mb-4">
              sai@research.ai
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-sm">
              <div>
                <p className="text-xs sm:text-sm text-gray-500 mb-1">Papers</p>
                <p className="text-xl sm:text-2xl font-bold text-sidebar">28</p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500 mb-1">Notes</p>
                <p className="text-xl sm:text-2xl font-bold text-sidebar">34</p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500 mb-1">
                  Projects
                </p>
                <p className="text-xl sm:text-2xl font-bold text-sidebar">4</p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500 mb-1">
                  Experiments
                </p>
                <p className="text-xl sm:text-2xl font-bold text-sidebar">11</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Account Settings */}
      <div className="space-y-4">
        <h2 className="text-lg font-serif font-bold text-sidebar border-b border-border-light pb-4">
          Account
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={settings.name}
              onChange={(e) =>
                setSettings({ ...settings, name: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-button text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={settings.email}
              onChange={(e) =>
                setSettings({ ...settings, email: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-button text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 text-accent hover:text-indigo-700 font-medium text-sm">
            <Lock size={16} />
            Change Password
          </button>
        </div>
      </div>

      {/* AI Preferences */}
      <div className="space-y-4">
        <h2 className="text-lg font-serif font-bold text-sidebar border-b border-border-light pb-4">
          AI Preferences
        </h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Response Style
          </label>
          <div className="space-y-2">
            {(["concise", "balanced", "detailed", "academic"] as const).map(
              (style) => (
                <label
                  key={style}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="responseStyle"
                    value={style}
                    checked={settings.responseStyle === style}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        responseStyle: e.target.value as any,
                      })
                    }
                    className="w-4 h-4 text-accent"
                  />
                  <span className="text-sm capitalize">{style}</span>
                </label>
              ),
            )}
          </div>
        </div>
      </div>

      {/* Integrations */}
      <div className="space-y-4">
        <h2 className="text-lg font-serif font-bold text-sidebar border-b border-border-light pb-4">
          Integrations
        </h2>
        <div className="space-y-4">
          {[
            { name: "Zotero", icon: "📚", description: "Citation management" },
            { name: "Google Drive", icon: "☁️", description: "Cloud storage" },
            { name: "GitHub", icon: "🐙", description: "Code repository" },
          ].map((integration) => (
            <div
              key={integration.name}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-card border border-border-light"
            >
              <div className="flex items-center gap-4">
                <span className="text-3xl">{integration.icon}</span>
                <div>
                  <p className="font-medium text-sidebar">{integration.name}</p>
                  <p className="text-xs text-gray-600">
                    {integration.description}
                  </p>
                </div>
              </div>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-button hover:bg-gray-100 transition-colors font-medium text-sm">
                Connect
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="space-y-4">
        <h2 className="text-lg font-serif font-bold text-red-600 border-b border-red-200 pb-4">
          Danger Zone
        </h2>
        <button className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 border border-red-200 rounded-button hover:bg-red-100 transition-colors font-medium">
          <Trash2 size={18} />
          Delete Account
        </button>
      </div>
    </div>
  );
}
