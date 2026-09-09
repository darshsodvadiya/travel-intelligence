import type { Destination } from "@/types";
import { Link } from "@tanstack/react-router";
import { CrowdLevelBadge } from "./CrowdLevelBadge";
import { ScoreGauge } from "./ScoreGauge";

export function DestinationCard({ destination }: { destination: Destination }) {
  return (
    <Link
      to="/destination/$id"
      params={{ id: destination.id.toString() }}
      data-ocid="destination.card"
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-subtle transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={destination.imageUrl}
          alt={destination.name}
          loading="lazy"
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3">
          <ScoreGauge score={destination.score} />
        </div>
        <div className="absolute right-3 top-3">
          <CrowdLevelBadge level={destination.crowdLevel} />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="font-display text-lg font-semibold text-foreground">
          {destination.name}
        </h3>
        <p className="text-sm text-muted-foreground">{destination.country}</p>
      </div>
    </Link>
  );
}
