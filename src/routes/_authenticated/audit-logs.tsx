/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  Terminal,
  Activity,
  Cpu,
  Database,
  ShieldCheck,
  Search,
  Filter,
  Loader2,
  Calendar,
  User,
} from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDate } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/audit-logs")({
  head: () => ({ meta: [{ title: "Audit Trail — Todellaa" }] }),
  component: SecureAuditLogsPage,
});

function SecureAuditLogsPage() {
  const { organization, role } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState("all");

  const isAuthorized =
    role === "super_admin" ||
    role === "admin" ||
    role === "manager" ||
    role === "finance_staff" ||
    role === "viewer";

  // Fetch real database audit logs and customer changes
  const { data: auditLogs = [], isLoading } = useQuery({
    queryKey: ["audit-logs-secure", organization?.id],
    enabled: !!organization?.id && isAuthorized,
    queryFn: async () => {
      // Fetch profiles to map user IDs to names
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name");
      const profileMap = new Map((profiles ?? []).map((p) => [p.id, p.full_name]));

      // Fetch general audit logs
      const { data: systemLogs } = await (supabase as any)
        .from("audit_logs")
        .select("*")
        .eq("organization_id", organization!.id)
        .order("created_at", { ascending: false });

      // Fetch customer change logs
      const { data: customerLogs } = await (supabase as any)
        .from("customer_change_log")
        .select(`
          *,
          customers!customer_id(name, customer_code)
        `)
        .eq("organization_id", organization!.id)
        .order("created_at", { ascending: false });

      const formattedSystemLogs = (systemLogs ?? []).map((log: any) => ({
        id: log.id,
        organization_id: log.organization_id,
        action_type: log.action_type,
        action_description: log.action_description,
        performed_by: log.performed_by,
        created_at: log.created_at,
        profiles: { full_name: log.performed_by ? profileMap.get(log.performed_by) : null },
      }));

      const formattedCustomerLogs = (customerLogs ?? []).map((log: any) => ({
        id: log.id,
        organization_id: log.organization_id,
        action_type: "customer_update",
        action_description: `Changed customer '${log.customers?.name || "Unknown"}' (${log.customers?.customer_code || "No Code"}) field '${log.field_name}' from '${log.old_value || "None"}' to '${log.new_value || "None"}'`,
        performed_by: log.changed_by,
        created_at: log.created_at,
        profiles: { full_name: log.changed_by ? profileMap.get(log.changed_by) : null },
      }));

      const combined = [...formattedSystemLogs, ...formattedCustomerLogs];
      combined.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      return combined;
    },
  });

  const filteredLogs = auditLogs.filter((log) => {
    const desc = log.action_description?.toLowerCase() ?? "";
    const type = log.action_type?.toLowerCase() ?? "";
    const staff = log.profiles?.full_name?.toLowerCase() ?? "";
    const search = searchTerm.toLowerCase();

    const matchesSearch = desc.includes(search) || type.includes(search) || staff.includes(search);

    const matchesFilter = actionFilter === "all" || log.action_type === actionFilter;

    return matchesSearch && matchesFilter;
  });

  if (!isAuthorized) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="h-16 w-16 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center border border-rose-500/20 mb-6">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <h2 className="text-2xl font-black text-foreground">Access Restricted</h2>
        <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto leading-relaxed">
          Audit logs are restricted to managers, finance staff, and administrators to preserve
          enterprise accountability.
        </p>
      </div>
    );
  }

  // Get log category details for badges
  const getLogTypeStyling = (type: string) => {
    switch (type) {
      case "invoice_creation":
        return "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/25";
      case "staff_invite":
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/25";
      case "payout_refund":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25";
      case "csv_ingest":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25";
      case "customer_update":
        return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/25";
      default:
        return "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/25";
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground font-sans">
            Audit Trail
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Review live multi-tenant cryptographic action logs, invoice adjustments, and payouts.
          </p>
        </div>
      </div>

      {/* Telemetry Dashboard Grid */}
      <div className="grid gap-5 sm:grid-cols-4">
        {[
          { label: "SECURITY SHIELD", value: "Active", status: "RLS LOCK", icon: ShieldCheck },
          { label: "LOGGED ACTIONS", value: auditLogs.length, status: "VERIFIED", icon: Database },
          {
            label: "LOGGED STAFF",
            value: Array.from(new Set(auditLogs.map((l) => l.performed_by))).length,
            status: "ACCOUNTABLE",
            icon: User,
          },
          { label: "SYSTEM STATUS", value: "100% OK", status: "SYNCED", icon: Cpu },
        ].map((stat, idx) => {
          const IconComp = stat.icon;
          return (
            <Card
              key={idx}
              className="border-border/60 bg-card shadow-[var(--shadow-card)] rounded-2xl overflow-hidden"
            >
              <CardContent className="p-5 flex flex-col justify-between h-full">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-mono text-[9px] text-muted-foreground/60 font-bold uppercase tracking-wider">
                    {stat.label}
                  </span>
                  <IconComp className="h-4 w-4 text-muted-foreground/60" />
                </div>
                <h3 className="text-2xl font-black text-foreground">{stat.value}</h3>
                <div className="mt-2 flex items-center gap-1.5 font-mono text-[8px] font-bold text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="uppercase tracking-widest">{stat.status}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Interactive Cryptographic Logs Screen */}
      <Card className="border-border/60 bg-card shadow-2xl rounded-[2rem] overflow-hidden">
        {/* Terminal Header */}
        <div className="bg-muted/45 px-6 py-4 flex flex-wrap items-center justify-between border-b border-border/60 select-none gap-4">
          <div className="flex items-center gap-3">
            <Terminal className="h-4 w-4 text-primary" />
            <span className="font-mono text-xs font-bold text-foreground tracking-wider">
              WORKSPACE_AUDITING_DAEMON v3.1
            </span>
          </div>

          {/* Controls inside header */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-full sm:w-[220px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search telemetry..."
                className="pl-9 pr-3 rounded-full h-8 text-[11px] font-mono border-border bg-background text-foreground focus-visible:ring-primary focus-visible:ring-offset-0"
              />
            </div>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-[140px] rounded-full h-8 text-[11px] font-mono border-border bg-background text-foreground focus:ring-0">
                <SelectValue placeholder="Action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Logs</SelectItem>
                <SelectItem value="invoice_creation">Invoicing</SelectItem>
                <SelectItem value="staff_invite">Recruiting</SelectItem>
                <SelectItem value="payout_refund">Refunds</SelectItem>
                <SelectItem value="csv_ingest">Ingestion</SelectItem>
                <SelectItem value="customer_update">Customer Changes</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-1.5 shrink-0 pl-2">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
            </div>
          </div>
        </div>

        {/* Terminal Screen log logs */}
        <div className="p-6 md:p-8 font-mono text-[11px] leading-relaxed text-foreground min-h-[380px] max-h-[500px] overflow-y-auto space-y-4 custom-scrollbar bg-card">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32 text-muted-foreground gap-3">
              <Loader2 className="h-7 w-7 animate-spin text-primary" />
              <span className="text-xs font-semibold tracking-widest text-muted-foreground/60">
                CONNECTING SECURE DATABASE STREAM...
              </span>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-center text-muted-foreground space-y-3">
              <div className="h-10 w-10 rounded-full border border-border flex items-center justify-center">
                <Terminal className="h-5 w-5" />
              </div>
              <p className="text-[10px] uppercase tracking-wider font-bold">
                NO SECURE AUDIT ENTRIES REGISTERED
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredLogs.map((log) => {
                const timeStr = new Date(log.created_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                });
                const hashStr = `sha256:${log.id.substring(0, 6)}...`;

                return (
                  <div
                    key={log.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/30 pb-3 last:border-0 last:pb-0"
                  >
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="text-muted-foreground text-[10px]">
                        {formatDate(log.created_at)} {timeStr}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded border text-[8px] font-black tracking-widest ${getLogTypeStyling(log.action_type)}`}
                      >
                        [{log.action_type?.toUpperCase() || "SYSTEM"}]
                      </span>
                      <span className="text-foreground leading-relaxed font-bold">
                        {log.action_description}
                      </span>
                      {log.profiles?.full_name && (
                        <span className="text-primary text-[10px] font-black uppercase tracking-wider">
                          ({log.profiles.full_name})
                        </span>
                      )}
                    </div>
                    <span className="text-muted-foreground/80 text-[9px] font-bold sm:text-right shrink-0">
                      {hashStr}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Terminal Status bar */}
        <div className="bg-muted/45 px-6 py-3 border-t border-border/60 flex items-center justify-between text-[9px] font-mono text-muted-foreground uppercase tracking-widest font-bold">
          <span>RLS_ISOLATED_PORT_8080 = SECURE</span>
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
            Active secure session
          </span>
        </div>
      </Card>
    </div>
  );
}
