import React from "react";

export const AiInvoicingRecognitionBanner = () => {
  return (
    <section className="py-6 sm:py-8 border-t border-slate-100/80 bg-transparent">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-[0_10px_35px_rgba(0,0,0,0.03)] grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-slate-200/70 items-center">
          
          {/* Column 1: Award */}
          <div className="flex items-center gap-4 pr-0 md:pr-4 pt-2 md:pt-0">
            <img 
              src="/images/Champ Cup.png" 
              alt="AI Company of the Year Trophy" 
              className="w-14 sm:w-16 lg:w-18 h-auto max-h-16 object-contain shrink-0" 
            />
            <div className="space-y-0.5">
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base leading-snug">
                AI Company of the Year <br className="hidden sm:inline" />
                <span className="text-slate-900">Accounting Software 2026</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium leading-normal">
                Recognized by SiliconIndia Magazine
              </p>
            </div>
          </div>

          {/* Column 2: DPIIT */}
          <div className="flex items-center gap-4 px-0 md:px-5 pt-5 md:pt-0">
            <img 
              src="/images/download 1.png" 
              alt="DPIIT Recognized Startup Emblem" 
              className="w-14 sm:w-16 lg:w-18 h-auto max-h-16 object-contain shrink-0"
            />
            <div className="space-y-0.5">
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base leading-snug">
                DPIIT Recognized Startup
              </h3>
              <p className="text-xs text-slate-500 font-medium leading-snug">
                Recognized by Department for Promotion of Industry and Internal Trade, Government of India.
              </p>
            </div>
          </div>

          {/* Column 3: AWS */}
          <div className="flex items-center gap-4 pl-0 md:pl-5 pt-5 md:pt-0">
            <img 
              src="/images/Amazon_Web_Services_Logo.svg 1.png" 
              alt="AWS Infrastructure Logo" 
              className="w-14 sm:w-16 lg:w-18 h-auto max-h-16 object-contain shrink-0"
            />
            <div className="space-y-0.5">
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base leading-snug">
                Built on AWS Infrastructure
              </h3>
              <p className="text-xs text-slate-500 font-medium leading-snug">
                AIBASS runs on AWS infrastructure to support its cloud-based accounting and invoicing workflows.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AiInvoicingRecognitionBanner;
