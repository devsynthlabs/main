import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Play, 
  Mic, 
  Sparkles, 
  CheckCircle2, 
  ChevronRight 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

export const AiAccountingCommands = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [typedVoice, setTypedVoice] = useState("");
  const [showOutput, setShowOutput] = useState(false);

  const textCommands = [
    {
      cmd: "Create a sales invoice for this customer",
      actionTitle: "Generates the invoice and calculates the applicable GST.",
      details: [
        { label: "Invoice Draft", value: "Acme Corp", isHighlight: true },
        { label: "CGST + SGST:", value: "18% (CGST 9% + SGST 9%)" },
        { label: "Total Due:", value: "₹47,200", isBold: true, isTotal: true }
      ]
    },
    {
      cmd: "Show my profit and loss for this month",
      actionTitle: "Displays monthly income, expenses and profit status.",
      details: [
        { label: "Statement", value: "Profit & Loss (July)", isHighlight: true },
        { label: "Total Revenue:", value: "₹8,50,000" },
        { label: "Total Expenses:", value: "₹5,20,000" },
        { label: "Net Profit:", value: "₹3,30,000", isBold: true, isTotal: true }
      ]
    },
    {
      cmd: "Which products are running low?",
      actionTitle: "Displays current stock information and identifies low stock products.",
      details: [
        { label: "Inventory Alert", value: "Low Stock Items", isHighlight: true },
        { label: "Cement (OPC):", value: "12 Bags Left" },
        { label: "Steel Rods (12mm):", value: "8 Bundles Left" },
        { label: "Status:", value: "Reorder Recommended", isBold: true, isTotal: true }
      ]
    }
  ];

  const voiceCommands = [
    {
      cmd: "Generate my balance sheet",
      actionTitle: "Shows the balance sheet instantly.",
      details: [
        { label: "Balance Sheet", value: "Live Summary", isHighlight: true },
        { label: "Total Assets:", value: "₹12,400,000" },
        { label: "Total Liabilities:", value: "₹4,10,000" },
        { label: "Owner Equity:", value: "₹8,30,000", isBold: true, isTotal: true }
      ]
    },
    {
      cmd: "Show my future cash position",
      actionTitle: "Displays cash flow predictions based on the available financial data.",
      details: [
        { label: "Cash Flow", value: "30-Day Forecast", isHighlight: true },
        { label: "Projected Inflow:", value: "₹15,60,000" },
        { label: "Projected Outflow:", value: "₹9,80,000" },
        { label: "Net Cash Position:", value: "₹5,80,000", isBold: true, isTotal: true }
      ]
    },
    {
      cmd: "Display category wise expenses",
      actionTitle: "Presents the expense information organised by category.",
      details: [
        { label: "Expenses", value: "Category Breakdown", isHighlight: true },
        { label: "Raw Materials:", value: "₹3,40,000" },
        { label: "Logistics & Transport:", value: "₹1,10,000" },
        { label: "Salaries & Wages:", value: "₹70,000", isBold: true, isTotal: true }
      ]
    }
  ];

  useEffect(() => {
    let typeTimeout: NodeJS.Timeout;
    let transitionTimeout: NodeJS.Timeout;

    const textToType = textCommands[activeIndex].cmd;
    const voiceToType = voiceCommands[activeIndex].cmd;

    setTypedText("");
    setTypedVoice("");
    setShowOutput(false);

    let charIdx = 0;
    const typeSpeed = 35; // speed of typing (ms per char)

    const type = () => {
      const maxLen = Math.max(textToType.length, voiceToType.length);
      if (charIdx < maxLen) {
        charIdx++;
        if (charIdx <= textToType.length) {
          setTypedText(textToType.substring(0, charIdx));
        }
        if (charIdx <= voiceToType.length) {
          setTypedVoice(voiceToType.substring(0, charIdx));
        }
        typeTimeout = setTimeout(type, typeSpeed);
      } else {
        setShowOutput(true);
        transitionTimeout = setTimeout(() => {
          setActiveIndex((prev) => (prev + 1) % 3);
        }, 3200); // hold showing results for 3.2 seconds
      }
    };

    const startTimeout = setTimeout(type, 200);

    return () => {
      clearTimeout(startTimeout);
      clearTimeout(typeTimeout);
      clearTimeout(transitionTimeout);
    };
  }, [activeIndex]);

  return (
    <section id="ai-commands" className="py-6 md:py-8 border-t border-slate-100 bg-transparent scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">

        {/* Header */}
        <div className="space-y-4 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Manage Accounting Through Voice or Text Commands
          </h2>
          <p className="text-sm font-medium leading-relaxed text-slate-700 sm:text-base">
            AIBASS makes accounting information easier to access by allowing users to communicate with the platform naturally.
            Enter or speak the accounting activity you need. The AI accounting assistant processes the instruction and either completes the supported action or displays the requested business information.
          </p>
          <div className="w-12 h-1 bg-indigo-600 rounded-full mx-auto" />
        </div>

        {/* Side-by-Side Command Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

          {/* Column 1: Type Your Command */}
          <motion.div 
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45, delay: 0 }}
            whileHover={{ y: -6, scale: 1.012 }}
            className="group relative bg-white border border-slate-150 rounded-[32px] p-6 md:p-8 flex flex-col justify-between space-y-6 shadow-[0_15px_40px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_45px_rgba(79,70,229,0.08)] hover:border-indigo-200 transition-all duration-300 overflow-hidden cursor-pointer"
          >
            {/* Corner accent glow on hover */}
            <div className="absolute -top-12 -right-12 w-28 h-28 bg-indigo-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />

            <div className="space-y-5 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-mono font-bold text-sm group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-sm">
                  &gt;_
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 leading-tight group-hover:text-indigo-650 transition-colors">Type Your Command</h3>
                  <p className="text-xs text-slate-400 font-medium">Command via text input</p>
                </div>
              </div>

              <p className="text-sm font-medium leading-relaxed text-slate-650">
                Enter a simple text instruction and let AIBASS complete the task or display the information you need.
              </p>

              {/* Mock Container Area */}
              <div className="bg-slate-50/50 border border-slate-150 rounded-2xl p-4 md:p-5 min-h-[380px] flex flex-col justify-between">
                <div className="space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-4">
                    {/* Input Command Line */}
                    <div className="bg-white border border-slate-150 rounded-xl p-3.5 flex items-center gap-2.5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] min-h-[52px]">
                      <ChevronRight className="h-4 w-4 text-blue-600 shrink-0" />
                      <span className="text-sm font-medium text-slate-800">
                        {typedText}
                        {typedText.length < textCommands[activeIndex].cmd.length && (
                          <span className="animate-pulse text-blue-600 font-bold">|</span>
                        )}
                      </span>
                    </div>

                    {/* Output Panel */}
                    <AnimatePresence mode="wait">
                      {showOutput && (
                        <motion.div
                          initial={{ opacity: 0, y: 15, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.98 }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                          className="bg-white border border-slate-150 rounded-xl p-4 md:p-5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-3"
                        >
                          <div className="flex items-center gap-1.5 text-[10px] font-extrabold tracking-wider text-emerald-650 uppercase">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                            <span>AIBASS Output Action</span>
                          </div>
                          <h4 className="text-xs md:text-sm font-bold text-slate-800">
                            {textCommands[activeIndex].actionTitle}
                          </h4>
                          
                          {/* Miniature Details Table */}
                          <div className="border border-slate-100 bg-slate-50/30 rounded-xl p-3 text-xs space-y-2 font-medium">
                            {textCommands[activeIndex].details.map((detail, idx) => (
                              <React.Fragment key={idx}>
                                {detail.isTotal && <div className="border-t border-slate-200/60 my-1" />}
                                <div className="flex justify-between items-center">
                                  <span className={detail.isTotal ? "text-slate-900 font-bold" : "text-slate-400"}>
                                    {detail.label}
                                  </span>
                                  <span className={
                                    detail.isHighlight 
                                      ? "text-blue-600 font-bold" 
                                      : detail.isTotal 
                                        ? "text-slate-950 font-black text-sm" 
                                        : "text-slate-700"
                                  }>
                                    {detail.value}
                                  </span>
                                </div>
                              </React.Fragment>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Column 2: Speak Your Command */}
          <motion.div 
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45, delay: 0.12 }}
            whileHover={{ y: -6, scale: 1.012 }}
            className="group relative bg-white border border-slate-150 rounded-[32px] p-6 md:p-8 flex flex-col justify-between space-y-6 shadow-[0_15px_40px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_45px_rgba(79,70,229,0.08)] hover:border-indigo-200 transition-all duration-300 overflow-hidden cursor-pointer"
          >
            {/* Corner accent glow on hover */}
            <div className="absolute -top-12 -right-12 w-28 h-28 bg-indigo-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />

            <div className="space-y-5 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-sm">
                  <Mic className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 leading-tight group-hover:text-indigo-650 transition-colors">Speak Your Command</h3>
                  <p className="text-xs text-slate-400 font-medium">Command via voice input</p>
                </div>
              </div>

              <p className="text-sm font-medium leading-relaxed text-slate-655">
                Talk to AIBASS naturally and get the required accounting action or financial information without searching through multiple screens.
              </p>

              {/* Mock Container Area */}
              <div className="bg-slate-50/50 border border-slate-150 rounded-2xl p-4 md:p-5 min-h-[380px] flex flex-col justify-between">
                <div className="space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-4">
                    {/* Input Voice Line */}
                    <div className="bg-white border border-slate-150 rounded-xl p-3.5 flex items-center justify-between shadow-[0_2px_8px_rgba(0,0,0,0.02)] min-h-[52px]">
                      <div className="flex items-center gap-2.5">
                        <Mic className="h-4 w-4 text-indigo-500 shrink-0" />
                        <span className="text-sm font-semibold text-indigo-600 italic">
                          {typedVoice && `"${typedVoice}`}
                          {typedVoice && typedVoice.length < voiceCommands[activeIndex].cmd.length && (
                            <span className="animate-pulse text-indigo-600 not-italic font-bold">|</span>
                          )}
                          {typedVoice && typedVoice.length === voiceCommands[activeIndex].cmd.length && `"`}
                        </span>
                      </div>
                      
                      {/* Waveform Bars */}
                      <div className="flex items-center gap-0.5 h-3.5">
                        <span className="w-0.5 h-2 bg-indigo-500 rounded-full" />
                        <span className="w-0.5 h-3.5 bg-indigo-500 rounded-full animate-pulse" />
                        <span className="w-0.5 h-2.5 bg-indigo-500 rounded-full" />
                        <span className="w-0.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
                      </div>
                    </div>

                    {/* Output Panel */}
                    <AnimatePresence mode="wait">
                      {showOutput && (
                        <motion.div
                          initial={{ opacity: 0, y: 15, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.98 }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                          className="bg-white border border-slate-150 rounded-xl p-4 md:p-5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-3"
                        >
                          <div className="flex items-center gap-1.5 text-[10px] font-extrabold tracking-wider text-indigo-600 uppercase">
                            <Sparkles className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                            <span>AIBASS Voice Action</span>
                          </div>
                          <h4 className="text-xs md:text-sm font-bold text-slate-800">
                            {voiceCommands[activeIndex].actionTitle}
                          </h4>

                          {/* Miniature Details Table */}
                          <div className="border border-slate-100 bg-slate-50/30 rounded-xl p-3 text-xs space-y-2 font-medium">
                            {voiceCommands[activeIndex].details.map((detail, idx) => (
                              <React.Fragment key={idx}>
                                {detail.isTotal && <div className="border-t border-slate-200/60 my-1" />}
                                <div className="flex justify-between items-center">
                                  <span className={detail.isTotal ? "text-slate-900 font-bold" : "text-slate-400"}>
                                    {detail.label}
                                  </span>
                                  <span className={
                                    detail.isHighlight 
                                      ? "text-slate-800 font-bold" 
                                      : detail.isTotal 
                                        ? "text-indigo-600 font-black text-sm" 
                                        : "text-slate-700"
                                  }>
                                    {detail.value}
                                  </span>
                                </div>
                              </React.Fragment>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>

        {/* CTA section bottom */}

        {/* CTA section bottom */}
        <div className="text-center space-y-4 pt-4">
          <Button 
            onClick={() => window.dispatchEvent(new CustomEvent("openTrialModal"))}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold h-11 px-6 rounded-full inline-flex items-center gap-2 group transition-all shadow-md"
          >
            Watch AIBASS in Action
            <Play className="h-4 w-4 fill-white" />
          </Button>
        </div>

      </div>
    </section>
  );
};
