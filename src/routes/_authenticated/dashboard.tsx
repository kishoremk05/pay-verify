import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Banknote, Clock, AlertTriangle, TrendingUp, Users, RefreshCw, Layers, ShieldAlert } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";

import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/format";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — PayVerify" }] }),
  component: DashboardPage,
});

function DashboardPage() {
  const { organization, profile } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["dashboard", organization?.id],
    enabled: !!organization?.id,
    queryFn: async () => {
      const [{ data: customers }, { data: payments }] = await Promise.all([
        supabase.from("customers").select("id, expected_amount, due_amount, status"),
        supabase.from("payments").select("id, amount_paid, status, payment_date, customer_id, reference, payment_method, source").order("payment_date", { ascending: false }),
      ]);
      const expected = (customers ?? []).reduce((s, c) => s + Number(c.expected_amount ?? 0), 0);
      const received = (payments ?? []).reduce((s, p) => s + Number(p.amount_paid ?? 0), 0);
      const due = (customers ?? []).reduce((s, c) => s + Number(c.due_amount ?? 0), 0);
      
      const partialCount = (customers ?? []).filter((c) => c.status === "partial").length;
      const unpaidCount = (customers ?? []).filter((c) => c.status === "unpaid").length;
      const duplicateCount = (payments ?? []).filter((p) => p.status === "duplicate").length;
      const mismatchCount = (payments ?? []).filter((p) => p.status === "mismatch").length;

      const byDay = new Map<string, number>();
      (payments ?? []).forEach((p) => {
        const key = p.payment_date;
        byDay.set(key, (byDay.get(key) ?? 0) + Number(p.amount_paid));
      });
      const chart = Array.from(byDay.entries())
        .sort((a, b) => a[0].localeCompare(b[0]))
        .slice(-7)
        .map(([date, amount]) => ({ date: date.slice(5), amount }));

      return {
        expected,
        received,
        due,
        partialCount,
        unpaidCount,
        duplicateCount,
        mismatchCount,
        recent: (payments ?? []).slice(0, 5),
        chart
      };
    },
  });

  const moneyKpis = [
    { label: "Total Expected Amount", value: data?.expected ?? 0, icon: TrendingUp, tone: "text-[#0070ba] dark:text-cyan-400 bg-[#0070ba]/5 dark:bg-[#0070ba]/10 border-sky-100 dark:border-sky-500/20", isCurrency: true },
    { label: "Total Received", value: data?.received ?? 0, icon: Banknote, tone: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20", isCurrency: true },
    { label: "Total Due / Balance", value: data?.due ?? 0, icon: Clock, tone: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border-amber-100 dark:border-amber-500/20", isCurrency: true },
  ];

  const auditKpis = [
    { label: "Unpaid Customers", count: data?.unpaidCount ?? 0, icon: Users, tone: "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border-rose-100 dark:border-rose-500/20" },
    { label: "Partial Payments", count: data?.partialCount ?? 0, icon: RefreshCw, tone: "text-amber-500 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-500/5 border-amber-100/60 dark:border-amber-500/15" },
    { label: "Duplicate Payments", count: data?.duplicateCount ?? 0, icon: Layers, tone: "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10 border-purple-100 dark:border-purple-500/20" },
    { label: "Mismatch Payments", count: data?.mismatchCount ?? 0, icon: ShieldAlert, tone: "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border-red-100 dark:border-red-500/20" },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground font-sans">
            Welcome back, <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#003087] to-[#0070ba] dark:from-blue-400 dark:to-cyan-400">{profile?.full_name?.split(" ")[0] ?? "there"}</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Here's a breakdown of your payment status and activities today.</p>
        </div>
      </div>

      {/* Financial KPIs */}
      <div className="space-y-4">
        <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground/80 pl-1">Financial Ledgers</h3>
        <div className="grid gap-5 sm:grid-cols-3">
          {moneyKpis.map((k) => (
            <Card key={k.label} className="border-border/60 bg-card shadow-[var(--shadow-card)] rounded-2xl overflow-hidden hover:scale-[1.01] transition-transform duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">{k.label}</p>
                    {isLoading ? (
                      <Skeleton className="h-8 w-28 mt-2 rounded-full" />
                    ) : (
                      <p className="text-2xl font-black text-foreground tracking-tight">{formatCurrency(k.value)}</p>
                    )}
                  </div>
                  <div className={`h-11 w-11 rounded-full flex items-center justify-center border ${k.tone}`}>
                    <k.icon className="h-5.5 w-5.5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Reconciliation Audits */}
      <div className="space-y-4">
        <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground/80 pl-1">Reconciliation Audits</h3>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {auditKpis.map((k) => (
            <Card key={k.label} className="border-border/60 bg-card shadow-[var(--shadow-card)] rounded-2xl overflow-hidden hover:scale-[1.01] transition-transform duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">{k.label}</p>
                    {isLoading ? (
                      <Skeleton className="h-8 w-16 mt-2 rounded-full" />
                    ) : (
                      <p className="text-2xl font-black text-foreground tracking-tight">{k.count}</p>
                    )}
                  </div>
                  <div className={`h-11 w-11 rounded-full flex items-center justify-center border ${k.tone}`}>
                    <k.icon className="h-5.5 w-5.5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Main Charts & Activity Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Payments BarChart */}
        <Card className="lg:col-span-2 border-border/60 bg-card shadow-[var(--shadow-card)] rounded-2xl overflow-hidden p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-foreground font-sans">Payment Flow</h2>
              <p className="text-xs text-muted-foreground">Daily transactional volume for the last 7 active days</p>
            </div>
          </div>
          <div className="h-72">
            {(data?.chart.length ?? 0) === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-sm text-muted-foreground gap-2">
                <p>No payments recorded yet.</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.chart} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted/40" />
                  <XAxis dataKey="date" className="text-[10px] font-medium fill-muted-foreground" axisLine={false} tickLine={false} />
                  <YAxis className="text-[10px] font-medium fill-muted-foreground" axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-card)",
                      borderColor: "var(--color-border)",
                      borderRadius: "1rem",
                      boxShadow: "var(--shadow-elegant)",
                    }}
                    labelStyle={{ fontWeight: "bold", fontSize: "12px", color: "var(--color-foreground)" }}
                    itemStyle={{ fontSize: "12px", color: "var(--color-primary)" }}
                    formatter={(v: number) => [formatCurrency(v), "Volume"]}
                  />
                  <Bar dataKey="amount" fill="var(--color-primary)" radius={[6, 6, 0, 0]} maxBarSize={45} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        {/* Recent Payments Panel */}
        <Card className="border-border/60 bg-card shadow-[var(--shadow-card)] rounded-2xl overflow-hidden p-6">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-foreground font-sans">Recent Payments</h2>
            <p className="text-xs text-muted-foreground">Latest transactions processed</p>
          </div>
          <div className="space-y-4">
            {(data?.recent.length ?? 0) === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">No transactions found.</p>
              </div>
            ) : (
              data?.recent.map((p) => {
                const isSuccess = p.status === "paid";
                const isFail = p.status === "mismatch" || p.status === "duplicate";
                
                let badgeClass = "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-500/20";
                if (isSuccess) badgeClass = "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20";
                if (isFail) badgeClass = "bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-500/20";
                
                return (
                  <div key={p.id} className="flex items-center justify-between p-3.5 rounded-xl border border-border/40 hover:bg-muted/30 transition-colors duration-150">
                    <div className="space-y-1">
                      <p className="font-bold text-sm tracking-tight text-foreground">{p.reference ?? "Direct Payment"}</p>
                      <p className="text-xs text-muted-foreground font-medium">{formatDate(p.payment_date)} · <span className="uppercase text-[10px] font-bold text-primary">{p.source}</span></p>
                    </div>
                    <div className="text-right flex flex-col items-end gap-1.5">
                      <p className="font-extrabold text-sm text-foreground">{formatCurrency(Number(p.amount_paid))}</p>
                      <Badge variant="outline" className={`rounded-full px-2.5 py-0.5 text-[9px] font-bold tracking-wider uppercase border ${badgeClass}`}>
                        {p.status}
                      </Badge>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}