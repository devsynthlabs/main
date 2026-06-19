import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Building2, CreditCard, Lock, Mail, Shield, CheckCircle2, Sparkles, ArrowRight, Crown, Infinity as InfinityIcon, Zap, BarChart3 } from "lucide-react";
import { VoiceButton } from "@/components/ui/VoiceButton";
import { API_ENDPOINTS, apiRequest } from "@/lib/api";
import { isTrialExpired } from "@/lib/trial";
import { motion } from "framer-motion";


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
type SubscriptionPlan = {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  gst: number;
  totalAmount: number;
  duration: string;
  description: string;
  features: string[];
  icon: typeof Zap;
  popular: boolean;
  savings?: string;
  trialDays?: number;
};

const subscriptionPlans = {
  trial: {
    id: "trial",
    name: "30-Day Free Trial",
    price: 0,
    gst: 0,
    totalAmount: 0,
    duration: "30 days",
    description: "Start now and explore the platform free for 30 days",
    features: [
      "All core dashboard features",
      "Database-backed trial access",
      "Auto-logout after 30 days",
      "Upgrade to paid plan anytime",
    ],
    icon: Sparkles,
    popular: false,
    savings: "Free for 30 days",
    trialDays: 30,
  },
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
    icon: InfinityIcon,
    popular: false,
    savings: "Best long-term value"
  }
} satisfies Record<string, SubscriptionPlan>;

type PlanKey = keyof typeof subscriptionPlans;

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("signin");

  const [selectedPlan, setSelectedPlan] = useState<PlanKey>("monthly");

  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpName, setSignUpName] = useState("");



  // Load Razorpay script
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    const plan = params.get("plan") as PlanKey | null;

    if (tab === "signup" || tab === "signin") {
      setActiveTab(tab);
    }

    if (plan && plan in subscriptionPlans) {
      setSelectedPlan(plan);
      if (plan === "trial") {
        setActiveTab("signup");
      }
    }
  }, [location.search]);

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

      if (isTrialExpired(data.user)) {
        toast({
          variant: "destructive",
          title: "Free trial ended",
          description: "Your trial is over. Please choose a paid plan to continue.",
        });
        setActiveTab("signup");
        setSelectedPlan("monthly");
        return;
      }

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
      if (selectedPlan === "trial") {
        setLoading(true);
        const trialRes = await apiRequest(API_ENDPOINTS.SIGNUP_TRIAL, {
          method: "POST",
          body: JSON.stringify({
            email: signUpEmail,
            password: signUpPassword,
            name: signUpName || signUpEmail.split("@")[0],
          }),
        });

        const trialData = await trialRes.json();
        if (!trialRes.ok) throw new Error(trialData.message);

        localStorage.setItem("token", trialData.token);
        setLoading(false);
        setPaymentLoading(false);
        toast({
          title: "Free trial started",
          description: "Your 30-day trial is active. Redirecting to dashboard...",
        });
        setTimeout(() => navigate("/dashboard"), 1500);
        return;
      }

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
        name: "SHREE ANDAL AI SOFTWARE SOLUTIONS (OPC) PRIVATE LIMITED",
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

  const planEntries = Object.entries(subscriptionPlans) as Array<[PlanKey, SubscriptionPlan]>;
  const selectedPlanData = subscriptionPlans[selectedPlan];
  const features = [
    { icon: Shield, text: "Bank-grade security" },
    { icon: CheckCircle2, text: "Instant activation" },
    { icon: Sparkles, text: "Premium onboarding" },
    { icon: BarChart3, text: "Live finance intelligence" },
  ];
  const trustCards = [
    { label: "Protected sessions", value: "256-bit" },
    { label: "Support response", value: "24/7" },
    { label: "Activation speed", value: "< 2 min" },
  ];

  const floatingSignals = [
    { label: "Status", value: "Secure", className: "top-24 left-8 hidden xl:flex" },
    { label: "Latency", value: "Fast", className: "bottom-28 left-14 hidden xl:flex" },
    { label: "Access", value: "Managed", className: "top-36 right-10 hidden xl:flex" },
    { label: "Invoice AI", value: "Auto-matched", className: "top-56 left-20 hidden 2xl:flex" },
    { label: "GST Status", value: "Ready to file", className: "top-52 right-24 hidden 2xl:flex" },
    { label: "Tax Alert", value: "No issues", className: "bottom-44 right-8 hidden xl:flex" },
    { label: "Plan Sync", value: "Active", className: "bottom-16 left-32 hidden 2xl:flex" },
  ];

  return (
    <div className="auth-page relative min-h-screen overflow-hidden text-slate-950">
      <div className="auth-orb auth-orb-a pointer-events-none" />
      <div className="auth-orb auth-orb-b pointer-events-none" />
      <div className="auth-grid-overlay pointer-events-none" />

      {floatingSignals.map((signal, index) => (
        <motion.div
          key={signal.label}
          initial={{ opacity: 0, scale: 0.94, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
          transition={{
            opacity: { delay: 0.3 + index * 0.08, duration: 0.35 },
            scale: { delay: 0.3 + index * 0.08, duration: 0.35 },
            y: { delay: index * 0.25, duration: 4, repeat: Infinity, ease: "easeInOut" },
          }}
          className={`auth-floating-chip fixed z-[1] hidden items-center gap-3 rounded-[24px] px-4 py-3 xl:flex ${signal.className}`}
        >
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_18px_rgba(16,185,129,0.6)]" />
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">{signal.label}</p>
            <p className="text-sm font-semibold text-slate-950">{signal.value}</p>
          </div>
        </motion.div>
      ))}

      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 pb-6 pt-5 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="auth-logo flex h-12 w-12 items-center justify-center rounded-[18px]">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-tight text-slate-950 sm:text-base">
              SHREE ANDAL AI SOFTWARE SOLUTIONS
            </h1>
            <p className="text-xs font-medium text-slate-600">Secure finance access and subscription management</p>
          </div>
        </div>

        <div className="hidden items-center gap-3 rounded-full border border-white/70 bg-white/55 px-3 py-2 shadow-[0_16px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl md:flex">
          <Shield className="h-4 w-4 text-sky-700" />
          <span className="text-xs font-semibold text-slate-700">Enterprise-grade authentication</span>
        </div>
      </header>

      <main className="relative z-10 mx-auto grid max-w-7xl gap-8 px-5 pb-14 pt-2 sm:px-6 lg:grid-cols-[1fr_0.95fr] lg:items-start lg:gap-10">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="space-y-8 pt-6 lg:pt-12"
        >
          <div className="max-w-2xl">
            <div className="auth-pill inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-600">
              <Sparkles className="h-4 w-4 text-sky-700" />
              Andal-inspired access experience
            </div>
            <h2 className="mt-6 text-5xl font-semibold tracking-tight text-slate-950 md:text-6xl lg:text-7xl">
              Calm, premium access for modern finance teams.
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              Sign in or create an account with a design that feels clean, refined, and intentionally simple.
              Pricing is handled through distinct glass cards so each plan feels clear and separate.
            </p>
          </div>

          <div className="grid max-w-2xl gap-4 sm:grid-cols-3">
            {trustCards.map((card, index) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 + 0.12 }}
                className="auth-metric rounded-[28px] p-5"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{card.label}</p>
                <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">{card.value}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid max-w-2xl gap-4 sm:grid-cols-2">
            {features.map((feature, index) => (
              <motion.div
                key={feature.text}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + index * 0.06 }}
                className="auth-feature flex items-center gap-3 rounded-[24px] p-4"
              >
                <div className="auth-feature-icon flex h-11 w-11 shrink-0 items-center justify-center rounded-[16px]">
                  <feature.icon className="h-5 w-5 text-slate-900" />
                </div>
                <span className="text-sm font-semibold text-slate-700">{feature.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.1 }}
          className="lg:pt-6"
        >
          <Card className="auth-panel overflow-hidden rounded-[36px] border-white/70 bg-white/78 shadow-[0_35px_90px_rgba(15,23,42,0.14)] backdrop-blur-2xl">
            <CardHeader className="space-y-3 border-b border-slate-200/70 bg-white/35 px-8 py-8">
              <div className="flex items-center gap-3">
                <div className="auth-logo flex h-12 w-12 items-center justify-center rounded-[18px]">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-semibold tracking-tight text-slate-950">
                    Access your account
                  </CardTitle>
                  <CardDescription className="mt-1 text-sm text-slate-600">
                    Sign in or create a subscription in a single clean surface.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="px-8 py-8">
              <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                <TabsList className="grid h-12 w-full grid-cols-2 rounded-full bg-slate-100 p-1">
                  <TabsTrigger
                    value="signin"
                    className="rounded-full text-sm font-semibold text-slate-600 transition-all data-[state=active]:bg-white data-[state=active]:text-slate-950 data-[state=active]:shadow-[0_10px_30px_rgba(15,23,42,0.08)]"
                  >
                    Sign In
                  </TabsTrigger>
                  <TabsTrigger
                    value="signup"
                    className="rounded-full text-sm font-semibold text-slate-600 transition-all data-[state=active]:bg-white data-[state=active]:text-slate-950 data-[state=active]:shadow-[0_10px_30px_rgba(15,23,42,0.08)]"
                  >
                    Sign Up
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="signin" className="mt-8 space-y-6">
                  <form onSubmit={handleSignIn} className="space-y-5">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <Mail className="h-4 w-4 text-sky-700" />
                        Email Address
                      </Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="email"
                          value={signInEmail}
                          onChange={(e) => setSignInEmail(e.target.value)}
                          placeholder="you@example.com"
                          className="h-12 rounded-[16px] border-slate-200 bg-white/90 text-slate-950 placeholder:text-slate-400 focus-visible:ring-sky-500"
                          required
                        />
                        <VoiceButton
                          onTranscript={(text) => setSignInEmail(text)}
                          onClear={() => setSignInEmail("")}
                          language="en-US"
                          size="md"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <Lock className="h-4 w-4 text-sky-700" />
                        Password
                      </Label>
                      <Input
                        type="password"
                        value={signInPassword}
                        onChange={(e) => setSignInPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="h-12 rounded-[16px] border-slate-200 bg-white/90 text-slate-950 placeholder:text-slate-400 focus-visible:ring-sky-500"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="h-12 w-full rounded-full bg-slate-950 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(15,23,42,0.16)] transition-all hover:-translate-y-0.5 hover:bg-slate-800"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Signing In
                        </>
                      ) : (
                        <>
                          Sign In
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup" className="mt-8 space-y-6">
                  <div className="rounded-[26px] border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Free trial</p>
                        <p className="mt-1 text-base font-semibold text-slate-950">Start 30 days free, then upgrade when ready.</p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        className="rounded-full border-slate-200 bg-white px-4 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                        onClick={() => setSelectedPlan("trial")}
                      >
                        Use Trial
                      </Button>
                    </div>
                  </div>

                  <div className="auth-selected-plan rounded-[26px] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                          Selected plan
                        </p>
                        <p className="mt-1 text-lg font-semibold text-slate-950">{selectedPlanData.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-semibold text-slate-950">₹{selectedPlanData.totalAmount.toLocaleString()}</p>
                        <p className="text-xs text-slate-500">
                          {selectedPlanData.duration === "lifetime" ? "One-time" : `per ${selectedPlanData.duration}`}
                        </p>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleSignUp} className="space-y-5">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <Mail className="h-4 w-4 text-sky-700" />
                        Email Address
                      </Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="email"
                          value={signUpEmail}
                          onChange={(e) => setSignUpEmail(e.target.value)}
                          placeholder="you@example.com"
                          className="h-12 rounded-[16px] border-slate-200 bg-white/90 text-slate-950 placeholder:text-slate-400 focus-visible:ring-sky-500"
                          required
                        />
                        <VoiceButton
                          onTranscript={(text) => setSignUpEmail(text)}
                          onClear={() => setSignUpEmail("")}
                          language="en-US"
                          size="md"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <Lock className="h-4 w-4 text-sky-700" />
                        Password
                      </Label>
                      <Input
                        type="password"
                        value={signUpPassword}
                        onChange={(e) => setSignUpPassword(e.target.value)}
                        placeholder="Create a strong password"
                        className="h-12 rounded-[16px] border-slate-200 bg-white/90 text-slate-950 placeholder:text-slate-400 focus-visible:ring-sky-500"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="h-12 w-full rounded-full bg-slate-950 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(15,23,42,0.16)] transition-all hover:-translate-y-0.5 hover:bg-slate-800"
                      disabled={loading || paymentLoading}
                    >
                      {paymentLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing Payment
                        </>
                      ) : loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating Account
                        </>
                      ) : selectedPlan === "trial" ? (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" />
                          Start 30-Day Free Trial
                        </>
                      ) : (
                        <>
                          <CreditCard className="mr-2 h-4 w-4" />
                          Pay ₹{selectedPlanData.totalAmount.toLocaleString()} & Create Account
                        </>
                      )}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.section>
      </main>

      <section className="relative z-10 mx-auto max-w-7xl px-5 pb-14 sm:px-6">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">Pricing</p>
            <h3 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
              Choose a plan that feels as clear as the interface.
            </h3>
          </div>
          <p className="hidden max-w-md text-sm text-slate-600 md:block">
            Each plan is shown as its own card so pricing stays readable, distinct, and easy to compare.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-4">
          {planEntries.map(([key, plan], index) => {
            const PlanIcon = plan.icon;
            const active = selectedPlan === key;

            return (
              <motion.button
                key={key}
                type="button"
                onClick={() => setSelectedPlan(key)}
                initial={{ opacity: 0, y: 18 }}
                animate={{
                  opacity: 1,
                  y: active ? -6 : 0,
                  scale: active ? 1.015 : 1,
                  boxShadow: active
                    ? "0 0 0 1px rgba(14,165,233,0.35), 0 24px 64px rgba(14,165,233,0.26), 0 0 36px rgba(56,189,248,0.22)"
                    : "0 18px 50px rgba(15,23,42,0.08)",
                }}
                transition={{ delay: index * 0.08 }}
                whileHover={{ y: active ? -8 : -4, scale: active ? 1.02 : 1.01 }}
                whileTap={{ scale: 0.99 }}
                className={`auth-pricing-card text-left ${active ? "auth-pricing-card-active" : ""}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className={`auth-plan-icon ${active ? "auth-plan-icon-active" : ""}`}>
                    <PlanIcon className="h-5 w-5 text-white" />
                  </div>
                  {plan.popular && <span className="auth-plan-badge">Most Popular</span>}
                </div>

                {active && <div className="auth-pricing-glow" aria-hidden="true" />}

                <div className="mt-6 flex items-start justify-between gap-4">
                  <div>
                    <h4 className="text-xl font-semibold tracking-tight text-slate-950">{plan.name}</h4>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{plan.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-semibold tracking-tight text-slate-950">₹{plan.totalAmount.toLocaleString()}</p>
                    <p className="text-xs text-slate-500">{plan.duration === "lifetime" ? "One-time" : `per ${plan.duration}`}</p>
                  </div>
                </div>

                <div className="mt-5 rounded-[22px] bg-slate-950 px-4 py-3 text-sm font-medium text-white">
                  ₹{plan.price.toLocaleString()} + ₹{plan.gst.toLocaleString()} GST
                </div>

                <ul className="mt-5 space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm text-slate-700">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-sky-700" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    {plan.savings ?? "Flexible access"}
                  </span>
                  <span className="text-xs font-semibold text-sky-700">
                    {active ? "Selected" : "Select plan"}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Auth;
