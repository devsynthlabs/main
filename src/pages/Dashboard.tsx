import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Users,
  FileText,
  FolderArchive,
  BarChart3,
  TrendingUp,
  LogOut,
  Building2,
  Sparkles,
  ArrowRight,
  Zap,
  Shield,
  Clock,
  Star,
  Rocket,
  Activity,
  LineChart,
  Calculator,
  FileSpreadsheet,
  Package,
  BanknoteIcon
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userEmail, setUserEmail] = useState("");


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth");
    } else {
      fetch(API_ENDPOINTS.USER, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch user");
          return res.json();
        })
        .then((data) => {
          setUserEmail(data.email);

          if (data.subscriptionStatus !== "active") {
            toast({
              variant: "destructive",
              title: "Subscription Required",
              description: "Please complete your subscription to access the dashboard.",
            });
            localStorage.removeItem("token");
            navigate("/auth");
          }
        })
        .catch((error) => {
          console.error("Error fetching user:", error);
          localStorage.removeItem("token");
          navigate("/auth");
        });
    }
  }, [navigate, toast]);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    });
    navigate("/auth");
  };

  const modules = [
    {
      title: "Payroll Automation",
      description: "Manage employee salaries, deductions, and generate salary slips automatically.",
      icon: Users,
      path: "/payroll",
      color: "from-blue-500 to-blue-600",
      badge: "Most Popular",
      stats: "5K+ Users",
    },
    {
      title: "Tax & GST Management",
      description: "Calculate and manage GST, CGST, SGST, and IGST with automatic computations.",
      icon: FileText,
      path: "/tax-gst",
      color: "from-cyan-500 to-blue-600",
      badge: "Real-time",
      stats: "99.9% Accurate",
    },
    {
      title: "Balance Sheet",
      description: "Generate balance sheets with assets, liabilities, and equity tracking.",
      icon: BarChart3,
      path: "/balance-sheet",
      color: "from-indigo-500 to-blue-700",
      badge: "Live Data",
      stats: "24/7 Tracking",
    },
    {
      title: "Civil Engineering Scheduler",
      description: "Project scheduling with Critical Path Method (CPM) analysis for construction projects.",
      icon: Building2,
      path: "/civil-engineering",
      color: "from-amber-500 to-orange-600",
      badge: "CPM Engine",
      stats: "Smart Planning",
    },
    {
      title: "Profit & Loss Statement",
      description: "Create P&L statements with income and expense analysis.",
      icon: TrendingUp,
      path: "/profit-loss",
      color: "from-sky-400 to-blue-600",
      badge: "AI-Powered",
      stats: "Smart Insights",
    },
    {
      title: "Cash Flow Prediction",
      description: "AI-powered forecasting for next 6 months with linear regression analysis.",
      icon: LineChart,
      path: "/cashflow",
      color: "from-purple-500 to-indigo-600",
      badge: "AI Prediction",
      stats: "Future Ready",
    },
    {
      title: "Cash Flow Statement",
      description: "Track cash inflows and outflows with detailed statement analysis and reporting.",
      icon: FileSpreadsheet,
      path: "/cashflow-statement",
      color: "from-pink-500 to-rose-600",
      badge: "New Feature",
      stats: "Real-time Analysis",
    },
    {
      title: "Financial Ratios",
      description: "Calculate and analyze key financial ratios including liquidity, profitability, and solvency metrics.",
      icon: Calculator,
      path: "/financial-ratios",
      color: "from-emerald-500 to-green-600",
      badge: "Analytics",
      stats: "15+Ratios",
    },
    {
      title: "Office Bookkeeping",
      description: "Track income, expenses, and manage financial records with analytics dashboard.",
      icon: Calculator,
      path: "/bookkeeping",
      color: "from-emerald-500 to-teal-600",
      badge: "Finance Engine",
      stats: "Live Tracking",
    },
    {
      title: "Inventory Management",
      description: "Track, manage, and analyze inventory with automated reorder alerts.",
      icon: Package,
      path: "/inventory",
      color: "from-purple-500 to-violet-600",
      badge: "Inventory AI",
      stats: "Live Tracking",
    },
    {
      title: "Bank Reconciliation",
      description: "Automatically match ledger entries with bank statements using AI-powered reconciliation.",
      icon: BanknoteIcon,
      path: "/bank-reconciliation",
      color: "from-cyan-500 to-teal-600",
      badge: "AI Matching",
      stats: "Auto-Reconcile",
    },
    {
      title: "Fraud Detection",
      description: "Automatically detect and prevent fraudulent transactions using AI-powered analysis.",
      icon: Shield,
      path: "/fraud-detection",
      color: "from-amber-500 to-orange-600",
      badge: "AI Detection",
      stats: "Smart Prevention",
    },
    {
      title: "Invoice Management",
      description: "Track, manage, and analyze invoices with automated invoice processing and analysis.",
      icon: FileText,
      path: "/invoice",
      color: "from-amber-500 to-orange-600",
      badge: "Invoice AI",
      stats: "Live Tracking",
    }
  ];

  const features = [
    { icon: Zap, text: "Lightning Fast", color: "text-yellow-400" },
    { icon: Shield, text: "Bank-Grade Security", color: "text-green-400" },
    { icon: Clock, text: "Save 10+ Hours/Week", color: "text-blue-400" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white relative overflow-hidden">
      {/* Animated gradient mesh background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[120px]"
          style={{
            top: -400,
            left: -400,
          }}
        ></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/3 right-10 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

        {/* Floating particles */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
        <div className="absolute top-40 right-40 w-2 h-2 bg-cyan-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-40 left-1/3 w-2 h-2 bg-indigo-400 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none"></div>

      {/* Header */}
      <header
        className="bg-white/5 border-b border-blue-400/20 shadow-2xl backdrop-blur-2xl relative z-10 sticky top-0"
      >
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <div className="flex items-center space-x-4 group">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-2xl shadow-blue-500/60 transition-all duration-500">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl blur-xl opacity-50 transition-opacity duration-500"></div>
            </div>
            <div>
              <h1 className="text-2xl font-black text-white drop-shadow-2xl tracking-tight leading-tight">
                Sri Andal<br />
                <span className="text-sm font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Financial Automation Private Limited</span>
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <Activity className="h-3 w-3 text-green-400 animate-pulse" />
                <p className="text-blue-300/80 text-xs font-medium">{userEmail}</p>
              </div>
            </div>
          </div>

          <Button
            onClick={handleSignOut}
            className="border-2 border-blue-400/40 bg-white/5 text-blue-200 hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-700 hover:text-white hover:border-blue-500/60 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/40 backdrop-blur-xl font-semibold px-6 group"
          >
            <LogOut className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform duration-300" />
            Sign Out
          </Button>
        </div>
      </header>

      {/* Main Dashboard */}
      <main className="max-w-7xl mx-auto px-6 py-16 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-20 relative">
          <div
            className="inline-flex items-center gap-3 mb-8 px-6 py-3 bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-cyan-500/20 backdrop-blur-xl rounded-full border border-blue-400/30 shadow-2xl transition-all duration-300 group cursor-pointer"
          >
            <Sparkles className="h-5 w-5 text-blue-300 animate-pulse" />
            <span className="text-blue-100 text-sm font-bold tracking-wide">AI-POWERED AUTOMATION PLATFORM</span>
            <Rocket className="h-5 w-5 text-cyan-300 group-hover:translate-x-1 transition-transform duration-300" />
          </div>

          <h2 className="text-6xl md:text-7xl font-black text-white mb-6 drop-shadow-[0_0_30px_rgba(59,130,246,0.8)] animate-in fade-in duration-1000 leading-tight">
            Welcome to Your
            <span className="block bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent animate-pulse">
              Command Center
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-blue-100/90 max-w-3xl mx-auto leading-relaxed font-light mb-10">
            Manage payroll, taxes, and reports with intelligent automation that works while you focus on growth
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 bg-white/10 backdrop-blur-xl px-6 py-3 rounded-full border border-blue-400/30 shadow-xl hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 group cursor-pointer"
              >
                <feature.icon className={`h-5 w-5 ${feature.color} transition-transform duration-300`} />
                <span className="text-sm font-bold text-white">{feature.text}</span>
              </div>
            ))}
          </div>

          {/* Stats Bar */}
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            <div className="text-center">
              <div className="text-4xl font-black text-blue-300 mb-1">15K+</div>
              <div className="text-sm text-blue-200/70 font-medium">Active Users</div>
            </div>
            <div className="w-px bg-blue-400/30"></div>
            <div className="text-center">
              <div className="text-4xl font-black text-cyan-300 mb-1">99.9%</div>
              <div className="text-sm text-blue-200/70 font-medium">Accuracy</div>
            </div>
            <div className="w-px bg-blue-400/30"></div>
            <div className="text-center">
              <div className="text-4xl font-black text-indigo-300 mb-1">24/7</div>
              <div className="text-sm text-blue-200/70 font-medium">Support</div>
            </div>
          </div>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module, index) => (
            <div
              key={module.path}
              onClick={() => navigate(module.path)}
              className="group cursor-pointer bg-gradient-to-br from-white/10 to-white/5 border border-blue-400/20 rounded-3xl p-8 shadow-2xl transition-all duration-500 backdrop-blur-2xl hover:bg-gradient-to-br hover:from-white/15 hover:to-white/10 hover:border-blue-400/40 relative overflow-hidden"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Animated gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-transparent to-indigo-500/0 group-hover:from-blue-500/10 group-hover:to-indigo-500/10 transition-all duration-500 rounded-3xl"></div>

              {/* Badge */}
              <div className="absolute top-4 right-4 flex items-center gap-1 bg-blue-500/20 backdrop-blur-xl px-3 py-1 rounded-full border border-blue-400/30">
                <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                <span className="text-xs font-bold text-blue-200">{module.badge}</span>
              </div>

              {/* Icon with mega glow effect */}
              <div className="relative mb-6 inline-block">
                <div className={`w-20 h-20 bg-gradient-to-br ${module.color} rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-500 group-hover:rotate-12 relative z-10`}>
                  <module.icon className="h-10 w-10 text-white" />
                </div>
                <div className={`absolute inset-0 bg-gradient-to-br ${module.color} rounded-2xl blur-2xl opacity-40 group-hover:opacity-70 transition-all duration-500`}></div>
              </div>

              {/* Content */}
              <div className="relative z-10">
                <h3 className="text-2xl font-black text-white mb-3 group-hover:text-blue-300 transition-colors duration-300 leading-tight">
                  {module.title}
                </h3>
                <p className="text-blue-100/80 mb-4 leading-relaxed group-hover:text-blue-100 transition-colors duration-300 text-sm">
                  {module.description}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs font-bold text-green-400">{module.stats}</span>
                </div>

                {/* Action button */}
                <Button
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold shadow-xl shadow-blue-600/40 hover:shadow-2xl hover:shadow-blue-500/60 transition-all duration-300 group/btn border-none py-6 rounded-xl"
                >
                  <span>Open Module</span>
                  <ArrowRight className="ml-2 h-5 w-5 group-hover/btn:translate-x-2 transition-transform duration-300" />
                </Button>
              </div>

              {/* Decorative corner glow */}
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-20 relative">
          <div
            className="bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-cyan-600/20 backdrop-blur-2xl rounded-3xl p-12 border border-blue-400/30 shadow-2xl text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 animate-pulse"></div>
            <div className="relative z-10">
              <h3 className="text-4xl font-black text-white mb-4">
                Ready to Transform Your Business?
              </h3>
              <p className="text-blue-100/80 text-lg mb-8 max-w-2xl mx-auto">
                Join thousands of businesses already saving time and scaling faster with AI-powered automation
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold px-10 py-6 text-lg rounded-xl shadow-2xl shadow-blue-600/50 hover:shadow-blue-500/70 hover:scale-105 transition-all duration-300 border-none"
                >
                  Get Started Now
                  <Rocket className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer
        className="border-t border-blue-400/20 bg-white/5 text-center py-10 mt-24 backdrop-blur-2xl relative z-10"
      >
        <p className="text-blue-200/70 text-sm font-medium mb-2">
          © 2025 Sri Andal Financial Automation Private Limited. All rights reserved.
        </p>
        <p className="text-blue-300/50 text-xs">
          Powered by AI-driven intelligent solutions • Built with ❤️ for modern businesses
        </p>
      </footer>
    </div>
  );
};

export default Dashboard;