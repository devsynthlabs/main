import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Mic, 
  ArrowRight, 
  CheckCircle2, 
  ArrowUp,
  Sparkles,
  Calculator,
  Package,
  BarChart3,
  TrendingUp,
  BookOpen,
  ShieldCheck,
  Building2,
  Zap,
  Clock,
  Layers,
  HelpCircle,
  ChevronDown,
  FileText,
  Percent,
  RefreshCw,
  Search,
  MessageSquare,
  Check,
  ChevronRight,
  Play,
  Volume2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { TrialFormModal } from "@/components/TrialFormModal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// --- Vector GIF-like Loop Animations ---

// 1. Invoicing GST Compiler Animation (Looping SVG)
const GstCompilerGif = () => (
  <div className="relative w-full h-64 bg-slate-900 rounded-2xl flex items-center justify-center overflow-hidden border border-slate-800 shadow-inner">
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293755_1px,transparent_1px),linear-gradient(to_bottom,#1f293755_1px,transparent_1px)] bg-[size:20px_20px]" />
    <svg width="240" height="200" viewBox="0 0 240 200" fill="none" className="relative z-10">
      {/* Invoice Sheet */}
      <motion.rect 
        x="60" y="30" width="120" height="140" rx="8" fill="#1e293b" stroke="#38bdf8" strokeWidth="2"
        initial={{ y: 5 }}
        animate={{ y: [5, -5, 5] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
      />
      {/* Invoice lines */}
      <rect x="75" y="50" width="90" height="6" rx="3" fill="#475569" />
      <rect x="75" y="65" width="60" height="6" rx="3" fill="#475569" />
      
      {/* Calculating indicator */}
      <motion.circle 
        cx="120" cy="110" r="24" fill="#0f172a" stroke="#6366f1" strokeWidth="2" strokeDasharray="6 6"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
      />
      <Calculator className="absolute left-[108px] top-[98px] h-6 w-6 text-indigo-400" />

      {/* CGST / SGST flying indicators */}
      <motion.g
        animate={{ 
          x: [0, 45, 0],
          opacity: [0, 1, 0]
        }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
      >
        <rect x="15" y="85" width="40" height="20" rx="4" fill="#818cf8" />
        <text x="22" y="99" fill="white" fontSize="9" fontWeight="bold">CGST</text>
      </motion.g>

      <motion.g
        animate={{ 
          x: [0, -45, 0],
          opacity: [0, 1, 0]
        }}
        transition={{ repeat: Infinity, duration: 3, delay: 1.5, ease: "easeInOut" }}
      >
        <rect x="185" y="85" width="40" height="20" rx="4" fill="#34d399" />
        <text x="193" y="99" fill="white" fontSize="9" fontWeight="bold">SGST</text>
      </motion.g>

      {/* Success Badge */}
      <motion.g
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: [0.8, 1.1, 1], opacity: [0, 1, 1] }}
        transition={{ repeat: Infinity, repeatDelay: 4, duration: 0.8 }}
      >
        <circle cx="120" cy="155" r="14" fill="#10b981" />
        <path d="M115 155l3 3 6-6" stroke="white" strokeWidth="2" strokeLinecap="round" />
      </motion.g>
    </svg>
  </div>
);

// 2. Sound-Wave AI command GIF Loop
const SoundWaveGif = () => (
  <div className="relative w-full h-64 bg-slate-950 rounded-2xl flex flex-col items-center justify-center overflow-hidden border border-slate-900 shadow-inner">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#1e1b4b,transparent_70%)] opacity-40" />
    
    <div className="flex items-end gap-1.5 h-16 mb-4">
      {[1.2, 2.5, 1.7, 3.2, 0.8, 2.1, 3.8, 1.4, 2.9, 1.1, 2.4, 1.6].map((speed, i) => (
        <motion.div
          key={i}
          className="w-1.5 bg-indigo-500 rounded-full"
          animate={{ height: [12, 48, 12] }}
          transition={{
            repeat: Infinity,
            duration: speed,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>

    <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-mono text-indigo-400">
      <Mic className="h-3.5 w-3.5 text-indigo-500 animate-pulse" />
      <span>Recording instruction...</span>
    </div>
  </div>
);

// 3. Database Sync GIF Loop
const DbSyncGif = () => (
  <div className="relative w-full h-64 bg-slate-900 rounded-2xl flex items-center justify-center overflow-hidden border border-slate-800 shadow-inner">
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293733_1px,transparent_1px),linear-gradient(to_bottom,#1f293733_1px,transparent_1px)] bg-[size:16px_16px]" />
    <svg width="240" height="200" viewBox="0 0 240 200" fill="none" className="relative z-10">
      {/* Node Left: Invoices */}
      <rect x="20" y="70" width="50" height="50" rx="8" fill="#1e293b" stroke="#6366f1" strokeWidth="2" />
      {/* Native SVG Document Icon */}
      <rect x="32" y="82" width="26" height="26" rx="3" stroke="#818cf8" strokeWidth="1.5" fill="none" />
      <line x1="38" y1="89" x2="52" y2="89" stroke="#818cf8" strokeWidth="1.5" />
      <line x1="38" y1="95" x2="48" y2="95" stroke="#818cf8" strokeWidth="1.5" />
      <text x="23" y="135" fill="#94a3b8" fontSize="9" fontWeight="bold">INVOICE</text>

      {/* Node Right: Bookkeeping */}
      <rect x="170" y="70" width="50" height="50" rx="8" fill="#1e293b" stroke="#10b981" strokeWidth="2" />
      {/* Native SVG Book/Ledger Icon */}
      <rect x="182" y="82" width="26" height="26" rx="3" stroke="#34d399" strokeWidth="1.5" fill="none" />
      <line x1="195" y1="82" x2="195" y2="108" stroke="#34d399" strokeWidth="1.5" />
      <line x1="187" y1="89" x2="191" y2="89" stroke="#34d399" strokeWidth="1.5" />
      <line x1="187" y1="95" x2="191" y2="95" stroke="#34d399" strokeWidth="1.5" />
      <line x1="199" y1="89" x2="203" y2="89" stroke="#34d399" strokeWidth="1.5" />
      <line x1="199" y1="95" x2="203" y2="95" stroke="#34d399" strokeWidth="1.5" />
      <text x="171" y="135" fill="#94a3b8" fontSize="9" fontWeight="bold">LEDGER</text>

      {/* Connecting Bridge */}
      <path d="M75 95h90" stroke="#475569" strokeWidth="2" strokeDasharray="4 4" />

      {/* Floating Synced Packets */}
      <motion.circle 
        cx="75" cy="95" r="4" fill="#6366f1"
        animate={{ cx: [75, 165] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
      />
      
      <motion.circle 
        cx="75" cy="95" r="4" fill="#10b981"
        animate={{ cx: [75, 165] }}
        transition={{ repeat: Infinity, duration: 2.5, delay: 1.25, ease: "linear" }}
      />
    </svg>
  </div>
);

export const GstAccountingSoftware = () => {
  const navigate = useNavigate();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeTab, setActiveTab] = useState<"Invoice" | "GST Calculation" | "Bookkeeping" | "Inventory" | "AI Commands">("Invoice");
  
  // Interactive simulator states
  const [selectedCommandIndex, setSelectedCommandIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [showVoiceWaves, setShowVoiceWaves] = useState(false);
  
  // Live GST calculator demo state
  const [calcSaleType, setCalcSaleType] = useState<"intrastate" | "interstate">("intrastate");
  const [calcBaseAmount, setCalcBaseAmount] = useState<number>(50000);
  const [calcGstRate, setCalcGstRate] = useState<number>(18);

  // Business Type spotlight selector
  const [selectedBizIndex, setSelectedBizIndex] = useState(0);

  // Workflow steps active timeline selector
  const [activeWorkStep, setActiveWorkStep] = useState(0);

  useEffect(() => {
    document.title = "GST Accounting Software with AI Automation | AIBASS";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Simplify GST calculations with AIBASS GST accounting software. Calculate CGST, SGST and IGST while connecting invoices, bookkeeping and financial records."
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

  // Trigger typing simulation when command selection changes
  useEffect(() => {
    setIsTyping(true);
    setTypedText("");
    const targetText = textCommands[selectedCommandIndex].user;
    let currentIdx = 0;
    
    const interval = setInterval(() => {
      if (currentIdx < targetText.length) {
        setTypedText(targetText.slice(0, currentIdx + 1));
        currentIdx++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [selectedCommandIndex]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const openTrialModal = () => {
    window.dispatchEvent(new CustomEvent("openTrialModal"));
  };

  const productHighlights = [
    "Automated GST calculations",
    "CGST, SGST and IGST support",
    "Text and voice commands",
    "Connected GST invoicing",
    "GST linked bookkeeping records"
  ];

  const manageEasilyPoints = [
    "Calculate GST during supported invoice creation",
    "Apply CGST and SGST to intrastate transactions",
    "Apply IGST to interstate transactions",
    "Keep GST values connected with sales records",
    "Connect invoice information with bookkeeping",
    "Reduce repeated tax related data entry",
    "Access supported financial information through commands"
  ];

  const features = [
    {
      title: "Automated GST Calculations",
      desc: "AIBASS calculates applicable GST during supported sales invoice creation. This reduces the need to calculate tax values separately before adding them to the transaction.",
      icon: Calculator,
      bg: "bg-indigo-50 text-indigo-600 border-indigo-100"
    },
    {
      title: "CGST and SGST Calculation",
      desc: "For supported intrastate sales, AIBASS calculates the applicable Central Goods and Services Tax and State Goods and Services Tax. The calculated values remain connected with the relevant invoice and financial record.",
      icon: Percent,
      bg: "bg-indigo-50 text-indigo-600 border-indigo-100"
    },
    {
      title: "IGST Calculation",
      desc: "For supported interstate sales, AIBASS calculates the applicable Integrated Goods and Services Tax. This helps businesses keep interstate sales and relevant tax values organised within the same accounting workflow.",
      icon: Layers,
      bg: "bg-indigo-50 text-indigo-600 border-indigo-100"
    },
    {
      title: "GST Enabled Invoicing",
      desc: "GST values can be calculated while creating supported customer sales invoices. Invoice amount, applicable GST and total transaction value remain connected within the invoice record.",
      icon: FileText,
      bg: "bg-indigo-50 text-indigo-600 border-indigo-100"
    },
    {
      title: "Text and Voice Commands",
      desc: "Users can type a command or speak an instruction to perform supported invoicing and accounting activities. This reduces the need to navigate multiple screens for common financial tasks.",
      icon: Mic,
      bg: "bg-indigo-50 text-indigo-600 border-indigo-100"
    },
    {
      title: "Connected Bookkeeping Records",
      desc: "Supported GST invoice information can be connected with relevant sales and bookkeeping records. This helps keep transaction information organised across accounting activities.",
      icon: BookOpen,
      bg: "bg-indigo-50 text-indigo-600 border-indigo-100"
    }
  ];

  const worksSteps = [
    {
      num: "1",
      title: "Create a Sales Invoice",
      desc: "Enter the supported customer, product or service and transaction information."
    },
    {
      num: "2",
      title: "Identify the Transaction",
      desc: "The transaction is handled as an applicable intrastate or interstate sale based on the information provided."
    },
    {
      num: "3",
      title: "Calculate Applicable GST",
      desc: "For supported transactions, AIBASS calculates either CGST and SGST for intrastate sales or IGST for interstate sales."
    },
    {
      num: "4",
      title: "Add GST to the Invoice",
      desc: "The relevant GST values are included with the supported sales invoice information."
    },
    {
      num: "5",
      title: "Connect the Accounting Record",
      desc: "The sales value and applicable GST information remain connected with relevant bookkeeping records."
    },
    {
      num: "6",
      title: "Review the Transaction",
      desc: "Users can review the invoice, GST calculation and connected financial information before using it. This connected workflow reduces repeated entry between invoicing and accounting."
    }
  ];

  const textCommands = [
    {
      title: "Create GST Related Sales Invoices",
      user: "“Create a sales invoice for ₹50,000 with 18% GST.”",
      response: "The platform prepares the supported invoice information with the applicable GST calculation based on the transaction details."
    },
    {
      title: "Review GST Information",
      user: "“Show the GST amount for this invoice.”",
      response: "The platform displays the available GST values connected with the selected invoice."
    },
    {
      title: "Access Sales Information",
      user: "“Show this month’s sales information.”",
      response: "The platform displays the available sales information for the selected period."
    },
    {
      title: "Review Connected Financial Information",
      user: "“Show my income for this month.”",
      response: "The platform presents the available income information based on recorded financial activity."
    }
  ];

  const stateTaxPoints = {
    intrastate: {
      title: "Intrastate GST Calculations",
      desc: "When a supported sale takes place within the same state, the applicable GST can be divided into:",
      subPoints: ["CGST", "SGST"],
      extra: "AIBASS calculates the relevant CGST and SGST values and connects them with the corresponding invoice information."
    },
    interstate: {
      title: "Interstate GST Calculations",
      desc: "When a supported sale takes place between different states, the applicable transaction can use:",
      subPoints: ["IGST"],
      extra: "AIBASS calculates the relevant IGST value and keeps it connected with the supported invoice and financial information."
    },
    breakdown: {
      title: "Clear Tax Breakdown",
      desc: "Keeping CGST, SGST and IGST values connected with the original transaction makes GST related financial information easier to review.",
      warning: "Businesses should always review tax calculations and applicable transaction details before using them for statutory or compliance purposes."
    }
  };

  const businessTypes = [
    {
      title: "Small Businesses",
      desc: "Use GST accounting software for small business activities such as supported invoicing, GST calculation and connected bookkeeping without relying on several separate spreadsheets."
    },
    {
      title: "Startups",
      desc: "Manage growing transaction volumes while keeping GST related invoice and accounting information organised."
    },
    {
      title: "Retailers",
      desc: "Connect supported product sales, GST values and inventory updates within one accounting workflow."
    },
    {
      title: "Traders",
      desc: "Calculate applicable GST on supported transactions while keeping sales, purchase and inventory information connected."
    },
    {
      title: "Service Businesses",
      desc: "Create supported customer invoices and calculate applicable GST while keeping relevant income information organised."
    },
    {
      title: "SMEs",
      desc: "Use connected GST accounting, invoicing, bookkeeping and reporting capabilities as business transaction volumes increase."
    },
    {
      title: "Manufacturing Businesses",
      desc: "Connect supported product sales, purchases, inventory movements, GST calculations and financial information."
    }
  ];

  const benefits = [
    {
      title: "Reduce Manual GST Calculations",
      desc: "Calculate applicable GST during supported transactions instead of preparing every value separately."
    },
    {
      title: "Keep GST and Invoices Connected",
      desc: "Maintain relevant tax values alongside the supported customer sales invoice."
    },
    {
      title: "Reduce Repeated Data Entry",
      desc: "Connect invoice, GST and bookkeeping information so the same transaction does not need to be repeatedly entered across separate systems."
    },
    {
      title: "Simplify Intrastate and Interstate Transactions",
      desc: "Calculate relevant CGST and SGST for supported intrastate sales and IGST for supported interstate sales."
    },
    {
      title: "Access Information Faster",
      desc: "Use text or voice commands to request supported financial and transaction information."
    },
    {
      title: "Improve Financial Visibility",
      desc: "Keep GST related sales information connected with bookkeeping and financial reports."
    },
    {
      title: "Keep Users in Control",
      desc: "Review important transaction details and calculations before using the information for accounting or compliance purposes."
    }
  ];

  const comparisonData = [
    {
      metric: "GST Calculation",
      manual: "Tax values may need to be calculated separately for each transaction.",
      aibass: "Applicable GST can be calculated during supported invoice creation."
    },
    {
      metric: "Intrastate Transactions",
      manual: "CGST and SGST values may need to be calculated and entered manually.",
      aibass: "CGST and SGST can be calculated for supported intrastate sales."
    },
    {
      metric: "Interstate Transactions",
      manual: "IGST values may need to be calculated separately.",
      aibass: "IGST can be calculated for supported interstate sales."
    },
    {
      metric: "Invoice Management",
      manual: "GST values and sales invoices may be maintained through separate workflows.",
      aibass: "Relevant GST values remain connected with supported invoice information."
    },
    {
      metric: "Bookkeeping",
      manual: "Transaction information may need to be updated separately in accounting records.",
      aibass: "Supported invoice and GST information can remain connected with bookkeeping records."
    },
    {
      metric: "Software Navigation",
      manual: "Traditional accounting systems: Users may need to move between multiple screens to complete common activities.",
      aibass: "Supported tasks and information can be accessed using text or voice commands."
    }
  ];

  const integrations = [
    {
      title: "AI Invoicing Software",
      desc: "Create supported sales invoices through text or voice commands and connect applicable GST values with invoice information.",
      link: "/ai-invoicing-software",
      cta: "Explore AI Invoicing Software"
    },
    {
      title: "AI Bookkeeping Software",
      desc: "Keep supported sales, income, expense and GST related transaction information organised within relevant bookkeeping records.",
      link: "/product",
      cta: "Explore AI Bookkeeping Software"
    },
    {
      title: "AI Financial Reporting Software",
      desc: "Turn available financial information into monthly profit and loss statements, balance sheet information and category wise reports.",
      link: "/ai-financial-reporting-software",
      cta: "Explore AI Financial Reporting Software"
    },
    {
      title: "AI Inventory Management Software",
      desc: "Connect supported purchases and sales with relevant stock quantities and inventory information.",
      link: "/ai-inventory-management-software",
      cta: "Explore AI Inventory Management Software"
    }
  ];

  const faqs = [
    {
      q: "What Is GST Accounting Software?",
      a: "GST accounting software helps businesses calculate, record and organise GST related transaction information alongside accounting and invoicing activities."
    },
    {
      q: "How Does AIBASS GST Accounting Software Work?",
      a: "AIBASS calculates applicable GST during supported sales invoice creation and keeps relevant tax information connected with invoice and bookkeeping records."
    },
    {
      q: "Is AIBASS an AI Powered GST Accounting Software?",
      a: "Yes. AIBASS uses AI driven workflows and text or voice commands to simplify supported GST accounting, invoicing and financial activities."
    },
    {
      q: "Does AIBASS Calculate CGST and SGST?",
      a: "Yes. AIBASS calculates applicable CGST and SGST for supported intrastate sales transactions."
    },
    {
      q: "Does AIBASS Calculate IGST?",
      a: "Yes. AIBASS calculates applicable IGST for supported interstate sales transactions."
    },
    {
      q: "Can AIBASS Automatically Calculate GST During Invoice Creation?",
      a: "Yes. Applicable GST can be calculated during supported customer sales invoice creation."
    },
    {
      q: "Can I Use Text Commands for GST Accounting?",
      a: "Yes. Users can enter supported text commands to access invoicing, transaction and financial activities."
    },
    {
      q: "Can I Use Voice Commands?",
      a: "Yes. Users can speak supported instructions for available accounting and invoicing activities."
    },
    {
      q: "Does AIBASS Connect GST Information with Bookkeeping?",
      a: "Yes. Supported GST related invoice information can remain connected with relevant sales and bookkeeping records."
    },
    {
      q: "Does AIBASS Connect GST Invoices with Inventory?",
      a: "For supported product transactions, relevant sales or purchase information can be connected with inventory quantities and stock records."
    },
    {
      q: "Is AIBASS Suitable for Small Businesses?",
      a: "Yes. AIBASS can help small businesses manage supported GST calculations, invoicing, bookkeeping, inventory and financial information within one platform."
    },
    {
      q: "Is AIBASS GST Accounting Software Suitable for Retailers and Traders?",
      a: "Yes. Retailers and traders can use supported GST invoicing, stock updates and connected bookkeeping capabilities to manage everyday transactions."
    },
    {
      q: "Does AIBASS Replace Professional GST Advice?",
      a: "No. AIBASS simplifies supported GST calculations and accounting activities. Businesses should review tax information and use qualified professional guidance for statutory filings and complex compliance decisions."
    },
    {
      q: "Can I Try AIBASS Before Purchasing?",
      a: "Yes. Businesses can explore the available GST accounting and connected financial capabilities through the 30 day free trial."
    }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans overflow-x-hidden bg-[linear-gradient(to_right,#80808007_1px,transparent_1px),linear-gradient(to_bottom,#80808007_1px,transparent_1px)] bg-[size:24px_24px]">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-36 pb-20 sm:pt-44 sm:pb-32 border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
            
            {/* Left Content */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 text-left space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-indigo-50 text-indigo-750 border border-indigo-100 text-xs font-bold uppercase tracking-wider">
                <span>GST Accounting Software</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
                GST Accounting Software with AI Powered Automation
              </h1>
              
              <div className="space-y-4 text-slate-500 text-base sm:text-lg max-w-2xl leading-relaxed">
                <p>
                  Simplify GST calculations and keep invoicing and bookkeeping connected with AIBASS.
                </p>
                <p>
                  Calculate CGST, SGST and IGST with less manual work using simple text or voice commands.
                </p>
              </div>

              <div className="pt-4">
                <Button
                  onClick={openTrialModal}
                  className="rounded-lg bg-slate-900 text-white hover:bg-slate-800 font-semibold px-8 h-12 text-sm shadow-md cursor-pointer"
                >
                  Start 30 Day Free Trial
                </Button>
              </div>

              {/* Highlights */}
              <div className="pt-8 border-t border-slate-200">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Product Highlights</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {productHighlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-slate-600 text-sm font-medium">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-slate-700">
                        <Check className="h-3 w-3" />
                      </div>
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right Side: Related vector compiler GIF animation */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="lg:col-span-5"
            >
              <div className="space-y-4">
                <GstCompilerGif />
                <div className="text-center text-xs text-slate-400 font-medium italic">
                  Live Loop Demonstration: Dynamic GST Compilation
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Simplify GST Accounting Section */}
      <section className="py-24 bg-slate-50 border-b border-slate-200/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                Simplify GST Accounting with AIBASS
              </h2>
              
              <div className="space-y-4 text-slate-500 text-sm sm:text-base leading-relaxed">
                <p>
                  Managing GST manually can involve repeated tax calculations, invoice updates and separate accounting entries.
                </p>
                <p>
                  AIBASS brings supported GST calculations, invoicing and bookkeeping into one connected workflow.
                </p>
                <p>
                  As an AI powered GST accounting software, AIBASS helps businesses calculate applicable GST during supported sales transactions while keeping relevant financial information connected with invoices and accounting records.
                </p>
              </div>

              <div className="pt-2">
                <Button
                  onClick={openTrialModal}
                  className="rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold px-7 h-11 text-xs sm:text-sm shadow-md cursor-pointer"
                >
                  Explore AIBASS GST Accounting
                </Button>
              </div>
            </div>

            {/* Right List */}
            <div className="lg:col-span-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-5 text-left shadow-sm">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                  Manage GST Related Accounting More Easily
                </h3>
                <div className="space-y-3.5">
                  {manageEasilyPoints.map((point, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 mt-0.5">
                        <Check className="h-3 w-3" />
                      </div>
                      <span className="text-sm text-slate-655 font-medium">{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
              GST Accounting Software Features
            </h2>
            <p className="text-slate-500 text-sm sm:text-base">
              AIBASS combines GST calculation with connected invoicing and accounting to simplify everyday financial workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feat, idx) => {
              const IconComp = feat.icon;
              return (
                <div 
                  key={idx}
                  className="bg-white hover:bg-slate-50/50 rounded-2xl border border-slate-200 p-6 text-left space-y-4 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                >
                  <div className={`inline-flex h-10 w-10 items-center justify-center rounded-lg border ${feat.bg} shadow-xs`}>
                    <IconComp className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">{feat.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-550 leading-relaxed">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How GST Calculation Works - Timeline style */}
      <section className="py-24 bg-slate-50 border-y border-slate-200/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
              How GST Calculation Works in AIBASS
            </h2>
            <p className="text-slate-500 text-sm sm:text-base">
              AIBASS simplifies the process of calculating and recording GST during supported business transactions.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start">
            {/* Step Selection List */}
            <div className="lg:col-span-5 space-y-2.5">
              {worksSteps.map((step, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveWorkStep(idx)}
                  className={`w-full text-left px-5 py-3.5 rounded-xl border text-xs sm:text-sm font-bold flex items-center justify-between transition-all cursor-pointer ${
                    activeWorkStep === idx 
                    ? "bg-slate-900 border-slate-900 text-white shadow-md"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`flex h-6 w-6 items-center justify-center rounded font-mono text-[10px] font-bold ${
                      activeWorkStep === idx ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-500"
                    }`}>
                      {step.num}
                    </span>
                    <span>{step.title}</span>
                  </div>
                  <ChevronRight className={`h-4 w-4 shrink-0 transition-transform ${activeWorkStep === idx ? "translate-x-1 rotate-90 text-indigo-400" : "text-slate-400"}`} />
                </button>
              ))}
            </div>

            {/* Step Spotlight Detail Card */}
            <div className="lg:col-span-7">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeWorkStep}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xl text-left space-y-6 min-h-[250px] flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div>
                      <span className="px-2.5 py-1 rounded bg-indigo-50 border border-indigo-100 text-indigo-650 text-xs font-mono font-bold">
                        Step {worksSteps[activeWorkStep].num} of 6
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-950">{worksSteps[activeWorkStep].title}</h3>
                    <p className="text-slate-600 text-sm sm:text-base leading-relaxed">{worksSteps[activeWorkStep].desc}</p>
                  </div>

                  {activeWorkStep === 5 && (
                    <div className="pt-4 border-t border-slate-100 text-xs text-slate-400 font-semibold">
                      This connected workflow reduces repeated entry between invoicing and accounting.
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="mt-16 text-center">
            <Button
              onClick={openTrialModal}
              className="rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold px-7 h-11 text-xs sm:text-sm shadow-md cursor-pointer"
            >
              See AIBASS GST Accounting in Action
            </Button>
          </div>
        </div>
      </section>

      {/* Text or Voice Commands Simulator */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
            
            {/* Left Column Description */}
            <div className="lg:col-span-5 text-left space-y-6">
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                Manage GST Accounting Through Text or Voice Commands
              </h2>
              <div className="space-y-4 text-slate-500 text-sm sm:text-base leading-relaxed">
                <p>
                  AIBASS makes supported GST related accounting activities easier to access through simple instructions.
                </p>
                <p>
                  Instead of moving between multiple accounting screens, users can type their command or speak their instruction.
                </p>
              </div>

              {/* Command Selection Pills */}
              <div className="flex flex-col gap-2 pt-2">
                {textCommands.map((cmd, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedCommandIndex(idx);
                      setShowVoiceWaves(true);
                      setTimeout(() => setShowVoiceWaves(false), 2000);
                    }}
                    className={`text-left px-4 py-3.5 rounded-xl border transition-all text-xs font-bold flex items-center justify-between cursor-pointer ${
                      selectedCommandIndex === idx 
                      ? "bg-slate-900 border-slate-900 text-white shadow-md"
                      : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <span>{cmd.title}</span>
                    <Play className={`h-3 w-3 shrink-0 transition-transform ${selectedCommandIndex === idx ? "translate-x-0.5 text-white" : "text-slate-400"}`} />
                  </button>
                ))}
              </div>

              <div className="pt-4">
                <Button
                  onClick={openTrialModal}
                  className="rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-950 font-bold px-7 h-11 text-xs sm:text-sm shadow-sm cursor-pointer"
                >
                  Experience AI Powered GST Accounting
                </Button>
              </div>
            </div>

            {/* Right Column with looping audio Command GIF-like panel */}
            <div className="lg:col-span-7 space-y-6">
              <SoundWaveGif />
              
              <div className="bg-white rounded-2xl border border-slate-200 p-6 text-left space-y-4 shadow-md">
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <span>Selected Simulation Terminal</span>
                  <span className="text-indigo-650">Active Action</span>
                </div>
                <div className="space-y-2">
                  <span className="text-[9px] font-extrabold text-slate-400 uppercase">Input text:</span>
                  <div className="bg-slate-900 text-slate-200 font-mono text-xs p-3 rounded-lg border border-slate-800">
                    {typedText}
                  </div>
                </div>
                <div className="space-y-2">
                  <span className="text-[9px] font-extrabold text-indigo-600 uppercase">System response:</span>
                  <p className="text-xs text-slate-700 font-semibold leading-relaxed">
                    {!isTyping ? textCommands[selectedCommandIndex].response : "Processing instruction..."}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Live Calculator Demo */}
      <section className="py-24 bg-slate-50 border-y border-slate-200/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
              GST Calculations for Intrastate and Interstate Sales
            </h2>
            <p className="text-slate-500 text-sm sm:text-base">
              AIBASS supports GST calculation for both supported intrastate and interstate sales transactions.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center">
            {/* Interactive Inputs & Explainer */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <div className="space-y-4">
                <div className="flex gap-3">
                  <button
                    onClick={() => setCalcSaleType("intrastate")}
                    className={`flex-1 py-2.5 rounded-lg border font-bold text-xs transition-all cursor-pointer ${
                      calcSaleType === "intrastate"
                      ? "bg-slate-900 border-slate-900 text-white"
                      : "bg-white border-slate-205 text-slate-550"
                    }`}
                  >
                    Intrastate Sale
                  </button>
                  <button
                    onClick={() => setCalcSaleType("interstate")}
                    className={`flex-1 py-2.5 rounded-lg border font-bold text-xs transition-all cursor-pointer ${
                      calcSaleType === "interstate"
                      ? "bg-slate-900 border-slate-900 text-white"
                      : "bg-white border-slate-205 text-slate-550"
                    }`}
                  >
                    Interstate Sale
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-405 uppercase">Simulated Transaction Value (₹)</label>
                  <input
                    type="range"
                    min="10000"
                    max="500000"
                    step="10000"
                    value={calcBaseAmount}
                    onChange={(e) => setCalcBaseAmount(Number(e.target.value))}
                    className="w-full h-1 bg-slate-250 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <div className="flex justify-between text-xs font-bold text-slate-500">
                    <span>₹10,000</span>
                    <span className="text-indigo-650 text-sm">₹{calcBaseAmount.toLocaleString()}</span>
                    <span>₹5,00,000</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-405 uppercase">GST Rate</label>
                  <div className="flex gap-2">
                    {[5, 12, 18, 28].map((rate) => (
                      <button
                        key={rate}
                        onClick={() => setCalcGstRate(rate)}
                        className={`flex-1 py-2 rounded-lg border font-bold text-xs cursor-pointer ${
                          calcGstRate === rate
                          ? "bg-slate-200 border-indigo-150 text-slate-800"
                          : "bg-transparent border-slate-200 text-slate-400"
                        }`}
                      >
                        {rate}%
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="h-px bg-slate-200" />

              {/* Exact copy details mapping */}
              <div className="space-y-4">
                {calcSaleType === "intrastate" ? (
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-slate-900">{stateTaxPoints.intrastate.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-550">{stateTaxPoints.intrastate.desc}</p>
                    <div className="flex gap-2">
                      {stateTaxPoints.intrastate.subPoints.map((pt, i) => (
                        <span key={i} className="px-2.5 py-0.5 rounded bg-indigo-50 border border-indigo-100 text-indigo-600 font-extrabold text-[10px]">
                          {pt}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-slate-500 pt-2 border-t border-slate-200">
                      {stateTaxPoints.intrastate.extra}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-slate-900">{stateTaxPoints.interstate.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-550">{stateTaxPoints.interstate.desc}</p>
                    <div className="flex gap-2">
                      {stateTaxPoints.interstate.subPoints.map((pt, i) => (
                        <span key={i} className="px-2.5 py-0.5 rounded bg-emerald-50 border border-emerald-100 text-emerald-700 font-extrabold text-[10px]">
                          {pt}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-slate-500 pt-2 border-t border-slate-200">
                      {stateTaxPoints.interstate.extra}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Calculator Visual Outcome */}
            <div className="lg:col-span-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xl text-left relative overflow-hidden">
                <div className="absolute top-0 right-0 w-36 h-36 bg-slate-50 rounded-bl-full" />
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Connected Calculation Outcome</h4>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs text-slate-500 border-b border-slate-100 pb-2">
                    <span>Sales value:</span>
                    <span className="font-bold text-slate-800 font-mono">₹{calcBaseAmount.toLocaleString()}</span>
                  </div>

                  {calcSaleType === "intrastate" ? (
                    <>
                      <div className="flex justify-between items-center text-xs text-slate-500">
                        <span>CGST value ({calcGstRate / 2}%):</span>
                        <span className="font-bold text-indigo-650 font-mono">₹{((calcBaseAmount * (calcGstRate / 100)) / 2).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs text-slate-500 border-b border-slate-100 pb-2">
                        <span>SGST value ({calcGstRate / 2}%):</span>
                        <span className="font-bold text-indigo-650 font-mono">₹{((calcBaseAmount * (calcGstRate / 100)) / 2).toLocaleString()}</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-between items-center text-xs text-slate-550 border-b border-slate-100 pb-2">
                      <span>IGST value ({calcGstRate}%):</span>
                      <span className="font-bold text-emerald-650 font-mono">₹{(calcBaseAmount * (calcGstRate / 100)).toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-sm font-bold text-slate-900 pt-2">
                    <span>Invoice total:</span>
                    <span className="font-mono text-lg text-slate-950 font-extrabold">₹{(calcBaseAmount + (calcBaseAmount * (calcGstRate / 100))).toLocaleString()}</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-650 leading-relaxed space-y-2">
                  <span className="text-xs font-bold text-slate-800 block">{stateTaxPoints.breakdown.title}</span>
                  <p>{stateTaxPoints.breakdown.desc}</p>
                  <p className="text-indigo-600 font-semibold">{stateTaxPoints.breakdown.warning}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Connected Eco-System Portal Sections */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-28">
          
          {/* 1. Connect GST Accounting with Sales Invoices */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
            <div className="lg:col-span-6 space-y-6 text-left">
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                Connect GST Accounting with Sales Invoices
              </h2>
              <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
                GST accounting begins with accurate transaction information. AIBASS connects supported GST calculations directly with customer sales invoices, reducing the need to calculate and record tax values separately.
              </p>
              <div className="pt-2">
                <Button
                  onClick={() => navigate("/ai-invoicing-software")}
                  className="rounded-lg bg-white border border-slate-200 text-slate-800 hover:bg-slate-100 font-bold text-xs sm:text-sm px-6 h-11 flex items-center gap-2 shadow-sm cursor-pointer"
                >
                  Explore AI Invoicing Software
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="lg:col-span-6">
              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4 text-left">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Connected Invoice Information</h3>
                <div className="grid grid-cols-2 gap-3.5">
                  {[
                    "Customer transaction",
                    "Sales value",
                    "Applicable GST",
                    "CGST value",
                    "SGST value",
                    "IGST value",
                    "Invoice total",
                    "Relevant financial record"
                  ].map((info, i) => (
                    <div key={i} className="p-3.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-2xs">
                      {info}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 2. Keep GST Information Connected with Bookkeeping */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
            <div className="lg:col-span-6 lg:order-2 space-y-6 text-left">
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                Keep GST Information Connected with Bookkeeping
              </h2>
              <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
                GST values are part of the financial information generated by business sales. AIBASS connects supported GST related transaction information with relevant bookkeeping records so users do not need to maintain completely separate records for every activity.
              </p>
              <div className="pt-2">
                <Button
                  onClick={() => navigate("/product")}
                  className="rounded-lg bg-white border border-slate-200 text-slate-800 hover:bg-slate-100 font-bold text-xs sm:text-sm px-6 h-11 flex items-center gap-2 shadow-sm cursor-pointer"
                >
                  Explore AI Bookkeeping Software
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Database loop animation replacement */}
            <div className="lg:col-span-6 lg:order-1">
              <DbSyncGif />
            </div>
          </div>

          {/* 3. GST Accounting Connected with Inventory */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
            <div className="lg:col-span-6 space-y-6 text-left">
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                GST Accounting Connected with Inventory
              </h2>
              <p className="text-slate-505 text-sm sm:text-base leading-relaxed">
                For product based businesses, sales and purchase activity can also affect available stock. AIBASS connects supported invoice information with relevant inventory records where applicable.
              </p>
              <div className="pt-2">
                <Button
                  onClick={() => navigate("/inventory")}
                  className="rounded-lg bg-white border border-slate-200 text-slate-800 hover:bg-slate-100 font-bold text-xs sm:text-sm px-6 h-11 flex items-center gap-2 shadow-sm cursor-pointer"
                >
                  Explore Inventory Management Software
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="lg:col-span-6">
              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4 text-left">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Connected Inventory Activities</h3>
                <div className="grid grid-cols-2 gap-3.5">
                  {[
                    "Purchase based stock additions",
                    "Sales based stock reductions",
                    "Current stock visibility",
                    "Low stock identification",
                    "Connected sales records",
                    "Connected purchase records",
                    "Inventory related financial information"
                  ].map((info, i) => (
                    <div key={i} className="p-3.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-emerald-700 shadow-2xs">
                      {info}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 4. Connect GST Information with Financial Reporting */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
            <div className="lg:col-span-6 lg:order-2 space-y-6 text-left">
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                Connect GST Information with Financial Reporting
              </h2>
              <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
                Supported GST related transactions also contribute to the wider financial picture of the business. AIBASS connects available sales and accounting records with financial reporting capabilities.
              </p>
              <div className="pt-2">
                <Button
                  onClick={() => navigate("/product")}
                  className="rounded-lg bg-white border border-slate-205 text-slate-800 hover:bg-slate-100 font-bold text-xs sm:text-sm px-6 h-11 flex items-center gap-2 shadow-sm cursor-pointer"
                >
                  Explore AI Financial Reporting Software
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="lg:col-span-6 lg:order-1">
              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4 text-left">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Review Connected Business Information</h3>
                <div className="grid grid-cols-2 gap-3.5">
                  {[
                    "Monthly income",
                    "Operating expenses",
                    "Profit and loss information",
                    "Balance sheet information",
                    "Category wise financial views",
                    "Cash flow information"
                  ].map((info, i) => (
                    <div key={i} className="p-3.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-indigo-700 shadow-2xs">
                      {info}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-slate-50 border-y border-slate-200/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
              Benefits of AIBASS GST Accounting Software
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, idx) => (
              <div 
                key={idx} 
                className="bg-white border border-slate-200 rounded-2xl p-6 text-left space-y-3.5 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded bg-indigo-50 border border-indigo-100 text-indigo-650 font-extrabold text-sm shadow-2xs">
                  ✓
                </div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">{benefit.title}</h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Businesses Spotlight Grid Selector */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
              GST Accounting Software for Different Businesses
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            {/* Business buttons selector */}
            <div className="lg:col-span-5 flex flex-col gap-2">
              {businessTypes.map((biz, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedBizIndex(idx)}
                  className={`w-full text-left px-5 py-3 rounded-xl border text-xs sm:text-sm font-bold flex items-center gap-3.5 transition-all cursor-pointer ${
                    selectedBizIndex === idx 
                    ? "bg-slate-900 border-slate-900 text-white shadow-md"
                    : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  <Building2 className={`h-4 w-4 shrink-0 ${selectedBizIndex === idx ? "text-indigo-400" : "text-slate-400"}`} />
                  <span>{biz.title}</span>
                </button>
              ))}
            </div>

            {/* Spotlight Showcase view */}
            <div className="lg:col-span-7">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedBizIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xl text-left space-y-5 min-h-[220px] flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <span className="text-[9px] font-extrabold text-indigo-650 uppercase tracking-wider block">Spotlight Case Study</span>
                    <h3 className="text-xl font-bold text-slate-900">{businessTypes[selectedBizIndex].title}</h3>
                    <p className="text-slate-550 text-sm leading-relaxed">{businessTypes[selectedBizIndex].desc}</p>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                    <span className="text-[10px] text-slate-400">Seamless dynamic workflow integration</span>
                    <Sparkles className="h-4 w-4 text-indigo-500" />
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* AIBASS Versus Manual GST Accounting Table */}
      <section className="py-24 bg-slate-50 border-y border-slate-200/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
              AIBASS Versus Manual GST Accounting
            </h2>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-md bg-white">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-5 text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-wider w-[25%]">Workflow</th>
                  <th className="p-5 text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wider w-[37.5%]">Manual GST accounting</th>
                  <th className="p-5 text-xs sm:text-sm font-bold text-indigo-650 uppercase tracking-wider w-[37.5%] bg-indigo-50/50">AIBASS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {comparisonData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/40 transition-colors">
                    <td className="p-5 text-xs sm:text-sm font-bold text-slate-900">{row.metric}</td>
                    <td className="p-5 text-xs sm:text-sm text-slate-600 leading-relaxed">{row.manual}</td>
                    <td className="p-5 text-xs sm:text-sm text-slate-700 font-medium leading-relaxed bg-indigo-50/20">{row.aibass}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* How AIBASS Fits into Your Accounting Workflow */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
              How AIBASS Fits into Your Accounting Workflow
            </h2>
            <p className="text-slate-500 text-sm sm:text-base">
              AIBASS GST accounting works as part of a connected business accounting ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {integrations.map((item, idx) => (
              <div 
                key={idx} 
                className="bg-white hover:bg-slate-50/40 rounded-2xl border border-slate-205 p-6 sm:p-8 space-y-6 text-left flex flex-col justify-between shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
              >
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
                <div>
                  <Button
                    onClick={() => navigate(item.link)}
                    className="rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 h-10 text-xs sm:text-sm flex items-center gap-2 cursor-pointer w-fit"
                  >
                    <span>{item.cta}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* See AIBASS GST Accounting in Action - Interactive tabs */}
      <section className="py-24 bg-slate-50 border-y border-slate-200/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
              See AIBASS GST Accounting in Action
            </h2>
            <p className="text-slate-550 text-sm sm:text-base">
              Explore how AIBASS connects GST calculations with supported invoicing and accounting activities.
            </p>
          </div>

          {/* Tab buttons */}
          <div className="flex items-center justify-start md:justify-center gap-2 mb-12 overflow-x-auto pb-3 -mx-4 px-4 md:mx-0 md:px-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden flex-nowrap whitespace-nowrap">
            {["Invoice", "GST Calculation", "Bookkeeping", "Inventory", "AI Commands"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-5 py-2.5 rounded-full border transition-all text-xs font-bold cursor-pointer ${
                  activeTab === tab 
                  ? "bg-slate-900 border-slate-900 text-white shadow-md"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Interactive tabs contents demonstrating product screens */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-xl min-h-[440px] flex flex-col justify-between text-left mb-12">
            <AnimatePresence mode="wait">
              {activeTab === "Invoice" && (
                <motion.div
                  key="Invoice"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <div>
                    <span className="text-[10px] font-bold text-indigo-650 block mb-1">Recommended Product Screen</span>
                    <h3 className="text-xl font-bold text-slate-900">GST invoice creation</h3>
                    <p className="text-slate-450 text-xs mt-1">Recommended Image Alt Text: GST enabled sales invoice</p>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-4 w-full">
                    <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                      <span className="text-sm font-bold text-slate-800">Sales Invoice</span>
                      <span className="text-xs text-slate-450 font-mono">INV-2026-001</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-slate-600">
                        <span>Customer transaction:</span>
                        <span className="font-semibold text-slate-800">TechCorp Distributors</span>
                      </div>
                      <div className="flex justify-between text-xs text-slate-600">
                        <span>Sales value:</span>
                        <span className="font-semibold text-slate-800">₹1,00,000.00</span>
                      </div>
                      <div className="flex justify-between text-xs text-slate-600">
                        <span>GST Rate:</span>
                        <span className="font-semibold text-slate-800">18% (Applicable GST)</span>
                      </div>
                    </div>
                    <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl space-y-1.5">
                      <div className="flex justify-between text-xs text-indigo-950 font-medium">
                        <span>CGST value (9%):</span>
                        <span>₹9,000.00</span>
                      </div>
                      <div className="flex justify-between text-xs text-indigo-950 font-medium">
                        <span>SGST value (9%):</span>
                        <span>₹9,000.00</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t border-slate-200 text-sm font-bold text-slate-905">
                      <span>Invoice total:</span>
                      <span className="text-indigo-650 font-mono">₹1,18,000.00</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "GST Calculation" && (
                <motion.div
                  key="GST Calculation"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <div>
                    <span className="text-[10px] font-bold text-indigo-650 block mb-1">Recommended Product Screens</span>
                    <h3 className="text-xl font-bold text-slate-900">CGST and SGST calculation & IGST calculation</h3>
                    <p className="text-slate-455 text-xs mt-1">Recommended Image Alt Text: Automated CGST and SGST calculation & IGST calculation software in AIBASS</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
                      <h4 className="text-xs font-bold text-indigo-700 uppercase tracking-wider">Intrastate Mode</h4>
                      <p className="text-xs text-slate-500">Auto calculated CGST & SGST based on customer and state billing coordinates.</p>
                      <div className="space-y-2 pt-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-500">Billing State:</span>
                          <span className="font-bold text-slate-800">Maharashtra (Local)</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-500">CGST Value (9%):</span>
                          <span className="font-bold text-indigo-605">₹4,500.00</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-500">SGST Value (9%):</span>
                          <span className="font-bold text-indigo-605">₹4,500.00</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
                      <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Interstate Mode</h4>
                      <p className="text-xs text-slate-500">Auto calculated IGST based on billing coordinate difference.</p>
                      <div className="space-y-2 pt-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-505">Billing State:</span>
                          <span className="font-bold text-slate-800">Karnataka (Out of State)</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-500">IGST Value (18%):</span>
                          <span className="font-bold text-emerald-650">₹9,000.00</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "Bookkeeping" && (
                <motion.div
                  key="Bookkeeping"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <div>
                    <span className="text-[10px] font-bold text-indigo-655 block mb-1">Recommended Product Screen</span>
                    <h3 className="text-xl font-bold text-slate-900">Connected bookkeeping information</h3>
                    <p className="text-slate-450 text-xs mt-1">Recommended Image Alt Text: Connected GST bookkeeping records</p>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-4 w-full">
                    <span className="text-[10px] font-bold text-indigo-600 block">Connected Ledger Entries</span>
                    <div className="space-y-2.5 text-xs font-mono">
                      <div className="flex justify-between border-b border-slate-200 pb-2">
                        <span className="text-slate-500">Sales Ledger Credit:</span>
                        <span className="text-slate-800 font-semibold">₹1,00,000.00</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-200 pb-2">
                        <span className="text-slate-500">GST Output Tax Liability:</span>
                        <span className="text-indigo-650 font-bold">₹18,000.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Accounts Receivable Debit:</span>
                        <span className="text-emerald-650 font-bold">₹1,18,000.00</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "Inventory" && (
                <motion.div
                  key="Inventory"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <div>
                    <span className="text-[10px] font-bold text-indigo-655 block mb-1">Recommended Product Screen</span>
                    <h3 className="text-xl font-bold text-slate-900">Inventory update</h3>
                    <p className="text-slate-450 text-xs mt-1">Recommended Image Alt Text: GST accounting and inventory management</p>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-4 w-full shadow-sm">
                    <span className="text-[10px] font-bold text-indigo-600 block">Automatic Stock Movement</span>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between items-center p-3 bg-red-50 border border-red-100 rounded-lg text-red-700">
                        <span>Invoice Stock Reduction:</span>
                        <span className="font-bold">-25 Units Office Chairs</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-700">
                        <span>Updated Available Stock:</span>
                        <span className="font-bold">125 Units Available</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "AI Commands" && (
                <motion.div
                  key="AI Commands"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <div>
                    <span className="text-[10px] font-bold text-indigo-650 block mb-1">Recommended Product Screens</span>
                    <h3 className="text-xl font-bold text-slate-905">Text command interface & Voice command interface</h3>
                    <p className="text-slate-450 text-xs mt-1">Recommended Image Alt Text: GST accounting through text commands</p>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 text-white rounded-xl p-5 space-y-3 font-mono text-xs w-full shadow-lg">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-2 text-slate-500">
                      <span>Interactive Interface</span>
                      <Mic className="h-3 w-3 text-red-500 animate-pulse" />
                    </div>
                    <div>
                      <span className="text-indigo-450 block font-bold text-[9px] uppercase tracking-wider mb-0.5">Input Command:</span>
                      <p className="italic text-slate-200">“Create a sales invoice for ₹50,000 with 18% GST.”</p>
                    </div>
                    <div className="pt-2.5 border-t border-slate-800">
                      <span className="text-emerald-400 block font-bold text-[9px] uppercase tracking-wider mb-0.5">System Action:</span>
                      <p className="text-slate-350">Preparing invoice details, CGST (₹4,500) and SGST (₹4,500) applied based on Karnataka billing.</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* CTA flow grid */}
            <div className="mt-8 pt-6 border-t border-slate-200">
              <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block mb-3">Product Demonstration Flow</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs text-slate-550">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                  <span>Create a supported sales invoice</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                  <span>Enter the transaction information</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                  <span>Calculate applicable GST</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                  <span>Review CGST and SGST or IGST values</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                  <span>Confirm the invoice total</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                  <span>Review the connected bookkeeping information</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                  <span>Check relevant inventory updates</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                  <span>Access supported info through a command</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              onClick={openTrialModal}
              className="rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold px-8 h-12 text-sm shadow-md cursor-pointer w-full sm:w-auto"
            >
              Book a Free Demo
            </Button>
            <Button
              onClick={openTrialModal}
              variant="outline"
              className="rounded-lg border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold px-8 h-12 text-sm cursor-pointer w-full sm:w-auto"
            >
              Start 30 Day Free Trial
            </Button>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
              Frequently Asked Questions
            </h2>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, idx) => (
              <AccordionItem 
                key={idx} 
                value={`faq-${idx}`}
                className="bg-white border border-slate-200 rounded-xl px-6 py-1.5 shadow-sm hover:border-slate-300 transition-all"
              >
                <AccordionTrigger className="text-xs sm:text-sm font-bold text-slate-900 text-left hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="relative py-28 overflow-hidden bg-slate-900 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(40rem_40rem_at_top,theme(colors.indigo.950),theme(colors.slate.900))] opacity-35" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Simplify GST Accounting with AIBASS
          </h2>
          <div className="max-w-2xl mx-auto text-slate-300 text-sm sm:text-base space-y-4 leading-relaxed">
            <p>
              Bring supported GST calculations, invoicing and bookkeeping together through one connected accounting platform.
            </p>
            <p>
              Use AI powered GST accounting software to calculate applicable CGST, SGST and IGST, keep transaction information organised and access supported financial activities through simple text or voice commands.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Button
              onClick={openTrialModal}
              className="rounded-lg bg-white hover:bg-slate-100 text-slate-900 font-bold px-8 h-12 text-sm shadow-md cursor-pointer w-full sm:w-auto"
            >
              Start 30 Day Free Trial
            </Button>
            <Button
              onClick={openTrialModal}
              className="rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 h-12 text-sm shadow-lg shadow-indigo-600/10 cursor-pointer w-full sm:w-auto"
            >
              Book a Free Demo
            </Button>
          </div>
        </div>
      </section>

      <Footer />
      <TrialFormModal />

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-45 flex h-10 w-10 items-center justify-center rounded-full bg-indigo-650 hover:bg-indigo-500 text-white shadow-lg transition-transform hover:-translate-y-1 cursor-pointer"
          >
            <ArrowUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GstAccountingSoftware;
