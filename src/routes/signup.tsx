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
  head: () => ({ meta: [{ title: "Create account — PayVerify" }] }),
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

      toast.success("Account created — welcome to PayVerify!");
      navigate({ to: "/dashboard" });
    } catch (error: any) {
      toast.error(error.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f5f7fa] via-white to-[#e4e8f0] dark:from-[#080b11] dark:via-[#0c101b] dark:to-[#0f1422] px-4 py-12 transition-colors duration-200 relative">
      {/* Floating Back to Home button */}
      <div className="absolute top-6 left-6 sm:top-8 sm:left-8 z-10">
        <Button
          variant="ghost"
          className="rounded-full gap-2 border border-slate-200 bg-white/80 hover:bg-slate-50 text-slate-700 hover:text-slate-900 shadow-sm transition-all text-xs font-semibold backdrop-blur-sm px-4 py-2"
          asChild
        >
          <Link to="/">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
        </Button>
      </div>

      <div className="w-full max-w-[440px] animate-fade-in">
        <div className="flex justify-center mb-8">
          <Link to="/" className="flex items-center gap-3 select-none">
            <div className="relative h-12 w-12 flex items-center justify-center font-sans text-4xl font-black italic shrink-0">
              <span
                className="absolute text-[#003087] dark:text-blue-400 select-none"
                style={{ transform: "translate(-5px, -4px)" }}
              >
                P
              </span>
              <span
                className="absolute text-[#0070ba] dark:text-cyan-400 opacity-85 select-none"
                style={{ transform: "translate(5px, 4px)" }}
              >
                V
              </span>
            </div>
            <div className="leading-tight text-left">
              <div className="text-2xl font-black tracking-tight text-[#003087] dark:text-white leading-none">
                Pay<span className="text-[#0070ba] dark:text-cyan-400">Verify</span>
              </div>
              <div className="text-[10px] text-muted-foreground font-bold tracking-wider uppercase mt-1">
                Payment Verification
              </div>
            </div>
          </Link>
        </div>

        <Card className="border-border/60 bg-card/90 backdrop-blur-xl shadow-[var(--shadow-card)] rounded-[2rem] overflow-hidden">
          <CardHeader className="pb-4 pt-8 text-center">
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
              {inviteDetails ? "Join Your Workspace" : "Get Started Free"}
            </h1>
            <p className="text-sm text-muted-foreground mt-1 font-medium">
              {inviteDetails
                ? `Complete registration to join ${inviteDetails.organization_name}`
                : "Create your workspace and start reconciling in minutes"}
            </p>
          </CardHeader>
          <CardContent className="pb-8 px-6 sm:px-8">
            {fetchingInvite ? (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
                <Loader2 className="h-7 w-7 animate-spin text-primary" />
                <span className="text-xs font-semibold">Verifying secure invitation...</span>
              </div>
            ) : inviteError ? (
              <div className="space-y-5 text-center py-4">
                <div className="text-rose-500 font-semibold text-xs bg-rose-500/10 border border-rose-500/20 p-4.5 rounded-2xl leading-relaxed">
                  {inviteError}
                </div>
                <Button
                  variant="outline"
                  shape="pill"
                  className="w-full h-11 text-sm font-semibold rounded-full border-border/80"
                  asChild
                >
                  <Link to="/signup">Standard Registration</Link>
                </Button>
              </div>
            ) : (
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {inviteDetails && (
                  <div className="rounded-2xl bg-cyan-500/10 p-3.5 border border-cyan-500/20 text-[11px] text-cyan-600 dark:text-cyan-400 font-bold leading-relaxed flex items-center gap-2">
                    <ShieldCheck className="h-4.5 w-4.5 shrink-0 text-cyan-500" />
                    <span>Redeeming invitation for role: {inviteDetails.role}</span>
                  </div>
                )}

                <div className="space-y-1">
                  <Label
                    htmlFor="full_name"
                    className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 pl-1"
                  >
                    Full Name
                  </Label>
                  <Input
                    id="full_name"
                    placeholder="John Doe"
                    className="rounded-full px-5 h-11 border-border/80 focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary/80 bg-background text-foreground transition-all"
                    {...form.register("full_name")}
                  />
                  {form.formState.errors.full_name && (
                    <p className="text-xs text-destructive pl-1">
                      {form.formState.errors.full_name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label
                    htmlFor="organization_name"
                    className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 pl-1"
                  >
                    Organization
                  </Label>
                  <Input
                    id="organization_name"
                    placeholder="Acme Inc."
                    readOnly={!!inviteDetails}
                    className={`rounded-full px-5 h-11 border-border/80 focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary/80 bg-background text-foreground transition-all ${
                      inviteDetails
                        ? "bg-muted/40 text-muted-foreground select-none opacity-80"
                        : ""
                    }`}
                    {...form.register("organization_name")}
                  />
                  {form.formState.errors.organization_name && (
                    <p className="text-xs text-destructive pl-1">
                      {form.formState.errors.organization_name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label
                    htmlFor="email"
                    className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 pl-1"
                  >
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    readOnly={!!inviteDetails}
                    className={`rounded-full px-5 h-11 border-border/80 focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary/80 bg-background text-foreground transition-all ${
                      inviteDetails
                        ? "bg-muted/40 text-muted-foreground select-none opacity-85 cursor-not-allowed"
                        : ""
                    }`}
                    {...form.register("email")}
                  />
                  {form.formState.errors.email && (
                    <p className="text-xs text-destructive pl-1">
                      {form.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label
                    htmlFor="password"
                    className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 pl-1"
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Password@123 (Min. 8 chars, mixed cases, symbol)"
                      className="rounded-full pl-5 pr-12 h-11 border-border/80 focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary/80 bg-background text-foreground transition-all"
                      {...form.register("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4.5 w-4.5" />
                      ) : (
                        <Eye className="h-4.5 w-4.5" />
                      )}
                    </button>
                  </div>
                  {form.formState.errors.password && (
                    <p className="text-xs text-destructive pl-1">
                      {form.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-11 text-base font-semibold shadow-md cursor-pointer bg-primary hover:bg-primary/95 text-primary-foreground hover:scale-[1.01] active:scale-[0.99] transition-all rounded-full mt-4"
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
                    <div className="w-full border-t border-border/60"></div>
                  </div>
                  <span className="relative bg-card px-3 text-xs text-muted-foreground uppercase font-semibold">
                    Already registered?
                  </span>
                </div>
                <Button
                  variant="outline"
                  shape="pill"
                  className="w-full h-11 text-sm font-semibold border-primary/40 text-primary hover:bg-primary/5 rounded-full"
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
