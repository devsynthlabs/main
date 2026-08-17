import {
  useScroll,
  useTransform,
  motion,
} from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

export interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

interface TimelineProps {
  data: TimelineEntry[];
  title?: React.ReactNode;
  description?: React.ReactNode;
  tag?: string;
}

export const Timeline = ({
  data,
  title,
  description,
  tag,
}: TimelineProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div
      className="w-full bg-white font-sans md:px-6"
      ref={containerRef}
    >
      {(title || description || tag) ? (
        <div className="max-w-7xl mx-auto py-12 md:py-16 px-4 md:px-8 text-center space-y-4">
          {tag && (
            <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-widest block">
              {tag}
            </span>
          )}
          {title && (
            typeof title === "string" ? (
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-950 max-w-4xl mx-auto">
                {title}
              </h2>
            ) : (
              title
            )
          )}
          {description && (
            typeof description === "string" ? (
              <p className="text-sm sm:text-base font-medium text-slate-700 max-w-2xl mx-auto leading-relaxed">
                {description}
              </p>
            ) : (
              description
            )
          )}
        </div>
      ) : (
        <div className="max-w-7xl mx-auto py-20 px-4 md:px-8 lg:px-10">
          <h2 className="text-lg md:text-4xl mb-4 text-black dark:text-white max-w-4xl">
            Changelog from my journey
          </h2>
          <p className="text-neutral-700 dark:text-neutral-300 text-sm md:text-base max-w-sm">
            I&apos;ve been working on Aceternity for the past 2 years. Here&apos;s
            a timeline of my journey.
          </p>
        </div>
      )}

      <div ref={ref} className="relative max-w-7xl mx-auto pb-20">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex justify-start pt-10 md:pt-28 md:gap-10"
          >
            <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full">
              <div className="h-10 absolute left-3 md:left-3 w-10 rounded-full bg-white flex items-center justify-center shadow-md border border-slate-200">
                <div className="h-4 w-4 rounded-full bg-indigo-100 border border-indigo-300 p-2 flex items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-indigo-600" />
                </div>
              </div>
              <h3 className="hidden md:block text-xl md:pl-20 md:text-3xl lg:text-4xl font-extrabold text-slate-400 group-hover:text-slate-900 transition-colors">
                {item.title}
              </h3>
            </div>

            <div className="relative pl-20 pr-4 md:pl-4 w-full">
              <h3 className="md:hidden block text-xl mb-4 text-left font-bold text-slate-500">
                {item.title}
              </h3>
              {item.content}
            </div>
          </div>
        ))}
        <div
          style={{
            height: height + "px",
          }}
          className="absolute md:left-8 left-8 top-0 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-slate-200 to-transparent to-[99%] [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]"
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0 w-[2px] bg-gradient-to-t from-indigo-600 via-blue-500 to-transparent from-[0%] via-[10%] rounded-full shadow-[0_0_8px_rgba(79,70,229,0.6)]"
          />
        </div>
      </div>
    </div>
  );
};
