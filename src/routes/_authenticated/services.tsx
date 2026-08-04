import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Search, Pencil, Trash2, Loader2, ClipboardList, Users } from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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

export const Route = createFileRoute("/_authenticated/services")({
  head: () => ({ meta: [{ title: "Services — Todellaa" }] }),
  component: ServicesPage,
});

const schema = z.object({
  name: z.string().min(1, "Service name is required"),
  fee: z.coerce.number().min(0, "Fee must be a positive number"),
});
type FormValues = z.infer<typeof schema>;

interface Service {
  id: string;
  organization_id: string;
  name: string;
  fee: number;
  created_at: string;
  updated_at: string;
}

function ServicesPage() {
  const { organization, role } = useAuth();
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const isAdmin = role === "super_admin" || role === "admin";
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const currency = organization?.currency ?? "NGN";

  const { data: services, isLoading } = useQuery({
    queryKey: ["services", organization?.id],
    enabled: !!organization?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Service[];
    },
  });

  const filtered = (services ?? []).filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()),
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", fee: 0 },
  });

  const openCreate = () => {
    setEditing(null);
    form.reset({ name: "", fee: 0 });
    setOpen(true);
  };

  const openEdit = (s: Service) => {
    setEditing(s);
    form.reset({ name: s.name, fee: Number(s.fee) });
    setOpen(true);
  };

  const onSubmit = async (values: FormValues) => {
    if (!organization) return;
    const payload = {
      name: values.name.trim(),
      fee: values.fee,
      organization_id: organization.id,
    };
    if (editing) {
      const { error } = await supabase.from("services").update(payload).eq("id", editing.id);
      if (error) return toast.error(error.message);
      toast.success("Service updated successfully");
    } else {
      const { error } = await supabase.from("services").insert(payload);
      if (error) return toast.error(error.message);
      toast.success("Service added successfully");
    }
    setOpen(false);
    qc.invalidateQueries({ queryKey: ["services"] });
  };

  const onDeleteConfirm = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from("services").delete().eq("id", deleteId);
    if (error) return toast.error(error.message);
    toast.success("Service deleted");
    setDeleteId(null);
    qc.invalidateQueries({ queryKey: ["services"] });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground font-sans">Services</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your service catalog and rate cards.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <Link to="/customers">
            <Button variant="outline" shape="pill" className="h-9 text-xs font-semibold border-border/80 text-muted-foreground hover:text-foreground gap-2">
              <Users className="h-4 w-4 text-primary" /> Customer Directory
            </Button>
          </Link>

          {isAdmin && (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button onClick={openCreate} shape="pill" className="font-semibold shadow-md bg-primary hover:bg-primary/95 text-white gap-2">
                  <Plus className="h-4 w-4" /> Add Service
                </Button>
              </DialogTrigger>
              <DialogContent className="rounded-3xl border-border/60 bg-card max-w-md p-6 sm:p-8 shadow-[var(--shadow-elegant)]">
                <DialogHeader className="pb-4 border-b border-border/40">
                  <DialogTitle className="text-xl font-extrabold tracking-tight text-foreground font-sans">
                    {editing ? "Edit Service" : "Create New Service"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 pt-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 pl-1">Service Name</Label>
                    <Input
                      className="rounded-full px-5 h-10 border-border/80 focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary/85 bg-background text-foreground transition-all"
                      placeholder="e.g. Coaching, Hostel Fee, Library"
                      {...form.register("name")}
                    />
                    {form.formState.errors.name && <p className="text-xs text-destructive pl-1">{form.formState.errors.name.message}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 pl-1">Fee / Rate ({currency})</Label>
                    <Input
                      type="number"
                      step="0.01"
                      className="rounded-full px-5 h-10 border-border/80 focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary/85 bg-background text-foreground transition-all"
                      placeholder="0.00"
                      {...form.register("fee")}
                    />
                    {form.formState.errors.fee && <p className="text-xs text-destructive pl-1">{form.formState.errors.fee.message}</p>}
                  </div>
                  <DialogFooter className="pt-4 border-t border-border/40 gap-2 sm:gap-0">
                    <Button type="button" variant="ghost" shape="pill" onClick={() => setOpen(false)} className="px-5 font-semibold text-muted-foreground hover:bg-muted">Cancel</Button>
                    <Button type="submit" shape="pill" className="px-6 font-semibold shadow-md bg-primary hover:bg-primary/95 text-white" disabled={form.formState.isSubmitting}>
                      {form.formState.isSubmitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                      {editing ? "Save Changes" : "Create Service"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      <Card className="border-border/60 bg-card shadow-[var(--shadow-card)] rounded-2xl overflow-hidden">
        <CardContent className="p-6 space-y-6">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-11 pr-5 h-11 rounded-full border-border/80 focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary/85 bg-background text-foreground transition-all"
              placeholder="Search services by name..."
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
            <EmptyState search={search} onAdd={openCreate} isAdmin={isAdmin} />
          ) : (
            <div className="overflow-x-auto rounded-xl border border-border/40">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="font-bold text-foreground py-4 pl-6">Service Name</TableHead>
                    <TableHead className="font-bold text-foreground py-4 text-right">Fee / Rate</TableHead>
                    <TableHead className="font-bold text-foreground py-4">Created</TableHead>
                    {isAdmin && (
                      <TableHead className="font-bold text-foreground py-4 text-right pr-6">Actions</TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((s) => (
                    <TableRow key={s.id} className="hover:bg-muted/20 transition-colors duration-150 border-b border-border/30 last:border-b-0">
                      <TableCell className="py-4 pl-6 font-bold text-foreground">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-primary/10 text-primary font-black text-xs flex items-center justify-center border border-primary/20 shrink-0">
                            <ClipboardList className="h-4 w-4" />
                          </div>
                          <span className="tracking-tight">{s.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 text-right font-extrabold text-foreground">
                        {formatCurrency(s.fee, currency)}
                      </TableCell>
                      <TableCell className="py-4 text-sm text-muted-foreground">
                        {new Date(s.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                      </TableCell>
                      {isAdmin && (
                        <TableCell className="py-4 text-right pr-6">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-9 w-9 rounded-full bg-muted/50 hover:bg-muted text-primary border border-border/50 transition-colors"
                              onClick={() => openEdit(s)}
                              title="Edit service"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-9 w-9 rounded-full bg-destructive/5 hover:bg-destructive/10 text-destructive border border-destructive/10 transition-colors"
                              onClick={() => setDeleteId(s.id)}
                              title="Delete service"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
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
              Delete Service
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground mt-2">
              Are you sure you want to delete this service? This action is permanent and cannot be undone. Customers assigned to this service will not be affected.
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
    </div>
  );
}

function EmptyState({ search, onAdd, isAdmin }: { search: string; onAdd: () => void; isAdmin: boolean }) {
  return (
    <div className="text-center py-16 border border-dashed border-border/80 rounded-2xl bg-muted/10">
      <div className="mx-auto h-14 w-14 rounded-full bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
        <ClipboardList className="h-6 w-6" />
      </div>
      <h3 className="mt-5 text-lg font-bold tracking-tight text-foreground font-sans">No services {search ? "match your search" : "yet"}</h3>
      <p className="mt-1.5 max-w-sm mx-auto text-sm text-muted-foreground">
        {search ? "Try refining your keywords." : "Create your first service to start building rate cards for your customers."}
      </p>
      {!search && isAdmin && (
        <Button onClick={onAdd} shape="pill" className="mt-6 font-semibold shadow-md bg-primary hover:bg-primary/95 text-white gap-2">
          <Plus className="h-4 w-4" /> Add Service
        </Button>
      )}
    </div>
  );
}
