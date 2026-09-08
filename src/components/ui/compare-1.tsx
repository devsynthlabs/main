import { Building2, DollarSign, Headphones, List, Zap, CheckCircle2, XCircle, Sparkles, FileSpreadsheet, RefreshCw } from "lucide-react";
import React, { useState } from "react";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ComparisonSolution {
  name: string;
  color: string;
  icon: string | React.ReactNode;
  description: string;
  features: Record<string, string>;
}

interface CompareProps {
  title?: string;
  subtitle?: string;
  solutions?: Record<string, ComparisonSolution>;
  categories?: {
    key: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[];
  primaryKey?: string;
}

const defaultSolutions: Record<string, ComparisonSolution> = {
  AliImam: {
    name: "Ali Imam",
    color: "#6366f1",
    icon: "🌊",
    description:
      "Ali Imam is building the next-gen design platform to streamline creative workflows, from concept to delivery.",
    features: {
      integration:
        "The only platform offering seamless integration with design tools, real-time collaboration, and advanced prototyping features.",
      features:
        "Comprehensive design tools including UI/UX kits, prototyping, asset libraries, and design system management for creative teams.",
      pricing:
        "Flexible pricing tailored to your studio’s needs, based on project scope and team size.",
      support: "Live chat with 7-minute average response time.",
    },
  },
  figma: {
    name: "Figma",
    color: "#F24E1E",
    icon: "F",
    description:
      "Figma is a cloud-based design and prototyping tool focused on collaborative UI/UX design.",
    features: {
      integration:
        "Requires technical setup for advanced integrations. Limited to specific design workflows.",
      features:
        "Strong collaboration features but lacks advanced design system management and asset libraries.",
      pricing:
        "Expensive for larger teams with paid add-ons for essential features.",
      support:
        "Support response times vary, often taking days for complex issues.",
    },
  },
  sketch: {
    name: "Sketch",
    color: "#FF9900",
    icon: "S",
    description:
      "Sketch is a vector-based design tool tailored for UI/UX and interface design.",
    features: {
      integration: "Requires months of setup for complex integrations.",
      features:
        "Feature-rich but rigid, with a dated interface and limited innovation.",
      pricing:
        "High cost based on user licenses, expensive for scaling teams.",
      support: "Slow support response, often requiring premium plans.",
    },
  },
  adobeXd: {
    name: "Adobe XD",
    color: "#470137",
    icon: "XD",
    description:
      "Adobe XD is a design and prototyping tool for enterprise-grade UI/UX projects.",
    features: {
      integration:
        "Requires paid consulting for integration with Adobe ecosystem, often taking months.",
      features:
        "Built for enterprise but rigid and challenging to maintain for dynamic teams.",
      pricing:
        "Premium pricing with high setup fees and mandatory subscriptions.",
      support:
        "Limited support unless on premium plans or consulting sessions.",
    },
  },
  canva: {
    name: "Canva",
    color: "#00C4B4",
    icon: "C",
    description:
      "Canva is a graphic design platform for creating visual content with templates.",
    features: {
      integration: "Limited integration with professional design workflows.",
      features:
        "Template-heavy but lacks advanced UI/UX or prototyping capabilities.",
      pricing: "Expensive for premium features, based on team size.",
      support:
        "Basic support with slow response times for non-premium users.",
    },
  },
  custom: {
    name: "Custom Design Tools",
    color: "#666666",
    icon: "🛠️",
    description:
      "Your in-house design tools are tailored to your specific creative needs but limited by your resources.",
    features: {
      integration:
        "Requires your design team to build and maintain tools from scratch, including workflows and asset management.",
      features:
        "Highly customizable but time-intensive, diverting focus from actual design work.",
      pricing:
        "Seemingly cost-free but requires significant time investment from your team.",
      support: "Self-supported, relying entirely on your team’s expertise.",
    },
  },
};

const defaultCategories = [
  { key: "general", label: "General", icon: Building2 },
  { key: "integration", label: "Integration", icon: Zap },
  { key: "features", label: "Features", icon: List },
  { key: "pricing", label: "Pricing", icon: DollarSign },
  { key: "support", label: "Support", icon: Headphones },
];

const Compare1 = ({
  title,
  subtitle,
  solutions = defaultSolutions,
  categories = defaultCategories,
  primaryKey = Object.keys(solutions)[0],
}: CompareProps) => {
  const initialTab = Object.keys(solutions).find((k) => k !== primaryKey) || Object.keys(solutions)[0];
  const [activeTab, setActiveTab] = useState(initialTab);

  const primarySolution = solutions[primaryKey] || solutions[Object.keys(solutions)[0]];
  const selectableSolutions = Object.entries(solutions).filter(([key]) => key !== primaryKey);

  return (
    <div className="w-full">
      {(title || subtitle) && (
        <div className="mb-10 text-center max-w-3xl mx-auto space-y-3">
          {title && (
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-950">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-sm sm:text-base font-medium text-slate-600 leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {selectableSolutions.length > 1 && (
          <>
            <ScrollArea className="w-full whitespace-nowrap">
              <TabsList className="flex w-max space-x-2 bg-transparent p-1">
                {selectableSolutions.map(([key, solution]) => (
                  <TabsTrigger
                    key={key}
                    value={key}
                    className="data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-indigo-600 border border-slate-200/80 rounded-xl px-4 py-2 flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <div
                      className="flex h-5 w-5 items-center justify-center rounded text-xs font-bold text-white shadow-xs"
                      style={{ backgroundColor: solution.color }}
                    >
                      {solution.icon}
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-slate-800">
                      {solution.name}
                    </span>
                  </TabsTrigger>
                ))}
              </TabsList>
              <ScrollBar className="hidden" orientation="horizontal" />
            </ScrollArea>

            <Separator className="my-6" />
          </>
        )}

        {selectableSolutions.map(([key, solution]) => (
          <TabsContent key={key} value={key} className="mt-0 focus-visible:outline-none">
            <div className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_10px_35px_rgba(0,0,0,0.04)]">
              {/* Comparison Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-950 text-white">
                      <th className="border-r border-slate-800 p-5 sm:p-6 text-xs font-extrabold uppercase tracking-widest min-w-[180px] w-1/4">
                        Aspect / Dimension
                      </th>
                      <th className="min-w-[280px] w-[37.5%] border-r border-slate-800 p-5 sm:p-6 text-center bg-indigo-950/70">
                        <div className="flex items-center justify-center gap-3">
                          {typeof primarySolution.icon === "string" ? (
                            <div className="text-2xl font-bold">{primarySolution.icon}</div>
                          ) : (
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md">
                              {primarySolution.icon}
                            </div>
                          )}
                          <div className="text-left">
                            <div className="text-base sm:text-lg font-bold text-white tracking-tight">
                              {primarySolution.name}
                            </div>
                            <span className="text-[10px] uppercase font-extrabold text-indigo-300 tracking-wider">
                              AI Automated Workflow
                            </span>
                          </div>
                        </div>
                      </th>
                      <th className="min-w-[280px] w-[37.5%] p-5 sm:p-6 text-center bg-slate-900">
                        <div className="flex items-center justify-center gap-3">
                          {typeof solution.icon === "string" ? (
                            <div
                              className="flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold text-white shadow-md"
                              style={{ backgroundColor: solution.color }}
                            >
                              {solution.icon}
                            </div>
                          ) : (
                            <div
                              className="flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-md"
                              style={{ backgroundColor: solution.color }}
                            >
                              {solution.icon}
                            </div>
                          )}
                          <div className="text-left">
                            <div className="text-base sm:text-lg font-bold text-white tracking-tight">
                              {solution.name}
                            </div>
                            <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">
                              Traditional Approach
                            </span>
                          </div>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((category, index) => {
                      const Icon = category.icon;
                      const isLast = index === categories.length - 1;

                      return (
                        <tr
                          key={category.key}
                          className={`${!isLast ? "border-b border-slate-100" : ""} hover:bg-slate-50/50 transition-colors`}
                        >
                          <td className="bg-slate-50/70 border-r border-slate-100 p-5 sm:p-6">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 flex-shrink-0 shadow-2xs">
                                <Icon className="h-4 w-4" />
                              </div>
                              <span className="font-bold text-xs sm:text-sm text-slate-900">
                                {category.label}
                              </span>
                            </div>
                          </td>
                          <td className="border-r border-slate-100 p-5 sm:p-6 text-left bg-indigo-50/20">
                            <div className="text-xs sm:text-sm font-medium text-slate-800 leading-relaxed flex items-start gap-2.5">
                              <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                              <span>
                                {category.key === "general"
                                  ? primarySolution.description
                                  : primarySolution.features[category.key]}
                              </span>
                            </div>
                          </td>
                          <td className="p-5 sm:p-6 text-left bg-slate-50/30">
                            <div className="text-xs sm:text-sm font-medium text-slate-600 leading-relaxed flex items-start gap-2.5">
                              <XCircle className="h-4 w-4 text-slate-400 flex-shrink-0 mt-0.5" />
                              <span>
                                {category.key === "general"
                                  ? solution.description
                                  : solution.features[category.key]}
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export { Compare1 };
export default Compare1;
