import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect, useCallback } from "react";
import {
  FileText,
  Upload,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Loader2,
  CheckCircle2,
  XCircle,
  Copy,
  Camera,
  Zap,
  Scan,
  Clock,
  Building2,
  User,
  Calendar,
  DollarSign,
  AlertTriangle,
} from "lucide-react";

export const Route = createFileRoute("/invoice/$invoiceId")({
  head: () => ({ meta: [{ title: "Pay Invoice — PayVerify" }] }),
  component: InvoicePortalPage,
});

// ─── Backend API URL ───
const API_URL = (import.meta as any).env?.VITE_BACKEND_URL || "http://localhost:5000";

const formatCurrency = (n: number) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(n);

const formatDate = (d: string | null | undefined) => {
  if (!d) return "—";
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(d));
};

// ─── Scanning Animation Messages ───
const SCAN_MESSAGES = [
  { pct: 5, msg: "Initializing secure scanning protocol..." },
  { pct: 15, msg: "Decrypting uploaded screenshot metadata..." },
  { pct: 25, msg: "Connecting to Triple-Engine AI cluster..." },
  { pct: 40, msg: "Extracting text tokens via OCR pipeline..." },
  { pct: 55, msg: "xAI Grok Vision analyzing receipt structure..." },
  { pct: 65, msg: "NVIDIA NIM cross-validating extracted fields..." },
  { pct: 75, msg: "AI consensus engine comparing results..." },
  { pct: 85, msg: "Cross-referencing against ledger expected amount..." },
  { pct: 92, msg: "Finalizing reconciliation verdict..." },
  { pct: 100, msg: "Analysis complete." },
];

function InvoicePortalPage() {
  const { invoiceId } = Route.useParams();
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Upload state
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Scanning state
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanMessage, setScanMessage] = useState("");
  const [scanLogs, setScanLogs] = useState<string[]>([]);

  // Result state
  const [result, setResult] = useState<any>(null);

  // Dev simulation
  const [simMode, setSimMode] = useState<"none" | "success" | "fail">("none");

  // Fetch invoice details
  useEffect(() => {
    async function fetchInvoice() {
      try {
        const res = await fetch(`${API_URL}/api/invoices/${invoiceId}`);
        if (!res.ok) throw new Error("Invoice not found");
        const data = await res.json();
        setInvoice(data.invoice);
      } catch (err: any) {
        setError(err.message || "Failed to load invoice");
      } finally {
        setLoading(false);
      }
    }
    fetchInvoice();
  }, [invoiceId]);

  // Handle file selection
  const handleFile = useCallback((f: File) => {
    if (f.size > 5 * 1024 * 1024) {
      alert("File must be under 5MB");
      return;
    }
    if (!f.type.startsWith("image/") && f.type !== "application/pdf") {
      alert("Only images (JPEG, PNG) and PDF files are supported");
      return;
    }
    setFile(f);
    if (f.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(f);
    } else {
      setPreview(null);
    }
    setResult(null);
  }, []);

  // Drop handlers
  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
    },
    [handleFile]
  );

  // Submit & verify receipt
  const handleVerify = async () => {
    if (!file && simMode === "none") return;

    setScanning(true);
    setResult(null);

    try {
      let base64 = "";
      if (file && simMode === "none") {
        const buffer = await file.arrayBuffer();
        const bytes = new Uint8Array(buffer);
        let binary = "";
        for (let i = 0; i < bytes.byteLength; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        base64 = btoa(binary);
      }

      const res = await fetch(`${API_URL}/api/invoices/${invoiceId}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receipt_base64: base64 || undefined,
          simulate_status: simMode !== "none" ? simMode : undefined,
        }),
      });

      const data = await res.json();
      setResult(data);

      // Refresh invoice
      const invoiceRes = await fetch(`${API_URL}/api/invoices/${invoiceId}`);
      if (invoiceRes.ok) {
        const invoiceData = await invoiceRes.json();
        setInvoice(invoiceData.invoice);
      }
    } catch (err: any) {
      setResult({ status: "error", message: err.message || "Upload failed" });
    } finally {
      setScanning(false);
    }
  };

  // ─── Loading State ───
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-indigo-400 mx-auto mb-4" />
          <p className="text-indigo-300 text-sm font-medium">Loading invoice...</p>
        </div>
      </div>
    );
  }

  // ─── Error State ───
  if (error || !invoice) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="h-16 w-16 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto mb-6">
            <XCircle className="h-8 w-8 text-rose-400" />
          </div>
          <h1 className="text-2xl font-black text-white mb-2">Invoice Not Found</h1>
          <p className="text-slate-400 text-sm">{error || "This invoice link may be invalid or expired."}</p>
        </div>
      </div>
    );
  }

  const isPaid = invoice.status === "paid";
  const isReview = invoice.status === "review_required";
  const orgName = invoice.organizations?.name || "PayVerify";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950/80 to-slate-950 text-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full mb-6">
            <Shield className="h-4 w-4 text-indigo-400" />
            <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">Secure Payment Portal</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight bg-gradient-to-r from-white via-indigo-200 to-violet-200 bg-clip-text text-transparent">
            {orgName}
          </h1>
          <p className="text-slate-400 text-sm mt-2">Invoice Payment & Verification</p>
        </div>

        {/* Invoice Summary Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 mb-6 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                <FileText className="h-5 w-5 text-indigo-400" />
              </div>
              <div>
                <h2 className="text-lg font-black text-white">{invoice.invoice_number}</h2>
                <p className="text-xs text-slate-500">Invoice ID</p>
              </div>
            </div>
            <span
              className={`px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                isPaid
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  : isReview
                    ? "bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse"
                    : "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
              }`}
            >
              {invoice.status === "review_required" ? "Under Review" : invoice.status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
              <div className="flex items-center gap-2 mb-1.5">
                <User className="h-3.5 w-3.5 text-slate-500" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Customer</span>
              </div>
              <p className="text-sm font-bold text-white">{invoice.customers?.name || "—"}</p>
              {invoice.customers?.account_number && (
                <p className="text-xs font-mono font-bold text-indigo-400 mt-1">
                  Acc: {invoice.customers.account_number}
                </p>
              )}
            </div>
            <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
              <div className="flex items-center gap-2 mb-1.5">
                <DollarSign className="h-3.5 w-3.5 text-slate-500" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Amount Due</span>
              </div>
              <p className="text-lg font-black text-emerald-400">{formatCurrency(Number(invoice.amount))}</p>
            </div>
            <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
              <div className="flex items-center gap-2 mb-1.5">
                <Calendar className="h-3.5 w-3.5 text-slate-500" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Due Date</span>
              </div>
              <p className="text-sm font-bold text-white">{formatDate(invoice.due_date)}</p>
            </div>
            <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
              <div className="flex items-center gap-2 mb-1.5">
                <Building2 className="h-3.5 w-3.5 text-slate-500" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Organization</span>
              </div>
              <p className="text-sm font-bold text-white">{orgName}</p>
            </div>
          </div>
        </div>

        {/* Bank Payment Instructions */}
        {!isPaid && (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 mb-6 shadow-2xl">
            <h3 className="text-sm font-black text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Building2 className="h-4 w-4 text-indigo-400" />
              Bank Transfer Instructions
            </h3>
            <div className="space-y-3 text-sm">
              {/* Customer Name */}
              <div className="flex items-center justify-between py-2 border-b border-white/5">
                <span className="text-slate-400 text-xs font-semibold">Customer Name</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">{invoice.customers?.name || "—"}</span>
                  <button
                    onClick={() => navigator.clipboard.writeText(invoice.customers?.name || "")}
                    className="h-6 w-6 rounded-md bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                  >
                    <Copy className="h-3 w-3 text-slate-400" />
                  </button>
                </div>
              </div>
              {/* Account Number */}
              {invoice.customers?.account_number ? (
                <div className="flex items-center justify-between py-2">
                  <span className="text-slate-400 text-xs font-semibold">Account Number</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-white tracking-widest">{invoice.customers.account_number}</span>
                    <button
                      onClick={() => navigator.clipboard.writeText(invoice.customers.account_number)}
                      className="h-6 w-6 rounded-md bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                    >
                      <Copy className="h-3 w-3 text-slate-400" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-2 text-xs text-slate-500 italic">No account number on record for this customer.</div>
              )}
            </div>
          </div>
        )}

        {/* Upload Section — hidden when paid */}
        {!isPaid && !scanning && !result && (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 mb-6 shadow-2xl">
            <h3 className="text-sm font-black text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Camera className="h-4 w-4 text-indigo-400" />
              Upload Payment Receipt
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              After making the payment, upload a screenshot or photo of your receipt. We will process and verify your payment.
            </p>

            <input
              ref={fileRef}
              type="file"
              accept="image/*,application/pdf"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />

            {/* Drop zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              onClick={() => fileRef.current?.click()}
              className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${
                dragOver
                  ? "border-indigo-400 bg-indigo-500/10 scale-[1.01]"
                  : file
                    ? "border-emerald-500/30 bg-emerald-500/5"
                    : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/5"
              }`}
            >
              {file ? (
                <div className="space-y-3">
                  {preview && (
                    <img
                      src={preview}
                      alt="Receipt preview"
                      className="max-h-48 mx-auto rounded-xl border border-white/10 shadow-lg"
                    />
                  )}
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span className="text-sm font-bold text-emerald-400">{file.name}</span>
                  </div>
                  <p className="text-[10px] text-slate-500">
                    {(file.size / 1024).toFixed(1)} KB • Click to change
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="h-14 w-14 mx-auto rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <Upload className="h-6 w-6 text-indigo-400" />
                  </div>
                  <p className="text-sm font-bold text-slate-300">Drop your receipt here, or click to browse</p>
                  <p className="text-[10px] text-slate-500">JPEG, PNG, or PDF • Max 5MB</p>
                </div>
              )}
            </div>

            {/* Verify Button */}
            {(file || simMode !== "none") && (
              <button
                onClick={handleVerify}
                className="mt-6 w-full py-3.5 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30"
              >
                <Upload className="h-4 w-4" />
                Upload Receipt
              </button>
            )}
          </div>
        )}

        {/* ─── Uploading Animation Overlay ─── */}
        {scanning && (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 mb-6 shadow-2xl text-center">
            <Loader2 className="h-10 w-10 animate-spin text-indigo-400 mx-auto mb-4" />
            <h3 className="text-lg font-black text-white mb-1">Uploading Receipt</h3>
            <p className="text-xs text-indigo-300">Your payment proof is being processed securely. Please wait...</p>
          </div>
        )}

        {/* ─── Result Display ─── */}
        {result && !scanning && (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 mb-6 shadow-2xl">
            {result.status === "matched" ? (
              <div className="text-center space-y-4">
                <div className="relative h-20 w-20 mx-auto">
                  <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />
                  <div className="absolute inset-0 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center">
                    <ShieldCheck className="h-10 w-10 text-emerald-400" />
                  </div>
                </div>
                <h3 className="text-2xl font-black text-emerald-400">Payment Verified!</h3>
                <p className="text-sm text-slate-300">
                  Your payment of <span className="font-bold text-emerald-400">{formatCurrency(result.extracted?.amount || 0)}</span> has
                  been matched and logged to your account.
                </p>
                {result.extracted?.transaction_id && (
                  <p className="text-xs text-slate-500">
                    Transaction ID: <span className="font-mono font-bold text-slate-400">{result.extracted.transaction_id}</span>
                  </p>
                )}
              </div>
            ) : result.status === "review_required" ? (
              <div className="text-center space-y-4">
                <div className="relative h-20 w-20 mx-auto">
                  <div className="absolute inset-0 rounded-full bg-amber-500/20 animate-pulse" />
                  <div className="absolute inset-0 rounded-full bg-amber-500/10 border-2 border-amber-500/30 flex items-center justify-center">
                    <ShieldAlert className="h-10 w-10 text-amber-400" />
                  </div>
                </div>
                <h3 className="text-2xl font-black text-amber-400">Receipt Submitted</h3>
                <p className="text-sm text-slate-300 px-4">
                  Your payment proof has been successfully uploaded. We will verify your payment within a day.
                </p>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <XCircle className="h-12 w-12 text-rose-400 mx-auto" />
                <h3 className="text-xl font-black text-rose-400">Verification Error</h3>
                <p className="text-sm text-slate-400">{result.message || "Something went wrong."}</p>
              </div>
            )}

            {/* Reset button */}
            {!isPaid && (
              <div className="space-y-3 mt-6">
                {result?.status !== "review_required" && (
                  <button
                    onClick={() => { setResult(null); setFile(null); setPreview(null); }}
                    className="w-full py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-sm transition-all"
                  >
                    Try Again
                  </button>
                )}
                {(preview || invoice?.receipt_url) && (
                  <a
                    href={preview || invoice?.receipt_url}
                    target="_blank"
                    rel="noreferrer"
                    className="block w-full py-3 rounded-full bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-500/20 text-indigo-300 font-bold text-sm text-center transition-all"
                  >
                    View Uploaded Receipt
                  </a>
                )}
              </div>
            )}
          </div>
        )}

        {/* Already Paid Banner */}
        {isPaid && !result && (
          <div className="bg-emerald-500/5 backdrop-blur-xl border border-emerald-500/20 rounded-3xl p-6 sm:p-8 mb-6 text-center">
            <ShieldCheck className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
            <h3 className="text-xl font-black text-emerald-400 mb-2">Invoice Fully Paid</h3>
            <p className="text-sm text-slate-400">This invoice has been verified and marked as paid. No further action is required.</p>
          </div>
        )}

        {/* ─── Dev Simulation Bar ─── */}
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl px-5 py-3 flex items-center gap-3 shadow-2xl">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Dev Sandbox</span>
          <button
            onClick={() => setSimMode(simMode === "success" ? "none" : "success")}
            className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition-all ${
              simMode === "success"
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "bg-white/5 text-slate-500 border border-white/10 hover:bg-white/10"
            }`}
          >
            Force Match
          </button>
          <button
            onClick={() => setSimMode(simMode === "fail" ? "none" : "fail")}
            className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition-all ${
              simMode === "fail"
                ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                : "bg-white/5 text-slate-500 border border-white/10 hover:bg-white/10"
            }`}
          >
            Force Mismatch
          </button>
        </div>

        {/* Footer */}
        <div className="text-center pt-8 pb-20">
          <p className="text-[10px] text-slate-600">
            Secured by <span className="font-bold text-indigo-400">PayVerify</span> • End-to-end encrypted
          </p>
        </div>
      </div>
    </div>
  );
}
