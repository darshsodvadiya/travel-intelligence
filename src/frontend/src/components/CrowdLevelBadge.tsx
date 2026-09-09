import { cn } from "@/lib/utils";
import type { CrowdLevel } from "@/types";

const config: Record<
  CrowdLevel,
  { label: string; dot: string; className: string }
> = {
  low: {
    label: "Low",
    dot: "bg-success",
    className: "border-success/25 bg-success/10 text-success",
  },
  medium: {
    label: "Medium",
    dot: "bg-warning",
    className: "border-warning/25 bg-warning/10 text-warning",
  },
  high: {
    label: "High",
    dot: "bg-destructive",
    className: "border-destructive/25 bg-destructive/10 text-destructive",
  },
};

export function CrowdLevelBadge({ level }: { level: CrowdLevel }) {
  const c = config[level];
  return (
    <span
      data-ocid="crowd_level_badge"
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
        c.className,
      )}
    >
      <span className={cn("size-2 rounded-full", c.dot)} aria-hidden="true" />
      {c.label}
    </span>
  );
}
