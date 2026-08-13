import React from "react";

const LaurelTrophyIcon = () => (
  <svg 
    className="w-12 h-12 sm:w-14 sm:h-14 text-indigo-600 shrink-0" 
    viewBox="0 0 64 64" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Laurel Wreath Left */}
    <path 
      d="M18 46C13 41 11 34 13 26C10 23 9 17 12 11C16 16 16 22 19 26C20 18 24 12 28 7C26 15 24 22 22 28" 
      stroke="#6366F1" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path d="M13 36C9 31 10 24 14 18" stroke="#6366F1" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M17 24C14 18 16 12 21 8" stroke="#6366F1" strokeWidth="2.5" strokeLinecap="round"/>
    
    {/* Laurel Wreath Right */}
    <path 
      d="M46 46C51 41 53 34 51 26C54 23 55 17 52 11C48 16 48 22 45 26C44 18 40 12 36 7C38 15 40 22 42 28" 
      stroke="#6366F1" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path d="M51 36C55 31 54 24 50 18" stroke="#6366F1" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M47 24C50 18 48 12 43 8" stroke="#6366F1" strokeWidth="2.5" strokeLinecap="round"/>
    
    {/* Trophy Cup */}
    <path 
      d="M23 18H41V29C41 33.9706 36.9706 38 32 38C27.0294 38 23 33.9706 23 29V18Z" 
      stroke="#6366F1" 
      strokeWidth="2.8" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path d="M23 22H19C17.3431 22 16 23.3431 16 25V26C16 28.7614 18.2386 31 21 31H23" stroke="#6366F1" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M41 22H45C46.6569 22 48 23.3431 48 25V26C48 28.7614 45.7614 31 43 31H41" stroke="#6366F1" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M32 38V47M24 47H40" stroke="#6366F1" strokeWidth="3" strokeLinecap="round"/>
    <circle cx="32" cy="25" r="2" fill="#6366F1"/>
  </svg>
);

export const AiInvoicingRecognitionBanner = () => {
  return (
    <section className="py-6 sm:py-8 border-t border-slate-100/80 bg-transparent">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-[0_10px_35px_rgba(0,0,0,0.03)] grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-slate-200/70 items-center">
          
          {/* Column 1: Award */}
          <div className="flex items-center gap-4 pr-0 md:pr-4 pt-2 md:pt-0">
            <LaurelTrophyIcon />
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
              className="w-12 sm:w-14 lg:w-16 h-auto max-h-16 object-contain shrink-0"
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
              src="/images/icons8-amazon-aws-24.png" 
              alt="AWS Infrastructure Logo" 
              className="w-12 sm:w-14 lg:w-16 h-auto max-h-14 object-contain shrink-0"
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
