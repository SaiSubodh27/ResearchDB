import React from "react";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  trend?: number;
  trendDirection?: "up" | "down";
  iconColor?: string;
}

export function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  trendDirection = "up",
  iconColor = "bg-accent",
}: StatCardProps) {
  return (
    <div className="bg-card border border-border-light rounded-card p-4 sm:p-5 md:p-6 shadow-soft hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div className={`${iconColor} p-2 sm:p-3 rounded-lg flex-shrink-0`}>
          <Icon size={24} className="text-white" />
        </div>
        {trend !== undefined && (
          <div
            className={`flex items-center gap-1 text-xs font-medium flex-shrink-0 ml-2 ${trendDirection === "up" ? "text-green-600" : "text-red-600"}`}
          >
            {trendDirection === "up" ? (
              <TrendingUp size={16} />
            ) : (
              <TrendingDown size={16} />
            )}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-sidebar mb-1 sm:mb-2 truncate">
        {value}
      </p>
      <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">{label}</p>
    </div>
  );
}
