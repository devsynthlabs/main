import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Mic, 
  BarChart3, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2,
  ShieldCheck, 
  Zap, 
  TrendingUp, 
  Calculator, 
  HelpCircle, 
  ArrowUp,
  Layers,
  Check,
  PieChart,
  LineChart,
  FileSpreadsheet,
  DollarSign,
  Activity,
  Calendar,
  Clock,
  FileText,
  Boxes,
  Receipt,
  ArrowRightLeft,
  XCircle,
  BrainCircuit,
  TrendingDown,
  Scale,
  Award,
  Star,
  MessageSquare,
  BookOpen,
  Store,
  Rocket,
  Building,
  ShoppingBag,
  Briefcase,
  Factory,
  HardHat,
  Cloud,
  Server,
  Eye,
  type LucideIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { TrialFormModal } from "@/components/TrialFormModal";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface CommandItem {
  userCommand: string;
  aibassResponse: string;
}

interface ReportCategory {
  id: string;
  category: string;
  badge: string;
  icon: LucideIcon;
  iconBg: string;
  badgeColor: string;
  accentBorder: string;
  commands: CommandItem[];
}

const AnimatedReportingCommandCard = ({ category }: { category: ReportCategory }) => {
  const [isInView, setIsInView] = useState(false);
  const [typedText1, setTypedText1] = useState("");
  const [stage1, setStage1] = useState<"typing" | "thinking" | "done">("typing");
  const [typedText2, setTypedText2] = useState("");
  const [stage2, setStage2] = useState<"typing" | "thinking" | "done">("typing");

  const fullCommand1 = `“${category.commands[0]?.userCommand || ""}”`;
  const fullCommand2 = `“${category.commands[1]?.userCommand || ""}”`;

  const runAnimation = () => {
    setTypedText1("");
    setStage1("typing");
    setTypedText2("");
    setStage2("typing");

    // Command 1 typewriter
    let idx1 = 0;
    const interval1 = setInterval(() => {
      if (idx1 <= fullCommand1.length) {
        setTypedText1(fullCommand1.slice(0, idx1));
        idx1++;
      } else {
        clearInterval(interval1);
        setStage1("thinking");
        setTimeout(() => {
          setStage1("done");
          
          // Start Command 2 typewriter
          let idx2 = 0;
          const interval2 = setInterval(() => {
            if (idx2 <= fullCommand2.length) {
              setTypedText2(fullCommand2.slice(0, idx2));
              idx2++;
            } else {
              clearInterval(interval2);
              setStage2("thinking");
              setTimeout(() => {
                setStage2("done");
              }, 900);
            }
          }, 30);
        }, 800);
      }
    }, 30);
  };

  useEffect(() => {
    if (isInView) {
      runAnimation();
    }
  }, [isInView]);

  return (
    <motion.div
      onViewportEnter={() => setIsInView(true)}
      viewport={{ once: false, amount: 0.2 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      className={`bg-white rounded-[32px] border border-slate-200/90 p-6 sm:p-7 shadow-xs hover:shadow-xl ${category.accentBorder} transition-all duration-300 group relative flex flex-col justify-between overflow-hidden`}
    >
      <div>
        {/* Card Category Header */}
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className={`h-11 w-11 rounded-2xl flex items-center justify-center shadow-xs transition-transform group-hover:scale-105 ${category.iconBg}`}>
              <category.icon className="h-5 w-5" />
            </div>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-950">
              {category.category}
            </h3>
          </div>
          <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full border ${category.badgeColor}`}>
            {category.badge}
          </span>
        </div>

        {/* Commands Dialogue List */}
        <div className="space-y-4">
          
          {/* Command 1 */}
          <div className="space-y-2 rounded-2xl bg-slate-50/80 border border-slate-200/70 p-4 transition-colors group-hover:bg-slate-50/95">
            {/* User Command Box */}
            <div className="bg-indigo-50/70 border border-indigo-100/90 rounded-xl p-3 shadow-2xs space-y-1 relative min-h-[78px] flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-700 flex items-center gap-1.5">
                  <MessageSquare className="h-3 w-3 text-indigo-600" />
                  User command
                </span>
                <span className="text-[9px] font-bold text-indigo-600 bg-white px-2 py-0.5 rounded-full border border-indigo-200/80">
                  Voice / Text
                </span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                {typedText1}
                {stage1 === "typing" && (
                  <span className="inline-block w-1.5 h-3.5 bg-indigo-600 ml-0.5 animate-pulse" />
                )}
              </p>

              {/* AI Thinking indicator */}
              {stage1 === "thinking" && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 text-[11px] font-semibold text-indigo-700 pt-0.5"
                >
                  <Sparkles className="h-3 w-3 animate-spin text-indigo-600" />
                  <span>Processing financial query...</span>
                  <div className="flex gap-0.5 items-center ml-1">
                    <span className="w-1 h-1 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1 h-1 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1 h-1 bg-indigo-600 rounded-full animate-bounce" />
                  </div>
                </motion.div>
              )}
            </div>

            {/* AIBASS Response Box */}
            <div className="bg-white border border-slate-200/80 rounded-xl p-3 shadow-2xs space-y-1 min-h-[68px] flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                  <Sparkles className="h-3 w-3 text-emerald-600" />
                  AIBASS response
                </span>
                {stage1 === "done" && (
                  <motion.span 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1"
                  >
                    <Check className="h-2.5 w-2.5" /> Instant Insight
                  </motion.span>
                )}
              </div>
              {stage1 === "done" ? (
                <motion.p 
                  initial={{ opacity: 0, y: 3 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="text-xs font-medium text-slate-700 leading-relaxed"
                >
                  {category.commands[0]?.aibassResponse}
                </motion.p>
              ) : (
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 italic py-1">
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse" />
                  <span>Waiting for command execution...</span>
                </div>
              )}
            </div>
          </div>

          {/* Command 2 */}
          <div className="space-y-2 rounded-2xl bg-slate-50/80 border border-slate-200/70 p-4 transition-colors group-hover:bg-slate-50/95">
            {/* User Command Box */}
            <div className="bg-indigo-50/70 border border-indigo-100/90 rounded-xl p-3 shadow-2xs space-y-1 relative min-h-[78px] flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-700 flex items-center gap-1.5">
                  <Mic className="h-3 w-3 text-indigo-600" />
                  User command
                </span>
                <span className="text-[9px] font-bold text-indigo-600 bg-white px-2 py-0.5 rounded-full border border-indigo-200/80">
                  Voice / Text
                </span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                {typedText2}
                {stage2 === "typing" && stage1 === "done" && (
                  <span className="inline-block w-1.5 h-3.5 bg-indigo-600 ml-0.5 animate-pulse" />
                )}
              </p>

              {/* AI Thinking indicator */}
              {stage2 === "thinking" && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 text-[11px] font-semibold text-indigo-700 pt-0.5"
                >
                  <Sparkles className="h-3 w-3 animate-spin text-indigo-600" />
                  <span>Preparing financial statement...</span>
                  <div className="flex gap-0.5 items-center ml-1">
                    <span className="w-1 h-1 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1 h-1 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1 h-1 bg-indigo-600 rounded-full animate-bounce" />
                  </div>
                </motion.div>
              )}
            </div>

            {/* AIBASS Response Box */}
            <div className="bg-white border border-slate-200/80 rounded-xl p-3 shadow-2xs space-y-1 min-h-[68px] flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                  <Sparkles className="h-3 w-3 text-emerald-600" />
                  AIBASS response
                </span>
                {stage2 === "done" && (
                  <motion.span 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1"
                  >
                    <Check className="h-2.5 w-2.5" /> Instant Insight
                  </motion.span>
                )}
              </div>
              {stage2 === "done" ? (
                <motion.p 
                  initial={{ opacity: 0, y: 3 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="text-xs font-medium text-slate-700 leading-relaxed"
                >
                  {category.commands[1]?.aibassResponse}
                </motion.p>
              ) : (
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 italic py-1">
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse" />
                  <span>Waiting for command execution...</span>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Footer Tag & Replay */}
      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-500">
        <span className="flex items-center gap-1.5 text-slate-600">
          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          Available in Web & Mobile
        </span>
        <button
          onClick={runAnimation}
          className="text-[11px] font-extrabold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1 cursor-pointer"
          title="Replay query simulation"
        >
          <Sparkles className="h-3 w-3" /> Replay
        </button>
      </div>

    </motion.div>
  );
};

export const AiFinancialReportingSoftware = () => {
  const navigate = useNavigate();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    document.title = "AI Financial Reporting Software for Clearer Business Decisions | AIBASS";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Make faster, smarter financial decisions with AI-powered real-time financial reporting software. Track performance, manage cash flow, and generate P&L, balance sheets, and cash flow forecasts using text or voice commands."
      );
    }
    
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const openTrialModal = () => {
    window.dispatchEvent(new CustomEvent("openTrialModal"));
  };

  // Section 1 Highlights List
  const productHighlights = [
    "Text and voice report commands",
    "Monthly profit and loss statements",
    "Updated balance sheet information",
    "Category wise financial views",
    "Cash flow statements",
    "AI driven cash flow predictions"
  ];

  // Section 3 Detailed Features List
  const featuresList = [
    {
      id: "text-voice-commands",
      icon: Mic,
      title: "Text and Voice Report Commands",
      badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-100",
      iconBg: "bg-indigo-50 border border-indigo-100/80 text-indigo-600",
      desc: "Type your command or speak your instruction to request supported financial reports.",
      detail: "Users can ask AIBASS to show monthly expenses, generate a profit and loss statement, display balance sheet information or review expected cash availability."
    },
    {
      id: "monthly-pnl",
      icon: LineChart,
      title: "Monthly Profit and Loss Statements",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-100",
      iconBg: "bg-emerald-50 border border-emerald-100/80 text-emerald-600",
      desc: "Generate monthly profit and loss statements using available income and expense records.",
      detail: "The report helps business owners understand monthly revenue, operating costs and whether the company recorded a profit or loss."
    },
    {
      id: "balance-sheet",
      icon: Scale,
      title: "Updated Balance Sheet Information",
      badgeColor: "bg-sky-50 text-sky-700 border-sky-100",
      iconBg: "bg-sky-50 border border-sky-100/80 text-sky-600",
      desc: "Review available information about business assets, liabilities, account balances and the company’s current financial position.",
      detail: "This helps business owners understand what the company owns and what it owes."
    },
    {
      id: "category-views",
      icon: PieChart,
      title: "Category Wise Financial Views",
      badgeColor: "bg-purple-50 text-purple-700 border-purple-100",
      iconBg: "bg-purple-50 border border-purple-100/80 text-purple-600",
      desc: "Organise income and expenses into relevant categories to understand which business activities are influencing financial performance.",
      detail: "Users can identify high spending areas, important revenue sources and changes in operating costs."
    },
    {
      id: "cash-flow-statements",
      icon: ArrowRightLeft,
      title: "Cash Flow Statements",
      badgeColor: "bg-amber-50 text-amber-700 border-amber-100",
      iconBg: "bg-amber-50 border border-amber-100/80 text-amber-600",
      desc: "Review available incoming and outgoing cash activity to understand how money moves through the business.",
      detail: "Cash flow information supports expense planning, payment management and short term financial decisions."
    },
    {
      id: "cash-flow-predictions",
      icon: BrainCircuit,
      title: "AI Driven Cash Flow Predictions",
      badgeColor: "bg-rose-50 text-rose-700 border-rose-100",
      iconBg: "bg-rose-50 border border-rose-100/80 text-rose-600",
      desc: "Use available financial information to estimate possible future cash availability and identify periods where financial pressure may develop.",
      detail: "Predictions should be reviewed alongside confirmed payments, expected collections and current business conditions."
    }
  ];

  // Section 5 Simple Commands List
  const reportCommandsList = [
    {
      id: "pnl-commands",
      category: "Profit and Loss Commands",
      badge: "Income & Profitability",
      icon: LineChart,
      iconBg: "bg-emerald-50 text-emerald-600 border border-emerald-100/80",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-100",
      accentBorder: "group-hover:border-emerald-300",
      commands: [
        {
          userCommand: "Generate my profit and loss statement for this month.",
          aibassResponse: "The platform displays available monthly income, expenses and the resulting profit or loss."
        },
        {
          userCommand: "Compare my income and expenses for this month.",
          aibassResponse: "The platform presents the available income and expense information for the selected period."
        }
      ]
    },
    {
      id: "balance-sheet-commands",
      category: "Balance Sheet Commands",
      badge: "Assets & Liabilities",
      icon: Scale,
      iconBg: "bg-sky-50 text-sky-600 border border-sky-100/80",
      badgeColor: "bg-sky-50 text-sky-700 border-sky-100",
      accentBorder: "group-hover:border-sky-300",
      commands: [
        {
          userCommand: "Show my current balance sheet.",
          aibassResponse: "The platform displays available asset, liability and account balance information."
        },
        {
          userCommand: "Show the changes in my financial position.",
          aibassResponse: "The platform presents relevant balance information available for comparison."
        }
      ]
    },
    {
      id: "expense-report-commands",
      category: "Expense Report Commands",
      badge: "Cost Breakdown",
      icon: PieChart,
      iconBg: "bg-purple-50 text-purple-600 border border-purple-100/80",
      badgeColor: "bg-purple-50 text-purple-700 border-purple-100",
      accentBorder: "group-hover:border-purple-300",
      commands: [
        {
          userCommand: "Show my highest expense categories.",
          aibassResponse: "The platform displays available expenses organised by category."
        },
        {
          userCommand: "Show my operating expenses for this month.",
          aibassResponse: "The platform presents the available operating expense information for the selected month."
        }
      ]
    },
    {
      id: "cash-flow-commands",
      category: "Cash Flow Commands",
      badge: "Cash Flow & Forecasting",
      icon: ArrowRightLeft,
      iconBg: "bg-amber-50 text-amber-600 border border-amber-100/80",
      badgeColor: "bg-amber-50 text-amber-700 border-amber-100",
      accentBorder: "group-hover:border-amber-300",
      commands: [
        {
          userCommand: "Show my current cash flow.",
          aibassResponse: "The platform displays available incoming and outgoing cash information."
        },
        {
          userCommand: "Show my expected cash position.",
          aibassResponse: "The platform provides a cash flow prediction using available financial information."
        }
      ]
    }
  ];

  // Section 6 Financial Statements Data
  const financialStatements = [
    {
      id: "pnl-statement",
      title: "Monthly Profit and Loss Statement",
      icon: LineChart,
      iconBg: "bg-emerald-50 text-emerald-600 border border-emerald-100/80",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-100",
      accentBorder: "hover:border-emerald-300",
      desc: "The monthly profit and loss statement summarises the income and expenses recorded during a selected month.",
      checklistTitle: "Review Monthly Performance",
      items: [
        "Total business income",
        "Operating expenses",
        "Monthly profit or loss",
        "Category wise income",
        "Category wise expenses",
        "Major cost movements",
        "Changes in financial performance"
      ],
      takeaway: "The report helps business owners determine whether the company earned a profit or recorded a loss during the selected month. It also makes it easier to identify high expense categories and understand changes in monthly performance.",
      ctaText: "Review Monthly Financial Performance",
      hasCta: true
    },
    {
      id: "balance-sheet",
      title: "Balance Sheet Information",
      icon: Scale,
      iconBg: "bg-sky-50 text-sky-600 border border-sky-100/80",
      badgeColor: "bg-sky-50 text-sky-700 border-sky-100",
      accentBorder: "hover:border-sky-300",
      desc: "The balance sheet provides a structured view of the company’s available assets, liabilities and relevant account balances.",
      checklistTitle: "Understand Your Financial Position",
      items: [
        "Business assets",
        "Business liabilities",
        "Relevant account balances",
        "Current financial position",
        "Period based information",
        "Changes in financial balances"
      ],
      takeaway: "This report helps users understand what the business owns, what it owes and how its financial position changes over time.",
      hasCta: false
    },
    {
      id: "category-reports",
      title: "Category Wise Financial Reports",
      icon: PieChart,
      iconBg: "bg-purple-50 text-purple-600 border border-purple-100/80",
      badgeColor: "bg-purple-50 text-purple-700 border-purple-100",
      accentBorder: "hover:border-purple-300",
      desc: "AIBASS organises income and expenses into relevant business categories.",
      checklistTitle: "Review Financial Categories",
      items: [
        "Income categories",
        "Expense categories",
        "Operating costs",
        "Payroll related costs",
        "Inventory purchases",
        "Tax related amounts",
        "High spending areas",
        "Important financial changes"
      ],
      takeaway: "Category wise reporting helps users move beyond total figures and understand which activities have the greatest effect on business performance.",
      hasCta: false
    },
    {
      id: "cash-flow-statement",
      title: "Cash Flow Statement",
      icon: ArrowRightLeft,
      iconBg: "bg-amber-50 text-amber-600 border border-amber-100/80",
      badgeColor: "bg-amber-50 text-amber-700 border-amber-100",
      accentBorder: "hover:border-amber-300",
      desc: "The cash flow statement shows available incoming and outgoing financial activity.",
      checklistTitle: "Review Cash Movement",
      items: [
        "Incoming cash activity",
        "Outgoing business expenses",
        "Current cash movement",
        "Major payment activity",
        "Expense related cash usage",
        "Available cash information"
      ],
      takeaway: "This helps business owners understand whether sufficient cash is available to manage ongoing expenses and payments.",
      hasCta: false
    }
  ];

  const cashFlowPredictionFeature = {
    title: "Cash Flow Predictions",
    desc: "AIBASS uses available financial information to provide AI driven cash flow predictions.",
    checklistTitle: "Plan for Future Requirements",
    items: [
      "Expected cash availability",
      "Potential future shortages",
      "Upcoming financial requirements",
      "Expense planning information",
      "Payment preparation",
      "Investment planning support"
    ],
    takeaway: "Cash flow predictions provide earlier visibility into possible financial pressure and support more informed planning.",
    ctaText: "Explore Cash Flow Forecasting Software"
  };

  // Section 7 How AIBASS Financial Reporting Works Steps
  const reportingWorkflowSteps = [
    {
      step: "01",
      title: "Record Business Transactions",
      desc: "Enter supported sales, purchases, income, expenses, payroll and inventory activity.",
      icon: FileText,
      iconBg: "bg-indigo-50 border border-indigo-100/80 text-indigo-600",
      badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-100"
    },
    {
      step: "02",
      title: "Organise Financial Information",
      desc: "AIBASS connects available transaction information with relevant bookkeeping records.",
      icon: Layers,
      iconBg: "bg-sky-50 border border-sky-100/80 text-sky-600",
      badgeColor: "bg-sky-50 text-sky-700 border-sky-100"
    },
    {
      step: "03",
      title: "Update Connected Records",
      desc: "Related invoice, GST, inventory and payroll information is updated where applicable.",
      icon: ArrowRightLeft,
      iconBg: "bg-purple-50 border border-purple-100/80 text-purple-600",
      badgeColor: "bg-purple-50 text-purple-700 border-purple-100"
    },
    {
      step: "04",
      title: "Prepare Financial Information",
      desc: "Available income, expenses, assets, liabilities and cash flow records are organised for reporting.",
      icon: Scale,
      iconBg: "bg-emerald-50 border border-emerald-100/80 text-emerald-600",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-100"
    },
    {
      step: "05",
      title: "Generate Financial Reports",
      desc: "Access monthly profit and loss statements, balance sheet information, category wise views and cash flow reports.",
      icon: BarChart3,
      iconBg: "bg-amber-50 border border-amber-100/80 text-amber-600",
      badgeColor: "bg-amber-50 text-amber-700 border-amber-100"
    },
    {
      step: "06",
      title: "Request Specific Information",
      desc: "Type a command or speak an instruction to access the supported report or financial information you need.",
      icon: Mic,
      iconBg: "bg-rose-50 border border-rose-100/80 text-rose-600",
      badgeColor: "bg-rose-50 text-rose-700 border-rose-100"
    },
    {
      step: "07",
      title: "Review the Report",
      desc: "Check the underlying information and calculations before using the report for important business decisions.",
      icon: ShieldCheck,
      iconBg: "bg-blue-50 border border-blue-100/80 text-blue-600",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-100"
    }
  ];

  // Section 8 Keep Financial Reports Connected Data
  const connectedFeatures = [
    {
      id: "ai-bookkeeping",
      title: "AI Bookkeeping",
      icon: BookOpen,
      iconBg: "bg-blue-50 text-blue-600 border border-blue-100/80",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-100",
      accentBorder: "hover:border-blue-300",
      paragraphs: [
        "Available income, expenses, sales and purchase records provide the foundation for financial reporting.",
        "Organised bookkeeping information can be used to generate monthly statements and category wise reports."
      ],
      ctaText: "Explore AI Bookkeeping Software",
      ctaLink: "/product"
    },
    {
      id: "ai-invoicing",
      title: "AI Invoicing",
      icon: FileText,
      iconBg: "bg-indigo-50 text-indigo-600 border border-indigo-100/80",
      badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-100",
      accentBorder: "hover:border-indigo-300",
      paragraphs: [
        "Supported customer invoices provide sales, GST and transaction information that affects monthly income and financial performance.",
        "AIBASS can connect relevant invoice details with financial records."
      ],
      ctaText: "Explore AI Invoicing Software",
      ctaLink: "/ai-invoicing-software"
    },
    {
      id: "gst-calculations",
      title: "GST Calculations",
      icon: Calculator,
      iconBg: "bg-emerald-50 text-emerald-600 border border-emerald-100/80",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-100",
      accentBorder: "hover:border-emerald-300",
      paragraphs: [
        "Applicable CGST, SGST and IGST values from supported sales invoices can be included within relevant financial information.",
        "Businesses should verify tax information before using it for filings or compliance activities."
      ],
      ctaText: "Explore GST Accounting Software",
      ctaLink: "/tax-gst"
    },
    {
      id: "inventory-information",
      title: "Inventory Information",
      icon: Boxes,
      iconBg: "bg-amber-50 text-amber-600 border border-amber-100/80",
      badgeColor: "bg-amber-50 text-amber-700 border-amber-100",
      accentBorder: "hover:border-amber-300",
      paragraphs: [
        "Supported purchases and sales can update relevant stock quantities and inventory related financial information.",
        "This helps users understand how inventory activity influences expenses, revenue and business performance."
      ],
      ctaText: "Explore Inventory Management Software",
      ctaLink: "/inventory"
    },
    {
      id: "payroll-information",
      title: "Payroll Information",
      icon: Activity,
      iconBg: "bg-purple-50 text-purple-600 border border-purple-100/80",
      badgeColor: "bg-purple-50 text-purple-700 border-purple-100",
      accentBorder: "hover:border-purple-300",
      paragraphs: [
        "Salary calculations, deductions, employee payment information and payroll related expenses can be connected with financial records.",
        "This helps businesses understand how payroll costs affect monthly expenses and cash flow."
      ],
      ctaText: "Explore Payroll Software",
      ctaLink: "/payroll"
    }
  ];

  // Section 9 Benefits of AI Financial Reporting Software
  const benefitsList = [
    {
      id: "reduce-manual",
      title: "Reduce Manual Report Preparation",
      desc: "Use connected financial information to reduce the need to collect and organise every report through separate spreadsheets.",
      icon: FileSpreadsheet,
      iconBg: "bg-indigo-50 border border-indigo-100/80 text-indigo-600",
      accentBorder: "hover:border-indigo-300"
    },
    {
      id: "access-faster",
      title: "Access Reports Faster",
      desc: "Request supported financial statements and business information using simple text or voice commands.",
      icon: Zap,
      iconBg: "bg-amber-50 border border-amber-100/80 text-amber-600",
      accentBorder: "hover:border-amber-300"
    },
    {
      id: "understand-performance",
      title: "Understand Business Performance",
      desc: "Review income, expenses, profit, financial position and cash flow through structured reports.",
      icon: LineChart,
      iconBg: "bg-emerald-50 border border-emerald-100/80 text-emerald-600",
      accentBorder: "hover:border-emerald-300"
    },
    {
      id: "identify-changes",
      title: "Identify Important Financial Changes",
      desc: "Use category wise views to identify high expenses, changing costs and major income sources.",
      icon: PieChart,
      iconBg: "bg-purple-50 border border-purple-100/80 text-purple-600",
      accentBorder: "hover:border-purple-300"
    },
    {
      id: "improve-visibility",
      title: "Improve Financial Visibility",
      desc: "Bring available transaction, invoice, inventory, payroll and financial statement information into one platform.",
      icon: Layers,
      iconBg: "bg-sky-50 border border-sky-100/80 text-sky-600",
      accentBorder: "hover:border-sky-300"
    },
    {
      id: "better-decisions",
      title: "Support Better Decisions",
      desc: "Use current financial reports and cash flow predictions to support budgeting, spending and business planning.",
      icon: BrainCircuit,
      iconBg: "bg-rose-50 border border-rose-100/80 text-rose-600",
      accentBorder: "hover:border-rose-300"
    },
    {
      id: "users-control",
      title: "Keep Users in Control",
      desc: "Review reports, calculations and underlying financial information before using them for important decisions.",
      icon: ShieldCheck,
      iconBg: "bg-blue-50 border border-blue-100/80 text-blue-600",
      accentBorder: "hover:border-blue-300"
    }
  ];

  // Section 10 AI Financial Reporting for Different Businesses
  const industrySolutions = [
    {
      id: "small-business",
      title: "Small Businesses",
      desc: "Generate monthly financial statements and understand income, expenses and profitability without relying on multiple spreadsheets.",
      icon: Store,
      iconBg: "bg-blue-50 border border-blue-100/80 text-blue-600",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-100",
      accentBorder: "hover:border-blue-300"
    },
    {
      id: "startups",
      title: "Startups",
      desc: "Monitor spending, monthly profit, cash availability and financial position while the business grows.",
      icon: Rocket,
      iconBg: "bg-indigo-50 border border-indigo-100/80 text-indigo-600",
      badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-100",
      accentBorder: "hover:border-indigo-300"
    },
    {
      id: "smes",
      title: "Small and Medium Enterprises",
      desc: "Manage increasing volumes of transactions and access organised financial information through connected reports.",
      icon: Building,
      iconBg: "bg-sky-50 border border-sky-100/80 text-sky-600",
      badgeColor: "bg-sky-50 text-sky-700 border-sky-100",
      accentBorder: "hover:border-sky-300"
    },
    {
      id: "retailers-traders",
      title: "Retailers and Traders",
      desc: "Connect product sales, purchases, GST values and inventory activity with monthly financial reporting.",
      icon: ShoppingBag,
      iconBg: "bg-emerald-50 border border-emerald-100/80 text-emerald-600",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-100",
      accentBorder: "hover:border-emerald-300"
    },
    {
      id: "services",
      title: "Service Businesses",
      desc: "Review customer income, operating expenses, payroll costs and cash flow without unnecessary inventory reporting.",
      icon: Briefcase,
      iconBg: "bg-amber-50 border border-amber-100/80 text-amber-600",
      badgeColor: "bg-amber-50 text-amber-700 border-amber-100",
      accentBorder: "hover:border-amber-300"
    },
    {
      id: "manufacturing",
      title: "Manufacturing Businesses",
      desc: "Connect purchases, inventory activity, payroll, sales and GST information with business financial reports.",
      icon: Factory,
      iconBg: "bg-purple-50 border border-purple-100/80 text-purple-600",
      badgeColor: "bg-purple-50 text-purple-700 border-purple-100",
      accentBorder: "hover:border-purple-300"
    },
    {
      id: "construction-civil",
      title: "Construction and Civil Engineering Businesses",
      desc: "Review available income, expenses, budgets and financial performance alongside supported project scheduling activities.",
      icon: HardHat,
      iconBg: "bg-rose-50 border border-rose-100/80 text-rose-600",
      badgeColor: "bg-rose-50 text-rose-700 border-rose-100",
      accentBorder: "hover:border-rose-300"
    }
  ];

  // Section 11 AIBASS Versus Manual Financial Reporting
  const financialComparisons = [
    {
      aspect: "Report Preparation",
      manual: "Users may need to collect information from different spreadsheets and software platforms.",
      aibass: "Supported financial records remain connected and can be used to generate available reports."
    },
    {
      aspect: "Accessing Financial Information",
      manual: "Users may need to prepare a complete report before answering a specific financial question.",
      aibass: "Users can request supported information through text or voice commands."
    },
    {
      aspect: "Profit and Loss Reporting",
      manual: "Income and expenses may need to be collected and calculated separately.",
      aibass: "Available income and expense records can be organised into monthly profit and loss statements."
    },
    {
      aspect: "Balance Sheet Preparation",
      manual: "Assets, liabilities and balances may need to be compiled manually.",
      aibass: "Available accounting records can be presented through updated balance sheet information."
    },
    {
      aspect: "Expense Analysis",
      manual: "Users may need to categorise and compare expenses through spreadsheets.",
      aibass: "Available expenses can be displayed through category wise financial views."
    },
    {
      aspect: "Cash Flow Planning",
      manual: "Future cash pressure may become visible only after financial difficulties develop.",
      aibass: "AI driven cash flow predictions provide earlier visibility into possible future requirements."
    }
  ];

  // Section 12 Why Choose AIBASS Financial Reporting Software
  const whyChooseReasons = [
    {
      id: "monthly-visibility",
      title: "Monthly Financial Visibility",
      desc: "Access supported financial reports throughout the year to understand how your business is performing month by month.",
      icon: Eye,
      iconBg: "bg-indigo-50 border border-indigo-100/80 text-indigo-600",
      accentBorder: "hover:border-indigo-300"
    },
    {
      id: "essential-statements",
      title: "Essential Financial Statements",
      desc: "Review monthly profit and loss statements, balance sheet information and cash flow reports from connected accounting information.",
      icon: FileSpreadsheet,
      iconBg: "bg-sky-50 border border-sky-100/80 text-sky-600",
      accentBorder: "hover:border-sky-300"
    },
    {
      id: "assets-liabilities-equity",
      title: "Assets, Liabilities and Equity",
      desc: "Understand your balance sheet through the three fundamental areas that help explain the financial position of the business.",
      icon: Scale,
      iconBg: "bg-emerald-50 border border-emerald-100/80 text-emerald-600",
      accentBorder: "hover:border-emerald-300"
    },
    {
      id: "simple-access",
      title: "Simple Report Access",
      desc: "Use text or voice commands to request supported financial reports without navigating multiple accounting menus.",
      icon: Mic,
      iconBg: "bg-amber-50 border border-amber-100/80 text-amber-600",
      accentBorder: "hover:border-amber-300"
    },
    {
      id: "connected-info",
      title: "Connected Financial Information",
      desc: "Keep bookkeeping, invoices, GST, inventory, payroll and reporting information connected within one AI accounting platform.",
      icon: Layers,
      iconBg: "bg-purple-50 border border-purple-100/80 text-purple-600",
      accentBorder: "hover:border-purple-300"
    },
    {
      id: "cash-flow-insights",
      title: "AI Supported Cash Flow Insights",
      desc: "Use available bookkeeping information to understand possible future cash requirements and financial pressure.",
      icon: TrendingUp,
      iconBg: "bg-rose-50 border border-rose-100/80 text-rose-600",
      accentBorder: "hover:border-rose-300"
    },
    {
      id: "aws-infrastructure",
      title: "Built on AWS Infrastructure",
      desc: "AIBASS runs on AWS infrastructure to support its cloud-based financial reporting, connected accounting information and AI driven financial workflows.",
      icon: Cloud,
      iconBg: "bg-blue-50 border border-blue-100/80 text-blue-600",
      accentBorder: "hover:border-blue-300"
    },
    {
      id: "review-control",
      title: "Review Before Important Decisions",
      desc: "Maintain user control by reviewing reports, calculations and underlying information before using them for significant business decisions.",
      icon: ShieldCheck,
      iconBg: "bg-teal-50 border border-teal-100/80 text-teal-600",
      accentBorder: "hover:border-teal-300"
    }
  ];

  const faqs = [
    {
      question: "What Is AI Financial Reporting Software?",
      answer: "AI financial reporting software uses intelligent automation to organise financial information and present it through statements, reports and business insights."
    },
    {
      question: "How Does AIBASS Financial Reporting Work?",
      answer: "AIBASS uses available transaction and bookkeeping records to generate supported financial statements. Users can also request available reports using text or voice commands."
    },
    {
      question: "What Financial Reports Can AIBASS Generate?",
      answer: "AIBASS provides monthly profit and loss statements, balance sheet information, category wise financial views, cash flow statements and cash flow predictions."
    },
    {
      question: "Can I Generate Reports Using Text Commands?",
      answer: "Yes. Users can enter supported text commands to request financial reports and business information."
    },
    {
      question: "Can I Access Reports Using Voice Commands?",
      answer: "Yes. Users can speak supported instructions to access available statements and financial information."
    },
    {
      question: "Does AIBASS Generate Profit and Loss Statements?",
      answer: "Yes. AIBASS generates monthly profit and loss statements using available income and expense records."
    },
    {
      question: "Does AIBASS Provide Balance Sheet Information?",
      answer: "Yes. AIBASS displays available information about business assets, liabilities and relevant account balances."
    },
    {
      question: "Does AIBASS Provide Category Wise Reports?",
      answer: "Yes. Available income and expenses can be organised into relevant categories to make financial performance easier to understand."
    },
    {
      question: "Does AIBASS Provide Cash Flow Statements?",
      answer: "Yes. AIBASS provides cash flow information using available financial records."
    },
    {
      question: "Can AIBASS Predict Future Cash Flow?",
      answer: "AIBASS provides AI driven cash flow predictions based on available financial information. Predictions should be reviewed alongside confirmed payments and expected collections."
    },
    {
      question: "Is AIBASS Suitable for Small Businesses?",
      answer: "Yes. Small businesses can use AIBASS to access financial statements, monitor expenses and understand business performance."
    },
    {
      question: "Can AIBASS Replace an Accountant?",
      answer: "No. AIBASS simplifies supported financial reporting and makes information easier to access. Professional review may still be required for statutory reporting, tax matters and complex financial decisions."
    },
    {
      question: "Are AIBASS Reports Audit Ready?",
      answer: "AIBASS provides supported financial reports using the information available in the platform. Businesses should have important statements reviewed before using them for audits, compliance or statutory submissions."
    },
    {
      question: "Can I Try AIBASS Before Purchasing?",
      answer: "Yes. Businesses can explore available financial reporting and accounting capabilities through the 30 day free trial."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-500 selection:text-white">
      <Header />

      {/* SECTION 1: Redesigned Premium Hero Section (Light Studio 2-Column Theme) */}
      <section className="relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-24 bg-gradient-to-b from-slate-50 via-indigo-50/40 to-white text-slate-900 border-b border-slate-200/80">
        
        {/* Background Ambient Glow & Mesh Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] bg-gradient-to-tr from-indigo-200/40 via-sky-200/30 to-purple-200/30 blur-3xl pointer-events-none rounded-full" />
        <div className="absolute top-10 right-10 w-72 h-72 bg-indigo-300/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Headline, Subtitle, Copy & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              {/* Main H1 Title */}
              <motion.h1 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-950 leading-[1.14]"
              >
                AI Financial Reporting Software for{" "}
                <span className="bg-gradient-to-r from-indigo-600 via-sky-600 to-purple-600 bg-clip-text text-transparent">
                  Clearer Business Decisions
                </span>
              </motion.h1>

              {/* Subheading */}
              <motion.p 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-base sm:text-lg font-bold text-indigo-900 leading-snug"
              >
                Make faster, smarter financial decisions with AI-powered real-time reports.
              </motion.p>

              {/* Paragraph Description */}
              <motion.p 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal max-w-2xl"
              >
                AIBASS turns daily transactions into clear financial insights, helping you track performance, manage cash flow, and plan ahead using simple text or voice commands.
              </motion.p>

              {/* Feature Pills */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-2xl px-3.5 py-2 flex items-center gap-2 shadow-xs text-xs font-bold text-slate-800 hover:border-indigo-300 transition-all">
                  <div className="w-6 h-6 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <Mic className="h-3.5 w-3.5" />
                  </div>
                  <span>Voice & Text Commands</span>
                </div>

                <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-2xl px-3.5 py-2 flex items-center gap-2 shadow-xs text-xs font-bold text-slate-800 hover:border-indigo-300 transition-all">
                  <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <LineChart className="h-3.5 w-3.5" />
                  </div>
                  <span>Real-Time P&L & Balance Sheet</span>
                </div>

                <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-2xl px-3.5 py-2 flex items-center gap-2 shadow-xs text-xs font-bold text-slate-800 hover:border-indigo-300 transition-all">
                  <div className="w-6 h-6 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
                    <BrainCircuit className="h-3.5 w-3.5" />
                  </div>
                  <span>AI Cash Flow Predictions</span>
                </div>
              </div>

              {/* CTAs */}
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="pt-3 flex flex-wrap items-center gap-4"
              >
                <Button
                  onClick={openTrialModal}
                  size="lg"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-12 sm:h-13 px-7 sm:px-8 rounded-2xl flex items-center gap-2.5 transition-all shadow-md shadow-indigo-500/25 hover:shadow-lg hover:shadow-indigo-500/35 hover:scale-[1.01] text-sm sm:text-base cursor-pointer"
                >
                  Start your 30-day free trial
                  <ArrowRight className="h-4.5 w-4.5" />
                </Button>
                <Button
                  onClick={openTrialModal}
                  variant="outline"
                  size="lg"
                  className="border-2 border-indigo-200 hover:border-indigo-400 bg-white text-slate-900 font-bold h-12 sm:h-13 px-7 sm:px-8 rounded-2xl flex items-center gap-2.5 transition-all shadow-xs hover:bg-slate-50 text-sm sm:text-base cursor-pointer"
                >
                  Book a live demo
                  <Calendar className="h-4.5 w-4.5 text-indigo-600" />
                </Button>
              </motion.div>

              {/* Subtext Highlights */}
              <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500 pt-1">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>No credit card required</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>Instant setup in 2 mins</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-indigo-600" />
                  <span>256-bit security</span>
                </div>
              </div>

            </div>

            {/* Right Column: Live Financial Report Dashboard Graphic */}
            <div className="lg:col-span-5 relative flex justify-center">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="w-full max-w-[480px] rounded-3xl border border-slate-200/90 bg-white p-5 shadow-2xl relative overflow-hidden"
              >
                {/* Dashboard Header Bar */}
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="h-9 w-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm">
                      <BarChart3 className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                        AIBASS Financial Command
                      </h3>
                      <p className="text-[10px] font-bold text-slate-400">Live Executive Overview</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                    Live Synced
                  </span>
                </div>

                {/* Prompt Bar Simulation with Live Voice Equalizer */}
                <div className="p-3 rounded-2xl bg-slate-900 text-white mb-4 flex items-center justify-between gap-2 shadow-inner">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <Mic className="h-4 w-4 text-indigo-400 shrink-0" />
                    <span className="text-xs font-mono text-indigo-200 truncate">
                      "Show monthly P&L and cash flow forecast"
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <div className="flex items-center gap-0.5 h-3">
                      <span className="w-0.5 bg-emerald-400 h-full rounded-full animate-pulse" />
                      <span className="w-0.5 bg-emerald-400 h-2/3 rounded-full animate-pulse [animation-delay:0.2s]" />
                      <span className="w-0.5 bg-emerald-400 h-full rounded-full animate-pulse [animation-delay:0.4s]" />
                    </div>
                    <span className="text-[10px] font-bold bg-indigo-600 text-white px-2 py-0.5 rounded-md">
                      AI Active
                    </span>
                  </div>
                </div>

                {/* Live Financial Metrics Card Grid */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-50/80 to-white border border-indigo-100">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Monthly Revenue</p>
                    <p className="text-lg font-extrabold text-slate-900 mt-0.5">₹12,45,000</p>
                    <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded mt-1 inline-block">
                      +14.2% vs last mo
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-50/80 to-white border border-emerald-100">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Net Operating Profit</p>
                    <p className="text-lg font-extrabold text-slate-900 mt-0.5">₹8,26,500</p>
                    <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded mt-1 inline-block">
                      66.3% Net Margin
                    </span>
                  </div>
                </div>

                {/* Mini Cash Inflow vs Outflow Visualizer */}
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 mb-3 space-y-1.5">
                  <div className="flex justify-between items-center text-[10px] font-bold">
                    <span className="text-slate-600">Cash Inflow (Blue) vs Outflow (Gray)</span>
                    <span className="text-emerald-600 font-extrabold">+₹4.18L Net</span>
                  </div>
                  <div className="flex items-end justify-between gap-2 h-10 pt-1 px-1">
                    {[
                      { m: "Jan", r: 60, e: 38 },
                      { m: "Feb", r: 72, e: 44 },
                      { m: "Mar", r: 85, e: 50 },
                      { m: "Apr", r: 78, e: 46 },
                      { m: "May", r: 92, e: 48 },
                      { m: "Jun", r: 100, e: 52 },
                    ].map((b, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                        <div className="w-full flex items-end justify-center gap-0.5 h-6">
                          <motion.div 
                            initial={{ height: 0 }}
                            animate={{ height: `${b.r}%` }}
                            transition={{ duration: 0.8, delay: 0.2 + i * 0.07, ease: "easeOut" }}
                            className="w-full max-w-[6px] bg-indigo-600 rounded-t-xs"
                          />
                          <motion.div 
                            initial={{ height: 0 }}
                            animate={{ height: `${b.e}%` }}
                            transition={{ duration: 0.8, delay: 0.3 + i * 0.07, ease: "easeOut" }}
                            className="w-full max-w-[6px] bg-slate-300 rounded-t-xs"
                          />
                        </div>
                        <span className="text-[8px] font-bold text-slate-400">{b.m}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cash Runway Progress Box */}
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-slate-700">Estimated Cash Runway</span>
                    <span className="text-indigo-600 font-extrabold">8.4 Months (Healthy)</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "78%" }}
                      transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full" 
                    />
                  </div>
                </div>

                {/* Floating Glass Badge */}
                <motion.div 
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md border border-slate-200 rounded-xl p-2.5 shadow-xl flex items-center gap-2 text-xs font-bold text-slate-800"
                >
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span>Real-Time Reports Ready</span>
                </motion.div>

              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 1.5: Product Highlights */}
      <section id="highlights" className="py-12 md:py-16 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="bg-white border border-slate-200/80 rounded-[32px] p-6 md:p-10 shadow-[0_15px_40px_rgba(0,0,0,0.03)] space-y-6">
            
            <div className="text-center space-y-2">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                Product Highlights
              </h2>
              <div className="w-12 h-1 bg-indigo-600 rounded-full mx-auto" />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
              {productHighlights.map((highlight, index) => (
                <motion.div 
                  key={index} 
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: index * 0.05 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="flex items-center gap-3.5 bg-slate-50/80 hover:bg-indigo-50/40 hover:border-indigo-200 hover:shadow-md transition-all p-4 rounded-2xl border border-slate-200/80 group cursor-pointer"
                >
                  <div className="h-9 w-9 rounded-xl bg-indigo-50 border border-indigo-100/80 text-indigo-600 flex items-center justify-center shrink-0 transition-transform group-hover:scale-105">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-bold text-slate-800 leading-snug">
                    {highlight}
                  </span>
                </motion.div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 2: Know Your Business Financial Position Every Month */}
      {/* Visual UI Style: Unified Glassmorphic Pipeline Canvas */}
      <section className="pt-14 pb-10 md:pt-20 md:pb-12 bg-gradient-to-b from-white via-slate-50/60 to-indigo-50/30 relative overflow-hidden border-b border-slate-200/80">
        
        {/* Ambient Glow Accents */}
        <div className="absolute top-1/3 left-10 w-96 h-96 bg-indigo-200/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-sky-200/40 rounded-full blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          
          {/* Centered Executive Header Block */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3.5 py-1 rounded-full border border-indigo-100">
              <BarChart3 className="h-3.5 w-3.5 text-indigo-600" />
              Structured Financial Intelligence
            </div>

            <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl leading-tight">
              Know Your Business Financial Position{" "}
              <span className="bg-gradient-to-r from-indigo-600 via-sky-600 to-purple-600 bg-clip-text text-transparent">
                Every Month
              </span>
            </h2>

            <p className="text-base sm:text-lg font-bold text-slate-800 max-w-3xl mx-auto leading-snug">
              AIBASS gives business owners monthly visibility into financial performance using the bookkeeping and accounting information already available in the platform.
            </p>

            <p className="text-xs sm:text-sm font-medium text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Instead of relying only on financial statements prepared at year end or when required for tax, audit, lending, compliance or other formal purposes, owners can review profitability, financial position, spending and cash movement throughout the year.
            </p>

            {/* AIBASS Synthesis Callout Pill */}
            <div className="pt-2">
              <div className="inline-flex items-center gap-3 p-3.5 px-6 rounded-2xl bg-gradient-to-r from-indigo-50 via-sky-50 to-indigo-50 border border-indigo-200/80 text-xs font-extrabold text-indigo-950 shadow-xs max-w-3xl text-left sm:text-center">
                <div className="h-7 w-7 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Zap className="h-4 w-4" />
                </div>
                <span>This helps businesses understand their current financial condition between formal reporting periods and identify important changes earlier, without waiting for the next year end report.</span>
              </div>
            </div>
          </div>

          {/* Unified Visual Pipeline Canvas */}
          <div className="bg-white/90 border border-slate-200/90 rounded-[36px] p-6 sm:p-10 shadow-xl backdrop-blur-xl relative">
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              
              {/* Stage 1: Inputs (Left - 5 Cols) */}
              <div className="lg:col-span-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-indigo-600" />
                    <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-900">
                      Input Data Sources
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                    AIBASS converts your:
                  </span>
                </div>

                <div className="space-y-3">
                  {[
                    { title: "Sales transactions", icon: FileText, desc: "Customer invoices, cash sales & receipts" },
                    { title: "Expense entries", icon: Receipt, desc: "Vendor bills, petty cash & operational costs" },
                    { title: "GST calculations", icon: Calculator, desc: "CGST, SGST, IGST & Input Tax Credits" },
                    { title: "Inventory movements", icon: Boxes, desc: "Stock additions, deductions & valuations" }
                  ].map((item, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, x: -15 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.35, delay: idx * 0.08 }}
                      whileHover={{ x: 4 }}
                      className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-50/90 hover:bg-indigo-50/40 border border-slate-200/80 transition-all shadow-2xs"
                    >
                      <div className="h-10 w-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-800 shrink-0 shadow-2xs">
                        <item.icon className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <h4 className="text-xs font-extrabold text-slate-900">{item.title}</h4>
                        <p className="text-[11px] text-slate-500 font-semibold mt-0.5">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Stage 2: Central AI Processing Core (2 Cols) */}
              <div className="lg:col-span-2 flex flex-col items-center justify-center py-6 lg:py-0">
                <div className="relative flex flex-col items-center">
                  
                  {/* Outer pulse ring */}
                  <div className="absolute -inset-3 rounded-3xl bg-indigo-500/20 blur-md animate-pulse" />
                  
                  {/* AI Core Card */}
                  <motion.div 
                    animate={{ scale: [1, 1.04, 1] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="relative h-20 w-20 rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-slate-900 text-white flex flex-col items-center justify-center shadow-xl shadow-indigo-600/30 border border-indigo-400/40"
                  >
                    <BrainCircuit className="h-9 w-9 text-indigo-200" />
                  </motion.div>
                  
                  <div className="mt-3 text-center">
                    <span className="text-[11px] font-extrabold uppercase tracking-widest text-indigo-900 block">
                      AIBASS ENGINE
                    </span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                      Automated Synthesis
                    </span>
                  </div>

                  {/* Flow Arrow */}
                  <div className="mt-2 text-indigo-500 hidden lg:block">
                    <ArrowRight className="h-6 w-6 animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Stage 3: Outputs (Right - 5 Cols) */}
              <div className="lg:col-span-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-900">
                      Structured Insights
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    reports that help you:
                  </span>
                </div>

                <div className="space-y-3">
                  {[
                    { title: "Understand profitability trends", icon: TrendingUp, highlight: "Profit Margin Clarity" },
                    { title: "Monitor operational efficiency", icon: Activity, highlight: "Resource Optimization" },
                    { title: "Identify unnecessary spending", icon: TrendingDown, highlight: "Cost Reduction" },
                    { title: "Track business growth", icon: BarChart3, highlight: "Growth Trajectory" }
                  ].map((item, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, x: 15 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.35, delay: idx * 0.08 }}
                      whileHover={{ x: 4 }}
                      className="flex items-start gap-3.5 p-4 rounded-2xl bg-gradient-to-r from-emerald-50/60 to-white border border-emerald-200/80 transition-all shadow-2xs"
                    >
                      <div className="h-10 w-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                        <item.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-extrabold text-slate-900">{item.title}</h4>
                          <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                            {item.highlight}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Section 2 Key Takeaway Callout */}
          <div className="mt-8 rounded-3xl bg-gradient-to-r from-indigo-50/90 via-sky-50/50 to-purple-50/60 border border-indigo-100/90 p-6 sm:p-7 shadow-xs flex flex-col md:flex-row items-center justify-between gap-5 relative overflow-hidden">
            <div className="flex items-center gap-3.5">
              <div className="h-10 w-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-500/20">
                <Sparkles className="h-5 w-5" />
              </div>
              <p className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug">
                Instead of working with raw numbers, you get structured insights that guide decisions.
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 bg-white/90 px-3.5 py-1.5 rounded-full border border-indigo-100 shadow-2xs">
                <CheckCircle2 className="h-3.5 w-3.5 text-indigo-600" /> No spreadsheets
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-700 bg-white/90 px-3.5 py-1.5 rounded-full border border-sky-100 shadow-2xs">
                <CheckCircle2 className="h-3.5 w-3.5 text-sky-600" /> No manual report creation
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-white/90 px-3.5 py-1.5 rounded-full border border-emerald-100 shadow-2xs">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> No delays
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 3: Financial Reporting Backed by Recognized AI Expertise */}
      <section className="py-12 md:py-16 bg-white relative overflow-hidden border-b border-slate-200/80">
        
        {/* Soft Ambient Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[350px] bg-gradient-to-r from-blue-100/30 via-indigo-100/40 to-purple-100/30 blur-3xl pointer-events-none rounded-full" />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <div className="space-y-8">
            
            {/* Header Block */}
            <div className="text-center space-y-3 max-w-3xl mx-auto">
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl leading-tight">
                Financial Reporting Backed by{" "}
                <span className="bg-gradient-to-r from-indigo-600 via-sky-600 to-purple-600 bg-clip-text text-transparent">
                  Recognized AI Expertise
                </span>
              </h2>
              <div className="w-12 h-1 bg-indigo-600 rounded-full mx-auto" />
            </div>

            {/* Main Content Paragraphs */}
            <div className="space-y-4 text-sm sm:text-base font-medium leading-relaxed text-slate-700 text-center max-w-4xl mx-auto">
              <p>
                AIBASS is developed by Shree Andal AI Software Solutions (OPC) Private Limited, a DPIIT-recognized startup in the AI and Machine Learning sector.
              </p>
              <p>
                The company behind AIBASS was also recognized by SiliconIndia Magazine as AI Company of the Year – Accounting Software 2026, reflecting its focus on applying AI technology and practical methodologies to modern accounting requirements.
              </p>
              <p className="font-semibold text-slate-900">
                AIBASS brings this AI accounting focus into financial reporting designed to give business owners clearer and more frequent visibility into their financial condition.
              </p>
            </div>

            {/* Recognition Feature Cards Grid */}
            <div className="pt-2 max-w-5xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Card 1: DPIIT Recognized */}
                <motion.div 
                  whileHover={{ y: -4, scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white/95 backdrop-blur-md border border-slate-200/90 hover:border-blue-300 rounded-2xl p-5 flex items-center gap-4 shadow-xs hover:shadow-lg transition-all group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0 group-hover:scale-105 transition-transform duration-200 shadow-2xs">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-sm font-extrabold text-slate-900 leading-snug">DPIIT Recognized Startup</h3>
                    <p className="text-xs text-slate-500 font-medium leading-tight mt-0.5">Government of India Recognized</p>
                  </div>
                </motion.div>

                {/* Card 2: AI & ML Sector */}
                <motion.div 
                  whileHover={{ y: -4, scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white/95 backdrop-blur-md border border-slate-200/90 hover:border-indigo-300 rounded-2xl p-5 flex items-center gap-4 shadow-xs hover:shadow-lg transition-all group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 group-hover:scale-105 transition-transform duration-200 shadow-2xs">
                    <BrainCircuit className="h-6 w-6" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-sm font-extrabold text-slate-900 leading-snug">AI & Machine Learning Sector</h3>
                    <p className="text-xs text-slate-500 font-medium leading-tight mt-0.5">Specialized Deep Tech Innovation</p>
                  </div>
                </motion.div>

                {/* Card 3: AI Company of the Year */}
                <motion.div 
                  whileHover={{ y: -4, scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white/95 backdrop-blur-md border border-amber-200/90 hover:border-amber-400 rounded-2xl p-5 flex items-center gap-4 shadow-xs hover:shadow-lg transition-all group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-600 shrink-0 group-hover:scale-105 transition-transform duration-200 shadow-2xs">
                    <Award className="h-6 w-6" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-sm font-extrabold text-slate-900 leading-snug">AI Company of the Year</h3>
                    <p className="text-xs text-slate-500 font-medium leading-tight mt-0.5">Accounting Software 2026</p>
                  </div>
                </motion.div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 4: AI Financial Reporting Software Features */}
      {/* Visual UI Style: Light Studio Feature Cards Matrix */}
      <section className="pt-10 pb-16 md:pt-14 md:pb-20 bg-slate-50 relative overflow-hidden border-b border-slate-200/80">
        
        {/* Soft Background Accents */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-indigo-100/40 via-sky-50/20 to-transparent blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
              AI Financial Reporting Software Features
            </h2>
            <p className="text-base font-semibold text-slate-600">
              AIBASS provides essential financial reporting capabilities through one connected AI platform.
            </p>
          </div>

          {/* Features Matrix (6 Cards) */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuresList.map((feat, idx) => (
              <motion.div 
                key={feat.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.35, delay: idx * 0.08 }}
                whileHover={{ y: -6, scale: 1.01 }}
                className="rounded-[32px] border border-slate-200/80 bg-white p-6 md:p-8 flex flex-col justify-between shadow-xs hover:shadow-xl hover:border-indigo-200 transition-all duration-300 group cursor-pointer relative overflow-hidden"
              >
                <div>
                  {/* Icon & Category Badge */}
                  <div className="flex items-center justify-between mb-5">
                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shadow-xs transition-colors ${feat.iconBg}`}>
                      <feat.icon className="h-6 w-6" />
                    </div>
                    <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full border ${feat.badgeColor}`}>
                      AI Feature
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-extrabold text-slate-950">
                    {feat.title}
                  </h3>

                  {/* Primary Description */}
                  <p className="mt-3 text-xs font-semibold leading-relaxed text-slate-600">
                    {feat.desc}
                  </p>

                  {/* Detail Box */}
                  <div className="mt-4 p-4 rounded-2xl bg-slate-50/90 border border-slate-200/70 text-xs font-medium leading-relaxed text-slate-700">
                    {feat.detail}
                  </div>
                </div>

                {/* Card Footer Link */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-extrabold text-indigo-600 group-hover:text-indigo-700">
                  <span>Explore Feature</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* SECTION 5: Access Financial Reports Through Simple Commands */}
      <section className="py-14 md:py-20 bg-gradient-to-b from-white via-slate-50/70 to-indigo-50/20 relative overflow-hidden border-b border-slate-200/80">
        
        {/* Soft Background Accents */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-6xl h-80 bg-gradient-to-r from-indigo-200/30 via-sky-200/20 to-purple-200/30 blur-3xl pointer-events-none rounded-full" />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3.5 py-1 rounded-full border border-indigo-100">
              <Mic className="h-3.5 w-3.5 text-indigo-600" />
              Conversational Financial Reporting
            </div>

            <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl leading-tight">
              Access Financial Reports Through{" "}
              <span className="bg-gradient-to-r from-indigo-600 via-sky-600 to-purple-600 bg-clip-text text-transparent">
                Simple Commands
              </span>
            </h2>

            <p className="text-base sm:text-lg font-bold text-slate-800 max-w-2xl mx-auto leading-snug">
              AIBASS makes financial reporting easier for users who do not want to navigate several accounting screens.
            </p>

            <p className="text-xs sm:text-sm font-medium text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Type a command or speak an instruction, and AIBASS displays the supported report or financial information.
            </p>
          </div>

          {/* Commands Matrix (4 Category Cards with Interactive Typing Animation) */}
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {reportCommandsList.map((category) => (
              <AnimatedReportingCommandCard key={category.id} category={category} />
            ))}
          </div>

          {/* Bottom CTA Card */}
          <div className="mt-10 rounded-3xl bg-gradient-to-r from-indigo-50/90 via-white to-sky-50/90 border border-indigo-100/90 p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-xs relative overflow-hidden">
            <div className="space-y-1.5 text-center lg:text-left">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight leading-snug">
                Experience AI Financial Reporting
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-2xl font-medium">
                Try asking voice and text commands on your own business financial data with a full-featured 30-day trial.
              </p>
            </div>

            <Button
              onClick={openTrialModal}
              className="shrink-0 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold px-8 py-6 text-sm shadow-lg shadow-indigo-600/20 transition-all hover:scale-[1.02] flex items-center gap-2 cursor-pointer"
            >
                <span>Experience AI Financial Reporting</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

        </div>
      </section>

      {/* SECTION 6: Financial Statements Available in AIBASS */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-white via-slate-50/60 to-indigo-50/30 relative overflow-hidden border-b border-slate-200/80">
        
        {/* Soft Background Mesh Accents */}
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-indigo-100/40 via-sky-100/30 to-purple-100/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-emerald-100/30 rounded-full blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-14 md:mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-4 py-1.5 rounded-full border border-indigo-100/80 shadow-2xs">
              <BarChart3 className="h-3.5 w-3.5 text-indigo-600" />
              Comprehensive Reporting Suite
            </div>

            <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl leading-tight">
              Financial Statements Available in{" "}
              <span className="bg-gradient-to-r from-indigo-600 via-sky-600 to-purple-600 bg-clip-text text-transparent">
                AIBASS
              </span>
            </h2>

            <p className="text-base sm:text-lg font-bold text-slate-700 max-w-2xl mx-auto leading-snug">
              AIBASS turns available bookkeeping records into essential financial statements and views.
            </p>
          </div>

          {/* 4 Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
            {financialStatements.map((stmt) => (
              <motion.div
                key={stmt.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3 }}
                className={`bg-white rounded-[32px] border border-slate-200/90 p-7 sm:p-9 shadow-sm hover:shadow-xl ${stmt.accentBorder} transition-all duration-300 group flex flex-col justify-between relative overflow-hidden`}
              >
                {/* Top Corner Subtle Glow */}
                <div className="absolute -top-12 -right-12 w-36 h-36 bg-indigo-50 rounded-full blur-2xl group-hover:scale-150 transition-transform pointer-events-none" />

                <div className="space-y-6 relative z-10">
                  
                  {/* Statement Card Header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3.5">
                      <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shadow-xs transition-transform group-hover:scale-105 ${stmt.iconBg}`}>
                        <stmt.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-lg sm:text-xl font-extrabold text-slate-950">
                          {stmt.title}
                        </h3>
                        <span className={`inline-block mt-0.5 text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md border ${stmt.badgeColor}`}>
                          Financial Statement
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Statement Description */}
                  <p className="text-sm font-medium text-slate-600 leading-relaxed">
                    {stmt.desc}
                  </p>

                  {/* Checklist Sub-block */}
                  <div className="bg-gradient-to-br from-slate-50/90 via-slate-50/50 to-indigo-50/30 rounded-2xl p-5 sm:p-6 border border-slate-200/70 space-y-3.5 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-indigo-600 animate-pulse" />
                        {stmt.checklistTitle}
                      </h4>
                      <span className="text-[10px] font-bold text-slate-400">Key Breakdown</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                      {stmt.items.map((item, idx) => (
                        <div 
                          key={idx} 
                          className="flex items-center gap-2.5 bg-white/90 p-2.5 rounded-xl border border-slate-150 shadow-2xs text-xs font-bold text-slate-800 hover:border-indigo-200 hover:bg-indigo-50/30 transition-colors"
                        >
                          <div className="h-5 w-5 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                            <Check className="h-3 w-3 text-emerald-600" />
                          </div>
                          <span className="leading-snug">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Takeaway Insight Text */}
                  <div className="bg-indigo-50/50 rounded-2xl p-4 border-l-4 border-indigo-600 border border-indigo-100/60 flex items-start gap-3">
                    <Sparkles className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                    <p className="text-xs font-semibold text-indigo-950 leading-relaxed">
                      {stmt.takeaway}
                    </p>
                  </div>
                </div>

                {/* Optional CTA Button inside card */}
                {stmt.hasCta && stmt.ctaText && (
                  <div className="mt-7 pt-4 border-t border-slate-100 relative z-10">
                    <Button
                      onClick={openTrialModal}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-11 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md hover:scale-[1.01] active:scale-[0.99] text-xs sm:text-sm cursor-pointer group/btn"
                    >
                      <span>{stmt.ctaText}</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                    </Button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Card 5: Full Width AI Cash Flow Predictions Card */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-br from-white via-indigo-50/40 to-purple-50/30 rounded-[36px] border-2 border-indigo-200/90 p-7 sm:p-10 lg:p-12 shadow-md hover:shadow-2xl transition-all duration-300 group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200/25 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-indigo-200/20 rounded-full blur-3xl pointer-events-none" />

            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
              
              {/* Left Details */}
              <div className="lg:col-span-6 space-y-5">
                <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-rose-700 bg-rose-50 px-3.5 py-1.5 rounded-full border border-rose-200 shadow-2xs">
                  <BrainCircuit className="h-4 w-4 text-rose-600" />
                  Predictive Financial AI
                </div>

                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-950 tracking-tight">
                  {cashFlowPredictionFeature.title}
                </h3>

                <p className="text-sm sm:text-base font-semibold text-slate-700 leading-relaxed">
                  {cashFlowPredictionFeature.desc}
                </p>

                <div className="bg-white/90 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-indigo-100 shadow-2xs flex items-start gap-3">
                  <Sparkles className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm font-semibold text-indigo-950 leading-relaxed">
                    {cashFlowPredictionFeature.takeaway}
                  </p>
                </div>

                <div className="pt-2">
                  <Button
                    onClick={openTrialModal}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-12 px-7 rounded-xl inline-flex items-center justify-center gap-2.5 transition-all shadow-md shadow-indigo-600/25 hover:shadow-indigo-600/35 hover:scale-[1.02] active:scale-[0.98] text-xs sm:text-sm cursor-pointer group/btn"
                  >
                    <span>{cashFlowPredictionFeature.ctaText}</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                  </Button>
                </div>
              </div>

              {/* Right Checklist Box */}
              <div className="lg:col-span-6">
                <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-indigo-100/90 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-indigo-950 flex items-center gap-2">
                      <Zap className="h-4 w-4 text-indigo-600" />
                      {cashFlowPredictionFeature.checklistTitle}
                    </h4>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      AI Forecast Engine
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {cashFlowPredictionFeature.items.map((item, idx) => (
                      <div 
                        key={idx} 
                        className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50/80 hover:bg-indigo-50/40 border border-slate-200/80 hover:border-indigo-200 text-xs font-bold text-slate-800 transition-all shadow-2xs"
                      >
                        <div className="h-6 w-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100">
                          <Check className="h-3.5 w-3.5 text-indigo-600" />
                        </div>
                        <span className="leading-snug">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </motion.div>

        </div>
      </section>
              
      {/* SECTION 7: How AIBASS Financial Reporting Works */}
      <section className="py-14 md:py-20 bg-gradient-to-b from-white via-slate-50/60 to-indigo-50/20 relative overflow-hidden border-b border-slate-200/80">
        
        {/* Ambient Glow Accents */}
        <div className="absolute top-1/3 left-10 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-sky-200/30 rounded-full blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3.5 py-1 rounded-full border border-indigo-100">
              <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
              Connected 7-Step Workflow
            </div>

            <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl leading-tight">
              How AIBASS{" "}
              <span className="bg-gradient-to-r from-indigo-600 via-sky-600 to-purple-600 bg-clip-text text-transparent">
                Financial Reporting Works
              </span>
            </h2>

            <p className="text-base sm:text-lg font-bold text-slate-800 max-w-2xl mx-auto leading-snug">
              AIBASS connects supported financial activities with relevant reports and statements.
            </p>
          </div>

          {/* Workflow Steps Grid (7 Steps) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reportingWorkflowSteps.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.35, delay: index * 0.06 }}
                whileHover={{ y: -4, scale: 1.01 }}
                className={`bg-white rounded-[28px] border border-slate-200/90 p-6 sm:p-7 shadow-xs hover:shadow-xl hover:border-indigo-300 transition-all duration-300 group flex flex-col justify-between relative overflow-hidden ${
                  index === 6 ? "md:col-span-2 md:max-w-md md:mx-auto md:w-full lg:max-w-none lg:w-auto lg:col-span-1 lg:col-start-2" : ""
                }`}
              >
                <div>
                  {/* Step Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`h-11 w-11 rounded-2xl flex items-center justify-center shadow-xs transition-colors ${item.iconBg}`}>
                      <item.icon className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-mono font-extrabold text-indigo-600 bg-indigo-50/90 px-3 py-1 rounded-full border border-indigo-100/80">
                      Step {item.step}
                    </span>
                  </div>

                  {/* Step Title */}
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-950 leading-snug">
                    {index + 1}. {item.title}
                  </h3>

                  {/* Step Description */}
                  <p className="mt-2.5 text-xs sm:text-sm font-semibold leading-relaxed text-slate-600">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-bold text-slate-500">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Automated in AIBASS</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom Callout & CTA Card */}
          <div className="mt-10 rounded-3xl bg-gradient-to-r from-indigo-50/90 via-sky-50/50 to-purple-50/60 border border-indigo-100/90 p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-xs relative overflow-hidden">
            <div className="space-y-2 text-center lg:text-left">
              <p className="text-base sm:text-lg font-extrabold text-slate-950 leading-snug max-w-2xl">
                This connected process reduces the time between recording financial activity and understanding its effect on the business.
              </p>
              <div className="flex items-center justify-center lg:justify-start gap-2 text-xs font-semibold text-slate-500">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Zero manual consolidation • Real-time continuous ledger</span>
              </div>
            </div>

            <Button
              onClick={openTrialModal}
              className="shrink-0 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold px-8 py-6 text-sm shadow-lg shadow-indigo-600/20 transition-all hover:scale-[1.02] flex items-center gap-2 cursor-pointer"
            >
              <span>See AIBASS Financial Reporting in Action</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

        </div>
      </section>

      {/* SECTION 8: Keep Financial Reports Connected */}
      <section className="py-14 md:py-20 bg-slate-50 relative overflow-hidden border-b border-slate-200/80">
        
        {/* Soft Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[350px] bg-gradient-to-r from-blue-100/30 via-indigo-100/40 to-purple-100/30 blur-3xl pointer-events-none rounded-full" />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3.5 py-1 rounded-full border border-indigo-100">
              <Layers className="h-3.5 w-3.5 text-indigo-600" />
              Connected AI Ecosystem
            </div>

            <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl leading-tight">
              Keep Financial Reports{" "}
              <span className="bg-gradient-to-r from-indigo-600 via-sky-600 to-purple-600 bg-clip-text text-transparent">
                Connected
              </span>
            </h2>

            <p className="text-base sm:text-lg font-bold text-slate-800 max-w-2xl mx-auto leading-snug">
              AIBASS connects financial reporting with other supported business activities.
            </p>

            <p className="text-xs sm:text-sm font-medium text-slate-600 max-w-2xl mx-auto leading-relaxed">
              This helps users maintain more consistent records and reduces the need to collect information from several separate systems.
            </p>
          </div>

          {/* Connected Modules Grid (5 Cards - 3 Top, 2 Centered Bottom) */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {connectedFeatures.slice(0, 3).map((item) => (
                <motion.div
                  key={item.id}
                  whileHover={{ y: -6, scale: 1.01 }}
                  transition={{ duration: 0.25 }}
                  className={`bg-white rounded-[32px] border border-slate-200/90 p-6 sm:p-7 shadow-xs hover:shadow-xl ${item.accentBorder} transition-all duration-300 group flex flex-col justify-between relative overflow-hidden`}
                >
                  <div>
                    {/* Card Header */}
                    <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className={`h-11 w-11 rounded-2xl flex items-center justify-center shadow-xs transition-colors ${item.iconBg}`}>
                          <item.icon className="h-5 w-5" />
                        </div>
                        <h3 className="text-lg font-extrabold text-slate-950">
                          {item.title}
                        </h3>
                      </div>
                      <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full border ${item.badgeColor}`}>
                        Connected
                      </span>
                    </div>

                    {/* Paragraphs */}
                    <div className="space-y-3 pt-1">
                      {item.paragraphs.map((p, idx) => (
                        <p key={idx} className="text-xs sm:text-sm font-medium text-slate-650 leading-relaxed">
                          {p}
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* Related Product CTA Button */}
                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <Button
                      onClick={openTrialModal}
                      variant="outline"
                      className="w-full border-indigo-100 hover:border-indigo-600 bg-white hover:bg-indigo-600 text-indigo-700 hover:text-white font-bold h-10 rounded-xl flex items-center justify-center gap-2 transition-all text-xs cursor-pointer shadow-2xs"
                    >
                      <span>{item.ctaText}</span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-col md:flex-row justify-center gap-6">
              {connectedFeatures.slice(3).map((item) => (
                <motion.div
                  key={item.id}
                  whileHover={{ y: -6, scale: 1.01 }}
                  transition={{ duration: 0.25 }}
                  className={`bg-white rounded-[32px] border border-slate-200/90 p-6 sm:p-7 shadow-xs hover:shadow-xl ${item.accentBorder} transition-all duration-300 group flex flex-col justify-between relative overflow-hidden w-full md:max-w-[calc(50%-12px)] lg:max-w-[calc(33.333%-16px)]`}
                >
                  <div>
                    {/* Card Header */}
                    <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className={`h-11 w-11 rounded-2xl flex items-center justify-center shadow-xs transition-colors ${item.iconBg}`}>
                          <item.icon className="h-5 w-5" />
                        </div>
                        <h3 className="text-lg font-extrabold text-slate-950">
                          {item.title}
                        </h3>
                      </div>
                      <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full border ${item.badgeColor}`}>
                        Connected
                      </span>
                    </div>

                    {/* Paragraphs */}
                    <div className="space-y-3 pt-1">
                      {item.paragraphs.map((p, idx) => (
                        <p key={idx} className="text-xs sm:text-sm font-medium text-slate-650 leading-relaxed">
                          {p}
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* Related Product CTA Button */}
                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <Button
                      onClick={openTrialModal}
                      variant="outline"
                      className="w-full border-indigo-100 hover:border-indigo-600 bg-white hover:bg-indigo-600 text-indigo-700 hover:text-white font-bold h-10 rounded-xl flex items-center justify-center gap-2 transition-all text-xs cursor-pointer shadow-2xs"
                    >
                      <span>{item.ctaText}</span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 9: Benefits of AI Financial Reporting Software */}
      <section className="py-14 md:py-20 bg-white relative overflow-hidden border-b border-slate-200/80">
        
        {/* Soft Background Accents */}
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-indigo-100/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-sky-100/30 rounded-full blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3.5 py-1 rounded-full border border-indigo-100">
              <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
              Strategic Business Advantage
            </div>

            <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl leading-tight">
              Benefits of{" "}
              <span className="bg-gradient-to-r from-indigo-600 via-sky-600 to-purple-600 bg-clip-text text-transparent">
                AI Financial Reporting Software
              </span>
            </h2>
            <div className="w-12 h-1 bg-indigo-600 rounded-full mx-auto" />
          </div>

          {/* Benefits Grid (7 Cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefitsList.map((ben, idx) => (
              <motion.div
                key={ben.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
                whileHover={{ y: -6, scale: 1.015 }}
                className={`group relative bg-white border border-slate-200/90 rounded-[28px] p-6 sm:p-7 space-y-3 shadow-xs hover:shadow-xl ${ben.accentBorder} transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer ${
                  idx === 6 ? "sm:col-span-2 sm:max-w-md sm:mx-auto sm:w-full lg:max-w-none lg:w-auto lg:col-span-1 lg:col-start-2" : ""
                }`}
              >
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className={`h-11 w-11 rounded-2xl flex items-center justify-center shadow-xs transition-transform duration-300 group-hover:scale-110 ${ben.iconBg}`}>
                      <ben.icon className="h-5 w-5" />
                    </div>
                  </div>

                  <h3 className="text-base sm:text-lg font-extrabold text-slate-950 leading-snug">
                    {ben.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                    {ben.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-bold text-emerald-600">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Key Advantage</span>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* SECTION 10: AI Financial Reporting for Different Businesses */}
      <section className="py-14 md:py-20 bg-slate-50 relative overflow-hidden border-b border-slate-200/80">
        
        {/* Soft Background Accents */}
        <div className="absolute top-1/3 left-10 w-96 h-96 bg-indigo-100/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-100/30 rounded-full blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl leading-tight">
              AI Financial Reporting for{" "}
              <span className="bg-gradient-to-r from-indigo-600 via-sky-600 to-purple-600 bg-clip-text text-transparent">
                Different Businesses
              </span>
            </h2>
            <div className="w-12 h-1 bg-indigo-600 rounded-full mx-auto" />
          </div>

          {/* Industry Cards Grid (7 Cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {industrySolutions.map((biz, idx) => (
              <motion.div
                key={biz.id}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
                whileHover={{ y: -6, scale: 1.015 }}
                className={`bg-white border border-slate-200/90 rounded-[28px] p-6 sm:p-7 shadow-xs hover:shadow-xl ${biz.accentBorder} transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer group ${
                  idx === 6 ? "sm:col-span-2 sm:max-w-md sm:mx-auto sm:w-full lg:max-w-none lg:w-auto lg:col-span-1 lg:col-start-2" : ""
                }`}
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className={`h-11 w-11 rounded-2xl flex items-center justify-center shadow-xs transition-transform duration-300 group-hover:scale-110 ${biz.iconBg}`}>
                        <biz.icon className="h-5 w-5" />
                      </div>
                      <h3 className="text-base sm:text-lg font-extrabold text-slate-950 leading-snug">
                        {biz.title}
                      </h3>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                    {biz.desc}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600 group-hover:text-indigo-700">
                  <span className="text-[11px] font-semibold text-slate-400">Industry Ready</span>
                  <span className="flex items-center gap-1">
                    Learn More <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* SECTION 11: AIBASS Versus Manual Financial Reporting */}
      <section className="py-14 md:py-20 bg-white relative overflow-hidden border-b border-slate-200/80">
        
        {/* Soft Background Accents */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-full max-w-6xl h-80 bg-gradient-to-r from-indigo-100/30 via-sky-100/20 to-emerald-100/30 blur-3xl pointer-events-none rounded-full" />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3.5 py-1 rounded-full border border-indigo-100">
              <Scale className="h-3.5 w-3.5 text-indigo-600" />
              Side-by-Side Comparison
            </div>

            <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl leading-tight">
              AIBASS Versus{" "}
              <span className="bg-gradient-to-r from-indigo-600 via-sky-600 to-purple-600 bg-clip-text text-transparent">
                Manual Financial Reporting
              </span>
            </h2>
            <div className="w-12 h-1 bg-indigo-600 rounded-full mx-auto" />
          </div>

          {/* Comparison Matrix Table Card */}
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="overflow-hidden rounded-[32px] border border-slate-200/90 shadow-lg bg-white relative"
          >
            {/* Table Header */}
            <div className="grid grid-cols-12 bg-slate-100/90 border-b border-slate-200/80 font-extrabold text-xs uppercase tracking-wider p-4 sm:p-5">
              <div className="col-span-12 sm:col-span-3 text-slate-600 font-bold mb-1 sm:mb-0">
                Reporting Aspect
              </div>
              <div className="col-span-6 sm:col-span-4 text-rose-700 font-bold flex items-center gap-1.5">
                <XCircle className="h-4 w-4 text-rose-500 shrink-0" />
                <span>Manual Financial Reporting</span>
              </div>
              <div className="col-span-6 sm:col-span-5 text-indigo-700 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-indigo-600 shrink-0" />
                <span>AIBASS Connected AI</span>
              </div>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-slate-100 text-xs sm:text-sm">
              {financialComparisons.map((row, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.25, delay: idx * 0.04 }}
                  className="grid grid-cols-12 p-4 sm:p-5.5 items-center transition-colors bg-white hover:bg-slate-50/70"
                >
                  <div className="col-span-12 sm:col-span-3 font-extrabold text-slate-950 pb-2 sm:pb-0 pr-2 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-indigo-600 shrink-0 hidden sm:inline-block" />
                    <span>{row.aspect}</span>
                  </div>

                  <div className="col-span-12 sm:col-span-4 text-slate-600 font-medium pb-2 sm:pb-0 pr-3 leading-relaxed bg-slate-50/60 sm:bg-transparent p-2.5 sm:p-0 rounded-xl sm:rounded-none mb-2 sm:mb-0 border sm:border-0 border-slate-100">
                    <span className="sm:hidden text-[10px] font-bold uppercase tracking-wider text-rose-600 block mb-0.5">Manual:</span>
                    {row.manual}
                  </div>

                  <div className="col-span-12 sm:col-span-5 font-bold text-indigo-950 leading-relaxed bg-indigo-50/50 p-2.5 sm:p-3 rounded-xl border border-indigo-100/80">
                    <span className="sm:hidden text-[10px] font-bold uppercase tracking-wider text-indigo-600 block mb-0.5">AIBASS:</span>
                    {row.aibass}
                  </div>
                </motion.div>
              ))}
            </div>

          </motion.div>

        </div>
      </section>

      {/* SECTION 12: Why Choose AIBASS Financial Reporting Software? */}
      <section className="py-14 md:py-20 bg-slate-50 relative overflow-hidden border-b border-slate-200/80">
        
        {/* Soft Background Accents */}
        <div className="absolute top-1/4 right-10 w-96 h-96 bg-indigo-100/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-sky-100/30 rounded-full blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3.5 py-1 rounded-full border border-indigo-100">
              <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
              Core Differentiators
            </div>

            <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl leading-tight">
              Why Choose{" "}
              <span className="bg-gradient-to-r from-indigo-600 via-sky-600 to-purple-600 bg-clip-text text-transparent">
                AIBASS Financial Reporting Software?
              </span>
            </h2>
            <div className="w-12 h-1 bg-indigo-600 rounded-full mx-auto" />
          </div>

          {/* 8 Reason Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyChooseReasons.map((reason, idx) => (
              <motion.div
                key={reason.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
                whileHover={{ y: -6, scale: 1.015 }}
                className={`bg-white border border-slate-200/90 rounded-[28px] p-6 shadow-xs hover:shadow-xl ${reason.accentBorder} transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer group`}
              >
                <div>
                  {/* Card Header with Icon */}
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                    <div className={`h-11 w-11 rounded-2xl flex items-center justify-center shadow-xs transition-transform duration-300 group-hover:scale-110 ${reason.iconBg}`}>
                      <reason.icon className="h-5 w-5" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-extrabold text-slate-950 leading-snug">
                    {reason.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-2.5 text-xs text-slate-600 font-medium leading-relaxed">
                    {reason.desc}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-bold text-slate-500">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Built-in Capability</span>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* SECTION 13: Make Clearer Financial Decisions with AIBASS */}
      <section className="py-14 md:py-20 bg-gradient-to-b from-white via-indigo-50/20 to-white relative overflow-hidden border-b border-slate-200/80">
        
        {/* Ambient Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[350px] bg-gradient-to-r from-indigo-200/30 via-sky-200/30 to-purple-200/30 blur-3xl pointer-events-none rounded-full" />

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-[36px] border border-slate-200/90 bg-white/95 backdrop-blur-md px-6 py-12 sm:px-12 sm:py-16 text-center shadow-xl">
            {/* Background Glow inside card */}
            <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-indigo-200/30 blur-3xl" />
            <div className="pointer-events-none absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-sky-200/30 blur-3xl" />

            <div className="max-w-3xl mx-auto space-y-6 relative z-10">
              
              <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-3.5 py-1.5 rounded-full text-indigo-600">
                <Sparkles className="h-4 w-4 text-indigo-600" />
                <span className="text-xs font-extrabold tracking-widest uppercase">Start Your Financial Transformation</span>
              </div>

              <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl leading-tight">
                Make Clearer{" "}
                <span className="bg-gradient-to-r from-indigo-600 via-sky-600 to-purple-600 bg-clip-text text-transparent">
                  Financial Decisions with AIBASS
                </span>
              </h2>

              <div className="space-y-4 text-sm sm:text-base font-semibold text-slate-650 leading-relaxed max-w-2xl mx-auto">
                <p>
                  Turn available financial records into monthly statements, category wise reports and cash flow insights through one connected AI platform.
                </p>
                <p>
                  Access supported financial reports using simple text or voice commands and understand your business performance with less manual preparation.
                </p>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Button
                  onClick={openTrialModal}
                  className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-12 px-8 rounded-xl text-sm shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Start 30 Day Free Trial</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>

                <Button
                  onClick={openTrialModal}
                  variant="outline"
                  className="w-full sm:w-auto border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 text-slate-800 hover:text-indigo-600 font-bold h-12 px-8 rounded-xl text-sm transition-all cursor-pointer"
                >
                  Book a Free Demo
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-500">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" /> No credit card required
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Full feature access
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Setup in 2 minutes
                </span>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* SECTION 14: FAQ Accordion Section */}
      <section className="py-12 md:py-16 bg-slate-50 border-b border-slate-200/80">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-indigo-600">
              Got Questions?
            </h2>
            <h3 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Frequently Asked Questions
            </h3>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`faq-${index}`}
                className="border border-slate-200/80 rounded-2xl px-5 bg-white overflow-hidden shadow-2xs"
              >
                <AccordionTrigger className="text-sm font-bold text-slate-900 hover:text-indigo-600 py-4 text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-xs font-medium text-slate-600 leading-relaxed pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <Footer />
      <TrialFormModal />

      {/* Scroll To Top Floating Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-slate-900 text-white shadow-xl hover:bg-indigo-600 transition-all cursor-pointer"
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};

export default AiFinancialReportingSoftware;
