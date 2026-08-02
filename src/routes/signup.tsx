/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { ShieldCheck, Loader2, ArrowLeft, Eye, EyeOff, CreditCard, Check, Sparkles, ArrowRight, RefreshCw } from "lucide-react";
import logo from "@/assets/logo.png";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  full_name: z.string().min(2, "Enter your full name"),
  organization_name: z.string().min(2, "Enter an organization name"),
  email: z.string().email("Enter a valid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[a-z]/, "Must contain at least one lowercase letter")
    .regex(/[0-9]/, "Must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),
});
type FormValues = z.infer<typeof schema>;

const plansMap: Record<string, { id: string; name: string; price: string; amountKobo: number; period: string; features: string[] }> = {
  starter: {
    id: "starter",
    name: "Starter Plan",
    price: "$48,000",
    amountKobo: 50000,
    period: "/ year",
    features: [
      "Paystack & 1 primary bank integration",
      "100% Data ownership & local export",
      "Standard invoice mapping template",
      "Up to 3 administrative departments",
      "Standard email & phone support desk",
    ],
  },
  growth: {
    id: "growth",
    name: "Growth Plan",
    price: "$95,050",
    amountKobo: 100000,
    period: "/ year",
    features: [
      "Paystack & multi-bank integrations",
      "100% Data ownership & local export",
      "Custom AI policy matching engine",
      "Up to 6 departments supported",
      "SLA-bound technical support & logs",
      "Statutory records retention at write",
      "SOC 2 Type II compliance audit logs",
    ],
  },
  enterprise: {
    id: "enterprise",
    name: "Enterprise Plan",
    price: "$185,000",
    amountKobo: 200000,
    period: "/ year",
    features: [
      "Unlimited gateway & bank integrations",
      "100% Data ownership & local export",
      "Full cross-agency rules compiler",
      "Unlimited administrative departments",
      "24/7 dedicated support desk",
      "Statutory records retention at write",
      "Custom enterprise sandbox node",
      "Cryptographic hash-chain audit logs",
    ],
  },
};

const plansArray = [plansMap.starter, plansMap.growth, plansMap.enterprise];

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Create account — TODELLAA" }] }),
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  // Parse URL query parameter for plan
  const searchParams = new URLSearchParams(
    typeof window !== "undefined" ? window.location.search : ""
  );
  const urlPlanKey = searchParams.get("plan")?.toLowerCase() || null;
  const hasPlanFromUrl = !!urlPlanKey && !!plansMap[urlPlanKey];

  // Chosen plan state (can be changed by user)
  const [chosenPlanKey, setChosenPlanKey] = useState<string>(urlPlanKey && plansMap[urlPlanKey] ? urlPlanKey : "starter");
  const chosenPlan = plansMap[chosenPlanKey] || plansMap.starter;

  // Step flow:
  // - If user came with ?plan=xxx → register → plan-details (with switch option)
  // - If user came without plan → register → choose-plan → plan-details
  type StepType = "register" | "choose-plan" | "plan-details";
  const [step, setStep] = useState<StepType>("register");

  // Registered account state
  const [accountData, setAccountData] = useState<{
    full_name: string;
    organization_name: string;
    email: string;
  } | null>(null);

  // Invitation handling states
  const [inviteToken, setInviteToken] = useState<string | null>(null);
  const [inviteDetails, setInviteDetails] = useState<{
    id: string;
    email: string;
    role: string;
    organization_id: string;
    organization_name: string;
  } | null>(null);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [fetchingInvite, setFetchingInvite] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { full_name: "", organization_name: "", email: "", password: "" },
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const token = new URLSearchParams(window.location.search).get("invite");

    const verifyInvitation = async (tok: string) => {
      setFetchingInvite(true);
      try {
        const { data: invite, error } = await (supabase as any)
          .from("invitations")
          .select(
            `
            id,
            email,
            role,
            organization_id,
            organizations:organization_id (
              name
            )
          `
          )
          .eq("token", tok)
          .is("accepted_at", null)
          .single();

        if (error || !invite) {
          setInviteError("This invitation link is invalid, expired, or has already been accepted.");
        } else {
          const orgName = invite.organizations?.name || "Invited Workspace";
          setInviteDetails({
            id: invite.id,
            email: invite.email,
            role: invite.role,
            organization_id: invite.organization_id,
            organization_name: orgName,
          });

          form.setValue("email", invite.email);
          form.setValue("organization_name", orgName);
          toast.info(`Onboarding invite verified for ${orgName}!`);
        }
      } catch (err) {
        setInviteError("Could not verify the invitation token.");
      } finally {
        setFetchingInvite(false);
      }
    };

    if (token) {
      setInviteToken(token);
      verifyInvitation(token);
    }
  }, [form]);

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      const metadata: Record<string, any> = {
        full_name: values.full_name,
      };

      if (inviteDetails) {
        metadata.organization_id = inviteDetails.organization_id;
        metadata.organization_name = inviteDetails.organization_name;
        metadata.invited_role = inviteDetails.role;
      } else {
        metadata.organization_name = values.organization_name;
      }

      const { data: signUpData, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: metadata,
        },
      });

      if (error && !error.message.includes("already registered")) {
        throw error;
      }

      if (inviteDetails) {
        await (supabase as any)
          .from("invitations")
          .update({ accepted_at: new Date().toISOString() })
          .eq("id", inviteDetails.id);
      }

      setAccountData({
        full_name: values.full_name,
        organization_name: values.organization_name,
        email: values.email,
      });

      toast.success("Account created! Now choose your plan.");

      // If user came with a plan from pricing page, go directly to plan-details
      // Otherwise, show plan selection
      if (hasPlanFromUrl) {
        setStep("plan-details");
      } else {
        setStep("choose-plan");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = (planKey: string) => {
    setChosenPlanKey(planKey);
    setStep("plan-details");
  };

  const handlePaystackCheckout = () => {
    const paystackPublicKey =
      import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || "pk_test_f4cd532e0f6a2042bb921a713a4f5122b145cb0b";

    if (!(window as any).PaystackPop) {
      toast.error("Paystack SDK not ready. Please refresh the page and try again.");
      return;
    }

    setPaymentProcessing(true);

    try {
      const userEmail = accountData?.email || form.getValues("email") || "customer@example.com";
      const handler = (window as any).PaystackPop.setup({
        key: paystackPublicKey,
        email: userEmail,
        amount: chosenPlan.amountKobo,
        currency: "GHS",
        ref: `TODELLAA_${chosenPlan.id.toUpperCase()}_${Date.now()}`,
        metadata: {
          plan_id: chosenPlan.id,
          plan_name: chosenPlan.name,
          organization: accountData?.organization_name || form.getValues("organization_name"),
        },
        callback: (response: any) => {
          setPaymentProcessing(false);
          toast.success("Payment verified successfully!");
          navigate({
            to: "/payment-success",
            search: { ref: response.reference, plan: chosenPlan.id },
          });
        },
        onClose: () => {
          setPaymentProcessing(false);
          toast.info("Payment attempt cancelled.");
          navigate({
            to: "/payment-failed",
            search: { reason: "cancelled", plan: chosenPlan.id },
          });
        },
      });

      handler.openIframe();
    } catch (err: any) {
      setPaymentProcessing(false);
      toast.error(`Paystack initialization error: ${err.message || err}`);
    }
  };

  // Step label for badge
  const getStepLabel = () => {
    if (step === "register") return "Step 1 — Create Account";
    if (step === "choose-plan") return hasPlanFromUrl ? "Step 2 of 2 — Choose Plan" : "Step 2 of 3 — Choose Plan";
    return hasPlanFromUrl ? "Step 2 of 2 — Confirm Plan" : "Step 3 of 3 — Confirm Plan";
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white font-sans selection:bg-black selection:text-white">
      {/* ─── LEFT PANEL: DARK BRANDING & TESTIMONIAL ─── */}
      <div
        style={{ backgroundColor: "#040814" }}
        className="relative hidden lg:flex flex-col justify-between p-12 lg:p-16 text-white overflow-hidden select-none min-h-screen"
      >
        {/* Abstract Smooth Blue Waves Glow Overlay */}
        <div className="absolute -bottom-32 -left-32 w-162.5 h-162.5 bg-linear-to-tr from-blue-700/60 via-blue-500/40 to-transparent rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 -right-32 w-125 h-125 bg-blue-900/40 rounded-full blur-[140px] pointer-events-none" />

        {/* Top Header: Back to Website button ABOVE the logo */}
        <div className="relative z-10 space-y-8">
          <div>
            <Button
              variant="ghost"
              className="rounded-full gap-2 border border-neutral-800 bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 hover:text-white text-xs font-semibold px-4 py-2"
              asChild
            >
              <Link to="/">
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back to website</span>
              </Link>
            </Button>
          </div>

          <Link to="/" className="flex items-center gap-3 select-none">
            <img src={logo} alt="TODELLAA Logo" className="h-10 w-auto object-contain" />
            <span className="text-2xl font-bold tracking-tight text-white font-sans">
              TODELLAA
            </span>
          </Link>
        </div>

        {/* Bottom Testimonial Quote */}
        <div className="relative z-10 max-w-lg mb-8 space-y-4 text-left">
          <blockquote className="text-3xl lg:text-4xl font-extrabold tracking-tight leading-[1.2] text-white font-sans">
            "Simply all the tools that my team and I need."
          </blockquote>
          <div>
            <div className="text-sm font-semibold text-neutral-200 font-sans">
              — Lora Gotlib
            </div>
            <div className="text-xs font-medium text-neutral-400 mt-0.5 font-sans">
              Enterprise Account Executive
            </div>
          </div>
        </div>
      </div>

      {/* ─── RIGHT PANEL: FORM / PLAN SELECTION / PLAN DETAILS ─── */}
      <div className="flex flex-col justify-center items-center px-6 py-12 lg:px-16 xl:px-24 bg-white relative min-h-screen overflow-y-auto">
        {/* Mobile Header (Only visible on small screens) */}
        <div className="w-full max-w-md flex items-center justify-between mb-8 lg:hidden">
          <Link to="/" className="flex items-center gap-2.5">
            <img src={logo} alt="TODELLAA Logo" className="h-8 w-auto object-contain" />
            <span className="text-lg font-bold tracking-tight text-black font-sans">
              TODELLAA
            </span>
          </Link>

          <Link to="/" className="text-xs font-semibold text-neutral-500 hover:text-black flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
        </div>

        <div className="w-full max-w-md space-y-8 my-auto">
          {step === "register" ? (
            /* ═══════════ STEP 1: REGISTER FORM ═══════════ */
            <>
              <div className="text-left space-y-2">
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0a0a0a] font-sans">
                  Create an account
                </h1>
                <p className="text-sm text-neutral-500 leading-relaxed font-normal font-sans">
                  {inviteDetails
                    ? `Join ${inviteDetails.organization_name} workspace`
                    : `Get started with Todella payment reconciliation in minutes.`}
                </p>
              </div>

              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 text-left font-sans">
                {inviteDetails && (
                  <div className="rounded-2xl bg-blue-50 p-3.5 border border-blue-200 text-xs text-blue-900 font-semibold flex items-center gap-2 font-sans">
                    <ShieldCheck className="h-4 w-4 text-blue-600 shrink-0" />
                    <span>Redeeming invitation for role: {inviteDetails.role}</span>
                  </div>
                )}

                <div className="space-y-1.5">
                  <Label htmlFor="full_name" className="text-xs font-semibold text-neutral-700 font-sans">
                    Full Name*
                  </Label>
                  <Input
                    id="full_name"
                    placeholder="John Doe"
                    className="rounded-full px-6 h-12 border border-neutral-300 bg-white text-neutral-900 placeholder:text-neutral-400 focus-visible:ring-2 focus-visible:ring-black focus-visible:border-black transition-all text-sm font-sans"
                    {...form.register("full_name")}
                  />
                  {form.formState.errors.full_name && (
                    <p className="text-xs text-rose-500 pl-3 font-sans">
                      {form.formState.errors.full_name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="organization_name" className="text-xs font-semibold text-neutral-700 font-sans">
                    Organization Name*
                  </Label>
                  <Input
                    id="organization_name"
                    placeholder="Acme Inc."
                    readOnly={!!inviteDetails}
                    className={`rounded-full px-6 h-12 border border-neutral-300 bg-white text-neutral-900 placeholder:text-neutral-400 focus-visible:ring-2 focus-visible:ring-black focus-visible:border-black transition-all text-sm font-sans ${
                      inviteDetails ? "opacity-75 select-none bg-neutral-100" : ""
                    }`}
                    {...form.register("organization_name")}
                  />
                  {form.formState.errors.organization_name && (
                    <p className="text-xs text-rose-500 pl-3 font-sans">
                      {form.formState.errors.organization_name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-semibold text-neutral-700 font-sans">
                    Email*
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    readOnly={!!inviteDetails}
                    className={`rounded-full px-6 h-12 border border-neutral-300 bg-white text-neutral-900 placeholder:text-neutral-400 focus-visible:ring-2 focus-visible:ring-black focus-visible:border-black transition-all text-sm font-sans ${
                      inviteDetails ? "opacity-75 select-none cursor-not-allowed bg-neutral-100" : ""
                    }`}
                    {...form.register("email")}
                  />
                  {form.formState.errors.email && (
                    <p className="text-xs text-rose-500 pl-3 font-sans">
                      {form.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-xs font-semibold text-neutral-700 font-sans">
                    Password*
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••••••"
                      className="rounded-full pl-6 pr-12 h-12 border border-neutral-300 bg-white text-neutral-900 placeholder:text-neutral-400 focus-visible:ring-2 focus-visible:ring-black focus-visible:border-black transition-all text-sm font-sans"
                      {...form.register("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black transition-colors p-1"
                    >
                      {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                    </button>
                  </div>
                  {form.formState.errors.password && (
                    <p className="text-xs text-rose-500 pl-3 font-sans">
                      {form.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-full bg-black hover:bg-neutral-800 text-white font-bold text-sm shadow-md transition-all cursor-pointer mt-4 font-sans"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  <span>{hasPlanFromUrl ? "Continue to Plan Details" : "Continue"}</span>
                </Button>
              </form>

              <p className="text-center text-xs text-neutral-500 pt-4 font-sans">
                Already have an account?{" "}
                <Link to="/login" className="font-bold text-black hover:underline">
                  LogIn
                </Link>
              </p>
            </>

          ) : step === "choose-plan" ? (
            /* ═══════════ STEP 2a: CHOOSE PLAN (when no plan from URL) ═══════════ */
            <div className="space-y-6 text-left font-sans">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{getStepLabel()}</span>
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight text-[#0a0a0a]">
                  Choose your plan
                </h1>
                <p className="text-sm text-neutral-500 leading-relaxed">
                  Select the plan that best fits your organization's needs.
                </p>
              </div>

              {/* Plan Cards */}
              <div className="space-y-4">
                {plansArray.map((plan) => (
                  <button
                    key={plan.id}
                    onClick={() => handleSelectPlan(plan.id)}
                    className={`w-full text-left rounded-2xl border-2 p-5 transition-all hover:shadow-md group cursor-pointer ${
                      chosenPlanKey === plan.id
                        ? "border-blue-600 bg-blue-50/50 shadow-sm"
                        : "border-neutral-200 bg-white hover:border-neutral-400"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-base font-bold text-neutral-900">{plan.name}</h3>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                        chosenPlanKey === plan.id
                          ? "border-blue-600 bg-blue-600"
                          : "border-neutral-300 group-hover:border-neutral-400"
                      }`}>
                        {chosenPlanKey === plan.id && <Check className="w-3 h-3 text-white" />}
                      </div>
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl font-extrabold text-blue-600">{plan.price}</span>
                      <span className="text-xs font-mono text-neutral-500">{plan.period}</span>
                    </div>
                    <ul className="mt-3 space-y-1.5">
                      {plan.features.slice(0, 3).map((feat, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs text-neutral-600">
                          <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                      {plan.features.length > 3 && (
                        <li className="text-xs text-neutral-400 pl-5.5">
                          + {plan.features.length - 3} more features
                        </li>
                      )}
                    </ul>
                  </button>
                ))}
              </div>

              <button
                onClick={() => setStep("register")}
                className="w-full text-center py-1 text-xs text-neutral-500 hover:text-black transition-colors font-sans"
              >
                ← Edit registration details
              </button>
            </div>

          ) : (
            /* ═══════════ STEP 2b/3: PLAN DETAILS & CHECKOUT ═══════════ */
            <div className="space-y-6 text-left font-sans">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{getStepLabel()}</span>
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight text-[#0a0a0a]">
                  {chosenPlan.name}
                </h1>
                <div className="flex items-baseline gap-2 pt-1">
                  <span className="text-3xl font-extrabold text-blue-600">
                    {chosenPlan.price}
                  </span>
                  <span className="text-xs font-mono text-neutral-500">{chosenPlan.period}</span>
                </div>
              </div>

              {/* Account Summary Card */}
              <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-4 space-y-2 text-xs">
                <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 font-bold mb-1">
                  Account Details
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Name:</span>
                  <span className="font-semibold text-neutral-900">
                    {accountData?.full_name || form.getValues("full_name")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Organization:</span>
                  <span className="font-semibold text-neutral-900">
                    {accountData?.organization_name || form.getValues("organization_name")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Billing Email:</span>
                  <span className="font-semibold text-blue-600 font-mono">
                    {accountData?.email || form.getValues("email")}
                  </span>
                </div>
              </div>

              {/* Included Features */}
              <div>
                <div className="text-xs font-bold text-neutral-700 uppercase tracking-wider font-mono mb-3">
                  Included Features:
                </div>
                <ul className="space-y-2.5">
                  {chosenPlan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-2.5 text-xs text-neutral-700">
                      <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Paystack Payment Trigger CTA */}
              <div className="pt-4 border-t border-neutral-200 space-y-3">
                <Button
                  onClick={handlePaystackCheckout}
                  disabled={paymentProcessing}
                  className="w-full h-12 rounded-full bg-black hover:bg-neutral-800 text-white font-bold text-sm shadow-md transition-all cursor-pointer gap-2"
                >
                  {paymentProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Opening Paystack Checkout...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4" />
                      <span>Complete Payment via Paystack ({chosenPlan.price})</span>
                    </>
                  )}
                </Button>

                {/* Switch Plan + Edit Details */}
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={() => setStep("choose-plan")}
                    className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-semibold transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Switch Plan</span>
                  </button>
                  <span className="text-neutral-300">|</span>
                  <button
                    onClick={() => setStep("register")}
                    className="text-xs text-neutral-500 hover:text-black transition-colors"
                  >
                    ← Edit registration details
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

