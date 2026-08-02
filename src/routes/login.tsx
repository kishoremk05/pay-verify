import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { ShieldCheck, Loader2, ArrowLeft, Eye, EyeOff } from "lucide-react";

import logo from "@/assets/logo.png";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Min 6 characters"),
});
type FormValues = z.infer<typeof schema>;

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — TODELLAA" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

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
            “Simply all the tools that my team and I need.”
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

      {/* ─── RIGHT PANEL: CLEAN WHITE LOGIN FORM ─── */}
      <div className="flex flex-col justify-center items-center px-6 py-12 lg:px-16 xl:px-24 bg-white relative min-h-screen">
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
          {/* Title Header */}
          <div className="text-left space-y-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0a0a0a] font-sans">
              Welcome back!
            </h1>
            <p className="text-sm text-neutral-500 leading-relaxed font-normal font-sans">
              Get your tasks done efficiently with our powerful automation tools.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 text-left">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-semibold text-neutral-700 font-sans">
                Email*
              </Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="email@example.com"
                className="rounded-full px-6 h-12 border border-neutral-300 bg-white text-neutral-900 placeholder:text-neutral-400 focus-visible:ring-2 focus-visible:ring-black focus-visible:border-black transition-all text-sm font-sans"
                {...form.register("email")}
              />
              {form.formState.errors.email && (
                <p className="text-xs text-rose-500 pl-3 font-sans">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs font-semibold text-neutral-700 font-sans">
                Password*
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
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

            {/* Checkbox & Forgot Password Row */}
            <div className="flex items-center justify-between text-xs pt-1 font-sans">
              <label className="flex items-center gap-2 cursor-pointer select-none text-neutral-700 font-medium">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-neutral-300 text-black focus:ring-black cursor-pointer accent-black"
                />
                <span>Remember me</span>
              </label>

              <a href="#" className="font-semibold text-neutral-800 hover:underline">
                Forgot password?
              </a>
            </div>

            {/* LogIn Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-full bg-black hover:bg-neutral-800 text-white font-bold text-sm shadow-md transition-all cursor-pointer mt-4 font-sans"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              <span>Log In</span>
            </Button>
          </form>

          {/* Footer Navigation Link */}
          <p className="text-center text-xs text-neutral-500 pt-4 font-sans">
            Don't have an account?{" "}
            <Link to="/signup" className="font-bold text-black hover:underline">
              SignUp
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
