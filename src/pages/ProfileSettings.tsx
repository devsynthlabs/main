import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, BadgeCheck, Crown, Mail, Shield, Sparkles, UserCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { API_ENDPOINTS } from "@/lib/api";
import { getTrialExpiryLabel, isTrialExpired } from "@/lib/trial";

type UserProfile = {
  id: string;
  email: string;
  name?: string;
  subscriptionStatus?: "pending" | "active";
  subscriptionPlan?: "trial" | "monthly" | "annual" | "lifetime";
  subscriptionAmount?: number;
  subscriptionStartDate?: string;
  subscriptionEndDate?: string;
  trialEndDate?: string;
};

const planLabelMap: Record<NonNullable<UserProfile["subscriptionPlan"]>, string> = {
  trial: "Trial",
  monthly: "Monthly",
  annual: "Annual",
  lifetime: "Lifetime",
};

const ProfileSettings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth");
      return;
    }

    fetch(API_ENDPOINTS.USER, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch user");
        return res.json();
      })
      .then((data: UserProfile) => {
        setUser(data);
        setDisplayName(data.name?.trim() || data.email.split("@")[0]);
        setEmail(data.email);

        if (isTrialExpired(data)) {
          toast({
            title: "Free trial ended",
            description: "Please choose a paid plan to continue using your account.",
            variant: "destructive",
          });
          localStorage.removeItem("token");
          navigate("/auth?tab=signup&plan=monthly");
        }
      })
      .catch((error) => {
        console.error("Error fetching profile:", error);
        localStorage.removeItem("token");
        navigate("/auth");
      })
      .finally(() => setLoading(false));
  }, [navigate, toast]);

  const profileInitial = useMemo(() => {
    return (displayName || email || "U").charAt(0).toUpperCase();
  }, [displayName, email]);

  const selectedPlanLabel = user?.subscriptionPlan ? planLabelMap[user.subscriptionPlan] : "Pending";
  const subscriptionAmount = user?.subscriptionAmount ? `₹${user.subscriptionAmount.toLocaleString("en-IN")}` : "Not set";
  const trialExpiry = getTrialExpiryLabel(user?.trialEndDate);

  const handleSave = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth");
      return;
    }

    setSaving(true);
    fetch(API_ENDPOINTS.UPDATE_PROFILE, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: displayName.trim(),
        email: email.trim(),
      }),
    })
      .then(async (res) => {
        const payload = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(payload?.message || "Failed to update profile");
        }
        return payload as { message?: string; user?: UserProfile };
      })
      .then((payload) => {
        if (payload.user) {
          setUser(payload.user);
          setDisplayName(payload.user.name?.trim() || payload.user.email.split("@")[0]);
          setEmail(payload.user.email);
        }

        toast({
          title: "Profile updated",
          description: payload.message || "Your changes were saved to the database.",
        });
      })
      .catch((error) => {
        toast({
          title: "Save failed",
          description: error instanceof Error ? error.message : "Could not update profile",
          variant: "destructive",
        });
      })
      .finally(() => setSaving(false));
  };

  return (
    <div className="dashboard-light min-h-screen text-slate-900">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/dashboard")}
              className="h-10 rounded-full border-slate-200 bg-white px-4 text-slate-700 hover:bg-slate-50 hover:text-slate-900"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
            <div>
              <p className="text-sm font-medium text-slate-500">Account</p>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Profile settings</h1>
            </div>
          </div>

          <Button
            type="button"
            className="h-10 rounded-full bg-slate-900 px-4 text-white hover:bg-slate-800"
            onClick={handleSave}
            disabled={saving}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            {saving ? "Saving..." : "Save changes"}
          </Button>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-[24px] bg-slate-900 text-2xl font-semibold text-white">
                {profileInitial}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">User profile</p>
                <h2 className="truncate text-2xl font-semibold text-slate-900">{loading ? "Loading..." : displayName}</h2>
                <p className="truncate text-sm text-slate-500">{email}</p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Display name</span>
                <Input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="h-12 rounded-[18px] border-slate-200 bg-slate-50 text-slate-900 focus-visible:ring-0"
                  placeholder="Your name"
                />
              </label>

              <label className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Email address</span>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 rounded-[18px] border-slate-200 bg-slate-50 text-slate-900 focus-visible:ring-0"
                  placeholder="name@example.com"
                />
              </label>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-slate-500">
                  <BadgeCheck className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase tracking-[0.16em]">Status</span>
                </div>
                <p className="mt-2 text-sm font-medium text-slate-900">
                  {user?.subscriptionStatus === "active" ? "Active" : "Pending"}
                </p>
              </div>

              <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-slate-500">
                  <Crown className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase tracking-[0.16em]">Plan</span>
                </div>
                <p className="mt-2 text-sm font-medium text-slate-900">{selectedPlanLabel}</p>
              </div>

              <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-slate-500">
                  <Shield className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase tracking-[0.16em]">Amount</span>
                </div>
                <p className="mt-2 text-sm font-medium text-slate-900">{subscriptionAmount}</p>
              </div>
            </div>
          </section>

          <aside className="space-y-4">
            <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Subscription</p>
              <div className="mt-4 space-y-4">
                <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Mail className="h-4 w-4" />
                    <span className="text-xs font-semibold uppercase tracking-[0.16em]">Start date</span>
                  </div>
                  <p className="mt-2 text-sm font-medium text-slate-900">
                    {user?.subscriptionStartDate || "Not available"}
                  </p>
                </div>

                <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Mail className="h-4 w-4" />
                    <span className="text-xs font-semibold uppercase tracking-[0.16em]">End date</span>
                  </div>
                  <p className="mt-2 text-sm font-medium text-slate-900">{trialExpiry || user?.subscriptionEndDate || "Not available"}</p>
                </div>
              </div>
            </section>

            <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Security</p>
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <p>Session access is tied to the current login token.</p>
                <p>Profile details come from your authenticated account record.</p>
                <p>Subscription details stay visible here for quick checking.</p>
              </div>
            </section>

            <section className="rounded-[28px] border border-slate-200 bg-slate-900 p-6 text-white shadow-[0_16px_36px_rgba(15,23,42,0.16)]">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10">
                  <UserCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/60">Profile tip</p>
                  <p className="mt-1 text-sm text-white/80">Keep your name and email aligned with the login used for billing.</p>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
