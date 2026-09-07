import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Mic, BarChart3, Receipt, Package, Calculator } from "lucide-react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface HeroSectionProps {
  onWatchDemo: () => void;
}

const HeroSection = ({ onWatchDemo }: HeroSectionProps) => {
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    description: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    phone: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let isValid = true;
    const newErrors = { email: "", phone: "" };

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
      isValid = false;
    }

    // Validate phone number (must have at least 10 digits, allow optional '+', spaces, hyphens, and parentheses)
    const phoneRegex = /^\+?[0-9\s\-()]{10,20}$/;
    const digitsOnly = formData.phone.replace(/\D/g, "");
    if (!phoneRegex.test(formData.phone) || digitsOnly.length < 10) {
      newErrors.phone = "Please enter a valid phone number (at least 10 digits).";
      isValid = false;
    }

    if (!isValid) {
      setErrors(newErrors);
      return;
    }

    toast.success("Your 30-day free trial request has been submitted successfully!");
    setIsDialogOpen(false);
    setFormData({
      name: "",
      email: "",
      phone: "",
      description: "",
    });
    setErrors({
      email: "",
      phone: "",
    });
  };

  const handleOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setErrors({ email: "", phone: "" });
    }
  };

  const heroSignals = [
    { label: "Voice Command", value: "Active", icon: Mic },
    { label: "AI Sync", value: "Live", icon: Sparkles },
    { label: "Data Engine", value: "Running", icon: BarChart3 },
  ];

  const floatingElements = [
    { label: "Invoices", value: "Auto-matched", icon: Receipt, className: "left-[-5%] top-[15%] hidden lg:flex" },
    { label: "GST Engine", value: "Ready to file", icon: Calculator, className: "right-[-2%] top-[25%] hidden lg:flex" },
    { label: "Inventory", value: "Synced", icon: Package, className: "bottom-[15%] left-[5%] hidden lg:flex" },
    { label: "Cash Flow", value: "Healthy", icon: BarChart3, className: "bottom-[25%] right-[-5%] hidden xl:flex" },
  ];

  return (
    <section className="relative grid min-h-screen items-center gap-10 py-12 pt-24 lg:grid-cols-[1.05fr_0.95fr] lg:py-20 lg:pt-32">
      {/* Left Content Area */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-10 max-w-3xl"
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-8 inline-flex items-center"
        >
          <p className="flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50/50 px-3.5 py-1.5 text-xs font-bold tracking-wide text-indigo-600">
            <Sparkles className="h-4 w-4 shrink-0 text-indigo-600" />
            <span>AIBASS Intelligent Finance</span>
          </p>
        </motion.div>

        <h1 className="text-balance text-3xl font-bold leading-[1.2] tracking-tight text-slate-950 sm:text-4xl lg:text-5xl xl:text-[52px]">
          AI Accounting Software
        </h1>

        <p className="mt-3 text-lg font-bold tracking-tight text-slate-900 sm:text-xl lg:text-2xl">
          <span className="bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent">
            Built for Indian Small Businesses
          </span>
        </p>

        <p className="mt-4 max-w-2xl text-sm font-medium leading-relaxed text-slate-700 sm:text-base">
          Automate bookkeeping, GST invoicing, inventory tracking and financial reports with AI. Simply use voice or text commands to manage your business accounts faster.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
          <Button
            size="default"
            onClick={() => window.dispatchEvent(new CustomEvent("openTrialModal"))}
            className="group relative h-12 overflow-hidden rounded-full bg-slate-950 px-6 text-sm font-semibold text-white shadow-[0_18px_42px_rgba(15,23,42,0.26)] transition-all duration-300 hover:-translate-y-1 hover:bg-slate-800 hover:shadow-[0_24px_54px_rgba(15,23,42,0.36)]"
          >
            <span className="relative z-10 flex items-center">
              Get your 30 days free trial
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
            <div className="absolute inset-0 z-0 bg-gradient-to-r from-sky-600/20 to-indigo-600/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </Button>
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-4">
          {heroSignals.map((signal, index) => (
            <motion.div
              key={signal.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
              className="flex items-center gap-2.5 rounded-full border border-slate-200/60 bg-white/40 px-3 py-1.5 shadow-sm backdrop-blur-md"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100">
                <signal.icon className="h-3 w-3 text-sky-600" />
              </div>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500">
                  {signal.label}
                </p>
                <p className="text-xs font-semibold text-slate-900">{signal.value}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Right Visual Area */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="relative z-0 mx-auto w-full max-w-xl lg:max-w-none"
      >
        <div className="relative aspect-square w-full sm:aspect-[4/3] lg:aspect-square">
          {/* Main Interface Mockup */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative h-full w-full max-h-[600px] max-w-[600px]">
              {/* Background Glow */}
              <div className="absolute inset-0 -z-10 rounded-full bg-gradient-to-tr from-sky-300/30 via-indigo-300/20 to-emerald-300/30 blur-3xl" />
              
              {/* Dashboard Container */}
              <motion.div 
                animate={{ y: [-8, 8, -8] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="h-full w-full rounded-[40px] border border-white/60 bg-white/30 p-4 shadow-[0_40px_100px_rgba(15,23,42,0.15)] backdrop-blur-2xl"
              >
                <div className="flex h-full w-full flex-col overflow-hidden rounded-[28px] border border-white/40 bg-slate-50/80 shadow-inner">
                  {/* Mockup Header */}
                  <div className="flex items-center justify-between border-b border-slate-200/50 bg-white/50 px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-600 text-white shadow-sm">
                        <Mic className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">AIBASS Voice Assistant</h3>
                        <p className="text-xs font-medium text-slate-500">Listening to commands...</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.6)]" />
                      <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                      <div className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                    </div>
                  </div>
                  
                  {/* Mockup Body (Waveform Animation) */}
                  <div className="flex flex-1 flex-col items-center justify-center gap-8 p-8">
                    <div className="flex h-24 items-center gap-2">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
                        <motion.div
                          key={i}
                          animate={{ 
                            height: ["20%", "100%", "20%"],
                            backgroundColor: ["rgba(14, 165, 233, 0.4)", "rgba(99, 102, 241, 0.8)", "rgba(14, 165, 233, 0.4)"]
                          }}
                          transition={{ 
                            duration: 1.5, 
                            repeat: Infinity, 
                            delay: i * 0.1,
                            ease: "easeInOut"
                          }}
                          className="w-3 rounded-full"
                          style={{ minHeight: "12px" }}
                        />
                      ))}
                    </div>
                    <p className="text-center text-lg font-medium text-slate-600">
                      "Show me the GST report for this quarter"
                    </p>
                  </div>
                  
                  {/* Mockup Footer Stats */}
                  <div className="grid grid-cols-2 gap-px bg-slate-200/50">
                    <div className="bg-white/80 p-5">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Action Matched</p>
                      <p className="mt-1 text-lg font-bold text-slate-900">Generate Report</p>
                    </div>
                    <div className="bg-white/80 p-5">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Processing Time</p>
                      <p className="mt-1 text-lg font-bold text-emerald-600">0.8s</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Floating Elements */}
          {floatingElements.map((el, index) => (
            <motion.div
              key={el.label}
              initial={{ opacity: 0, scale: 0.8, x: index % 2 === 0 ? -20 : 20 }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                x: 0,
                y: [0, -12, 0]
              }}
              transition={{ 
                opacity: { delay: 0.8 + index * 0.15, duration: 0.5 },
                scale: { delay: 0.8 + index * 0.15, duration: 0.5 },
                y: { duration: 4 + index, repeat: Infinity, ease: "easeInOut", delay: index * 0.5 }
              }}
              className={`absolute z-20 flex items-center gap-3 rounded-2xl border border-white/60 bg-white/70 p-4 shadow-[0_20px_40px_rgba(15,23,42,0.1)] backdrop-blur-xl ${el.className}`}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-100">
                <el.icon className="h-5 w-5 text-sky-600" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{el.label}</p>
                <p className="text-sm font-bold text-slate-900">{el.value}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[425px] rounded-3xl bg-white/95 backdrop-blur-xl border-slate-200/50 shadow-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent">
              Start Your 30-Day Free Trial
            </DialogTitle>
            <DialogDescription className="text-slate-600 font-medium mt-1">
              Fill out the details below, and our team will get you set up with your free trial account immediately.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-slate-500">Full Name</Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Doe"
                className="h-11 rounded-xl border-slate-200 bg-white/50 focus:border-sky-500 focus:ring-sky-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-slate-500">Email Address</Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  if (errors.email) setErrors({ ...errors, email: "" });
                }}
                placeholder="john@example.com"
                className={`h-11 rounded-xl bg-white/50 focus:border-sky-500 focus:ring-sky-500 ${
                  errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-slate-200"
                }`}
              />
              {errors.email && (
                <p className="text-xs font-medium text-red-500 mt-1">{errors.email}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider text-slate-500">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => {
                  setFormData({ ...formData, phone: e.target.value });
                  if (errors.phone) setErrors({ ...errors, phone: "" });
                }}
                placeholder="+1 (555) 000-0000"
                className={`h-11 rounded-xl bg-white/50 focus:border-sky-500 focus:ring-sky-500 ${
                  errors.phone ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-slate-200"
                }`}
              />
              {errors.phone && (
                <p className="text-xs font-medium text-red-500 mt-1">{errors.phone}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-xs font-bold uppercase tracking-wider text-slate-500">Business Description</Label>
              <Textarea
                id="description"
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Tell us a bit about your business and accounting needs..."
                className="min-h-[100px] rounded-xl border-slate-200 bg-white/50 focus:border-sky-500 focus:ring-sky-500"
              />
            </div>
            <Button
              type="submit"
              className="w-full h-11 mt-2 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 font-semibold text-white shadow-lg hover:from-sky-500 hover:to-indigo-500 transition-all duration-300"
            >
              Get Started Now
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default HeroSection;
