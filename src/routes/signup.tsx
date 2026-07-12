/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { ShieldCheck, Loader2, ArrowLeft, Eye, EyeOff } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

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

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Create account — Todella" }] }),
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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

  // Check URL query parameters for invite tokens
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
          `,
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

          // Pre-fill email and organization name
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

  useEffect(() => {
    if (!authLoading && user) navigate({ to: "/dashboard" });
  }, [user, authLoading, navigate]);

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      const metadata: Record<string, any> = {
        full_name: values.full_name,
      };

      // If invited, inject the organization affiliation and role
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

      if (error) throw error;

      // If successful signup and invited, redeem the invitation token
      if (inviteDetails) {
        const { error: inviteError } = await (supabase as any)
          .from("invitations")
          .update({ accepted_at: new Date().toISOString() })
          .eq("id", inviteDetails.id);

        if (inviteError) {
          console.error("Failed to mark invitation as accepted:", inviteError);
        }
      }

      toast.success("Account created — welcome to Todella!");
      navigate({ to: "/dashboard" });
    } catch (error: any) {
      toast.error(error.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f9fafb] px-4 py-12 transition-colors duration-200 relative">
      {/* Background Dot Grid Overlays */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-15 bg-[radial-gradient(#e2e8f0_1.2px,transparent_1.2px)] [background-size:24px_24px] mix-blend-multiply" />
      <div className="fixed inset-0 pointer-events-none z-0 opacity-10 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem]" />

      {/* Floating Back to Home button */}
      <div className="absolute top-6 left-6 sm:top-8 sm:left-8 z-10">
        <Button
          variant="ghost"
          className="rounded-full gap-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 shadow-sm transition-all text-xs font-semibold px-4 py-2"
          asChild
        >
          <Link to="/">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
        </Button>
      </div>

      <div className="w-full max-w-[440px] animate-fade-in relative z-10">
        <div className="flex justify-center mb-8">
          <Link to="/" className="flex items-center gap-2.5 select-none">
            <div className="h-10 w-10 rounded-xl bg-[#0a152d] flex items-center justify-center shadow-sm relative overflow-hidden">
              <ShieldCheck className="h-5.5 w-5.5 text-white" />
            </div>
            <div className="leading-tight text-left">
              <div className="text-xl font-display font-semibold text-[#0a1b33] leading-none">
                TODELLA
              </div>
              <div className="text-[9px] text-slate-450 font-bold tracking-wider uppercase mt-0.5">
                Payment Verification
              </div>
            </div>
          </Link>
        </div>

        <Card className="border border-slate-200/60 bg-white shadow-sm rounded-3xl overflow-hidden">
          <CardHeader className="pb-4 pt-8 text-center">
            <h1 className="text-2xl font-display font-medium tracking-tight text-[#0a1b33]">
              {inviteDetails ? "Join Your Workspace" : "Get Started Free"}
            </h1>
            <p className="text-sm text-slate-500 mt-1 font-sans">
              {inviteDetails
                ? `Complete registration to join ${inviteDetails.organization_name}`
                : "Create your workspace and start reconciling in minutes"}
            </p>
          </CardHeader>
          <CardContent className="pb-8 px-6 sm:px-8">
            {fetchingInvite ? (
              <div className="flex flex-col items-center justify-center py-16 text-slate-500 gap-3">
                <Loader2 className="h-7 w-7 animate-spin text-[#0a152d]" />
                <span className="text-xs font-semibold font-sans">Verifying secure invitation...</span>
              </div>
            ) : inviteError ? (
              <div className="space-y-5 text-center py-4">
                <div className="text-rose-600 font-semibold text-xs bg-rose-50/50 border border-rose-100 p-4.5 rounded-2xl leading-relaxed font-sans">
                  {inviteError}
                </div>
                <Button
                  variant="outline"
                  className="w-full h-11 text-xs font-semibold rounded-full border-slate-200 text-slate-700 hover:bg-slate-50 font-sans"
                  asChild
                >
                  <Link to="/signup">Standard Registration</Link>
                </Button>
              </div>
            ) : (
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {inviteDetails && (
                  <div className="rounded-2xl bg-sky-50 p-3.5 border border-sky-200/60 text-[11px] text-[#0a1b33] font-bold leading-relaxed flex items-center gap-2 font-sans">
                    <ShieldCheck className="h-4.5 w-4.5 shrink-0 text-[#0a152d]" />
                    <span>Redeeming invitation for role: {inviteDetails.role}</span>
                  </div>
                )}

                <div className="space-y-1">
                  <Label
                    htmlFor="full_name"
                    className="text-xs font-bold uppercase tracking-wider text-slate-455 pl-1 font-mono"
                  >
                    Full Name
                  </Label>
                  <Input
                    id="full_name"
                    placeholder="John Doe"
                    className="rounded-full px-5 h-11 border-slate-200 focus-visible:ring-2 focus-visible:ring-[#0a152d]/10 focus-visible:border-[#0a152d] bg-[#f9fafb] text-slate-900 transition-all font-sans"
                    {...form.register("full_name")}
                  />
                  {form.formState.errors.full_name && (
                    <p className="text-xs text-rose-500 pl-1 font-sans">
                      {form.formState.errors.full_name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label
                    htmlFor="organization_name"
                    className="text-xs font-bold uppercase tracking-wider text-slate-455 pl-1 font-mono"
                  >
                    Organization
                  </Label>
                  <Input
                    id="organization_name"
                    placeholder="Acme Inc."
                    readOnly={!!inviteDetails}
                    className={`rounded-full px-5 h-11 border-slate-200 focus-visible:ring-2 focus-visible:ring-[#0a152d]/10 focus-visible:border-[#0a152d] bg-[#f9fafb] text-slate-900 transition-all font-sans ${
                      inviteDetails
                        ? "bg-slate-100 text-slate-450 select-none opacity-80"
                        : ""
                    }`}
                    {...form.register("organization_name")}
                  />
                  {form.formState.errors.organization_name && (
                    <p className="text-xs text-rose-500 pl-1 font-sans">
                      {form.formState.errors.organization_name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label
                    htmlFor="email"
                    className="text-xs font-bold uppercase tracking-wider text-slate-455 pl-1 font-mono"
                  >
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    readOnly={!!inviteDetails}
                    className={`rounded-full px-5 h-11 border-slate-200 focus-visible:ring-2 focus-visible:ring-[#0a152d]/10 focus-visible:border-[#0a152d] bg-[#f9fafb] text-slate-900 transition-all font-sans ${
                      inviteDetails
                        ? "bg-slate-100 text-slate-450 select-none opacity-85 cursor-not-allowed"
                        : ""
                    }`}
                    {...form.register("email")}
                  />
                  {form.formState.errors.email && (
                    <p className="text-xs text-rose-500 pl-1 font-sans">
                      {form.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label
                    htmlFor="password"
                    className="text-xs font-bold uppercase tracking-wider text-slate-455 pl-1 font-mono"
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Password@123 (Min. 8 chars, mixed cases, symbol)"
                      className="rounded-full pl-5 pr-12 h-11 border-slate-200 focus-visible:ring-2 focus-visible:ring-[#0a152d]/10 focus-visible:border-[#0a152d] bg-[#f9fafb] text-slate-900 transition-all font-sans"
                      {...form.register("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-450 hover:text-slate-800 transition-colors p-1"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4.5 w-4.5" />
                      ) : (
                        <Eye className="h-4.5 w-4.5" />
                      )}
                    </button>
                  </div>
                  {form.formState.errors.password && (
                    <p className="text-xs text-rose-500 pl-1 font-sans">
                      {form.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-11 text-xs font-semibold shadow-sm cursor-pointer bg-[#0a152d] hover:bg-[#0a152d]/90 text-white transition-all rounded-full mt-4 font-sans"
                  disabled={loading}
                >
                  {loading ? <Loader2 className="h-4.5 w-4.5 animate-spin mr-2" /> : null}
                  {inviteDetails ? "Complete Workspace Registration" : "Create Free Account"}
                </Button>
              </form>
            )}

            {!inviteDetails && (
              <>
                <div className="relative flex items-center justify-center my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200/50"></div>
                  </div>
                  <span className="relative bg-white px-3 text-[10px] text-slate-400 uppercase font-bold tracking-wider font-mono">
                    Already registered?
                  </span>
                </div>
                <Button
                  variant="outline"
                  className="w-full h-11 text-xs font-semibold border-slate-200 text-slate-700 hover:bg-slate-50 rounded-full font-sans"
                  asChild
                >
                  <Link to="/login">Sign in to your account</Link>
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
