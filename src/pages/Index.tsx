import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Award,
  BarChart3,
  Building2,
  CheckCircle2,
  Clock,
  Database,
  Lock,
  Shield,
  Sparkles,
  TrendingUp,
  Users,
  X,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";

type Stat = {
  icon: JSX.Element;
  value: string;
  label: string;
};

const fallbackFeatures = [
  "AI-assisted bookkeeping with clean audit trails",
  "Payroll, tax, and GST workflows in one secure workspace",
  "Real-time financial dashboards for leadership teams",
  "Automated reconciliation with exception detection",
  "Enterprise-grade access control and encrypted records",
  "Fast reporting for profit, cash flow, and compliance",
];

const fallbackStats: Stat[] = [
  { icon: <TrendingUp className="h-7 w-7" />, value: "42%", label: "faster month-end close" },
  { icon: <Users className="h-7 w-7" />, value: "10k+", label: "business users supported" },
  { icon: <BarChart3 className="h-7 w-7" />, value: "99.9%", label: "workflow uptime target" },
];

const Index = () => {
  const navigate = useNavigate();
  const [showDemo, setShowDemo] = useState(false);
  const [features, setFeatures] = useState<string[]>(fallbackFeatures);
  const [stats, setStats] = useState<Stat[]>(fallbackStats);

  useEffect(() => {
    fetch(`${API_BASE_URL}/dashboard`)
      .then((res) => res.json())
      .then((data) => {
        if (data.features?.length) {
          setFeatures(data.features);
        }

        if (data.stats?.length) {
          const mappedStats = data.stats.map((stat: { value: string; label: string }, index: number) => {
            const icons = [
              <TrendingUp key="trend" className="h-7 w-7" />,
              <Users key="users" className="h-7 w-7" />,
              <BarChart3 key="chart" className="h-7 w-7" />,
            ];

            return {
              icon: icons[index % icons.length],
              value: stat.value,
              label: stat.label,
            };
          });
          setStats(mappedStats);
        }

      })
      .catch((err) => console.error("Error fetching dashboard data:", err));
  }, []);

  const highlights = [
    { icon: Shield, title: "Bank-Level Security", desc: "Encrypted financial records" },
    { icon: Zap, title: "Real-Time AI", desc: "Fast operational insight" },
    { icon: Lock, title: "Compliance Ready", desc: "Built for regulated teams" },
    { icon: Clock, title: "Always Available", desc: "Reliable finance workspace" },
  ];

  const benefits = [
    { icon: Database, title: "Unified Data Layer", desc: "Finance, payroll, tax, and inventory data stay connected." },
    { icon: Award, title: "Executive Polish", desc: "Clear reporting surfaces designed for confident decisions." },
    { icon: Users, title: "Team Ready", desc: "A secure shared workspace for accountants and operators." },
  ];

  const animatedInsights = [
    { label: "Invoice AI", value: "Auto-matched", className: "left-0 top-8 hidden -translate-x-10 lg:block" },
    { label: "GST Status", value: "Ready to file", className: "right-0 top-28 hidden translate-x-8 lg:block" },
    { label: "Payroll Run", value: "98% complete", className: "bottom-8 left-6 hidden lg:block" },
    { label: "Tax Alert", value: "No issues", className: "bottom-28 right-4 hidden translate-x-12 xl:block" },
    { label: "Bank Match", value: "Synced", className: "left-10 top-44 hidden xl:block" },
    { label: "Cash Flow", value: "Healthy", className: "right-8 top-52 hidden 2xl:block" },
    { label: "Audit Trail", value: "Locked", className: "left-4 bottom-28 hidden xl:block" },
    { label: "Report Sync", value: "Ready", className: "right-14 bottom-12 hidden 2xl:block" },
  ];

  const workflowSteps = [
    "Invoice scanned",
    "GST verified",
    "Payroll synced",
    "Report generated",
  ];

  const activityRows = [
    { title: "AI reconciliation", detail: "247 records checked", progress: "91%" },
    { title: "Tax compliance", detail: "GST rules validated", progress: "100%" },
    { title: "Payroll audit", detail: "12 exceptions cleared", progress: "84%" },
  ];

  const heroSignals = [
    { label: "Realtime sync", value: "Live" },
    { label: "Audit trail", value: "Protected" },
    { label: "AI scan", value: "Running" },
  ];

  return (
    <div className="liquid-page min-h-screen overflow-hidden text-slate-950">
      {showDemo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-2xl"
        >
          <motion.div
            initial={{ scale: 0.94, opacity: 0, y: 24 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 24 }}
            transition={{ type: "spring", stiffness: 240, damping: 24 }}
            className="liquid-panel relative w-full max-w-4xl rounded-[36px] p-4 shadow-[0_30px_90px_rgba(15,23,42,0.32)] sm:p-6"
          >
            <Button
              onClick={() => setShowDemo(false)}
              aria-label="Close demo"
              className="absolute -right-3 -top-3 z-50 h-11 w-11 rounded-full border border-white/45 bg-white/45 p-0 text-slate-900 shadow-lg backdrop-blur-xl hover:bg-white/70"
            >
              <X className="h-5 w-5" />
            </Button>

            <div className="relative overflow-hidden rounded-[28px] bg-slate-950 pt-[56.25%] shadow-inner">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/L83KfmWD3Pg?si=et24Kysqr38PY2XI&autoplay=1"
                title="SHREE ANDAL AI SOFTWARE SOLUTIONS (OPC) PRIVATE LIMITED Demo"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="absolute left-0 top-0 h-full w-full"
              />
            </div>

            <div className="mt-6 text-center">
              <h3 className="text-2xl font-semibold tracking-tight text-slate-950">
                SHREE ANDAL AI SOFTWARE SOLUTIONS Demo
              </h3>
              <p className="mt-2 text-sm font-medium text-slate-600">
                A closer look at intelligent finance operations for modern businesses.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}

      <div className="liquid-backdrop fixed inset-0 pointer-events-none" />
      <div className="liquid-brand-wordmark fixed inset-x-0 top-24 pointer-events-none select-none text-center">
        SHREE ANDAL AI SOFTWARE SOLUTIONS
      </div>

      <header className="sticky top-0 z-50 border-b border-white/35 bg-white/20 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex min-w-0 items-center gap-3"
          >
            <div className="liquid-icon flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px]">
              <Building2 className="h-6 w-6 text-slate-900" />
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-sm font-semibold tracking-tight text-slate-950 sm:text-lg">
                SHREE ANDAL AI SOFTWARE SOLUTIONS
              </h1>
              <p className="text-xs font-medium text-slate-600">AI finance operations platform</p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}>
            <Button
              onClick={() => navigate("/auth")}
              className="h-11 rounded-full bg-slate-950 px-6 text-sm font-semibold text-white shadow-[0_16px_36px_rgba(15,23,42,0.24)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-800"
            >
              Sign In
            </Button>
          </motion.div>
        </div>
      </header>

      <main className="relative mx-auto max-w-7xl px-5 sm:px-6">
        <section className="grid min-h-[calc(100vh-82px)] items-center gap-10 py-12 lg:grid-cols-[1fr_0.9fr] lg:py-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <div className="liquid-pill mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-slate-700">
              <Sparkles className="h-4 w-4 text-sky-600" />
              AI-powered insights for enterprise finance teams
            </div>

            <h2 className="text-balance text-5xl font-semibold leading-[0.98] tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
              Financial operations with liquid clarity.
            </h2>

            <p className="mt-7 max-w-2xl text-lg font-medium leading-8 text-slate-700 sm:text-xl">
              Automate payroll, tax management, reconciliation, and reporting in a polished AI workspace built
              for secure business execution.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                onClick={() => navigate("/auth?tab=signup&plan=trial")}
                className="h-14 rounded-full bg-slate-950 px-8 text-base font-semibold text-white shadow-[0_18px_42px_rgba(15,23,42,0.26)] transition-all duration-300 hover:-translate-y-1 hover:bg-slate-800"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => setShowDemo(true)}
                className="h-14 rounded-full border-white/55 bg-white/28 px-8 text-base font-semibold text-slate-950 shadow-[0_18px_42px_rgba(15,23,42,0.12)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/45"
              >
                Watch Demo
              </Button>
              <Button
                size="lg"
                onClick={() => navigate("/auth?tab=signup&plan=trial")}
                className="h-14 rounded-full bg-sky-600 px-8 text-base font-semibold text-white shadow-[0_18px_42px_rgba(2,132,199,0.24)] transition-all duration-300 hover:-translate-y-1 hover:bg-sky-700"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            <div className="mt-8 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
              {workflowSteps.map((step, index) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 + index * 0.08, duration: 0.4 }}
                  className="liquid-workflow-chip rounded-[20px] px-3 py-3 text-center"
                >
                  <motion.div
                    className="mx-auto mb-2 h-1.5 w-10 rounded-full bg-sky-500/70"
                    animate={{ scaleX: [0.35, 1, 0.55], opacity: [0.45, 1, 0.55] }}
                    transition={{ duration: 2.6, repeat: Infinity, delay: index * 0.28, ease: "easeInOut" }}
                  />
                  <p className="text-xs font-semibold leading-5 text-slate-700">{step}</p>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              {heroSignals.map((signal, index) => (
                <motion.div
                  key={signal.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: [0, -4, 0] }}
                  transition={{
                    opacity: { delay: 0.55 + index * 0.08, duration: 0.35 },
                    y: { delay: index * 0.2, duration: 3.4, repeat: Infinity, ease: "easeInOut" },
                  }}
                  className="liquid-mini-card rounded-full px-4 py-2"
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    {signal.label}
                  </p>
                  <p className="text-sm font-semibold text-slate-950">{signal.value}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28, rotateX: 8 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ delay: 0.18, duration: 0.7 }}
            className="relative mx-auto w-full max-w-xl"
          >
            {animatedInsights.map((insight, index) => (
              <motion.div
                key={insight.label}
                initial={{ opacity: 0, y: 18, scale: 0.94 }}
                animate={{ opacity: 1, y: [0, -10, 0], scale: 1 }}
                transition={{
                  opacity: { delay: 0.45 + index * 0.12, duration: 0.45 },
                  scale: { delay: 0.45 + index * 0.12, duration: 0.45 },
                  y: { delay: index * 0.35, duration: 4.2, repeat: Infinity, ease: "easeInOut" },
                }}
                className={`liquid-float-card absolute z-20 rounded-[24px] px-4 py-3 ${insight.className}`}
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  {insight.label}
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-950">{insight.value}</p>
              </motion.div>
            ))}

            <div className="liquid-dashboard rounded-[36px] p-4 sm:p-5">
              <div className="rounded-[30px] border border-white/40 bg-white/28 p-4 shadow-inner backdrop-blur-2xl sm:p-5">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Command Center</p>
                    <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Finance Health</h3>
                  </div>
                  <div className="rounded-full border border-emerald-300/70 bg-emerald-100/60 px-3 py-1 text-xs font-semibold text-emerald-800">
                    Live
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {stats.map((stat, index) => (
                    <div key={`${stat.label}-${index}`} className="liquid-mini-card rounded-[24px] p-4">
                      <div className="mb-4 text-sky-700">{stat.icon}</div>
                      <p className="text-2xl font-semibold tracking-tight text-slate-950">{stat.value}</p>
                      <p className="mt-1 text-xs font-medium leading-5 text-slate-600">{stat.label}</p>
                    </div>
                  ))}
                </div>

                <div className="relative mt-4 overflow-hidden rounded-[28px] border border-white/40 bg-slate-950/85 p-5 text-white shadow-[0_22px_52px_rgba(15,23,42,0.25)]">
                  <motion.div
                    className="liquid-scan-line pointer-events-none absolute left-5 right-5 h-px bg-cyan-200/80"
                    animate={{ y: [18, 142, 18], opacity: [0, 1, 0] }}
                    transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-white/60">Projected cash flow</p>
                      <p className="mt-1 text-3xl font-semibold tracking-tight">+18.4%</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-cyan-300" />
                  </div>
                  <div className="mt-6 flex h-24 items-end gap-2">
                    {[42, 58, 47, 72, 64, 86, 78, 92].map((height, index) => (
                      <motion.div
                        key={index}
                        className="flex-1 rounded-full bg-gradient-to-t from-cyan-300/45 to-white/90"
                        initial={{ height: "18%" }}
                        animate={{ height: [`${Math.max(height - 14, 18)}%`, `${height}%`, `${Math.max(height - 6, 18)}%`] }}
                        transition={{
                          duration: 2.8,
                          repeat: Infinity,
                          repeatType: "mirror",
                          ease: "easeInOut",
                          delay: index * 0.12,
                        }}
                      />
                    ))}
                  </div>
                  <motion.div
                    className="absolute right-5 top-5 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/75"
                    animate={{ opacity: [0.7, 1, 0.7], y: [0, -2, 0] }}
                    transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                  >
                    Active
                  </motion.div>
                </div>

                <div className="mt-4 space-y-3">
                  {activityRows.map((row, index) => (
                    <motion.div
                      key={row.title}
                      initial={{ opacity: 0, x: 18 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.65 + index * 0.12 }}
                      className="liquid-activity-row rounded-[22px] p-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <motion.span
                            className="liquid-activity-dot h-2.5 w-2.5 rounded-full bg-emerald-500"
                            animate={{ scale: [1, 1.55, 1], opacity: [0.65, 1, 0.65] }}
                            transition={{ duration: 1.8, repeat: Infinity, delay: index * 0.22 }}
                          />
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-slate-900">{row.title}</p>
                            <p className="truncate text-xs font-medium text-slate-500">{row.detail}</p>
                          </div>
                        </div>
                        <span className="text-sm font-semibold text-sky-700">{row.progress}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        <section className="grid grid-cols-2 gap-4 py-10 md:grid-cols-4">
          {highlights.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              viewport={{ once: true }}
              whileHover={{ y: -6, scale: 1.01 }}
              className="liquid-panel rounded-[28px] p-5 transition-all duration-300"
            >
              <item.icon className="mb-4 h-7 w-7 text-sky-700" />
              <h4 className="text-sm font-semibold tracking-tight text-slate-950">{item.title}</h4>
              <p className="mt-2 text-xs font-medium leading-5 text-slate-600">{item.desc}</p>
            </motion.div>
          ))}
        </section>

        <section className="py-16">
          <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-700">Capabilities</p>
              <h3 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
                Everything finance needs, beautifully organized.
              </h3>
            </div>
            <p className="max-w-md text-base font-medium leading-7 text-slate-600">
              A focused system for teams that need automation, visibility, and compliance without visual noise.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={`${feature}-${index}`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
                whileHover={{ y: -6, scale: 1.01 }}
                className="liquid-panel group rounded-[32px] p-6 transition-all duration-300"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-[18px] border border-white/45 bg-white/40 shadow-inner backdrop-blur-xl transition-transform duration-300 group-hover:scale-105">
                  <CheckCircle2 className="h-6 w-6 text-sky-700" />
                </div>
                <p className="text-base font-semibold leading-7 text-slate-900">{feature}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="py-16">
          <div className="liquid-panel overflow-hidden rounded-[36px] p-6 sm:p-10">
            <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-700">Performance</p>
                <h3 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
                  Built for confident operating rhythm.
                </h3>
                <p className="mt-5 text-base font-medium leading-7 text-slate-600">
                  Leadership gets a clear view of momentum while finance teams keep every workflow traceable.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {stats.map((stat, index) => (
                  <motion.div
                    key={`${stat.value}-${index}`}
                    initial={{ opacity: 0, scale: 0.96 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.08 }}
                    viewport={{ once: true }}
                    className="liquid-mini-card rounded-[28px] p-6 text-center"
                  >
                    <div className="mb-4 flex justify-center text-sky-700">{stat.icon}</div>
                    <h4 className="text-4xl font-semibold tracking-tight text-slate-950">{stat.value}</h4>
                    <p className="mt-2 text-sm font-medium leading-6 text-slate-600">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-5 py-14 md:grid-cols-3">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              viewport={{ once: true }}
              whileHover={{ y: -6 }}
              className="liquid-panel rounded-[32px] p-7 text-center transition-all duration-300"
            >
              <div className="liquid-icon mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-[24px]">
                <benefit.icon className="h-8 w-8 text-slate-900" />
              </div>
              <h4 className="text-xl font-semibold tracking-tight text-slate-950">{benefit.title}</h4>
              <p className="mt-3 text-sm font-medium leading-6 text-slate-600">{benefit.desc}</p>
            </motion.div>
          ))}
        </section>

        <section className="py-16">
          <div className="liquid-cta rounded-[36px] px-6 py-14 text-center shadow-[0_30px_90px_rgba(15,23,42,0.18)] sm:px-12">
            <h3 className="mx-auto max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 md:text-6xl">
              Bring Apple-level calm to finance operations.
            </h3>
            <p className="mx-auto mt-5 max-w-2xl text-lg font-medium leading-8 text-slate-700">
              Start with a refined workspace for automation, reporting, and operational control.
            </p>
            <Button
              size="lg"
              onClick={() => navigate("/auth?tab=signup&plan=trial")}
              className="mt-9 h-14 rounded-full bg-slate-950 px-9 text-base font-semibold text-white shadow-[0_18px_42px_rgba(15,23,42,0.26)] transition-all duration-300 hover:-translate-y-1 hover:bg-slate-800"
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </section>
      </main>

      <footer className="relative border-t border-white/35 bg-white/18 backdrop-blur-2xl">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-5 py-10 sm:px-6 md:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="liquid-icon flex h-10 w-10 items-center justify-center rounded-[16px]">
                <Building2 className="h-5 w-5 text-slate-900" />
              </div>
              <h4 className="text-sm font-semibold tracking-tight text-slate-950">
                SHREE ANDAL AI SOFTWARE SOLUTIONS
              </h4>
            </div>
            <p className="max-w-sm text-sm font-medium leading-6 text-slate-600">
              Empowering businesses with intelligent financial solutions.
            </p>
          </div>

          {[
            { title: "Product", items: ["Features", "Pricing", "Security"] },
            { title: "Company", items: ["About", "Blog", "Careers"] },
            { title: "Support", items: ["Help Center", "Contact", "Status"] },
          ].map((group) => (
            <div key={group.title}>
              <h5 className="mb-3 text-sm font-semibold text-slate-950">{group.title}</h5>
              <ul className="space-y-2 text-sm font-medium text-slate-600">
                {group.items.map((item) => (
                  <li key={item} className="cursor-pointer transition-colors duration-300 hover:text-sky-700">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mx-auto max-w-7xl border-t border-white/35 px-5 py-6 text-center text-xs font-medium text-slate-500 sm:px-6">
          © 2026 SHREE ANDAL AI SOFTWARE SOLUTIONS (OPC) PRIVATE LIMITED. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Index;
