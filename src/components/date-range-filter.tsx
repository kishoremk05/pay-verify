import { useState, useEffect } from "react";
import { format, subDays, startOfDay, endOfDay } from "date-fns";
import { Calendar as CalendarIcon, Check } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";

export interface DateRangeFilterValue {
  startDate: string | null;
  endDate: string | null;
}

interface DateRangeFilterProps {
  value?: DateRangeFilterValue;
  onChange: (value: DateRangeFilterValue) => void;
  className?: string;
}

type Preset = "all" | "7days" | "30days" | "custom";

export function DateRangeFilter({ onChange, className }: DateRangeFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activePreset, setActivePreset] = useState<Preset>("all");
  const [customRange, setCustomRange] = useState<DateRange | undefined>(undefined);

  // Trigger change handler when preset or custom range changes
  const applyRange = (preset: Preset, range?: DateRange) => {
    setActivePreset(preset);
    if (preset === "all") {
      onChange({ startDate: null, endDate: null });
      setIsOpen(false);
    } else if (preset === "7days") {
      const start = subDays(new Date(), 7);
      onChange({
        startDate: startOfDay(start).toISOString(),
        endDate: endOfDay(new Date()).toISOString(),
      });
      setIsOpen(false);
    } else if (preset === "30days") {
      const start = subDays(new Date(), 30);
      onChange({
        startDate: startOfDay(start).toISOString(),
        endDate: endOfDay(new Date()).toISOString(),
      });
      setIsOpen(false);
    } else if (preset === "custom" && range?.from) {
      const start = range.from;
      const end = range.to || range.from;
      onChange({
        startDate: startOfDay(start).toISOString(),
        endDate: endOfDay(end).toISOString(),
      });
      // Do not auto-close so the user can select both start and end dates
      if (range.from && range.to) {
        setIsOpen(false);
      }
    }
  };

  const getTriggerText = () => {
    if (activePreset === "all") return "All Time";
    if (activePreset === "7days") return "Last 7 Days";
    if (activePreset === "30days") return "Last 30 Days";
    if (activePreset === "custom" && customRange?.from) {
      const fromStr = format(customRange.from, "MMM d, yyyy");
      if (customRange.to) {
        return `${fromStr} - ${format(customRange.to, "MMM d, yyyy")}`;
      }
      return fromStr;
    }
    return "Select Date Range";
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            shape="pill"
            className="h-10 text-xs font-semibold border-border/80 text-muted-foreground hover:text-foreground gap-2 px-4 shadow-[var(--shadow-card)]"
          >
            <CalendarIcon className="h-4 w-4 text-primary" />
            <span>{getTriggerText()}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="w-auto p-0 border-border/60 bg-card rounded-[1.5rem] shadow-[var(--shadow-elegant)] overflow-hidden"
        >
          <div className="flex flex-col md:flex-row">
            {/* Presets Column */}
            <div className="flex flex-col gap-1 border-r border-border/40 p-4 min-w-[160px] bg-muted/10 shrink-0">
              <span className="font-mono text-[9px] text-muted-foreground/60 font-bold uppercase tracking-wider mb-2 px-2">
                Date Presets
              </span>
              {[
                { id: "all", label: "All Time" },
                { id: "7days", label: "Last 7 Days" },
                { id: "30days", label: "Last 30 Days" },
                { id: "custom", label: "Custom Range" },
              ].map((p) => (
                <Button
                  key={p.id}
                  variant="ghost"
                  shape="pill"
                  onClick={() => {
                    if (p.id !== "custom") {
                      setCustomRange(undefined);
                      applyRange(p.id as Preset);
                    } else {
                      setActivePreset("custom");
                    }
                  }}
                  className={cn(
                    "justify-between text-xs font-semibold px-3 py-2 h-9 text-left font-sans w-full",
                    activePreset === p.id
                      ? "bg-primary/10 text-primary hover:bg-primary/15"
                      : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  <span>{p.label}</span>
                  {activePreset === p.id && <Check className="h-3.5 w-3.5" />}
                </Button>
              ))}
            </div>

            {/* Calendar Selection */}
            {activePreset === "custom" && (
              <div className="p-2 border-t md:border-t-0 border-border/40 bg-card">
                <Calendar
                  mode="range"
                  selected={customRange}
                  onSelect={(range) => {
                    setCustomRange(range);
                    applyRange("custom", range);
                  }}
                  numberOfMonths={1}
                />
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
