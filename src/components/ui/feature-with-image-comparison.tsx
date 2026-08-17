import { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  TrendingUp,
  Sparkles,
  History,
  Layers,
  Clock,
  Sliders,
  CheckCircle2,
} from "lucide-react";

export interface ComparisonDimension {
  title: string;
  statement: {
    badge: string;
    summary: string;
    detail: string;
  };
  forecast: {
    badge: string;
    summary: string;
    detail: string;
  };
}

const COMPARISON_DIMENSIONS: ComparisonDimension[] = [
  {
    title: "Focus",
    statement: {
      badge: "Recorded Activity",
      summary: "Reviews recorded activity",
      detail: "Summary of completed and finalized cash transactions across bank accounts and ledgers.",
    },
    forecast: {
      badge: "AI Projections",
      summary: "Estimates future cash position",
      detail: "Forward-looking models estimating future cash balances using category-wise ledger records.",
    },
  },
  {
    title: "Time Orientation",
    statement: {
      badge: "Retrospective",
      summary: "Focuses on what happened",
      detail: "Reflects past financial performance, completed payment cycles, and settled invoices.",
    },
    forecast: {
      badge: "Forward-Looking",
      summary: "Focuses on what may happen",
      detail: "Predictive timeline spanning upcoming weeks, months, or up to one full year ahead.",
    },
  },
  {
    title: "Purpose",
    statement: {
      badge: "Compliance & Audit",
      summary: "Supports financial reporting",
      detail: "Used for statutory tax filing, stakeholder reporting, and official accounting audits.",
    },
    forecast: {
      badge: "Strategic Planning",
      summary: "Supports financial planning",
      detail: "Helps identify upcoming cash pressure, plan major expenditures, and optimize working capital.",
    },
  },
  {
    title: "Data Type",
    statement: {
      badge: "Static Entries",
      summary: "Historical/current information",
      detail: "Static snapshots of confirmed records stored in verified general accounting books.",
    },
    forecast: {
      badge: "Live Predictive",
      summary: "Forward-looking information",
      detail: "Continuously recalculates predictions in real time as new transactions and invoices occur.",
    },
  },
];

const TIME_POINTS = [
  { label: "Past Records", period: "-6 Months", desc: "Historical audited financial statements" },
  { label: "Current Books", period: "Today", desc: "Live balance & verified ledger records" },
  { label: "3-Month Outlook", period: "+3 Months", desc: "Short-term operating cash runway" },
  { label: "6-Month Outlook", period: "+6 Months", desc: "Mid-term expenditure & working capital" },
  { label: "1-Year Projection", period: "+12 Months", desc: "Long-range strategic financial planning" },
];

export function Feature({
  badge = "COMPARISON",
  title = "Cash Flow Forecast vs Cash Flow Statement",
  description = "A cash flow statement and a cash flow forecast provide different types of financial visibility.",
  leftTitle = "Cash Flow Statement",
  leftSubtitle = "Verified Bookkeeping & Audited Records",
  rightTitle = "Cash Flow Forecast",
  rightSubtitle = "Category-wise Projections • Up to 1 Year",
  className,
}: {
  badge?: string;
  title?: string;
  description?: string;
  leftTitle?: string;
  leftSubtitle?: string;
  rightTitle?: string;
  rightSubtitle?: string;
  className?: string;
}) {
  const [activeTab, setActiveTab] = useState<"compare" | "statement" | "forecast">("compare");
  const [selectedTimeIdx, setSelectedTimeIdx] = useState<number>(1);
  const [hoveredDimension, setHoveredDimension] = useState<number | null>(null);

  const selectedTime = TIME_POINTS[selectedTimeIdx];
  const isStatementHighlighted = selectedTimeIdx <= 1;
  const isForecastHighlighted = selectedTimeIdx >= 1;

  return (
    <div className={`w-full py-4 ${className || ""}`}>
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          {badge && (
            <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-widest block">
              {badge}
            </span>
          )}
          {title && (
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-950">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-sm sm:text-base font-medium text-slate-600 leading-relaxed max-w-2xl mx-auto">
              {description}
            </p>
          )}
        </div>

        {/* Interactive Mode & Timeline Scrubber */}
        <div className="bg-white rounded-[28px] border border-slate-200/90 p-5 sm:p-7 shadow-[0_10px_35px_rgba(0,0,0,0.04)] space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="h-3.5 w-3.5 text-indigo-600" /> View Mode:
              </span>
            </div>

            {/* Mode Switcher */}
            <div className="flex items-center bg-slate-100/90 p-1 rounded-2xl border border-slate-200/80">
              <button
                type="button"
                onClick={() => setActiveTab("compare")}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === "compare"
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-slate-700 hover:text-slate-950"
                }`}
              >
                <Layers className="h-3.5 w-3.5" /> Side-by-Side
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("statement")}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === "statement"
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-700 hover:text-slate-950"
                }`}
              >
                <History className="h-3.5 w-3.5" /> Statement Only
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("forecast")}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === "forecast"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-700 hover:text-slate-950"
                }`}
              >
                <Sparkles className="h-3.5 w-3.5" /> Forecast Only
              </button>
            </div>
          </div>

          {/* Time Scrubber */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-700 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-indigo-600" /> Interactive Timeline Horizon:
              </span>
              <span className="text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200 font-extrabold">
                {selectedTime.period} • {selectedTime.label}
              </span>
            </div>

            {/* Slider track buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {TIME_POINTS.map((tp, idx) => {
                const isSelected = selectedTimeIdx === idx;
                const isPast = idx === 0;
                const isPresent = idx === 1;

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedTimeIdx(idx)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                      isSelected
                        ? isPast
                          ? "bg-slate-950 text-white border-slate-950 shadow-md ring-2 ring-slate-900/30"
                          : isPresent
                          ? "bg-indigo-950 text-white border-indigo-950 shadow-md ring-2 ring-indigo-900/30"
                          : "bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-500/30"
                        : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-800"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`text-[10px] font-extrabold uppercase tracking-wider ${
                          isSelected ? "text-indigo-200" : "text-slate-500"
                        }`}
                      >
                        {tp.period}
                      </span>
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      )}
                    </div>
                    <p className="text-xs font-bold leading-tight line-clamp-1">{tp.label}</p>
                  </button>
                );
              })}
            </div>
            <p className="text-xs font-semibold text-slate-600 italic text-center pt-1">
              {selectedTime.desc}
            </p>
          </div>
        </div>

        {/* Comparison Boards - Always Rich, High-Contrast & Clearly Visible */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* Card 1: Cash Flow Statement */}
          {(activeTab === "compare" || activeTab === "statement") && (
            <motion.div
              layout
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              transition={{ duration: 0.3 }}
              className={`rounded-[28px] border transition-all p-6 sm:p-8 flex flex-col justify-between bg-slate-950 text-white border-slate-800 ${
                activeTab === "statement" ? "lg:col-span-2" : ""
              } ${
                isStatementHighlighted
                  ? "ring-2 ring-slate-400 shadow-[0_15px_40px_rgba(0,0,0,0.25)]"
                  : "opacity-85 shadow-md"
              }`}
            >
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-5">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-slate-800 text-white flex items-center justify-center shadow-md border border-slate-700">
                      <FileText className="h-6 w-6 text-slate-200" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold text-white tracking-tight">
                          {leftTitle}
                        </h3>
                        <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-200 border border-slate-700">
                          Historical
                        </span>
                      </div>
                      {leftSubtitle && (
                        <p className="text-xs font-semibold text-slate-400 mt-0.5">
                          {leftSubtitle}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* 4 Dimension Breakdown */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {COMPARISON_DIMENSIONS.map((dim, idx) => {
                    const isHovered = hoveredDimension === idx;
                    return (
                      <div
                        key={idx}
                        onMouseEnter={() => setHoveredDimension(idx)}
                        onMouseLeave={() => setHoveredDimension(null)}
                        className={`p-4 rounded-2xl border transition-all ${
                          isHovered
                            ? "bg-slate-800 border-slate-600 ring-1 ring-white/20"
                            : "bg-slate-900/90 border-slate-800"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                            {dim.title}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-800 text-slate-200 border border-slate-700">
                            {dim.statement.badge}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white leading-snug mb-1.5">
                          {dim.statement.summary}
                        </h4>
                        <p className="text-xs font-medium text-slate-300 leading-relaxed">
                          {dim.statement.detail}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-5 mt-6 border-t border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-400">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Confirmed General Ledger Entries
                </span>
                <span className="font-bold text-slate-300">Past Activity</span>
              </div>
            </motion.div>
          )}

          {/* Card 2: Cash Flow Forecast */}
          {(activeTab === "compare" || activeTab === "forecast") && (
            <motion.div
              layout
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              transition={{ duration: 0.3 }}
              className={`rounded-[28px] border transition-all p-6 sm:p-8 flex flex-col justify-between bg-gradient-to-br from-[#0c0e27] via-[#12163b] to-[#1e1b4b] text-white border-indigo-500/40 ${
                activeTab === "forecast" ? "lg:col-span-2" : ""
              } ${
                isForecastHighlighted
                  ? "ring-2 ring-indigo-400 shadow-[0_15px_40px_rgba(79,70,229,0.25)]"
                  : "opacity-85 shadow-md"
              }`}
            >
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-indigo-900/60 pb-5">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/40 border border-indigo-400/40">
                      <TrendingUp className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold text-white tracking-tight">
                          {rightTitle}
                        </h3>
                        <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-indigo-500/40 text-indigo-100 border border-indigo-400/50 shadow-xs">
                          AI Predictive
                        </span>
                      </div>
                      {rightSubtitle && (
                        <p className="text-xs font-semibold text-indigo-200 mt-0.5">
                          {rightSubtitle}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* 4 Dimension Breakdown */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {COMPARISON_DIMENSIONS.map((dim, idx) => {
                    const isHovered = hoveredDimension === idx;
                    return (
                      <div
                        key={idx}
                        onMouseEnter={() => setHoveredDimension(idx)}
                        onMouseLeave={() => setHoveredDimension(null)}
                        className={`p-4 rounded-2xl border transition-all ${
                          isHovered
                            ? "bg-indigo-900/80 border-indigo-400/70 ring-1 ring-indigo-300/30 shadow-md"
                            : "bg-indigo-950/70 border-indigo-800/60"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-300">
                            {dim.title}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-600/50 text-indigo-100 border border-indigo-400/50">
                            {dim.forecast.badge}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white leading-snug mb-1.5">
                          {dim.forecast.summary}
                        </h4>
                        <p className="text-xs font-medium text-slate-200 leading-relaxed">
                          {dim.forecast.detail}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-5 mt-6 border-t border-indigo-900/60 flex items-center justify-between text-xs font-semibold text-indigo-200">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-indigo-400" /> Continuous Real-time AI Updates
                </span>
                <span className="font-bold text-white">Next 12 Months</span>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Feature;
