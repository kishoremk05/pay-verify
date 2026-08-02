import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Briefcase, MapPin, ArrowRight } from "lucide-react";
import { Navbar, Footer } from "./index";

export const Route = createFileRoute("/careers")({
  head: () => ({
    meta: [
      { title: "Join Our Team — Todellaa Careers" },
      { name: "description", content: "Explore job openings, culture, and career opportunities at Todellaa. Help us build the future of payment reconciliation." }
    ],
  }),
  component: CareersPage,
});

function CareersPage() {
  const jobs = [
    {
      title: "Senior Integration Engineer",
      team: "Engineering",
      location: "Accra, Ghana (Hybrid)",
    },
    {
      title: "Account Operations Manager",
      team: "Operations",
      location: "Kumasi, Ghana (On-site)",
    },
    {
      title: "Technical Support Specialist",
      team: "Customer Success",
      location: "Remote (West Africa)",
    }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-slate-900 selection:text-white overflow-x-hidden antialiased relative">
      <div className="fixed inset-0 pointer-events-none z-0 opacity-15 bg-[radial-gradient(#e2e8f0_1.2px,transparent_1.2px)] bg-size-[24px_24px] mix-blend-multiply" />
      <div className="fixed inset-0 pointer-events-none z-0 opacity-10 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-size-[4rem_4rem]" />

      <Navbar />

      <main className="relative z-10 pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 border border-slate-200 bg-slate-50 px-3.5 py-1 rounded-full font-mono text-[9px] uppercase tracking-[0.2em] text-slate-800 mb-5 font-bold shadow-sm">
              // JOIN THE WORKSPACE
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl font-sans">
              Careers at Todellaa
            </h1>
            <p className="mt-5 text-slate-500 max-w-xl mx-auto font-sans font-light leading-relaxed">
              Help us streamline billing systems and eradicate manual payment verification for thousands of operations.
            </p>
          </motion.div>

          <h2 className="text-2xl font-bold text-slate-900 mb-8 tracking-tight font-sans">Open Positions</h2>

          <div className="space-y-4 mb-16">
            {jobs.map((job, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="rounded-3xl border border-slate-200/60 bg-white p-6 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4 group"
              >
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1 font-sans">{job.title}</h3>
                  <div className="flex items-center gap-3 text-slate-400 text-xs font-semibold">
                    <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" /> {job.team}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {job.location}</span>
                  </div>
                </div>
                <a href="#" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 hover:bg-slate-100 text-xs font-semibold group-hover:bg-slate-900 group-hover:text-white transition-all cursor-pointer">
                  <span>Apply Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </motion.div>
            ))}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

