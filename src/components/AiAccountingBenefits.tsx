import React from "react";
import { 
  CheckCircle2, 
  Mic, 
  Layers, 
  Calculator, 
  BarChart3, 
  Package, 
  Cloud, 
  TrendingUp, 
  CreditCard 
} from "lucide-react";

export const AiAccountingBenefits = () => {
  const benefits = [
    {
      title: "Voice and Text Commands",
      desc: "Complete supported accounting activities or request information using simple instructions.",
      icon: Mic,
      color: "text-purple-600 bg-purple-50 border-purple-100"
    },
    {
      title: "Connected Financial Management",
      desc: "Manage bookkeeping, GST invoices, inventory, financial reports and cash flow within one platform.",
      icon: Layers,
      color: "text-blue-600 bg-blue-50 border-blue-100"
    },
    {
      title: "Automatic GST Calculation",
      desc: "Calculate supported intrastate and interstate GST values during sales invoice creation.",
      icon: Calculator,
      color: "text-emerald-650 bg-emerald-50 border-emerald-100"
    },
    {
      title: "Clear Financial Reports",
      desc: "Review profit and loss, balance sheet, income, expenses and category wise financial information.",
      icon: BarChart3,
      color: "text-indigo-650 bg-indigo-50 border-indigo-100"
    },
    {
      title: "Updated Stock Information",
      desc: "Keep inventory quantities connected with recorded purchases and sales invoices.",
      icon: Package,
      color: "text-orange-655 bg-orange-50 border-orange-100"
    },
    {
      title: "Secure Cloud Infrastructure",
      desc: "AIBASS runs on AWS infrastructure to support secure cloud-based accounting workflows and reliable access to business financial information.",
      icon: Cloud,
      color: "text-sky-600 bg-sky-50 border-sky-100"
    },
    {
      title: "Cash Flow Predictions",
      desc: "Review expected cash availability and prepare for upcoming financial requirements.",
      icon: TrendingUp,
      color: "text-cyan-600 bg-cyan-50 border-cyan-100"
    },
    {
      title: "Flexible Pricing Options",
      desc: "Choose monthly, annual or lifetime payment based on your preferred commitment.",
      icon: CreditCard,
      color: "text-teal-600 bg-teal-50 border-teal-100"
    }
  ];

  return (
    <section className="py-6 md:py-8 border-t border-slate-100 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="space-y-4 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Why Businesses Choose AIBASS
          </h2>
          <div className="w-12 h-1 bg-indigo-600 rounded-full mx-auto" />
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((item, index) => {
            const Icon = item.icon;
            return (
              <div 
                key={index}
                className="bg-white border border-slate-150 rounded-[28px] p-6 shadow-[0_8px_30px_rgba(15,23,42,0.01)] hover:shadow-[0_12px_35px_rgba(99,102,241,0.05)] transition-all flex flex-col text-left space-y-4"
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${item.color} shadow-sm`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900 leading-snug">{item.title}</h3>
                  <p className="text-sm text-slate-600 font-medium leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
