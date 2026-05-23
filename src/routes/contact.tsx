import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Building2, Zap, Loader2, ArrowRight, ShieldAlert, Headphones } from "lucide-react";
import newBg from "@/assets/new bg.png";
import { Navbar, Footer } from "./index";
import { Button } from "@/components/ui/button";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid work email"),
  company: z.string().min(1, "Company name is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});
type FormValues = z.infer<typeof schema>;

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Sales & Technical Support — PayVerify" },
      { name: "description", content: "Reach out to PayVerify integration specialists for high-integrity payment reconciliation." }
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setLoading(false);
    toast.success("Inquiry received! Our matching team will respond within 15 minutes.");
    reset();
  };

  return (
    <div className="min-h-screen bg-[#fafafa]/30 text-slate-900 font-sans selection:bg-blue-500/20 selection:text-blue-900 overflow-x-hidden antialiased relative">
      {/* Background and Dot Grid Overlays */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 bg-cover bg-center bg-no-repeat bg-fixed opacity-65"
        style={{ backgroundImage: `url(${newBg})` }}
      />
      <div className="fixed inset-0 pointer-events-none z-0 opacity-45 bg-[radial-gradient(#e2e8f0_1.2px,transparent_1.2px)] [background-size:24px_24px] mix-blend-multiply" />
      <div className="fixed inset-0 pointer-events-none z-0 opacity-15 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      
      {/* Floating Ambient Glowing Blobs */}
      <div className="absolute top-0 left-[10%] w-[50rem] h-[35rem] rounded-full bg-blue-600/[0.02] blur-[140px] pointer-events-none z-0" />
      <div className="absolute top-[35%] left-[20%] w-[40rem] h-[40rem] rounded-full bg-indigo-500/[0.01] blur-[160px] pointer-events-none z-0" />

      <Navbar />

      {/* Main Content Area */}
      <main className="relative z-10 pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          
          {/* Header section with load animation */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 border border-blue-250 bg-blue-50/50 px-3.5 py-1 rounded-md font-mono text-[9px] uppercase tracking-[0.2em] text-[#0070ba] mb-5 font-bold shadow-sm backdrop-blur-sm">
              // SECURE CHANNELS
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-slate-900 sm:text-6xl">
              Connect with ledger specialists.
            </h1>
            <p className="mt-5 text-slate-650 max-w-2xl mx-auto font-light leading-relaxed">
              Have complex bank API integrations, multi-tenant compliance queries, or custom CSV layouts? Reach out and get verified answers immediately.
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-5 items-start">
            
            {/* Left Column: Contact Cards */}
            <div className="md:col-span-2 space-y-6">
              
              {/* Sales Info Card */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="rounded-3xl border border-slate-200 bg-white/60 backdrop-blur-md p-6 shadow-md hover:shadow-lg transition-all"
              >
                <div className="flex gap-4 items-start">
                  <div className="h-10 w-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0070ba] shrink-0">
                    <Zap className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Enterprise Relations</h3>
                    <p className="text-xs font-mono text-slate-400 mt-0.5">// SALES &amp; DEMOS</p>
                    <a href="mailto:sales@payverify.com" className="text-sm text-[#0070ba] hover:underline block mt-3 font-semibold">
                      sales@payverify.com
                    </a>
                  </div>
                </div>
              </motion.div>

              {/* Support Card */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="rounded-3xl border border-slate-200 bg-white/60 backdrop-blur-md p-6 shadow-md hover:shadow-lg transition-all"
              >
                <div className="flex gap-4 items-start">
                  <div className="h-10 w-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                    <Headphones className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Technical Helpdesk</h3>
                    <p className="text-xs font-mono text-slate-400 mt-0.5">// 24/7 COMPLIANCE &amp; DEPLOY</p>
                    <a href="mailto:support@payverify.com" className="text-sm text-emerald-600 hover:underline block mt-3 font-semibold">
                      support@payverify.com
                    </a>
                  </div>
                </div>
              </motion.div>

              {/* Security Audit card */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="rounded-3xl border border-slate-200 bg-white/60 backdrop-blur-md p-6 shadow-md hover:shadow-lg transition-all"
              >
                <div className="flex gap-4 items-start">
                  <div className="h-10 w-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                    <ShieldAlert className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Security Response Desk</h3>
                    <p className="text-xs font-mono text-slate-400 mt-0.5">// RECON PIPELINE VULNERABILITIES</p>
                    <a href="mailto:security@payverify.com" className="text-sm text-rose-600 hover:underline block mt-3 font-semibold">
                      security@payverify.com
                    </a>
                  </div>
                </div>
              </motion.div>

            </div>

            {/* Right Column: Contact Form Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="md:col-span-3 rounded-3xl border border-slate-200/50 bg-[#eef5fc]/60 backdrop-blur-xl p-8 md:p-10 shadow-xl"
            >
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-slate-500 pl-1">Full Name</label>
                    <input
                      id="name"
                      type="text"
                      placeholder="Leon Chike"
                      className="w-full rounded-2xl px-4 py-3 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0070ba] bg-white text-slate-900 transition-all text-sm"
                      {...register("name")}
                    />
                    {errors.name && <p className="text-xs text-rose-500 pl-1">{errors.name.message}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="company" className="text-xs font-bold uppercase tracking-wider text-slate-500 pl-1">Company Name</label>
                    <input
                      id="company"
                      type="text"
                      placeholder="Acme Ledger Inc."
                      className="w-full rounded-2xl px-4 py-3 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0070ba] bg-white text-slate-900 transition-all text-sm"
                      {...register("company")}
                    />
                    {errors.company && <p className="text-xs text-rose-500 pl-1">{errors.company.message}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-slate-500 pl-1">Work Email</label>
                  <input
                    id="email"
                    type="email"
                    placeholder="leon@acme.com"
                    className="w-full rounded-2xl px-4 py-3 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0070ba] bg-white text-slate-900 transition-all text-sm"
                    {...register("email")}
                  />
                  {errors.email && <p className="text-xs text-rose-500 pl-1">{errors.email.message}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-xs font-bold uppercase tracking-wider text-slate-500 pl-1">Message / Project Scope</label>
                  <textarea
                    id="message"
                    rows={4}
                    placeholder="Describe your multi-tenant volume and target API adapters..."
                    className="w-full rounded-2xl px-4 py-3 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0070ba] bg-white text-slate-900 transition-all text-sm resize-none"
                    {...register("message")}
                  />
                  {errors.message && <p className="text-xs text-rose-500 pl-1">{errors.message.message}</p>}
                </div>

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full py-6 font-mono text-xs tracking-wider bg-gradient-to-r from-blue-700 to-[#0070ba] text-white font-bold rounded-2xl shadow-md hover:bg-blue-700 flex items-center justify-center gap-2 group transition-all"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="h-4.5 w-4.5 animate-spin" />
                  ) : (
                    <>
                      TRANSMIT INQUIRY
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </form>
            </motion.div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
