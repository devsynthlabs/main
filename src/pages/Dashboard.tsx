import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BanknoteIcon,
  BarChart3,
  Building2,
  Calculator,
  ChevronDown,
  FileSpreadsheet,
  FileText,
  FolderArchive,
  LogOut,
  Package,
  PanelLeft,
  PanelRight,
  Search,
  Settings,
  Shield,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { API_ENDPOINTS } from "@/lib/api";
import { isTrialExpired } from "@/lib/trial";

type UserProfile = {
  id: string;
  email: string;
  name?: string;
  subscriptionStatus?: "pending" | "active";
  subscriptionPlan?: "trial" | "monthly" | "annual" | "lifetime";
  subscriptionAmount?: number;
  subscriptionStartDate?: string;
  subscriptionEndDate?: string;
  trialEndDate?: string;
};

type DashboardModule = {
  title: string;
  description: string;
  output: string;
  icon: typeof Users;
  path: string;
};

const dashboardModules: DashboardModule[] = [
  { title: "Payroll Automation", description: "Manage employee salaries, deductions, and salary slips.", output: "", icon: Users, path: "/payroll" },
  { title: "Tax & GST Management", description: "Calculate and manage GST, CGST, SGST, and IGST.", output: "", icon: FileText, path: "/tax-gst" },
  { title: "Balance Sheet", description: "Generate balance sheets with assets, liabilities, and equity.", output: "", icon: BarChart3, path: "/balance-sheet" },
  { title: "Profit & Loss Statement", description: "Create P&L statements with income and expense analysis.", output: "", icon: TrendingUp, path: "/profit-loss" },
  { title: "Cash Flow Prediction", description: "AI-powered forecasting for next 6 months.", output: "", icon: FileSpreadsheet, path: "/cashflow" },
  { title: "Cash Flow Statement", description: "Trace inflows, outflows, and net movement.", output: "", icon: BarChart3, path: "/cashflow-statement" },
  { title: "Financial Ratios", description: "Calculate liquidity, profitability, and solvency metrics.", output: "", icon: Calculator, path: "/financial-ratios" },
  { title: "Bookkeeping", description: "Record income, expenses, and categorized entries.", output: "", icon: FileText, path: "/bookkeeping" },
  { title: "Inventory Management", description: "Track inventory with automated reorder alerts.", output: "", icon: Package, path: "/inventory" },
  { title: "Bank Reconciliation", description: "Match ledger entries with bank statements.", output: "", icon: BanknoteIcon, path: "/bank-reconciliation" },
  { title: "Fraud Detection", description: "Detect and prevent fraudulent transactions.", output: "", icon: Shield, path: "/fraud-detection" },
  { title: "Civil Engineering", description: "Plan schedules, structures, and project delivery.", output: "", icon: Building2, path: "/civil-engineering" },
  { title: "Invoice Automation", description: "OCR scanning, voice input, and smart processing.", output: "", icon: FolderArchive, path: "/invoice" },
];

type Mode = "assistant" | "automation";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [mode, setMode] = useState<Mode>("assistant");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth");
      return;
    }

    fetch(API_ENDPOINTS.USER, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch user");
        return res.json();
      })
      .then((data: UserProfile) => {
        setUser(data);
        if (data.subscriptionStatus !== "active" || isTrialExpired(data)) {
          toast({
            variant: "destructive",
            title: "Free trial ended",
            description: "Your trial is over. Please choose a paid plan to continue.",
          });
          localStorage.removeItem("token");
          navigate("/auth?tab=signup&plan=monthly");
        }
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
        localStorage.removeItem("token");
        navigate("/auth");
      })
      .finally(() => setLoading(false));
  }, [navigate, toast]);

  useEffect(() => {
    if (!user) return;

    const timer = window.setInterval(() => {
      if (isTrialExpired(user)) {
        toast({
          variant: "destructive",
          title: "Free trial ended",
          description: "Your trial session has expired. Please choose a paid plan to continue.",
        });
        localStorage.removeItem("token");
        navigate("/auth?tab=signup&plan=monthly");
      }
    }, 60000);

    return () => window.clearInterval(timer);
  }, [navigate, toast, user]);

  const profileName = useMemo(() => {
    if (!user?.email) return "User";
    return user.name?.trim() || user.email.split("@")[0];
  }, [user]);

  const selectedPlanLabel = user?.subscriptionPlan
    ? { trial: "Trial", monthly: "Monthly", annual: "Annual", lifetime: "Lifetime" }[user.subscriptionPlan]
    : "Pending";

  const profileInitial = profileName.charAt(0).toUpperCase();

  const handleSignOut = () => {
    localStorage.removeItem("token");
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    });
    navigate("/auth");
  };

  const handleSubmit = () => {
    if (!inputValue.trim()) return;
    toast({
      title: mode === "assistant" ? "AI Assistant ready" : "Automation ready",
      description: inputValue.trim(),
    });
    setInputValue("");
  };

  const sidebarWidth = sidebarOpen ? "xl:w-[320px]" : "xl:w-[88px]";

  return (
    <div className="dashboard-light min-h-screen overflow-hidden text-slate-900">
      {mobileSidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm xl:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1900px] items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setSidebarOpen((open) => !open)}
              className="hidden h-10 w-10 rounded-full border border-slate-200 bg-white p-0 text-slate-600 shadow-sm hover:bg-slate-50 hover:text-slate-900 xl:flex"
              aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              {sidebarOpen ? <PanelLeft className="h-4 w-4" /> : <PanelRight className="h-4 w-4" />}
            </Button>

            <Button
              type="button"
              variant="ghost"
              onClick={() => setMobileSidebarOpen(true)}
              className="flex h-10 w-10 rounded-full border border-slate-200 bg-white p-0 text-slate-600 shadow-sm hover:bg-slate-50 hover:text-slate-900 xl:hidden"
              aria-label="Open sidebar"
            >
              <PanelLeft className="h-4 w-4" />
            </Button>

            <div className="flex min-w-0 items-center gap-3">
              <div className="dashboard-light-logo flex h-10 w-10 items-center justify-center rounded-[14px]">
                <Building2 className="h-5 w-5 text-slate-700" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="truncate text-lg font-semibold tracking-tight text-slate-900">SHREE ANDAL AI</h1>
                  <ChevronDown className="h-4 w-4 text-slate-500" />
                </div>
                <p className="truncate text-xs text-slate-500">SHREE ANDAL AI SOFTWARE SOLUTIONS</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/profile")}
              className="hidden h-10 rounded-full border-slate-200 bg-white px-4 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 sm:flex"
            >
              <Settings className="mr-2 h-4 w-4" />
              Profile
            </Button>
            <Button
              variant="outline"
              onClick={handleSignOut}
              className="h-10 w-10 rounded-full border-slate-200 bg-white p-0 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              aria-label="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-[1900px] grid-cols-1 xl:flex">
        <aside
          className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-slate-200 bg-white transition-all duration-300 xl:sticky xl:top-[57px] xl:h-[calc(100vh-57px)] xl:shrink-0 xl:translate-x-0 ${
            mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } ${sidebarWidth}`}
        >
          <div className="border-b border-slate-200 p-3">
            <Button
              type="button"
              className="dashboard-light-newchat flex h-12 w-full items-center justify-start gap-3 rounded-[18px] px-4 text-left text-slate-900 hover:bg-slate-100"
            >
              <Sparkles className="h-5 w-5" />
              {sidebarOpen && <span className="text-sm font-medium">New chat</span>}
            </Button>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-3">
              <p className={`px-2 text-sm font-semibold text-slate-900 ${sidebarOpen ? "block" : "hidden xl:block"}`}>Modules</p>
              <div className="mt-2 space-y-1">
                {dashboardModules.map((module) => {
                  const Icon = module.icon;
                  return (
                    <button
                      key={module.path}
                      type="button"
                      onClick={() => {
                        navigate(module.path);
                        setMobileSidebarOpen(false);
                      }}
                      className="dashboard-light-module group flex w-full items-start gap-3 rounded-[20px] border border-transparent px-3 py-3 text-left transition-all duration-300 hover:border-slate-200 hover:bg-white hover:shadow-[0_10px_30px_rgba(15,23,42,0.05)]"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[14px] bg-slate-900 text-white shadow-[0_10px_24px_rgba(15,23,42,0.12)] transition-transform duration-300 group-hover:scale-105">
                        <Icon className="h-4 w-4" />
                      </div>
                      {sidebarOpen && (
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="truncate text-[15px] font-medium text-slate-800">{module.title}</p>
                              <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">{module.description}</p>
                            </div>
                            <span className="mt-0.5 shrink-0 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                              {module.output}
                            </span>
                          </div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </ScrollArea>

          <div className="border-t border-slate-200 p-3">
            <Button
              type="button"
              onClick={() => navigate("/profile")}
              className="dashboard-light-profile flex h-auto w-full items-center gap-3 rounded-[20px] p-3 text-left hover:bg-slate-50"
            >
              <div className="dashboard-light-profile-avatar flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-slate-700">
                {profileInitial}
              </div>
              {sidebarOpen && (
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-900">{profileName}</p>
                  <p className="truncate text-xs text-slate-500">{loading ? "Loading..." : user?.email}</p>
                  <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                    {selectedPlanLabel}
                  </p>
                </div>
              )}
            </Button>
          </div>
        </aside>

        <section className="relative min-h-[calc(100vh-57px)] bg-white xl:min-w-0 xl:flex-1">
          <div className="absolute inset-0 pointer-events-none">
            <div className="dashboard-light-orb dashboard-light-orb-a" />
            <div className="dashboard-light-orb dashboard-light-orb-b" />
          </div>

          <div className="relative mx-auto flex min-h-[calc(100vh-57px)] w-full max-w-[1120px] items-center justify-center px-5 py-8 sm:px-8">
            <div className="w-full max-w-[980px]">
              {/* Elegant brand text above search box */}
              <div className="text-center mb-8">
                <div className="inline-block">
                  <h2 className="text-3xl md:text-4xl font-light tracking-wide text-slate-800">
                    SHREE ANDAL AI
                  </h2>
                  <p className="text-sm text-slate-400 tracking-[0.3em] uppercase mt-1 font-light">
                    SOFTWARE SOLUTIONS
                  </p>
                  <div className="w-16 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent mx-auto mt-4"></div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4 text-sm font-medium">
                <button
                  type="button"
                  onClick={() => setMode("assistant")}
                  className={`border-b-2 px-0 py-1 transition-colors ${
                    mode === "assistant"
                      ? "border-slate-900 text-slate-900"
                      : "border-transparent text-slate-500 hover:text-slate-900"
                  }`}
                >
                  AI Assistant
                </button>
                <button
                  type="button"
                  onClick={() => setMode("automation")}
                  className={`border-b-2 px-0 py-1 transition-colors ${
                    mode === "automation"
                      ? "border-slate-900 text-slate-900"
                      : "border-transparent text-slate-500 hover:text-slate-900"
                  }`}
                >
                  Automation
                </button>
              </div>

              <div className="mt-8 rounded-[36px] border border-slate-200 bg-white/90 p-4 shadow-[0_20px_48px_rgba(15,23,42,0.08)] backdrop-blur-2xl sm:p-5">
                <div className="flex items-center gap-3 rounded-[30px] border border-slate-200 bg-white px-4 py-4 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
                  <Search className="h-5 w-5 text-slate-400" />
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleSubmit();
                      }
                    }}
                    placeholder={mode === "assistant" ? "Ask anything" : "Describe the automation you want"}
                    className="h-11 flex-1 border-none bg-transparent px-0 text-[18px] text-slate-900 placeholder:text-slate-400 focus-visible:ring-0"
                  />
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    className="h-11 w-11 rounded-full bg-slate-900 p-0 text-white hover:bg-slate-700"
                    aria-label="Submit"
                  >
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
