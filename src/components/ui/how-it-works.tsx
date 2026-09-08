import React from "react";
import { LazyMotion, domAnimation, m } from "framer-motion";

interface CardProps {
  number: string;
  title: string;
  description: string;
  colorTheme?: "orange" | "blue" | "purple" | "emerald" | "amber" | "indigo";
  className?: string;
  rotate?: string;
  colors?: {
    bg: string;
    text: string;
    border: string;
  };
}

const Pin = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M16 3a1 1 0 0 1 .117 1.993l-.117 .007v4.764l1.894 3.789a1 1 0 0 1 .1 .331l.006 .116v2a1 1 0 0 1 -.883 .993l-.117 .007h-4v4a1 1 0 0 1 -1.993 .117l-.007 -.117v-4h-4a1 1 0 0 1 -.993 -.883l-.007 -.117v-2a1 1 0 0 1 .06 -.34l.046 -.107l1.894 -3.791v-4.762a1 1 0 0 1 -.117 -1.993l.117 -.007h8z" />
  </svg>
);

const Card = ({
  number,
  title,
  description,
  colorTheme = "blue",
  className,
  rotate,
  colors: customColors,
}: CardProps) => {
  const defaultBgColors: Record<string, string> = {
    orange: "bg-orange-50/90",
    blue: "bg-blue-50/90",
    purple: "bg-purple-50/90",
    emerald: "bg-emerald-50/90",
    amber: "bg-amber-50/90",
    indigo: "bg-indigo-50/90",
  };
  const defaultTextColors: Record<string, string> = {
    orange: "text-orange-500",
    blue: "text-blue-600",
    purple: "text-purple-600",
    emerald: "text-emerald-600",
    amber: "text-amber-600",
    indigo: "text-indigo-600",
  };
  const defaultBorderColors: Record<string, string> = {
    orange: "border-orange-200/80",
    blue: "border-blue-200/80",
    purple: "border-purple-200/80",
    emerald: "border-emerald-200/80",
    amber: "border-amber-200/80",
    indigo: "border-indigo-200/80",
  };

  const bgColor = customColors?.bg || defaultBgColors[colorTheme] || defaultBgColors.blue;
  const textColor = customColors?.text || defaultTextColors[colorTheme] || defaultTextColors.blue;
  const borderColor = customColors?.border || defaultBorderColors[colorTheme] || defaultBorderColors.blue;

  return (
    <div
      className={`relative w-full md:w-[310px] transition-transform duration-300 hover:z-30 hover:scale-105 ${rotate || ""} ${className || ""}`}
    >
      <div className="bg-white p-2.5 rounded-[25px] shadow-[0px_10px_25px_0px_rgba(0,0,0,0.07)] border border-slate-200/80 hover:shadow-xl transition-all">
        <Pin className={`w-7 h-7 ${textColor} z-20 mb-3 mx-auto drop-shadow-xs`} />
        <div
          className={`${bgColor} border ${borderColor} rounded-[16px] p-4 sm:p-5 h-full flex flex-col relative overflow-hidden`}
        >
          <span
            className={`${textColor} text-3xl sm:text-4xl font-extrabold mb-2.5 tracking-tight`}
            style={{
              fontFamily: '"Outfit", "Inter", sans-serif',
            }}
          >
            {number}
          </span>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug mb-1.5">
            {title}
          </h3>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export interface Step {
  title: string;
  description: string;
  colorTheme?: "orange" | "blue" | "purple" | "emerald" | "amber" | "indigo";
  colors?: {
    bg: string;
    text: string;
    border: string;
  };
}

export interface StepPosition {
  className?: string;
  rotate?: string;
}

export interface HowItWorksProps {
  features?: Step[];
  className?: string;
  stepPositions?: StepPosition[];
}

// Evenly spaced positions with 450px vertical step so left and right cards both have generous, balanced breathing room
const DEFAULT_CARD_POSITIONS: StepPosition[] = [
  { className: "md:absolute md:top-0 md:left-[12%]", rotate: "rotate-3" },
  { className: "md:absolute md:top-[225px] md:right-[12%]", rotate: "-rotate-3" },
  { className: "md:absolute md:top-[450px] md:left-[12%]", rotate: "rotate-3" },
  { className: "md:absolute md:top-[675px] md:right-[12%]", rotate: "-rotate-3" },
  { className: "md:absolute md:top-[900px] md:left-[12%]", rotate: "rotate-3" },
  { className: "md:absolute md:top-[1125px] md:right-[12%]", rotate: "-rotate-3" },
  { className: "md:absolute md:top-[1350px] md:left-[12%]", rotate: "rotate-3" },
  { className: "md:absolute md:top-[1575px] md:right-[12%]", rotate: "-rotate-3" },
  { className: "md:absolute md:top-[1800px] md:left-[12%]", rotate: "rotate-3" },
  { className: "md:absolute md:top-[2025px] md:right-[12%]", rotate: "-rotate-3" },
];

export function HowItWorks({
  features,
  className,
  stepPositions,
}: HowItWorksProps) {
  const defaultFeatures: Step[] = [
    {
      title: "Use Your Bookkeeping Data",
      description:
        "AIBASS works with relevant financial information available within your bookkeeping records as the foundation for forecasting.",
      colorTheme: "indigo",
    },
    {
      title: "Analyse Financial Activity",
      description:
        "Available bookkeeping information is analysed to understand the financial position of the business.",
      colorTheme: "blue",
    },
    {
      title: "Estimate Future Cash Availability",
      description:
        "AIBASS generates AI driven cash flow predictions based on the available bookkeeping information.",
      colorTheme: "purple",
    },
    {
      title: "Identify Potential Cash Pressure",
      description:
        "Forecast information helps reveal periods where available cash may become tighter compared with upcoming requirements.",
      colorTheme: "amber",
    },
    {
      title: "Keep Forecasts Updated",
      description:
        "When bookkeeping records change, the cash flow forecast updates automatically without manual rebuilding.",
      colorTheme: "emerald",
    },
    {
      title: "Review the Period You Need",
      description:
        "Forecast cash flow for periods of up to one year and use custom forecast periods for specific planning requirements.",
      colorTheme: "orange",
    },
  ];

  const data = features && features.length > 0 ? features : defaultFeatures;
  const count = data.length;
  const positions = stepPositions || DEFAULT_CARD_POSITIONS;

  // Compute container height with comfortable bottom clearance
  const height =
    count <= 1
      ? 380
      : count <= 2
      ? 560
      : count <= 4
      ? 980
      : count <= 6
      ? 1420
      : count <= 8
      ? 1880
      : 2350;

  return (
    <LazyMotion features={domAnimation}>
      <div
        className={`bg-transparent py-8 md:py-12 px-4 sm:px-8 relative ${className || ""}`}
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(#000 1px, transparent 1px)",
            backgroundSize: "100% 32px",
            marginTop: "4px",
          }}
        ></div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div
            className="relative w-full max-w-[950px] mx-auto flex flex-col space-y-8 md:space-y-0 md:block"
            style={{ height: `${height}px` }}
          >
            {data.length > 1 && (
              <svg
                className="absolute top-0 left-0 w-full h-full pointer-events-none hidden md:block z-0"
                viewBox={`0 0 1000 ${height}`}
                preserveAspectRatio="none"
              >
                {(() => {
                  let pathD = "";
                  for (let i = 0; i < count - 1; i++) {
                    const isEven = i % 2 === 0;
                    const x1 = isEven ? 275 : 725;
                    const y1 = isEven
                      ? Math.floor(i / 2) * 450 + 110
                      : Math.floor(i / 2) * 450 + 335;

                    const nextIsEven = (i + 1) % 2 === 0;
                    const x2 = nextIsEven ? 275 : 725;
                    const y2 = nextIsEven
                      ? Math.floor((i + 1) / 2) * 450 + 110
                      : Math.floor((i + 1) / 2) * 450 + 335;

                    if (i === 0) {
                      pathD += `M ${x1} ${y1} C 500 ${y1}, 500 ${y2}, ${x2} ${y2}`;
                    } else {
                      pathD += ` C 500 ${y1}, 500 ${y2}, ${x2} ${y2}`;
                    }
                  }
                  return (
                    <m.path
                      d={pathD}
                      stroke="currentColor"
                      className="text-indigo-200"
                      strokeWidth="2.5"
                      strokeDasharray="8 6"
                      fill="none"
                      strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                      initial={{ strokeDashoffset: 0 }}
                      animate={{
                        strokeDashoffset: -140,
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  );
                })()}
              </svg>
            )}

            {data.map((step, index) => {
              const position = positions[index % positions.length];
              const stepNumber = index + 1 < 10 ? `0${index + 1}` : `${index + 1}`;

              return (
                <Card
                  key={`${step.title}-${index}`}
                  number={stepNumber}
                  title={step.title}
                  description={step.description}
                  colorTheme={step.colorTheme || "blue"}
                  colors={step.colors}
                  rotate={position.rotate}
                  className={position.className}
                />
              );
            })}
          </div>
        </div>
      </div>
    </LazyMotion>
  );
}

export default HowItWorks;
