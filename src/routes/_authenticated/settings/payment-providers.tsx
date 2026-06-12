/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import {
  Loader2,
  Plus,
  Trash2,
  Zap,
  Building2,
  Smartphone,
  Eye,
  EyeOff,
  Power,
  PowerOff,
  Shield,
  RefreshCw,
  HelpCircle,
  X,
  Info,
} from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
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

export const Route = createFileRoute("/_authenticated/settings/payment-providers")({
  head: () => ({ meta: [{ title: "Payment Providers — PayVerify" }] }),
  component: PaymentProvidersPage,
});

const BACKEND_URL = (import.meta as any).env?.VITE_BACKEND_URL || "http://localhost:5000";

interface Provider {
  id: string;
  provider_type: string;
  provider_name: string;
  credentials_json: Record<string, any>;
  active: boolean;
  created_at: string;
  updated_at: string;
}

const PROVIDER_TYPES = [
  { value: "paystack", label: "Paystack", icon: Zap, color: "text-teal-500" },
  { value: "bank_transfer", label: "Bank Transfer", icon: Building2, color: "text-sky-500" },
  { value: "mtn_momo", label: "MTN Mobile Money", icon: Smartphone, color: "text-yellow-500" },
  { value: "telecel_cash", label: "Telecel Cash", icon: Smartphone, color: "text-red-500" },
  { value: "airteltigo", label: "AirtelTigo Money", icon: Smartphone, color: "text-blue-500" },
];

function PaymentProvidersPage() {
  const { organization, role } = useAuth();
  const qc = useQueryClient();
  const isAdmin = role === "admin" || role === "super_admin";

  const [addOpen, setAddOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);

  // Onboarding Guide state
  const [guideDismissed, setGuideDismissed] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("payment_provider_guide_dismissed") === "true";
    }
    return false;
  });

  const dismissGuide = () => {
    localStorage.setItem("payment_provider_guide_dismissed", "true");
    setGuideDismissed(true);
  };

  const showGuide = () => {
    localStorage.setItem("payment_provider_guide_dismissed", "false");
    setGuideDismissed(false);
  };

  // Form state for new provider
  const [providerType, setProviderType] = useState("");
  const [providerName, setProviderName] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [webhookSecret, setWebhookSecret] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [mobileName, setMobileName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [providerCurrency, setProviderCurrency] = useState("GHS");

  // Visibility toggles
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [showWebhookSecret, setShowWebhookSecret] = useState(false);

  const { data: providers = [], isLoading } = useQuery({
    queryKey: ["payment-providers", organization?.id],
    enabled: !!organization?.id,
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("payment_providers")
        .select("*")
        .eq("organization_id", organization!.id)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Provider[];
    },
  });

  // Query last sync time for Paystack
  const { data: lastSyncTime } = useQuery({
    queryKey: ["paystack-last-sync", organization?.id],
    enabled: !!organization?.id && providers.some((p) => p.provider_type === "paystack"),
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("audit_logs")
        .select("created_at")
        .eq("organization_id", organization!.id)
        .eq("action_type", "paystack_sync")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data?.created_at ? new Date(data.created_at).toLocaleString() : "Never synced";
    },
  });

  const resetForm = () => {
    setProviderType("");
    setProviderName("");
    setPublicKey("");
    setSecretKey("");
    setWebhookSecret("");
    setBankName("");
    setAccountName("");
    setAccountNumber("");
    setMobileName("");
    setMobileNumber("");
    setProviderCurrency("GHS");
    setShowSecretKey(false);
    setShowWebhookSecret(false);
  };

  const handleAdd = async () => {
    if (!organization || !providerType || !providerName) {
      return toast.error("Please fill in all required fields.");
    }

    let credentials: Record<string, any> = {};

    if (providerType === "paystack") {
      if (!publicKey || !secretKey) {
        return toast.error("Public Key and Secret Key are required for Paystack.");
      }
      credentials = {
        public_key: publicKey,
        secret_key: secretKey,
        webhook_secret: webhookSecret || null,
      };
    } else if (providerType === "bank_transfer") {
      if (!bankName || !accountName || !accountNumber) {
        return toast.error("Bank details are required.");
      }
      credentials = {
        bank_name: bankName,
        account_name: accountName,
        account_number: accountNumber,
        currency: providerCurrency,
      };
    } else {
      // Mobile money providers
      if (!mobileName || !mobileNumber) {
        return toast.error("Account Name and Mobile Number are required.");
      }
      credentials = {
        account_name: mobileName,
        mobile_number: mobileNumber,
      };
    }

    setSaving(true);
    const { error } = await (supabase as any).from("payment_providers").insert({
      organization_id: organization.id,
      provider_type: providerType,
      provider_name: providerName,
      credentials_json: credentials,
      active: true,
    });
    setSaving(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success(`${providerName} provider added successfully.`);
    resetForm();
    setAddOpen(false);
    qc.invalidateQueries({ queryKey: ["payment-providers"] });
  };

  const handleToggle = async (provider: Provider) => {
    const { error } = await (supabase as any)
      .from("payment_providers")
      .update({ active: !provider.active })
      .eq("id", provider.id);
    if (error) return toast.error(error.message);
    toast.success(`${provider.provider_name} ${provider.active ? "deactivated" : "activated"}.`);
    qc.invalidateQueries({ queryKey: ["payment-providers"] });
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const { error } = await (supabase as any)
      .from("payment_providers")
      .delete()
      .eq("id", deleteId);
    if (error) return toast.error(error.message);
    toast.success("Provider removed.");
    setDeleteId(null);
    qc.invalidateQueries({ queryKey: ["payment-providers"] });
  };

  const handlePaystackSync = async () => {
    if (!organization) return;
    setSyncing(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/paystack/sync`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ organization_id: organization.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Sync failed");
      toast.success(data.message || "Paystack sync complete!");
      qc.invalidateQueries({ queryKey: ["payments"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSyncing(false);
    }
  };

  const getProviderMeta = (type: string) => PROVIDER_TYPES.find((p) => p.value === type);

  const renderCredentialsSummary = (provider: Provider) => {
    const creds = provider.credentials_json;
    if (provider.provider_type === "paystack") {
      return (
        <div className="text-[11px] text-muted-foreground space-y-1 mt-2">
          <p>Public Key: <span className="font-mono text-foreground/70">{String(creds.public_key || "").substring(0, 20)}••••</span></p>
          <p>Secret Key: <span className="font-mono text-foreground/70">sk_••••••••</span></p>
          <p className="pt-1 flex items-center gap-1.5 border-t border-border/40 mt-1.5">
            <span>Last Sync:</span>
            <span className="font-semibold text-foreground/85">{lastSyncTime ?? "Never synced"}</span>
          </p>
          {provider.active && isAdmin && (
            <Button
              variant="outline"
              size="sm"
              shape="pill"
              onClick={handlePaystackSync}
              disabled={syncing}
              className="w-full mt-3 h-8 text-[11px] font-semibold border-teal-300 dark:border-teal-500/30 text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-500/10 cursor-pointer"
            >
              {syncing ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <RefreshCw className="h-3 w-3 mr-1" />}
              Sync Transactions
            </Button>
          )}
        </div>
      );
    }
    if (provider.provider_type === "bank_transfer") {
      return (
        <div className="text-[11px] text-muted-foreground space-y-0.5 mt-2">
          <p>Bank Name: <span className="font-semibold text-foreground/80">{creds.bank_name}</span></p>
          <p>Account Name: <span className="text-foreground/75">{creds.account_name}</span></p>
          <p>Account Number: <span className="font-mono text-foreground/75">{creds.account_number}</span></p>
          <p>Currency: <span className="font-semibold text-foreground/80">{creds.currency || "NGN"}</span></p>
        </div>
      );
    }
    return (
      <div className="text-[11px] text-muted-foreground space-y-0.5 mt-2">
        <p>Account Name: <span className="font-semibold text-foreground/85">{creds.account_name}</span></p>
        <p>Mobile Number: <span className="font-mono text-foreground/75">{creds.mobile_number}</span></p>
      </div>
    );
  };

  const renderAddFormFields = () => {
    if (providerType === "paystack") {
      return (
        <>
          <div className="space-y-1.5">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 pl-1">Public Key <span className="text-rose-500">*</span></Label>
            <Input value={publicKey} onChange={(e) => setPublicKey(e.target.value)} placeholder="pk_live_..." className="rounded-full px-5 h-10 border-border/80 font-mono text-xs" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 pl-1">Secret Key <span className="text-rose-500">*</span></Label>
            <div className="relative">
              <Input type={showSecretKey ? "text" : "password"} value={secretKey} onChange={(e) => setSecretKey(e.target.value)} placeholder="sk_live_..." className="rounded-full pl-5 pr-12 h-10 border-border/80 font-mono text-xs" />
              <button type="button" onClick={() => setShowSecretKey(!showSecretKey)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showSecretKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 pl-1">Webhook Secret</Label>
            <div className="relative">
              <Input type={showWebhookSecret ? "text" : "password"} value={webhookSecret} onChange={(e) => setWebhookSecret(e.target.value)} placeholder="whsec_..." className="rounded-full pl-5 pr-12 h-10 border-border/80 font-mono text-xs" />
              <button type="button" onClick={() => setShowWebhookSecret(!showWebhookSecret)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showWebhookSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </>
      );
    }

    if (providerType === "bank_transfer") {
      return (
        <>
          <div className="space-y-1.5">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 pl-1">Bank Name <span className="text-rose-500">*</span></Label>
            <Input value={bankName} onChange={(e) => setBankName(e.target.value)} placeholder="e.g. GCB Bank, Ecobank" className="rounded-full px-5 h-10 border-border/80" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 pl-1">Account Name <span className="text-rose-500">*</span></Label>
              <Input value={accountName} onChange={(e) => setAccountName(e.target.value)} placeholder="Business Name" className="rounded-full px-5 h-10 border-border/80" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 pl-1">Account Number <span className="text-rose-500">*</span></Label>
              <Input value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} placeholder="1234567890" className="rounded-full px-5 h-10 border-border/80 font-mono" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 pl-1">Currency</Label>
            <Select value={providerCurrency} onValueChange={setProviderCurrency}>
              <SelectTrigger className="rounded-full px-5 h-10 border-border/80"><SelectValue /></SelectTrigger>
              <SelectContent>
                {["GHS", "NGN", "USD", "INR"].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </>
      );
    }

    // Mobile Money fields
    return (
      <>
        <div className="space-y-1.5">
          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 pl-1">Account Name <span className="text-rose-500">*</span></Label>
          <Input value={mobileName} onChange={(e) => setMobileName(e.target.value)} placeholder="Registered Name" className="rounded-full px-5 h-10 border-border/80" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 pl-1">Mobile Number <span className="text-rose-500">*</span></Label>
          <Input value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} placeholder="e.g. 0241234567" className="rounded-full px-5 h-10 border-border/80 font-mono" />
        </div>
      </>
    );
  };

  return (
    <div className="space-y-8 max-w-5xl animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground font-sans">
            Payment Providers
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Configure Paystack, bank transfer, and mobile money accounts for your organization.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          {guideDismissed && (
            <Button
              variant="outline"
              shape="pill"
              onClick={showGuide}
              className="h-9 text-xs font-semibold gap-1.5 cursor-pointer"
            >
              <HelpCircle className="h-4 w-4" />
              Setup Guide
            </Button>
          )}
          {providers.some((p) => p.provider_type === "paystack" && p.active) && (
            <Button
              variant="outline"
              shape="pill"
              onClick={handlePaystackSync}
              disabled={syncing}
              className="h-9 text-xs font-semibold border-teal-300 dark:border-teal-500/30 text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-500/10 cursor-pointer"
            >
              {syncing ? <Loader2 className="h-4 w-4 animate-spin mr-1.5" /> : <RefreshCw className="h-4 w-4 mr-1.5" />}
              Sync Paystack
            </Button>
          )}
          {isAdmin && (
            <Dialog open={addOpen} onOpenChange={setAddOpen}>
              <DialogTrigger asChild>
                <Button shape="pill" className="font-semibold shadow-md bg-primary hover:bg-primary/95 text-white gap-2 cursor-pointer">
                  <Plus className="h-4 w-4" /> Add Provider
                </Button>
              </DialogTrigger>
              <DialogContent className="rounded-3xl border-border/60 bg-card max-w-lg p-6 sm:p-8 shadow-[var(--shadow-elegant)]">
                <DialogHeader className="pb-4 border-b border-border/40">
                  <DialogTitle className="text-xl font-extrabold tracking-tight text-foreground font-sans">
                    Add Payment Provider
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 pl-1">Provider Type <span className="text-rose-500">*</span></Label>
                    <Select value={providerType} onValueChange={(v) => { setProviderType(v); resetForm(); setProviderType(v); }}>
                      <SelectTrigger className="rounded-full px-5 h-10 border-border/80"><SelectValue placeholder="Select provider type..." /></SelectTrigger>
                      <SelectContent className="rounded-2xl">
                        {PROVIDER_TYPES.map((pt) => (
                          <SelectItem key={pt.value} value={pt.value}>
                            <span className="flex items-center gap-2">
                              <pt.icon className={`h-4 w-4 ${pt.color}`} />
                              {pt.label}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 pl-1">Display Name <span className="text-rose-500">*</span></Label>
                    <Input value={providerName} onChange={(e) => setProviderName(e.target.value)} placeholder="e.g. Main Paystack Account" className="rounded-full px-5 h-10 border-border/80" />
                  </div>

                  {providerType && renderAddFormFields()}
                </div>
                <DialogFooter className="pt-4 border-t border-border/40 gap-2 sm:gap-0">
                  <Button type="button" variant="ghost" shape="pill" onClick={() => { resetForm(); setAddOpen(false); }} className="px-5 font-semibold text-muted-foreground cursor-pointer">Cancel</Button>
                  <Button shape="pill" className="px-6 font-semibold shadow-md bg-primary hover:bg-primary/95 text-white cursor-pointer" onClick={handleAdd} disabled={saving}>
                    {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                    Save Provider
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Dismissible Help Guide */}
      {!guideDismissed && (
        <Card className="border-border/60 bg-gradient-to-br from-primary/5 via-transparent to-transparent backdrop-blur-xl rounded-[2rem] overflow-hidden p-6 sm:p-8 relative shadow-sm border border-primary/10 animate-fade-in">
          <button 
            onClick={dismissGuide} 
            className="absolute right-6 top-6 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-full hover:bg-muted cursor-pointer"
            title="Dismiss guide"
          >
            <X className="h-4 w-4" />
          </button>
          
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 border border-primary/20">
              <Info className="h-5 w-5" />
            </div>
            <div className="space-y-6 flex-1 min-w-0">
              <div>
                <h2 className="text-lg font-bold tracking-tight text-foreground">Getting Started With Payment Providers</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Configure your payment providers to enable automatic reconciliation and payment tracking.
                </p>
              </div>
              
              <div className="grid gap-4 sm:grid-cols-3">
                {/* Paystack Guide */}
                <Card className="border-border/40 bg-card/50 backdrop-blur-sm rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="h-4 w-4 text-teal-500" />
                    <h3 className="text-xs font-black uppercase tracking-wider text-foreground">Paystack</h3>
                  </div>
                  <ol className="text-[11px] text-muted-foreground space-y-1.5 list-decimal pl-4 leading-relaxed">
                    <li>Create a Paystack account.</li>
                    <li>Navigate to Settings &rarr; Developers.</li>
                    <li>Copy your Public Key.</li>
                    <li>Copy your Secret Key.</li>
                    <li>Paste both keys into PayVerify.</li>
                    <li>Save Provider.</li>
                    <li>Click Sync Transactions.</li>
                  </ol>
                </Card>

                {/* Bank Transfer Guide */}
                <Card className="border-border/40 bg-card/50 backdrop-blur-sm rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <Building2 className="h-4 w-4 text-sky-500" />
                    <h3 className="text-xs font-black uppercase tracking-wider text-foreground">Bank Transfer</h3>
                  </div>
                  <ol className="text-[11px] text-muted-foreground space-y-1.5 list-decimal pl-4 leading-relaxed">
                    <li>Add your bank details.</li>
                    <li>Import bank transaction reports when available.</li>
                    <li>The system will automatically reconcile transactions against invoices.</li>
                  </ol>
                </Card>

                {/* Mobile Money Guide */}
                <Card className="border-border/40 bg-card/50 backdrop-blur-sm rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <Smartphone className="h-4 w-4 text-yellow-500" />
                    <h3 className="text-xs font-black uppercase tracking-wider text-foreground">Mobile Money</h3>
                  </div>
                  <ol className="text-[11px] text-muted-foreground space-y-1.5 list-decimal pl-4 leading-relaxed">
                    <li>Select your provider (MTN, Telecel, AirtelTigo).</li>
                    <li>Enter the registered business mobile number.</li>
                    <li>Save the provider.</li>
                    <li>Import transaction reports or manually record transactions.</li>
                    <li>The reconciliation engine will match payments to invoices.</li>
                  </ol>
                </Card>
              </div>

              <div className="flex justify-end pt-1">
                <Button shape="pill" size="sm" onClick={dismissGuide} className="font-semibold bg-primary text-white hover:bg-primary/90 px-6 cursor-pointer">
                  Got It
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Provider Cards */}
      {isLoading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border-border/60 rounded-2xl animate-pulse">
              <CardContent className="p-6 h-40" />
            </Card>
          ))}
        </div>
      ) : providers.length === 0 ? (
        <Card className="border-border/60 bg-card shadow-[var(--shadow-card)] rounded-2xl">
          <CardContent className="py-16 text-center">
            <div className="mx-auto h-14 w-14 rounded-full bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
              <Shield className="h-6 w-6" />
            </div>
            <h3 className="mt-5 text-lg font-bold tracking-tight text-foreground font-sans">No providers configured</h3>
            <p className="mt-1.5 max-w-sm mx-auto text-sm text-muted-foreground">
              Add your Paystack API keys, bank transfer details, or mobile money accounts to start accepting and reconciling payments.
            </p>
            {isAdmin && (
              <Button onClick={() => setAddOpen(true)} shape="pill" className="mt-6 font-semibold shadow-md bg-primary hover:bg-primary/95 text-white gap-2 cursor-pointer">
                <Plus className="h-4 w-4" /> Add Provider
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {providers.map((provider) => {
            const meta = getProviderMeta(provider.provider_type);
            const Icon = meta?.icon || Shield;
            return (
              <Card
                key={provider.id}
                className={`border-border/60 bg-card shadow-[var(--shadow-card)] rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-md ${
                  !provider.active ? "opacity-60" : ""
                }`}
              >
                <CardHeader className="pb-3 pt-5 px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center border ${
                        provider.active
                          ? "bg-primary/10 text-primary border-primary/20"
                          : "bg-muted/40 text-muted-foreground border-border/60"
                      }`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-sm font-bold tracking-tight">{provider.provider_name}</CardTitle>
                        <Badge
                          variant="outline"
                          className={`mt-0.5 rounded-full text-[9px] font-black uppercase tracking-wider px-2 ${
                            provider.active
                              ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20"
                              : "bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-500/20"
                          }`}
                        >
                          {provider.provider_type === "paystack"
                            ? (provider.active ? "Connected" : "Disconnected")
                            : (provider.active ? "Active" : "Inactive")}
                        </Badge>
                      </div>
                    </div>
                    {isAdmin && (
                      <Switch
                        checked={provider.active}
                        onCheckedChange={() => handleToggle(provider)}
                        className="data-[state=checked]:bg-emerald-500"
                      />
                    )}
                  </div>
                </CardHeader>
                <CardContent className="px-6 pb-5">
                  <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground mb-1">
                    {meta?.label || provider.provider_type}
                  </p>
                  {renderCredentialsSummary(provider)}
                  {isAdmin && (
                    <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border/40">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 px-3 text-xs font-semibold text-destructive hover:bg-destructive/10 rounded-full"
                        onClick={() => setDeleteId(provider.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-1" /> Remove
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="rounded-3xl border-border/60 bg-card p-6 sm:p-8 shadow-[var(--shadow-elegant)] max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-extrabold text-foreground font-sans">Remove Provider</AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground mt-2">
              Are you sure you want to remove this payment provider? Existing payments linked to it will not be affected, but new syncs will stop.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="pt-4 border-t border-border/40 gap-2 mt-4">
            <AlertDialogCancel className="px-5 font-semibold text-muted-foreground hover:bg-muted border-0 bg-transparent">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="px-6 font-semibold shadow-md bg-destructive hover:bg-destructive/90 text-destructive-foreground border-0">
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
