/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import {
  ShieldCheck,
  Plus,
  Mail,
  User,
  Copy,
  Trash2,
  Calendar,
  Lock,
  Loader2,
  Sparkles,
  Search,
  Pencil,
} from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDate } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/staff-management")({
  head: () => ({ meta: [{ title: "Staff Directory — Todella" }] }),
  component: StaffManagementPage,
});

function StaffManagementPage() {
  const { organization, role, user, profile } = useAuth();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("viewer");
  const [inviting, setInviting] = useState(false);
  const [generatedLink, setGeneratedLink] = useState("");

  // Role Edit States
  const [editingMember, setEditingMember] = useState<any | null>(null);
  const [newRole, setNewRole] = useState<string>("");
  const [updatingRole, setUpdatingRole] = useState(false);

  const isAuthorized = role === "super_admin" || role === "admin";

  // Fetch current team members
  const { data: staff = [], isLoading: staffLoading } = useQuery({
    queryKey: ["staff", organization?.id],
    enabled: !!organization?.id && isAuthorized,
    queryFn: async () => {
      const { data: roles } = await supabase
        .from("user_roles")
        .select("user_id, role, created_at")
        .eq("organization_id", organization!.id);

      const uids = roles?.map((r) => r.user_id) ?? [];
      if (uids.length === 0) return [];

      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url, created_at")
        .in("id", uids);

      return (profiles ?? []).map((p) => {
        const r = roles?.find((roleRow) => roleRow.user_id === p.id);
        return {
          id: p.id,
          full_name: p.full_name || "Anonymous Member",
          role: r?.role ?? "member",
          joined_at: r?.created_at ?? p.created_at,
        };
      });
    },
  });

  // Fetch active pending invitations
  const { data: invitations = [], isLoading: invitesLoading } = useQuery({
    queryKey: ["invitations", organization?.id],
    enabled: !!organization?.id && isAuthorized,
    queryFn: async () => {
      const { data } = await (supabase as any)
        .from("invitations")
        .select("*")
        .eq("organization_id", organization!.id)
        .is("accepted_at", null);
      return (data as any[]) ?? [];
    },
  });

  // Handle invitation creation and email dispatch
  const handleInviteStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!organization?.id || !user?.id) return;
    if (!inviteEmail) return toast.error("Please enter a valid email address");

    setInviting(true);

    try {
      const BACKEND_URL = (import.meta as any).env?.VITE_BACKEND_URL || "http://localhost:5000";

      const response = await fetch(`${BACKEND_URL}/api/invites`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          organization_id: organization.id,
          email: inviteEmail.trim().toLowerCase(),
          role: inviteRole,
          invited_by: user.id,
          organization_name: organization.name,
          invited_by_name: profile?.full_name || user?.email || "Workspace Admin",
          frontend_url: window.location.origin,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to send invitation email");
      }

      const result = await response.json();

      setGeneratedLink(result.inviteUrl);
      toast.success(
        result.emailSent
          ? "Invitation sent & registration link dispatched!"
          : "Invitation saved, but email dispatch failed.",
      );
      setInviteEmail("");

      queryClient.invalidateQueries({ queryKey: ["invitations", organization.id] });
    } catch (error: any) {
      toast.error(error.message || "Failed to send invite");
    } finally {
      setInviting(false);
    }
  };

  // Handle role updates
  const handleUpdateRole = async () => {
    if (!organization?.id || !editingMember) return;
    setUpdatingRole(true);
    try {
      const { error } = await supabase
        .from("user_roles")
        .update({ role: newRole as any })
        .eq("user_id", editingMember.id)
        .eq("organization_id", organization.id);

      if (error) throw error;

      toast.success(`Role updated successfully for ${editingMember.full_name}!`);
      setEditingMember(null);
      queryClient.invalidateQueries({ queryKey: ["staff", organization.id] });
    } catch (error: any) {
      toast.error(error.message || "Failed to update role");
    } finally {
      setUpdatingRole(false);
    }
  };

  // Handle deleting a pending invite
  const handleDeleteInvite = async (id: string) => {
    if (!organization?.id) return;

    try {
      const { error } = await (supabase as any).from("invitations").delete().eq("id", id);
      if (error) throw error;

      toast.success("Invitation revoked successfully");
      queryClient.invalidateQueries({ queryKey: ["invitations", organization.id] });
    } catch (error: any) {
      toast.error(error.message || "Failed to revoke invitation");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Link copied to clipboard!");
  };

  // Security gate
  if (!isAuthorized) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="h-16 w-16 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center border border-rose-500/20 mb-6">
          <Lock className="h-6 w-6" />
        </div>
        <h2 className="text-2xl font-black text-foreground">Access Restricted</h2>
        <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto leading-relaxed">
          Staff Recruitment & Access directories are strictly limited to workspace administrators.
          Contact your workspace admin for details.
        </p>
      </div>
    );
  }

  const filteredStaff = staff.filter(
    (m) =>
      m.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.role.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getRoleBadge = (r: string) => {
    switch (r) {
      case "super_admin":
        return (
          <Badge className="rounded-full bg-blue-500/10 text-blue-500 border-blue-500/20 font-black text-[9px] uppercase tracking-wider">
            Super Admin
          </Badge>
        );
      case "admin":
        return (
          <Badge className="rounded-full bg-purple-500/10 text-purple-500 border-purple-500/20 font-black text-[9px] uppercase tracking-wider">
            Admin
          </Badge>
        );
      case "manager":
        return (
          <Badge className="rounded-full bg-amber-500/10 text-amber-500 border-amber-500/20 font-black text-[9px] uppercase tracking-wider">
            Manager
          </Badge>
        );
      case "finance_staff":
        return (
          <Badge className="rounded-full bg-cyan-500/10 text-cyan-500 border-cyan-500/20 font-black text-[9px] uppercase tracking-wider">
            Finance
          </Badge>
        );
      default:
        return (
          <Badge
            variant="secondary"
            className="rounded-full font-black text-[9px] uppercase tracking-wider"
          >
            Viewer
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground font-sans">
            Staff Directory
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Recruit and coordinate team members, assign workspace permission hierarchies, and review
            invites.
          </p>
        </div>
        <Button
          shape="pill"
          onClick={() => {
            setGeneratedLink("");
            setIsInviteOpen(true);
          }}
          className="font-semibold shadow-md bg-primary hover:bg-primary/95 text-white gap-2 px-6"
        >
          <Plus className="h-4.5 w-4.5" /> Invite Staff
        </Button>
      </div>

      <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
        <DialogContent className="border border-border/60 bg-card shadow-[var(--shadow-elegant)] rounded-3xl p-6 sm:p-8 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-foreground">
              Invite Workspace Member
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Send a secure invitation registration link to recruit new workspace members.
            </DialogDescription>
          </DialogHeader>

          {generatedLink ? (
            <div className="space-y-5 py-4">
              <div className="rounded-2xl bg-emerald-500/10 p-4 border border-emerald-500/20 text-xs text-emerald-700 dark:text-emerald-400 font-semibold leading-relaxed flex items-start gap-2.5">
                <Sparkles className="h-5 w-5 shrink-0 mt-0.5" />
                <div>
                  Invitation successfully sent! An email invitation with the onboarding registration
                  link has been dispatched to your team member.
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider pl-1">
                  Backup Onboarding Link
                </Label>
                <div className="flex gap-2">
                  <Input
                    value={generatedLink}
                    readOnly
                    className="rounded-full px-5 h-11 border-border/80 text-xs font-semibold bg-muted/40 select-all"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(generatedLink)}
                    className="rounded-full h-11 w-11 shrink-0 border-border/80 bg-card"
                  >
                    <Copy className="h-4.5 w-4.5" />
                  </Button>
                </div>
              </div>
              <DialogFooter className="pt-2">
                <Button
                  shape="pill"
                  onClick={() => setIsInviteOpen(false)}
                  className="w-full font-semibold rounded-full bg-primary text-white"
                >
                  Done
                </Button>
              </DialogFooter>
            </div>
          ) : (
            <form onSubmit={handleInviteStaff} className="space-y-5 py-4">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-xs font-bold text-muted-foreground/80 pl-1 uppercase tracking-wider"
                >
                  Staff Email Address <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="e.g. associate@company.com"
                  className="rounded-full px-5 h-11 border-border/80"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="role"
                  className="text-xs font-bold text-muted-foreground/80 pl-1 uppercase tracking-wider"
                >
                  Permission Access Role <span className="text-rose-500">*</span>
                </Label>
                <Select value={inviteRole} onValueChange={setInviteRole}>
                  <SelectTrigger className="rounded-full px-5 h-11 border-border/80">
                    <SelectValue placeholder="Access Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="viewer">Viewer (Read-Only Dashboards)</SelectItem>
                    <SelectItem value="finance_staff">
                      Finance Staff (Manage Ledgers & Payouts)
                    </SelectItem>
                    <SelectItem value="manager">
                      Manager (Create Invoices & Coordinate Staff)
                    </SelectItem>
                    <SelectItem value="admin">Administrator (Full System Settings)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <DialogFooter className="pt-4 gap-2 sm:gap-0">
                <Button
                  type="button"
                  variant="ghost"
                  shape="pill"
                  onClick={() => setIsInviteOpen(false)}
                  className="font-semibold px-5 rounded-full"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={inviting}
                  shape="pill"
                  className="font-semibold shadow-md bg-primary hover:bg-primary/95 text-white px-6 rounded-full"
                >
                  {inviting ? <Loader2 className="h-4.5 w-4.5 animate-spin mr-2" /> : null}
                  Send Invite Link
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingMember} onOpenChange={(open) => !open && setEditingMember(null)}>
        <DialogContent className="border border-border/60 bg-card shadow-[var(--shadow-elegant)] rounded-3xl p-6 sm:p-8 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-foreground">
              Edit Staff Access Role
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Modify the permissions and access level for{" "}
              <strong className="text-foreground">{editingMember?.full_name}</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label
                htmlFor="edit-role"
                className="text-xs font-bold text-muted-foreground/80 pl-1 uppercase tracking-wider"
              >
                Permission Access Role <span className="text-rose-500">*</span>
              </Label>
              <Select value={newRole} onValueChange={setNewRole}>
                <SelectTrigger className="rounded-full px-5 h-11 border-border/80">
                  <SelectValue placeholder="Access Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="viewer">Viewer (Read-Only Dashboards)</SelectItem>
                  <SelectItem value="finance_staff">
                    Finance Staff (Manage Ledgers & Payouts)
                  </SelectItem>
                  <SelectItem value="manager">
                    Manager (Create Invoices & Coordinate Staff)
                  </SelectItem>
                  <SelectItem value="admin">Administrator (Full System Settings)</SelectItem>
                  <SelectItem value="super_admin">Super Administrator (All Access)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="pt-4 gap-2 sm:gap-0">
            <Button
              type="button"
              variant="ghost"
              shape="pill"
              onClick={() => setEditingMember(null)}
              className="font-semibold px-5 rounded-full"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleUpdateRole}
              disabled={updatingRole}
              shape="pill"
              className="font-semibold shadow-md bg-primary hover:bg-primary/95 text-white px-6 rounded-full"
            >
              {updatingRole ? <Loader2 className="h-4.5 w-4.5 animate-spin mr-2" /> : null}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Active Staff List */}
        <Card className="lg:col-span-2 border-border/60 bg-card/90 backdrop-blur-xl shadow-[var(--shadow-card)] rounded-[2rem] overflow-hidden min-h-[400px]">
          <CardHeader className="pb-4 pt-6 border-b border-border/40 px-6 sm:px-8 bg-muted/10">
            <CardTitle className="text-lg font-bold tracking-tight">
              Active Staff Directory
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              List of users currently authorized in this organization.
            </CardDescription>
          </CardHeader>
          <div className="p-4 border-b border-border/40 bg-muted/5 flex items-center px-6">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search staff members by name or role..."
                className="pl-10 pr-5 rounded-full h-10 border-border/80 bg-background"
              />
            </div>
          </div>
          <CardContent className="p-0">
            {staffLoading ? (
              <div className="flex flex-col items-center justify-center py-24 text-muted-foreground gap-2">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <span className="text-xs font-semibold">Aligning directory catalog...</span>
              </div>
            ) : filteredStaff.length === 0 ? (
              <div className="py-20 text-center">
                <span className="text-xs text-muted-foreground font-semibold">
                  No team members cataloged.
                </span>
              </div>
            ) : (
              <div className="divide-y divide-border/30">
                {filteredStaff.map((member) => (
                  <div
                    key={member.id}
                    className="p-6 flex items-center justify-between hover:bg-muted/10 transition-colors"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="h-10 w-10 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold text-sm uppercase shrink-0">
                        {member.full_name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-extrabold text-foreground truncate">
                          {member.full_name}
                        </h4>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          Joined: {formatDate(member.joined_at)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getRoleBadge(member.role)}
                      {member.id !== user?.id && (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted"
                          onClick={() => {
                            setEditingMember(member);
                            setNewRole(member.role);
                          }}
                          title="Edit Access Role"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pending Invites list */}
        <Card className="lg:col-span-1 border-border/60 bg-card/90 backdrop-blur-xl shadow-[var(--shadow-card)] rounded-[2rem] overflow-hidden min-h-[400px]">
          <CardHeader className="pb-4 pt-6 border-b border-border/40 px-6 bg-muted/10">
            <CardTitle className="text-sm font-black text-foreground uppercase tracking-wider">
              Pending Onboardings
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Tokens generated but not yet redeemed.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 overflow-y-auto max-h-[450px]">
            {invitesLoading ? (
              <div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <span className="text-xs font-semibold">Syncing invitations...</span>
              </div>
            ) : invitations.length === 0 ? (
              <div className="py-20 text-center text-muted-foreground px-4 text-xs font-semibold flex flex-col items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground/60 border border-border">
                  <Mail className="h-4 w-4" />
                </div>
                <span>Zero pending invitations. All recruiters clear!</span>
              </div>
            ) : (
              <div className="divide-y divide-border/30">
                {invitations.map((invite) => (
                  <div
                    key={invite.id}
                    className="p-5 space-y-3.5 hover:bg-muted/10 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div className="min-w-0 pr-2">
                        <p
                          className="text-xs font-bold text-foreground truncate"
                          title={invite.email}
                        >
                          {invite.email}
                        </p>
                        <div className="mt-1.5 flex items-center gap-1.5 text-[9px] text-muted-foreground font-semibold">
                          <Calendar className="h-3 w-3" />
                          <span>Generated: {formatDate(invite.created_at)}</span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteInvite(invite.id)}
                        className="h-8 w-8 text-muted-foreground/40 hover:text-rose-500 rounded-full shrink-0"
                        aria-label="Revoke Invite"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-border/20">
                      {getRoleBadge(invite.role)}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          copyToClipboard(`${window.location.origin}/signup?invite=${invite.token}`)
                        }
                        className="h-7 text-[10px] font-black text-primary hover:bg-primary/5 rounded-full px-2 gap-1 cursor-pointer"
                      >
                        <Copy className="h-3 w-3" /> Copy URL
                      </Button>
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
