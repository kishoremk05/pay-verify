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
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Min 6 characters"),
});
type FormValues = z.infer<typeof schema>;

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — Todella" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!authLoading && user) navigate({ to: "/dashboard" });
  }, [user, authLoading, navigate]);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword(values);
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Welcome back!");
    navigate({ to: "/dashboard" });
  };  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f9fafb] px-4 py-12 transition-colors duration-200 relative">
      {/* Background Dot Grid Overlays */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-15 bg-[radial-gradient(#e2e8f0_1.2px,transparent_1.2px)] [background-size:24px_24px] mix-blend-multiply" />
      <div className="fixed inset-0 pointer-events-none z-0 opacity-10 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      
      {/* Floating Back to Home button */}
      <div className="absolute top-6 left-6 sm:top-8 sm:left-8 z-10">
        <Button variant="ghost" className="rounded-full gap-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 shadow-sm transition-all text-xs font-semibold px-4 py-2" asChild>
          <Link to="/">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
        </Button>
      </div>

      <div className="w-full max-w-[420px] animate-fade-in relative z-10">
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
            <h1 className="text-2xl font-display font-medium tracking-tight text-[#0a1b33]">Welcome Back</h1>
            <p className="text-sm text-slate-500 mt-1 font-sans">Sign in to your admin account to continue</p>
          </CardHeader>
          <CardContent className="pb-8 px-6 sm:px-8">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-slate-450 pl-1 font-mono">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="name@example.com"
                  className="rounded-full px-5 h-11 border-slate-200 focus-visible:ring-2 focus-visible:ring-[#0a152d]/10 focus-visible:border-[#0a152d] bg-[#f9fafb] text-slate-900 transition-all font-sans"
                  {...form.register("email")}
                />
                {form.formState.errors.email && (
                  <p className="text-xs text-rose-500 pl-1 font-sans">{form.formState.errors.email.message}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between pl-1">
                  <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-slate-450 font-mono">Password</Label>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="rounded-full pl-5 pr-12 h-11 border-slate-200 focus-visible:ring-2 focus-visible:ring-[#0a152d]/10 focus-visible:border-[#0a152d] bg-[#f9fafb] text-slate-900 transition-all font-sans"
                    {...form.register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-450 hover:text-slate-800 transition-colors p-1"
                  >
                    {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                  </button>
                </div>
                {form.formState.errors.password && (
                  <p className="text-xs text-rose-500 pl-1 font-sans">{form.formState.errors.password.message}</p>
                )}
              </div>
              <Button type="submit" size="lg" className="w-full h-11 text-sm font-semibold shadow-sm cursor-pointer bg-[#0a152d] hover:bg-[#0a152d]/90 text-white transition-all rounded-full mt-2 font-sans" disabled={loading}>
                {loading ? <Loader2 className="h-4.5 w-4.5 animate-spin mr-2" /> : null}
                Agree &amp; Log In
              </Button>
            </form>
            <div className="relative flex items-center justify-center my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200/50"></div>
              </div>
              <span className="relative bg-white px-3 text-[10px] text-slate-400 uppercase font-bold tracking-wider font-mono">New to Todella?</span>
            </div>
            <Button variant="outline" className="w-full h-11 text-xs font-semibold border-slate-200 text-slate-700 hover:bg-slate-50 rounded-full font-sans" asChild>
              <Link to="/signup">Create your account</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}