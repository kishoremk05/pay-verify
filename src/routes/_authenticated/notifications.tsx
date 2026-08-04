import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import {
  Bell,
  CheckCheck,
  Trash2,
  AlertTriangle,
  AlertCircle,
  RefreshCw,
  Sparkles,
  Loader2,
  Calendar,
  Filter,
} from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDate } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/notifications")({
  head: () => ({ meta: [{ title: "Notifications — Todellaa" }] }),
  component: NotificationsPage,
});

function NotificationsPage() {
  const { organization } = useAuth();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ["notifications-full", organization?.id],
    enabled: !!organization?.id,
    queryFn: async () => {
      const { data } = await (supabase as any)
        .from("notifications")
        .select("*")
        .eq("organization_id", organization!.id)
        .order("created_at", { ascending: false });
      return (data as any[]) ?? [];
    },
  });

  const filteredNotifications = notifications.filter((n) => {
    const statusMatch =
      filter === "all" ||
      (filter === "unread" && !n.is_read) ||
      (filter === "read" && n.is_read);

    const typeMatch = typeFilter === "all" || n.type === typeFilter;

    return statusMatch && typeMatch;
  });

  const markRead = async (id: string) => {
    if (!organization?.id) return;
    
    // Optimistic
    queryClient.setQueryData(
      ["notifications-full", organization.id],
      (old: any[] = []) => old.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
    queryClient.invalidateQueries({ queryKey: ["notifications", organization.id] });

    const { error } = await (supabase as any)
      .from("notifications")
      .update({ is_read: true })
      .eq("id", id);

    if (error) {
      toast.error(error.message);
      queryClient.invalidateQueries({ queryKey: ["notifications-full", organization.id] });
    }
  };

  const markAllRead = async () => {
    if (!organization?.id) return;
    const unread = notifications.filter((n) => !n.is_read);
    if (unread.length === 0) return;

    queryClient.setQueryData(
      ["notifications-full", organization.id],
      (old: any[] = []) => old.map((n) => ({ ...n, is_read: true }))
    );
    queryClient.invalidateQueries({ queryKey: ["notifications", organization.id] });

    const { error } = await (supabase as any)
      .from("notifications")
      .update({ is_read: true })
      .eq("organization_id", organization.id)
      .eq("is_read", false);

    if (error) {
      toast.error(error.message);
      queryClient.invalidateQueries({ queryKey: ["notifications-full", organization.id] });
    } else {
      toast.success("All notifications marked as read");
    }
  };

  const deleteNotification = async (id: string) => {
    if (!organization?.id) return;

    queryClient.setQueryData(
      ["notifications-full", organization.id],
      (old: any[] = []) => old.filter((n) => n.id !== id)
    );
    queryClient.invalidateQueries({ queryKey: ["notifications", organization.id] });

    const { error } = await (supabase as any)
      .from("notifications")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error(error.message);
      queryClient.invalidateQueries({ queryKey: ["notifications-full", organization.id] });
    } else {
      toast.success("Notification deleted");
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "mismatch":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case "duplicate":
        return <AlertCircle className="h-5 w-5 text-rose-500" />;
      case "refund_alert":
        return <RefreshCw className="h-5 w-5 text-cyan-400" />;
      default:
        return <Sparkles className="h-5 w-5 text-primary" />;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground font-sans">Notifications</h1>
          <p className="text-sm text-muted-foreground mt-1">Review system alerts, duplicate payments, and discrepancies.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={markAllRead}
            disabled={notifications.filter((n) => !n.is_read).length === 0}
            className="rounded-full font-semibold border-border/80 text-xs shadow-sm bg-card hover:bg-muted/80 gap-1.5 h-10 px-4"
          >
            <CheckCheck className="h-4 w-4 text-cyan-500" /> Mark all read
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {/* Filters Panel */}
        <Card className="md:col-span-1 border-border/60 bg-card/90 backdrop-blur-xl shadow-[var(--shadow-card)] rounded-2xl overflow-hidden p-5 space-y-6 h-fit">
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground/80 flex items-center gap-2">
              <Filter className="h-3.5 w-3.5" /> Filters
            </h3>
          </div>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Status</label>
              <div className="flex flex-col gap-1">
                {(["all", "unread", "read"] as const).map((s) => (
                  <Button
                    key={s}
                    variant={filter === s ? "secondary" : "ghost"}
                    onClick={() => setFilter(s)}
                    className="justify-start text-xs font-semibold capitalize h-9 rounded-lg"
                  >
                    {s}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Alert Type</label>
              <div className="flex flex-col gap-1">
                {["all", "mismatch", "duplicate", "refund_alert", "reminder"].map((t) => (
                  <Button
                    key={t}
                    variant={typeFilter === t ? "secondary" : "ghost"}
                    onClick={() => setTypeFilter(t)}
                    className="justify-start text-xs font-semibold capitalize h-9 rounded-lg"
                  >
                    {t.replace("_", " ")}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Notifications List */}
        <Card className="md:col-span-3 border-border/60 bg-card/90 backdrop-blur-xl shadow-[var(--shadow-card)] rounded-[2rem] overflow-hidden min-h-[500px]">
          <CardHeader className="pb-4 pt-6 border-b border-border/40 px-6 sm:px-8">
            <CardTitle className="text-lg font-bold tracking-tight">Alert Center</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-40 text-muted-foreground gap-3">
                <Loader2 className="h-7 w-7 animate-spin text-primary" />
                <span className="text-sm font-semibold">Syncing notifications ledger...</span>
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-40 text-center px-4">
                <div className="h-14 w-14 rounded-full bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-bold tracking-tight text-foreground font-sans">No notifications found</h3>
                <p className="mt-1.5 max-w-sm mx-auto text-sm text-muted-foreground font-medium">
                  Your workspace is clean. Try adjusting filters or check back later.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border/40">
                {filteredNotifications.map((n) => (
                  <div
                    key={n.id}
                    className={`flex items-start gap-4 p-6 sm:p-8 transition-all duration-200 hover:bg-muted/10 ${
                      !n.is_read ? "bg-cyan-500/[0.01]" : ""
                    }`}
                  >
                    <div className="mt-1 shrink-0">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center border ${
                        !n.is_read
                          ? "bg-background border-border shadow-sm"
                          : "bg-muted/20 border-border/40"
                      }`}>
                        {getIcon(n.type)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h4 className={`text-sm tracking-tight ${!n.is_read ? "font-bold text-foreground" : "font-semibold text-muted-foreground"}`}>
                          {n.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground shrink-0 font-medium">
                          <Calendar className="h-3.5 w-3.5" />
                          {formatDate(n.created_at)} at {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground/95 leading-relaxed break-words font-medium pr-8">
                        {n.message}
                      </p>
                      <div className="pt-2 flex items-center gap-2">
                        {!n.is_read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markRead(n.id)}
                            className="text-xs h-7 hover:bg-muted font-bold text-cyan-500 hover:text-cyan-600 rounded-full"
                          >
                            Mark Read
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteNotification(n.id)}
                          className="h-7 w-7 text-muted-foreground/50 hover:text-rose-500 rounded-full"
                          aria-label="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
