export const formatCurrency = (n: number | null | undefined, currency = "NGN") => {
  const v = Number(n ?? 0);
  // Hardcode the symbol to avoid locale rendering issues (e.g. ₦ showing as "N")
  const symbols: Record<string, string> = {
    NGN: "₦",
    USD: "$",
    EUR: "€",
    GBP: "£",
    GHS: "₵",
    INR: "₹",
    KES: "KSh",
    ZAR: "R",
  };
  const symbol = symbols[currency] ?? currency + " ";
  return symbol + v.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
};

export const formatDate = (d: string | Date | null | undefined) => {
  if (!d) return "—";
  const date = typeof d === "string" ? new Date(d) : d;
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(date);
};