import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface CompanyOverviewSectionProps {
  onExplore?: () => void;
  awardImage?: string;
  certificateImage?: string;
}

// ─── SVG Helper Components ───────────────────────────────────────────────────

const BlueShieldIcon = () => (
  <img 
    src="/images/fi_5643496.png" 
    alt="AIBASS Shield Emblem" 
    className="w-11 sm:w-13 h-auto object-contain shrink-0 self-center my-auto drop-shadow-xs" 
  />
);

const LaurelBranchLeft = () => (
  <img 
    src="/images/Vector.png" 
    alt="Laurel Branch Left" 
    className="w-20 sm:w-28 lg:w-36 h-auto max-h-72 object-contain shrink-0 opacity-90" 
  />
);

const LaurelBranchRight = () => (
  <img 
    src="/images/Vector-1.png" 
    alt="Laurel Branch Right" 
    className="w-20 sm:w-28 lg:w-36 h-auto max-h-72 object-contain shrink-0 opacity-90" 
  />
);

// ─── Main Component ──────────────────────────────────────────────────────────

export const CompanyOverviewSection: React.FC<CompanyOverviewSectionProps> = ({
  onExplore,
  awardImage = "/images/Awwward Frame.webp",
  certificateImage = "/images/Certificatee page.png",
}) => {
  const handleCTA = () => {
    if (onExplore) {
      onExplore();
    } else {
      window.dispatchEvent(new CustomEvent("openTrialModal"));
    }
  };

  return (
    <div className="w-full space-y-12">
      {/* ─── TOP SECTION: Overview & DPIIT Certificate ───────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Heading & Paragraphs */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-6 space-y-5"
          >
            {/* Main Title */}
            <h2 className="text-2xl sm:text-3xl lg:text-[36px] font-extrabold tracking-tight text-slate-900 leading-[1.25]">
              AI Based Accounting Software <br />
              Built for <span className="text-[#2563EB]">Modern Businesses</span>
            </h2>

            {/* Paragraph 1 */}
            <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
              AIBASS is an AI based accounting software that makes everyday business finance easier to manage. It brings accounting, bookkeeping, invoicing, GST, inventory, financial reporting and cash flow information into one connected platform.
            </p>

            {/* Paragraph 2 */}
            <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
              Instead of moving through several menus to find reports or complete routine activities, users can tell AIBASS what they need using a voice or text command. The platform processes the instruction and completes the supported action or displays the requested information.
            </p>

            {/* Paragraph 3 */}
            <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
              This simpler approach helps business owners spend less time navigating accounting software and more time understanding sales, expenses, stock and financial performance.
            </p>

            {/* Callout Box UI — Rounded Outlined Card */}
            <div className="rounded-[26px] bg-[#F4F8FE] border border-[#BFDBFE] p-5 sm:p-6 flex items-center gap-4 sm:gap-5 shadow-[0_8px_25px_rgba(191,219,254,0.35)] relative overflow-hidden">
              <BlueShieldIcon />
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
                AIBASS is developed by{" "}
                <span className="text-[#2563EB]">Shree Andal AI Software Solutions</span>{" "}
                (OPC) Private Limited, a DPIIT-recognized startup in the{" "}
                <span className="text-[#2563EB]">AI and Machine Learning sector</span>.{" "}
                This recognition supports our expertise in developing practical AI-driven accounting solutions for modern businesses.
              </p>
            </div>
          </motion.div>

          {/* Right Column: DPIIT Certificate of Recognition Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-6 flex justify-center items-center"
          >
            <div className="relative w-full max-w-[640px] lg:max-w-[720px] flex justify-center items-center">
              <img 
                src={certificateImage} 
                alt="DPIIT Certificate of Recognition - Shree Andal AI Software Solutions" 
                className="w-full h-auto object-contain drop-shadow-2xl hover:scale-[1.02] transition-transform duration-300 rounded-2xl"
              />
            </div>
          </motion.div>

        </div>
      </div>

      {/* ─── BOTTOM SECTION: 100% Full-Width Award Recognition Banner ──────────────────────────── */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative w-full bg-[#FAF9FF] px-4 sm:px-8 lg:px-12 py-10 sm:py-16 overflow-hidden"
      >
        <div className="relative max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Far Left Laurel SVG */}
          <div className="hidden md:block shrink-0">
            <LaurelBranchLeft />
          </div>

          {/* Center Main Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center w-full max-w-5xl mx-auto">
            
            {/* Left: Award Frame Picture */}
            <div className="md:col-span-5 flex justify-center">
              <div className="relative max-w-[340px] sm:max-w-[380px] w-full flex items-center justify-center">
                <img 
                  src={awardImage} 
                  alt="AI Company of the Year 2026 Award - SiliconIndia Recognition" 
                  className="w-full h-auto object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-300 mx-auto"
                />
              </div>
            </div>

            {/* Right: Text Content & CTA */}
            <div className="md:col-span-7 space-y-4 text-left">
              
              <div className="inline-flex items-center justify-center bg-[#F3E8FF]/90 border border-[#DDD6FE] text-[#6D28D9] font-extrabold text-xs rounded-full px-4 py-1.5 tracking-wider uppercase shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-md">
                AWARD RECOGNITION
              </div>

              <h3 className="text-2xl sm:text-3xl lg:text-[34px] font-extrabold text-slate-900 leading-tight">
                AI Company of the Year – <br className="hidden sm:inline" />
                Accounting Software 2026
              </h3>

              <p className="text-slate-700 text-xs sm:text-sm lg:text-base leading-relaxed">
                Shree Andal AI Software Solutions, the company behind AIBASS, was recognized by SiliconIndia Magazine as AI Company of the Year – Accounting Software 2026.
              </p>

              <p className="text-slate-700 text-xs sm:text-sm lg:text-base leading-relaxed">
                This recognition acknowledges the company’s products, services and approach to applying technology and best practices to complex business requirements.
              </p>

              <div className="pt-2">
                <Button
                  onClick={handleCTA}
                  size="lg"
                  className="px-8 py-3.5 text-xs sm:text-sm font-bold rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-white shadow-md hover:scale-105 active:scale-95 transition-all"
                >
                  Explore AIBASS
                </Button>
              </div>

            </div>

          </div>

          {/* Far Right Laurel SVG */}
          <div className="hidden md:block shrink-0">
            <LaurelBranchRight />
          </div>

        </div>
      </motion.div>
    </div>
  );
};

export default CompanyOverviewSection;
