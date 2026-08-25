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
  BrainCircuit,
  BookOpen,
  Receipt,
  ShieldCheck,
  Building2,
  Zap,
  Clock,
  Layers,
  HelpCircle,
  ChevronDown,
  Calendar,
  Star,
  FileText,
  IndianRupee,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { TrialFormModal } from "@/components/TrialFormModal";
import { AiAccountingCommands } from "@/components/AiAccountingCommands";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const ProductPage = () => {
  const navigate = useNavigate();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    document.title = "AI Bookkeeping Software for Real Time Financial Clarity | AIBASS";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Automate bookkeeping, track transactions and access monthly P&L, balance sheets, cash flow forecasts and bank reconciliation with AIBASS."
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

  const productHighlights = [
    "Text and voice bookkeeping commands",
    "Automated financial data entry",
    "Real time transaction tracking",
    "Monthly profit and loss statements",
    "Updated balance sheet information",
    "Category wise financial views",
    "Cash flow statements and predictions",
    "Connected invoice and inventory records"
  ];

  const features = [
    {
      title: "Text and Voice Bookkeeping Commands",
      desc: "Type your command or speak your instruction to request supported bookkeeping activities and financial information. Instead of navigating multiple software menus, users can directly ask AIBASS to display expenses, income, monthly statements or other available financial information.",
      icon: Mic,
      bg: "bg-blue-50 text-blue-600 border-blue-100"
    },
    {
      title: "Automated Financial Data Entry",
      desc: "AIBASS helps organise supported sales, purchases, income, expenses and invoice information within relevant financial records. This reduces repeated entry, improves consistency and makes important business information easier to access.",
      icon: BookOpen,
      bg: "bg-indigo-50 text-indigo-600 border-indigo-100"
    },
    {
      title: "Real Time Transaction Tracking",
      desc: "Maintain a current view of available financial activities as supported business transactions are recorded. Track sales, purchases, income, operating expenses, customer invoices, GST values and payroll related costs from one connected system.",
      icon: Clock,
      bg: "bg-emerald-50 text-emerald-600 border-emerald-100"
    },
    {
      title: "Income and Expense Organisation",
      desc: "AIBASS organises available income and expenses into relevant financial records and categories. This gives business owners a clearer understanding of where money is coming from and how it is being spent.",
      icon: Calculator,
      bg: "bg-amber-50 text-amber-600 border-amber-100"
    },
    {
      title: "Monthly Profit and Loss Statements",
      desc: "Generate monthly profit and loss statements using the income and expense information available in AIBASS. Review monthly revenue, operating expenses, category wise activity and the resulting profit or loss.",
      icon: BarChart3,
      bg: "bg-purple-50 text-purple-600 border-purple-100"
    },
    {
      title: "Updated Balance Sheet Information",
      desc: "Access available information about business assets, liabilities, account balances and the current financial position. Balance sheet information helps business owners understand what the company owns and what it owes.",
      icon: Layers,
      bg: "bg-cyan-50 text-cyan-600 border-cyan-100"
    },
    {
      title: "Category Wise Financial Views",
      desc: "Review income and expenses across relevant business categories. Users can identify major cost areas, high spending categories and important changes in financial performance.",
      icon: BrainCircuit,
      bg: "bg-rose-50 text-rose-600 border-rose-100"
    },
    {
      title: "Cash Flow Statements and Predictions",
      desc: "Review current cash movement and use AI driven predictions to understand possible future cash availability. This helps businesses prepare for expenses, payments, investments and potential cash shortages.",
      icon: TrendingUp,
      bg: "bg-teal-50 text-teal-600 border-teal-100"
    }
  ];

  const textCommands = [
    {
      user: "“Show my expenses for this month.”",
      response: "The platform displays the available monthly expenses and category wise breakdown."
    },
    {
      user: "“Generate my monthly profit and loss statement.”",
      response: "The platform displays the available income, expenses and monthly profit or loss."
    },
    {
      user: "“Show my current balance sheet.”",
      response: "The platform presents the available assets, liabilities and relevant account balances."
    }
  ];

  const voiceCommands = [
    {
      user: "“Show this month’s income and expenses.”",
      response: "The platform displays the available financial summary for the selected period."
    },
    {
      user: "“Show my expected cash position.”",
      response: "The platform presents a cash flow prediction using the available financial information."
    },
    {
      user: "“Display my highest expense categories.”",
      response: "The platform organises and displays the available expenses by category."
    }
  ];

  const steps = [
    { num: "1", title: "Record the Transaction", desc: "Enter a supported sale, purchase, income or expense transaction." },
    { num: "2", title: "Organise the Information", desc: "AIBASS connects the available transaction details with relevant bookkeeping records." },
    { num: "3", title: "Update Connected Records", desc: "Related invoice, GST, inventory or payroll information is updated where applicable." },
    { num: "4", title: "Refresh Financial Information", desc: "Available income, expenses and category wise financial records reflect the recorded activity." },
    { num: "5", title: "Generate Financial Statements", desc: "Users can access monthly profit and loss statements, balance sheet information and cash flow insights." },
    { num: "6", title: "Review the Results", desc: "Important transactions, calculations and financial reports remain available for user review." }
  ];

  const everydayTasks = [
    { title: "Organise Sales and Purchases", desc: "Maintain supported sales and purchase information within connected bookkeeping records." },
    { title: "Track Income and Expenses", desc: "Review available business income and operating expenses without relying entirely on manually prepared spreadsheets." },
    { title: "Connect Invoice Information", desc: "Use supported sales invoice information to update relevant income, GST and inventory records." },
    { title: "Maintain Current Financial Records", desc: "Keep available transaction and financial information updated as business activities are recorded." },
    { title: "Reduce Repeated Data Entry", desc: "Connect related financial activities so users do not need to enter the same information into several separate systems." },
    { title: "Access Financial Information Faster", desc: "Use text or voice commands to request supported reports and business information when needed." }
  ];

  const benefits = [
    { title: "Reduce Manual Bookkeeping Work", desc: "Automate supported financial record management and reduce dependence on repeated spreadsheet entry." },
    { title: "Maintain Organised Financial Records", desc: "Keep available transactions, invoices, income and expenses connected within one platform." },
    { title: "Access Current Business Information", desc: "Review available sales, purchases, income, expenses and financial activity more quickly." },
    { title: "Generate Reports Faster", desc: "Access monthly profit and loss statements, balance sheet information and category wise reports without manually preparing every statement." },
    { title: "Improve Financial Visibility", desc: "Understand business performance through connected transactions, financial statements and cash flow information." },
    { title: "Support Better Planning", desc: "Use available financial records and cash flow predictions to prepare for future expenses and business requirements." },
    { title: "Keep Users in Control", desc: "Review important transactions, calculations and financial reports before using them for business decisions." }
  ];

  const businessTypes = [
    { title: "Small Businesses", desc: "Manage income, expenses, invoices, GST and monthly financial reports without depending on several spreadsheets." },
    { title: "Startups", desc: "Monitor spending, monthly profit, cash availability and financial position while the business grows." },
    { title: "Small and Medium Enterprises", desc: "Connect increasing volumes of sales, purchases, payroll, inventory and financial information." },
    { title: "Retailers and Traders", desc: "Connect product sales, GST invoices, inventory movements and bookkeeping records." },
    { title: "Service Businesses", desc: "Manage customer invoices, operating expenses, payroll costs and cash flow without unnecessary inventory processes." },
    { title: "Manufacturing Businesses", desc: "Connect purchases, inventory, payroll, product sales, GST calculations and financial reports." },
    { title: "Construction and Civil Engineering Businesses", desc: "Manage financial records alongside project schedules, resources, budgets and critical project activities." }
  ];

  const whyChoose = [
    { title: "Complete Tasks Through Text or Voice Commands", desc: "Enter a text command or speak the bookkeeping instruction instead of navigating several menus. AIBASS processes the request and displays the supported financial information or activity." },
    { title: "Reduce Repeated Financial Data Entry", desc: "Connect transaction, invoice, inventory and bookkeeping information so the same financial details do not need to be entered into multiple systems." },
    { title: "Access Current Financial Information", desc: "Review available income, expenses, sales, purchases and other financial activity without waiting for reports to be prepared manually." },
    { title: "Generate Monthly Financial Statements", desc: "Access monthly profit and loss statements, balance sheet information and category wise financial views using the records available in AIBASS." },
    { title: "Understand Future Cash Requirements", desc: "Review cash flow statements and AI driven forecasts to prepare for upcoming expenses, investments and possible cash shortages." },
    { title: "Keep Financial Information Connected", desc: "Manage bookkeeping alongside invoicing, GST, inventory, payroll and other business automation capabilities within one platform." }
  ];

  const comparisons = [
    {
      feature: "Financial Data Entry",
      manual: "The same transaction information may be entered into multiple spreadsheets or systems.",
      aibass: "Supported transaction information remains connected with relevant bookkeeping records."
    },
    {
      feature: "Transaction Tracking",
      manual: "Business owners may depend on delayed reports to understand current financial activities.",
      aibass: "Users can access available transaction and financial information more quickly."
    },
    {
      feature: "Financial Reports",
      manual: "Profit and loss statements and balance sheets may need to be prepared separately.",
      aibass: "Available bookkeeping information can be turned into updated financial reports."
    },
    {
      feature: "Cash Flow Planning",
      manual: "Future cash requirements may become visible only after financial pressure develops.",
      aibass: "Cash flow predictions provide earlier visibility into possible future requirements."
    },
    {
      feature: "Software Navigation",
      manual: "Users may need to navigate several screens, modules and report menus.",
      aibass: "Users can request supported activities through simple text or voice commands."
    }
  ];

  const connectedProducts = [
    { title: "AI Invoicing Software", desc: "Create supported customer sales invoices using text or voice commands.", route: "/ai-invoicing-software" },
    { title: "GST Accounting Software", desc: "Calculate applicable CGST, SGST and IGST for supported sales transactions.", route: "/gst-accounting-software" },
    { title: "AI Inventory Management Software", desc: "Track stock quantities and connect purchases and sales with relevant inventory records.", route: "/ai-inventory-management-software" },
    { title: "Cash Flow Forecasting Software", desc: "Review current cash movement and estimate future cash availability.", route: "/products/cash-flow-forecasting-software/" },
    { title: "Payroll Management", desc: "Organise supported salary calculations, deductions and payroll information.", route: "/payroll" },
    { title: "Fraud Monitoring", desc: "Identify unusual financial activity that may require authorised user review.", route: "/fraud-detection" },
    { title: "Civil Engineering Project Scheduling", desc: "Organise project timelines, resources, budgets and critical activities for construction and civil engineering projects.", route: "/civil-engineering" }
  ];

  const faqs = [
    {
      q: "What Is AI Bookkeeping Software?",
      a: "AI bookkeeping software uses intelligent automation to organise financial transactions, reduce repeated data entry and make important financial information easier to access."
    },
    {
      q: "How Does AIBASS AI Bookkeeping Work?",
      a: "Users can record supported financial information and enter a text command or speak an instruction. AIBASS processes the available records and displays the requested bookkeeping activity or financial information."
    },
    {
      q: "What Bookkeeping Activities Can AIBASS Support?",
      a: "AIBASS supports income and expense organisation, transaction tracking, invoicing, monthly profit and loss statements, balance sheet information, category wise financial views and cash flow reporting."
    },
    {
      q: "Can I Use Text Commands for Bookkeeping?",
      a: "Yes. Users can enter supported text commands to request bookkeeping activities, reports and financial information."
    },
    {
      q: "Can I Use Voice Commands?",
      a: "Yes. Users can speak supported instructions to access available financial reports and bookkeeping information."
    },
    {
      q: "Does AIBASS Generate Monthly Profit and Loss Statements?",
      a: "Yes. AIBASS generates monthly profit and loss information using the available income and expense records."
    },
    {
      q: "Can AIBASS Generate Balance Sheet Information?",
      a: "Yes. AIBASS displays balance sheet information based on the accounting records available within the platform."
    },
    {
      q: "Does AIBASS Provide Cash Flow Statements?",
      a: "Yes. AIBASS provides cash flow information and AI driven predictions using available financial data."
    },
    {
      q: "Does AIBASS Calculate GST?",
      a: "Yes. AIBASS calculates applicable CGST and SGST for supported intrastate sales and IGST for supported interstate sales."
    },
    {
      q: "Can AIBASS Manage Inventory Information?",
      a: "Yes. AIBASS connects supported purchases and sales with relevant stock quantities and helps identify low stock products."
    },
    {
      q: "Can AIBASS Manage Payroll Information?",
      a: "AIBASS supports payroll related calculations, deductions and financial records based on the information entered."
    },
    {
      q: "Does AIBASS Provide Fraud Monitoring?",
      a: "AIBASS uses AI supported monitoring to flag unusual financial activities for authorised user review."
    },
    {
      q: "Is AIBASS Suitable for Small Businesses?",
      a: "Yes. Small businesses can use AIBASS to manage bookkeeping, invoicing, expenses, GST, inventory and financial reports."
    },
    {
      q: "Does AI Bookkeeping Replace an Accountant?",
      a: "No. AIBASS automates supported bookkeeping activities and makes financial information easier to access. Professional review may still be required for statutory filings, complex tax matters and final financial decisions."
    },
    {
      q: "Can I Try AIBASS Before Purchasing?",
      a: "Yes. Businesses can explore the available bookkeeping and accounting capabilities through the 30 day free trial."
    }
  ];

  return (
    <div className="min-h-screen w-full bg-white relative overflow-hidden text-slate-950 font-sans">
      
      {/* Dynamic Background Glow */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none" 
        style={{
          backgroundImage: `
            radial-gradient(circle at 10% 20%, rgba(218, 235, 255, 0.7) 0%, transparent 50%),
            radial-gradient(circle at 90% 80%, rgba(224, 231, 255, 0.6) 0%, transparent 50%)
          `,
        }} 
      />

      <Header />
      <TrialFormModal />

      {/* Main Container */}
      <main className="relative z-10 mx-auto max-w-[1380px] w-full px-4 sm:px-8 lg:px-12 pb-16 pt-24">
        
        {/* Section 1: Hero Block */}
        <section className="relative py-8 md:py-16">
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-4 items-center max-w-7xl mx-auto">
            
            {/* Left Column: Headline, New Booking Description, Feature Pills, CTA Buttons */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              <h1 className="text-4xl sm:text-5xl lg:text-[52px] font-extrabold tracking-tight text-slate-950 leading-[1.12]">
                AI Based Accounting Software Built for{" "}
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Modern Businesses
                </span>
              </h1>
              
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-normal max-w-2xl">
                AI Booking Software that simplifies scheduling, bookings, and customer management. Automate appointment scheduling, manage bookings, reduce no-shows, and give customers an easier way to book your services.
              </p>

              {/* Feature Pills */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-2xl px-4 py-2.5 flex items-center gap-2.5 shadow-sm text-xs sm:text-sm font-semibold text-slate-800 hover:border-indigo-300 transition-all">
                  <div className="w-6 h-6 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <Mic className="h-3.5 w-3.5" />
                  </div>
                  <span>Voice & Text Commands</span>
                </div>

                <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-2xl px-4 py-2.5 flex items-center gap-2.5 shadow-sm text-xs sm:text-sm font-semibold text-slate-800 hover:border-indigo-300 transition-all">
                  <div className="w-6 h-6 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <Sparkles className="h-3.5 w-3.5" />
                  </div>
                  <span>AI Powered Automation</span>
                </div>

                <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-2xl px-4 py-2.5 flex items-center gap-2.5 shadow-sm text-xs sm:text-sm font-semibold text-slate-800 hover:border-indigo-300 transition-all">
                  <div className="w-6 h-6 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <ShieldCheck className="h-3.5 w-3.5" />
                  </div>
                  <span>Secure & Reliable</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Button 
                  onClick={openTrialModal}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-12 sm:h-13 px-7 sm:px-8 rounded-2xl flex items-center gap-2.5 transition-all shadow-md shadow-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/30 hover:scale-[1.01] text-sm sm:text-base cursor-pointer"
                >
                  Start 30 Day Free Trial
                  <ArrowRight className="h-4 w-4" />
                </Button>
                
                <Button 
                  onClick={openTrialModal}
                  variant="outline"
                  className="border-2 border-indigo-200/90 hover:border-indigo-400 bg-white text-slate-900 font-bold h-12 sm:h-13 px-7 sm:px-8 rounded-2xl flex items-center gap-2.5 transition-all shadow-xs hover:bg-slate-50 text-sm sm:text-base cursor-pointer"
                >
                  Book a Free Demo
                  <Calendar className="h-4 w-4 text-indigo-600" />
                </Button>
              </div>

              {/* Footer Subtext */}
              <div className="flex items-center gap-2.5 text-xs font-medium text-slate-500 pt-1">
                <div className="w-4 h-4 rounded-full bg-slate-200/80 flex items-center justify-center text-slate-700 text-[10px] font-bold">
                  ✓
                </div>
                <span>No credit card required</span>
                <span className="text-slate-300">•</span>
                <span>Cancel anytime</span>
              </div>

            </div>

            {/* Right Column: Award Badge Graphic with Floating Glass Badges */}
            <div className="lg:col-span-5 flex justify-center lg:justify-start items-center relative py-4 lg:-ml-4">
              <div className="relative w-full max-w-[500px] sm:max-w-[580px] flex items-center justify-center lg:justify-start">

                {/* Floating Glass Icon 1 - Top Right (Chart) */}
                <motion.div 
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-2 -right-1 sm:-right-3 z-20 w-14 sm:w-16 h-14 sm:h-16 rounded-full bg-white/95 backdrop-blur-md border border-blue-200/80 shadow-[0_8px_25px_rgba(37,99,235,0.15)] flex items-center justify-center text-blue-600"
                >
                  <BarChart3 className="h-7 w-7 sm:h-8 sm:w-8 stroke-[2.2]" />
                </motion.div>

                {/* Floating Glass Icon 2 - Bottom Right (Rupee Symbol) */}
                <motion.div 
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="absolute bottom-20 -right-1 sm:-right-3 z-20 w-14 sm:w-16 h-14 sm:h-16 rounded-full bg-white/95 backdrop-blur-md border border-blue-200/80 shadow-[0_8px_25px_rgba(37,99,235,0.15)] flex items-center justify-center text-blue-600"
                >
                  <IndianRupee className="h-7 w-7 sm:h-8 sm:w-8 stroke-[2.2]" />
                </motion.div>

                {/* Floating Glass Icon 3 - Bottom Left (Document / File Text) */}
                <motion.div 
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute bottom-6 -left-6 sm:-left-12 z-20 w-14 sm:w-16 h-14 sm:h-16 rounded-full bg-white/95 backdrop-blur-md border border-blue-200/80 shadow-[0_8px_25px_rgba(37,99,235,0.15)] flex items-center justify-center text-blue-600"
                >
                  <FileText className="h-7 w-7 sm:h-8 sm:w-8 stroke-[2.2]" />
                </motion.div>

                {/* Golden Award Image */}
                <img 
                  src="/images/Award Golden.png" 
                  alt="AI Company of the Year 2026 Award - SiliconIndia Recognition" 
                  className="relative z-10 w-full h-auto object-contain drop-shadow-2xl hover:scale-[1.02] transition-transform duration-300"
                />
              </div>
            </div>

          </div>
        </section>

        {/* Section 2: Product Highlights */}
        <section id="highlights" className="py-8 md:py-12 border-t border-slate-100 scroll-mt-24">
          <div className="max-w-6xl mx-auto bg-white border border-slate-200/60 rounded-[32px] p-6 md:p-10 shadow-[0_15px_40px_rgba(0,0,0,0.03)] space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight text-center">
              Product Highlights
            </h2>
            <div className="w-12 h-1 bg-indigo-600 rounded-full mx-auto" />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-4">
              {productHighlights.map((highlight, index) => (
                <motion.div 
                  key={index} 
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: index * 0.05 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="flex items-center gap-3 bg-slate-50/70 hover:bg-white hover:shadow-md transition-all p-4 rounded-2xl border border-slate-150 group cursor-pointer"
                >
                  <CheckCircle2 className="h-5 w-5 text-indigo-600 shrink-0 group-hover:scale-110 transition-transform duration-200" />
                  <span className="text-sm font-bold text-slate-800 group-hover:text-indigo-900 transition-colors">{highlight}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 3: AI Bookkeeping Backed by Recognized AI Expertise */}
        <section className="py-8 md:py-12 border-t border-slate-100">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                AI Bookkeeping Backed by Recognized AI Expertise
              </h2>
              <div className="w-12 h-1 bg-indigo-600 rounded-full mx-auto" />
            </div>

            <div className="space-y-4 text-base font-medium leading-relaxed text-slate-700 text-center max-w-4xl mx-auto">
              <p>
                AIBASS is an AI powered bookkeeping and accounting platform developed by Shree Andal AI Software Solutions (OPC) Private Limited, a DPIIT-recognized startup in the AI and Machine Learning sector. It is built to simplify everyday financial management by keeping bookkeeping, transactions, invoices, expenses, financial reports and cash flow information connected within one platform.
              </p>
              <p>
                The company behind AIBASS was also recognized by SiliconIndia Magazine as AI Company of the Year – Accounting Software 2026, highlighting its focus on applying AI and practical technology to modern accounting and business workflows.
              </p>
              <p className="font-semibold text-slate-850">
                For AIBASS users, this foundation supports a simpler way to manage financial records, reduce repeated work and access important bookkeeping information through connected AI driven workflows.
              </p>
            </div>

            {/* Recognition Feature Cards Banner */}
            <div className="pt-2 max-w-5xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Card 1: DPIIT Recognized */}
                <div className="bg-white/90 backdrop-blur-md border border-slate-200/90 hover:border-blue-300 rounded-2xl p-4 sm:p-5 flex items-center gap-3.5 shadow-xs hover:shadow-md transition-all group cursor-pointer">
                  <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0 group-hover:scale-110 transition-transform duration-200">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">DPIIT Recognized</h4>
                    <p className="text-[11px] sm:text-xs text-slate-500 font-medium leading-tight mt-0.5">Government of India Startup</p>
                  </div>
                </div>

                {/* Card 2: AI & ML Sector */}
                <div className="bg-white/90 backdrop-blur-md border border-slate-200/90 hover:border-indigo-300 rounded-2xl p-4 sm:p-5 flex items-center gap-3.5 shadow-xs hover:shadow-md transition-all group cursor-pointer">
                  <div className="w-11 h-11 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 group-hover:scale-110 transition-transform duration-200">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">AI & Machine Learning</h4>
                    <p className="text-[11px] sm:text-xs text-slate-500 font-medium leading-tight mt-0.5">Specialized Sector Focus</p>
                  </div>
                </div>

                {/* Card 3: AI Company of the Year */}
                <div className="bg-white/90 backdrop-blur-md border border-amber-200/90 hover:border-amber-400 rounded-2xl p-4 sm:p-5 flex items-center gap-3.5 shadow-xs hover:shadow-md transition-all group cursor-pointer">
                  <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-600 shrink-0 group-hover:scale-110 transition-transform duration-200">
                    <Star className="h-5 w-5 fill-amber-400 text-amber-500" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">AI Company of the Year</h4>
                    <p className="text-[11px] sm:text-xs text-slate-500 font-medium leading-tight mt-0.5">Accounting Software 2026</p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* Section 4: AI Bookkeeping Software Features */}
        <section className="py-8 md:py-12 border-t border-slate-100">
          <div className="space-y-12">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                AI Bookkeeping Software Features
              </h2>
              <p className="text-base font-medium text-slate-700">
                AIBASS combines AI bookkeeping, financial reporting and connected business information to make everyday bookkeeping easier to manage.
              </p>
              <div className="w-12 h-1 bg-indigo-600 rounded-full mx-auto" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {features.map((feat, idx) => {
                const Icon = feat.icon;
                return (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.45, delay: idx * 0.07 }}
                    whileHover={{ y: -6, scale: 1.012 }}
                    className="group relative bg-white border border-slate-200/80 rounded-[32px] p-6 md:p-8 space-y-4 shadow-sm hover:shadow-[0_20px_45px_rgba(79,70,229,0.08)] hover:border-indigo-200 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer"
                  >
                    {/* Corner accent glow on hover */}
                    <div className="absolute -top-12 -right-12 w-28 h-28 bg-indigo-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />

                    <div className="space-y-4 relative z-10">
                      <div className="flex items-center gap-3.5">
                        <div className={`p-3 rounded-2xl border ${feat.bg} flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-sm`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-650 transition-colors">{feat.title}</h3>
                      </div>
                      <p className="text-sm text-slate-650 leading-relaxed font-medium">
                        {feat.desc}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Section 5: Manage Bookkeeping Through Text or Voice Commands */}
        <AiAccountingCommands />

        {/* Section 6: How AIBASS Automates Bookkeeping */}
        <section className="py-8 md:py-12 border-t border-slate-100">
          <div className="max-w-6xl mx-auto space-y-10">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                How AIBASS Automates Bookkeeping
              </h2>
              <p className="text-base font-medium text-slate-700">
                AIBASS connects supported business transactions with relevant bookkeeping and financial information.
              </p>
              <div className="w-12 h-1 bg-indigo-600 rounded-full mx-auto" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {steps.map((st, idx) => (
                <motion.div 
                  key={st.num}
                  initial={{ opacity: 0, scale: 0.88, y: 30 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ duration: 0.4, delay: idx * 0.09 }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  className="group relative bg-white border border-slate-200/80 rounded-3xl p-6 space-y-3 shadow-sm hover:shadow-[0_18px_40px_rgba(79,70,229,0.08)] hover:border-indigo-300 transition-all duration-300 cursor-pointer overflow-hidden"
                >
                  <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white font-bold flex items-center justify-center text-lg shadow-md group-hover:scale-110 group-hover:bg-indigo-700 group-hover:rotate-3 transition-transform duration-300">
                    {st.num}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-650 transition-colors">{st.title}</h3>
                  <p className="text-sm text-slate-600 font-medium leading-relaxed">{st.desc}</p>
                </motion.div>
              ))}
            </div>

            <div className="bg-indigo-50/80 border border-indigo-100 rounded-[28px] p-6 md:p-8 space-y-3 max-w-4xl mx-auto text-center">
              <p className="text-sm md:text-base text-indigo-950 font-medium leading-relaxed">
                For example, when a supported sales invoice is created, AIBASS can record the sale, calculate the applicable GST, reduce relevant stock quantities and include the transaction in monthly financial information.
              </p>
              <p className="text-sm md:text-base text-indigo-900 font-bold leading-relaxed">
                This connected workflow helps reduce the gap between recording a transaction and understanding its financial effect.
              </p>
            </div>

            <div className="text-center">
              <Button 
                onClick={openTrialModal}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold h-12 px-8 rounded-full inline-flex items-center gap-2 group transition-all"
              >
                See How AIBASS Works
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        </section>

        {/* Section 7: Automate Everyday Bookkeeping Tasks */}
        <section className="py-8 md:py-12 border-t border-slate-100 overflow-hidden">
          <div className="max-w-6xl mx-auto space-y-10">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Automate Everyday Bookkeeping Tasks
              </h2>
              <p className="text-base font-medium text-slate-700">
                AIBASS bookkeeping automation software helps businesses handle routine financial activities more efficiently.
              </p>
              <div className="w-12 h-1 bg-indigo-600 rounded-full mx-auto" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {everydayTasks.map((task, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 50, scale: 0.88, rotateX: 10 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
                  viewport={{ once: false, amount: 0.2 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: idx * 0.1, 
                    ease: [0.25, 0.46, 0.45, 0.94] 
                  }}
                  whileHover={{ y: -8, scale: 1.025 }}
                  className="group relative bg-white border border-slate-200/80 rounded-3xl p-6 space-y-3 shadow-sm hover:shadow-[0_20px_45px_rgba(79,70,229,0.12)] hover:border-indigo-300 transition-all duration-300 cursor-pointer overflow-hidden"
                >
                  {/* Subtle hover accent line */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="flex items-center gap-2 text-indigo-600">
                    <CheckCircle2 className="h-5 w-5 shrink-0 group-hover:scale-125 group-hover:rotate-12 transition-transform duration-300" />
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-650 transition-colors">{task.title}</h3>
                  </div>
                  <p className="text-sm text-slate-650 font-medium leading-relaxed">{task.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 8: Turn Bookkeeping Records into Financial Statements */}
        <section className="py-8 md:py-12 border-t border-slate-100">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Turn Bookkeeping Records into Financial Statements
              </h2>
              <div className="space-y-2 text-base font-medium text-slate-700">
                <p>Bookkeeping records become more useful when businesses can turn them into clear financial information.</p>
                <p className="font-semibold text-slate-850">AIBASS uses available transaction, income and expense records to generate important financial statements.</p>
              </div>
              <div className="w-12 h-1 bg-indigo-600 rounded-full mx-auto" />
            </div>

            {/* H3 Section 1: Monthly Profit and Loss Statements */}
            <div className="bg-white border border-slate-200/80 rounded-[32px] p-6 md:p-8 space-y-6 shadow-sm">
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-slate-950">Monthly Profit and Loss Statements</h3>
                <p className="text-sm font-medium text-slate-650">
                  AIBASS generates monthly profit and loss statements using the income and expense information available in the platform.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <h4 className="text-sm font-bold uppercase tracking-wider text-indigo-600">Review Monthly Financial Performance</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    "Total business income",
                    "Operating expenses",
                    "Monthly profit or loss",
                    "Category wise income",
                    "Category wise expenses",
                    "Major cost movements",
                    "Changes in financial performance"
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-150 text-xs font-bold text-slate-800">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2 text-sm font-medium text-slate-700 border-t border-slate-100 pt-4">
                <p>The monthly P&L statement gives business owners a clear view of how the company performed during the selected month.</p>
                <p>It helps identify high expense categories, understand changes in profit and support more informed financial decisions.</p>
              </div>

              <div className="pt-2">
                <Button 
                  onClick={openTrialModal}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold h-11 px-6 rounded-full inline-flex items-center gap-2 group transition-all"
                >
                  Review Monthly Financial Performance
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </div>

            {/* H3 Section 2: Updated Balance Sheet Information */}
            <div className="bg-white border border-slate-200/80 rounded-[32px] p-6 md:p-8 space-y-6 shadow-sm">
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-slate-950">Updated Balance Sheet Information</h3>
                <p className="text-sm font-medium text-slate-650">
                  AIBASS creates balance sheet information using available financial and accounting records.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <h4 className="text-sm font-bold uppercase tracking-wider text-indigo-600">Understand Your Financial Position</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    "Business assets",
                    "Business liabilities",
                    "Relevant account balances",
                    "Current financial position",
                    "Period based financial information",
                    "Changes in financial balances"
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-150 text-xs font-bold text-slate-800">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2 text-sm font-medium text-slate-700 border-t border-slate-100 pt-4">
                <p>The balance sheet helps business owners understand what the company owns, what it owes and its overall financial position.</p>
                <p className="text-slate-500 italic text-xs">Users should review important financial statements before using them for statutory submissions, funding applications or lending decisions.</p>
              </div>
            </div>

            {/* H3 Section 3: Category Wise Financial Reports */}
            <div className="bg-white border border-slate-200/80 rounded-[32px] p-6 md:p-8 space-y-6 shadow-sm">
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-slate-950">Category Wise Financial Reports</h3>
                <p className="text-sm font-medium text-slate-650">
                  AIBASS organises available income and expenses into relevant business categories.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <h4 className="text-sm font-bold uppercase tracking-wider text-indigo-600">Review Important Financial Categories</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    "Income categories",
                    "Expense categories",
                    "Operating costs",
                    "Payroll costs",
                    "Inventory purchases",
                    "Tax related amounts",
                    "High spending areas",
                    "Important financial changes"
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-150 text-xs font-bold text-slate-800">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-sm font-medium text-slate-700 border-t border-slate-100 pt-4">
                <p>Instead of reviewing only total income or total expenses, businesses can understand which activities are affecting financial performance.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 9: Understand Cash Flow and Future Requirements */}
        <section className="py-8 md:py-12 border-t border-slate-100">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Understand Cash Flow and Future Requirements
              </h2>
              <div className="space-y-2 text-base font-medium text-slate-700">
                <p>Profit does not always mean that enough cash is available for upcoming expenses.</p>
                <p className="font-semibold text-slate-850">AIBASS provides cash flow statements and AI driven predictions using available financial information.</p>
              </div>
              <div className="w-12 h-1 bg-indigo-600 rounded-full mx-auto" />
            </div>

            <div className="bg-slate-900 text-white rounded-[32px] p-8 md:p-10 space-y-6 shadow-xl border border-slate-800">
              <h3 className="text-xl font-bold uppercase tracking-wider text-sky-400">Cash Flow Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  "Current cash movement",
                  "Incoming financial activity",
                  "Outgoing expenses",
                  "Expected cash availability",
                  "Potential future shortages",
                  "Upcoming financial requirements",
                  "Expense planning information",
                  "Investment planning support"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-slate-800 p-3.5 rounded-xl border border-slate-700">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span className="text-xs font-semibold text-slate-200">{item}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 text-sm text-slate-300 pt-4 border-t border-slate-800">
                <p>Cash flow forecasting gives business owners earlier visibility into possible financial pressure and helps them prepare for future payments.</p>
                <p className="text-slate-400 italic text-xs">Predictions should be reviewed alongside confirmed payments, expected collections and current business conditions.</p>
              </div>

              <div className="pt-2">
                <Button 
                  onClick={() => navigate("/cashflow")}
                  className="bg-sky-500 hover:bg-sky-600 text-white font-semibold h-11 px-6 rounded-full inline-flex items-center gap-2 group transition-all"
                >
                  Explore Cash Flow Forecasting Software
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Section 10: Keep Bookkeeping Connected with Business Operations */}
        <section className="py-8 md:py-12 border-t border-slate-100">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Keep Bookkeeping Connected with Business Operations
              </h2>
              <p className="text-base font-medium text-slate-700">
                AIBASS connects bookkeeping with other supported business activities, helping users maintain more consistent records.
              </p>
              <div className="w-12 h-1 bg-indigo-600 rounded-full mx-auto" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* AI Invoicing */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.93, y: 25 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.45, delay: 0 }}
                whileHover={{ y: -6, scale: 1.015 }}
                className="group bg-white border border-slate-200/80 rounded-[32px] p-6 md:p-8 space-y-4 shadow-sm hover:shadow-[0_20px_45px_rgba(79,70,229,0.08)] hover:border-indigo-300 transition-all duration-300 flex flex-col justify-between cursor-pointer"
              >
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-650 transition-colors">AI Invoicing</h3>
                  <p className="text-sm font-medium text-slate-650">Create supported customer sales invoices using text or voice commands.</p>
                  <p className="text-sm font-medium text-slate-650">Relevant invoice information can be connected with sales records, GST values, inventory updates and monthly income information.</p>
                </div>
                <div className="pt-2">
                  <Button 
                    onClick={() => navigate("/invoice")}
                    variant="outline"
                    className="border-indigo-200 text-indigo-600 hover:bg-indigo-50 font-semibold rounded-full inline-flex items-center gap-2 group-hover:bg-indigo-600 group-hover:text-white transition-all"
                  >
                    Explore AI Invoicing Software
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </motion.div>

              {/* GST Calculation Support */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.93, y: 25 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.45, delay: 0.1 }}
                whileHover={{ y: -6, scale: 1.015 }}
                className="group bg-white border border-slate-200/80 rounded-[32px] p-6 md:p-8 space-y-4 shadow-sm hover:shadow-[0_20px_45px_rgba(79,70,229,0.08)] hover:border-indigo-300 transition-all duration-300 flex flex-col justify-between cursor-pointer"
              >
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-650 transition-colors">GST Calculation Support</h3>
                  <p className="text-sm font-medium text-slate-650">AIBASS calculates applicable GST during supported sales invoice creation.</p>
                  
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600">Supported GST Calculations</h4>
                    <div className="flex flex-wrap gap-2">
                      {["CGST calculation", "SGST calculation", "IGST calculation", "Intrastate transaction support", "Interstate transaction support", "GST value tracking", "Connected invoice information"].map((gst, i) => (
                        <span key={i} className="text-xs bg-slate-100 text-slate-800 px-2.5 py-1 rounded-lg font-semibold group-hover:bg-indigo-50 group-hover:text-indigo-900 transition-colors">{gst}</span>
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 font-medium">CGST and SGST can be calculated for supported intrastate transactions, while IGST can be calculated for supported interstate transactions.</p>
                  <p className="text-xs text-slate-400 italic">Businesses should verify tax information and use qualified professional support for final filings and compliance decisions.</p>
                </div>

                <div className="pt-2">
                  <Button 
                    onClick={() => navigate("/tax-gst")}
                    variant="outline"
                    className="border-indigo-200 text-indigo-600 hover:bg-indigo-50 font-semibold rounded-full inline-flex items-center gap-2 group-hover:bg-indigo-600 group-hover:text-white transition-all"
                  >
                    Explore GST Accounting Software
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </motion.div>

              {/* Inventory Updates */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.93, y: 25 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.45, delay: 0.2 }}
                whileHover={{ y: -6, scale: 1.015 }}
                className="group bg-white border border-slate-200/80 rounded-[32px] p-6 md:p-8 space-y-4 shadow-sm hover:shadow-[0_20px_45px_rgba(79,70,229,0.08)] hover:border-indigo-300 transition-all duration-300 flex flex-col justify-between cursor-pointer"
              >
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-650 transition-colors">Inventory Updates</h3>
                  <p className="text-sm font-medium text-slate-650">AIBASS connects supported purchase and sales invoice information with relevant stock quantities.</p>
                  
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600">Connected Inventory Activities</h4>
                    <div className="flex flex-wrap gap-2">
                      {["Purchase based stock additions", "Sales based stock reductions", "Current stock visibility", "Low stock identification", "Inventory related expenses", "Connected purchase records", "Connected sales records"].map((inv, i) => (
                        <span key={i} className="text-xs bg-slate-100 text-slate-800 px-2.5 py-1 rounded-lg font-semibold group-hover:bg-indigo-50 group-hover:text-indigo-900 transition-colors">{inv}</span>
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 font-medium">This helps retailers, traders, distributors and manufacturing businesses understand how inventory movements affect financial information.</p>
                </div>

                <div className="pt-2">
                  <Button 
                    onClick={() => navigate("/inventory")}
                    variant="outline"
                    className="border-indigo-200 text-indigo-600 hover:bg-indigo-50 font-semibold rounded-full inline-flex items-center gap-2 group-hover:bg-indigo-600 group-hover:text-white transition-all"
                  >
                    Explore Inventory Management Software
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </motion.div>

              {/* Payroll Information */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.93, y: 25 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.45, delay: 0.3 }}
                whileHover={{ y: -6, scale: 1.015 }}
                className="group bg-white border border-slate-200/80 rounded-[32px] p-6 md:p-8 space-y-4 shadow-sm hover:shadow-[0_20px_45px_rgba(79,70,229,0.08)] hover:border-indigo-300 transition-all duration-300 flex flex-col justify-between cursor-pointer"
              >
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-650 transition-colors">Payroll Information</h3>
                  <p className="text-sm font-medium text-slate-650">Payroll expenses affect monthly financial reports and cash flow.</p>
                  <p className="text-sm font-medium text-slate-650">AIBASS helps organise supported salary calculations, deductions, employee payment information and payroll related expenses within relevant financial records.</p>
                  <p className="text-xs text-slate-400 italic">Businesses should verify salary details, deductions and statutory requirements before completing payroll activities.</p>
                </div>

                <div className="pt-2">
                  <Button 
                    onClick={() => navigate("/payroll")}
                    variant="outline"
                    className="border-indigo-200 text-indigo-600 hover:bg-indigo-50 font-semibold rounded-full inline-flex items-center gap-2 group-hover:bg-indigo-600 group-hover:text-white transition-all"
                  >
                    Explore Payroll Management
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </motion.div>
            </div>

            {/* AI Supported Fraud Monitoring Banner */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -4, scale: 1.01 }}
              className="bg-rose-50/80 border border-rose-150 rounded-[32px] p-6 md:p-8 space-y-4 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-rose-950">AI Supported Fraud Monitoring</h3>
                <p className="text-sm font-medium text-rose-900">AIBASS uses AI supported monitoring to flag financial activities that may require closer attention.</p>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-800">Activities That May Require Review</h4>
                <div className="flex flex-wrap gap-2">
                  {["Unusual transaction patterns", "Duplicate transactions", "Unexpected financial movements", "Abnormal payment activity", "Records requiring user review"].map((act, i) => (
                    <span key={i} className="text-xs bg-white text-rose-900 border border-rose-200 px-3 py-1 rounded-lg font-semibold">{act}</span>
                  ))}
                </div>
              </div>

              <div className="space-y-1 text-xs text-rose-900 font-medium border-t border-rose-200/60 pt-3">
                <p>Flagged activities should be reviewed by an authorised person before any action is taken.</p>
                <p className="italic">AI supported fraud monitoring helps businesses identify potential concerns earlier but does not replace internal financial controls or professional investigation.</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Section 11: Benefits of AIBASS AI Bookkeeping Software */}
        <section className="py-8 md:py-12 border-t border-slate-100">
          <div className="max-w-6xl mx-auto space-y-10">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Benefits of AIBASS AI Bookkeeping Software
              </h2>
              <div className="w-12 h-1 bg-indigo-600 rounded-full mx-auto" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((ben, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 35, rotateX: 12, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ duration: 0.45, delay: idx * 0.08, ease: "easeOut" }}
                  whileHover={{ y: -8, scale: 1.025 }}
                  className="group relative bg-white border border-slate-200/80 rounded-3xl p-6 space-y-3 shadow-sm hover:shadow-[0_22px_45px_rgba(79,70,229,0.12)] hover:border-indigo-300 transition-all duration-300 cursor-pointer overflow-hidden"
                >
                  {/* Top gradient accent bar on hover */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-sky-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 group-hover:scale-125 group-hover:bg-indigo-600 group-hover:text-white group-hover:rotate-12 transition-all duration-300 shadow-sm">
                      <Sparkles className="h-5 w-5 transition-transform duration-500 group-hover:rotate-[180deg]" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-650 transition-colors">{ben.title}</h3>
                  </div>
                  <p className="text-sm text-slate-650 font-medium leading-relaxed">{ben.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 12: AI Bookkeeping Software for Different Businesses */}
        <section className="py-8 md:py-12 border-t border-slate-100">
          <div className="max-w-6xl mx-auto space-y-10">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                AI Bookkeeping Software for Different Businesses
              </h2>
              <div className="w-12 h-1 bg-indigo-600 rounded-full mx-auto" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {businessTypes.map((biz, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, scale: 0.85, y: 20 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ type: "spring", stiffness: 120, damping: 16, delay: idx * 0.07 }}
                  whileHover={{ y: -8, scale: 1.025 }}
                  className="group bg-white border border-slate-200/80 rounded-3xl p-6 space-y-3 shadow-sm hover:shadow-[0_20px_45px_rgba(16,185,129,0.08)] hover:border-emerald-300 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-125 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 shadow-sm">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">{biz.title}</h3>
                  </div>
                  <p className="text-sm text-slate-650 font-medium leading-relaxed">{biz.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 13: Why Businesses Choose AIBASS AI Bookkeeping */}
        <section className="py-8 md:py-12 border-t border-slate-100 overflow-hidden">
          <div className="max-w-6xl mx-auto space-y-10">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Why Businesses Choose AIBASS AI Bookkeeping
              </h2>
              <div className="w-12 h-1 bg-indigo-600 rounded-full mx-auto" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {whyChoose.map((item, idx) => {
                const isLeftColumn = idx % 2 === 0;
                return (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: isLeftColumn ? -130 : 130 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false, amount: 0.2 }}
                    transition={{ 
                      duration: 0.55, 
                      delay: Math.floor(idx / 2) * 0.1, 
                      ease: [0.21, 0.47, 0.32, 0.98] 
                    }}
                    whileHover={{ y: -6, scale: 1.015 }}
                    className="group bg-white border border-slate-200/80 rounded-3xl p-6 space-y-3 shadow-sm hover:shadow-[0_18px_40px_rgba(79,70,229,0.08)] hover:border-indigo-300 transition-all duration-300 cursor-pointer"
                  >
                    <div className="flex items-center gap-3 text-indigo-600">
                      <CheckCircle2 className="h-6 w-6 shrink-0 group-hover:scale-125 group-hover:rotate-6 transition-transform duration-300" />
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-650 transition-colors">{item.title}</h3>
                    </div>
                    <p className="text-sm text-slate-650 font-medium leading-relaxed pl-9">{item.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Section 14: AIBASS Versus Manual Bookkeeping */}
        <section className="py-8 md:py-12 border-t border-slate-100">
          <div className="max-w-6xl mx-auto space-y-10">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                AIBASS Versus Manual Bookkeeping
              </h2>
              <div className="w-12 h-1 bg-indigo-600 rounded-full mx-auto" />
            </div>

            <div className="overflow-x-auto rounded-[28px] border border-slate-200/80 shadow-sm bg-white">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-slate-900 text-white">
                    <th className="p-4 sm:p-5 text-sm font-bold">Feature</th>
                    <th className="p-4 sm:p-5 text-sm font-bold text-slate-300">Manual Bookkeeping</th>
                    <th className="p-4 sm:p-5 text-sm font-bold text-sky-400">AIBASS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {comparisons.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-4 sm:p-5 text-sm font-bold text-slate-900">{row.feature}</td>
                      <td className="p-4 sm:p-5 text-xs sm:text-sm text-slate-600 font-medium">{row.manual}</td>
                      <td className="p-4 sm:p-5 text-xs sm:text-sm text-indigo-900 font-bold bg-indigo-50/40">{row.aibass}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Section 15: Connected AIBASS Products */}
        <section className="py-8 md:py-12 border-t border-slate-100">
          <div className="max-w-6xl mx-auto space-y-10">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Connected AIBASS Products
              </h2>
              <div className="w-12 h-1 bg-indigo-600 rounded-full mx-auto" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {connectedProducts.map((prod, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  className="group bg-white border border-slate-200/80 rounded-3xl p-6 space-y-4 shadow-sm hover:shadow-[0_18px_40px_rgba(79,70,229,0.08)] hover:border-indigo-300 transition-all duration-300 flex flex-col justify-between cursor-pointer"
                >
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-650 transition-colors">{prod.title}</h3>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">{prod.desc}</p>
                  </div>
                  <div>
                    <Button 
                      onClick={() => navigate(prod.route)}
                      variant="ghost"
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 p-0 h-auto flex items-center gap-1 group-hover:translate-x-1 transition-all"
                    >
                      Explore Product
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 16: Automate Business Bookkeeping with AIBASS (Bottom Banner CTA) */}
        <section className="py-8 md:py-12 border-t border-slate-100">
          <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 rounded-[36px] p-8 md:p-12 text-center text-white space-y-6 shadow-2xl relative overflow-hidden">
            <div className="relative z-10 max-w-3xl mx-auto space-y-4">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Automate Business Bookkeeping with AIBASS
              </h2>
              <p className="text-base sm:text-lg font-medium text-slate-200 leading-relaxed">
                Reduce routine financial work, organise important records and understand your business performance through one connected AI bookkeeping platform.
              </p>
              <p className="text-sm font-semibold text-slate-300">
                Manage transactions, invoices, GST, inventory, payroll and cash flow information using simple text or voice commands.
              </p>
              
              <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
                <Button 
                  onClick={openTrialModal}
                  className="bg-white text-slate-950 hover:bg-slate-100 font-semibold h-12 px-8 rounded-full inline-flex items-center gap-2 group transition-all shadow-md"
                >
                  Start 30 Day Free Trial
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button 
                  onClick={openTrialModal}
                  className="border border-white/40 bg-white/10 hover:bg-white/20 text-white font-semibold h-12 px-8 rounded-full inline-flex items-center gap-2 transition-all backdrop-blur-sm"
                >
                  Book a Free Demo
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Section 17: Frequently Asked Questions */}
        <section className="py-8 md:py-12 border-t border-slate-100">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Frequently Asked Questions
              </h2>
              <div className="w-12 h-1 bg-indigo-600 rounded-full mx-auto" />
            </div>

            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqs.map((faq, idx) => (
                <AccordionItem 
                  key={idx} 
                  value={`item-${idx}`}
                  className="bg-white border border-slate-200/80 rounded-2xl px-6 py-2 shadow-sm"
                >
                  <AccordionTrigger className="text-left font-bold text-slate-900 hover:text-indigo-600 text-base">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm font-medium text-slate-650 leading-relaxed pt-2">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

      </main>

      {/* Website Footer */}
      <Footer />

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-slate-950 border border-slate-800 text-white shadow-xl hover:bg-slate-850 hover:scale-105 active:scale-95 transition-all"
            aria-label="Scroll to top"
          >
            <ArrowUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>

    </div>
  );
};

export default ProductPage;
