import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Sparkles, Menu, X, ChevronDown, FileText, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [productDropdownOpen, setProductDropdownOpen] = useState(false);
  const [mobileProductOpen, setMobileProductOpen] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProductDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isIndexPage = location.pathname === "/ai-accounting-software";

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
              className="text-xs font-bold text-slate-700 hover:text-slate-950 transition-colors uppercase tracking-[0.15em]"
            >
              Features
            </a>
            <a 
              href={isIndexPage ? "#business" : (location.pathname === "/" ? "#industries-section" : "/#industries-section")} 
              className="text-xs font-bold text-slate-700 hover:text-slate-950 transition-colors uppercase tracking-[0.15em] whitespace-nowrap"
            >
              Industries
            </a>
            <a 
              href={isIndexPage ? "#pricing" : (location.pathname === "/" ? "#pricing-section" : "/#pricing-section")} 
              className="text-xs font-bold text-slate-700 hover:text-slate-950 transition-colors uppercase tracking-[0.15em]"
            >
              Pricing
            </a>

            {/* Product Dropdown */}
            <div 
              className="relative" 
              ref={dropdownRef}
              onMouseEnter={() => setProductDropdownOpen(true)}
              onMouseLeave={() => setProductDropdownOpen(false)}
            >
              <button
                onClick={() => setProductDropdownOpen((prev) => !prev)}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-950 transition-colors uppercase tracking-[0.15em] focus:outline-none py-1 cursor-pointer"
              >
                <span>Product</span>
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${
                    productDropdownOpen ? "rotate-180 text-slate-950" : "text-slate-500"
                  }`}
                />
              </button>

              <AnimatePresence>
                {productDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="absolute right-0 top-full mt-2 w-max min-w-[290px] rounded-2xl border border-slate-200/80 bg-white/95 p-2 shadow-2xl backdrop-blur-xl z-50"
                  >
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => {
                          setProductDropdownOpen(false);
                          navigate("/ai-invoicing-software");
                        }}
                        className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-left transition-all hover:bg-indigo-50/70 group cursor-pointer"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-100/70 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors shadow-xs">
                          <FileText className="h-4 w-4" />
                        </div>
                        <span className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors whitespace-nowrap">
                          AI Invoicing Software Product Page
                        </span>
                      </button>

                      <button
                        onClick={() => {
                          setProductDropdownOpen(false);
                          navigate("/product");
                        }}
                        className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-left transition-all hover:bg-emerald-50/70 group cursor-pointer"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100/70 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors shadow-xs">
                          <BookOpen className="h-4 w-4" />
                        </div>
                        <span className="text-xs font-bold text-slate-900 group-hover:text-emerald-600 transition-colors whitespace-nowrap">
                          AIBASS AI Bookkeeping Software Product Page
                        </span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
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
                  className="text-xs font-extrabold text-slate-700 hover:text-slate-950 transition-colors uppercase tracking-[0.15em]"
                >
                  Features
                </a>
                <a
                  href={isIndexPage ? "#business" : (location.pathname === "/" ? "#industries-section" : "/#industries-section")}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs font-extrabold text-slate-700 hover:text-slate-950 transition-colors uppercase tracking-[0.15em]"
                >
                  Industries
                </a>
                <a
                  href={isIndexPage ? "#pricing" : (location.pathname === "/" ? "#pricing-section" : "/#pricing-section")}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs font-extrabold text-slate-700 hover:text-slate-950 transition-colors uppercase tracking-[0.15em]"
                >
                  Pricing
                </a>

                {/* Mobile Product Accordion */}
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setMobileProductOpen((prev) => !prev)}
                    className="flex items-center justify-between text-xs font-extrabold text-slate-700 hover:text-slate-950 transition-colors uppercase tracking-[0.15em] py-1 text-left"
                  >
                    <span>Product</span>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${
                        mobileProductOpen ? "rotate-180 text-slate-950" : "text-slate-400"
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {mobileProductOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden pl-3 flex flex-col gap-2 border-l-2 border-slate-200/80 ml-1 py-1"
                      >
                        <button
                          onClick={() => {
                            setMobileMenuOpen(false);
                            navigate("/ai-invoicing-software");
                          }}
                          className="flex items-center gap-2.5 text-xs font-bold text-slate-800 hover:text-indigo-600 py-1.5 text-left cursor-pointer"
                        >
                          <FileText className="h-4 w-4 text-indigo-600 shrink-0" />
                          <span>AI Invoicing Software Product Page</span>
                        </button>
                        <button
                          onClick={() => {
                            setMobileMenuOpen(false);
                            navigate("/product");
                          }}
                          className="flex items-center gap-2.5 text-xs font-bold text-slate-800 hover:text-emerald-600 py-1.5 text-left cursor-pointer"
                        >
                          <BookOpen className="h-4 w-4 text-emerald-600 shrink-0" />
                          <span>AIBASS AI Bookkeeping Software Product Page</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <a
                  href={isIndexPage ? "#features" : (location.pathname === "/" ? "#features-section" : "/#features-section")}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs font-extrabold text-slate-700 hover:text-slate-950 transition-colors uppercase tracking-[0.15em]"
                >
                  Features
                </a>
                <a
                  href={isIndexPage ? "#business" : (location.pathname === "/" ? "#industries-section" : "/#industries-section")}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs font-extrabold text-slate-700 hover:text-slate-950 transition-colors uppercase tracking-[0.15em]"
                >
                  Industries
                </a>
                <a
                  href={isIndexPage ? "#pricing" : (location.pathname === "/" ? "#pricing-section" : "/#pricing-section")}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs font-extrabold text-slate-700 hover:text-slate-950 transition-colors uppercase tracking-[0.15em]"
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
