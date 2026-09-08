import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Mic, 
  FileText, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  Share2, 
  Download, 
  MessageSquare, 
  Package, 
  TrendingUp, 
  Calculator, 
  HelpCircle, 
  ArrowUp,
  Layers,
  Check,
  Building2,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { TrialFormModal } from "@/components/TrialFormModal";
import { AiInvoicingRecognitionBanner } from "@/components/AiInvoicingRecognitionBanner";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// Interactive sample prompts for the AI Invoice Simulator
const SAMPLE_PROMPTS = [
  {
    title: "B2B Sales Invoice",
    prompt: "Create tax invoice for TechCorp India, 10 units Dell Laptops at ₹55,000 each with 18% GST",
    customer: "TechCorp India Pvt Ltd (GSTIN: 27AABCT3518Q1ZB)",
    items: [{ name: "Dell Latitude Laptops", qty: 10, rate: 55000, hsn: "8471", gst: 18 }],
    taxType: "CGST (9%) + SGST (9%)",
    totalAmount: "₹6,49,000",
    stockDeduction: "-10 Laptops in Mumbai Warehouse",
    status: "Accounts & Stock Synced"
  },
  {
    title: "Interstate IGST Invoice",
    prompt: "Generate GST sales bill for Apex Retail Bangalore, 25 Wireless Keyboards @ ₹1,800 + 18% IGST",
    customer: "Apex Retailers (GSTIN: 29AAACA1234F1Z5)",
    items: [{ name: "Wireless Mechanical Keyboards", qty: 25, rate: 1800, hsn: "8471", gst: 18 }],
    taxType: "IGST (18%)",
    totalAmount: "₹53,100",
    stockDeduction: "-25 Keyboards in Main Depot",
    status: "Accounts & Stock Synced"
  },
  {
    title: "Voice Command Retail Cash Invoice",
    prompt: "Issue cash invoice for 5 bags UltraTech Cement at ₹390 each with 28% GST",
    customer: "Walk-in Cash Customer (Local Retail)",
    items: [{ name: "UltraTech Super Cement (50kg)", qty: 5, rate: 390, hsn: "2523", gst: 28 }],
    taxType: "CGST (14%) + SGST (14%)",
    totalAmount: "₹2,496",
    stockDeduction: "-5 Bags in Store Counter",
    status: "Accounts & Stock Synced"
  }
];

const AiCommandInteractiveSection = () => {
  const [isInView, setIsInView] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [textStage, setTextStage] = useState<"typing" | "thinking" | "done">("typing");
  
  const [voiceTypedText, setVoiceTypedText] = useState("");
  const [voiceStage, setVoiceStage] = useState<"listening" | "thinking" | "done">("listening");

  const fullTextCommand = "“Create a sales invoice for this customer.”";
  const fullVoiceCommand = "“Create an invoice for five units of this product.”";

  const triggerAnimation = () => {
    setTypedText("");
    setTextStage("typing");
    setVoiceTypedText("");
    setVoiceStage("listening");

    // 1. Text Command Typing Loop
    let textIndex = 0;
    const typeInterval = setInterval(() => {
      if (textIndex <= fullTextCommand.length) {
        setTypedText(fullTextCommand.slice(0, textIndex));
        textIndex++;
      } else {
        clearInterval(typeInterval);
        setTextStage("thinking");
        setTimeout(() => {
          setTextStage("done");
        }, 1200);
      }
    }, 40);

    // 2. Voice Command Typing & Listening Loop
    let voiceIndex = 0;
    const voiceInterval = setInterval(() => {
      if (voiceIndex <= fullVoiceCommand.length) {
        setVoiceTypedText(fullVoiceCommand.slice(0, voiceIndex));
        voiceIndex++;
      } else {
        clearInterval(voiceInterval);
        setVoiceStage("thinking");
        setTimeout(() => {
          setVoiceStage("done");
        }, 1200);
      }
    }, 40);
  };

  useEffect(() => {
    if (isInView) {
      triggerAnimation();
    }
  }, [isInView]);

  return (
    <motion.section 
      onViewportEnter={() => setIsInView(true)}
      viewport={{ once: false, amount: 0.2 }}
      className="py-12 md:py-16 border-t border-slate-100 bg-transparent"
    >
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="space-y-4 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Create Invoices Using Text or Voice Commands
          </h2>
          <p className="text-sm font-medium leading-relaxed text-slate-700 sm:text-base">
            AIBASS allows users to communicate with the invoicing product naturally.
          </p>
          <div className="w-12 h-1 bg-indigo-600 rounded-full mx-auto" />
        </div>

        {/* 3 Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Card 1: Text Command */}
          <div className="bg-white border border-slate-200/80 rounded-[32px] p-6 sm:p-8 shadow-[0_10px_35px_rgba(0,0,0,0.03)] hover:border-indigo-200 transition-all flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-950">Create an Invoice with Text</h3>
                  <span className="text-xs text-slate-500 font-medium">Text Input Mode</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm font-medium text-slate-655">
                Enter a simple instruction in the command box.
              </p>

              {/* User command box with typewriter effect */}
              <div className="bg-indigo-50/60 border border-indigo-100 rounded-2xl p-4 shadow-sm space-y-1.5 relative overflow-hidden min-h-[90px] flex flex-col justify-between">
                <span className="text-[10px] uppercase font-extrabold text-indigo-650 tracking-wider block flex items-center gap-1.5">
                  <MessageSquare className="h-3 w-3 text-indigo-600" /> User command
                </span>
                
                <p className="text-sm font-bold text-slate-900 leading-snug">
                  {typedText}
                  {textStage === "typing" && <span className="inline-block w-1.5 h-4 bg-indigo-600 ml-0.5 animate-pulse" />}
                </p>

                {/* AI Thinking bar inside prompt */}
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

              {/* AIBASS Response */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-1.5 min-h-[100px] transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-extrabold text-indigo-600 tracking-wider block flex items-center gap-1">
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
                    The platform uses the available customer and transaction information to prepare the sales invoice and calculate the applicable GST.
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
              <CheckCircle2 className="h-4 w-4" /> Automated GST Calculation Included
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
                  <h3 className="text-lg font-bold text-slate-950">Create an Invoice with Voice</h3>
                  <span className="text-xs text-slate-500 font-medium">Hands-free Voice Mode</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm font-medium text-slate-655">
                Speak the required instruction instead of typing it.
              </p>

              {/* User command bubble with voice waveform animation */}
              <div className="bg-slate-950 border border-slate-800 text-white rounded-2xl p-4 shadow-sm space-y-1.5 relative overflow-hidden min-h-[90px] flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-extrabold text-emerald-400 tracking-wider block flex items-center gap-1.5">
                    <Mic className="h-3 w-3 animate-pulse text-emerald-400" /> User command
                  </span>
                  
                  {/* Frequency Equalizer Soundwave Bars */}
                  <div className="flex items-center gap-1 h-3">
                    <span className="w-1 bg-emerald-400 h-full rounded-full animate-pulse" />
                    <span className="w-1 bg-emerald-400 h-2/3 rounded-full animate-pulse [animation-delay:0.2s]" />
                    <span className="w-1 bg-emerald-400 h-full rounded-full animate-pulse [animation-delay:0.4s]" />
                    <span className="w-1 bg-emerald-400 h-1/2 rounded-full animate-pulse [animation-delay:0.1s]" />
                  </div>
                </div>

                <p className="text-sm font-bold text-emerald-100 leading-snug">
                  {voiceTypedText}
                  {voiceStage === "listening" && <span className="inline-block w-1.5 h-4 bg-emerald-400 ml-0.5 animate-pulse" />}
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

              {/* AIBASS Response */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-1.5 min-h-[100px] transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-extrabold text-indigo-600 tracking-wider block flex items-center gap-1">
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
                    The platform prepares the invoice using the available product, quantity, pricing and customer information.
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
              <CheckCircle2 className="h-4 w-4" /> Instant Speech-to-Invoice Processing
            </div>
          </div>

          {/* Card 3: Review the Result */}
          <div className="bg-white border border-slate-200/80 rounded-[32px] p-6 sm:p-8 shadow-[0_10px_35px_rgba(0,0,0,0.03)] hover:border-indigo-200 transition-all flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-950">Review the Result</h3>
                  <span className="text-xs text-slate-500 font-medium">Pre-completion Verification</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm font-medium text-slate-655">
                Before completing the invoice, users can verify:
              </p>

              <div className="space-y-2">
                {[
                  "Customer name and details",
                  "Product or service information",
                  "Quantity",
                  "Price",
                  "GST rate",
                  "CGST and SGST or IGST",
                  "Invoice total"
                ].map((item, idx) => (
                  <motion.div 
                    key={idx} 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * idx }}
                    className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100/80"
                  >
                    <div className="w-5 h-5 rounded-md bg-indigo-100 flex items-center justify-center text-indigo-600 flex-shrink-0">
                      <Check className="h-3 w-3 font-bold" />
                    </div>
                    <span className="text-xs font-bold text-slate-800">{item}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center gap-2 text-xs font-bold text-indigo-600">
              <CheckCircle2 className="h-4 w-4" /> Full Control Before Final Posting
            </div>
          </div>

        </div>

        {/* CTA Button */}
        <div className="pt-4 text-center">
          <Button 
            onClick={() => window.dispatchEvent(new CustomEvent("openTrialModal"))}
            className="h-12 px-8 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm sm:text-base shadow-lg transition-all hover:-translate-y-0.5 inline-flex items-center gap-2 group"
          >
            Try Text and Voice Invoicing
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>

      </div>
    </motion.section>
  );
};

export const AiInvoicingSoftware = () => {
  const navigate = useNavigate();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [selectedPromptIndex, setSelectedPromptIndex] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [customCommand, setCustomCommand] = useState(SAMPLE_PROMPTS[0].prompt);
  const [activeTab, setActiveTab] = useState("all");
  const { scrollY } = useScroll();

  // Set exact page meta title and description for SEO as specified
  useEffect(() => {
    const title = "AI Invoicing Software for GST Sales Invoices | AIBASS";
    const description = "Create GST sales invoices using text or voice commands. AIBASS automates GST calculations and connects invoices with accounts and inventory.";

    document.title = title;
    
    const updateMetaTag = (selector: string, attribute: string, content: string) => {
      let el = document.querySelector(selector);
      if (el) {
        el.setAttribute(attribute, content);
      } else {
        el = document.createElement("meta");
        if (selector.includes('property=')) {
          const propName = selector.match(/property="([^"]+)"/)?.[1];
          if (propName) el.setAttribute("property", propName);
        } else if (selector.includes('name=')) {
          const nameVal = selector.match(/name="([^"]+)"/)?.[1];
          if (nameVal) el.setAttribute("name", nameVal);
        }
        el.setAttribute(attribute, content);
        document.head.appendChild(el);
      }
    };

    updateMetaTag('meta[name="description"]', "content", description);
    updateMetaTag('meta[property="og:title"]', "content", title);
    updateMetaTag('meta[property="og:description"]', "content", description);
    updateMetaTag('meta[name="twitter:title"]', "content", title);
    updateMetaTag('meta[name="twitter:description"]', "content", description);
    
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const currentSample = SAMPLE_PROMPTS[selectedPromptIndex];

  const runSimulation = (index: number) => {
    setSelectedPromptIndex(index);
    setCustomCommand(SAMPLE_PROMPTS[index].prompt);
    setIsSimulating(true);
    setTimeout(() => setIsSimulating(false), 500);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const features = [
    {
      icon: Mic,
      color: "bg-blue-50 text-blue-600 border-blue-100",
      title: "Voice & Text Command Creation",
      description: "Speak or type naturally. Tell AIBASS customer names, items, quantities and rates. The AI parses the details and populates the invoice instantly."
    },
    {
      icon: Calculator,
      color: "bg-emerald-50 text-emerald-600 border-emerald-100",
      title: "Automated GST & HSN Calculation",
      description: "Automatically computes CGST + SGST for intrastate sales or IGST for interstate transactions based on buyer location and exact HSN tax rates."
    },
    {
      icon: Package,
      color: "bg-amber-50 text-amber-600 border-amber-100",
      title: "Connected Stock & Inventory Sync",
      description: "Every sales invoice immediately reduces stock levels, updates product inventory counts, and triggers low-stock reorder reminders."
    },
    {
      icon: TrendingUp,
      color: "bg-indigo-50 text-indigo-600 border-indigo-100",
      title: "Automated Accounts & Revenue Entries",
      description: "Generates double-entry accounting records automatically. Credits Sales Revenue, debits Accounts Receivable/Cash, and posts GST liability."
    },
    {
      icon: Share2,
      color: "bg-purple-50 text-purple-600 border-purple-100",
      title: "Instant PDF, WhatsApp & Email Dispatch",
      description: "Send professional GST invoices with company branding, payment links, and QR codes directly via WhatsApp or email in one click."
    },
    {
      icon: ShieldCheck,
      color: "bg-rose-50 text-rose-600 border-rose-100",
      title: "100% GST Compliant & E-Way Ready",
      description: "Generates invoice formats adhering to statutory GST laws, ready for GSTR-1 filing, e-invoicing portals, and e-way bill generation."
    }
  ];

  const workflowSteps = [
    {
      step: "01",
      title: "Give a Simple Command",
      description: "Speak into your phone microphone or type a natural prompt like: 'Invoice Metro Traders 20 cartons Oil @ ₹1200 + 12% GST'."
    },
    {
      step: "02",
      title: "AI Parse & Tax Calculation",
      description: "AIBASS AI extracts the customer, items, rates, and applies exact HSN codes and CGST/SGST/IGST tax rates automatically."
    },
    {
      step: "03",
      title: "Instant Stock & Accounts Update",
      description: "Inventory counts are adjusted in real time and double-entry accounting ledgers are updated without manual bookkeeper entries."
    },
    {
      step: "04",
      title: "Send & Collect Payment",
      description: "Download tax invoice PDF or send it directly to customer's WhatsApp with payment link for immediate settlement."
    }
  ];

  const faqs = [
    {
      q: "How does AI invoicing work with voice and text commands?",
      a: "AIBASS uses advanced Natural Language Processing (NLP) tailored for Indian business accounting. When you speak or type details such as customer name, item name, quantity, and rate, AIBASS automatically matches your customer directory, identifies the correct HSN code, applies appropriate GST tax rates, and drafts a complete GST-compliant sales invoice in seconds."
    },
    {
      q: "Does AIBASS calculate CGST, SGST, and IGST automatically?",
      a: "Yes. AIBASS compares your business state code with the customer's GSTIN or delivery location. If both are in the same state, it splits tax into CGST and SGST equally. If the customer is in another state, it automatically applies IGST."
    },
    {
      q: "How does AIBASS connect invoices with stock and inventory?",
      a: "When a sales invoice is created, AIBASS automatically deducts the invoiced item quantities from your active inventory ledger. If stock falls below set minimum thresholds, AIBASS alerts you to reorder, ensuring your stock records are always accurate."
    },
    {
      q: "Can I customize invoice templates with my business logo and terms?",
      a: "Absolutely. You can add your business logo, custom color scheme, bank details, payment UPI QR code, terms & conditions, and authorized signature to produce beautiful, professional invoices."
    },
    {
      q: "Are the invoices generated by AIBASS valid for GST returns filing?",
      a: "Yes. All invoices generated by AIBASS include statutory mandatory details such as Supplier GSTIN, Buyer GSTIN, Invoice Number, Invoice Date, HSN/SAC Codes, Place of Supply, Itemized Tax Rates, and Total Tax Amount required for GSTR-1 filing."
    }
  ];

  return (
    <div className="min-h-screen w-full bg-white relative overflow-hidden text-slate-950 font-sans">
      
      {/* Background Radial Glow */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none" 
        style={{
          backgroundImage: `
            radial-gradient(circle at 15% 15%, rgba(224, 231, 255, 0.7) 0%, transparent 45%),
            radial-gradient(circle at 85% 85%, rgba(218, 235, 255, 0.6) 0%, transparent 45%)
          `,
        }} 
      />

      <Header />
      <TrialFormModal />

      <main className="relative z-10 mx-auto max-w-[1380px] w-full px-4 sm:px-8 lg:px-12 pt-28 pb-16">
        
        {/* HERO SECTION - Slide Left + Scale Up Right */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="relative items-center gap-10 py-6 lg:py-12 bg-transparent"
        >
          <div className="max-w-[1380px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              
              {/* Left Content - Slide in from Left */}
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="lg:col-span-5 flex flex-col justify-center space-y-6"
              >
                <div className="inline-flex items-center">
                  <span className="text-xs font-bold tracking-[0.2em] text-indigo-600 bg-indigo-50/50 px-3 py-1 rounded-full border border-indigo-100 uppercase">
                    AIBASS
                  </span>
                </div>
                
                <h1 className="text-balance text-3xl font-bold leading-[1.2] tracking-tight text-slate-950 sm:text-4xl lg:text-5xl xl:text-[52px]">
                  AI Invoicing Software for Faster GST Sales Invoices
                </h1>
                
                <div className="space-y-4 text-sm font-medium leading-relaxed text-slate-700 sm:text-base">
                  <p>
                    Create customer sales invoices using simple text or voice commands. AIBASS automatically calculates the applicable GST and connects invoice information with accounting and inventory records.
                  </p>
                  <p>
                    Spend less time moving between different screens and manage your complete sales invoicing process from one connected AI accounting platform.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                  <Button 
                    onClick={() => window.dispatchEvent(new CustomEvent("openTrialModal"))}
                    className="w-full sm:w-auto h-12 rounded-full bg-slate-950 px-6 text-sm font-semibold text-white shadow-md hover:bg-slate-800 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Start 30 Day Free Trial
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => window.dispatchEvent(new CustomEvent("openTrialModal"))}
                    className="w-full sm:w-auto h-12 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold px-6 text-sm transition-all hover:-translate-y-0.5 cursor-pointer"
                  >
                    Book a Free Demo
                  </Button>
                </div>
              </motion.div>

              {/* Right Interface Mockup - Scale & Float up */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                className="lg:col-span-7 relative flex justify-center items-center"
              >
                {/* Main Window Mockup */}
                <div className="w-full max-w-3xl bg-white/80 border border-slate-200/60 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.06)] backdrop-blur-xl overflow-hidden flex flex-col aspect-[1.35] min-h-[460px] max-h-[520px]">
                  
                  {/* Window Header */}
                  <div className="flex items-center justify-between px-6 py-3 border-b border-slate-100 bg-white/40">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-400" />
                      <div className="w-3 h-3 rounded-full bg-yellow-400" />
                      <div className="w-3 h-3 rounded-full bg-green-400" />
                    </div>
                    
                    {/* Brand Logo */}
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg overflow-hidden flex items-center justify-center shadow-sm">
                        <img src="/brand-logo.png" alt="Logo" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-sm font-bold text-slate-800 tracking-tight">AIBASS</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 cursor-pointer">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-[10px] font-bold text-white shadow-sm border border-white">
                          AI
                        </div>
                        <span className="text-xs font-medium text-slate-600">Sales Invoicing</span>
                      </div>
                    </div>
                  </div>

                  {/* Main Panel Content */}
                  <div className="flex-1 flex flex-col bg-slate-50/50 p-4 overflow-hidden space-y-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">AI Invoicing Engine</span>
                    </div>

                    {/* Chat Bubble: User Voice/Text Prompt */}
                    <div className="self-end max-w-[85%] bg-indigo-600 text-white rounded-2xl rounded-tr-none px-4 py-2 shadow-md relative">
                      <p className="text-xs font-medium">Create sales invoice for TechCorp 10 Laptops @ ₹55,000 with 18% GST</p>
                      <div className="flex items-center justify-end gap-1 mt-1">
                        <span className="text-[9px] opacity-80 font-normal">Just now</span>
                        <Check className="h-3 w-3 opacity-90 inline-block" />
                      </div>
                    </div>

                    {/* Chat Bubble: AI Response */}
                    <div className="self-start max-w-[95%] space-y-2 w-full">
                      <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-none px-3.5 py-1.5 shadow-sm text-slate-700 w-fit">
                        <p className="text-xs font-medium">GST Tax Sales Invoice generated successfully!</p>
                      </div>

                      {/* Generated Invoice Card Visual */}
                      <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-sm space-y-2.5 w-full">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                          <div>
                            <span className="text-[10px] font-bold uppercase text-indigo-600">TAX SALES INVOICE</span>
                            <h4 className="text-xs font-extrabold text-slate-900">INV-2026-0482</h4>
                          </div>
                          <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
                            ✓ GST & Stock Synced
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-[10px]">
                          <div className="bg-slate-50 p-2 rounded-xl">
                            <span className="text-slate-400 block font-medium">Billed To</span>
                            <span className="font-extrabold text-slate-800">TechCorp India</span>
                          </div>
                          <div className="bg-slate-50 p-2 rounded-xl">
                            <span className="text-slate-400 block font-medium">Tax Calculation</span>
                            <span className="font-extrabold text-indigo-600">CGST (9%) + SGST (9%)</span>
                          </div>
                          <div className="bg-slate-50 p-2 rounded-xl">
                            <span className="text-slate-400 block font-medium">Stock Adjustment</span>
                            <span className="font-extrabold text-rose-600">-10 Units Laptops</span>
                          </div>
                        </div>

                        <div className="pt-1 flex items-center justify-between text-xs border-t border-slate-100 font-bold">
                          <span className="text-slate-600">Total Amount Payable:</span>
                          <span className="text-indigo-600 font-extrabold">₹6,49,000</span>
                        </div>
                      </div>
                    </div>

                    {/* Input Box */}
                    <div className="mt-auto bg-white border border-slate-200 rounded-2xl px-3.5 py-2 flex items-center justify-between shadow-sm">
                      <span className="text-xs text-slate-400 font-medium">Type or speak invoice prompt...</span>
                      <div className="flex items-center gap-2">
                        <Mic className="h-4 w-4 text-indigo-500 cursor-pointer" />
                        <Sparkles className="h-4 w-4 text-purple-500 cursor-pointer" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Badges */}
                <div className="absolute -right-2 md:-right-6 bottom-10 flex flex-col gap-3 z-20">
                  <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-2 bg-white border border-slate-150 rounded-2xl p-2.5 shadow-lg">
                    <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center text-purple-650">
                      <MessageSquare className="h-4 w-4" />
                    </div>
                    <div className="text-left pr-2">
                      <span className="text-xs font-bold text-slate-800 block">Text Command</span>
                    </div>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-2 bg-white border border-slate-150 rounded-2xl p-2.5 shadow-lg">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-650">
                      <Mic className="h-4 w-4" />
                    </div>
                    <div className="text-left pr-2">
                      <span className="text-xs font-bold text-slate-800 block">Voice Command</span>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

            </div>
          </div>
        </motion.section>

        {/* RECOGNITION & INFRASTRUCTURE BANNER */}
        <AiInvoicingRecognitionBanner />

        {/* PRODUCT HIGHLIGHTS SECTION - Scale In Stagger */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.95, y: 25 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          id="highlights" 
          className="py-6 md:py-8 scroll-mt-24"
        >
          <div className="max-w-6xl mx-auto bg-gradient-to-b from-[#F2F8FF] via-[#EBF4FE] to-[#F5F9FF] border border-[#D0E3F7] rounded-[32px] sm:rounded-[40px] p-6 sm:p-8 lg:p-10 shadow-[0_20px_50px_rgba(37,99,235,0.05)] space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Product Highlights
              </h3>
              <div className="w-12 h-1 bg-indigo-600 rounded-full mx-auto" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 pt-2">
              {[
                { text: "Text and voice invoice commands", icon: Mic, color: "bg-blue-50 text-blue-600 border-blue-100/90" },
                { text: "Automatic sales invoice creation", icon: FileText, color: "bg-emerald-50 text-emerald-600 border-emerald-100/90" },
                { text: "CGST and SGST calculation", icon: Calculator, color: "bg-purple-50 text-purple-600 border-purple-100/90" },
                { text: "IGST calculation", icon: Calculator, color: "bg-indigo-50 text-indigo-600 border-indigo-100/90" },
                { text: "Connected accounting records", icon: TrendingUp, color: "bg-amber-50 text-amber-600 border-amber-100/90" },
                { text: "Sales based inventory updates", icon: Package, color: "bg-rose-50 text-rose-600 border-rose-100/90" }
              ].map((highlight, index) => {
                const Icon = highlight.icon;
                return (
                  <motion.div 
                    key={index} 
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.07 }}
                    whileHover={{ y: -3, scale: 1.02 }}
                    className="group bg-white/95 backdrop-blur-sm border border-slate-200/90 rounded-2xl p-4 sm:p-4.5 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all flex items-center gap-3.5"
                  >
                    <div className={`p-2.5 rounded-xl border ${highlight.color} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}>
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-slate-950 transition-colors leading-snug">
                      {highlight.text}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.section>

        {/* SECTION 2: Turn a Simple Command into a Complete Sales Invoice - Split Entrance */}
        <motion.section 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.5 }}
          className="py-12 md:py-16 border-t border-slate-100 bg-transparent"
        >
          <div className="max-w-6xl mx-auto space-y-12">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              
              {/* Left Column: Slide from Left */}
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="lg:col-span-6 space-y-6"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider border border-indigo-100">
                  <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                  Effortless Invoice Generation
                </div>

                <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-[40px] leading-tight">
                  Turn a Simple Command into a Complete Sales Invoice
                </h2>

                <div className="space-y-4 text-sm font-medium leading-relaxed text-slate-700 sm:text-base">
                  <p>
                    Creating an invoice should not require navigating through several complicated software screens.
                  </p>
                  <p>
                    Tell AIBASS what you need through a text or voice command. The AI invoice generator processes the available customer and transaction information, calculates the applicable GST and prepares the sales invoice for your review.
                  </p>
                </div>

                {/* Example Command Callout Box */}
                <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white rounded-2xl p-5 shadow-lg border border-indigo-800 space-y-2">
                  <div className="flex items-center justify-between text-xs text-indigo-300 font-bold uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                      <Mic className="h-4 w-4 text-emerald-400 animate-pulse" /> Example Command
                    </span>
                    <span className="bg-indigo-500/20 text-indigo-200 px-2 py-0.5 rounded text-[10px]">Voice or Text</span>
                  </div>
                  <p className="text-base sm:text-lg font-bold text-white italic">
                    “Create an invoice for ten units of this product.”
                  </p>
                </div>

                <p className="text-sm font-medium leading-relaxed text-slate-700 sm:text-base">
                  Review the information and complete the invoice without repeating the same work across different systems.
                </p>

                <div className="pt-2">
                  <Button 
                    onClick={() => window.dispatchEvent(new CustomEvent("openTrialModal"))}
                    className="h-12 px-7 rounded-full bg-slate-950 hover:bg-slate-800 text-white font-bold text-sm sm:text-base shadow-md transition-all hover:-translate-y-0.5 flex items-center gap-2 group cursor-pointer"
                  >
                    Experience AI Invoice Creation
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </motion.div>

              {/* Right Column: Slide from Right */}
              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
                className="lg:col-span-6"
              >
                <div className="bg-white border border-slate-200/80 rounded-[32px] p-6 sm:p-8 shadow-[0_15px_40px_rgba(0,0,0,0.04)] space-y-6">
                  
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-slate-950 tracking-tight">
                      AIBASS prepares the invoice using the available:
                    </h3>
                    <div className="w-10 h-1 bg-indigo-600 rounded-full" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {[
                      { title: "Customer information" },
                      { title: "Product details" },
                      { title: "Quantity" },
                      { title: "Selling price" },
                      { title: "Applicable GST" },
                      { title: "Tax breakdown" },
                      { title: "Final invoice total" }
                    ].map((item, idx) => (
                      <div 
                        key={idx} 
                        className={`flex items-center gap-3 p-3.5 rounded-2xl border bg-slate-50/60 border-slate-150 hover:bg-slate-50 transition-colors ${
                          idx === 6 ? "sm:col-span-2 bg-indigo-50/40 border-indigo-100" : ""
                        }`}
                      >
                        <div className="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center text-indigo-600 font-bold border border-slate-200/60 flex-shrink-0">
                          <Check className="h-4 w-4 text-indigo-600" />
                        </div>
                        <span className="text-xs sm:text-sm font-bold text-slate-800">
                          {item.title}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100/80 flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-indigo-600 flex-shrink-0" />
                    <span className="text-xs font-semibold text-indigo-950">
                      Zero manual re-entry required across inventory, ledgers and GST filing.
                    </span>
                  </div>

                </div>
              </motion.div>

            </div>
          </div>
        </motion.section>

        {/* SECTION 3: Why Businesses Choose AIBASS AI Invoicing - Staggered Card Pop */}
        <motion.section 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.12 }}
          transition={{ duration: 0.5 }}
          className="py-12 md:py-16 border-t border-slate-100 bg-transparent"
        >
          <div className="max-w-7xl mx-auto space-y-12">
            
            {/* Header */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="space-y-4 text-center max-w-3xl mx-auto"
            >
              <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-widest">Key Business Benefits</span>
              <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Why Businesses Choose AIBASS AI Invoicing
              </h2>
              <div className="w-12 h-1 bg-indigo-600 rounded-full mx-auto" />
            </motion.div>

            {/* Benefits Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Create Invoices Through Commands",
                  desc: "Type the invoice request or speak the instruction instead of moving through several software menus. AIBASS uses the available customer, product, quantity and pricing information to prepare the supported sales invoice for review.",
                  icon: Mic,
                  color: "text-purple-600 bg-purple-50 border-purple-100"
                },
                {
                  title: "Calculate GST Automatically",
                  desc: "AIBASS calculates the applicable GST while creating supported sales invoices. It applies CGST and SGST for intrastate transactions and IGST for interstate transactions, helping businesses reduce manual tax calculations and prepare invoices more efficiently.",
                  icon: Calculator,
                  color: "text-emerald-600 bg-emerald-50 border-emerald-100"
                },
                {
                  title: "Connect Accounting Records",
                  desc: "Keep sales invoice information connected with relevant accounting records within AIBASS. The sales value, GST amount, customer transaction and invoice total remain organised, making monthly financial information easier to access and review.",
                  icon: TrendingUp,
                  color: "text-blue-600 bg-blue-50 border-blue-100"
                },
                {
                  title: "Update Inventory",
                  desc: "When physical products are included in a recorded sales invoice, AIBASS can reduce the relevant quantities from available inventory. This helps businesses avoid updating invoice and stock records separately and maintain a clearer view of current product availability.",
                  icon: Package,
                  color: "text-amber-600 bg-amber-50 border-amber-100"
                },
                {
                  title: "Review Every Invoice Before Completion",
                  desc: "Check customer details, products or services, quantities, prices, GST values, tax breakdowns and final invoice totals before completing the invoice. This gives users greater control over the information included in each sales transaction.",
                  icon: ShieldCheck,
                  color: "text-indigo-600 bg-indigo-50 border-indigo-100"
                },
                {
                  title: "Manage Invoicing from One Connected Platform",
                  desc: "Connect sales invoicing with AI bookkeeping, GST calculation, inventory management and financial reporting. Businesses can manage related financial and operational information without depending on several disconnected spreadsheets or software systems.",
                  icon: Layers,
                  color: "text-rose-600 bg-rose-50 border-rose-100"
                }
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 35, scale: 0.96 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: index * 0.08 }}
                    whileHover={{ y: -4, scale: 1.02 }}
                    className="bg-white border border-slate-200/80 rounded-[28px] p-6 shadow-[0_8px_30px_rgba(15,23,42,0.02)] hover:shadow-[0_15px_35px_rgba(99,102,241,0.06)] hover:border-indigo-200 transition-all flex flex-col text-left space-y-4"
                  >
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${item.color} shadow-sm`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-bold text-slate-900 leading-snug">{item.title}</h3>
                      <p className="text-sm text-slate-650 font-medium leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

          </div>
        </motion.section>

        {/* SECTION 4: What Is AI Invoicing Software? - Zoom Card Reveal */}
        <motion.section 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.12 }}
          transition={{ duration: 0.5 }}
          className="py-16 md:py-24 border-t border-slate-100 bg-transparent"
        >
          <div className="max-w-6xl mx-auto space-y-12">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              
              {/* Left Column: Slide In */}
              <motion.div 
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="lg:col-span-5 space-y-5"
              >
                <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-widest block">EXPLAINING AI INVOICING</span>
                <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl leading-tight">
                  What Is AI Invoicing Software?
                </h2>
                
                <div className="space-y-3.5 text-sm font-medium leading-relaxed text-slate-700 sm:text-base">
                  <p>
                    AI invoicing software uses intelligent automation to simplify the creation of customer sales invoices.
                  </p>
                  <p>
                    Traditional invoice software may require users to select multiple menus, enter transaction information manually and update accounting and inventory separately.
                  </p>
                </div>

                <div className="relative overflow-hidden rounded-2xl border-l-4 border-indigo-600 bg-gradient-to-r from-indigo-50/90 via-indigo-50/40 to-slate-50/60 p-4.5 sm:p-5 border-y border-r border-indigo-100/80 shadow-xs">
                  <p className="font-semibold text-slate-900 text-sm leading-relaxed">
                    AIBASS invoicing automation software provides a simpler experience. Users can give the platform a text or voice command, provide the required transaction details and allow the software to prepare the invoice.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50/70 to-blue-50/40 border border-indigo-100/80 shadow-xs space-y-2">
                  <div className="flex items-center gap-2 text-indigo-700 font-extrabold text-xs uppercase tracking-wider">
                    <Sparkles className="h-4 w-4 text-indigo-600" /> Smarter Finance
                  </div>
                  <p className="text-sm font-semibold text-slate-800 leading-relaxed">
                    This makes everyday invoicing easier for business owners who want a faster, error-free, and fully connected accounting process.
                  </p>
                </div>
              </motion.div>

              {/* Right Column: Scale/Zoom In */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
                className="lg:col-span-7 flex flex-col justify-center"
              >
                <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-b from-white via-indigo-50/20 to-slate-50/60 border border-indigo-100/80 p-6 sm:p-8 shadow-[0_20px_40px_-15px_rgba(79,70,229,0.09)] hover:shadow-[0_25px_50px_-12px_rgba(79,70,229,0.15)] transition-all duration-300 space-y-6">
                  {/* Glowing background accent */}
                  <div className="absolute -right-12 -top-12 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                  
                  {/* Card Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-indigo-100/80">
                    <h3 className="text-lg sm:text-xl font-bold text-slate-950 tracking-tight">
                      AIBASS helps businesses:
                    </h3>
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-100/80 px-3.5 py-1.5 rounded-full border border-indigo-200/60 shadow-xs">
                      Automated Features
                    </span>
                  </div>
                  
                  {/* Feature Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 relative z-10">
                    {[
                      { title: "Create customer sales invoices", icon: FileText },
                      { title: "Add products or services", icon: Package },
                      { title: "Enter quantities and prices", icon: Calculator },
                      { title: "Calculate the applicable GST", icon: Zap },
                      { title: "Display a clear tax breakdown", icon: Layers },
                      { title: "Connect invoice & accounting info", icon: RefreshCw },
                      { title: "Update relevant inventory quantities", icon: TrendingUp },
                      { title: "Review the completed invoice", icon: ShieldCheck }
                    ].map((item, idx) => {
                      const IconComponent = item.icon;
                      return (
                        <div 
                          key={idx} 
                          className="group flex items-center gap-3.5 p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.025)] hover:border-indigo-300 hover:shadow-md hover:bg-gradient-to-r hover:from-white hover:to-indigo-50/40 transition-all duration-200 hover:-translate-y-0.5"
                        >
                          <div className="w-8.5 h-8.5 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all duration-200 flex items-center justify-center flex-shrink-0 shadow-xs">
                            <IconComponent className="h-4 w-4" />
                          </div>
                          <span className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-indigo-950 transition-colors leading-snug">
                            {item.title}
                          </span>
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity ml-auto flex-shrink-0" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>

            </div>

          </div>
        </motion.section>

        {/* SECTION 5: Create Invoices Using Text or Voice Commands (Interactive Animated) */}
        <AiCommandInteractiveSection />

        {/* SECTION 6: Automatic Sales Invoice Creation - Vertical Lift */}
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="py-12 md:py-16 border-t border-slate-100 bg-transparent"
        >
          <div className="max-w-6xl mx-auto space-y-12">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              
              {/* Left Column */}
              <div className="lg:col-span-6 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider border border-emerald-100">
                  <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                  STRUCTURED AUTOMATION
                </div>

                <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-[40px] leading-tight">
                  Automatic Sales Invoice Creation
                </h2>

                <div className="space-y-4 text-sm font-medium leading-relaxed text-slate-700 sm:text-base">
                  <p>
                    AIBASS works as an automatic invoice generator that helps businesses prepare structured customer invoices with fewer manual steps.
                  </p>
                  <p>
                    Users can provide the required transaction information directly or start the process through a text or voice command.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="flex items-center gap-2 text-indigo-600 font-extrabold text-xs uppercase tracking-wider">
                    <Layers className="h-4 w-4" /> Connected Platform Sync
                  </div>
                  <p className="text-sm font-semibold text-slate-800 leading-relaxed">
                    The completed invoice information remains easier to access because the sales transaction is connected with the wider AIBASS accounting platform.
                  </p>
                </div>
              </div>

              {/* Right Column: Invoice Information Card */}
              <div className="lg:col-span-6">
                <div className="bg-white border border-slate-200/80 rounded-[32px] p-6 sm:p-8 shadow-[0_15px_40px_rgba(0,0,0,0.04)] space-y-6">
                  
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-slate-950 tracking-tight">
                      Invoice Information
                    </h3>
                    <div className="w-10 h-1 bg-indigo-600 rounded-full" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {[
                      "Customer details",
                      "Product or service details",
                      "Quantity",
                      "Unit price",
                      "Taxable value",
                      "Applicable GST",
                      "Tax breakdown",
                      "Total invoice value",
                      "Connected sales record"
                    ].map((item, idx) => (
                      <div 
                        key={idx} 
                        className={`flex items-center gap-3 p-3.5 rounded-2xl border bg-slate-50/60 border-slate-150 hover:bg-slate-50 transition-colors ${
                          idx === 8 ? "sm:col-span-2" : ""
                        }`}
                      >
                        <div className="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center text-emerald-600 font-bold border border-slate-200/60 flex-shrink-0">
                          <Check className="h-4 w-4 text-emerald-600" />
                        </div>
                        <span className="text-xs sm:text-sm font-bold text-slate-800">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100/80 flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                    <span className="text-xs font-semibold text-emerald-950">
                      Instantly compiled into ready-to-print and statutory GST compliant format.
                    </span>
                  </div>

                </div>
              </div>

            </div>

          </div>
        </motion.section>

        {/* SECTION 7: Automatic GST Calculation - Dual Slide from Left and Right */}
        <motion.section 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.12 }}
          transition={{ duration: 0.5 }}
          className="py-12 md:py-16 border-t border-slate-100 bg-transparent"
        >
          <div className="max-w-7xl mx-auto space-y-12">
            
            {/* Header */}
            <div className="space-y-4 text-center max-w-3xl mx-auto">
              <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-widest">STATUTORY TAX ENGINE</span>
              <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Automatic GST Calculation
              </h2>
              <p className="text-sm font-medium leading-relaxed text-slate-700 sm:text-base">
                AIBASS GST invoice software calculates the applicable tax while preparing supported sales invoices.
              </p>
              <div className="w-12 h-1 bg-indigo-600 rounded-full mx-auto" />
            </div>

            {/* Intrastate & Interstate 2-Column Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Intrastate GST Invoices - Slide Left */}
              <motion.div 
                initial={{ opacity: 0, x: -45 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="bg-white border border-slate-200/80 rounded-[32px] p-6 sm:p-8 shadow-[0_10px_35px_rgba(0,0,0,0.03)] space-y-6 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
                        <Calculator className="h-5 w-5" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-950">Intrastate GST Invoices</h3>
                    </div>
                    <span className="bg-purple-50 text-purple-700 text-xs font-bold px-3 py-1 rounded-full border border-purple-100">
                      Same State
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm font-medium text-slate-650">
                    For sales completed within the same state, AIBASS calculates:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {[
                      "Central Goods and Services Tax",
                      "State Goods and Services Tax",
                      "Applicable CGST value",
                      "Applicable SGST value",
                      "Total GST amount",
                      "Final invoice total"
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                        <Check className="h-4 w-4 text-purple-600 flex-shrink-0" />
                        <span className="text-xs font-bold text-slate-800">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 text-xs font-bold text-purple-600">
                  ✓ Automatically splits tax into CGST + SGST
                </div>
              </motion.div>

              {/* Interstate GST Invoices - Slide Right */}
              <motion.div 
                initial={{ opacity: 0, x: 45 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
                className="bg-white border border-slate-200/80 rounded-[32px] p-6 sm:p-8 shadow-[0_10px_35px_rgba(0,0,0,0.03)] space-y-6 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                        <Calculator className="h-5 w-5" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-950">Interstate GST Invoices</h3>
                    </div>
                    <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full border border-indigo-100">
                      Different States
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm font-medium text-slate-650">
                    For sales completed between different states, AIBASS calculates:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {[
                      "Integrated Goods and Services Tax",
                      "Applicable IGST value",
                      "Total GST amount",
                      "Final invoice total"
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                        <Check className="h-4 w-4 text-indigo-600 flex-shrink-0" />
                        <span className="text-xs font-bold text-slate-800">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 text-xs font-bold text-indigo-600">
                  ✓ Automatically applies integrated IGST rate
                </div>
              </motion.div>

            </div>

            {/* GST Invoicing Capabilities Card */}
            <div className="bg-white border border-slate-200/80 rounded-[32px] p-6 sm:p-8 shadow-[0_10px_35px_rgba(0,0,0,0.03)] space-y-6">
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-950 tracking-tight">
                  GST Invoicing Capabilities
                </h3>
                <div className="w-10 h-1 bg-indigo-600 rounded-full" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  "Intrastate GST calculation",
                  "Interstate GST calculation",
                  "CGST and SGST calculation",
                  "IGST calculation",
                  "Clear tax breakdown",
                  "Connected sales records",
                  "Sales based inventory updates"
                ].map((cap, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-150">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                    <span className="text-xs font-bold text-slate-800">{cap}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Disclaimer & Related Product Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-[28px] p-6 sm:p-8 space-y-6">
              <div className="space-y-3 text-xs sm:text-sm font-medium text-slate-700 leading-relaxed">
                <p className="font-semibold text-slate-900">
                  AIBASS supports GST calculation during sales invoice creation. Businesses should review the transaction and tax information before completing the invoice.
                </p>
                <p className="text-slate-600 bg-white p-4 rounded-xl border border-slate-200 text-xs">
                  <strong>Notice:</strong> Direct GST return filing, GSTR reconciliation and TDS management are not included unless those products are officially introduced.
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-4">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Related Product Reference</span>
                <Button
                  onClick={() => window.dispatchEvent(new CustomEvent("openTrialModal"))}
                  variant="outline"
                  className="rounded-full border-indigo-200 text-indigo-700 hover:bg-indigo-50 font-bold text-xs sm:text-sm px-6 h-10 flex items-center gap-2"
                >
                  Explore GST Accounting Software
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

          </div>
        </motion.section>

        {/* SECTION 8: Connect Invoices with Accounting Records - Blur & Rise */}
        <motion.section 
          initial={{ opacity: 0, y: 50, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="py-12 md:py-16 border-t border-slate-100 bg-transparent"
        >
          <div className="max-w-6xl mx-auto space-y-12">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              
              {/* Left Column */}
              <div className="lg:col-span-6 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider border border-blue-100">
                  <TrendingUp className="h-3.5 w-3.5 text-blue-600" />
                  FINANCIAL INTEGRATION
                </div>

                <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-[40px] leading-tight">
                  Connect Invoices with Accounting Records
                </h2>

                <div className="space-y-4 text-sm font-medium leading-relaxed text-slate-700 sm:text-base">
                  <p>
                    Every sales invoice affects the financial information of the business.
                  </p>
                  <p>
                    AIBASS connects supported invoice information with relevant accounting records so businesses do not need to maintain completely separate sales and financial information.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-indigo-50/50 border border-indigo-100/80 space-y-2">
                  <div className="flex items-center gap-2 text-indigo-700 font-extrabold text-xs uppercase tracking-wider">
                    <CheckCircle2 className="h-4 w-4" /> Streamlined Financial Management
                  </div>
                  <p className="text-sm font-semibold text-slate-800 leading-relaxed">
                    This makes invoice activity easier to review while accessing accounting information and monthly profit and loss statements.
                  </p>
                </div>

                <div className="pt-2">
                  <Button
                    onClick={() => window.dispatchEvent(new CustomEvent("openTrialModal"))}
                    variant="outline"
                    className="rounded-full border-blue-200 text-blue-700 hover:bg-blue-50 font-bold text-xs sm:text-sm px-6 h-11 flex items-center gap-2 shadow-sm cursor-pointer"
                  >
                    Explore AI Bookkeeping Software
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Right Column: Connected Information Card */}
              <div className="lg:col-span-6">
                <div className="bg-white border border-slate-200/80 rounded-[32px] p-6 sm:p-8 shadow-[0_15px_40px_rgba(0,0,0,0.04)] space-y-6">
                  
                  <div className="space-y-2">
                    <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-widest block">INTEGRATED RECONCILIATION</span>
                    <h3 className="text-xl font-bold text-slate-950 tracking-tight">
                      Connected Information
                    </h3>
                    <div className="w-10 h-1 bg-indigo-600 rounded-full" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {[
                      "Customer sales value",
                      "Applicable GST",
                      "Invoice total",
                      "Transaction details",
                      "Monthly sales information",
                      "Relevant accounting records",
                      "Monthly financial performance"
                    ].map((item, idx) => (
                      <div 
                        key={idx} 
                        className={`flex items-center gap-3 p-3.5 rounded-2xl border bg-slate-50/60 border-slate-150 hover:bg-slate-50 transition-colors ${
                          idx === 6 ? "sm:col-span-2 bg-blue-50/40 border-blue-100" : ""
                        }`}
                      >
                        <div className="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center text-blue-600 font-bold border border-slate-200/60 flex-shrink-0">
                          <Check className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="text-xs sm:text-sm font-bold text-slate-800">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100/80 flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0" />
                    <span className="text-xs font-semibold text-blue-950">
                      Real-time double-entry posting to General Ledgers & Financial Statements.
                    </span>
                  </div>

                </div>
              </div>

            </div>

          </div>
        </motion.section>

        {/* SECTION 9: Update Inventory After Product Sales - Scale Reveal */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.92, y: 25 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="py-12 md:py-16 border-t border-slate-100 bg-transparent"
        >
          <div className="max-w-6xl mx-auto space-y-12">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              
              {/* Left Column */}
              <div className="lg:col-span-6 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold uppercase tracking-wider border border-amber-100">
                  <Package className="h-3.5 w-3.5 text-amber-600" />
                  STOCK RECONCILIATION
                </div>

                <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-[40px] leading-tight">
                  Update Inventory After Product Sales
                </h2>

                <div className="space-y-4 text-sm font-medium leading-relaxed text-slate-700 sm:text-base">
                  <p>
                    When an invoice contains physical products, AIBASS can reduce the relevant quantities from available inventory.
                  </p>
                  <p>
                    This reduces the need to update the invoice and inventory separately.
                  </p>
                  <p className="font-semibold text-slate-900 bg-slate-50 p-4 rounded-2xl border border-slate-150">
                    Retailers, traders, distributors and manufacturing businesses can maintain a clearer view of available stock after recording sales.
                  </p>
                </div>

                <div className="pt-2">
                  <Button
                    onClick={() => window.dispatchEvent(new CustomEvent("openTrialModal"))}
                    variant="outline"
                    className="rounded-full border-amber-200 text-amber-800 hover:bg-amber-50 font-bold text-xs sm:text-sm px-6 h-11 flex items-center gap-2 shadow-sm cursor-pointer"
                  >
                    Explore Inventory Accounting Software
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Right Column: How It Works Card */}
              <div className="lg:col-span-6">
                <div className="bg-white border border-slate-200/80 rounded-[32px] p-6 sm:p-8 shadow-[0_15px_40px_rgba(0,0,0,0.04)] space-y-6">
                  
                  <div className="space-y-2">
                    <span className="text-xs font-extrabold text-amber-600 uppercase tracking-widest block">AUTOMATED STOCK FLOW</span>
                    <h3 className="text-xl font-bold text-slate-950 tracking-tight">
                      How It Works
                    </h3>
                    <div className="w-10 h-1 bg-amber-500 rounded-full" />
                  </div>

                  <div className="space-y-3 pt-2">
                    {[
                      "Products are added to the sales invoice",
                      "Sold quantities are recorded",
                      "Relevant stock quantities are reduced",
                      "Current inventory information is updated",
                      "Low stock products can be identified"
                    ].map((step, idx) => (
                      <div key={idx} className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-150">
                        <div className="w-7 h-7 rounded-xl bg-amber-500 text-white font-extrabold text-xs flex items-center justify-center flex-shrink-0">
                          0{idx + 1}
                        </div>
                        <span className="text-xs sm:text-sm font-bold text-slate-800">
                          {step}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100/80 flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-amber-600 flex-shrink-0" />
                    <span className="text-xs font-semibold text-amber-950">
                      Prevents stockouts and eliminates duplicate stock ledger entries.
                    </span>
                  </div>

                </div>
              </div>

            </div>

          </div>
        </motion.section>

        {/* SECTION 10: Solve Common Invoicing Problems - Staggered 3D Tilt Cards */}
        <motion.section 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.12 }}
          transition={{ duration: 0.5 }}
          className="py-12 md:py-16 border-t border-slate-100 bg-transparent"
        >
          <div className="max-w-7xl mx-auto space-y-12">
            
            {/* Header */}
            <div className="space-y-4 text-center max-w-3xl mx-auto">
              <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-widest">CHALLENGE & SOLUTION</span>
              <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Solve Common Invoicing Problems
              </h2>
              <div className="w-12 h-1 bg-indigo-600 rounded-full mx-auto" />
            </div>

            {/* Problem & Solution Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Repeated Data Entry",
                  problem: "Businesses may enter the same sales information separately into invoice, accounting and stock records.",
                  solution: "Supported invoice information connects with relevant accounting and inventory records.",
                  icon: RefreshCw,
                  color: "text-rose-500 bg-rose-50 border-rose-100"
                },
                {
                  title: "Manual GST Calculation",
                  problem: "Calculating tax separately for every invoice can take time and increase the possibility of incorrect entries.",
                  solution: "AIBASS calculates the applicable CGST and SGST or IGST during invoice creation.",
                  icon: Calculator,
                  color: "text-blue-500 bg-blue-50 border-blue-100"
                },
                {
                  title: "Complicated Navigation",
                  problem: "Traditional invoicing software may require users to navigate multiple screens before completing a sales invoice.",
                  solution: "Users can begin invoice creation using a simple text or voice command.",
                  icon: Mic,
                  color: "text-amber-500 bg-amber-50 border-amber-100"
                },
                {
                  title: "Incorrect Stock Information",
                  problem: "Available inventory can become inaccurate when sales invoices and stock records are updated separately.",
                  solution: "Recorded sales invoices can reduce the relevant product quantities.",
                  icon: Package,
                  color: "text-indigo-500 bg-indigo-50 border-indigo-100"
                },
                {
                  title: "Disconnected Financial Records",
                  problem: "Separate invoice records can make sales and financial performance more difficult to understand.",
                  solution: "AIBASS keeps supported invoice and accounting information connected within one platform.",
                  icon: Layers,
                  color: "text-purple-500 bg-purple-50 border-purple-100"
                }
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 35, rotateX: 8 }}
                    whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.09 }}
                    whileHover={{ y: -4 }}
                    className="bg-white border border-slate-200/80 rounded-[28px] p-6 shadow-[0_8px_30px_rgba(15,23,42,0.02)] flex flex-col space-y-4 text-left hover:shadow-[0_15px_35px_rgba(99,102,241,0.06)] hover:border-indigo-200 transition-all"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${item.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                    </div>
                    
                    <div className="space-y-3 text-xs sm:text-sm">
                      <div>
                        <span className="font-extrabold text-rose-500 block uppercase tracking-wider text-[11px]">The Problem</span>
                        <p className="text-slate-600 font-medium leading-relaxed mt-1">{item.problem}</p>
                      </div>
                      <div className="pt-2 border-t border-slate-100">
                        <span className="font-extrabold text-slate-950 block uppercase tracking-wider text-[11px]">The AIBASS Solution</span>
                        <p className="text-slate-900 font-semibold leading-relaxed mt-1">{item.solution}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

          </div>
        </motion.section>

        {/* SECTION 11: How AIBASS Invoicing Works - Diagonal Sequential Steps */}
        <motion.section 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.12 }}
          transition={{ duration: 0.5 }}
          className="py-12 md:py-16 border-t border-slate-100 bg-transparent"
        >
          <div className="max-w-7xl mx-auto space-y-12">
            
            {/* Header */}
            <div className="space-y-4 text-center max-w-3xl mx-auto">
              <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-widest">STEP-BY-STEP PROCESS</span>
              <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                How AIBASS Invoicing Works
              </h2>
              <div className="w-12 h-1 bg-indigo-600 rounded-full mx-auto" />
            </div>

            {/* 7 Steps Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  stepNum: "01",
                  title: "1. Select the Customer",
                  desc: "Choose an available customer or enter the required customer information.",
                  icon: Building2,
                  color: "text-blue-600 bg-blue-50 border-blue-100"
                },
                {
                  stepNum: "02",
                  title: "2. Add the Sale",
                  desc: "Provide the product, service, quantity, price and other relevant transaction details.",
                  icon: FileText,
                  color: "text-emerald-600 bg-emerald-50 border-emerald-100"
                },
                {
                  stepNum: "03",
                  title: "3. Give AIBASS a Command",
                  desc: "Enter a text command or speak the invoice instruction.",
                  icon: Mic,
                  color: "text-purple-600 bg-purple-50 border-purple-100"
                },
                {
                  stepNum: "04",
                  title: "4. Calculate GST",
                  desc: "AIBASS calculates CGST and SGST for supported intrastate sales or IGST for supported interstate sales.",
                  icon: Calculator,
                  color: "text-indigo-600 bg-indigo-50 border-indigo-100"
                },
                {
                  stepNum: "05",
                  title: "5. Review the Invoice",
                  desc: "Check the customer information, sales details, tax values and final invoice total.",
                  icon: ShieldCheck,
                  color: "text-amber-600 bg-amber-50 border-amber-100"
                },
                {
                  stepNum: "06",
                  title: "6. Complete the Invoice",
                  desc: "Confirm the information and complete the supported sales invoice.",
                  icon: CheckCircle2,
                  color: "text-teal-600 bg-teal-50 border-teal-100"
                },
                {
                  stepNum: "07",
                  title: "7. Update Connected Records",
                  desc: "The recorded invoice connects with relevant accounting and inventory information.",
                  icon: Layers,
                  color: "text-rose-600 bg-rose-50 border-rose-100"
                }
              ].map((step, idx) => {
                const Icon = step.icon;
                return (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: -25, y: 25 }}
                    whileInView={{ opacity: 1, x: 0, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: idx * 0.08 }}
                    whileHover={{ scale: 1.02 }}
                    className={`bg-white border border-slate-200/80 rounded-[28px] p-6 shadow-[0_8px_30px_rgba(15,23,42,0.02)] hover:border-indigo-200 transition-all flex flex-col justify-between space-y-4 ${
                      idx === 6 ? "md:col-span-2 md:w-3/4 md:mx-auto lg:w-full lg:col-span-1 lg:col-start-2" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${step.color} shadow-sm`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-xl font-black text-indigo-600/30">{step.stepNum}</span>
                    </div>

                    <div className="space-y-1.5">
                      <h3 className="text-base font-bold text-slate-950">{step.title}</h3>
                      <p className="text-xs sm:text-sm font-medium text-slate-650 leading-relaxed">{step.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* CTA Button */}
            <div className="pt-4 text-center">
              <Button 
                onClick={() => window.dispatchEvent(new CustomEvent("openTrialModal"))}
                className="h-12 px-8 rounded-full bg-slate-950 hover:bg-slate-800 text-white font-bold text-sm sm:text-base shadow-lg transition-all hover:-translate-y-0.5 inline-flex items-center gap-2 group"
              >
                See the Invoicing Workflow
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>

          </div>
        </motion.section>

        {/* SECTION 12: Invoicing That Connects with Other AIBASS Products - Staggered Card Lift */}
        <motion.section 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.12 }}
          transition={{ duration: 0.5 }}
          className="py-12 md:py-16 border-t border-slate-100 bg-transparent"
        >
          <div className="max-w-7xl mx-auto space-y-12">
            
            {/* Header */}
            <div className="space-y-4 text-center max-w-3xl mx-auto">
              <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-widest">CONNECTED PLATFORM</span>
              <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Invoicing That Connects with Other AIBASS Products
              </h2>
              <p className="text-sm font-medium leading-relaxed text-slate-700 sm:text-base">
                AIBASS AI Invoicing is part of a connected business accounting platform.
              </p>
              <div className="w-12 h-1 bg-indigo-600 rounded-full mx-auto" />
            </div>

            {/* 4 Connected Product Cards (2x2 Grid) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: "AI Bookkeeping",
                  desc: "Connect sales invoices with relevant accounting and bookkeeping information.",
                  linkText: "Explore AI Bookkeeping Software",
                  path: "/bookkeeping",
                  icon: TrendingUp,
                  color: "text-blue-600 bg-blue-50 border-blue-100"
                },
                {
                  title: "GST Accounting",
                  desc: "Calculate applicable CGST, SGST and IGST during supported invoice creation.",
                  linkText: "Explore GST Accounting Software",
                  path: "/tax-gst",
                  icon: Calculator,
                  color: "text-purple-600 bg-purple-50 border-purple-100"
                },
                {
                  title: "Inventory Management",
                  desc: "Reduce stock quantities based on products recorded in completed sales invoices.",
                  linkText: "Explore Inventory Accounting Software",
                  path: "/inventory",
                  icon: Package,
                  color: "text-amber-600 bg-amber-50 border-amber-100"
                },
                {
                  title: "Financial Reporting",
                  desc: "Use recorded accounting information to review monthly profit and loss, balance sheet information and category wise financial views.",
                  linkText: "Explore Financial Reporting Software",
                  path: "/profit-loss",
                  icon: Layers,
                  color: "text-emerald-600 bg-emerald-50 border-emerald-100"
                }
              ].map((product, idx) => {
                const Icon = product.icon;
                return (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 40, scale: 0.96 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    onClick={() => window.dispatchEvent(new CustomEvent("openTrialModal"))}
                    className="bg-white border border-slate-200/80 rounded-[32px] p-8 sm:p-9 shadow-[0_10px_35px_rgba(15,23,42,0.03)] hover:shadow-[0_20px_45px_rgba(15,23,42,0.08)] hover:border-indigo-300 transition-all duration-300 relative group flex flex-col justify-between space-y-6 overflow-hidden text-left cursor-pointer"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${product.color} shadow-sm transition-transform duration-300 group-hover:scale-105 flex-shrink-0`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight">
                            {product.title}
                          </h3>
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">CONNECTED MODULE</span>
                        </div>
                      </div>

                      <p className="text-sm font-medium text-slate-660 leading-relaxed sm:min-h-[48px]">
                        {product.desc}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-150/60">
                      <Button
                        onClick={() => window.dispatchEvent(new CustomEvent("openTrialModal"))}
                        className="w-full sm:w-auto rounded-full bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm px-6 h-11 flex items-center justify-between gap-3 shadow-sm hover:shadow-md transition-all duration-200 group/btn cursor-pointer"
                      >
                        <span>{product.linkText}</span>
                        <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1.5" />
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </div>

          </div>
        </motion.section>

        {/* SECTION 13: Benefits of AIBASS AI Invoicing Software - Diagonal Slide Entrance */}
        <motion.section 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.12 }}
          transition={{ duration: 0.5 }}
          className="py-12 md:py-16 border-t border-slate-100 bg-transparent"
        >
          <div className="max-w-7xl mx-auto space-y-12">
            
            {/* Header */}
            <div className="space-y-4 text-center max-w-3xl mx-auto">
              <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-widest">KEY ADVANTAGES</span>
              <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Benefits of AIBASS AI Invoicing Software
              </h2>
              <div className="w-12 h-1 bg-indigo-600 rounded-full mx-auto" />
            </div>

            {/* 7 Benefits Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Faster Invoice Creation",
                  desc: "Prepare customer sales invoices without completing every step through separate systems.",
                  icon: Zap,
                  color: "text-amber-600 bg-amber-50 border-amber-100"
                },
                {
                  title: "Less Repeated Work",
                  desc: "Keep supported invoice, accounting and inventory information connected.",
                  icon: RefreshCw,
                  color: "text-blue-600 bg-blue-50 border-blue-100"
                },
                {
                  title: "Easier GST Calculation",
                  desc: "Calculate the applicable tax while preparing the sales invoice.",
                  icon: Calculator,
                  color: "text-purple-600 bg-purple-50 border-purple-100"
                },
                {
                  title: "Clear Invoice Information",
                  desc: "Review customer details, transaction values, taxes and invoice totals in one place.",
                  icon: FileText,
                  color: "text-emerald-600 bg-emerald-50 border-emerald-100"
                },
                {
                  title: "Updated Stock Records",
                  desc: "Reduce relevant product quantities after recording a sales invoice.",
                  icon: Package,
                  color: "text-rose-600 bg-rose-50 border-rose-100"
                },
                {
                  title: "Simple Product Experience",
                  desc: "Use text or voice commands instead of navigating several complicated software screens.",
                  icon: Mic,
                  color: "text-indigo-600 bg-indigo-50 border-indigo-100"
                },
                {
                  title: "Better Financial Visibility",
                  desc: "Keep sales invoice information connected with relevant accounting and monthly financial records.",
                  icon: TrendingUp,
                  color: "text-teal-600 bg-teal-50 border-teal-100"
                }
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: -30, y: 30 }}
                    whileInView={{ opacity: 1, x: 0, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: idx * 0.07 }}
                    whileHover={{ y: -4 }}
                    className={`bg-white border border-slate-200/80 rounded-[28px] p-6 shadow-[0_8px_30px_rgba(15,23,42,0.02)] hover:shadow-[0_15px_35px_rgba(99,102,241,0.05)] hover:border-indigo-200 transition-all flex flex-col space-y-4 text-left ${
                      idx === 6 ? "md:col-span-2 md:w-3/4 md:mx-auto lg:w-full lg:col-span-1 lg:col-start-2" : ""
                    }`}
                  >
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${item.color} shadow-sm`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="text-lg font-bold text-slate-900 leading-snug">{item.title}</h3>
                      <p className="text-sm text-slate-650 font-medium leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

          </div>
        </motion.section>

        {/* SECTION 14: AI Invoicing Software for Different Businesses - Scale Pop */}
        <motion.section 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.12 }}
          transition={{ duration: 0.5 }}
          className="py-12 md:py-16 border-t border-slate-100 bg-transparent"
        >
          <div className="max-w-7xl mx-auto space-y-12">
            
            {/* Header */}
            <div className="space-y-4 text-center max-w-3xl mx-auto">
              <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-widest">TAILORED INDUSTRY SOLUTIONS</span>
              <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                AI Invoicing Software for Different Businesses
              </h2>
              <div className="w-12 h-1 bg-indigo-600 rounded-full mx-auto" />
            </div>

            {/* 6 Industry Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Small Businesses",
                  desc: "Create GST sales invoices and organise customer transactions without depending on disconnected spreadsheets.",
                  icon: Building2,
                  color: "text-blue-600 bg-blue-50 border-blue-100"
                },
                {
                  title: "Startups",
                  desc: "Manage growing sales activity while maintaining connected invoicing and accounting information.",
                  icon: Zap,
                  color: "text-purple-600 bg-purple-50 border-purple-100"
                },
                {
                  title: "Retailers and Traders",
                  desc: "Create product sales invoices, calculate GST and update relevant inventory quantities.",
                  icon: Package,
                  color: "text-emerald-600 bg-emerald-50 border-emerald-100"
                },
                {
                  title: "Service Businesses",
                  desc: "Prepare customer invoices for completed services and maintain organised sales records.",
                  icon: FileText,
                  color: "text-amber-600 bg-amber-50 border-amber-100"
                },
                {
                  title: "Small and Medium Enterprises",
                  desc: "Manage increasing invoice activity through one connected invoicing, accounting and inventory platform.",
                  icon: TrendingUp,
                  color: "text-indigo-600 bg-indigo-50 border-indigo-100"
                },
                {
                  title: "Manufacturing Businesses",
                  desc: "Create invoices for product sales and connect them with GST, inventory and financial information.",
                  icon: Layers,
                  color: "text-rose-600 bg-rose-50 border-rose-100"
                }
              ].map((biz, idx) => {
                const Icon = biz.icon;
                return (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: idx * 0.08 }}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white border border-slate-200/80 rounded-[28px] p-6 shadow-[0_8px_30px_rgba(15,23,42,0.02)] hover:shadow-[0_15px_35px_rgba(99,102,241,0.05)] hover:border-indigo-200 transition-all flex flex-col space-y-4 text-left group"
                  >
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${biz.color} shadow-sm transition-transform group-hover:scale-105`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">{biz.title}</h3>
                      <p className="text-sm text-slate-650 font-medium leading-relaxed">{biz.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

          </div>
        </motion.section>

        {/* SECTION 15: Manual Invoicing Versus AIBASS - Comparison Table Rise */}
        <motion.section 
          initial={{ opacity: 0, y: 45 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.75, ease: "easeOut" }}
          className="py-12 md:py-16 border-t border-slate-100 bg-transparent"
        >
          <div className="max-w-6xl mx-auto space-y-12">
            
            {/* Header */}
            <div className="space-y-4 text-center max-w-3xl mx-auto">
              <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-widest">SIDE-BY-SIDE COMPARISON</span>
              <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Manual Invoicing Versus AIBASS
              </h2>
              <div className="w-12 h-1 bg-indigo-600 rounded-full mx-auto" />
            </div>

            {/* Comparison Matrix Table */}
            <div className="overflow-hidden rounded-[32px] border border-slate-200/70 shadow-[0_10px_35px_rgba(15,23,42,0.03)] bg-white">
              
              {/* Header Bar - Light Gray Header matching Image 2 */}
              <div className="grid grid-cols-12 bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-extrabold text-xs uppercase tracking-wider p-4 sm:p-5">
                <div className="col-span-4 sm:col-span-3">INVOICING ASPECT</div>
                <div className="col-span-4 sm:col-span-4 text-slate-500">MANUAL INVOICING</div>
                <div className="col-span-4 sm:col-span-5 text-slate-900 font-black">AIBASS</div>
              </div>

              {/* Rows */}
              <div className="divide-y divide-slate-100 text-xs sm:text-sm">
                {[
                  {
                    aspect: "Invoice Creation",
                    manual: "Users complete several steps to prepare every invoice.",
                    aibass: "Users can begin supported invoice creation using a text or voice command."
                  },
                  {
                    aspect: "GST Calculation",
                    manual: "GST may need to be calculated and entered separately.",
                    aibass: "Applicable GST is calculated during invoice creation."
                  },
                  {
                    aspect: "Accounting Records",
                    manual: "Sales information may need to be entered again into accounting records.",
                    aibass: "Supported invoice information remains connected with relevant accounting records."
                  },
                  {
                    aspect: "Inventory Updates",
                    manual: "Sold quantities may need to be reduced from stock separately.",
                    aibass: "Relevant inventory quantities can be updated through recorded sales invoices."
                  },
                  {
                    aspect: "Software Experience",
                    manual: "Users may navigate through several software screens.",
                    aibass: "Users can communicate through simple text or voice commands."
                  }
                ].map((row, idx) => (
                  <div 
                    key={idx} 
                    className="grid grid-cols-12 p-4 sm:p-5 items-center transition-colors bg-white hover:bg-slate-50/40"
                  >
                    <div className="col-span-4 sm:col-span-3 font-bold text-slate-900 pr-2">
                      {row.aspect}
                    </div>
                    <div className="col-span-4 sm:col-span-4 text-slate-600 font-medium pr-3 leading-relaxed">
                      {row.manual}
                    </div>
                    <div className="col-span-4 sm:col-span-5 font-bold text-indigo-950 leading-relaxed">
                      {row.aibass}
                    </div>
                  </div>
                ))}
              </div>

            </div>

          </div>
        </motion.section>

        {/* SECTION 16: Start Creating GST Sales Invoices with AIBASS (Bottom CTA Banner) - Zoom Glow Reveal */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.92, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="py-6 md:py-8 border-t border-slate-100 bg-transparent"
        >
          <div className="max-w-[1380px] mx-auto px-4 sm:px-8 lg:px-12">
            <div className="relative overflow-hidden rounded-[32px] border border-slate-250 bg-white px-8 py-12 text-center shadow-[0_12px_45px_rgba(15,23,42,0.04)] md:py-16">
              
              {/* Subtle background glow graphics */}
              <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-sky-200/30 blur-3xl" />
              <div className="pointer-events-none absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-indigo-200/30 blur-3xl" />
              
              <div className="max-w-3xl mx-auto space-y-6 relative z-10">
                <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full text-indigo-650">
                  <Sparkles className="h-4.5 w-4.5 text-indigo-600" />
                  <span className="text-[10px] font-bold tracking-widest uppercase">Start Today</span>
                </div>
                
                <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl md:text-5xl leading-tight">
                  Start Creating GST Sales Invoices with AIBASS
                </h2>

                <div className="space-y-4 text-sm md:text-base font-semibold text-slate-655 leading-relaxed max-w-2xl mx-auto">
                  <p>
                    Create customer sales invoices, calculate applicable GST and keep accounting and inventory information connected through one AI invoicing product.
                  </p>
                  <p>
                    Enter a text command or speak an instruction to begin creating your invoice.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                  <Button
                    onClick={() => window.dispatchEvent(new CustomEvent("openTrialModal"))}
                    className="w-full sm:w-auto bg-slate-950 hover:bg-slate-850 text-white font-bold h-12 px-8 rounded-full text-xs shadow-md transition-all hover:-translate-y-0.5 flex items-center justify-center cursor-pointer"
                  >
                    Start 30 Day Free Trial
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  
                  <Button
                    onClick={() => window.dispatchEvent(new CustomEvent("openTrialModal"))}
                    className="w-full sm:w-auto border border-slate-300 bg-white/50 hover:bg-slate-100/50 text-slate-750 font-bold h-12 px-8 rounded-full text-xs transition-all hover:-translate-y-0.5 cursor-pointer"
                  >
                    Book a Free Demo
                  </Button>
                </div>
              </div>

            </div>
          </div>
        </motion.section>

        {/* SECTION 17: Frequently Asked Questions (FINAL SECTION) - Smooth Upward Fade */}
        <motion.section 
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="py-12 md:py-16 border-t border-slate-100 bg-transparent"
        >
          <div className="max-w-4xl mx-auto space-y-12">
            
            {/* Header */}
            <div className="space-y-4 text-center max-w-3xl mx-auto">
              <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-widest">GOT QUESTIONS?</span>
              <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Frequently Asked Questions
              </h2>
              <div className="w-12 h-1 bg-indigo-600 rounded-full mx-auto" />
            </div>

            {/* Accordion List with 15 FAQs */}
            <Accordion type="single" collapsible className="w-full space-y-3">
              {[
                {
                  q: "What is AI invoicing software?",
                  a: "AI invoicing software uses intelligent automation to simplify customer sales invoice creation. Users provide the required transaction information, and the software prepares the invoice for review."
                },
                {
                  q: "How does AIBASS AI Invoicing work?",
                  a: "Users can enter a text command or speak an instruction. AIBASS processes the available customer and transaction information, calculates the applicable GST and prepares the supported invoice."
                },
                {
                  q: "Can AIBASS create sales invoices?",
                  a: "Yes. AIBASS creates supported sales invoices using the customer, product or service, quantity, pricing and transaction information provided."
                },
                {
                  q: "Can I create an invoice using a text command?",
                  a: "Yes. Users can enter a supported text command to begin creating a customer sales invoice."
                },
                {
                  q: "Can I create an invoice using a voice command?",
                  a: "Yes. Users can speak a supported invoice instruction instead of typing it."
                },
                {
                  q: "Does AIBASS calculate GST automatically?",
                  a: "Yes. AIBASS calculates the applicable GST during supported sales invoice creation."
                },
                {
                  q: "Does AIBASS calculate CGST and SGST?",
                  a: "Yes. AIBASS calculates CGST and SGST for supported intrastate sales transactions."
                },
                {
                  q: "Does AIBASS calculate IGST?",
                  a: "Yes. AIBASS calculates IGST for supported interstate sales transactions."
                },
                {
                  q: "Does creating an invoice update inventory?",
                  a: "Supported sales invoices can reduce the relevant inventory quantities based on the products and quantities recorded."
                },
                {
                  q: "Does AIBASS connect invoices with accounting?",
                  a: "Yes. Supported sales invoice information connects with relevant accounting records within AIBASS."
                },
                {
                  q: "Is AIBASS suitable for small businesses?",
                  a: "Yes. AIBASS helps small businesses create sales invoices, calculate GST and organise connected sales information."
                },
                {
                  q: "Can retailers use AIBASS AI Invoicing?",
                  a: "Yes. Retailers can create customer sales invoices, calculate GST and update relevant product quantities after recording sales."
                },
                {
                  q: "Can service businesses use AIBASS?",
                  a: "Yes. Service businesses can create invoices for completed services and maintain connected sales and accounting information."
                },
                {
                  q: "Does AIBASS file GST returns?",
                  a: "No. AIBASS currently supports GST calculation during supported sales invoice creation. Direct GST return filing should not be claimed unless that product is officially introduced."
                },
                {
                  q: "Can I try the product before purchasing?",
                  a: "Yes. Businesses can explore the available AI invoicing and accounting capabilities through the 30 day free trial."
                }
              ].map((faq, idx) => (
                <AccordionItem 
                  key={idx} 
                  value={`item-${idx}`}
                  className="bg-white border border-slate-200/80 rounded-2xl px-6 py-1 shadow-xs data-[state=open]:border-indigo-300 data-[state=open]:shadow-sm transition-all"
                >
                  <AccordionTrigger className="text-left font-bold text-slate-900 text-sm sm:text-base hover:no-underline py-4">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-650 font-medium text-xs sm:text-sm leading-relaxed pb-4">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

          </div>
        </motion.section>

      </main>

      <Footer />

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-slate-950 border border-slate-800 text-white shadow-xl hover:bg-slate-850 transition-all"
            aria-label="Scroll to top"
          >
            <ArrowUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>

    </div>
  );
};

export default AiInvoicingSoftware;
