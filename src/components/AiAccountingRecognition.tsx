import React from "react";
import { Star, ArrowRight, ShieldCheck, TrendingUp, Check } from "lucide-react";

interface AiAccountingRecognitionProps {
  certificateImage?: string;
}

export const AiAccountingRecognition = ({ 
  certificateImage = "/images/AWWWARD - Mono copy.webp" 
}: AiAccountingRecognitionProps) => {
  return (
    <section className="py-8 md:py-12 relative z-10 scroll-mt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Recognition Card */}
        <div className="bg-gradient-to-b from-[#F2F8FF] via-[#EBF4FE] to-[#F5F9FF] border border-[#D0E3F7] rounded-[32px] sm:rounded-[40px] p-6 sm:p-10 lg:p-12 shadow-[0_20px_50px_rgba(14,165,233,0.06)] relative overflow-hidden">
          
          {/* Top Header Tagline & Main Title */}
          <div className="text-center space-y-3 mb-10 md:mb-12 max-w-4xl mx-auto">
            
            {/* Tagline Badge with Laurel Icons */}
            <div className="inline-flex items-center justify-center gap-3">
              {/* Left Laurel SVG Line */}
              <div className="flex items-center gap-1.5 text-[#C59B27]">
                <div className="w-8 sm:w-12 h-[1px] bg-gradient-to-r from-transparent to-[#C59B27]" />
                <svg className="w-4 h-4 text-[#C59B27]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 21C11.5 17 9 14 5 13C9 12 11.5 9 12 5C12.5 9 15 12 19 13C15 14 12.5 17 12 21Z" />
                </svg>
              </div>

              <span className="text-xs sm:text-sm font-semibold tracking-[0.2em] text-[#C59B27] uppercase">
                RECOGNITION BEHIND AIBASS
              </span>

              {/* Right Laurel SVG Line */}
              <div className="flex items-center gap-1.5 text-[#C59B27]">
                <svg className="w-4 h-4 text-[#C59B27]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 21C11.5 17 9 14 5 13C9 12 11.5 9 12 5C12.5 9 15 12 19 13C15 14 12.5 17 12 21Z" />
                </svg>
                <div className="w-8 sm:w-12 h-[1px] bg-gradient-to-l from-transparent to-[#C59B27]" />
              </div>
            </div>

            {/* Main Title */}
            <h2 className="text-xs sm:text-lg md:text-2xl lg:text-3xl xl:text-[36px] font-extrabold tracking-tight leading-normal text-slate-900 text-center whitespace-nowrap py-1">
              AI Company of the Year – <span className="text-[#0D9488]">Accounting Software 2026</span>
            </h2>
          </div>

          {/* Two Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Column: Award Image */}
            <div className="lg:col-span-6 flex items-center justify-center">
              <div className="relative w-full max-w-[480px] sm:max-w-[540px] lg:max-w-[580px] flex items-center justify-center">
                <img 
                  src={certificateImage} 
                  alt="AI Company of the Year Award - SiliconIndia Recognition" 
                  className="w-full h-auto object-contain mx-auto drop-shadow-md hover:scale-[1.01] transition-transform duration-300"
                />
              </div>
            </div>

            {/* Right Column: Text & Feature Items */}
            <div className="lg:col-span-6 space-y-6 flex flex-col justify-center text-left">
              
              {/* Industry Recognition Pill */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-50/80 border border-sky-200/80 text-sky-600 text-xs font-semibold w-fit shadow-sm">
                <Star className="h-3.5 w-3.5 text-sky-600 fill-sky-200/60 stroke-[2.2]" />
                <span>Industry Recognition</span>
              </div>

              {/* Description Paragraphs */}
              <div className="space-y-3.5">
                <p className="text-slate-800 text-base sm:text-lg leading-relaxed">
                  We're honored to be recognized by{" "}
                  <strong className="font-extrabold text-slate-950">SiliconIndia Magazine</strong>{" "}
                  as the{" "}
                  <strong className="font-extrabold text-slate-950">
                    AI Company of the Year – Accounting Software 2026.
                  </strong>
                </p>
                
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  This recognition celebrates our commitment to building intelligent, accessible and reliable accounting software that empowers businesses to work smarter and grow faster.
                </p>
              </div>

              {/* 3 Feature Items */}
              <div className="space-y-4 pt-1">
                
                {/* Feature 1 */}
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-full bg-sky-100/80 border border-sky-200/70 flex items-center justify-center text-sky-600 shrink-0 shadow-sm mt-0.5">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="9" />
                      <circle cx="12" cy="12" r="4" />
                      <path d="M12 3v2M12 19v2M3 12h2M19 12h2" />
                    </svg>
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                      AI-Powered Innovation
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                      Intelligent automation that simplifies complex accounting tasks.
                    </p>
                  </div>
                </div>

                {/* Feature 2 */}
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-full bg-sky-100/80 border border-sky-200/70 flex items-center justify-center text-sky-600 shrink-0 shadow-sm mt-0.5">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                      Built for Businesses
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                      Trusted by 10,000+ businesses across India to streamline finance.
                    </p>
                  </div>
                </div>

                {/* Feature 3 */}
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-full bg-sky-100/80 border border-sky-200/70 flex items-center justify-center text-sky-600 shrink-0 shadow-sm mt-0.5">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                      Future-Ready Finance
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                      Driving financial clarity and growth with AI & analytics.
                    </p>
                  </div>
                </div>

              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button 
                  onClick={() => window.dispatchEvent(new CustomEvent("openTrialModal"))}
                  className="rounded-full bg-white hover:bg-sky-50 border border-slate-300 text-slate-800 font-semibold px-6 py-2.5 text-sm inline-flex items-center gap-2 transition-all shadow-sm group hover:border-slate-400"
                >
                  <span>Explore AIBASS</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 text-slate-700" />
                </button>
              </div>

            </div>

          </div>

        </div>

        {/* Bottom Sub-Card (DPIIT, AI & ML, Compliance) */}
        <div className="mt-6 bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-[0_10px_30px_rgba(0,0,0,0.02)] grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-slate-100">
          
          {/* Segment 1: DPIIT Recognized Startup */}
          <div className="flex items-center gap-4 pr-0 md:pr-4 pt-2 md:pt-0">
            {/* DPIIT / Emblem Image */}
            <div className="w-16 sm:w-20 h-16 sm:h-20 shrink-0 flex items-center justify-center">
              <img 
                src="/images/download 1.png" 
                alt="DPIIT Recognized Startup Emblem" 
                className="w-14 sm:w-16 h-auto max-h-16 sm:max-h-20 object-contain"
              />
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-black text-slate-900 text-base leading-none tracking-tight">DPIIT</span>
              </div>
              <h5 className="font-bold text-slate-700 text-xs mt-0.5 leading-tight">
                Recognized Startup
              </h5>
              <p className="text-[11px] text-slate-500 font-normal leading-tight mt-1">
                Department for Promotion of Industry and Internal Trade, Government of India
              </p>
            </div>
          </div>

          {/* Segment 2: AI & Machine Learning */}
          <div className="flex items-center gap-4 px-0 md:px-5 pt-4 md:pt-0">
            <img 
              src="/images/fi_6784655.png" 
              alt="AI & Machine Learning Icon" 
              className="w-12 sm:w-14 h-12 sm:h-14 object-contain shrink-0" 
            />
            <div>
              <h5 className="font-bold text-[#0D9488] text-sm sm:text-base leading-snug">
                AI & Machine Learning
              </h5>
              <p className="text-xs text-slate-500 font-medium leading-relaxed mt-0.5">
                Built on advanced AI & ML technologies for smarter financial operations.
              </p>
            </div>
          </div>

          {/* Segment 3: Trusted & Compliant */}
          <div className="flex items-center gap-4 pl-0 md:pl-5 pt-4 md:pt-0">
            <img 
              src="/images/fi_5643496.png" 
              alt="Trusted & Compliant Icon" 
              className="w-12 sm:w-14 h-12 sm:h-14 object-contain shrink-0" 
            />
            <div>
              <h5 className="font-bold text-[#2563EB] text-sm sm:text-base leading-snug">
                Trusted & Compliant
              </h5>
              <p className="text-xs text-slate-500 font-medium leading-relaxed mt-0.5">
                Your data is secure with enterprise-grade security and compliance.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
