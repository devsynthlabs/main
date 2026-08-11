import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Sparkles, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  const isIndexPage = location.pathname === "/ai-accounting-software";
  const homeLink = isIndexPage ? "/" : "/ai-accounting-software";
  const linkPrefix = isIndexPage ? "" : "/ai-accounting-software";

  return (
    <motion.header
      variants={{
        visible: { y: 0, opacity: 1 },
        hidden: { y: -100, opacity: 0 }
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed inset-x-0 top-4 z-50 mx-auto max-w-6xl px-4 sm:px-6"
    >
      <div className="flex flex-col rounded-2xl border border-white/40 bg-white/65 shadow-[0_8px_30px_rgba(15,23,42,0.08)] backdrop-blur-xl transition-all duration-350">
        
        {/* Header main row */}
        <div className="flex items-center justify-between px-4 py-3">
          
          {/* Logo */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate("/")}>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl overflow-hidden shadow-sm">
              <img src="/brand-logo.png" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">AIBASS</span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6">
            <a 
              href={isIndexPage ? "#features" : (location.pathname === "/" ? "#features-section" : "/#features-section")} 
              className="text-xs font-bold text-slate-655 hover:text-slate-950 transition-colors uppercase tracking-[0.15em]"
            >
              Features
            </a>
            <a 
              href={isIndexPage ? "#business" : (location.pathname === "/" ? "#industries-section" : "/#industries-section")} 
              className="text-xs font-bold text-slate-655 hover:text-slate-950 transition-colors uppercase tracking-[0.15em] whitespace-nowrap"
            >
              Industries
            </a>
            <a 
              href={isIndexPage ? "#pricing" : (location.pathname === "/" ? "#pricing-section" : "/#pricing-section")} 
              className="text-xs font-bold text-slate-655 hover:text-slate-950 transition-colors uppercase tracking-[0.15em]"
            >
              Pricing
            </a>
          </nav>

          {/* Action Button & Hamburger */}
          <div className="flex items-center gap-3">
            <Button
              onClick={() => window.dispatchEvent(new CustomEvent("openTrialModal"))}
              className="hidden lg:flex h-10 items-center rounded-full bg-slate-950 px-5 text-sm font-semibold text-white shadow-md transition-transform hover:-translate-y-0.5 hover:bg-slate-800"
            >
              Get Started
            </Button>

            {/* Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-750 hover:text-slate-950 hover:bg-slate-100/40 focus:outline-none transition-colors"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>

        {/* Mobile menu dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden lg:hidden"
            >
              <div className="flex flex-col gap-3.5 px-6 pb-6 pt-2 border-t border-slate-150/40">

                <a
                  href={isIndexPage ? "#features" : (location.pathname === "/" ? "#features-section" : "/#features-section")}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs font-extrabold text-slate-655 hover:text-slate-950 transition-colors uppercase tracking-[0.15em]"
                >
                  Features
                </a>
                <a
                  href={isIndexPage ? "#business" : (location.pathname === "/" ? "#industries-section" : "/#industries-section")}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs font-extrabold text-slate-655 hover:text-slate-950 transition-colors uppercase tracking-[0.15em]"
                >
                  Industries
                </a>
                <a
                  href={isIndexPage ? "#pricing" : (location.pathname === "/" ? "#pricing-section" : "/#pricing-section")}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs font-extrabold text-slate-655 hover:text-slate-950 transition-colors uppercase tracking-[0.15em]"
                >
                  Pricing
                </a>
                
                <div className="h-px bg-slate-200/50 my-1" />
                
                <div className="flex items-center">
                  <Button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      window.dispatchEvent(new CustomEvent("openTrialModal"));
                    }}
                    className="w-full h-10 rounded-full bg-slate-950 text-sm font-semibold text-white shadow hover:bg-slate-800"
                  >
                    Get Started
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </motion.header>
  );
};
export default Header;
