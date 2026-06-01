import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import * as XLSX from "xlsx";
import { Plus, Upload, Search, Loader2, Trash2, CreditCard, Info } from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { ImportWizard } from "@/components/import-wizard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency, formatDate } from "@/lib/format";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/_authenticated/payments")({
  head: () => ({ meta: [{ title: "Payments — PayVerify" }] }),
  component: PaymentsPage,
});

const schema = z.object({
  customer_id: z.string().optional(),
  amount_paid: z.coerce.number().min(0),
  payment_method: z.string().optional(),
  reference: z.string().optional(),
  payment_date: z.string().min(1, "Date required"),
  notes: z.string().optional(),
  source: z.enum(["paystack", "bank", "cash", "manual"]),
  transaction_id: z.string().optional(),
  currency: z.string(),
});
type FormValues = z.infer<typeof schema>;

interface Payment {
  id: string;
  customer_id: string | null;
  amount_paid: number;
  payment_method: string | null;
  reference: string | null;
  payment_date: string;
  notes: string | null;
  status: "paid" | "partial" | "unpaid" | "duplicate" | "mismatch";
  source: "paystack" | "bank" | "cash" | "manual";
  transaction_id: string | null;
  currency: string;
}
interface Customer { id: string; name: string; expected_amount: number; customer_code: string | null; account_number: string | null }

function ExcelPreview() {
  const cols = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
  const headers = ["amount_paid", "payment_method", "customer_account_number", "customer_name", "payment_date", "notes", "status", "source", "customer_code"];
  const row1 = [15000, "Transfer", "1203948576", "John Doe", "2025-05-19", "May deposit", "paid", "bank", "CUST-001"];
  const row2 = [25000, "Card", "0987654321", "Sarah Will", "2025-05-18", "", "paid", "paystack", ""];

  return (
    <div className="border border-border/60 rounded-2xl overflow-hidden bg-background shadow-[var(--shadow-card)] font-sans text-sm mt-4">
      <div className="bg-muted/30 border-b border-border/60 px-4 py-3 flex items-center justify-between text-xs text-muted-foreground">
        <span className="font-bold flex items-center gap-2 text-foreground">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          payment_upload_template.xlsx
        </span>
        <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-extrabold px-3 py-1 rounded-full border border-emerald-500/20 uppercase tracking-wider">
          Required Columns
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border-spacing-0 select-none text-xs text-left">
          <thead>
            <tr className="bg-muted/20 text-center font-bold divide-x divide-border border-b border-border/60">
              <th className="w-10 bg-muted/40 py-2 text-[10px] text-muted-foreground text-center font-mono font-medium"></th>
              {cols.map((col, idx) => (
                <th key={idx} className="py-2 text-[11px] text-muted-foreground font-mono font-black w-24 text-center">
                  {col}
                </th>
              ))}
            </tr>
            <tr className="divide-x divide-border border-b border-border/60 hover:bg-muted/20 bg-emerald-500/5">
              <td className="bg-muted/40 text-center font-mono font-medium text-muted-foreground py-2 text-[10px]">
                1
              </td>
              {headers.map((h, idx) => (
                <td key={idx} className="p-2.5 font-bold text-emerald-700 dark:text-emerald-400 font-mono text-center">
                  {h}
                </td>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            <tr className="divide-x divide-border hover:bg-muted/10">
              <td className="bg-muted/40 text-center font-mono font-medium text-muted-foreground py-2 text-[10px]">
                2
              </td>
              {row1.map((val, idx) => (
                <td key={idx} className="p-2.5 font-mono text-foreground/80 text-center">
                  {val === "" ? <span className="text-muted-foreground/30 italic">empty</span> : String(val)}
                </td>
              ))}
            </tr>
            <tr className="divide-x divide-border hover:bg-muted/10">
              <td className="bg-muted/40 text-center font-mono font-medium text-muted-foreground py-2 text-[10px]">
                3
              </td>
              {row2.map((val, idx) => (
                <td key={idx} className="p-2.5 font-mono text-foreground/80 text-center">
                  {val === "" ? <span className="text-muted-foreground/30 italic">empty</span> : String(val)}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      
      <div className="p-5 bg-muted/10 border-t border-border/60 space-y-3 text-xs">
        <p className="font-bold text-foreground">Import Specifications & Details:</p>
        <div className="grid gap-3 sm:grid-cols-2 text-[11px] text-muted-foreground">
          <div className="space-y-1.5">
            <p><strong className="text-emerald-600 dark:text-emerald-400">amount_paid</strong> (Col A): <span className="text-destructive font-bold uppercase tracking-wider text-[10px]">Required</span>. Numeric values greater than zero.</p>
            <p><strong>customer_account_number</strong> (Col C): Optional. Matches to Customer Account Number to auto-link payments.</p>
            <p><strong>customer_name</strong> (Col D): Optional. Matches case-insensitively to Customer Name to auto-link payments.</p>
            <p><strong>payment_date</strong> (Col E): Format as <code className="bg-muted px-1 py-0.5 rounded">YYYY-MM-DD</code>. Defaults to current date if left blank.</p>
          </div>
          <div className="space-y-1.5">
            <p><strong>status</strong> (Col G): Options: <code className="bg-muted px-1.5 py-0.5 rounded">paid</code>, <code className="bg-muted px-1.5 py-0.5 rounded">partial</code>, <code className="bg-muted px-1.5 py-0.5 rounded">unpaid</code>, <code className="bg-muted px-1.5 py-0.5 rounded">duplicate</code>, <code className="bg-muted px-1.5 py-0.5 rounded">mismatch</code>.</p>
            <p><strong>source</strong> (Col H): Options: <code className="bg-muted px-1.5 py-0.5 rounded">manual</code>, <code className="bg-muted px-1.5 py-0.5 rounded">bank</code>, <code className="bg-muted px-1.5 py-0.5 rounded">paystack</code>, <code className="bg-muted px-1.5 py-0.5 rounded">cash</code>.</p>
            <p><strong>customer_code</strong> (Col I): Optional. Matches to Customer ID to auto-link payments.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function PaymentsPage() {
  const { organization, role } = useAuth();
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const isReadOnly = role === "viewer";
  const [open, setOpen] = useState(false);
  const [formatPreviewOpen, setFormatPreviewOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardHeaders, setWizardHeaders] = useState<string[]>([]);
  const [wizardRows, setWizardRows] = useState<any[]>([]);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [batchDeleteOpen, setBatchDeleteOpen] = useState(false);

  const onBatchDeleteConfirm = async () => {
    if (selectedIds.length === 0) return;
    const { error } = await supabase.from("payments").delete().in("id", selectedIds);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success(`Successfully deleted ${selectedIds.length} payments!`);
      setSelectedIds([]);
      qc.invalidateQueries({ queryKey: ["payments"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    }
    setBatchDeleteOpen(false);
  };

  const { data: payments, isLoading } = useQuery({
    queryKey: ["payments", organization?.id],
    enabled: !!organization?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payments")
        .select("*")
        .order("payment_date", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Payment[];
    },
  });

  const { data: customers } = useQuery({
    queryKey: ["customers-mini", organization?.id],
    enabled: !!organization?.id,
    queryFn: async () => {
      const { data } = await supabase.from("customers").select("id, name, expected_amount, customer_code, account_number");
      return (data ?? []) as Customer[];
    },
  });

  const customerName = (id: string | null) => customers?.find((c) => c.id === id)?.name ?? "—";
  const customerAccountNumber = (id: string | null) => customers?.find((c) => c.id === id)?.account_number ?? "—";

  const filtered = (payments ?? []).filter((p) =>
    [p.reference, p.payment_method, customerName(p.customer_id), customerAccountNumber(p.customer_id)].some((f) => f?.toLowerCase().includes(search.toLowerCase())),
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      customer_id: undefined,
      amount_paid: 0,
      payment_method: "",
      reference: "",
      payment_date: new Date().toISOString().slice(0, 10),
      notes: "",
      source: "manual",
      transaction_id: "",
      currency: "NGN",
    },
  });

  const onSubmit = async (values: FormValues) => {
    if (!organization) return;
    const { error } = await supabase.from("payments").insert({
      ...values,
      customer_id: values.customer_id || null,
      payment_method: values.payment_method || null,
      reference: values.reference || null,
      notes: values.notes || null,
      organization_id: organization.id,
    });
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Payment added");
    setOpen(false);
    form.reset();
    qc.invalidateQueries({ queryKey: ["payments"] });
    qc.invalidateQueries({ queryKey: ["dashboard"] });
  };

  const onDeleteConfirm = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from("payments").delete().eq("id", deleteId);
    if (error) return toast.error(error.message);
    toast.success("Payment deleted");
    setDeleteId(null);
    qc.invalidateQueries({ queryKey: ["payments"] });
    qc.invalidateQueries({ queryKey: ["dashboard"] });
  };

  const PAYMENT_FIELDS = [
    { key: "transaction_id", label: "Transaction ID", required: false, type: "string" as const },
    { key: "customer_code", label: "Customer Code", required: false, type: "string" as const },
    { key: "customer_account_number", label: "Customer Account Number", required: false, type: "string" as const },
    { key: "customer_name", label: "Customer Name", required: false, type: "string" as const },
    { key: "amount_paid", label: "Amount Paid", required: true, type: "number" as const },
    { key: "payment_method", label: "Payment Method", required: false, type: "string" as const },
    { key: "reference", label: "Reference Code", required: false, type: "string" as const },
    { key: "payment_date", label: "Payment Date", required: false, type: "date" as const },
    { key: "source", label: "Origin Source", required: false, type: "string" as const },
    { key: "currency", label: "Currency", required: false, type: "string" as const },
    { key: "notes", label: "Reconciliation Notes", required: false, type: "string" as const },
  ];

  /* ---- Bulk Excel Import ---- */
  const onImportFile = (file: File) => {
    if (!organization) return;
    const fileExtension = file.name.split(".").pop()?.toLowerCase();

    if (fileExtension !== "xlsx" && fileExtension !== "xls" && fileExtension !== "csv") {
      return toast.error("Only Excel (.xlsx, .xls) and CSV (.csv) files are supported.");
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array", cellDates: true });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const parsedData = XLSX.utils.sheet_to_json<Record<string, any>>(sheet);
        
        if (parsedData.length === 0) {
          return toast.error("The spreadsheet is empty.");
        }

        const headers = Object.keys(parsedData[0]);
        setWizardHeaders(headers);
        setWizardRows(parsedData);
        setWizardOpen(true);
      } catch (err: any) {
        toast.error(`File parsing failed: ${err.message}`);
      }
    };
    reader.onerror = () => toast.error("Error reading file");
    reader.readAsArrayBuffer(file);
  };

  const onWizardImport = async (mappedRows: any[]) => {
    if (!organization) return;

    const rows = mappedRows.map((r) => {
      const rawDate = r.payment_date;
      const parsedDate = rawDate
        ? (rawDate instanceof Date
            ? rawDate.toISOString().slice(0, 10)
            : String(rawDate).trim())
        : new Date().toISOString().slice(0, 10);

      // Resolve customer by account number, customer code, or customer name
      const customerAcc = r.customer_account_number ? String(r.customer_account_number).trim() : null;
      const customerCode = r.customer_code ? String(r.customer_code).trim() : null;
      const custName = r.customer_name ? String(r.customer_name).trim() : null;
      let resolvedCustomerId: string | null = null;
      if (customers) {
        if (customerAcc) {
          const match = customers.find(c => c.account_number === customerAcc);
          if (match) resolvedCustomerId = match.id;
        }
        if (!resolvedCustomerId && customerCode) {
          const match = customers.find(c => c.customer_code === customerCode);
          if (match) resolvedCustomerId = match.id;
        }
        if (!resolvedCustomerId && custName) {
          const match = customers.find(c => c.name.toLowerCase() === custName.toLowerCase());
          if (match) resolvedCustomerId = match.id;
        }
      }

      let cleanSource: "paystack" | "bank" | "cash" | "manual" = "bank";
      const rawSource = String(r.source ?? "").trim().toLowerCase();
      if (rawSource.includes("paystack")) {
        cleanSource = "paystack";
      } else if (rawSource.includes("cash")) {
        cleanSource = "cash";
      } else if (rawSource.includes("manual")) {
        cleanSource = "manual";
      } else {
        cleanSource = "bank";
      }

      return {
        organization_id: organization.id,
        customer_id: resolvedCustomerId,
        amount_paid: Number(r.amount_paid ?? 0),
        payment_method: r.payment_method || null,
        reference: r.reference || null,
        payment_date: parsedDate,
        notes: r.notes || null,
        status: "paid" as const,
        source: cleanSource,
        transaction_id: r.transaction_id || null,
        currency: r.currency || "NGN",
      };
    });

    const { error } = await supabase.from("payments").insert(rows);
    if (error) throw new Error(error.message);

    qc.invalidateQueries({ queryKey: ["payments"] });
    qc.invalidateQueries({ queryKey: ["dashboard"] });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground font-sans">Payments</h1>
          <p className="text-sm text-muted-foreground mt-1">Record manual transactions or reconcile lists via bank/processor imports.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          {selectedIds.length > 0 && !isReadOnly && (
            <Button
              variant="destructive"
              shape="pill"
              className="h-9 text-xs font-bold gap-2 animate-fade-in bg-rose-600 hover:bg-rose-700 text-white shadow-md"
              onClick={() => setBatchDeleteOpen(true)}
            >
              <Trash2 className="h-4 w-4" /> Delete Selected ({selectedIds.length})
            </Button>
          )}
          <input
            ref={fileRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            className="absolute w-0 h-0 opacity-0 pointer-events-none"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                onImportFile(file);
              }
              e.target.value = "";
            }}
          />
          <Dialog open={formatPreviewOpen} onOpenChange={setFormatPreviewOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" shape="pill" className="h-9 text-xs font-semibold text-muted-foreground border-border/80 hover:text-foreground">
                <Info className="h-4 w-4 text-primary" /> View Excel Format
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-3xl border-border/60 bg-card max-w-2xl sm:max-w-3xl p-6 sm:p-8 shadow-[var(--shadow-elegant)]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-xl font-extrabold text-foreground font-sans">
                  <CreditCard className="h-5 w-5 text-emerald-600" />
                  Excel Import Guide
                </DialogTitle>
                <p className="text-xs text-muted-foreground mt-1">
                  Reconcile dozens of records at once. Format your spreadsheets with the exact headers shown below.
                </p>
              </DialogHeader>
              <ExcelPreview />
            </DialogContent>
          </Dialog>

          {!isReadOnly && (
            <>
              <Button variant="outline" shape="pill" className="h-9 text-xs font-semibold border-primary/40 text-primary hover:bg-primary/5" onClick={() => fileRef.current?.click()}>
                <Upload className="h-4 w-4" /> Import Excel
              </Button>

              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button shape="pill" className="font-semibold shadow-md bg-primary hover:bg-primary/95 text-white gap-2"><Plus className="h-4 w-4" /> Add Payment</Button>
                </DialogTrigger>
                <DialogContent className="rounded-3xl border-border/60 bg-card max-w-lg p-6 sm:p-8 shadow-[var(--shadow-elegant)]">
              <DialogHeader className="pb-4 border-b border-border/40">
                <DialogTitle className="text-xl font-extrabold tracking-tight text-foreground font-sans">Record Transaction</DialogTitle>
              </DialogHeader>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 pl-1">Associated Customer</Label>
                  <Select
                    onValueChange={(v) => {
                      const selectedId = v === "_none" ? undefined : v;
                      form.setValue("customer_id", selectedId);
                      if (selectedId && customers) {
                        const cust = customers.find(c => c.id === selectedId);
                        if (cust?.account_number) {
                          form.setValue("reference", cust.account_number);
                        }
                      }
                    }}
                    defaultValue="_none"
                  >
                    <SelectTrigger className="rounded-full h-10 border-border/80 bg-background text-foreground transition-all px-4"><SelectValue placeholder="Select customer" /></SelectTrigger>
                    <SelectContent className="rounded-2xl border-border/60 bg-card">
                      <SelectItem value="_none">— Unassigned (Anonymous) —</SelectItem>
                      {customers?.map((c) => (
                        <SelectItem key={c.id} value={c.id}>{c.customer_code ? `${c.customer_code} — ${c.name}` : c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 pl-1">Amount Paid</Label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      className="rounded-full px-5 h-10 border-border/80 focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary/85 bg-background text-foreground transition-all"
                      {...form.register("amount_paid")}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 pl-1">Payment Date</Label>
                    <Input
                      type="date"
                      className="rounded-full px-5 h-10 border-border/80 focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary/85 bg-background text-foreground transition-all"
                      {...form.register("payment_date")}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 pl-1">Method / Channel</Label>
                    <Input
                      placeholder="Transfer, Card, Cash..."
                      className="rounded-full px-5 h-10 border-border/80 focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary/85 bg-background text-foreground transition-all"
                      {...form.register("payment_method")}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 pl-1">Account Number</Label>
                    <Input
                      placeholder="e.g. 1203948576"
                      className="rounded-full px-5 h-10 border-border/80 focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary/85 bg-background text-foreground transition-all"
                      {...form.register("reference")}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 pl-1">Transaction ID</Label>
                    <Input
                      placeholder="e.g. TX123456"
                      className="rounded-full px-5 h-10 border-border/80 focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary/85 bg-background text-foreground transition-all"
                      {...form.register("transaction_id")}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 pl-1">Origin Source</Label>
                    <Select defaultValue="manual" onValueChange={(v) => form.setValue("source", v as any)}>
                      <SelectTrigger className="rounded-full h-10 border-border/80 bg-background text-foreground px-4"><SelectValue /></SelectTrigger>
                      <SelectContent className="rounded-2xl border-border/60 bg-card">
                        {["manual", "bank", "paystack", "cash"].map((s) => (
                          <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 pl-1">Currency</Label>
                    <Input
                      placeholder="NGN"
                      className="rounded-full px-5 h-10 border-border/80 focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary/85 bg-background text-foreground transition-all"
                      {...form.register("currency")}
                    />
                  </div>
                  <div className="space-y-1.5" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 pl-1">Internal Notes</Label>
                  <Textarea
                    rows={2}
                    placeholder="Enter special reconciliation notes..."
                    className="rounded-2xl px-5 py-3 border-border/80 focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary/85 bg-background text-foreground transition-all"
                    {...form.register("notes")}
                  />
                </div>
                <DialogFooter className="pt-4 border-t border-border/40 gap-2 sm:gap-0">
                  <Button type="button" variant="ghost" shape="pill" onClick={() => setOpen(false)} className="px-5 font-semibold text-muted-foreground hover:bg-muted">Cancel</Button>
                  <Button type="submit" shape="pill" className="px-6 font-semibold shadow-md bg-primary hover:bg-primary/95 text-white" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                    Save Payment
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          </>
        )}
        </div>
      </div>

      <Card className="border-border/60 bg-card shadow-[var(--shadow-card)] rounded-2xl overflow-hidden">
        <CardContent className="p-6 space-y-6">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-11 pr-5 h-11 rounded-full border-border/80 focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary/85 bg-background text-foreground transition-all"
              placeholder="Search payments by reference, customer or method..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {isLoading ? (
            <div className="space-y-3 py-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded-xl" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-border/80 rounded-2xl bg-muted/10">
              <div className="mx-auto h-14 w-14 rounded-full bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
                <CreditCard className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-bold tracking-tight text-foreground font-sans">No payments found</h3>
              <p className="mt-1.5 max-w-sm mx-auto text-sm text-muted-foreground">Record your first transactional event manually, or upload spreadsheets from your processor.</p>
              {!isReadOnly && (
                <Button onClick={() => setOpen(true)} shape="pill" className="mt-6 font-semibold shadow-md bg-primary hover:bg-primary/95 text-white gap-2">
                  <Plus className="h-4 w-4" /> Add Payment
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-border/40">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow className="hover:bg-transparent">
                    {!isReadOnly && (
                      <TableHead className="w-12 py-4 pl-6">
                        <Checkbox
                          checked={filtered.length > 0 && selectedIds.length === filtered.length}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedIds(filtered.map((p) => p.id));
                            } else {
                              setSelectedIds([]);
                            }
                          }}
                        />
                      </TableHead>
                    )}
                    <TableHead className="font-bold text-foreground py-4 pl-2">Customer Name</TableHead>
                    <TableHead className="font-bold text-foreground py-4">Account Number</TableHead>
                    <TableHead className="font-bold text-foreground py-4">Origin Source</TableHead>
                    <TableHead className="font-bold text-foreground py-4 text-right">Amount Received</TableHead>
                    <TableHead className="font-bold text-foreground py-4">Match Status</TableHead>
                    <TableHead className="font-bold text-foreground py-4">Processed Date</TableHead>
                    {!isReadOnly && (
                      <TableHead className="font-bold text-foreground py-4 text-right pr-6">Action</TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((p) => {
                    const isSuccess = p.status === "paid";
                    const isFail = p.status === "mismatch" || p.status === "duplicate";
                    const isPartial = p.status === "partial";
                    
                    let badgeClass = "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700";
                    if (isSuccess) badgeClass = "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20";
                    if (isFail) badgeClass = "bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-500/20";
                    if (isPartial) badgeClass = "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-500/20";
 
                    let sourceBadge = "bg-slate-100 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400 border-border/80";
                    if (p.source === "paystack") sourceBadge = "bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-100 dark:border-teal-500/20";
                    if (p.source === "bank") sourceBadge = "bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-100 dark:border-sky-500/20";
                    if (p.source === "cash") sourceBadge = "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-500/20";
 
                    return (
                      <TableRow key={p.id} className="hover:bg-muted/20 transition-colors duration-150 border-b border-border/30 last:border-b-0">
                        {!isReadOnly && (
                          <TableCell className="py-4 pl-6">
                            <Checkbox
                              checked={selectedIds.includes(p.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedIds((prev) => [...prev, p.id]);
                                } else {
                                  setSelectedIds((prev) => prev.filter((id) => id !== p.id));
                                }
                              }}
                            />
                          </TableCell>
                        )}
                        <TableCell className="py-4 pl-2 font-bold text-foreground">
                          {p.customer_id ? customerName(p.customer_id) : (
                            <span className="text-xs font-bold bg-muted text-muted-foreground px-2 py-0.5 rounded border border-border/40 uppercase tracking-wider">Anonymous</span>
                          )}
                        </TableCell>
                        <TableCell className="py-4 font-mono font-bold text-xs">
                          {p.customer_id && customerAccountNumber(p.customer_id) !== "—" ? (
                            <span className="text-foreground bg-secondary/50 dark:bg-secondary px-2.5 py-1 rounded-md border border-border/80">
                              {customerAccountNumber(p.customer_id)}
                            </span>
                          ) : (
                            <span className="text-muted-foreground/50 italic">—</span>
                          )}
                        </TableCell>
                        <TableCell className="py-4">
                          <Badge variant="outline" className={`rounded-full px-2.5 py-0.5 text-[8.5px] font-black uppercase tracking-wider border ${sourceBadge}`}>
                            {p.source}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-4 text-right font-extrabold text-foreground">
                          {p.currency || "NGN"} {p.amount_paid.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell className="py-4">
                          <Badge variant="outline" className={`rounded-full px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider border ${badgeClass}`}>
                            {p.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-4 font-semibold text-muted-foreground">{formatDate(p.payment_date)}</TableCell>
                        {!isReadOnly && (
                          <TableCell className="py-4 text-right pr-6">
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              className="h-9 w-9 rounded-full bg-destructive/5 hover:bg-destructive/10 text-destructive border border-destructive/10 transition-colors" 
                              onClick={() => setDeleteId(p.id)}
                              title="Delete payment"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="rounded-3xl border-border/60 bg-card p-6 sm:p-8 shadow-[var(--shadow-elegant)] max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-extrabold text-foreground font-sans">
              Delete Payment
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground mt-2">
              Are you sure you want to delete this payment? This action is permanent and cannot be undone. All linked metrics and balance calculations will be updated.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="pt-4 border-t border-border/40 gap-2 mt-4">
            <AlertDialogCancel className="px-5 font-semibold text-muted-foreground hover:bg-muted border-0 bg-transparent">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={onDeleteConfirm}
              className="px-6 font-semibold shadow-md bg-destructive hover:bg-destructive/90 text-destructive-foreground border-0"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={batchDeleteOpen} onOpenChange={setBatchDeleteOpen}>
        <AlertDialogContent className="rounded-3xl border-border/60 bg-card p-6 sm:p-8 shadow-[var(--shadow-elegant)] max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-extrabold text-foreground font-sans">
              Delete Selected Payments
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground mt-2">
              Are you sure you want to delete the {selectedIds.length} selected payment{selectedIds.length > 1 ? "s" : ""}? This action is permanent and cannot be undone. All linked metrics and balance calculations will be updated.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="pt-4 border-t border-border/40 gap-2 mt-4">
            <AlertDialogCancel className="px-5 font-semibold text-muted-foreground hover:bg-muted border-0 bg-transparent">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={onBatchDeleteConfirm}
              className="px-6 font-semibold shadow-md bg-destructive hover:bg-destructive/90 text-destructive-foreground border-0"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ImportWizard
        isOpen={wizardOpen}
        onClose={() => setWizardOpen(false)}
        title="Payments"
        headers={wizardHeaders}
        rawData={wizardRows}
        fields={PAYMENT_FIELDS}
        onImport={onWizardImport}
      />
    </div>
  );
}