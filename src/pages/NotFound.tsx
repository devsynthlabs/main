import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  LayoutDashboard, 
  LogIn, 
  FileQuestion, 
  ExternalLink,
  ShieldAlert
} from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, [location.pathname]);

  return (
    <div className="relative min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col justify-between overflow-hidden selection:bg-indigo-500 selection:text-white">
      {/* Background subtle gradients and decorative glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[650px] h-[650px] bg-indigo-600/15 rounded-full blur-[140px]" />
        <div className="absolute -bottom-40 right-10 w-[450px] h-[450px] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-25" />
      </div>

      {/* Top Simple Brand Bar */}
      <header className="relative z-10 w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/20">
            A
          </div>
          <span className="text-lg font-bold tracking-tight text-white">
            AIBASS <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 ml-1">Software</span>
          </span>
        </div>

        <a 
          href="https://saaiss.in" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full border border-white/10"
        >
          <span>Main Website</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </header>

      {/* Main 404 Content Card */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="max-w-xl w-full text-center"
        >
          {/* 404 Badge & Graphic */}
          <div className="relative inline-flex items-center justify-center mb-6">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="relative flex items-center justify-center h-24 w-24 rounded-3xl bg-gradient-to-b from-slate-800 to-slate-900/90 border border-slate-700/80 shadow-2xl shadow-indigo-950/50"
            >
              <FileQuestion className="h-12 w-12 text-indigo-400" />
            </motion.div>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <ShieldAlert className="h-3.5 w-3.5" />
            404 Error • Route Not Found
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            Page Not Found
          </h1>

          <p className="text-slate-400 text-base sm:text-lg max-w-md mx-auto mb-6 leading-relaxed">
            The route you are trying to access does not exist, has been removed, or is not part of the software application.
          </p>

          {/* Requested Path Callout */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400 font-mono mb-8 max-w-full overflow-hidden text-ellipsis">
            <span className="text-slate-500">Path:</span>
            <span className="text-amber-400 font-semibold">{location.pathname}</span>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Button
              onClick={() => navigate(isAuthenticated ? "/dashboard" : "/auth")}
              className="w-full sm:w-auto h-11 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {isAuthenticated ? (
                <>
                  <LayoutDashboard className="h-4 w-4" />
                  Go to Dashboard
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  Go to Sign In
                </>
              )}
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                if (window.history.length > 1) {
                  navigate(-1);
                } else {
                  navigate(isAuthenticated ? "/dashboard" : "/auth");
                }
              }}
              className="w-full sm:w-auto h-11 px-6 rounded-xl border-slate-700/80 bg-slate-900/60 hover:bg-slate-800 text-slate-200 hover:text-white font-medium text-sm flex items-center justify-center gap-2 transition-all"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Button>
          </div>
        </motion.div>
      </main>

      {/* Footer info */}
      <footer className="relative z-10 w-full max-w-6xl mx-auto px-6 py-6 text-center text-xs text-slate-600 border-t border-slate-900">
        <p>© {new Date().getFullYear()} AIBASS Software. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default NotFound;
