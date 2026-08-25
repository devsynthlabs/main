import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mic,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Zap,
  MessageSquare,
  TrendingUp,
  HelpCircle,
  ArrowUp,
  Check,
  RefreshCw,
  BarChart2,
  Calendar,
  AlertTriangle,
  BookOpen,
  FileText,
  ShoppingCart,
  DollarSign,
  Package,
  Activity,
  Building2,
  Clock,
  Eye,
  Database,
  FileSpreadsheet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { TrialFormModal } from "@/components/TrialFormModal";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Timeline, TimelineEntry } from "@/components/ui/timeline";
import { Compare1 } from "@/components/ui/compare-1";
import HowItWorks from "@/components/ui/how-it-works";
import TextBlockAnimation from "@/components/ui/text-block-animation";
import { Feature as FeatureWithImageComparison } from "@/components/ui/feature-with-image-comparison";

// ─────────────────────────────────────────────────────────────────────────────
// Interactive AI Command Section
// ─────────────────────────────────────────────────────────────────────────────
const CASH_FLOW_COMMANDS = [
  {
    title: "Show Forecast",
    prompt: "\"Show my cash flow forecast.\"",
    response:
      "AIBASS provides the available cash flow forecast based on the relevant bookkeeping information.",
    voicePrompt: "\"Show potential cash shortages.\"",
    voiceResponse:
      "AIBASS presents available forecast information that can help users understand possible periods of tighter cash availability.",
  },
  {
    title: "Three Month View",
    prompt: "\"Show my cash flow forecast for the next three months.\"",
    response:
      "AIBASS presents the available prediction for the requested supported period.",
    voicePrompt: "\"Check my 3-month cash flow outlook.\"",
    voiceResponse:
      "AIBASS analyzes upcoming receivables and payables for the next 90-day projection.",
  },
  {
    title: "Annual Outlook",
    prompt: "\"Show my cash flow forecast for the next year.\"",
    response:
      "AIBASS provides the available forecast for the selected annual period.",
    voicePrompt: "\"What is my expected cash runway this year?\"",
    voiceResponse:
      "AIBASS provides the available forecast and estimated runway based on your recurring expenses.",
  },
  {
    title: "Cash Shortages",
    prompt: "\"Warn me about upcoming cash pressure.\"",
    response:
      "AIBASS highlights periods where projected outgoing expenses exceed incoming receivables.",
    voicePrompt: "\"Warn me about any upcoming cash pressure.\"",
    voiceResponse:
      "AIBASS flags potential deficit weeks based on planned outflows and expected client payments.",
  },
];

const AiCommandInteractiveSection = () => {
  const [isInView, setIsInView] = useState(false);
  const [activeCmd, setActiveCmd] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [textStage, setTextStage] = useState<"typing" | "thinking" | "done">("typing");
  const [voiceTypedText, setVoiceTypedText] = useState("");
  const [voiceStage, setVoiceStage] = useState<"listening" | "thinking" | "done">("listening");
  const [animTrigger, setAnimTrigger] = useState(0);

  const triggerAnimation = () => {
    setAnimTrigger((prev) => prev + 1);
  };

  const handleSelectCmd = (index: number) => {
    setActiveCmd(index);
    setAnimTrigger((prev) => prev + 1);
  };

  useEffect(() => {
    if (!isInView) return;

    let isMounted = true;
    let typeInterval: NodeJS.Timeout | null = null;
    let voiceInterval: NodeJS.Timeout | null = null;
    let thinkingTimeout: NodeJS.Timeout | null = null;
    let voiceThinkingTimeout: NodeJS.Timeout | null = null;

    const cmd = CASH_FLOW_COMMANDS[activeCmd];
    
    // Reset states
    setTypedText("");
    setTextStage("typing");
    setVoiceTypedText("");
    setVoiceStage("listening");

    // Typewriter for Text Command
    let textIdx = 0;
    typeInterval = setInterval(() => {
      if (!isMounted) return;
      if (textIdx <= cmd.prompt.length) {
        setTypedText(cmd.prompt.slice(0, textIdx));
        textIdx++;
      } else {
        if (typeInterval) clearInterval(typeInterval);
        setTextStage("thinking");
        thinkingTimeout = setTimeout(() => {
          if (!isMounted) return;
          setTextStage("done");
        }, 800);
      }
    }, 30);

    // Typewriter for Voice Command
    let voiceIdx = 0;
    voiceInterval = setInterval(() => {
      if (!isMounted) return;
      if (voiceIdx <= cmd.voicePrompt.length) {
        setVoiceTypedText(cmd.voicePrompt.slice(0, voiceIdx));
        voiceIdx++;
      } else {
        if (voiceInterval) clearInterval(voiceInterval);
        setVoiceStage("thinking");
        voiceThinkingTimeout = setTimeout(() => {
          if (!isMounted) return;
          setVoiceStage("done");
        }, 800);
      }
    }, 30);

    return () => {
      isMounted = false;
      if (typeInterval) clearInterval(typeInterval);
      if (voiceInterval) clearInterval(voiceInterval);
      if (thinkingTimeout) clearTimeout(thinkingTimeout);
      if (voiceThinkingTimeout) clearTimeout(voiceThinkingTimeout);
    };
  }, [isInView, activeCmd, animTrigger]);

  const currentCmd = CASH_FLOW_COMMANDS[activeCmd];

  return (
    <motion.section
      onViewportEnter={() => setIsInView(true)}
      viewport={{ once: true, amount: 0.2 }}
      className="py-12 md:py-16 border-t border-slate-100 bg-transparent"
    >
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="space-y-4 text-center max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-2">
            <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-widest">
              CONVERSATIONAL CASH FLOW ACCESS
            </span>
            <button
              onClick={triggerAnimation}
              title="Replay AI Animation"
              className="p-1.5 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Ask AIBASS About Your Future Cash Position
          </h2>
          <p className="text-sm font-medium leading-relaxed text-slate-700 sm:text-base">
            AIBASS turns cash flow forecasting into a more conversational financial workflow. Instead of searching through several spreadsheets and reports, users can ask for supported financial information using text or voice.
          </p>
          <div className="w-12 h-1 bg-indigo-600 rounded-full mx-auto" />
        </div>

        {/* Command selector */}
        <div className="flex flex-wrap gap-2 justify-center">
          {CASH_FLOW_COMMANDS.map((cmd, i) => (
            <button
              key={i}
              onClick={() => handleSelectCmd(i)}
              className={`text-xs font-bold px-4 py-2 rounded-full border transition-all cursor-pointer ${
                activeCmd === i
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                  : "bg-white text-slate-700 border-slate-200 hover:border-indigo-300"
              }`}
            >
              {cmd.title}
            </button>
          ))}
        </div>

        {/* 3-column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Card 1: Text Command */}
          <div className="bg-white border border-slate-200/80 rounded-[32px] p-6 sm:p-8 shadow-[0_10px_35px_rgba(0,0,0,0.03)] hover:border-indigo-200 transition-all flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-950">Review Your Cash Flow Forecast</h3>
                  <span className="text-xs text-slate-500 font-medium">Text Input Mode</span>
                </div>
              </div>
              <p className="text-xs sm:text-sm font-medium text-slate-655">
                Enter a simple instruction in the command box.
              </p>

              {/* Typewriter command box */}
              <div className="bg-indigo-50/60 border border-indigo-100 rounded-2xl p-4 shadow-sm space-y-1.5 relative overflow-hidden min-h-[90px] flex flex-col justify-between">
                <span className="text-[10px] uppercase font-extrabold text-indigo-650 tracking-wider block flex items-center gap-1.5">
                  <MessageSquare className="h-3 w-3 text-indigo-600" /> User command
                </span>
                <p className="text-sm font-bold text-slate-900 leading-snug">
                  {typedText}
                  {textStage === "typing" && (
                    <span className="inline-block w-1.5 h-4 bg-indigo-600 ml-0.5 animate-pulse" />
                  )}
                </p>
                {textStage === "thinking" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2 text-xs font-semibold text-indigo-700 pt-1"
                  >
                    <Sparkles className="h-3.5 w-3.5 animate-spin text-indigo-600" />
                    <span>AIBASS is processing...</span>
                    <div className="flex gap-1 items-center ml-1">
                      <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce" />
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Response */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-1.5 min-h-[100px] transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-extrabold text-indigo-600 tracking-wider flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-indigo-600" /> AIBASS response
                  </span>
                  {textStage === "done" && (
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                      <Check className="h-3 w-3" /> Ready
                    </span>
                  )}
                </div>
                {textStage === "done" ? (
                  <motion.p
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs font-medium text-slate-700 leading-relaxed"
                  >
                    {currentCmd.response}
                  </motion.p>
                ) : (
                  <div className="flex items-center gap-2 text-xs text-slate-400 italic py-2">
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse" />
                    <span>Waiting for command completion...</span>
                  </div>
                )}
              </div>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center gap-2 text-xs font-bold text-blue-600">
              <CheckCircle2 className="h-4 w-4" /> Forecast updated automatically
            </div>
          </div>

          {/* Card 2: Voice Command */}
          <div className="bg-white border border-slate-200/80 rounded-[32px] p-6 sm:p-8 shadow-[0_10px_35px_rgba(0,0,0,0.03)] hover:border-emerald-200 transition-all flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                  <Mic className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-950">Check Potential Cash Pressure</h3>
                  <span className="text-xs text-slate-500 font-medium">Hands-free Voice Mode</span>
                </div>
              </div>
              <p className="text-xs sm:text-sm font-medium text-slate-655">
                Speak your instruction instead of typing it.
              </p>

              {/* Voice command bubble */}
              <div className="bg-slate-950 border border-slate-800 text-white rounded-2xl p-4 shadow-sm space-y-1.5 relative overflow-hidden min-h-[90px] flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-extrabold text-emerald-400 tracking-wider flex items-center gap-1.5">
                    <Mic className="h-3 w-3 animate-pulse text-emerald-400" /> User command
                  </span>
                  <div className="flex items-center gap-1 h-3">
                    <span className="w-1 bg-emerald-400 h-full rounded-full animate-pulse" />
                    <span className="w-1 bg-emerald-400 h-2/3 rounded-full animate-pulse [animation-delay:0.2s]" />
                    <span className="w-1 bg-emerald-400 h-full rounded-full animate-pulse [animation-delay:0.4s]" />
                    <span className="w-1 bg-emerald-400 h-1/2 rounded-full animate-pulse [animation-delay:0.1s]" />
                  </div>
                </div>
                <p className="text-sm font-bold text-emerald-100 leading-snug">
                  {voiceTypedText}
                  {voiceStage === "listening" && (
                    <span className="inline-block w-1.5 h-4 bg-emerald-400 ml-0.5 animate-pulse" />
                  )}
                </p>
                {voiceStage === "thinking" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2 text-xs font-semibold text-emerald-300 pt-1"
                  >
                    <Sparkles className="h-3.5 w-3.5 animate-spin text-emerald-400" />
                    <span>Processing speech input...</span>
                  </motion.div>
                )}
              </div>

              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-1.5 min-h-[100px] transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-extrabold text-indigo-600 tracking-wider flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-indigo-600" /> AIBASS response
                  </span>
                  {voiceStage === "done" && (
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                      <Check className="h-3 w-3" /> Ready
                    </span>
                  )}
                </div>
                {voiceStage === "done" ? (
                  <motion.p
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs font-medium text-slate-700 leading-relaxed"
                  >
                    {currentCmd.voiceResponse}
                  </motion.p>
                ) : (
                  <div className="flex items-center gap-2 text-xs text-slate-400 italic py-2">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    <span>Listening to voice instruction...</span>
                  </div>
                )}
              </div>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center gap-2 text-xs font-bold text-emerald-600">
              <CheckCircle2 className="h-4 w-4" /> Text and voice access supported
            </div>
          </div>

          {/* Card 3: Custom Period */}
          <div className="bg-white border border-slate-200/80 rounded-[32px] p-6 sm:p-8 shadow-[0_10px_35px_rgba(0,0,0,0.03)] hover:border-purple-200 transition-all flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-950">Use a Custom Period</h3>
                  <span className="text-xs text-slate-500 font-medium">Flexible Forecast Range</span>
                </div>
              </div>
              <p className="text-xs sm:text-sm font-medium text-slate-655">
                Choose the specific forecast period relevant to your planning needs.
              </p>
              <div className="space-y-3">
                {[
                  { period: "Next 30 days", status: "Available", color: "emerald" },
                  { period: "Next 3 months", status: "Available", color: "emerald" },
                  { period: "Next 6 months", status: "Available", color: "emerald" },
                  { period: "Next 12 months", status: "Available", color: "emerald" },
                  { period: "Custom period", status: "Available", color: "emerald" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <Calendar className="h-3.5 w-3.5 text-slate-500" />
                      <span className="text-xs font-bold text-slate-800">{item.period}</span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full bg-${item.color}-50 text-${item.color}-700 border border-${item.color}-200`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center gap-2 text-xs font-bold text-purple-600">
              <CheckCircle2 className="h-4 w-4" /> Forecast up to one year
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button
            onClick={() => window.dispatchEvent(new CustomEvent("openTrialModal"))}
            className="h-12 rounded-full bg-slate-950 px-8 text-sm font-bold text-white shadow-lg hover:-translate-y-0.5 hover:bg-slate-800 transition-transform"
          >
            Experience AI Cash Flow Forecasting
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.section>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Main Page Component
// ─────────────────────────────────────────────────────────────────────────────
export const CashFlowForecastingSoftware = () => {
  const navigate = useNavigate();
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setShowBackToTop(latest > 500);
  });

  useEffect(() => {
    document.title = "Cash Flow Forecasting Software with AI | AIBASS";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        "content",
        "Forecast cash flow up to one year with AIBASS cash flow forecasting software. Use AI predictions, automatic updates and bookkeeping data to plan ahead."
      );
    }

  }, []);

  const productTabs = [
    { label: "Cash Position", icon: <Activity className="h-3.5 w-3.5" />, desc: "Review available information around the current financial position." },
    { label: "Forecast", icon: <TrendingUp className="h-3.5 w-3.5" />, desc: "Understand predicted future cash availability using category-wise bookkeeping data." },
    { label: "Custom Period", icon: <Calendar className="h-3.5 w-3.5" />, desc: "Choose a relevant forecast period based on the financial planning requirement." },
    { label: "Financial Needs", icon: <AlertTriangle className="h-3.5 w-3.5" />, desc: "Review available information around potential cash pressure and upcoming financial requirements." },
    { label: "AI Commands", icon: <Sparkles className="h-3.5 w-3.5" />, desc: "Use text or voice commands to access supported forecasting information faster." },
  ];

  const demoSteps = [
    "Review category-wise bookkeeping information",
    "Open the cash flow forecast",
    "Select a forecast period",
    "Review the future cash position",
    "Check potential cash pressure",
    "Change to a custom forecast period",
    "Update relevant bookkeeping information",
    "Review the automatically updated forecast",
    "Ask for supported information through a text command",
    "Use a voice instruction for supported cash flow information",
  ];

  const faqs = [
    {
      q: "What Is Cash Flow Forecasting Software?",
      a: "Cash flow forecasting software helps businesses estimate future cash availability using relevant financial information so they can prepare for upcoming expenses and potential cash pressure.",
    },
    {
      q: "How Does AIBASS Cash Flow Forecasting Software Work?",
      a: "AIBASS uses available category-wise bookkeeping data to generate AI driven predictions about future cash availability. Forecasts update automatically as relevant financial information changes.",
    },
    {
      q: "What Information Does AIBASS Use for Cash Flow Forecasting?",
      a: "AIBASS uses the category-wise bookkeeping information available within the platform as the foundation for its cash flow forecasts.",
    },
    {
      q: "How Far Ahead Can AIBASS Forecast Cash Flow?",
      a: "AIBASS can provide cash flow forecasts for periods of up to one year.",
    },
    {
      q: "Can I Create a Custom Cash Flow Forecast?",
      a: "Yes. AIBASS supports custom forecast periods so businesses can review cash flow information for a timeframe relevant to their financial planning needs.",
    },
    {
      q: "Does the AIBASS Cash Flow Forecast Update Automatically?",
      a: "Yes. Relevant cash flow forecasts update automatically when the underlying bookkeeping information changes.",
    },
    {
      q: "What Is AI Cash Flow Forecasting Software?",
      a: "AI cash flow forecasting software uses available financial data and AI driven analysis to estimate future cash positions and help businesses understand possible upcoming financial requirements.",
    },
    {
      q: "What Is Cash Flow Projection Software?",
      a: "Cash flow projection software estimates how the financial position of a business may develop over a future period based on available financial information.",
    },
    {
      q: "What Is the Difference Between Cash Forecasting Software and Cash Flow Projection Software?",
      a: "Both terms generally describe software designed to estimate future cash positions. Cash forecasting usually focuses on expected cash availability, while cash flow projections describe the expected future financial movement across a selected period.",
    },
    {
      q: "Can AIBASS Identify Potential Cash Shortages?",
      a: "AIBASS provides forecast information that can help users understand periods where future cash availability may become tighter based on the available bookkeeping data.",
    },
    {
      q: "Can AIBASS Forecast Cash Flow for One Year?",
      a: "Yes. AIBASS supports cash flow forecasting for periods extending up to one year.",
    },
    {
      q: "Can I Use Text Commands for Cash Flow Forecasting?",
      a: "Yes. AIBASS supports text commands for available cash flow and financial activities.",
    },
    {
      q: "Can I Use Voice Commands?",
      a: "Yes. Users can speak supported instructions to access available financial and cash flow information.",
    },
    {
      q: "Is AIBASS Suitable for Small Business Cash Flow Forecasting?",
      a: "Yes. Small businesses can use AIBASS to review future cash availability, potential cash pressure and upcoming financial requirements while keeping forecasting connected with their bookkeeping information.",
    },
    {
      q: "Does AIBASS Provide Automatic Cash Flow Forecasting?",
      a: "AIBASS automatically updates relevant cash flow forecasts as the underlying bookkeeping information changes, reducing repeated manual forecast maintenance.",
    },
    {
      q: "How Accurate Are AIBASS Cash Flow Forecasts?",
      a: "Forecast quality depends on the completeness and accuracy of the bookkeeping information available in AIBASS. Forecasts are estimates and actual future cash positions may vary as business activity changes.",
    },
    {
      q: "What Should I Look for in the Best Cash Flow Forecasting Software?",
      a: "Businesses should consider how the software uses financial data, how far ahead it can forecast, whether forecasts stay updated, whether custom periods are available and how easily users can understand and access the resulting information.",
    },
    {
      q: "Is AIBASS Cash Flow Forecasting Software Free?",
      a: "AIBASS offers a 30 day free trial so businesses can explore supported cash flow forecasting and connected accounting capabilities before selecting a paid plan.",
    },
  ];

  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      {/* SEO meta */}
      <link rel="canonical" href="/products/cash-flow-forecasting-software/" />

      <Header />
      <TrialFormModal />

      <main className="pt-28 sm:pt-32">
        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden px-4 sm:px-6 pb-16 pt-8">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/60 via-white to-blue-50/40 pointer-events-none" />
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/8 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-72 h-72 bg-blue-500/6 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-5xl mx-auto text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-200/80 bg-indigo-50/70 text-xs font-bold text-indigo-700 uppercase tracking-widest">
                <Sparkles className="h-3.5 w-3.5" />
                AIBASS
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-950 leading-tight">
                Cash Flow Forecasting Software{" "}
                <span className="text-indigo-600">with AI Driven Predictions</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-700 font-medium leading-relaxed max-w-3xl mx-auto">
                AIBASS cash flow forecasting software uses category-wise bookkeeping data to predict future cash availability, identify potential cash pressure and support financial planning up to one year.
              </p>
            </motion.div>

            {/* Product Highlights */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="flex flex-wrap justify-center gap-3"
            >
              {[
                { icon: <Sparkles className="h-3.5 w-3.5" />, text: "AI driven cash flow predictions" },
                { icon: <Calendar className="h-3.5 w-3.5" />, text: "Forecasts up to one year" },
                { icon: <Clock className="h-3.5 w-3.5" />, text: "Custom forecast periods" },
                { icon: <RefreshCw className="h-3.5 w-3.5" />, text: "Automatic forecast updates" },
                { icon: <Mic className="h-3.5 w-3.5" />, text: "Text and voice commands" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white border border-slate-200 shadow-sm text-xs font-bold text-slate-700"
                >
                  <span className="text-indigo-600">{item.icon}</span>
                  {item.text}
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="flex flex-col sm:flex-row gap-3 justify-center"
            >
              <Button
                onClick={() => window.dispatchEvent(new CustomEvent("openTrialModal"))}
                className="h-12 rounded-full bg-slate-950 px-8 text-sm font-bold text-white shadow-lg hover:-translate-y-0.5 hover:bg-slate-800 transition-transform"
              >
                Start 30 Day Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                onClick={() => window.dispatchEvent(new CustomEvent("openTrialModal"))}
                className="h-12 rounded-full border-slate-300 text-slate-800 hover:bg-slate-50 px-8 text-sm font-bold transition-all"
              >
                Book a Free Demo
              </Button>
            </motion.div>
          </div>
        </section>

        {/* ── See Where Your Cash Flow Is Heading ─────────────────────────── */}
        <section className="py-16 px-4 sm:px-6 border-t border-slate-100">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2">
                <span className="text-xs font-bold tracking-[0.2em] text-indigo-600 bg-indigo-50/50 px-3 py-1 rounded-full border border-indigo-100 uppercase">
                  AIBASS
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-950 leading-tight">
                See Where Your Cash Flow Is Heading
              </h2>
              <p className="text-sm sm:text-base font-medium text-slate-700 leading-relaxed">
                Your current cash balance only shows where your business stands today. AIBASS cash forecasting software uses connected bookkeeping data to estimate future cash availability, highlight possible cash pressure, and help you plan upcoming financial requirements with greater clarity.
              </p>
              <div>
                <h3 className="text-base font-bold text-slate-950 mb-4">Plan with a Clearer Financial Outlook</h3>
                <p className="text-sm font-medium text-slate-600 mb-3">AIBASS helps you:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    "Understand expected future cash availability",
                    "Identify possible periods of cash pressure",
                    "Review upcoming financial requirements",
                    "Plan future expenses",
                    "Forecast for periods up to one year",
                    "Choose custom forecast periods",
                    "Keep forecasts updated automatically",
                    "Access financial insights through text or voice commands",
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="w-5 h-5 rounded-md bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="h-3 w-3 text-indigo-600 font-bold" />
                      </div>
                      <span className="text-xs font-bold text-slate-800">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => window.dispatchEvent(new CustomEvent("openTrialModal"))}
                className="rounded-full border-indigo-200 text-indigo-700 hover:bg-indigo-50 font-bold text-xs sm:text-sm px-6 h-10 flex items-center gap-2"
              >
                Explore Cash Flow Forecasting
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>

            {/* Visual card */}
            <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-b from-white via-indigo-50/20 to-slate-50/60 border border-indigo-100/80 p-6 sm:p-8 shadow-[0_20px_40px_-15px_rgba(79,70,229,0.09)]">
              <div className="absolute -right-12 -top-12 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-indigo-100/80">
                  <h3 className="text-base font-bold text-slate-950">Cash Flow Outlook</h3>
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-100/80 px-3 py-1 rounded-full border border-indigo-200/60">AI Forecast</span>
                </div>
                {[
                  { month: "Month 1", amount: "₹2,40,000", status: "Positive", bar: 80, color: "emerald" },
                  { month: "Month 2", amount: "₹1,85,000", status: "Positive", bar: 62, color: "emerald" },
                  { month: "Month 3", amount: "₹95,000", status: "Watch", bar: 32, color: "amber" },
                  { month: "Month 4", amount: "₹3,10,000", status: "Positive", bar: 90, color: "emerald" },
                  { month: "Month 5", amount: "₹1,20,000", status: "Watch", bar: 40, color: "amber" },
                  { month: "Month 6", amount: "₹2,75,000", status: "Positive", bar: 75, color: "emerald" },
                ].map((item, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800">{item.month}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{item.amount}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.color === "emerald" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${item.bar}%` }}
                        transition={{ duration: 0.8, delay: i * 0.1 }}
                        viewport={{ once: true }}
                        className={`h-full rounded-full ${item.color === "emerald" ? "bg-emerald-500" : "bg-amber-400"}`}
                      />
                    </div>
                  </div>
                ))}
                <div className="pt-2 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500 font-medium">
                  <RefreshCw className="h-3 w-3 text-indigo-500" />
                  <span>Forecast updates automatically with bookkeeping data</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── How AIBASS Creates Your Cash Flow Forecast ───────────────────── */}
        <section className="py-16 px-4 sm:px-6 bg-gradient-to-b from-slate-50/60 to-white border-t border-slate-100">
          <div className="max-w-7xl mx-auto space-y-12">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-widest">HOW IT WORKS</span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-950">
                How AIBASS Creates Your Cash Flow Forecast
              </h2>
              <p className="text-sm sm:text-base font-medium text-slate-700 leading-relaxed">
                A useful forecast should clearly connect future predictions with the financial information already recorded in the business. AIBASS uses category-wise bookkeeping data as the foundation for its cash flow forecasting process.
              </p>
            </div>

            <HowItWorks
              features={[
                {
                  title: "Use Your Bookkeeping Data",
                  description:
                    "AIBASS works with relevant financial information available within your bookkeeping records. Because the data is organised by category, the platform can use the financial activity already recorded in AIBASS as the basis for forecasting.",
                  colorTheme: "indigo",
                },
                {
                  title: "Analyse Financial Activity",
                  description:
                    "Available bookkeeping information is analysed to understand the financial position of the business and how recorded activity may influence future cash availability.",
                  colorTheme: "blue",
                },
                {
                  title: "Estimate Future Cash Availability",
                  description:
                    "AIBASS generates AI driven cash flow predictions based on the available bookkeeping information. The forecast helps businesses understand how their cash position may develop over the selected period.",
                  colorTheme: "purple",
                },
                {
                  title: "Identify Potential Cash Pressure",
                  description:
                    "Forecast information can help reveal periods where available cash may become tighter compared with upcoming financial requirements.",
                  colorTheme: "amber",
                },
                {
                  title: "Keep Forecasts Updated",
                  description:
                    "When relevant bookkeeping information changes, the cash flow forecast updates automatically. This reduces the need to manually rebuild the same forecast every time financial data changes.",
                  colorTheme: "emerald",
                },
                {
                  title: "Review the Period You Need",
                  description:
                    "Businesses can forecast cash flow for periods of up to one year and use custom forecast periods to focus on specific planning requirements.",
                  colorTheme: "orange",
                },
              ]}
            />

            <div className="text-center">
              <Button
                onClick={() => window.dispatchEvent(new CustomEvent("openTrialModal"))}
                className="h-12 rounded-full bg-slate-950 px-8 text-sm font-bold text-white shadow-lg hover:-translate-y-0.5 hover:bg-slate-800 transition-transform"
              >
                See AIBASS Forecasting in Action
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* ── Features ─────────────────────────────────────────────────────── */}
        <section className="py-16 px-4 sm:px-6 border-t border-slate-100">
          <div className="max-w-7xl mx-auto space-y-12">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-widest">FEATURES</span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-950">
                Cash Flow Forecasting Software Features
              </h2>
              <p className="text-sm sm:text-base font-medium text-slate-700 leading-relaxed">
                AIBASS combines connected bookkeeping data, AI driven analysis and conversational access to make future cash flow easier to understand.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: <Sparkles className="h-5 w-5" />,
                  title: "AI Driven Cash Flow Predictions",
                  desc: "Use available bookkeeping information to estimate how the future cash position of your business may develop. The forecast gives you forward-looking financial visibility instead of relying only on historical reports.",
                  color: "indigo",
                },
                {
                  icon: <Calendar className="h-5 w-5" />,
                  title: "Forecast Up to One Year",
                  desc: "Review expected cash flow across periods extending up to one year. This gives businesses greater visibility when planning future operating requirements, purchases and other financial commitments.",
                  color: "blue",
                },
                {
                  icon: <Clock className="h-5 w-5" />,
                  title: "Custom Forecast Periods",
                  desc: "Focus on the period that matters to your business. Custom forecasting allows users to review future cash information for specific planning requirements rather than relying on only one fixed timeframe.",
                  color: "purple",
                },
                {
                  icon: <RefreshCw className="h-5 w-5" />,
                  title: "Automatic Forecast Updates",
                  desc: "Cash flow predictions update automatically as relevant bookkeeping information changes. This helps keep the forecast aligned with the latest available financial records without repeatedly rebuilding calculations manually.",
                  color: "emerald",
                },
                {
                  icon: <AlertTriangle className="h-5 w-5" />,
                  title: "Potential Cash Shortage Visibility",
                  desc: "Understand when future cash availability may become limited based on the financial information available in AIBASS. Earlier visibility gives businesses more time to review upcoming requirements and prepare accordingly.",
                  color: "amber",
                },
                {
                  icon: <Mic className="h-5 w-5" />,
                  title: "Text and Voice Commands",
                  desc: "Access supported forecasting and financial information using simple text or voice instructions. Type your command or speak your instruction to review the information you need faster.",
                  color: "rose",
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                  viewport={{ once: true }}
                  className="group bg-white border border-slate-200/80 rounded-[28px] p-6 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-md hover:border-indigo-200 transition-all"
                >
                  <div className={`w-11 h-11 rounded-xl bg-${item.color}-50 border border-${item.color}-100 flex items-center justify-center text-${item.color}-600 mb-4 group-hover:bg-${item.color}-600 group-hover:text-white transition-colors`}>
                    {item.icon}
                  </div>
                  <h3 className="text-base font-bold text-slate-950 mb-2">{item.title}</h3>
                  <p className="text-xs font-medium text-slate-600 leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── AI Command Interactive Section ───────────────────────────────── */}
        <div className="px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <AiCommandInteractiveSection />
          </div>
        </div>

        {/* ── See the Financial Information Behind Your Forecast ───────────── */}
        <section className="py-16 px-4 sm:px-6 bg-gradient-to-b from-slate-50/60 to-white border-t border-slate-100">
          <div className="max-w-7xl mx-auto space-y-12">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-widest">CONNECTED DATA</span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-950">
                See the Financial Information Behind Your Forecast
              </h2>
              <p className="text-sm sm:text-base font-medium text-slate-700 leading-relaxed">
                AIBASS does not treat cash flow forecasting as an isolated spreadsheet exercise. The forecast is connected with the category-wise bookkeeping information available within the accounting platform. This helps create a more relevant picture of future cash availability based on the financial records already used to manage the business.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white border border-slate-200/80 rounded-[28px] p-6 sm:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.03)] space-y-5">
                <h3 className="text-lg font-bold text-slate-950">Your Forecast Helps You Understand</h3>
                <div className="space-y-3">
                  {[
                    "Expected future cash availability",
                    "Potential periods of cash pressure",
                    "Upcoming financial requirements",
                    "Future expense needs",
                    "Changes in the financial outlook as bookkeeping data updates",
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <CheckCircle2 className="h-4 w-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm font-medium text-slate-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-slate-200/80 rounded-[28px] p-6 sm:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.03)] space-y-5">
                <h3 className="text-lg font-bold text-slate-950">Understand Current and Future Cash Flow</h3>
                <p className="text-sm font-medium text-slate-600 leading-relaxed">Historical financial information and future cash flow predictions answer different business questions.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-slate-600" />
                      <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wide">Current Financial Position</span>
                    </div>
                    <p className="text-xs font-medium text-slate-600 leading-relaxed">Your existing bookkeeping and financial records help explain what has already happened within the business. They provide context around recorded financial activity and the present financial picture.</p>
                  </div>
                  <div className="bg-indigo-50/60 border border-indigo-100 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-indigo-600" />
                      <span className="text-xs font-extrabold text-indigo-800 uppercase tracking-wide">Future Cash Position</span>
                    </div>
                    <div className="space-y-1.5">
                      {["Expected cash availability", "Possible future cash pressure", "Upcoming financial requirements", "Longer-term financial visibility", "Custom period forecasts"].map((pt, pi) => (
                        <div key={pi} className="flex items-center gap-1.5">
                          <Check className="h-3 w-3 text-indigo-600 flex-shrink-0" />
                          <span className="text-xs font-medium text-indigo-900">{pt}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-xs font-medium text-slate-500 leading-relaxed">Together, current records and future predictions provide a more complete view of business finances.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Identify Potential Cash Shortages Earlier ────────────────────── */}
        <section className="py-16 px-4 sm:px-6 border-t border-slate-100">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs font-extrabold text-amber-600 uppercase tracking-widest">CASH PRESSURE VISIBILITY</span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-950 leading-tight">
                Identify Potential Cash Shortages Earlier
              </h2>
              <p className="text-sm sm:text-base font-medium text-slate-700 leading-relaxed">
                Cash flow problems are easier to manage when businesses have visibility before financial pressure becomes immediate. AIBASS cash flow projection software helps users understand potential changes in future cash availability based on the bookkeeping information available in the platform.
              </p>
              <div>
                <h3 className="text-base font-bold text-slate-950 mb-3">Prepare Before Cash Becomes Tight</h3>
                <p className="text-xs font-medium text-slate-500 mb-3">Forecasting can help businesses:</p>
                <div className="space-y-2">
                  {[
                    "Recognise possible future cash pressure",
                    "Review upcoming financial requirements",
                    "Understand expected cash availability",
                    "Plan expenses more carefully",
                    "Reconsider the timing of financial commitments",
                    "Prepare for periods where available cash may be lower",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-500 flex-shrink-0" />
                      <span className="text-sm font-medium text-slate-700">{item}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs font-medium text-slate-500 mt-4 leading-relaxed">
                  A forecast does not make financial decisions for the business. It provides forward-looking information that can support more informed planning.
                </p>
              </div>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-[32px] p-6 sm:p-8 shadow-[0_15px_40px_rgba(0,0,0,0.04)] space-y-6">
              <h3 className="text-lg font-bold text-slate-950">Plan Upcoming Financial Requirements</h3>
              <p className="text-sm font-medium text-slate-600">A clearer understanding of expected cash availability can support everyday business planning.</p>
              <div className="space-y-3">
                {[
                  { icon: <DollarSign className="h-4 w-4" />, title: "Operating Expenses", desc: "Review future cash availability while preparing for routine operating costs.", color: "indigo" },
                  { icon: <Building2 className="h-4 w-4" />, title: "Payroll Expenses", desc: "Consider relevant payroll expenses recorded through the accounting workflow when reviewing future financial needs.", color: "blue" },
                  { icon: <Package className="h-4 w-4" />, title: "Inventory Purchases", desc: "Use available cash flow information when planning future stock and purchase requirements.", color: "emerald" },
                  { icon: <TrendingUp className="h-4 w-4" />, title: "Business Investments", desc: "Understand the future financial outlook before taking on additional business commitments.", color: "purple" },
                  { icon: <ShoppingCart className="h-4 w-4" />, title: "Other Business Costs", desc: "Use custom forecast periods to review cash availability around specific financial requirements.", color: "amber" },
                ].map((item, i) => (
                  <div key={i} className={`flex items-start gap-3.5 p-4 rounded-2xl bg-${item.color}-50/50 border border-${item.color}-100/80`}>
                    <div className={`w-8 h-8 rounded-lg bg-${item.color}-100 flex items-center justify-center text-${item.color}-600 flex-shrink-0`}>
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                      <p className="text-xs font-medium text-slate-600 mt-0.5 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Keep Cash Flow Forecasting Connected with Accounting ─────────── */}
        <section className="py-16 px-4 sm:px-6 bg-gradient-to-b from-slate-50/60 to-white border-t border-slate-100">
          <div className="max-w-7xl mx-auto space-y-12">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-widest">CONNECTED ACCOUNTING</span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-950">
                Keep Cash Flow Forecasting Connected with Accounting
              </h2>
              <p className="text-sm sm:text-base font-medium text-slate-700 leading-relaxed">
                Cash flow is influenced by the wider financial activity of the business. AIBASS keeps forecasting connected with other supported accounting capabilities instead of treating it as a completely separate process.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                {
                  icon: <BookOpen className="h-5 w-5" />,
                  title: "AI Bookkeeping Software",
                  desc: "Organise category-wise financial information that contributes to clearer cash flow visibility and future forecasting.",
                  cta: "Explore AI Bookkeeping Software",
                  route: "/product",
                  color: "indigo",
                },
                {
                  icon: <FileText className="h-5 w-5" />,
                  title: "AI Invoicing Software",
                  desc: "Create supported invoices while keeping relevant financial information connected with the broader accounting workflow.",
                  cta: "Explore AI Invoicing Software",
                  route: "/ai-invoicing-software",
                  color: "blue",
                },
                {
                  icon: <BarChart2 className="h-5 w-5" />,
                  title: "AI Financial Reporting Software",
                  desc: "Review profit and loss statements, balance sheet information, category-wise financial views and available cash flow information.",
                  cta: "Explore AI Financial Reporting Software",
                  route: "/ai-financial-reporting-software",
                  color: "emerald",
                },
                {
                  icon: <Zap className="h-5 w-5" />,
                  title: "GST Accounting Software",
                  desc: "Keep supported GST-related transaction information connected with invoicing and financial records.",
                  cta: "Explore GST Accounting Software",
                  route: "/gst-accounting-software",
                  color: "purple",
                },
                {
                  icon: <Package className="h-5 w-5" />,
                  title: "AI Inventory Management Software",
                  desc: "Connect supported purchases and sales with relevant inventory and financial information.",
                  cta: "Explore AI Inventory Management",
                  route: "/ai-inventory-management-software",
                  color: "amber",
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                  viewport={{ once: true }}
                  className="bg-white border border-slate-200/80 rounded-[28px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-md hover:border-indigo-200 transition-all flex flex-col gap-4"
                >
                  <div className={`w-10 h-10 rounded-xl bg-${item.color}-50 border border-${item.color}-100 flex items-center justify-center text-${item.color}-600`}>
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-slate-950 mb-1.5">{item.title}</h3>
                    <p className="text-xs font-medium text-slate-600 leading-relaxed">{item.desc}</p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => navigate(item.route)}
                    className={`rounded-full border-${item.color}-200 text-${item.color}-700 hover:bg-${item.color}-50 font-bold text-xs px-5 h-9 flex items-center gap-2 w-full justify-center`}
                  >
                    {item.cta}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Cash Flow Statement vs Cash Flow Forecast (Interactive Split-Slider Component) ────────────────────── */}
        <section className="py-16 px-4 sm:px-6 border-t border-slate-100 bg-gradient-to-b from-white to-slate-50/40">
          <div className="max-w-5xl mx-auto space-y-8">
            <FeatureWithImageComparison
              badge="COMPARISON"
              title="Cash Flow Forecast vs Cash Flow Statement"
              description="A cash flow statement and a cash flow forecast provide different types of financial visibility."
              leftTitle="Cash Flow Statement"
              leftSubtitle="Historical & Recorded Financial Activity"
              rightTitle="Cash Flow Forecast"
              rightSubtitle="AI Driven Future Predictions (Up to 1 Year)"
            />

            <p className="text-sm font-medium text-slate-600 leading-relaxed text-center max-w-2xl mx-auto">
              AIBASS connects available financial reporting with AI driven future cash flow predictions so businesses can understand both past activity and the possible financial outlook ahead.
            </p>
          </div>
        </section>

        {/* ── Why Businesses Use Cash Flow Forecasting Software (Timeline Animation) ───────────── */}
        <section className="border-t border-slate-100 bg-gradient-to-b from-slate-50/40 via-white to-slate-50/30 overflow-hidden">
          <Timeline
            tag="WHY AIBASS"
            title="Why Businesses Use Cash Flow Forecasting Software"
            description="Discover how connected AI predictions and automated bookkeeping transform forward-looking financial management."
            data={[
              {
                title: "Visibility",
                content: (
                  <div className="bg-white border border-slate-200/80 rounded-[28px] p-6 sm:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:border-indigo-200 hover:shadow-md transition-all space-y-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-xs">
                        <Eye className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="text-lg sm:text-xl font-bold text-slate-950">Improve Future Cash Visibility</h4>
                        <span className="text-xs text-indigo-600 font-bold uppercase tracking-wider">Predictive Financial Outlook</span>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-slate-700 leading-relaxed">
                      Understand how available cash may develop across upcoming periods instead of relying only on today's financial position.
                    </p>
                  </div>
                ),
              },
              {
                title: "Preparedness",
                content: (
                  <div className="bg-white border border-slate-200/80 rounded-[28px] p-6 sm:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:border-amber-200 hover:shadow-md transition-all space-y-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shadow-xs">
                        <AlertTriangle className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="text-lg sm:text-xl font-bold text-slate-950">Prepare for Potential Cash Pressure</h4>
                        <span className="text-xs text-amber-600 font-bold uppercase tracking-wider">Early Warning System</span>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-slate-700 leading-relaxed">
                      Identify periods where cash availability may become tighter and review upcoming requirements earlier.
                    </p>
                  </div>
                ),
              },
              {
                title: "Planning",
                content: (
                  <div className="bg-white border border-slate-200/80 rounded-[28px] p-6 sm:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:border-blue-200 hover:shadow-md transition-all space-y-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-xs">
                        <Calendar className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="text-lg sm:text-xl font-bold text-slate-950">Plan Further Ahead</h4>
                        <span className="text-xs text-blue-600 font-bold uppercase tracking-wider">12-Month Projections</span>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-slate-700 leading-relaxed">
                      Forecast for periods of up to one year to support medium and longer-term financial planning.
                    </p>
                  </div>
                ),
              },
              {
                title: "Timeframe",
                content: (
                  <div className="bg-white border border-slate-200/80 rounded-[28px] p-6 sm:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:border-purple-200 hover:shadow-md transition-all space-y-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shadow-xs">
                        <Clock className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="text-lg sm:text-xl font-bold text-slate-950">Forecast the Period You Need</h4>
                        <span className="text-xs text-purple-600 font-bold uppercase tracking-wider">Custom Periods</span>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-slate-700 leading-relaxed">
                      Use custom forecast periods when a specific business decision requires a more focused financial view.
                    </p>
                  </div>
                ),
              },
              {
                title: "Automation",
                content: (
                  <div className="bg-white border border-slate-200/80 rounded-[28px] p-6 sm:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:border-emerald-200 hover:shadow-md transition-all space-y-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-xs">
                        <RefreshCw className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="text-lg sm:text-xl font-bold text-slate-950">Reduce Manual Forecast Maintenance</h4>
                        <span className="text-xs text-emerald-600 font-bold uppercase tracking-wider">Continuous Auto-Sync</span>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-slate-700 leading-relaxed">
                      Automatic updates reduce the need to repeatedly rebuild forecasts as bookkeeping information changes.
                    </p>
                  </div>
                ),
              },
              {
                title: "Connectivity",
                content: (
                  <div className="bg-white border border-slate-200/80 rounded-[28px] p-6 sm:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:border-rose-200 hover:shadow-md transition-all space-y-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shadow-xs">
                        <Zap className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="text-lg sm:text-xl font-bold text-slate-950">Keep Forecasting Connected</h4>
                        <span className="text-xs text-rose-600 font-bold uppercase tracking-wider">Bookkeeping Integration</span>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-slate-700 leading-relaxed">
                      Use category-wise bookkeeping information already available in AIBASS rather than treating forecasting as an entirely separate process.
                    </p>
                  </div>
                ),
              },
              {
                title: "Speed & AI",
                content: (
                  <div className="bg-white border border-slate-200/80 rounded-[28px] p-6 sm:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:border-teal-200 hover:shadow-md transition-all space-y-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 shadow-xs">
                        <Sparkles className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="text-lg sm:text-xl font-bold text-slate-950">Access Information Faster</h4>
                        <span className="text-xs text-teal-600 font-bold uppercase tracking-wider">Voice & Text Commands</span>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-slate-700 leading-relaxed">
                      Use supported text or voice commands to review available cash flow information.
                    </p>
                  </div>
                ),
              },
            ]}
          />
        </section>

        {/* ── Cash Flow Forecasting for Different Businesses ───────────────── */}
        <section className="py-16 px-4 sm:px-6 border-t border-slate-100">
          <div className="max-w-7xl mx-auto space-y-12">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-widest">FOR EVERY BUSINESS</span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-950">
                Cash Flow Forecasting for Different Businesses
              </h2>
              <p className="text-sm sm:text-base font-medium text-slate-700 leading-relaxed">
                AIBASS helps different types of businesses gain greater visibility into future financial requirements.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[
                { icon: <Building2 className="h-4 w-4" />, type: "Small Businesses", desc: "Use cash flow forecasting for small business planning to understand expected cash availability and prepare for upcoming expenses without relying entirely on manually maintained forecasts." },
                { icon: <TrendingUp className="h-4 w-4" />, type: "Startups", desc: "Review future financial requirements while planning operating costs, hiring and business growth." },
                { icon: <ShoppingCart className="h-4 w-4" />, type: "Retailers", desc: "Connect relevant bookkeeping and inventory-related financial information with future cash planning." },
                { icon: <Activity className="h-4 w-4" />, type: "Traders", desc: "Use recorded financial information to support planning around purchases, expenses and other upcoming business requirements." },
                { icon: <Zap className="h-4 w-4" />, type: "Service Businesses", desc: "Understand how recorded income and operating expenses may influence future cash availability." },
                { icon: <Package className="h-4 w-4" />, type: "Manufacturing Businesses", desc: "Use connected accounting and inventory-related financial information to support planning around purchases and operational costs." },
                { icon: <BarChart2 className="h-4 w-4" />, type: "SMEs", desc: "Forecast up to one year and use custom periods as financial activity and planning requirements become more complex." },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.06 }}
                  viewport={{ once: true }}
                  className="bg-white border border-slate-200/80 rounded-[20px] p-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:border-indigo-200 hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                      {item.icon}
                    </div>
                    <span className="text-xs font-extrabold text-slate-900">{item.type}</span>
                  </div>
                  <p className="text-xs font-medium text-slate-600 leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── AIBASS vs Manual Cash Flow Forecasting (Interactive Compare Component) ───────────────────────── */}
        <section className="py-16 px-4 sm:px-6 bg-gradient-to-b from-slate-50/60 to-white border-t border-slate-100">
          <div className="max-w-6xl mx-auto space-y-10">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-widest">COMPARISON</span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-950">
                AIBASS vs Manual Cash Flow Forecasting
              </h2>
              <p className="text-sm sm:text-base font-medium text-slate-600 leading-relaxed">
                Compare how connected AI automation outperforms traditional manual spreadsheet projections across every operational dimension.
              </p>
            </div>

            <Compare1
              primaryKey="aibass"
              solutions={{
                aibass: {
                  name: "AIBASS AI",
                  color: "#4f46e5",
                  icon: "✨",
                  description:
                    "Forecasting uses available category-wise bookkeeping data from the connected accounting workflow with real-time AI projections.",
                  features: {
                    financialData:
                      "Forecasting uses available category-wise bookkeeping data from the connected accounting workflow.",
                    forecastCreation:
                      "AI driven forecasting uses available bookkeeping information to estimate future cash availability.",
                    forecastPeriod:
                      "Forecast periods can extend up to one year with custom periods available for specific planning needs.",
                    forecastUpdates:
                      "Relevant forecasts update automatically as bookkeeping information changes.",
                    cashPressure:
                      "Forecast insights help users understand possible future cash pressure.",
                    infoAccess:
                      "Supported financial information can be accessed through text or voice commands.",
                  },
                },
                manualSpreadsheets: {
                  name: "Manual Forecasting",
                  color: "#64748b",
                  icon: "📊",
                  description:
                    "Manual spreadsheet calculations requiring continuous data collection, formulas, and recurring maintenance.",
                  features: {
                    financialData:
                      "Financial information may need to be collected and reorganised across different spreadsheets.",
                    forecastCreation:
                      "Users manually build and update projection calculations.",
                    forecastPeriod:
                      "Users build separate spreadsheet models for the timeframe required.",
                    forecastUpdates:
                      "Forecasts may become outdated until the spreadsheet is updated again.",
                    cashPressure:
                      "Users manually analyse projections to identify periods where cash may become tight.",
                    infoAccess:
                      "Users search through spreadsheets, calculations and reports.",
                  },
                },
                legacyAccounting: {
                  name: "Legacy Accounting Software",
                  color: "#0284c7",
                  icon: "🏛️",
                  description:
                    "Static historical accounting packages that lack proactive cash runway forecasting and AI assistance.",
                  features: {
                    financialData:
                      "Data remains isolated in closed historical ledgers without predictive cash flow capabilities.",
                    forecastCreation:
                      "Requires manual export to third-party tools or spreadsheets to calculate upcoming runway.",
                    forecastPeriod:
                      "Locked to standard retrospective accounting periods rather than custom forward intervals.",
                    forecastUpdates:
                      "Requires manual recalculation whenever vouchers or bank statements are updated.",
                    cashPressure:
                      "Deficits are only discovered after expenses and payment cycles have already elapsed.",
                    infoAccess:
                      "Requires navigating rigid nested menus and generating static multi-page PDF reports.",
                  },
                },
              }}
              categories={[
                { key: "financialData", label: "Financial Data", icon: Database },
                { key: "forecastCreation", label: "Forecast Creation", icon: Sparkles },
                { key: "forecastPeriod", label: "Forecast Period", icon: Calendar },
                { key: "forecastUpdates", label: "Forecast Updates", icon: RefreshCw },
                { key: "cashPressure", label: "Potential Cash Pressure", icon: AlertTriangle },
                { key: "infoAccess", label: "Access to Information", icon: MessageSquare },
              ]}
            />
          </div>
        </section>

        {/* ── Know What Your Cash Flow Forecast Represents ─────────────────── */}
        <section className="py-16 px-4 sm:px-6 border-t border-slate-100">
          <div className="max-w-5xl mx-auto space-y-10">
            <div className="text-center space-y-4">
              <span className="text-xs font-extrabold text-amber-600 uppercase tracking-widest">IMPORTANT TO UNDERSTAND</span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-950">
                Know What Your Cash Flow Forecast Represents
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-amber-50/60 border border-amber-200/80 rounded-[28px] p-6 sm:p-8 space-y-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                  <h3 className="text-base font-bold text-slate-950">Forecasts Are Estimates</h3>
                </div>
                <p className="text-sm font-medium text-slate-700 leading-relaxed">
                  Cash flow forecasts are estimates based on the financial information available at the time the forecast is generated. AIBASS uses available category-wise bookkeeping data to create future cash flow predictions. As financial records change, the forecast can also change.
                </p>
                <div>
                  <p className="text-xs font-bold text-slate-600 mb-2">Actual future cash positions may differ because of:</p>
                  <div className="space-y-1.5">
                    {["Changes in income", "Changes in expenses", "Payment timing", "Unexpected business costs", "New financial activity", "Changes in business conditions"].map((r, ri) => (
                      <div key={ri} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full flex-shrink-0" />
                        <span className="text-xs font-medium text-slate-700">{r}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <p className="text-xs font-medium text-slate-500 leading-relaxed">
                  Cash flow predictions should therefore be used as a financial planning aid rather than as a guaranteed future result. Businesses should review forecast information alongside their actual financial situation before making important financial decisions.
                </p>
              </div>

              <div className="bg-indigo-50/40 border border-indigo-100 rounded-[28px] p-6 sm:p-8 space-y-4">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-5 w-5 text-indigo-600" />
                  <h3 className="text-base font-bold text-slate-950">Why Connected Bookkeeping Data Matters</h3>
                </div>
                <p className="text-sm font-medium text-slate-700 leading-relaxed">
                  The quality of any financial forecast depends heavily on the information used to create it. AIBASS connects forecasting with category-wise bookkeeping data so predictions are based on the financial records available within the accounting workflow.
                </p>
                <p className="text-sm font-medium text-slate-700 leading-relaxed">
                  Keeping bookkeeping information complete and accurate can help improve the usefulness of the resulting cash flow forecast.
                </p>
                <p className="text-sm font-medium text-slate-700 leading-relaxed">
                  This also means businesses do not need to manually recreate the same financial information in a separate forecasting system before reviewing their future cash position.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Product Demo Section ─────────────────────────────────────────── */}
        <section className="py-16 px-4 sm:px-6 bg-gradient-to-b from-slate-50/60 to-white border-t border-slate-100">
          <div className="max-w-5xl mx-auto space-y-12">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-widest block">
                PRODUCT DEMO
              </span>
              <TextBlockAnimation blockColor="#4f46e5" duration={0.7}>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-950">
                  See AIBASS Cash Flow Forecasting in Action
                </h2>
              </TextBlockAnimation>
              <TextBlockAnimation blockColor="#6366f1" duration={0.6} delay={0.15}>
                <p className="text-sm sm:text-base font-medium text-slate-700 leading-relaxed max-w-2xl mx-auto">
                  Explore how connected bookkeeping data becomes forward-looking cash flow information inside AIBASS.
                </p>
              </TextBlockAnimation>
            </div>

            {/* Product tabs */}
            <div className="flex flex-wrap gap-2 justify-center">
              {productTabs.map((tab, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTab(i)}
                  className={`flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-full border transition-all ${
                    activeTab === i
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-white text-slate-700 border-slate-200 hover:border-indigo-300"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="bg-white border border-slate-200/80 rounded-[28px] p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.04)]"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                    {productTabs[activeTab].icon}
                  </div>
                  <h3 className="text-base font-bold text-slate-950">{productTabs[activeTab].label}</h3>
                </div>
                <p className="text-sm font-medium text-slate-700 leading-relaxed">{productTabs[activeTab].desc}</p>
              </motion.div>
            </AnimatePresence>

            {/* Suggested Product Demo Flow */}
            <div className="bg-white border border-slate-200/80 rounded-[28px] p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
              <div className="flex items-center gap-2 mb-6">
                <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-widest">STEP-BY-STEP</span>
                <span className="text-slate-300">•</span>
                <h3 className="text-base sm:text-lg font-bold text-slate-950">Suggested Product Demo Flow</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {[
                  "Review category-wise bookkeeping information",
                  "Open the cash flow forecast",
                  "Select a forecast period",
                  "Review the future cash position",
                  "Check potential cash pressure",
                  "Change to a custom forecast period",
                  "Update relevant bookkeeping information",
                  "Review the automatically updated forecast",
                  "Ask for supported information through a text command",
                  "Use a voice instruction for supported cash flow information",
                ].map((step, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50/70 border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all group"
                  >
                    <span className="flex-shrink-0 w-7 h-7 rounded-xl bg-indigo-600 text-white text-xs font-extrabold flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                      {i + 1}
                    </span>
                    <span className="text-xs font-medium text-slate-800 leading-snug">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={() => window.dispatchEvent(new CustomEvent("openTrialModal"))}
                className="h-12 rounded-full bg-slate-950 px-8 text-sm font-bold text-white shadow-lg hover:-translate-y-0.5 hover:bg-slate-800 transition-transform"
              >
                Book a Free Demo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                onClick={() => window.dispatchEvent(new CustomEvent("openTrialModal"))}
                className="h-12 rounded-full border-slate-300 text-slate-800 hover:bg-slate-50 px-8 text-sm font-bold"
              >
                Start 30 Day Free Trial
              </Button>
            </div>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────────────────── */}
        <section className="py-16 px-4 sm:px-6 border-t border-slate-100">
          <div className="max-w-3xl mx-auto space-y-10">
            <div className="text-center space-y-4">
              <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-widest">FAQ</span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-950">
                Frequently Asked Questions
              </h2>
            </div>

            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((faq, i) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="bg-white border border-slate-200/80 rounded-2xl px-5 shadow-sm overflow-hidden"
                >
                  <AccordionTrigger className="text-sm font-bold text-slate-950 py-4 hover:no-underline text-left">
                    <div className="flex items-start gap-3">
                      <HelpCircle className="h-4 w-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                      <span>{faq.q}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-sm font-medium text-slate-600 leading-relaxed pb-4 pl-7">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* ── Final CTA ────────────────────────────────────────────────────── */}
        <section className="py-20 px-4 sm:px-6 border-t border-slate-100 bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl" />
            <div className="absolute -bottom-12 -left-12 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
          </div>

          <div className="relative max-w-3xl mx-auto text-center space-y-8">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/10 text-xs font-bold text-white/80 uppercase tracking-widest">
                <Sparkles className="h-3.5 w-3.5" />
                AIBASS Cash Flow Forecasting
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
                Plan Ahead with Better Cash Flow Visibility
              </h2>
              <p className="text-sm sm:text-base font-medium text-white/70 leading-relaxed">
                See beyond today's financial position and prepare for what may come next. AIBASS cash flow forecasting software uses category-wise bookkeeping data, AI driven predictions, automatic updates and flexible forecast periods of up to one year to help businesses plan with greater financial visibility. Access supported cash flow insights through simple text or voice commands while keeping forecasting connected with your broader accounting workflow.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={() => window.dispatchEvent(new CustomEvent("openTrialModal"))}
                className="h-12 rounded-full bg-white text-slate-950 px-8 text-sm font-bold shadow-lg hover:-translate-y-0.5 hover:bg-slate-100 transition-transform"
              >
                Start 30 Day Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                onClick={() => window.dispatchEvent(new CustomEvent("openTrialModal"))}
                className="h-12 rounded-full bg-transparent border border-white/40 text-white hover:bg-white/10 px-8 text-sm font-bold transition-colors"
              >
                Book a Free Demo
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Back to top */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-6 right-6 w-11 h-11 rounded-full bg-slate-950 text-white flex items-center justify-center shadow-lg hover:-translate-y-0.5 transition-transform z-50"
          >
            <ArrowUp className="h-4 w-4" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CashFlowForecastingSoftware;
