/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import {
  RotateCcw,
  Plus,
  AlertTriangle,
  DollarSign,
  User,
  Calendar,
  CheckCircle,
  FileText,
  Search,
  Loader2,
  Lock,
  XCircle,
  Check,
  Eye,
  Info,
} from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency, formatDate } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/refunds")({
  head: () => ({ meta: [{ title: "Refunds — PayVerify" }] }),
  component: RefundsPage,
});

const BACKEND_URL = (import.meta as any).env?.VITE_BACKEND_URL || "http://localhost:5000";

function RefundsPage() {
  const { organization, user, role } = useAuth();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isProcessOpen, setIsProcessOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "all" | "pending" | "approved" | "completed" | "rejected"
  >("all");

  // Form states
  const [customerId, setCustomerId] = useState("");
  const [paymentId, setPaymentId] = useState("");
  const [refundAmount, setRefundAmount] = useState("");
  const [reason, setReason] = useState("");
  const [processing, setProcessing] = useState(false);

  // Detail Modal States
  const [selectedRefund, setSelectedRefund] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Fetch refunds with rich joins (including custom alias fields)
  const { data: refunds = [], isLoading: refundsLoading } = useQuery({
    queryKey: ["refunds", organization?.id],
    enabled: !!organization?.id && (role as any) !== "viewer",
    queryFn: async () => {
      const { data } = await (supabase as any)
        .from("refunds")
        .select(
          `
          *,
          customers!customer_id (id, name, customer_code),
          payments!payment_id (id, reference, amount_paid, payment_date, transaction_id)
        `,
        )
        .eq("organization_id", organization!.id)
        .order("created_at", { ascending: false });
      return (data as any[]) ?? [];
    },
  });

  // Fetch discrepancy alerts (alerts table)
  const { data: alerts = [], isLoading: alertsLoading } = useQuery({
    queryKey: ["discrepancy-alerts", organization?.id],
    enabled: !!organization?.id,
    queryFn: async () => {
      const { data } = await (supabase as any)
        .from("alerts")
        .select(
          `
          *,
          invoices (id, invoice_number, amount),
          payments (id, reference, amount_paid, payment_date, customers (id, name, customer_code))
        `,
        )
        .eq("organization_id", organization!.id)
        .eq("is_resolved", false)
        .order("created_at", { ascending: false });
      return (data as any[]) ?? [];
    },
  });

  // Fetch customers for dropdown
  const { data: customers = [] } = useQuery({
    queryKey: ["customers-list", organization?.id],
    enabled: !!organization?.id,
    queryFn: async () => {
      const { data } = await supabase
        .from("customers")
        .select("id, name, customer_code, due_amount, expected_amount")
        .eq("organization_id", organization!.id)
        .order("name", { ascending: true });
      return data ?? [];
    },
  });

  // Fetch payments for selected customer (for refund dropdown)
  const { data: selectedCustomerPayments = [] } = useQuery({
    queryKey: ["customer-payments", customerId],
    enabled: !!customerId,
    queryFn: async () => {
      const { data } = await supabase
        .from("payments")
        .select("id, amount_paid, reference, status, payment_date, transaction_id")
        .eq("customer_id", customerId)
        .order("payment_date", { ascending: false });
      return data ?? [];
    },
  });

  if ((role as any) === "viewer") {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center animate-fade-in">
        <div className="h-16 w-16 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center border border-rose-500/20 mb-6">
          <Lock className="h-6 w-6" />
        </div>
        <h2 className="text-2xl font-black text-foreground">Access Restricted</h2>
        <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto leading-relaxed">
          Refund auditing and processed payouts ledger are restricted for your role. Contact your
          workspace admin for details.
        </p>
      </div>
    );
  }

  // Manual create refund payout request
  const handleProcessRefund = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!organization?.id || !user?.id) return;
    if (!customerId || !refundAmount || !reason) {
      return toast.error("Please fill in all required fields");
    }

    const amt = parseFloat(refundAmount);
    if (isNaN(amt) || amt <= 0) {
      return toast.error("Please enter a valid amount greater than zero");
    }

    setProcessing(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/refunds/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organization_id: organization.id,
          customer_id: customerId,
          payment_id: paymentId || null,
          refund_amount: amt,
          reason: reason,
          processed_by: user.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create refund payout request");
      }

      toast.success("Refund request created in PENDING status.");
      setIsProcessOpen(false);

      // Reset form
      setCustomerId("");
      setPaymentId("");
      setRefundAmount("");
      setReason("");

      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ["refunds", organization.id] });
      queryClient.invalidateQueries({ queryKey: ["discrepancy-alerts", organization.id] });
    } catch (error: any) {
      toast.error(error.message || "Failed to initiate refund");
    } finally {
      setProcessing(false);
    }
  };

  // Staff approves refund
  const handleApproveRefund = async (refundId: string) => {
    setProcessing(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/refunds/${refundId}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approved_by: user?.id }),
      });
      if (!res.ok) throw new Error("Approval failed");
      toast.success("Refund request successfully approved.");
      setIsDetailOpen(false);
      queryClient.invalidateQueries({ queryKey: ["refunds", organization?.id] });
    } catch (err: any) {
      toast.error(err.message || "Failed to approve refund");
    } finally {
      setProcessing(false);
    }
  };

  // Staff rejects refund
  const handleRejectRefund = async (refundId: string) => {
    setProcessing(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/refunds/${refundId}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rejected_by: user?.id }),
      });
      if (!res.ok) throw new Error("Rejection failed");
      toast.success("Refund request rejected successfully.");
      setIsDetailOpen(false);
      queryClient.invalidateQueries({ queryKey: ["refunds", organization?.id] });
    } catch (err: any) {
      toast.error(err.message || "Failed to reject refund");
    } finally {
      setProcessing(false);
    }
  };

  // Staff marks approved refund as completed (Payout Done)
  const handleCompleteRefund = async (refundId: string) => {
    setProcessing(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/refunds/${refundId}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed_by: user?.id }),
      });
      if (!res.ok) throw new Error("Completion failed");
      toast.success("Refund payout completed. Ledgers and balance alerts resolved!");
      setIsDetailOpen(false);
      queryClient.invalidateQueries({ queryKey: ["refunds", organization?.id] });
      queryClient.invalidateQueries({ queryKey: ["discrepancy-alerts", organization?.id] });
    } catch (err: any) {
      toast.error(err.message || "Failed to complete refund payout");
    } finally {
      setProcessing(false);
    }
  };

  // Filter refunds based on search term AND active tab
  const filteredRefunds = refunds.filter((ref) => {
    // 1. Search filter
    const custName = ref.customers?.name?.toLowerCase() ?? "";
    const custCode = ref.customers?.customer_code?.toLowerCase() ?? "";
    const pRef = ref.payments?.reference?.toLowerCase() ?? "";
    const pTxId = ref.payments?.transaction_id?.toLowerCase() ?? "";
    const pId = ref.payments?.id?.toLowerCase() ?? "";
    const reas = ref.reason.toLowerCase();
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      custName.includes(search) ||
      custCode.includes(search) ||
      pRef.includes(search) ||
      pTxId.includes(search) ||
      pId.includes(search) ||
      reas.includes(search);

    // 2. Tab filter
    const status = ref.status || "pending";
    const matchesTab = activeTab === "all" || status === activeTab;

    return matchesSearch && matchesTab;
  });

  // Calculate KPIs
  const totalCompletedRefunded = refunds
    .filter((r) => r.status === "completed")
    .reduce((sum, r) => sum + Number(r.refund_amount), 0);

  const totalPendingRefund = refunds
    .filter((r) => r.status === "pending")
    .reduce((sum, r) => sum + Number(r.refund_amount), 0);

  const totalApprovedRefund = refunds
    .filter((r) => r.status === "approved")
    .reduce((sum, r) => sum + Number(r.refund_amount), 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge
            variant="outline"
            className="rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20 text-[10px] font-black uppercase tracking-wider"
          >
            Completed
          </Badge>
        );
      case "approved":
        return (
          <Badge
            variant="outline"
            className="rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-500/20 text-[10px] font-black uppercase tracking-wider animate-pulse"
          >
            Approved (Awaiting Payout)
          </Badge>
        );
      case "rejected":
        return (
          <Badge
            variant="outline"
            className="rounded-full bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-500/20 text-[10px] font-black uppercase tracking-wider"
          >
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge
            variant="outline"
            className="rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-500/20 text-[10px] font-black uppercase tracking-wider"
          >
            Pending Approval
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground font-sans">
            Refund Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Audit overpayments, resolve receipts mismatch, and manage financial payouts.
          </p>
        </div>

        <Dialog open={isProcessOpen} onOpenChange={setIsProcessOpen}>
          <DialogTrigger asChild>
            <Button
              shape="pill"
              className="font-semibold shadow-md bg-primary hover:bg-primary/95 text-white gap-2 px-6"
            >
              <Plus className="h-4.5 w-4.5" /> Request Payout / Refund
            </Button>
          </DialogTrigger>
          <DialogContent className="border border-border/60 bg-card shadow-[var(--shadow-elegant)] rounded-3xl p-6 sm:p-8 max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                <RotateCcw className="h-5 w-5 text-indigo-500" /> Initiate Payout Request
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Record a custom manual refund payout request. Requires manager verification prior to
                execution.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleProcessRefund} className="space-y-5 py-2">
              <div className="space-y-2">
                <Label
                  htmlFor="customer"
                  className="text-xs font-bold text-muted-foreground/80 pl-1 uppercase tracking-wider"
                >
                  Select Customer <span className="text-rose-500">*</span>
                </Label>
                <Select value={customerId} onValueChange={setCustomerId}>
                  <SelectTrigger className="rounded-full px-5 h-11 border-border/80">
                    <SelectValue placeholder="Pick a customer..." />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name} ({c.customer_code || "No Code"})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {customerId && (
                <div className="space-y-2">
                  <Label
                    htmlFor="payment"
                    className="text-xs font-bold text-muted-foreground/80 pl-1 uppercase tracking-wider"
                  >
                    Linked Payment Transaction (Optional)
                  </Label>
                  <Select value={paymentId} onValueChange={setPaymentId}>
                    <SelectTrigger className="rounded-full px-5 h-11 border-border/80">
                      <SelectValue placeholder="Pick a payment transaction..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Linked Payment (Manual Ledger Entry)</SelectItem>
                      {selectedCustomerPayments.map((p) => {
                        const displayRef = p.reference
                          ? `Ref: ${p.reference}`
                          : p.transaction_id
                            ? `TxID: ${p.transaction_id}`
                            : `PayID: ${p.id.slice(0, 8)}`;
                        return (
                          <SelectItem key={p.id} value={p.id}>
                            {displayRef} ({formatCurrency(p.amount_paid)}) - Date: {p.payment_date}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label
                  htmlFor="amount"
                  className="text-xs font-bold text-muted-foreground/80 pl-1 uppercase tracking-wider"
                >
                  Refund Amount (NGN) <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(e.target.value)}
                  placeholder="e.g. 10000"
                  className="rounded-full px-5 h-11 border-border/80"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="reason"
                  className="text-xs font-bold text-muted-foreground/80 pl-1 uppercase tracking-wider"
                >
                  Justification / Reason <span className="text-rose-500">*</span>
                </Label>
                <Textarea
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Provide justification details for audit records..."
                  className="rounded-2xl px-5 py-3 min-h-[90px] border-border/80 focus-visible:ring-primary"
                  required
                />
              </div>

              <DialogFooter className="pt-4 gap-2 sm:gap-0">
                <Button
                  type="button"
                  variant="ghost"
                  shape="pill"
                  onClick={() => setIsProcessOpen(false)}
                  className="font-semibold px-5 rounded-full"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={processing}
                  shape="pill"
                  className="font-semibold shadow-md bg-primary hover:bg-primary/95 text-white px-6 rounded-full"
                >
                  {processing ? <Loader2 className="h-4.5 w-4.5 animate-spin mr-2" /> : null}
                  Submit Request
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Discrepancy Alerts and KPI Metrics */}
      <div className="grid gap-6 lg:grid-cols-4">
        {/* Metric Cards */}
        <div className="grid gap-4 sm:grid-cols-3 lg:col-span-3">
          <Card className="border-border/60 bg-card shadow-[var(--shadow-card)] rounded-2xl overflow-hidden hover:scale-[1.01] transition-transform duration-200">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Total Refund Payouts
                </p>
                <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
                  {formatCurrency(totalCompletedRefunded)}
                </h3>
              </div>
              <div className="h-10 w-10 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20">
                <CheckCircle className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-card shadow-[var(--shadow-card)] rounded-2xl overflow-hidden hover:scale-[1.01] transition-transform duration-200">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Pending Approvals
                </p>
                <h3 className="text-2xl font-black text-amber-500 tracking-tight">
                  {formatCurrency(totalPendingRefund)}
                </h3>
              </div>
              <div className="h-10 w-10 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center border border-amber-500/20">
                <AlertTriangle className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-card shadow-[var(--shadow-card)] rounded-2xl overflow-hidden hover:scale-[1.01] transition-transform duration-200">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Approved (Awaiting Payout)
                </p>
                <h3 className="text-2xl font-black text-indigo-500 tracking-tight">
                  {formatCurrency(totalApprovedRefund)}
                </h3>
              </div>
              <div className="h-10 w-10 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center border border-indigo-500/20">
                <RotateCcw className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts KPI */}
        <Card className="lg:col-span-1 border-border/60 bg-card shadow-[var(--shadow-card)] rounded-2xl overflow-hidden hover:scale-[1.01] transition-transform duration-200">
          <CardContent className="p-6 flex items-center justify-between h-full">
            <div className="space-y-1">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Discrepancy Alerts
              </p>
              <h3 className="text-2xl font-black text-rose-500 tracking-tight">
                {alerts.length} Unresolved
              </h3>
            </div>
            <div className="h-10 w-10 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center border border-rose-500/20">
              <AlertTriangle className="h-5 w-5 animate-bounce" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overpayment / Discrepancy Action Center */}
      {alerts.length > 0 && (
        <Card className="border-rose-500/20 bg-rose-500/5 shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="pb-3 pt-5 px-6 border-b border-rose-500/10">
            <CardTitle className="text-xs font-black text-rose-600 dark:text-rose-400 uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 animate-pulse" /> Urgent Overpayments Action Center
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground/80 mt-0.5">
              These client payments exceed invoice requirements. Click "Create Refund Request" to
              pre-fill an automated payout refund request.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 overflow-y-auto max-h-[220px]">
            <div className="divide-y divide-rose-500/10">
              {alerts.map((a) => {
                const customer = a.payments?.customers;
                const paymentAmount = Number(a.payments?.amount_paid || 0);
                const invoiceAmount = Number(a.invoices?.amount || 0);
                const excess = paymentAmount - invoiceAmount;

                return (
                  <div
                    key={a.id}
                    className="px-6 py-4.5 flex flex-wrap gap-4 justify-between items-center bg-rose-500/[0.01] hover:bg-rose-500/[0.04] transition-colors"
                  >
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-foreground font-sans">
                          {customer?.name || "Customer Reference"}
                        </span>
                        <Badge className="bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 text-[9px] font-black uppercase tracking-wider border-none">
                          Overpayment ₦{excess.toLocaleString()}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-muted-foreground font-medium mt-0.5">
                        Invoice Expectation: ₦{invoiceAmount.toLocaleString()} | Client Paid: ₦
                        {paymentAmount.toLocaleString()}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setCustomerId(customer?.id || "");
                        setPaymentId(a.payments?.id || "");
                        setRefundAmount(String(excess));
                        setReason(
                          `Automated refund request for overpayment. Invoice Expectation: ₦${invoiceAmount.toLocaleString()} vs Paid: ₦${paymentAmount.toLocaleString()}.`,
                        );
                        setIsProcessOpen(true);
                      }}
                      className="rounded-full h-8 px-4 text-xs font-bold border-rose-500/25 bg-card hover:bg-rose-500/10 text-rose-600 shadow-sm shrink-0"
                    >
                      Process Payout
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Refunds History and Lifecycle Management Board */}
      <Card className="border-border/60 bg-card/90 backdrop-blur-xl shadow-[var(--shadow-card)] rounded-[2rem] overflow-hidden">
        {/* Header and Controls */}
        <div className="p-6 border-b border-border/40 flex flex-wrap gap-4 items-center justify-between bg-muted/10">
          <div className="flex items-center gap-1.5 scrollbar-none overflow-x-auto py-1">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all shrink-0 ${
                activeTab === "all"
                  ? "bg-primary text-white shadow-sm"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              All Refunds
            </button>
            <button
              onClick={() => setActiveTab("pending")}
              className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all shrink-0 ${
                activeTab === "pending"
                  ? "bg-amber-500 text-white shadow-sm"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              Pending Approval
            </button>
            <button
              onClick={() => setActiveTab("approved")}
              className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all shrink-0 ${
                activeTab === "approved"
                  ? "bg-indigo-500 text-white shadow-sm"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              Approved
            </button>
            <button
              onClick={() => setActiveTab("completed")}
              className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all shrink-0 ${
                activeTab === "completed"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              Completed
            </button>
            <button
              onClick={() => setActiveTab("rejected")}
              className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all shrink-0 ${
                activeTab === "rejected"
                  ? "bg-rose-500 text-white shadow-sm"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              Rejected
            </button>
          </div>

          <div className="relative w-full sm:w-[260px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by client or reason..."
              className="pl-10 pr-5 rounded-full h-10 border-border/80"
            />
          </div>
        </div>

        {/* Board Table Contents */}
        <CardContent className="p-0 overflow-x-auto">
          {refundsLoading ? (
            <div className="flex flex-col items-center justify-center py-32 text-muted-foreground gap-3">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span className="text-xs font-semibold">Aligning refund board...</span>
            </div>
          ) : filteredRefunds.length === 0 ? (
            <div className="py-24 text-center">
              <div className="mx-auto h-12 w-12 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                <RotateCcw className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-sm font-bold text-foreground">No refund records found</h3>
              <p className="mt-1 text-xs text-muted-foreground font-medium">
                Draft refund billing payouts to launch records here.
              </p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="border-b border-border/40 text-[10px] font-black uppercase text-muted-foreground bg-muted/20">
                  <th className="py-4.5 px-6 font-black">Client Name</th>
                  <th className="py-4.5 px-6 font-black">Linked Payment</th>
                  <th className="py-4.5 px-6 font-black">Refund Amount</th>
                  <th className="py-4.5 px-6 font-black">Justification</th>
                  <th className="py-4.5 px-6 font-black">Status</th>
                  <th className="py-4.5 px-6 font-black">Requested On</th>
                  <th className="py-4.5 px-6 font-black text-right pr-6">Workflow Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {filteredRefunds.map((ref) => (
                  <tr
                    key={ref.id}
                    className="hover:bg-muted/10 transition-colors duration-150 border-b border-border/30 last:border-b-0"
                  >
                    <td className="py-4.5 px-6 text-xs font-bold text-foreground">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground/60" />
                        <div>
                          <div className="font-bold">
                            {ref.customers?.name || "Deleted Customer"}
                          </div>
                          <div className="text-[10px] text-muted-foreground mt-0.5">
                            {ref.customers?.customer_code || "—"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4.5 px-6 text-xs font-medium text-foreground">
                      {ref.payments ? (
                        <div className="flex items-center gap-1">
                          <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="font-mono">
                            {ref.payments.reference
                              ? `Ref: ${ref.payments.reference}`
                              : ref.payments.transaction_id
                                ? `TxID: ${ref.payments.transaction_id}`
                                : `PayID: ${ref.payments.id.slice(0, 8)}`}
                          </span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-[10px] italic">
                          No linked payment
                        </span>
                      )}
                    </td>
                    <td className="py-4.5 px-6 text-xs font-bold text-indigo-500">
                      -{formatCurrency(ref.refund_amount)}
                    </td>
                    <td
                      className="py-4.5 px-6 text-xs font-medium text-muted-foreground max-w-[200px] truncate"
                      title={ref.reason}
                    >
                      {ref.reason}
                    </td>
                    <td className="py-4.5 px-6 text-xs font-medium">
                      {getStatusBadge(ref.status)}
                    </td>
                    <td className="py-4.5 px-6 text-xs font-medium text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDate(ref.created_at)}
                      </div>
                    </td>
                    <td className="py-4.5 px-6 text-xs font-medium text-right pr-6 space-x-1.5 whitespace-nowrap">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setSelectedRefund(ref);
                          setIsDetailOpen(true);
                        }}
                        className="rounded-full h-8 w-8 p-0"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Button>

                      {ref.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleApproveRefund(ref.id)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-bold px-3 h-8 text-[11px]"
                          >
                            <Check className="h-3 w-3 mr-1" /> Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleRejectRefund(ref.id)}
                            className="bg-rose-600 hover:bg-rose-700 text-white rounded-full font-bold px-3 h-8 text-[11px]"
                          >
                            <XCircle className="h-3 w-3 mr-1" /> Reject
                          </Button>
                        </>
                      )}

                      {ref.status === "approved" && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleCompleteRefund(ref.id)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-bold px-3.5 h-8 text-[11px]"
                          >
                            <DollarSign className="h-3 w-3 mr-0.5" /> Complete Payout
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRejectRefund(ref.id)}
                            className="border-rose-500/30 text-rose-500 hover:bg-rose-500/5 rounded-full font-bold px-3 h-8 text-[11px]"
                          >
                            <XCircle className="h-3 w-3 mr-1" /> Reject
                          </Button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {/* ─── Refund Detail & Payout Audit Trail Modal ─── */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="border border-border/60 bg-card rounded-3xl p-6 sm:p-8 max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-foreground flex items-center gap-2">
              <Info className="h-5 w-5 text-indigo-500" /> Refund Request Audit Trail
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Review transaction, history, and status change validations for this request.
            </DialogDescription>
          </DialogHeader>

          {selectedRefund && (
            <div className="space-y-5 py-3">
              {/* Financial Ledger Section */}
              <div className="bg-muted/10 border border-border/60 rounded-2xl p-4 text-xs space-y-2">
                <h4 className="font-black uppercase tracking-wider text-muted-foreground text-[10px]">
                  Financial Ledger
                </h4>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Customer Name</span>
                  <span className="font-bold">{selectedRefund.customers?.name || "Deleted"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Refund Value</span>
                  <span className="font-black text-rose-500">
                    {formatCurrency(selectedRefund.refund_amount)}
                  </span>
                </div>
                {selectedRefund.payments && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Original Payment</span>
                    <span className="font-mono font-semibold">
                      {selectedRefund.payments.reference
                        ? `Ref: ${selectedRefund.payments.reference}`
                        : selectedRefund.payments.transaction_id
                          ? `TxID: ${selectedRefund.payments.transaction_id}`
                          : `PayID: ${selectedRefund.payments.id.slice(0, 8)}`}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Reason / Purpose</span>
                  <span
                    className="font-medium text-right max-w-[200px] truncate"
                    title={selectedRefund.reason}
                  >
                    {selectedRefund.reason}
                  </span>
                </div>
              </div>

              {/* Status Audit Trail Timeline */}
              <div className="space-y-3.5 pl-2">
                <h4 className="font-black uppercase tracking-wider text-muted-foreground text-[10px]">
                  Lifecycle Timeline
                </h4>

                <div className="relative border-l border-border/60 ml-3.5 space-y-5 pl-5 py-1">
                  {/* Step 1: Requested */}
                  <div className="relative">
                    <span className="absolute -left-[27px] top-0 bg-indigo-500 text-white rounded-full h-4.5 w-4.5 flex items-center justify-center text-[9px] font-bold">
                      1
                    </span>
                    <div>
                      <h5 className="text-xs font-bold text-foreground">Refund Request Created</h5>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        Initiated by staff:{" "}
                        <strong className="text-foreground">
                          {selectedRefund.profiles?.full_name || "System automated"}
                        </strong>{" "}
                        on {formatDate(selectedRefund.created_at)}
                      </p>
                    </div>
                  </div>

                  {/* Step 2: Approved */}
                  {(selectedRefund.approved_at || selectedRefund.status === "pending") && (
                    <div className="relative">
                      <span
                        className={`absolute -left-[27px] top-0 rounded-full h-4.5 w-4.5 flex items-center justify-center text-[9px] font-bold ${
                          selectedRefund.approved_at
                            ? "bg-emerald-500 text-white"
                            : "bg-muted text-muted-foreground border border-border/80"
                        }`}
                      >
                        2
                      </span>
                      <div>
                        <h5 className="text-xs font-bold text-foreground">Manager Approval</h5>
                        {selectedRefund.approved_at ? (
                          <p className="text-[10px] text-muted-foreground mt-0.5">
                            Approved by Manager on {formatDate(selectedRefund.approved_at)}
                          </p>
                        ) : (
                          <p className="text-[10px] text-muted-foreground/60 italic mt-0.5">
                            Awaiting manager validation review...
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Step 3: Completed or Rejected */}
                  {selectedRefund.status === "rejected" ? (
                    <div className="relative">
                      <span className="absolute -left-[27px] top-0 bg-rose-500 text-white rounded-full h-4.5 w-4.5 flex items-center justify-center text-[9px] font-bold">
                        ✗
                      </span>
                      <div>
                        <h5 className="text-xs font-bold text-rose-500">Refund Payout Rejected</h5>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          Rejected by staff on{" "}
                          {formatDate(selectedRefund.rejected_at || selectedRefund.updated_at)}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="relative">
                      <span
                        className={`absolute -left-[27px] top-0 rounded-full h-4.5 w-4.5 flex items-center justify-center text-[9px] font-bold ${
                          selectedRefund.completed_at
                            ? "bg-emerald-600 text-white"
                            : "bg-muted text-muted-foreground border border-border/80"
                        }`}
                      >
                        3
                      </span>
                      <div>
                        <h5 className="text-xs font-bold text-foreground">Completed Payout</h5>
                        {selectedRefund.completed_at ? (
                          <p className="text-[10px] text-muted-foreground mt-0.5">
                            Payout completed on {formatDate(selectedRefund.completed_at)}
                          </p>
                        ) : (
                          <p className="text-[10px] text-muted-foreground/60 italic mt-0.5">
                            Awaiting final payment routing execution...
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions in Detail Modal */}
              <div className="flex gap-2.5 justify-end pt-4 border-t border-border/40">
                {selectedRefund.status === "pending" && (
                  <>
                    <Button
                      variant="outline"
                      className="border-rose-500/20 hover:bg-rose-500/10 text-rose-500 font-bold rounded-full px-5 text-xs"
                      disabled={processing}
                      onClick={() => handleRejectRefund(selectedRefund.id)}
                    >
                      Reject Request
                    </Button>
                    <Button
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-full px-5 text-xs"
                      disabled={processing}
                      onClick={() => handleApproveRefund(selectedRefund.id)}
                    >
                      Approve Request
                    </Button>
                  </>
                )}

                {selectedRefund.status === "approved" && (
                  <>
                    <Button
                      variant="outline"
                      className="border-rose-500/20 hover:bg-rose-500/10 text-rose-500 font-bold rounded-full px-5 text-xs"
                      disabled={processing}
                      onClick={() => handleRejectRefund(selectedRefund.id)}
                    >
                      Reject Request
                    </Button>
                    <Button
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-full px-5 text-xs"
                      disabled={processing}
                      onClick={() => handleCompleteRefund(selectedRefund.id)}
                    >
                      Mark Completed Payout
                    </Button>
                  </>
                )}

                <Button
                  variant="ghost"
                  shape="pill"
                  onClick={() => setIsDetailOpen(false)}
                  className="font-bold px-5 text-xs"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
