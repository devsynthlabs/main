import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Building2, ArrowRight, CheckCircle2, BarChart3, Users, TrendingUp, Shield, Zap, Lock, Clock, Database, Award, X } from "lucide-react";
import { motion } from "framer-motion";

const Index = () => {
  const navigate = useNavigate();
  const [showDemo, setShowDemo] = useState(false);

  // 🧠 State to store backend data
  const [features, setFeatures] = useState<string[]>([]);
  const [stats, setStats] = useState<{ icon: JSX.Element; value: string; label: string }[]>([]);
  const [testimonials, setTestimonials] = useState<{ name: string; role: string; feedback: string }[]>([]);


  // 🖥️ Fetch data from backend on component mount
  useEffect(() => {
    fetch(`${API_BASE_URL}/dashboard`)
      .then((res) => res.json())
      .then((data) => {
        if (data.features) setFeatures(data.features);

        if (data.stats) {
          const mappedStats = data.stats.map((stat: unknown, index: number) => {
            const icons = [<TrendingUp key={1} className="w-8 h-8" />, <Users key={2} className="w-8 h-8" />, <BarChart3 key={3} className="w-8 h-8" />];
            return {
              icon: icons[index % icons.length],
              value: stat.value,
              label: stat.label,
            };
          });
          setStats(mappedStats);
        }

        if (data.testimonials) setTestimonials(data.testimonials);
      })
      .catch((err) => console.error("Error fetching dashboard data:", err));
  }, []);

  const highlights = [
    { icon: Shield, title: "Bank-Level Security", desc: "256-bit encryption" },
    { icon: Zap, title: "Lightning Fast", desc: "Real-time processing" },
    { icon: Lock, title: "100% Compliant", desc: "Tax regulations" },
    { icon: Clock, title: "24/7 Support", desc: "Always available" }
  ];

  const benefits = [
    { icon: Database, title: "Automated Data Sync", desc: "Seamlessly integrate with your existing systems" },
    { icon: Award, title: "Award-Winning Platform", desc: "Recognized by industry leaders" },
    { icon: Users, title: "10,000+ Users", desc: "Trusted by businesses worldwide" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 relative overflow-hidden">
      {/* YouTube Demo Modal */}
      {showDemo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="relative bg-slate-900 rounded-3xl p-6 max-w-4xl w-full shadow-2xl border border-blue-400/30"
          >
            {/* Close Button */}
            <Button
              onClick={() => setShowDemo(false)}
              className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-2xl z-50 border-2 border-white/20"
            >
              <X className="w-5 h-5" />
            </Button>

            {/* Video Container */}
            <div className="relative pt-[56.25%] rounded-2xl overflow-hidden bg-black">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/L83KfmWD3Pg?si=et24Kysqr38PY2XI&autoplay=1"
                title="Financial Automation Platform Demo"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full rounded-2xl"
              />
            </div>

            {/* Video Info */}
            <div className="mt-6 text-center">
              <h3 className="text-2xl font-bold text-white mb-2">
                Financial Automation Platform Demo
              </h3>
              <p className="text-blue-200">
                See how our platform transforms financial management for businesses
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Responsive animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-[800px] h-[800px] bg-gradient-to-br from-blue-500/10 via-cyan-500/10 to-transparent rounded-full blur-3xl"
        ></div>
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
        <div className="absolute top-2/3 right-1/3 w-2 h-2 bg-cyan-400 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 left-2/3 w-2 h-2 bg-indigo-400 rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Header */}
      <header
        className="sticky top-0 z-50 border-b border-blue-400/20 bg-slate-900/50 backdrop-blur-xl shadow-2xl shadow-blue-500/20"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3 group"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/60 transform group-hover:rotate-12 transition-all duration-300">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(59,130,246,0.8)]">
                Financial Automation
              </h1>
              <p className="text-xs text-blue-300/70 font-bold">Powered by AI</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Button
              onClick={() => navigate("/auth")}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold px-6 shadow-2xl shadow-blue-500/60 hover:shadow-blue-500/80 hover:scale-[1.02] transition-all duration-300 border border-blue-400/30"
            >
              Sign In
            </Button>
          </motion.div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative max-w-7xl mx-auto px-6">
        <div className="text-center py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div
              className="inline-block mb-6 px-6 py-3 bg-white/5 backdrop-blur-xl border border-blue-400/20 rounded-full shadow-2xl shadow-blue-500/30 relative"
            >
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/80"></div>
              <span className="text-blue-300 text-sm font-bold">🚀 Now with AI-Powered Insights</span>
            </div>

            <h2 className="text-6xl md:text-7xl font-black mb-6 animate-in fade-in duration-1000">
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(59,130,246,0.9)]">
                Streamline Your
              </span>
              <br />
              <span className="text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">Financial Operations</span>
            </h2>

            <p className="text-xl text-blue-200/80 max-w-3xl mx-auto mb-12 leading-relaxed font-medium">
              Automate payroll, tax management, and financial reporting with AI-driven accuracy.
              Save time, reduce errors, and focus on growing your business.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
              <Button
                size="lg"
                onClick={() => navigate("/auth")}
                className="bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 hover:from-blue-700 hover:via-cyan-700 hover:to-blue-700 text-white font-black px-10 py-7 rounded-2xl shadow-2xl shadow-blue-500/60 hover:shadow-blue-500/80 hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 text-lg group border border-blue-400/30"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => setShowDemo(true)}
                className="border-2 border-blue-400/40 bg-white/5 backdrop-blur-xl text-blue-300 hover:bg-white/10 hover:text-white font-black px-10 py-7 rounded-2xl text-lg shadow-2xl shadow-blue-500/30 hover:-translate-y-1 transition-all duration-300"
              >
                Watch Demo
              </Button>
            </div>
          </motion.div>

          {/* Highlights Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto"
          >
            {highlights.map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-white/5 backdrop-blur-xl border border-blue-400/20 rounded-2xl p-6 shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <item.icon className="w-8 h-8 text-cyan-400 mx-auto mb-3 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
                <h4 className="font-bold text-white text-sm mb-2 relative z-10">{item.title}</h4>
                <p className="text-xs text-blue-300/70 relative z-10">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Features Section */}
        <div className="py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h3 className="text-5xl font-black text-white mb-4 drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]">
              Everything You Need to{" "}
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(59,130,246,0.9)]">
                Succeed
              </span>
            </h3>
            <p className="text-blue-200/80 text-lg font-medium">Powerful features designed for modern businesses</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.length > 0 ? (
              features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/40 to-cyan-600/40 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative bg-gradient-to-br from-blue-600/20 via-cyan-600/10 to-indigo-600/20 backdrop-blur-xl rounded-3xl p-8 shadow-2xl shadow-blue-500/30 border border-blue-400/20 hover:border-cyan-400/40 transition-all duration-300">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/60 group-hover:rotate-12 transition-transform duration-300">
                        <CheckCircle2 className="h-7 w-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-bold leading-relaxed drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">{feature}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent shadow-2xl shadow-blue-500/60"></div>
                <p className="text-blue-300 mt-6 font-bold">Loading features...</p>
              </div>
            )}
          </div>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="py-20"
        >
          <div
            className="bg-gradient-to-br from-blue-600/20 via-cyan-600/10 to-indigo-600/20 backdrop-blur-2xl rounded-3xl p-12 shadow-2xl border border-blue-400/30 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

            <div className="relative z-10">
              <h3 className="text-5xl font-black text-white text-center mb-4 drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]">Platform Performance</h3>
              <p className="text-blue-200/80 text-center mb-12 font-medium">Trusted by thousands of businesses worldwide</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {stats.length > 0 ? (
                  stats.map((stat, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      viewport={{ once: true }}
                      whileHover={{ y: -8, scale: 1.05 }}
                      className="bg-white/5 backdrop-blur-xl border border-blue-400/30 rounded-3xl p-10 text-center hover:bg-white/10 hover:border-cyan-400/50 transition-all duration-300 shadow-2xl shadow-blue-500/40 relative overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="flex justify-center mb-4 text-cyan-400 drop-shadow-[0_0_20px_rgba(34,211,238,0.8)] group-hover:scale-110 transition-transform duration-300 relative z-10">{stat.icon}</div>
                      <h4 className="text-6xl font-black text-white mb-3 drop-shadow-[0_0_30px_rgba(255,255,255,0.6)] relative z-10">{stat.value}</h4>
                      <p className="text-blue-200/80 font-bold relative z-10">{stat.label}</p>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full text-center">
                    <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-cyan-400 border-t-transparent shadow-2xl shadow-cyan-500/60"></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Benefits Section */}
        <div className="py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className="text-center group"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-blue-500/60 group-hover:shadow-blue-500/80 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300 border border-blue-400/30">
                  <benefit.icon className="w-10 h-10 text-white" />
                </div>
                <h4 className="text-2xl font-black text-white mb-3 drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]">{benefit.title}</h4>
                <p className="text-blue-200/80 font-medium">{benefit.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Testimonials Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="py-20"
        >
          <div
            className="bg-gradient-to-br from-blue-600/20 via-cyan-600/10 to-indigo-600/20 backdrop-blur-2xl rounded-3xl p-12 shadow-2xl border border-blue-400/30"
          >
            <h3 className="text-5xl font-black text-white text-center mb-4 drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]">What Our Clients Say</h3>
            <p className="text-blue-200/80 text-center mb-12 font-medium">Join thousands of satisfied customers</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.length > 0 ? (
                testimonials.map((t, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="bg-white/5 backdrop-blur-xl border border-blue-400/20 p-8 rounded-3xl hover:bg-white/10 hover:border-cyan-400/40 transition-all duration-300 shadow-2xl shadow-blue-500/30 relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="flex mb-4 relative z-10">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-5 h-5 text-yellow-400 fill-current drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]" viewBox="0 0 20 20">
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-white italic mb-6 leading-relaxed font-medium relative z-10">"{t.feedback}"</p>
                    <div className="flex items-center relative z-10">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mr-4 shadow-2xl shadow-blue-500/60">
                        <span className="text-white font-black text-xl">{t.name.charAt(0)}</span>
                      </div>
                      <div>
                        <h4 className="text-white font-bold">{t.name}</h4>
                        <p className="text-blue-200/70 text-sm">{t.role}</p>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center">
                  <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-cyan-400 border-t-transparent shadow-2xl shadow-cyan-500/60"></div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="py-20"
        >
          <div
            className="bg-gradient-to-r from-blue-600/30 via-cyan-600/20 to-indigo-600/30 backdrop-blur-2xl rounded-3xl p-16 text-center shadow-2xl border border-blue-400/30 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent animate-pulse"></div>
            <div className="relative z-10">
              <h3 className="text-5xl md:text-6xl font-black text-white mb-6 drop-shadow-[0_0_40px_rgba(255,255,255,0.6)]">
                Ready to Transform Your Finances?
              </h3>
              <p className="text-xl text-blue-200/80 mb-10 max-w-2xl mx-auto font-medium">
                Join thousands of businesses already saving time and money with our platform
              </p>
              <Button
                size="lg"
                onClick={() => navigate("/auth")}
                className="bg-white hover:bg-blue-50 text-blue-600 font-black px-12 py-7 rounded-2xl shadow-2xl shadow-white/30 hover:shadow-white/50 text-lg group hover:-translate-y-2 hover:scale-[1.05] transition-all duration-300"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
              </Button>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer
        className="border-t border-blue-400/20 bg-slate-900/80 backdrop-blur-xl mt-20"
      >
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4 group">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-2xl shadow-blue-500/60 group-hover:rotate-12 transition-transform duration-300">
                  <Building2 className="h-5 w-5 text-white" />
                </div>
                <h4 className="font-black text-white">Financial Automation</h4>
              </div>
              <p className="text-blue-200/70 text-sm font-medium">Empowering businesses with intelligent financial solutions.</p>
            </div>
            <div>
              <h5 className="font-bold text-white mb-3">Product</h5>
              <ul className="space-y-2 text-sm text-blue-200/70 font-medium">
                <li className="hover:text-cyan-400 cursor-pointer transition-colors duration-300">Features</li>
                <li className="hover:text-cyan-400 cursor-pointer transition-colors duration-300">Pricing</li>
                <li className="hover:text-cyan-400 cursor-pointer transition-colors duration-300">Security</li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-white mb-3">Company</h5>
              <ul className="space-y-2 text-sm text-blue-200/70 font-medium">
                <li className="hover:text-cyan-400 cursor-pointer transition-colors duration-300">About</li>
                <li className="hover:text-cyan-400 cursor-pointer transition-colors duration-300">Blog</li>
                <li className="hover:text-cyan-400 cursor-pointer transition-colors duration-300">Careers</li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-white mb-3">Support</h5>
              <ul className="space-y-2 text-sm text-blue-200/70 font-medium">
                <li className="hover:text-cyan-400 cursor-pointer transition-colors duration-300">Help Center</li>
                <li className="hover:text-cyan-400 cursor-pointer transition-colors duration-300">Contact</li>
                <li className="hover:text-cyan-400 cursor-pointer transition-colors duration-300">Status</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-blue-400/20 pt-8 text-center">
            <p className="text-blue-200/60 text-sm font-medium">
              © 2025 Financial Automation Platform. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;