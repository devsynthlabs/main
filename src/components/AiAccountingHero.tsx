import React from "react";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  Search, 
  Bell, 
  ChevronDown, 
  MessageSquare, 
  Mic, 
  Send,
  LayoutDashboard,
  BadgeCent,
  ShoppingCart,
  Package,
  Calculator,
  BarChart3,
  TrendingUp,
  FolderKanban,
  Settings,
  CheckCheck
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export const AiAccountingHero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative items-center gap-10 py-12 pt-24 lg:py-20 lg:pt-32 bg-transparent">
      <div className="max-w-[1380px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Content */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-6">
            <div className="inline-flex items-center">
              <p className="text-xs font-bold tracking-wide text-indigo-600 bg-indigo-50/50 px-3.5 py-1.5 rounded-full border border-indigo-100 flex items-center gap-2">
                <img src="/logo/award.png" alt="Award" className="w-4 h-4 object-contain shrink-0" />
                <span>Built by the AI Company of the Year – Accounting Software 2026</span>
              </p>
            </div>
            
            <h1 className="text-balance text-3xl font-bold leading-[1.2] tracking-tight text-slate-950 sm:text-4xl lg:text-5xl xl:text-[52px]">
              AI Accounting Software for Smarter Business Finance
            </h1>
            
            <p className="max-w-2xl text-sm font-medium leading-relaxed text-slate-700 sm:text-base">
              Manage bookkeeping, sales invoices, GST calculations, inventory, financial reports and cash flow predictions from one connected platform. With AIBASS, users can type or speak a command to complete supported accounting tasks or access the business information they need.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
              <Button 
                onClick={() => window.dispatchEvent(new CustomEvent("openTrialModal"))}
                className="w-full sm:w-auto h-12 rounded-full bg-slate-950 px-6 text-sm font-semibold text-white shadow-md hover:bg-slate-800 transition-all hover:-translate-y-0.5"
              >
                Start 30 Day Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.dispatchEvent(new CustomEvent("openTrialModal"))}
                className="w-full sm:w-auto h-12 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold px-6 text-sm transition-all hover:-translate-y-0.5"
              >
                Book a Free Demo
              </Button>
            </div>
          </div>

          {/* Right Interface Mockup */}
          <div className="lg:col-span-7 relative flex justify-center items-center">
            
            {/* Main Window */}
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

                {/* Profile/Actions */}
                <div className="flex items-center gap-3">
                  <Search className="h-4 w-4 text-slate-400 cursor-pointer hover:text-slate-600" />
                  <Bell className="h-4 w-4 text-slate-400 cursor-pointer hover:text-slate-600" />
                  <div className="h-6 w-[1px] bg-slate-200" />
                  <div className="flex items-center gap-1.5 cursor-pointer">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 overflow-hidden flex items-center justify-center text-[10px] font-bold text-white shadow-sm border border-white">
                      BO
                    </div>
                    <span className="text-xs font-medium text-slate-600">Business Owner</span>
                    <ChevronDown className="h-3 w-3 text-slate-400" />
                  </div>
                </div>
              </div>

              {/* Layout Content Body */}
              <div className="flex-1 flex overflow-hidden">
                
                {/* Sidebar Navigation */}
                <aside className="w-40 border-r border-slate-100 bg-white/20 p-2.5 hidden sm:flex flex-col gap-0.5">
                  {[
                    { icon: LayoutDashboard, label: "Dashboard", active: true },
                    { icon: BadgeCent, label: "Sales" },
                    { icon: ShoppingCart, label: "Purchases" },
                    { icon: Package, label: "Inventory" },
                    { icon: Calculator, label: "Accounting" },
                    { icon: BarChart3, label: "Reports" },
                    { icon: TrendingUp, label: "Cash Flow" },
                    { icon: FolderKanban, label: "Projects" },
                    { icon: Settings, label: "Settings" }
                  ].map((item, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                        item.active 
                          ? "bg-indigo-50 text-indigo-600" 
                          : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                      }`}
                    >
                      <item.icon className="h-3.5 w-3.5" />
                      <span>{item.label}</span>
                    </div>
                  ))}
                </aside>

                {/* Main panel */}
                <main className="flex-1 flex flex-col bg-slate-50/50 p-3 overflow-hidden">
                  <div className="flex-1 flex flex-col space-y-2.5">
                    
                    {/* Assistant Title */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">AI Assistant</span>
                    </div>

                    {/* Chat Bubble: User */}
                    <div className="self-end max-w-[80%] bg-indigo-600 text-white rounded-2xl rounded-tr-none px-3.5 py-1.5 shadow-md shadow-indigo-100 relative">
                      <p className="text-xs font-medium">Show my profit and loss for this month</p>
                      <div className="flex items-center justify-end gap-1 mt-0.5">
                        <span className="text-[9px] opacity-80 font-normal">11:30 AM</span>
                        <CheckCheck className="h-3 w-3 opacity-90 inline-block" />
                      </div>
                    </div>

                    {/* Chat Bubble: AI */}
                    <div className="self-start max-w-[95%] space-y-2 w-full">
                      <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-none px-3.5 py-1.5 shadow-sm text-slate-700 w-fit">
                        <p className="text-xs font-medium">Here is your Profit and Loss summary for this month.</p>
                      </div>

                      {/* Profit and Loss Card Visual */}
                      <div className="bg-white border border-slate-100 rounded-2xl p-3 shadow-sm space-y-2 w-full">
                        <div className="flex items-center justify-between border-b border-slate-50 pb-1.5">
                          <div>
                            <h4 className="text-xs font-bold text-slate-800">Profit and Loss - This Month</h4>
                            <span className="text-[10px] text-slate-400">01 May - 31 May 2026</span>
                          </div>
                        </div>

                        {/* Financial Stats */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-left">
                          <div className="p-1.5 rounded-xl bg-slate-50/50">
                            <span className="text-[9px] text-slate-400 block font-medium">Total Income</span>
                            <span className="text-xs font-bold text-emerald-600">₹12,45,000</span>
                          </div>
                          <div className="p-1.5 rounded-xl bg-slate-50/50">
                            <span className="text-[9px] text-slate-400 block font-medium">Total Expenses</span>
                            <span className="text-xs font-bold text-rose-600">₹7,85,000</span>
                          </div>
                          <div className="p-1.5 rounded-xl bg-slate-50/50">
                            <span className="text-[9px] text-slate-400 block font-medium">Net Profit</span>
                            <span className="text-xs font-bold text-emerald-600">₹4,60,000</span>
                          </div>
                          <div className="p-1.5 rounded-xl bg-slate-50/50">
                            <span className="text-[9px] text-slate-400 block font-medium">Profit Margin</span>
                            <span className="text-xs font-bold text-indigo-600">36.98%</span>
                          </div>
                        </div>

                        {/* Simple Bar Chart Graph */}
                        <div className="space-y-1.5 pt-1.5">
                          {/* Legend */}
                          <div className="flex items-center justify-center gap-4 text-[9px] font-bold text-slate-500">
                            <div className="flex items-center gap-1">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              <span>Income</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                              <span>Expenses</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                              <span>Profit</span>
                            </div>
                          </div>

                          {/* Bars */}
                          <div className="h-14 flex items-end justify-between px-2 pt-2 border-b border-slate-100">
                            {[
                              { label: "01 May", income: 30, expense: 20, profit: 10 },
                              { label: "08 May", income: 50, expense: 32, profit: 18 },
                              { label: "15 May", income: 42, expense: 28, profit: 14 },
                              { label: "22 May", income: 65, expense: 40, profit: 25 },
                              { label: "31 May", income: 80, expense: 50, profit: 30 },
                            ].map((day, idx) => (
                              <div key={idx} className="flex flex-col items-center flex-1 h-full group">
                                <div className="flex items-end gap-1 h-full w-full justify-center">
                                  <div 
                                    style={{ height: `${day.income}%` }} 
                                    className="w-1.5 bg-emerald-500 rounded-t-sm transition-all group-hover:opacity-85" 
                                  />
                                  <div 
                                    style={{ height: `${day.expense}%` }} 
                                    className="w-1.5 bg-rose-500 rounded-t-sm transition-all group-hover:opacity-85" 
                                  />
                                  <div 
                                    style={{ height: `${day.profit}%` }} 
                                    className="w-1.5 bg-indigo-500 rounded-t-sm transition-all group-hover:opacity-85" 
                                  />
                                </div>
                                <span className="text-[8px] text-slate-400 mt-1">{day.label}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>
                    </div>

                  </div>

                  {/* Input Box */}
                  <div className="mt-2 bg-white border border-slate-200/80 rounded-2xl px-3.5 py-2 flex items-center justify-between shadow-sm">
                    <span className="text-xs text-slate-400 font-medium">Ask anything about your business finance...</span>
                    <div className="flex items-center gap-2">
                      <Mic className="h-4 w-4 text-slate-400 hover:text-slate-600 cursor-pointer" />
                      <Send className="h-4 w-4 text-indigo-500 hover:text-indigo-600 cursor-pointer" />
                    </div>
                  </div>
                </main>
              </div>
            </div>

            {/* Floating badges right of dashboard mockup */}
            <div className="absolute -right-2 md:-right-6 bottom-12 flex flex-col gap-3 z-20">
              
              {/* Text Command Badge */}
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2.5 bg-white border border-slate-150/80 rounded-2xl p-2.5 shadow-lg cursor-pointer"
              >
                <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center text-purple-650">
                  <MessageSquare className="h-4 w-4" />
                </div>
                <div className="text-left pr-2">
                  <span className="text-xs font-bold text-slate-800 block">Text Command</span>
                </div>
              </motion.div>

              {/* Voice Command Badge */}
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2.5 bg-white border border-slate-150/80 rounded-2xl p-2.5 shadow-lg cursor-pointer"
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-650">
                  <Mic className="h-4 w-4" />
                </div>
                <div className="text-left pr-2">
                  <span className="text-xs font-bold text-slate-800 block">Voice Command</span>
                </div>
              </motion.div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
