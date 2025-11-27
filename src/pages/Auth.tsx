import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Building2, CreditCard, Lock, Mail, Shield, CheckCircle2, Sparkles, ArrowRight, Crown, Infinity, Zap } from "lucide-react";
import { API_ENDPOINTS, apiRequest } from "@/lib/api";

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  modal: {
    ondismiss: () => void;
  };
  theme: {
    color: string;
  };
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: {
    plan?: string;
    planName?: string;
  };
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open: () => void;
    };
  }
}

// Subscription Plans Configuration
const subscriptionPlans = {
  monthly: {
    id: "monthly",
    name: "Monthly Subscription",
    price: 1500,
    gst: 270,
    totalAmount: 1770,
    duration: "month",
    description: "Perfect for getting started",
    features: [
      "All basic features",
      "Email support",
      "1GB storage",
      "Basic analytics",
      "Up to 10 employees"
    ],
    icon: Zap,
    popular: false
  },
  annual: {
    id: "annual",
    name: "Annual Subscription",
    price: 16200,
    originalPrice: 18000,
    gst: 2916,
    totalAmount: 19116,
    duration: "year",
    description: "Best value - Save 10%",
    features: [
      "All premium features",
      "Priority support",
      "10GB storage",
      "Advanced analytics",
      "Custom reports",
      "Up to 50 employees"
    ],
    icon: Crown,
    popular: true,
    savings: "Save ₹1,800"
  },
  lifetime: {
    id: "lifetime",
    name: "Lifetime Access",
    price: 45000,
    gst: 8100,
    totalAmount: 53100,
    duration: "lifetime",
    description: "One-time payment, forever access",
    features: [
      "All features included",
      "24/7 priority support",
      "Unlimited storage",
      "Advanced analytics",
      "Custom reports",
      "Unlimited employees",
      "Free updates forever"
    ],
    icon: Infinity,
    popular: false,
    savings: "Best long-term value"
  }
};

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("signin");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorTrail, setCursorTrail] = useState<Array<{ id: number, x: number, y: number, size: number, delay: number }>>([]);
  const [isHovering, setIsHovering] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<keyof typeof subscriptionPlans>("monthly");

  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpName, setSignUpName] = useState("");

  // 🖱️ Enhanced mouse tracking with trail effect
  useEffect(() => {
    let trailId = 0;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });

      // Create multiple trail particles
      const newTrails = [];
      for (let i = 0; i < 3; i++) {
        const trail = {
          id: trailId++,
          x: e.clientX + (Math.random() - 0.5) * 20,
          y: e.clientY + (Math.random() - 0.5) * 20,
          size: Math.random() * 8 + 4,
          delay: i * 50,
        };
        newTrails.push(trail);
      }

      setCursorTrail((prev) => [...prev, ...newTrails].slice(-30));

      // Remove trails after animation
      setTimeout(() => {
        setCursorTrail((prev) => prev.filter((t) => !newTrails.find(nt => nt.id === t.id)));
      }, 800);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiRequest(API_ENDPOINTS.SIGNIN, {
        method: "POST",
        body: JSON.stringify({ email: signInEmail, password: signInPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      localStorage.setItem("token", data.token);
      toast({
        title: "Welcome! 🎉",
        description: "Login successful! Redirecting to dashboard..."
      });
      setSignInEmail("");
      setSignInPassword("");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!signUpEmail || !signUpPassword) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill all fields"
      });
      return;
    }

    setPaymentLoading(true);

    try {
      const orderRes = await apiRequest(API_ENDPOINTS.CREATE_ORDER, {
        method: "POST",
        body: JSON.stringify({
          email: signUpEmail,
          plan: selectedPlan
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.message);

      console.log('📦 Order Data Received:', {
        orderId: orderData.orderId,
        amount: orderData.amount,
        amountInRupees: orderData.amount / 100,
        plan: selectedPlan,
        planDetails: subscriptionPlans[selectedPlan]
      });

      if (orderData.devMode) {
        try {
          setLoading(true);
          const verifyRes = await apiRequest(API_ENDPOINTS.VERIFY_PAYMENT, {
            method: "POST",
            body: JSON.stringify({
              razorpay_order_id: orderData.orderId,
              razorpay_payment_id: "dev_payment_" + Date.now(),
              razorpay_signature: "dev_signature",
              email: signUpEmail,
              password: signUpPassword,
            }),
          });

          const verifyData = await verifyRes.json();
          if (!verifyRes.ok) throw new Error(verifyData.message);

          localStorage.setItem("token", verifyData.token);
          toast({
            title: "Success! 🚀",
            description: `Account created with ${subscriptionPlans[selectedPlan].name} plan! Welcome aboard!`,
          });
          setTimeout(() => navigate("/dashboard"), 1500);
          return;
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : "Development signup failed";
          toast({
            variant: "destructive",
            title: "Development Mode Error",
            description: errorMessage,
          });
          return;
        } finally {
          setLoading(false);
          setPaymentLoading(false);
        }
      }

      const options: RazorpayOptions = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Financial Automation",
        description: `${subscriptionPlans[selectedPlan].name} - ₹${subscriptionPlans[selectedPlan].totalAmount}`,
        order_id: orderData.orderId,
        handler: async function (response: RazorpayResponse) {
          try {
            setLoading(true);
            const verifyRes = await apiRequest(API_ENDPOINTS.VERIFY_PAYMENT, {
              method: "POST",
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                email: signUpEmail,
                password: signUpPassword,
                plan: selectedPlan,
                name: signUpName || signUpEmail.split('@')[0]
              }),
            });

            const verifyData = await verifyRes.json();
            if (!verifyRes.ok) throw new Error(verifyData.message);

            localStorage.setItem("token", verifyData.token);
            toast({
              title: "Welcome! 🎉",
              description: `Payment successful! Your ${subscriptionPlans[selectedPlan].name} account has been created.`,
            });
            setTimeout(() => navigate("/dashboard"), 1500);
          } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Payment verification failed";
            toast({
              variant: "destructive",
              title: "Payment Verification Failed",
              description: errorMessage,
            });
          } finally {
            setLoading(false);
            setPaymentLoading(false);
          }
        },
        modal: {
          ondismiss: function () {
            setPaymentLoading(false);
            toast({
              variant: "destructive",
              title: "Payment Cancelled",
              description: "Signup process was cancelled",
            });
          },
        },
        prefill: {
          name: signUpName || signUpEmail.split('@')[0],
          email: signUpEmail,
        },
        notes: {
          plan: selectedPlan,
          planName: subscriptionPlans[selectedPlan].name
        },
        theme: {
          color: "#3B82F6",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      toast({ variant: "destructive", title: "Error", description: errorMessage });
      setPaymentLoading(false);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const features = [
    { icon: Shield, text: "Bank-level security" },
    { icon: CheckCircle2, text: "Instant activation" },
    { icon: Sparkles, text: "All features included" },
    { icon: Shield, text: "Bank-level encryption" } // Added new security feature
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 p-4 relative overflow-hidden">
      {/* Enhanced Custom Cursor - Always on top with higher z-index */}
      <div
        className="fixed pointer-events-none z-[99999]"
        style={{
          left: mousePosition.x,
          top: mousePosition.y,
          transform: 'translate(-50%, -50%)',
        }}
      >
        {/* Main cursor dot */}
        <div className="relative">
          {/* Outer rotating ring */}
          <div className="absolute inset-0 w-10 h-10 -translate-x-1/2 -translate-y-1/2">
            <div className="w-full h-full border-2 border-cyan-400/60 rounded-full animate-spin" style={{ animationDuration: '3s' }}>
              <div className="absolute top-0 left-1/2 w-1 h-1 bg-cyan-400 rounded-full -translate-x-1/2"></div>
            </div>
          </div>

          {/* Middle pulsing ring */}
          <div className="absolute inset-0 w-8 h-8 -translate-x-1/2 -translate-y-1/2">
            <div className="w-full h-full border-2 border-blue-400/80 rounded-full animate-pulse"></div>
          </div>

          {/* Inner glow */}
          <div className="absolute inset-0 w-6 h-6 -translate-x-1/2 -translate-y-1/2 bg-cyan-400/30 rounded-full blur-md"></div>

          {/* Center dot */}
          <div className={`absolute inset-0 w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-200 ${isHovering ? 'bg-yellow-400 scale-150' : 'bg-cyan-400'
            }`}></div>

          {/* Crosshair lines */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="absolute w-16 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent -translate-x-1/2"></div>
            <div className="absolute h-16 w-[2px] bg-gradient-to-b from-transparent via-cyan-400 to-transparent -translate-y-1/2"></div>
          </div>
        </div>
      </div>

      {/* Cursor Trail Particles */}
      {cursorTrail.map((trail) => (
        <div
          key={trail.id}
          className="fixed pointer-events-none z-[99998] animate-[trail_0.8s_ease-out_forwards]"
          style={{
            left: trail.x,
            top: trail.y,
            width: trail.size,
            height: trail.size,
            animationDelay: `${trail.delay}ms`,
          }}
        >
          <div className="w-full h-full bg-gradient-to-br from-cyan-400 via-blue-400 to-indigo-400 rounded-full blur-[2px] shadow-lg shadow-cyan-400/50"></div>
        </div>
      ))}

      <style>{`
        @keyframes trail {
          0% {
            transform: scale(1) translateY(0);
            opacity: 0.8;
          }
          100% {
            transform: scale(0) translateY(-40px);
            opacity: 0;
          }
        }
        
        * {
          cursor: none !important;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes tabSwitch {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .tab-switch-animation {
          animation: tabSwitch 0.3s ease-out forwards;
        }
      `}</style>

      {/* Animated background elements with glow effects */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] opacity-50 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] opacity-50 animate-pulse" style={{ animationDelay: '1s' }}></div>

      {/* Mouse-responsive background */}
      <div
        className="absolute w-[800px] h-[800px] bg-blue-500/20 rounded-full blur-3xl transition-all duration-1000 pointer-events-none"
        style={{
          top: mousePosition.y / 20 - 400,
          left: mousePosition.x / 20 - 400,
        }}
      ></div>

      {/* Decorative shapes with ping animation */}
      <div className="absolute top-20 right-20 w-20 h-20 border-4 border-blue-400/30 rounded-lg rotate-45 opacity-60 animate-ping" style={{ animationDuration: '3s' }}></div>
      <div className="absolute bottom-40 left-20 w-16 h-16 border-4 border-cyan-300/30 rounded-full opacity-60 animate-ping" style={{ animationDuration: '4s' }}></div>

      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Left Side - Branding & Info */}
        <div className="hidden md:block space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
          <div>
            <div
              className="flex items-center space-x-3 mb-6 animate-in fade-in slide-in-from-left-4 duration-500"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/60 transform hover:scale-110 hover:rotate-12 transition-all duration-300">
                <Building2 className="h-8 w-8 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(59,130,246,0.8)]">
                  Financial Automation
                </h1>
                <p className="text-blue-200 text-sm">Powered by AI Technology</p>
              </div>
            </div>

            <h2 className="text-4xl font-bold text-white mb-4 animate-in fade-in slide-in-from-left-6 duration-700 drop-shadow-[0_0_20px_rgba(59,130,246,0.6)]">
              Transform Your <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Financial Management</span>
            </h2>
            <p className="text-blue-100 text-lg leading-relaxed animate-in fade-in slide-in-from-left-8 duration-900">
              Automate payroll, tax calculations, and financial reporting with our intelligent platform. Save time, reduce errors, and focus on growing your business.
            </p>
          </div>

          {/* Features List with glass morphism */}
          <div className="space-y-4">
            {features.map((feature, i) => (
              <div
                key={i}
                className="flex items-center space-x-3 bg-white/5 backdrop-blur-xl rounded-xl p-4 shadow-2xl shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-2 hover:scale-[1.02] transition-all duration-300 border border-blue-400/20 animate-in fade-in slide-in-from-left duration-500 group"
                style={{ animationDelay: `${(i + 1) * 100}ms` }}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-[0_0_20px_rgba(59,130,246,0.4)] group-hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] group-hover:rotate-12 transition-all duration-300">
                  <feature.icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-blue-100 font-medium">{feature.text}</span>
              </div>
            ))}
          </div>

          {/* Trust Indicators with gradient glow */}
          <div
            className="bg-gradient-to-r from-indigo-500 to-blue-700 rounded-2xl p-6 text-white animate-in fade-in slide-in-from-left-4 duration-700 shadow-2xl shadow-blue-500/40 backdrop-blur-xl hover:-translate-y-2 transition-all duration-300"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl font-bold drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">10,000+</span>
              <span className="text-2xl font-bold drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">99.9%</span>
            </div>
            <div className="flex items-center justify-between text-blue-100 text-sm">
              <span>Active Users</span>
              <span>Uptime</span>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form with glass morphism */}
        <Card
          className="w-full bg-white/10 backdrop-blur-2xl shadow-[0_20px_60px_rgba(59,130,246,0.4)] border border-blue-400/30 rounded-3xl overflow-hidden animate-in fade-in slide-in-from-right-8 duration-700 hover:shadow-[0_20px_80px_rgba(59,130,246,0.6)] transition-all duration-500"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <CardHeader className="text-center space-y-4 pt-10 pb-6 bg-gradient-to-br from-white/5 to-transparent animate-in fade-in zoom-in-95 duration-500">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/60 transform hover:scale-110 hover:rotate-12 transition-all duration-300">
              <Building2 className="h-10 w-10 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
            </div>
            <div>
              <CardTitle className="text-3xl font-bold text-white drop-shadow-[0_0_20px_rgba(59,130,246,0.6)]">
                Welcome Back
              </CardTitle>
              <CardDescription className="text-blue-200 text-base mt-2">
                Sign in to access your dashboard
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="px-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList
                className="grid w-full grid-cols-2 mb-8 bg-white/5 backdrop-blur-xl rounded-xl p-1.5 border border-blue-400/20"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                <TabsTrigger
                  value="signin"
                  className="text-blue-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white rounded-lg font-semibold transition-all data-[state=active]:shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:scale-105 duration-300"
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                >
                  Sign In
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="text-blue-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white rounded-lg font-semibold transition-all data-[state=active]:shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:scale-105 duration-300"
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>

              {/* Sign In Form */}
              <TabsContent value="signin" className="tab-switch-animation">
                <form onSubmit={handleSignIn} className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-blue-100 font-semibold flex items-center gap-2">
                      <Mail className="w-4 h-4 text-cyan-300" />
                      Email Address
                    </Label>
                    <Input
                      type="email"
                      value={signInEmail}
                      onChange={(e) => setSignInEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="bg-white/10 backdrop-blur-xl text-white placeholder-blue-300 border-2 border-blue-400/30 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/20 rounded-xl h-12 px-4 transition-all"
                      required
                      onMouseEnter={() => setIsHovering(true)}
                      onMouseLeave={() => setIsHovering(false)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-blue-100 font-semibold flex items-center gap-2">
                      <Lock className="w-4 h-4 text-cyan-300" />
                      Password
                    </Label>
                    <Input
                      type="password"
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="bg-white/10 backdrop-blur-xl text-white placeholder-blue-300 border-2 border-blue-400/30 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/20 rounded-xl h-12 px-4 transition-all"
                      required
                      onMouseEnter={() => setIsHovering(true)}
                      onMouseLeave={() => setIsHovering(false)}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-6 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] transition-all hover:-translate-y-1"
                    disabled={loading}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Signing In...
                      </>
                    ) : (
                      <>
                        Sign In
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>

              {/* Sign Up Form */}
              <TabsContent value="signup" className="tab-switch-animation">
                <form onSubmit={handleSignUp} className="space-y-6">
                  {/* Subscription Plans Selection */}
                  <div className="space-y-4">
                    <Label className="text-blue-100 font-semibold">Choose Your Plan</Label>
                    <div className="grid gap-3">
                      {(Object.entries(subscriptionPlans) as Array<[keyof typeof subscriptionPlans, typeof subscriptionPlans[keyof typeof subscriptionPlans]]>).map(([key, plan]) => {
                        const PlanIcon = plan.icon;
                        return (
                          <div
                            key={key}
                            className={`relative p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer hover:scale-[1.02] ${selectedPlan === key
                              ? 'border-cyan-400 bg-cyan-500/20 shadow-[0_0_20px_rgba(34,211,238,0.3)]'
                              : 'border-blue-400/30 bg-white/5 hover:border-blue-400/60'
                              }`}
                            onClick={() => setSelectedPlan(key)}
                            onMouseEnter={() => setIsHovering(true)}
                            onMouseLeave={() => setIsHovering(false)}
                          >
                            {plan.popular && (
                              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-3 py-1 rounded-full font-semibold shadow-lg">
                                  Most Popular
                                </span>
                              </div>
                            )}
                            {plan.discount && (
                              <div className="absolute -top-2 right-4">
                                <span className="bg-gradient-to-r from-green-400 to-green-600 text-white text-xs px-2 py-1 rounded-full font-semibold">
                                  {plan.discount}
                                </span>
                              </div>
                            )}

                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${selectedPlan === key
                                  ? 'bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.5)]'
                                  : 'bg-blue-500/30'
                                  }`}>
                                  <PlanIcon className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                  <h3 className="font-semibold text-white">{plan.name}</h3>
                                  <p className="text-blue-200 text-sm">{plan.description}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-2xl font-bold text-white">₹{plan.totalAmount.toLocaleString()}</div>
                                <div className="text-blue-200 text-sm">
                                  {plan.duration === 'lifetime' ? 'One-time' : `per ${plan.duration}`}
                                </div>
                              </div>
                            </div>

                            <div className="text-xs text-blue-200 mt-2">
                              ₹{plan.price.toLocaleString()} + ₹{plan.gst.toLocaleString()} GST
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-blue-100 font-semibold flex items-center gap-2">
                      <Mail className="w-4 h-4 text-cyan-300" />
                      Email Address
                    </Label>
                    <Input
                      type="email"
                      value={signUpEmail}
                      onChange={(e) => setSignUpEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="bg-white/10 backdrop-blur-xl text-white placeholder-blue-300 border-2 border-blue-400/30 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/20 rounded-xl h-12 px-4 transition-all"
                      required
                      onMouseEnter={() => setIsHovering(true)}
                      onMouseLeave={() => setIsHovering(false)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-blue-100 font-semibold flex items-center gap-2">
                      <Lock className="w-4 h-4 text-cyan-300" />
                      Password
                    </Label>
                    <Input
                      type="password"
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                      placeholder="Create a strong password"
                      className="bg-white/10 backdrop-blur-xl text-white placeholder-blue-300 border-2 border-blue-400/30 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/20 rounded-xl h-12 px-4 transition-all"
                      required
                      onMouseEnter={() => setIsHovering(true)}
                      onMouseLeave={() => setIsHovering(false)}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-6 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] transition-all hover:-translate-y-1"
                    disabled={loading || paymentLoading}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                  >
                    {paymentLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Processing Payment...
                      </>
                    ) : loading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <CreditCard className="mr-2 h-5 w-5" />
                        Pay ₹{subscriptionPlans[selectedPlan].totalAmount.toLocaleString()} & Create Account
                      </>
                    )}
                  </Button>

                  <p className="text-center text-xs text-blue-300">
                    By signing up, you agree to our{" "}
                    <a href="#" className="text-cyan-300 hover:underline">Terms of Service</a>
                    {" "}and{" "}
                    <a href="#" className="text-cyan-300 hover:underline">Privacy Policy</a>
                  </p>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;