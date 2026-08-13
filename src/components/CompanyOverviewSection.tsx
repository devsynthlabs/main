import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface CompanyOverviewSectionProps {
  onExplore?: () => void;
  awardImage?: string;
}

// ─── SVG Helper Components ───────────────────────────────────────────────────

const BlueShieldIcon = () => (
  <img 
    src="/images/fi_5643496.png" 
    alt="AIBASS Shield Emblem" 
    className="w-11 sm:w-13 h-auto object-contain shrink-0 self-center my-auto drop-shadow-xs" 
  />
);

const AshokaEmblem = () => (
  <svg className="w-8 h-10 text-[#1E3A8A] mx-auto mb-1" viewBox="0 0 40 50" fill="currentColor">
    <path d="M20 2 C16 2 13 5 13 9 C13 11 14 13 16 14 C14 15 12 17 12 20 C12 23 15 25 20 25 C25 25 28 23 28 20 C28 17 26 15 24 14 C26 13 27 11 27 9 C27 5 24 2 20 2 Z" />
    <rect x="10" y="27" width="20" height="3" rx="1" />
    <circle cx="20" cy="35" r="4.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M20 30.5 V39.5 M15.5 35 H24.5 M16.8 31.8 L23.2 38.2 M16.8 38.2 L23.2 31.8" stroke="currentColor" strokeWidth="0.75" />
    <rect x="8" y="41" width="24" height="3" rx="1" />
  </svg>
);

const QrCodeIcon = () => (
  <svg className="w-12 h-12 text-slate-900 shrink-0" viewBox="0 0 100 100" fill="currentColor">
    <rect x="0" y="0" width="30" height="30" fill="black" />
    <rect x="5" y="5" width="20" height="20" fill="white" />
    <rect x="10" y="10" width="10" height="10" fill="black" />

    <rect x="70" y="0" width="30" height="30" fill="black" />
    <rect x="75" y="5" width="20" height="20" fill="white" />
    <rect x="80" y="10" width="10" height="10" fill="black" />

    <rect x="0" y="70" width="30" height="30" fill="black" />
    <rect x="5" y="75" width="20" height="20" fill="white" />
    <rect x="10" y="80" width="10" height="10" fill="black" />

    <rect x="40" y="5" width="8" height="8" />
    <rect x="52" y="5" width="8" height="8" />
    <rect x="40" y="20" width="8" height="8" />
    <rect x="52" y="32" width="8" height="8" />
    <rect x="10" y="42" width="8" height="8" />
    <rect x="22" y="52" width="8" height="8" />
    <rect x="40" y="48" width="8" height="8" />
    <rect x="52" y="58" width="8" height="8" />
    <rect x="70" y="42" width="8" height="8" />
    <rect x="82" y="52" width="8" height="8" />
    <rect x="40" y="72" width="8" height="8" />
    <rect x="52" y="82" width="8" height="8" />
    <rect x="70" y="72" width="8" height="8" />
    <rect x="82" y="82" width="8" height="8" />
    <rect x="62" y="72" width="8" height="8" />
  </svg>
);

const StartupIndiaLogo = () => (
  <div className="flex items-center gap-0.5 font-extrabold text-sm tracking-tight shrink-0">
    <span className="text-[#FF671F]">#startup</span>
    <span className="text-[#046A38]">india</span>
    <div className="w-3.5 h-0.5 bg-[#046A38] ml-0.5 self-end mb-1" />
  </div>
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
            className="lg:col-span-7 space-y-5"
          >
            {/* Main Title */}
            <h2 className="text-2xl sm:text-3xl lg:text-[36px] font-extrabold tracking-tight text-slate-900 leading-[1.25]">
              AI Based Accounting Software <br />
              Built for <span className="text-[#2563EB]">Modern Businesses</span>
            </h2>

            {/* Paragraph 1 */}
            <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
              AIBASS is an AI based accounting software that makes{" "}
              <strong className="font-extrabold text-slate-900">everyday business finance</strong>{" "}
              easier to manage. It brings{" "}
              <strong className="font-extrabold text-slate-900">accounting</strong>,{" "}
              <strong className="font-extrabold text-slate-900">bookkeeping</strong>,{" "}
              invoicing, <strong className="font-extrabold text-slate-900">GST</strong>,{" "}
              inventory, financial reporting and cash flow information into one connected platform.
            </p>

            {/* Paragraph 2 */}
            <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
              Instead of moving through several menus to find reports or complete routine activities, users can tell AIBASS what they need using a voice or text command. The platform processes the instruction and completes the supported action or displays the requested information.
            </p>

            {/* Paragraph 3 */}
            <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
              This simpler <strong className="font-extrabold text-slate-900">approach</strong> helps business owners spend less time navigating accounting software and more time understanding sales, expenses, stock and financial performance.
            </p>

            {/* Callout Box UI — Rounded Outlined Card */}
            <div className="rounded-[26px] bg-[#F4F8FE] border border-[#BFDBFE] p-5 sm:p-6 flex items-center gap-4 sm:gap-5 shadow-[0_8px_25px_rgba(191,219,254,0.35)] relative overflow-hidden">
              <BlueShieldIcon />
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
                <strong className="font-extrabold text-slate-950">AIBASS</strong> is developed by{" "}
                <span className="text-[#2563EB] font-bold">Shree Andal AI Software Solutions</span>{" "}
                (OPC) Private Limited, a DPIIT-recognized startup in the{" "}
                <span className="text-[#2563EB] font-bold">AI and Machine Learning sector</span>.{" "}
                This recognition supports our expertise in developing practical AI-driven accounting solutions for modern businesses.
              </p>
            </div>
          </motion.div>

          {/* Right Column: DPIIT Certificate of Recognition Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-5 flex justify-center"
          >
            <div className="relative w-full max-w-[460px] bg-white border-[3px] border-[#3B82F6]/70 rounded-2xl p-5 sm:p-6 shadow-md text-center flex flex-col justify-between items-center min-h-[380px] overflow-hidden">
              
              {/* Fine Inner Border */}
              <div className="absolute inset-1.5 border border-[#3B82F6]/30 rounded-xl pointer-events-none" />
              
              {/* Corner Flourish Accents */}
              <div className="absolute top-2.5 left-2.5 w-3.5 h-3.5 border-t-2 border-l-2 border-[#2563EB]" />
              <div className="absolute top-2.5 right-2.5 w-3.5 h-3.5 border-t-2 border-r-2 border-[#2563EB]" />
              <div className="absolute bottom-2.5 left-2.5 w-3.5 h-3.5 border-b-2 border-l-2 border-[#2563EB]" />
              <div className="absolute bottom-2.5 right-2.5 w-3.5 h-3.5 border-b-2 border-r-2 border-[#2563EB]" />

              {/* Certificate Header */}
              <div className="w-full space-y-2 pt-1">
                <AshokaEmblem />
                
                <div className="inline-flex items-center justify-center bg-[#ECFDF5]/90 border border-[#A7F3D0] text-[#047857] font-extrabold text-[10px] sm:text-xs rounded-full px-4 py-1 tracking-wider uppercase shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-md">
                  DPIIT RECOGNIZED STARTUP
                </div>

                <h3 className="font-serif tracking-wider text-base sm:text-lg font-bold text-[#1E3A8A] uppercase pt-1">
                  CERTIFICATE OF RECOGNITION
                </h3>

                <p className="font-serif italic text-[11px] text-slate-500">
                  This is to certify that
                </p>

                <p className="font-extrabold text-xs sm:text-sm text-slate-950 uppercase tracking-tight px-2 leading-snug">
                  SHREE ANDAL AI SOFTWARE SOLUTIONS (OPC) PRIVATE LIMITED
                </p>

                <p className="text-[11px] text-slate-600 max-w-xs mx-auto leading-tight">
                  is recognized as a startup by the Department for Promotion of Industry and Internal Trade, Government of India.
                </p>
              </div>

              {/* Certificate Details & Footer */}
              <div className="w-full pt-4 space-y-3">
                <div className="text-[11px] text-slate-700 font-semibold space-y-0.5">
                  <p><span className="text-slate-500">Certificate No.:</span> DIPP208239</p>
                  <p><span className="text-slate-500">Date of Issue:</span> 28-02-2025</p>
                </div>

                <div className="flex items-end justify-between w-full pt-2 px-2 border-t border-slate-100">
                  <StartupIndiaLogo />
                  <QrCodeIcon />
                </div>
              </div>

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
                Shree Andal AI Software Solutions, the company behind AIBASS, was recognized by <strong className="text-slate-900 font-semibold">SiliconIndia Magazine</strong> as <strong className="text-slate-900 font-semibold">AI Company of the Year – Accounting Software 2026</strong>.
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
