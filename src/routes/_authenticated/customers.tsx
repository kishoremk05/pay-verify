import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import * as XLSX from "xlsx";
import { Plus, Upload, Search, Pencil, Trash2, Loader2, Users, Info, ArrowLeft } from "lucide-react";
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
import { formatCurrency } from "@/lib/format";
import { Skeleton } from "@/components/ui/skeleton";
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

export const Route = createFileRoute("/_authenticated/customers")({
  head: () => ({ meta: [{ title: "Customers — PayVerify" }] }),
  component: CustomersPage,
});

const schema = z.object({
  customer_code: z.string().optional(),
  name: z.string().min(1, "Name required"),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  service: z.string().optional(),
  expected_amount: z.coerce.number().min(0),
  account_number: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

interface Customer {
  id: string;
  customer_code: string | null;
  name: string;
  phone: string | null;
  email: string | null;
  service: string | null;
  expected_amount: number;
  due_amount: number;
  status: "paid" | "partial" | "unpaid" | "mismatch";
  account_number: string | null;
}

/* ------------------------------------------------------------------ */
/*  Excel Format Preview (matches the Payments screen pattern)        */
/* ------------------------------------------------------------------ */
function CustomerExcelPreview() {
  const cols = ["A", "B", "C", "D", "E", "F", "G"];
  const headers = ["customer_code", "name", "phone", "email", "service", "expected_amount", "account_number"];
  const row1 = ["CUST-001", "John Doe", "+2348012345678", "john@example.com", "Web Development", 50000, "1203948576"];
  const row2 = ["CUST-002", "Jane Smith", "+2349087654321", "", "Consultation", 25000, "0987654321"];

  return (
    <div className="border border-border/60 rounded-2xl overflow-hidden bg-background shadow-[var(--shadow-card)] font-sans text-sm mt-4">
      <div className="bg-muted/30 border-b border-border/60 px-4 py-3 flex items-center justify-between text-xs text-muted-foreground">
        <span className="font-bold flex items-center gap-2 text-foreground">
          <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
          customer_upload_template.xlsx
        </span>
        <span className="text-[10px] bg-blue-500/10 text-blue-600 dark:text-blue-400 font-extrabold px-3 py-1 rounded-full border border-blue-500/20 uppercase tracking-wider">
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
            <tr className="divide-x divide-border border-b border-border/60 hover:bg-muted/20 bg-blue-500/5">
              <td className="bg-muted/40 text-center font-mono font-medium text-muted-foreground py-2 text-[10px]">
                1
              </td>
              {headers.map((h, idx) => (
                <td key={idx} className="p-2.5 font-bold text-blue-700 dark:text-blue-400 font-mono text-center">
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
            <p><strong className="text-blue-600 dark:text-blue-400">customer_code</strong> (Col A): Optional. Unique identifier you assign (e.g. <code className="bg-muted px-1 py-0.5 rounded">CUST-001</code>).</p>
            <p><strong className="text-destructive">name</strong> (Col B): <span className="text-destructive font-bold uppercase tracking-wider text-[10px]">Required</span>. Customer full name.</p>
            <p><strong>account_number</strong> (Col G): Optional banking identification field.</p>
          </div>
          <div className="space-y-1.5">
            <p><strong>expected_amount</strong> (Col F): Numeric value. Defaults to <code className="bg-muted px-1.5 py-0.5 rounded">0</code> if blank.</p>
            <p><strong>phone, email, service</strong>: Optional text fields.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Page Component                                                */
/* ------------------------------------------------------------------ */
function CustomersPage() {
  const { organization, role } = useAuth();
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const isReadOnly = role === "viewer";
  const [open, setOpen] = useState(false);
  const [formatPreviewOpen, setFormatPreviewOpen] = useState(false);
  const [editing, setEditing] = useState<Customer | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const currency = organization?.currency ?? "NGN";
  
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardHeaders, setWizardHeaders] = useState<string[]>([]);
  const [wizardRows, setWizardRows] = useState<any[]>([]);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [batchDeleteOpen, setBatchDeleteOpen] = useState(false);

  // Fetch services for dropdown
  const { data: servicesList = [] } = useQuery({
    queryKey: ["services-list", organization?.id],
    enabled: !!organization?.id,
    queryFn: async () => {
      const { data } = await supabase.from("services").select("id, name, fee").order("name");
      return data ?? [];
    },
  });

  const onBatchDeleteConfirm = async () => {
    if (selectedIds.length === 0) return;
    const { error } = await supabase.from("customers").delete().in("id", selectedIds);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success(`Successfully deleted ${selectedIds.length} customers!`);
      setSelectedIds([]);
      qc.invalidateQueries({ queryKey: ["customers"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    }
    setBatchDeleteOpen(false);
  };

  const { data: customers, isLoading } = useQuery({
    queryKey: ["customers", organization?.id],
    enabled: !!organization?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Customer[];
    },
  });

  const filtered = (customers ?? []).filter((c) =>
    [c.name, c.phone, c.email, c.service, c.customer_code, c.account_number].some((f) => f?.toLowerCase().includes(search.toLowerCase())),
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { customer_code: "", name: "", phone: "", email: "", service: "", expected_amount: 0, account_number: "" },
  });

  const openCreate = () => {
    setEditing(null);
    const existingCodes = (customers ?? []).map((c) => c.customer_code);
    const autoCode = generateCode(existingCodes);
    form.reset({ customer_code: autoCode, name: "", phone: "", email: "", service: "", expected_amount: 0, account_number: "" });
    setOpen(true);
  };
  const openEdit = (c: Customer) => {
    setEditing(c);
    const existingCodes = (customers ?? []).map((c) => c.customer_code);
    form.reset({
      customer_code: c.customer_code || generateCode(existingCodes),
      name: c.name,
      phone: c.phone ?? "",
      email: c.email ?? "",
      service: c.service ?? "",
      expected_amount: Number(c.expected_amount),
      account_number: c.account_number ?? "",
    });
    setOpen(true);
  };

  /* ---- Auto-generate Customer Code ---- */
  const generateCode = (existingCodes: (string | null)[]) => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    const codeSet = new Set(existingCodes.filter(Boolean));
    let code = "";
    do {
      code = Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
    } while (codeSet.has(code));
    return code;
  };

  const onSubmit = async (values: FormValues) => {
    if (!organization) return;

    // Auto-generate customer_code if not provided
    let code = values.customer_code?.trim() || null;
    if (!code && !editing) {
      const existingCodes = (customers ?? []).map((c) => c.customer_code);
      code = generateCode(existingCodes);
    }
    if (!code && editing && !editing.customer_code) {
      const existingCodes = (customers ?? []).map((c) => c.customer_code);
      code = generateCode(existingCodes);
    }

    const payload = {
      ...values,
      customer_code: code,
      email: values.email || null,
      phone: values.phone || null,
      service: values.service || null,
      account_number: values.account_number || null,
      organization_id: organization.id,
    };
    if (editing) {
      const { error } = await supabase.from("customers").update(payload).eq("id", editing.id);
      if (error) return toast.error(error.message);
      toast.success("Customer updated");
    } else {
      const { error } = await supabase.from("customers").insert(payload);
      if (error) return toast.error(error.message);
      toast.success("Customer added");
    }
    setOpen(false);
    qc.invalidateQueries({ queryKey: ["customers"] });
    qc.invalidateQueries({ queryKey: ["dashboard"] });
  };

  const onDeleteConfirm = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from("customers").delete().eq("id", deleteId);
    if (error) return toast.error(error.message);
    toast.success("Customer deleted");
    setDeleteId(null);
    qc.invalidateQueries({ queryKey: ["customers"] });
    qc.invalidateQueries({ queryKey: ["dashboard"] });
  };

  const CUSTOMER_FIELDS = [
    { key: "customer_code", label: "Customer Code", required: false, type: "string" as const },
    { key: "name", label: "Full Name", required: true, type: "string" as const },
    { key: "phone", label: "Phone Number", required: false, type: "string" as const },
    { key: "email", label: "Email Address", required: false, type: "email" as const },
    { key: "service", label: "Subscribed Service", required: false, type: "string" as const },
    { key: "expected_amount", label: "Expected Amount", required: true, type: "number" as const },
    { key: "due_amount", label: "Due Amount / Balance", required: false, type: "number" as const },
    { key: "account_number", label: "Account Number", required: false, type: "string" as const },
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

    // Gather existing codes to auto-generate for rows without one
    const existingCodes = (customers ?? []).map((c) => c.customer_code);

    const rows = mappedRows.map((r) => {
      const expAmt = Number(r.expected_amount ?? 0);
      const dueAmt = r.due_amount !== undefined && r.due_amount !== "" ? Number(r.due_amount) : expAmt;

      return {
        organization_id: organization.id,
        customer_code: (r.customer_code || null) as string | null,
        name: String(r.name ?? "").trim(),
        phone: r.phone || null,
        email: r.email || null,
        service: r.service || null,
        expected_amount: expAmt,
        due_amount: dueAmt,
        account_number: r.account_number || null,
        status: (dueAmt === 0 ? "paid" : (dueAmt === expAmt ? "unpaid" : (dueAmt > expAmt ? "mismatch" : "partial"))) as "paid" | "partial" | "unpaid" | "mismatch",
      };
    });

    // Auto-generate codes for rows that don't have one
    const allCodes = [...existingCodes];
    for (const row of rows) {
      if (!row.customer_code) {
        const nextCode = generateCode(allCodes);
        row.customer_code = nextCode;
        allCodes.push(nextCode);
      } else {
        allCodes.push(row.customer_code);
      }
    }

    const { error } = await supabase.from("customers").insert(rows);
    if (error) throw new Error(error.message);

    qc.invalidateQueries({ queryKey: ["customers"] });
    qc.invalidateQueries({ queryKey: ["dashboard"] });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground font-sans">Customers</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage and track clients you collect payments from.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <Link to="/services">
            <Button variant="outline" shape="pill" className="h-9 text-xs font-semibold border-border/80 text-muted-foreground hover:text-foreground gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to Services
            </Button>
          </Link>
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
                  <Users className="h-5 w-5 text-blue-600" />
                  Customer Excel Import Guide
                </DialogTitle>
                <p className="text-xs text-muted-foreground mt-1">
                  Bulk-add dozens of customers at once. Format your spreadsheets with the exact headers shown below.
                </p>
              </DialogHeader>
              <CustomerExcelPreview />
            </DialogContent>
          </Dialog>

          {!isReadOnly && (
            <>
              <Button variant="outline" shape="pill" className="h-9 text-xs font-semibold border-primary/40 text-primary hover:bg-primary/5" onClick={() => fileRef.current?.click()}>
                <Upload className="h-4 w-4" /> Import Excel
              </Button>

              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button onClick={openCreate} shape="pill" className="font-semibold shadow-md bg-primary hover:bg-primary/95 text-white gap-2"><Plus className="h-4 w-4" /> Add Customer</Button>
                </DialogTrigger>
                <DialogContent className="rounded-3xl border-border/60 bg-card max-w-md p-6 sm:p-8 shadow-[var(--shadow-elegant)]">
              <DialogHeader className="pb-4 border-b border-border/40">
                <DialogTitle className="text-xl font-extrabold tracking-tight text-foreground font-sans">
                  {editing ? "Modify Customer Details" : "Register New Customer"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 pt-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 pl-1">Customer ID</Label>
                  <Input
                    className="rounded-full px-5 h-10 border-border/80 focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary/85 bg-background text-foreground transition-all"
                    placeholder="CUST-001 (optional)"
                    {...form.register("customer_code")}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 pl-1">Full Name</Label>
                  <Input
                    className="rounded-full px-5 h-10 border-border/80 focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary/85 bg-background text-foreground transition-all"
                    placeholder="John Doe"
                    {...form.register("name")}
                  />
                  {form.formState.errors.name && <p className="text-xs text-destructive pl-1">{form.formState.errors.name.message}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 pl-1">Phone Number</Label>
                    <Input
                      className="rounded-full px-5 h-10 border-border/80 focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary/85 bg-background text-foreground transition-all"
                      placeholder="+234..."
                      {...form.register("phone")}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 pl-1">Email Address</Label>
                    <Input
                      type="email"
                      className="rounded-full px-5 h-10 border-border/80 focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary/85 bg-background text-foreground transition-all"
                      placeholder="john@example.com"
                      {...form.register("email")}
                    />
                    {form.formState.errors.email && <p className="text-xs text-destructive pl-1">{form.formState.errors.email.message}</p>}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 pl-1">Assigned Service</Label>
                  <Select
                    value={form.watch("service") || ""}
                    onValueChange={(val) => {
                      form.setValue("service", val);
                      const selectedService = servicesList.find((s) => s.name === val);
                      if (selectedService) {
                        form.setValue("expected_amount", Number(selectedService.fee));
                      }
                    }}
                  >
                    <SelectTrigger className="rounded-full px-5 h-10 border-border/80 focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary/85 bg-background text-foreground transition-all">
                      <SelectValue placeholder="Select a service..." />
                    </SelectTrigger>
                    <SelectContent>
                      {servicesList.map((s) => (
                        <SelectItem key={s.id} value={s.name}>
                          {s.name} — {formatCurrency(s.fee, currency)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 pl-1">Expected Amount</Label>
                    <Input
                      type="number"
                      step="0.01"
                      className="rounded-full px-5 h-10 border-border/80 focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary/85 bg-background text-foreground transition-all"
                      placeholder="0.00"
                      {...form.register("expected_amount")}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 pl-1">Account Number</Label>
                    <Input
                      className="rounded-full px-5 h-10 border-border/80 focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary/85 bg-background text-foreground transition-all"
                      placeholder="e.g. 1203948576"
                      {...form.register("account_number")}
                    />
                  </div>
                </div>
                <DialogFooter className="pt-4 border-t border-border/40 gap-2 sm:gap-0">
                  <Button type="button" variant="ghost" shape="pill" onClick={() => setOpen(false)} className="px-5 font-semibold text-muted-foreground hover:bg-muted">Cancel</Button>
                  <Button type="submit" shape="pill" className="px-6 font-semibold shadow-md bg-primary hover:bg-primary/95 text-white" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                    {editing ? "Save Changes" : "Confirm Addition"}
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
              placeholder="Search customers by name, phone, service or customer ID..."
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
            <EmptyState search={search} onAdd={openCreate} isReadOnly={isReadOnly} />
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
                              setSelectedIds(filtered.map((c) => c.id));
                            } else {
                              setSelectedIds([]);
                            }
                          }}
                        />
                      </TableHead>
                    )}
                    <TableHead className="font-bold text-foreground py-4 pl-2">Client Info</TableHead>
                    <TableHead className="font-bold text-foreground py-4">Customer ID</TableHead>
                    <TableHead className="font-bold text-foreground py-4">Account Number</TableHead>
                    <TableHead className="font-bold text-foreground py-4">Subscribed Service</TableHead>
                    <TableHead className="font-bold text-foreground py-4 text-right">Expected Amount</TableHead>
                    <TableHead className="font-bold text-foreground py-4 text-right">Due Amount</TableHead>
                    <TableHead className="font-bold text-foreground py-4">Payment Status</TableHead>
                    {!isReadOnly && (
                      <TableHead className="font-bold text-foreground py-4 text-right pr-6">Management</TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((c) => {
                    const isPaid = c.status === "paid";
                    const isPartial = c.status === "partial";
                    
                    let badgeClass = "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700";
                    if (isPaid) badgeClass = "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20";
                    if (isPartial) badgeClass = "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-500/20";
                    
                    const initials = c.name ? c.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) : "C";
 
                    return (
                      <TableRow key={c.id} className="hover:bg-muted/20 transition-colors duration-150 border-b border-border/30 last:border-b-0">
                        {!isReadOnly && (
                          <TableCell className="py-4 pl-6">
                            <Checkbox
                              checked={selectedIds.includes(c.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedIds((prev) => [...prev, c.id]);
                                } else {
                                  setSelectedIds((prev) => prev.filter((id) => id !== c.id));
                                }
                              }}
                            />
                          </TableCell>
                        )}
                        <TableCell className="py-4 pl-2 font-bold text-foreground">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-primary/10 text-primary font-black text-xs flex items-center justify-center border border-primary/20 shrink-0">
                              {initials}
                            </div>
                            <div className="leading-tight">
                              <p className="font-bold text-foreground tracking-tight">{c.name}</p>
                              <p className="text-[11px] text-muted-foreground">{c.email ?? "No email profile"}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          {c.customer_code ? (
                            <span className="font-mono font-bold text-xs bg-primary/5 text-primary px-2.5 py-1 rounded-md border border-primary/15 tracking-wide">
                              {c.customer_code}
                            </span>
                          ) : (
                            <span className="text-xs text-muted-foreground/50 italic">—</span>
                          )}
                        </TableCell>
                        <TableCell className="py-4 font-mono font-bold text-xs">
                          {c.account_number ? (
                            <span className="text-foreground bg-secondary/50 dark:bg-secondary px-2.5 py-1 rounded-md border border-border/80">
                              {c.account_number}
                            </span>
                          ) : (
                            <span className="text-muted-foreground/50 italic">—</span>
                          )}
                        </TableCell>
                        <TableCell className="py-4">
                          <span className="font-semibold px-2.5 py-1 rounded-md text-xs bg-muted/65 text-muted-foreground border border-border/30 uppercase tracking-wider">{c.service ?? "Custom Option"}</span>
                        </TableCell>
                        <TableCell className="py-4 text-right font-extrabold text-foreground">{formatCurrency(c.expected_amount, currency)}</TableCell>
                        <TableCell className="py-4 text-right font-extrabold">
                          <span className={c.due_amount <= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}>
                            {formatCurrency(c.due_amount, currency)}
                          </span>
                        </TableCell>
                        <TableCell className="py-4">
                          <Badge variant="outline" className={`rounded-full px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider border ${badgeClass}`}>
                            {c.status}
                          </Badge>
                        </TableCell>
                        {!isReadOnly && (
                          <TableCell className="py-4 text-right pr-6">
                            <div className="flex items-center justify-end gap-2">
                              <Button 
                                size="icon" 
                                variant="ghost" 
                                className="h-9 w-9 rounded-full bg-muted/50 hover:bg-muted text-primary border border-border/50 transition-colors" 
                                onClick={() => openEdit(c)}
                                title="Edit customer"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="icon" 
                                variant="ghost" 
                                className="h-9 w-9 rounded-full bg-destructive/5 hover:bg-destructive/10 text-destructive border border-destructive/10 transition-colors" 
                                onClick={() => setDeleteId(c.id)}
                                title="Delete customer"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
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
              Delete Customer
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground mt-2">
              Are you sure you want to delete this customer? This action is permanent and cannot be undone. All linked payments and history for this customer will no longer be matched.
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
              Delete Selected Customers
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground mt-2">
              Are you sure you want to delete the {selectedIds.length} selected customer{selectedIds.length > 1 ? "s" : ""}? This action is permanent and cannot be undone. All linked payments and history will no longer be matched.
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
        title="Customers"
        headers={wizardHeaders}
        rawData={wizardRows}
        fields={CUSTOMER_FIELDS}
        onImport={onWizardImport}
      />
    </div>
  );
}

function EmptyState({ search, onAdd, isReadOnly }: { search: string; onAdd: () => void; isReadOnly?: boolean }) {
  return (
    <div className="text-center py-16 border border-dashed border-border/80 rounded-2xl bg-muted/10">
      <div className="mx-auto h-14 w-14 rounded-full bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
        <Users className="h-6 w-6" />
      </div>
      <h3 className="mt-5 text-lg font-bold tracking-tight text-foreground font-sans">No customers {search ? "match your search" : "yet"}</h3>
      <p className="mt-1.5 max-w-sm mx-auto text-sm text-muted-foreground">
        {search ? "Try refining your keywords or search spelling." : "Create your first customer profile to start matching payments."}
      </p>
      {!search && !isReadOnly && (
        <Button onClick={onAdd} shape="pill" className="mt-6 font-semibold shadow-md bg-primary hover:bg-primary/95 text-white gap-2">
          <Plus className="h-4 w-4" /> Add Customer
        </Button>
      )}
    </div>
  );
}