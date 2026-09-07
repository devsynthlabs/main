import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  ArrowUp,
  Award,
  BarChart3,
  Building2,
  CheckCircle2,
  Clock,
  Database,
  Lock,
  Shield,
  Sparkles,
  TrendingUp,
  Users,
  X,
  Zap,
  Menu,
} from "lucide-react";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import HeroSection from "@/components/HeroSection";
import FirstSection from "@/components/FirstSection";
import { AiAccountingRecognition } from "@/components/AiAccountingRecognition";
import SecondSection from "@/components/SecondSection";
import ThirdSection from "@/components/ThirdSection";
import FourthSection from "@/components/FourthSection";
import FifthSection from "@/components/FifthSection";
import SixthSection from "@/components/SixthSection";
import SeventhSection from "@/components/SeventhSection";
import FaqSection from "@/components/FaqSection";
import EighthSection from "@/components/EighthSection";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { TrialFormModal } from "@/components/TrialFormModal";

type Stat = {
  icon: JSX.Element;
  value: string;
  label: string;
};

const fallbackFeatures = [
  "AI-assisted bookkeeping with clean audit trails",
  "Payroll, tax, and GST workflows in one secure workspace",
  "Real-time financial dashboards for leadership teams",
  "Automated reconciliation with exception detection",
  "Enterprise-grade access control and encrypted records",
  "Fast reporting for profit, cash flow, and compliance",
];

const fallbackStats: Stat[] = [
  { icon: <TrendingUp className="h-7 w-7" />, value: "42%", label: "faster month-end close" },
  { icon: <Users className="h-7 w-7" />, value: "10k+", label: "business users supported" },
  { icon: <BarChart3 className="h-7 w-7" />, value: "99.9%", label: "workflow uptime target" },
];

const Index = () => {
  const navigate = useNavigate();
  const [showDemo, setShowDemo] = useState(false);
  const [features, setFeatures] = useState<string[]>(fallbackFeatures);
  const [stats, setStats] = useState<Stat[]>(fallbackStats);

  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
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

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  useEffect(() => {
    fetch(`${API_BASE_URL}/dashboard`)
      .then((res) => res.json())
      .then((data) => {
        if (data.features?.length) {
          setFeatures(data.features);
        }

        if (data.stats?.length) {
          const mappedStats = data.stats.map((stat: { value: string; label: string }, index: number) => {
            const icons = [
              <TrendingUp key="trend" className="h-7 w-7" />,
              <Users key="users" className="h-7 w-7" />,
              <BarChart3 key="chart" className="h-7 w-7" />,
            ];

            return {
              icon: icons[index % icons.length],
              value: stat.value,
              label: stat.label,
            };
          });
          setStats(mappedStats);
        }
      })
      .catch((err) => console.error("Error fetching dashboard data:", err));
  }, []);

  const highlights = [
    { icon: Shield, title: "Bank-Level Security", desc: "Encrypted financial records" },
    { icon: Zap, title: "Real-Time AI", desc: "Fast operational insight" },
    { icon: Lock, title: "Compliance Ready", desc: "Built for regulated teams" },
    { icon: Clock, title: "Always Available", desc: "Reliable finance workspace" },
  ];

  const benefits = [
    { icon: Database, title: "Unified Data Layer", desc: "Finance, payroll, tax, and inventory data stay connected." },
    { icon: Award, title: "Executive Polish", desc: "Clear reporting surfaces designed for confident decisions." },
    { icon: Users, title: "Team Ready", desc: "A secure shared workspace for accountants and operators." },
  ];

  return (
    <div className="min-h-screen w-full bg-white relative overflow-hidden text-slate-950">
      {/* Light Sky Blue Glow */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none" 
        style={{
          backgroundImage: `
            radial-gradient(circle at center, #a5cfffff, transparent)
          `,
        }} 
      />
      {showDemo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-2xl"
        >
          <motion.div
            initial={{ scale: 0.94, opacity: 0, y: 24 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 24 }}
            transition={{ type: "spring", stiffness: 240, damping: 24 }}
            className="liquid-panel relative w-full max-w-4xl rounded-[36px] p-4 shadow-[0_30px_90px_rgba(15,23,42,0.32)] sm:p-6"
          >
            <Button
              onClick={() => setShowDemo(false)}
              aria-label="Close demo"
              className="absolute -right-3 -top-3 z-50 h-11 w-11 rounded-full border border-white/45 bg-white/45 p-0 text-slate-900 shadow-lg backdrop-blur-xl hover:bg-white/70"
            >
              <X className="h-5 w-5" />
            </Button>

            <div className="relative overflow-hidden rounded-[28px] bg-slate-950 pt-[56.25%] shadow-inner">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/L83KfmWD3Pg?si=et24Kysqr38PY2XI&autoplay=1"
                title="SHREE ANDAL AI SOFTWARE SOLUTIONS (OPC) PRIVATE LIMITED Demo"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="absolute left-0 top-0 h-full w-full"
              />
            </div>

            <div className="mt-6 text-center">
              <h3 className="text-2xl font-semibold tracking-tight text-slate-950">
                SHREE ANDAL AI SOFTWARE SOLUTIONS Demo
              </h3>
              <p className="mt-2 text-sm font-medium text-slate-655">
                A closer look at intelligent finance operations for modern businesses.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}

      <Header />
      <TrialFormModal />

      <main className="relative mx-auto max-w-7xl px-5 sm:px-6">
        <HeroSection onWatchDemo={() => window.dispatchEvent(new CustomEvent("openTrialModal"))} />
      </main>

      {/* Recognition Behind AIBASS Section */}
      <div id="overview" className="relative w-full mt-4">
        <AiAccountingRecognition />
      </div>

      {/* Full-width Second Section (Tell AIBASS What You Need) */}
      <div className="relative mx-auto max-w-7xl w-full px-4 sm:px-8 lg:px-12 mt-8">
        <SecondSection />
      </div>

      {/* Full-width First Section */}
      <div id="highlights" className="relative mx-auto max-w-[1380px] w-full px-4 sm:px-8 lg:px-12">
        <FirstSection onWatchDemo={() => window.dispatchEvent(new CustomEvent("openTrialModal"))} />
      </div>

      {/* Full-width Third Section */}
      <div id="features" className="relative mx-auto max-w-7xl w-full px-4 sm:px-8 lg:px-12 mt-2">
        <ThirdSection />
      </div>

      {/* Full-width Fourth Section */}
      <div id="how-it-works" className="relative mx-auto max-w-7xl w-full px-4 sm:px-8 lg:px-12 mt-12">
        <FourthSection />
      </div>

      {/* Full-width Fifth Section */}
      <div id="business" className="relative mx-auto max-w-7xl w-full px-4 sm:px-8 lg:px-12 mt-12">
        <FifthSection />
      </div>

      {/* Full-width Sixth Section */}
      <div id="why-choose" className="relative mx-auto max-w-7xl w-full px-4 sm:px-8 lg:px-12 mt-12">
        <SixthSection />
      </div>

      {/* Full-width Seventh Section */}
      <div id="pricing" className="relative mx-auto max-w-7xl w-full px-4 sm:px-8 lg:px-12 mt-12">
        <SeventhSection />
      </div>

      {/* Full-width FAQ Section */}
      <div className="relative mx-auto max-w-7xl w-full px-4 sm:px-8 lg:px-12 mt-12">
        <FaqSection />
      </div>

      {/* Full-width Eighth Section */}
      <div className="relative mx-auto max-w-7xl w-full px-4 sm:px-8 lg:px-12 mt-12 mb-24">
        <EighthSection />
      </div>

      <Footer />

      {/* Floating Scroll to Top Button */}
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

export default Index;
