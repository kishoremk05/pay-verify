import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Loader2,
  User,
  Building,
  Mail,
  ShieldCheck,
  Eye,
  EyeOff,
  KeyRound,
  Coins,
  CreditCard,
  ChevronRight,
} from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SUPPORTED_CURRENCIES = [
  { code: "NGN", label: "Nigerian Naira (₦)" },
  { code: "GHS", label: "Ghanaian Cedi (₵)" },
  { code: "USD", label: "US Dollar ($)" },
  { code: "INR", label: "Indian Rupee (₹)" },
];

export const Route = createFileRoute("/_authenticated/settings/")({
  head: () => ({ meta: [{ title: "Settings — PayVerify" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const { profile, organization, user, role, refresh } = useAuth();
  const [fullName, setFullName] = useState("");
  const [orgName, setOrgName] = useState("");
  const [orgCurrency, setOrgCurrency] = useState("NGN");
  const [saving, setSaving] = useState(false);

  // Password Update States
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const changePassword = async () => {
    if (newPassword.length < 8) {
      return toast.error("Password must be at least 8 characters");
    }
    const hasUppercase = /[A-Z]/.test(newPassword);
    const hasLowercase = /[a-z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);
    const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);
    if (!hasUppercase || !hasLowercase || !hasNumber || !hasSpecial) {
      return toast.error(
        "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character",
      );
    }
    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match");
    }
    setUpdatingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setUpdatingPassword(false);
    if (error) return toast.error(error.message);
    toast.success("Password updated successfully");
    setNewPassword("");
    setConfirmPassword("");
  };

  useEffect(() => {
    setFullName(profile?.full_name ?? "");
    setOrgName(organization?.name ?? "");
    setOrgCurrency(organization?.currency ?? "NGN");
  }, [profile, organization]);

  const saveProfile = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName })
      .eq("id", user.id);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Profile updated successfully");
    refresh();
  };

  const saveOrg = async () => {
    if (!organization) return;
    setSaving(true);
    const { error } = await supabase
      .from("organizations")
      .update({ name: orgName, currency: orgCurrency })
      .eq("id", organization.id);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Organization updated successfully");
    refresh();
  };

  return (
    <div className="space-y-8 max-w-4xl animate-fade-in">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Settings
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage your personal profile, account preferences, and organization settings.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Personal Profile Settings */}
        <Card className="border-border/60 bg-card/90 backdrop-blur-xl shadow-[var(--shadow-card)] rounded-[2rem] overflow-hidden transition-all duration-300 hover:shadow-md">
          <CardHeader className="pb-4 pt-6 border-b border-border/40">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <User className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold tracking-tight">Personal Profile</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Manage your personal identity details
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 sm:p-8 space-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 pl-1 flex items-center gap-1.5"
              >
                <Mail className="h-3.5 w-3.5" /> Email Address
              </Label>
              <Input
                id="email"
                value={user?.email ?? ""}
                disabled
                className="rounded-full px-5 h-11 border-border/60 bg-muted/40 text-muted-foreground cursor-not-allowed select-none"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="fullName"
                className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 pl-1 flex items-center gap-1.5"
              >
                <User className="h-3.5 w-3.5" /> Full Name
              </Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="rounded-full px-5 h-11 border-border/80 focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary/80 bg-background text-foreground transition-all duration-200"
                placeholder="e.g. John Doe"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="role"
                className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 pl-1 flex items-center gap-1.5"
              >
                <ShieldCheck className="h-3.5 w-3.5" /> Account Role
              </Label>
              <Input
                id="role"
                value={role ?? "—"}
                disabled
                className="rounded-full px-5 h-11 border-border/60 bg-muted/40 text-muted-foreground cursor-not-allowed select-none capitalize"
              />
            </div>

            <div className="pt-2">
              <Button
                onClick={saveProfile}
                disabled={saving}
                shape="pill"
                className="w-full sm:w-auto px-6 h-11 font-semibold shadow-md bg-primary hover:bg-primary/95 text-primary-foreground hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
              >
                {saving ? <Loader2 className="h-4.5 w-4.5 animate-spin mr-2" /> : null}
                Save Profile Changes
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Organization Settings */}
        <Card className="border-border/60 bg-card/90 backdrop-blur-xl shadow-[var(--shadow-card)] rounded-[2rem] overflow-hidden transition-all duration-300 hover:shadow-md">
          <CardHeader className="pb-4 pt-6 border-b border-border/40">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Building className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold tracking-tight">
                  Organization Workspace
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Manage your team workspace properties
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 sm:p-8 space-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="orgName"
                className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 pl-1 flex items-center gap-1.5"
              >
                <Building className="h-3.5 w-3.5" /> Workspace Name
              </Label>
              <Input
                id="orgName"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                disabled={role !== "admin"}
                className="rounded-full px-5 h-11 border-border/80 focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary/80 bg-background text-foreground transition-all duration-200 disabled:bg-muted/40 disabled:text-muted-foreground disabled:cursor-not-allowed"
                placeholder="e.g. Acme Corp"
              />
              {role !== "admin" && (
                <div className="mt-3 flex items-start gap-2.5 rounded-2xl bg-amber-500/10 p-4 text-xs text-amber-700 dark:text-amber-400 border border-amber-500/20">
                  <ShieldCheck className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Admin Privileges Required:</span> You are a member
                    in this workspace. Workspace name settings can only be altered by
                    administrators.
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="orgCurrency"
                className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 pl-1 flex items-center gap-1.5"
              >
                <Coins className="h-3.5 w-3.5" /> Default Currency
              </Label>
              <Select
                value={orgCurrency}
                onValueChange={setOrgCurrency}
                disabled={role !== "admin"}
              >
                <SelectTrigger className="rounded-full px-5 h-11 border-border/80 focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary/80 bg-background text-foreground transition-all duration-200 disabled:bg-muted/40 disabled:text-muted-foreground disabled:cursor-not-allowed">
                  <SelectValue placeholder="Select currency..." />
                </SelectTrigger>
                <SelectContent>
                  {SUPPORTED_CURRENCIES.map((c) => (
                    <SelectItem key={c.code} value={c.code}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-[10px] text-muted-foreground pl-1">
                Used for invoices, payments, and dashboard displays.
              </p>
            </div>

            <div className="pt-2">
              <Button
                onClick={saveOrg}
                disabled={saving || role !== "admin"}
                shape="pill"
                className="w-full sm:w-auto px-6 h-11 font-semibold shadow-md bg-primary hover:bg-primary/95 text-primary-foreground hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer disabled:pointer-events-none disabled:opacity-50"
              >
                {saving ? <Loader2 className="h-4.5 w-4.5 animate-spin mr-2" /> : null}
                Save Workspace Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Settings */}
      <Card className="border-border/60 bg-card/90 backdrop-blur-xl shadow-[var(--shadow-card)] rounded-[2rem] overflow-hidden transition-all duration-300 hover:shadow-md max-w-2xl">
        <CardHeader className="pb-4 pt-6 border-b border-border/40">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <KeyRound className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold tracking-tight">Security Settings</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Update your account login password
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 sm:p-8 space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label
                htmlFor="newPassword"
                className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 pl-1 flex items-center gap-1.5"
              >
                New Password
              </Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="rounded-full pl-5 pr-12 h-11 border-border/80 focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary/80 bg-background text-foreground transition-all duration-200"
                  placeholder="Password@123"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4.5 w-4.5" />
                  ) : (
                    <Eye className="h-4.5 w-4.5" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 pl-1 flex items-center gap-1.5"
              >
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="rounded-full pl-5 pr-12 h-11 border-border/80 focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary/80 bg-background text-foreground transition-all duration-200"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4.5 w-4.5" />
                  ) : (
                    <Eye className="h-4.5 w-4.5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Button
              onClick={changePassword}
              disabled={updatingPassword || !newPassword}
              shape="pill"
              className="w-full sm:w-auto px-6 h-11 font-semibold shadow-md bg-primary hover:bg-primary/95 text-primary-foreground hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
            >
              {updatingPassword ? <Loader2 className="h-4.5 w-4.5 animate-spin mr-2" /> : null}
              Update Password
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Payment Providers Link */}
      {(role === "admin" || role === "super_admin") && (
        <Link
          to="/settings/payment-providers"
          className="block max-w-2xl"
        >
          <Card className="border-border/60 bg-card/90 backdrop-blur-xl shadow-[var(--shadow-card)] rounded-[2rem] overflow-hidden transition-all duration-300 hover:shadow-md hover:border-primary/30 group cursor-pointer">
            <CardContent className="p-6 sm:p-8 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20 group-hover:scale-105 transition-transform">
                  <CreditCard className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold tracking-tight text-foreground">Payment Providers</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Configure Paystack, bank transfers, and mobile money integrations
                  </p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </CardContent>
          </Card>
        </Link>
      )}
    </div>
  );
}
