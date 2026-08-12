import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Sparkles, 
  Menu, 
  X, 
  ArrowUp,
  CheckCircle2,
  ArrowRight,
  Mic,
  Calculator,
  Package,
  BarChart3,
  TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { AiAccountingHero } from "@/components/AiAccountingHero";
import { AiAccountingRecognition } from "@/components/AiAccountingRecognition";
import { AiAccountingFeatures } from "@/components/AiAccountingFeatures";
import { AiAccountingChallenges } from "@/components/AiAccountingChallenges";
import { AiAccountingCommands } from "@/components/AiAccountingCommands";
import { AiAccountingFeaturesList } from "@/components/AiAccountingFeaturesList";
import { AiAccountingHowItWorks } from "@/components/AiAccountingHowItWorks";
import { AiAccountingDashboardSection } from "@/components/AiAccountingDashboardSection";
import { AiAccountingGstSection } from "@/components/AiAccountingGstSection";
import { AiAccountingBusinessNeeds } from "@/components/AiAccountingBusinessNeeds";
import { AiAccountingComparison } from "@/components/AiAccountingComparison";
import { AiAccountingBenefits } from "@/components/AiAccountingBenefits";
import { AiAccountingDemoSection } from "@/components/AiAccountingDemoSection";
import { AiAccountingSecurity } from "@/components/AiAccountingSecurity";
import { AiAccountingTestimonials } from "@/components/AiAccountingTestimonials";
import { AiAccountingPricing } from "@/components/AiAccountingPricing";
import { AiAccountingBottomBanner } from "@/components/AiAccountingBottomBanner";
import { AiAccountingFaq } from "@/components/AiAccountingFaq";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { TrialFormModal } from "@/components/TrialFormModal";

const AiAccountingExplained = () => {
  const navigate = useNavigate();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);

  // Set page meta title and description dynamically for SEO
  useEffect(() => {
    document.title = "AI Accounting Software for Smarter Business Finance | AIBASS";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Simplify bookkeeping, GST invoices, inventory, financial reports and cash flow with AIBASS AI accounting software. Start your 30 day free trial."
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

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const productHighlights = [
    { text: "Voice and Text Commands", icon: Mic, bgClass: "bg-blue-50 text-blue-600 border-blue-100" },
    { text: "Automatic GST Calculation", icon: Calculator, bgClass: "bg-purple-50 text-purple-600 border-purple-100" },
    { text: "Connected Stock Updates", icon: Package, bgClass: "bg-amber-50 text-amber-600 border-amber-100" },
    { text: "Clear Financial Reports", icon: BarChart3, bgClass: "bg-emerald-50 text-emerald-600 border-emerald-100" },
    { text: "Cash Flow Predictions", icon: TrendingUp, bgClass: "bg-indigo-50 text-indigo-600 border-indigo-100" }
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
      <main className="relative z-10 mx-auto max-w-[1380px] w-full px-4 sm:px-8 lg:px-12 pb-16">
        
        {/* Section 1: Hero Block */}
        <AiAccountingHero />

        {/* Section 1.5: Recognition Behind AIBASS */}
        <AiAccountingRecognition />

        {/* Section 2: Product Highlights */}
        <section id="highlights" className="py-6 md:py-8 border-t border-slate-100 scroll-mt-24">
          <div className="max-w-6xl mx-auto bg-white border border-slate-200/60 rounded-[32px] p-6 md:p-8 shadow-[0_15px_40px_rgba(0,0,0,0.03)] space-y-6">
            <h3 className="text-xl font-bold text-slate-900 tracking-tight text-center">
              Product Highlights
            </h3>
            <div className="w-12 h-1 bg-indigo-600 rounded-full mx-auto" />
            
            <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 pt-2 w-full">
              {productHighlights.map((highlight, index) => {
                const Icon = highlight.icon;
                return (
                  <div key={index} className="flex items-center gap-2 bg-slate-50/50 hover:bg-slate-50 transition-colors duration-200 px-3.5 py-2 rounded-2xl border border-slate-100 w-full md:w-auto">
                    <div className={`p-1.5 rounded-xl border ${highlight.bgClass} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-xs lg:text-sm font-bold text-slate-700 whitespace-nowrap">{highlight.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Section 3: AI Based Accounting Software Built for Modern Businesses */}
        <section id="about-aibass" className="py-6 md:py-8 border-t border-slate-100 scroll-mt-24">
          <div className="max-w-6xl mx-auto text-center flex flex-col items-center justify-center space-y-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                AI Based Accounting Software Built for Modern Businesses
              </h2>
            </div>
            
            <div className="space-y-4 text-sm font-medium leading-relaxed text-slate-700 sm:text-base">
              <p>
                AIBASS is an AI based accounting software that makes everyday business finance easier to manage. 
                It brings accounting, bookkeeping, invoicing, GST, inventory, financial reporting and cash flow 
                information into one connected platform.
              </p>
              <p>
                Instead of moving through several menus to find reports or complete routine activities, 
                users can tell AIBASS what they need using a voice or text command. The platform processes 
                the instruction and completes the supported action or displays the requested information.
              </p>
              <p>
                This simpler approach helps business owners spend less time navigating accounting software 
                and more time understanding sales, expenses, stock and financial performance.
              </p>
              <p className="font-semibold text-slate-850">
                AIBASS is developed by Shree Andal AI Software Solutions (OPC) Private Limited, a DPIIT-recognized startup in the AI and Machine Learning sector. This recognition supports our expertise in building practical AI-driven accounting solutions for modern businesses.
              </p>
            </div>

            <div className="pt-2">
              <Button 
                onClick={() => window.dispatchEvent(new CustomEvent("openTrialModal"))}
                className="bg-indigo-600 hover:bg-indigo-755 text-white font-semibold px-6 py-5 rounded-full flex items-center gap-2 group transition-all shadow-md hover:shadow-indigo-200 mx-auto"
              >
                Explore AIBASS Features
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        </section>

        {/* Section 4: What Is AI Accounting Software and How Does It Help with Day to Day Business Finance? */}
        <section className="py-6 md:py-8 border-t border-slate-100">
          <div className="space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              <div className="lg:col-span-5 space-y-4">
                <span className="text-xs font-bold tracking-[0.2em] text-indigo-655 uppercase block">How It Helps</span>
                <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                  What Is AI Accounting Software and How Does It Help with Day to Day Business Finance?
                </h2>
              </div>

              <div className="lg:col-span-7 space-y-4 text-sm font-medium leading-relaxed text-slate-700 sm:text-base">
                <p>
                  AI accounting software uses intelligent automation to simplify accounting, bookkeeping and financial management. 
                  It helps businesses organise financial data, create invoices, calculate GST, update inventory, generate reports and 
                  access important information with less manual work.
                </p>
                <p>
                  AIBASS makes these activities easier by allowing users to give voice or text commands. Business owners can request a 
                  profit and loss statement, generate a balance sheet, check stock, view category wise expenses or review cash flow predictions 
                  without searching through multiple software screens.
                </p>
                <p className="font-semibold text-slate-850">
                  By connecting accounting, invoicing, GST, inventory and reporting in one platform, AIBASS helps businesses save time, 
                  understand their financial position and make informed day to day decisions.
                </p>
              </div>

            </div>

            {/* Feature Cards Grid (how it helps) */}
            <AiAccountingFeatures />

          </div>
        </section>

        {/* Section 5: Make Everyday Accounting Easier with AI */}
        <AiAccountingChallenges />

        {/* Section 6: Manage Accounting Through Voice or Text Commands */}
        <AiAccountingCommands />

        {/* Section 7: AI Accounting Features for Everyday Business Management */}
        <AiAccountingFeaturesList />

        {/* Section 8: How AIBASS Works */}
        <AiAccountingHowItWorks />

        {/* Section 9: Financial Dashboard for a Clear View of Business Performance */}
        <AiAccountingDashboardSection />

        {/* Section 10: Automatic GST Calculation for Sales Invoices */}
        <AiAccountingGstSection />

        {/* Section 11: AI Accounting Software for Different Business Needs */}
        <AiAccountingBusinessNeeds />

        {/* Section 12: AI Accounting Software Versus Traditional Accounting Tools */}
        <AiAccountingComparison />

        {/* Section 13: Why Businesses Choose AIBASS */}
        <AiAccountingBenefits />

        {/* Section 14: See AIBASS in Action */}
        <AiAccountingDemoSection />

        {/* Section 15: Security Designed to Protect Your Business Financial Data */}
        <AiAccountingSecurity />

        {/* Section 16: Helping Businesses Manage Accounts More Easily (Testimonials) */}
        <AiAccountingTestimonials />

        {/* Section 17: Simple and Affordable Pricing */}
        <AiAccountingPricing />

        {/* Section 18: Make Business Accounting Easier with AI (Bottom Banner Callout) */}
        <AiAccountingBottomBanner />

        {/* Section 19: Frequently Asked Questions */}
        <AiAccountingFaq />

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

export default AiAccountingExplained;
