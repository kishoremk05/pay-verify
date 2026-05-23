import { useState, useEffect } from "react";
import { AlertCircle, CheckCircle2, ChevronRight, CornerDownRight, HelpCircle, Loader2, Table, Upload } from "lucide-react";

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface ImportField {
  key: string;
  label: string;
  required: boolean;
  type: "string" | "number" | "email" | "date";
}

interface ImportWizardProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  headers: string[];
  rawData: any[];
  fields: ImportField[];
  onImport: (mappedData: any[]) => Promise<void>;
}

export function ImportWizard({ isOpen, onClose, title, headers, rawData, fields, onImport }: ImportWizardProps) {
  const [step, setStep] = useState<"mapping" | "validation">("mapping");
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [validatedData, setValidatedData] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-map headers on load
  useEffect(() => {
    if (isOpen && headers.length > 0) {
      const initialMapping: Record<string, string> = {};
      const assignedHeaders = new Set<string>();

      // Pass 1: Perfect / exact matches
      fields.forEach((f) => {
        const matched = headers.find((h) => {
          const normH = h.toLowerCase().replace(/[\s_-]/g, "");
          const normK = f.key.toLowerCase().replace(/[\s_-]/g, "");
          const normL = f.label.toLowerCase().replace(/[\s_-]/g, "");
          return normH === normK || normH === normL;
        });
        if (matched) {
          initialMapping[f.key] = matched;
          assignedHeaders.add(matched);
        }
      });

      // Pass 2: Synonym-aware matching for remaining fields
      const synonyms: Record<string, string[]> = {
        transaction_id: ["transaction_id", "transactionid", "transaction", "txid", "txnid", "tx_id", "txn_id", "trx_id", "trxid", "payment_id", "paymentid", "id", "ref", "reference"],
        customer_code: ["customer_code", "customercode", "customer_id", "customerid", "cust_code", "custcode", "cust_id", "custid", "customer", "code"],
        amount_paid: ["amount_paid", "amountpaid", "amount_received", "amountreceived", "amount", "paid", "received", "value"],
        expected_amount: ["expected_amount", "expectedamount", "expected", "amount", "payable", "payable_amount", "value"],
        payment_method: ["payment_method", "paymentmethod", "method", "type", "payment_type", "paymenttype"],
        reference: ["reference", "ref", "payment_ref", "pay_ref", "reference_no", "referenceno", "ref_no", "refno"],
        payment_date: ["payment_date", "paymentdate", "date", "created_at", "createdat", "time", "timestamp"],
        source: ["source", "origin", "channel", "payment_source", "paymentsource"],
        currency: ["currency", "curr", "monetary_unit", "monetaryunit"],
        notes: ["notes", "note", "remarks", "remark", "description", "desc", "memo"]
      };

      fields.forEach((f) => {
        if (!initialMapping[f.key]) {
          const fieldSynonyms = synonyms[f.key] || [];
          
          // First try to find a synonym among UNASSIGNED headers
          let matched = headers.find((h) => {
            if (assignedHeaders.has(h)) return false;
            const normH = h.toLowerCase().replace(/[\s_-]/g, "");
            return fieldSynonyms.some((syn) => {
              const normSyn = syn.toLowerCase().replace(/[\s_-]/g, "");
              return normH === normSyn || normH.includes(normSyn) || normSyn.includes(normH);
            });
          });

          // If not found, try to find a synonym among already assigned headers
          if (!matched) {
            matched = headers.find((h) => {
              const normH = h.toLowerCase().replace(/[\s_-]/g, "");
              return fieldSynonyms.some((syn) => {
                const normSyn = syn.toLowerCase().replace(/[\s_-]/g, "");
                return normH === normSyn || normH.includes(normSyn) || normSyn.includes(normH);
              });
            });
          }

          if (matched) {
            initialMapping[f.key] = matched;
            assignedHeaders.add(matched);
          } else {
            initialMapping[f.key] = "";
          }
        }
      });

      // Fill in empty strings for any fields that are still missing from the mapping
      fields.forEach((f) => {
        if (!initialMapping[f.key]) {
          initialMapping[f.key] = "";
        }
      });

      setMapping(initialMapping);
      setStep("mapping");
    }
  }, [isOpen, headers, fields]);

  // Run validation
  const handleProceedToValidation = () => {
    // Check if required fields are mapped
    const unmappedRequired = fields.filter((f) => f.required && !mapping[f.key]);
    if (unmappedRequired.length > 0) {
      return toast.error(`Please map required fields: ${unmappedRequired.map((f) => f.label).join(", ")}`);
    }

    // Map and validate rows
    const uniqueMap: Record<string, Set<string>> = {};
    fields.forEach((f) => {
      uniqueMap[f.key] = new Set();
    });

    // Detect duplicate references / transaction IDs inside the sheet
    const duplicateFields = ["reference", "transaction_id", "customer_code"];
    const occurrencesMap: Record<string, Record<string, number>> = {};
    duplicateFields.forEach((key) => {
      occurrencesMap[key] = {};
      const mappedHeader = mapping[key];
      if (mappedHeader) {
        rawData.forEach((row) => {
          const val = String(row[mappedHeader] ?? "").trim();
          if (val) {
            occurrencesMap[key][val] = (occurrencesMap[key][val] ?? 0) + 1;
          }
        });
      }
    });

    const rows = rawData.map((row, index) => {
      const mappedRow: Record<string, any> = { _index: index, _errors: [] as string[], _warnings: [] as string[] };
      
      fields.forEach((f) => {
        const header = mapping[f.key];
        let val = header ? row[header] : undefined;

        // Clean values
        if (val === undefined || val === null) {
          val = "";
        } else {
          val = String(val).trim();
        }

        // Required field validation
        if (f.required && !val) {
          mappedRow._errors.push(`${f.label} is required.`);
        }

        // Numeric validation
        if (f.type === "number" && val) {
          const num = Number(val);
          if (isNaN(num)) {
            mappedRow._errors.push(`${f.label} must be a valid number.`);
          } else if (num < 0) {
            mappedRow._errors.push(`${f.label} cannot be negative.`);
          }
        }

        // Email validation
        if (f.type === "email" && val) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(val)) {
            mappedRow._warnings.push(`Invalid email format: "${val}".`);
          }
        }

        // Duplication in file check
        if (duplicateFields.includes(f.key) && val) {
          if ((occurrencesMap[f.key]?.[val] ?? 0) > 1) {
            mappedRow._warnings.push(`Duplicate ${f.label} in uploaded file: "${val}".`);
          }
        }

        mappedRow[f.key] = val;
      });

      return mappedRow;
    });

    setValidatedData(rows);
    setStep("validation");
  };

  const handleImport = async () => {
    const importableRows = validatedData.filter((r) => r._errors.length === 0);
    if (importableRows.length === 0) {
      return toast.error("No valid rows to import. Please resolve error cells first.");
    }

    setIsSubmitting(true);
    try {
      // Clean up metadata keys before passing to onImport callback
      const cleanRows = importableRows.map((r) => {
        const { _index, _errors, _warnings, ...clean } = r;
        return clean;
      });
      await onImport(cleanRows);
      toast.success(`Successfully imported ${cleanRows.length} records!`);
      onClose();
    } catch (err: any) {
      toast.error(err.message ?? "Failed to import records.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalRows = validatedData.length;
  const errorRowsCount = validatedData.filter((r) => r._errors.length > 0).length;
  const warningRowsCount = validatedData.filter((r) => r._warnings.length > 0 && r._errors.length === 0).length;
  const cleanRowsCount = validatedData.filter((r) => r._errors.length === 0 && r._warnings.length === 0).length;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isSubmitting && onClose()}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col rounded-3xl border-border/60 bg-card shadow-[var(--shadow-elegant)] p-6 md:p-8">
        <DialogHeader className="pb-4 border-b border-border/40 shrink-0">
          <DialogTitle className="flex items-center gap-3 text-xl font-extrabold text-foreground font-sans">
            <Table className="h-5 w-5 text-primary" />
            {title} — Import Wizard
          </DialogTitle>
          <p className="text-xs text-muted-foreground mt-1">
            Map columns from your sheet to the system fields and preview any conflicts or data formatting warnings before confirming import.
          </p>
        </DialogHeader>

        {step === "mapping" ? (
          <div className="flex-1 overflow-y-auto py-4 space-y-4 min-h-0">
            <div className="bg-muted/10 border rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <CornerDownRight className="h-4 w-4 text-primary" />
                Step 1: Map Excel Columns
              </h3>
              <p className="text-xs text-muted-foreground">
                Select which spreadsheet columns correspond to each application field. Fields marked with an asterisk (<span className="text-destructive font-black">*</span>) are strictly required.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {fields.map((f) => (
                <div key={f.key} className="flex flex-col gap-2 p-4 rounded-xl border border-border/40 bg-background/50">
                  <label className="text-xs font-bold text-foreground flex items-center gap-1.5 pl-1">
                    {f.label}
                    {f.required && <span className="text-destructive font-bold text-sm">*</span>}
                    <span title={`Field type: ${f.type}`}><HelpCircle className="h-3 w-3 text-muted-foreground" /></span>
                  </label>
                  <Select
                     value={mapping[f.key] || "_unmapped"}
                     onValueChange={(val) => setMapping((m) => ({ ...m, [f.key]: val === "_unmapped" ? "" : val }))}
                  >
                    <SelectTrigger className="rounded-full border-border/80 px-4">
                      <SelectValue placeholder="-- Match spreadsheet column --" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-border/60">
                      <SelectItem value="_unmapped">-- Unmapped / Skip Field --</SelectItem>
                      {headers.map((h) => (
                        <SelectItem key={h} value={h}>{h}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-hidden flex flex-col py-4 space-y-4 min-h-0">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 shrink-0">
              <div className="p-4 rounded-2xl bg-muted/20 border border-border/50 text-center space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Total Rows</p>
                <p className="text-lg font-black text-foreground">{totalRows}</p>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 text-center space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Clean Rows</p>
                <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">{cleanRowsCount}</p>
              </div>
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 text-center space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Warnings</p>
                <p className="text-lg font-black text-amber-600 dark:text-amber-400">{warningRowsCount}</p>
              </div>
              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 text-center space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">Errors</p>
                <p className="text-lg font-black text-rose-600 dark:text-rose-400">{errorRowsCount}</p>
              </div>
            </div>

            <div className="flex-1 min-h-0 overflow-auto border border-border/40 rounded-2xl bg-background/50">
              <div className="min-w-[600px]">
                <table className="w-full border-collapse text-left text-xs font-sans">
                  <thead>
                    <tr className="bg-muted/40 border-b border-border/60 text-muted-foreground font-black uppercase text-[10px]">
                      <th className="p-3 pl-5 w-16">Row</th>
                      <th className="p-3 w-28">Validation Status</th>
                      {fields.map((f) => (
                        <th key={f.key} className="p-3">{f.label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {validatedData.map((row, idx) => {
                      const hasErrors = row._errors.length > 0;
                      const hasWarnings = row._warnings.length > 0;
                      
                      let rowBg = "hover:bg-muted/10";
                      let statusBadge = (
                        <Badge variant="outline" className="rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20 gap-1 text-[9px] font-bold">
                          <CheckCircle2 className="h-3 w-3" /> Ready
                        </Badge>
                      );

                      if (hasErrors) {
                        rowBg = "bg-rose-500/5 hover:bg-rose-500/10";
                        statusBadge = (
                          <Badge variant="outline" className="rounded-full bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-500/20 gap-1 text-[9px] font-bold" title={row._errors.join("\n")}>
                            <AlertCircle className="h-3 w-3 shrink-0" /> {row._errors.length} Error{row._errors.length > 1 ? "s" : ""}
                          </Badge>
                        );
                      } else if (hasWarnings) {
                        rowBg = "bg-amber-500/5 hover:bg-amber-500/10";
                        statusBadge = (
                          <Badge variant="outline" className="rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-500/20 gap-1 text-[9px] font-bold" title={row._warnings.join("\n")}>
                            <AlertCircle className="h-3 w-3 shrink-0" /> {row._warnings.length} Warning{row._warnings.length > 1 ? "s" : ""}
                          </Badge>
                        );
                      }

                      return (
                        <tr key={idx} className={`transition-colors border-b border-border/20 last:border-0 ${rowBg}`}>
                          <td className="p-3 pl-5 font-mono text-muted-foreground font-semibold">{row._index + 2}</td>
                          <td className="p-3">{statusBadge}</td>
                          {fields.map((f) => {
                            const val = row[f.key];
                            return (
                              <td key={f.key} className="p-3 font-medium text-foreground/80 max-w-[200px] truncate">
                                {val === "" ? (
                                  <span className="text-muted-foreground/30 italic">empty</span>
                                ) : (
                                  String(val)
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {errorRowsCount > 0 && (
              <p className="text-[11px] text-destructive font-semibold flex items-center gap-1.5 bg-destructive/5 p-3 rounded-xl border border-destructive/10">
                <AlertCircle className="h-4 w-4 shrink-0" />
                Note: {errorRowsCount} rows contain critical errors and will be automatically skipped during the import process. Only clean or warning rows will be created.
              </p>
            )}
          </div>
        )}

        <DialogFooter className="pt-4 border-t border-border/40 shrink-0 gap-2 sm:gap-0 mt-4">
          <Button
            type="button"
            variant="ghost"
            shape="pill"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-5 font-semibold text-muted-foreground"
          >
            Cancel
          </Button>

          <div className="flex gap-2">
            {step === "validation" && (
              <Button
                type="button"
                variant="outline"
                shape="pill"
                onClick={() => setStep("mapping")}
                disabled={isSubmitting}
                className="px-5 font-semibold"
              >
                Back to Mapping
              </Button>
            )}

            {step === "mapping" ? (
              <Button
                type="button"
                shape="pill"
                onClick={handleProceedToValidation}
                className="px-6 font-semibold bg-primary hover:bg-primary/95 text-white gap-1.5"
              >
                Next: Validate Rows <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="button"
                shape="pill"
                onClick={handleImport}
                disabled={isSubmitting || cleanRowsCount + warningRowsCount === 0}
                className="px-6 font-semibold bg-primary hover:bg-primary/95 text-white gap-2 shadow-md"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Importing...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" /> Reconcile & Import ({cleanRowsCount + warningRowsCount} Rows)
                  </>
                )}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
