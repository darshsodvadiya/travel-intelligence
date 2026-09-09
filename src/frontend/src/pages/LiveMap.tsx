import { useListDestinations } from "@/hooks/useQueries";
import { cn } from "@/lib/utils";
import { CrowdLevel, type Destination } from "@/types";
import { Link } from "@tanstack/react-router";
import { MapPin, Navigation, Radio } from "lucide-react";

// Equirectangular projection of lat/lng onto a 2:1 world map viewBox.
const MAP_WIDTH = 800;
const MAP_HEIGHT = 400;

function project(lat: number, lng: number) {
  return {
    x: ((lng + 180) / 360) * MAP_WIDTH,
    y: ((90 - lat) / 180) * MAP_HEIGHT,
  };
}

// Simplified world map (equirectangular projection, 2:1 aspect ratio) rendered
// as a single path. Each continent is a closed subpath so the landmass reads
// clearly against the ocean background.
const WORLD_MAP_PATH = [
  // North America
  "M 95 62 L 128 50 L 158 56 L 178 50 L 196 58 L 212 52 L 224 62 L 218 74 L 232 82 L 226 96 L 210 104 L 200 98 L 188 106 L 172 100 L 160 108 L 148 100 L 136 108 L 124 100 L 112 106 L 100 98 L 92 104 L 84 94 L 92 84 L 84 72 L 95 62 Z",
  // Greenland
  "M 300 40 L 322 34 L 340 40 L 334 52 L 344 62 L 332 70 L 318 64 L 306 70 L 296 60 L 300 40 Z",
  // South America
  "M 168 168 L 190 160 L 212 168 L 226 176 L 218 190 L 230 204 L 220 218 L 230 232 L 220 246 L 230 260 L 220 274 L 228 288 L 216 300 L 206 292 L 198 302 L 188 294 L 180 302 L 170 292 L 176 280 L 166 268 L 176 256 L 166 244 L 176 232 L 166 220 L 176 208 L 166 196 L 176 184 L 168 168 Z",
  // Europe
  "M 360 66 L 380 58 L 400 64 L 418 58 L 432 66 L 424 78 L 436 88 L 424 98 L 410 92 L 398 100 L 386 92 L 374 100 L 362 92 L 352 100 L 342 90 L 352 78 L 360 66 Z",
  // Africa
  "M 350 118 L 372 108 L 396 116 L 418 108 L 436 118 L 428 132 L 440 146 L 428 160 L 440 174 L 428 188 L 438 202 L 426 216 L 414 208 L 404 218 L 392 210 L 382 220 L 370 212 L 360 220 L 348 210 L 356 198 L 346 186 L 356 174 L 346 162 L 356 150 L 346 138 L 356 126 L 350 118 Z",
  // Asia
  "M 440 60 L 470 50 L 500 58 L 530 50 L 560 58 L 590 50 L 620 58 L 650 50 L 680 58 L 710 50 L 740 58 L 770 50 L 790 60 L 780 74 L 790 88 L 780 102 L 790 116 L 780 130 L 790 144 L 780 158 L 790 172 L 780 186 L 790 200 L 780 214 L 790 228 L 780 242 L 790 256 L 780 270 L 790 284 L 780 298 L 790 312 L 780 326 L 790 340 L 780 354 L 790 368 L 780 382 L 790 396 L 760 388 L 730 396 L 700 388 L 670 396 L 640 388 L 610 396 L 580 388 L 550 396 L 520 388 L 490 396 L 460 388 L 430 396 L 400 388 L 370 396 L 340 388 L 310 396 L 280 388 L 250 396 L 220 388 L 190 396 L 160 388 L 130 396 L 100 388 L 70 396 L 40 388 L 10 396 L 0 388 L 0 374 L 10 360 L 0 346 L 10 332 L 0 318 L 10 304 L 0 290 L 10 276 L 0 262 L 10 248 L 0 234 L 10 220 L 0 206 L 10 192 L 0 178 L 10 164 L 0 150 L 10 136 L 0 122 L 10 108 L 0 94 L 10 80 L 0 66 L 10 52 L 0 38 L 10 24 L 0 10 L 10 4 L 40 10 L 70 4 L 100 10 L 130 4 L 160 10 L 190 4 L 220 10 L 250 4 L 280 10 L 310 4 L 340 10 L 370 4 L 400 10 L 430 4 L 440 10 L 440 60 Z",
  // Southeast Asia / Indonesia
  "M 470 300 L 500 292 L 530 300 L 560 292 L 590 300 L 620 292 L 650 300 L 680 292 L 710 300 L 740 292 L 770 300 L 790 308 L 780 322 L 790 336 L 780 350 L 790 364 L 780 378 L 770 384 L 740 378 L 710 384 L 680 376 L 650 384 L 620 376 L 590 384 L 560 376 L 530 384 L 500 376 L 470 384 L 440 376 L 430 368 L 440 354 L 430 340 L 440 326 L 430 312 L 440 300 L 470 300 Z",
  // Australia
  "M 620 330 L 650 322 L 680 330 L 700 340 L 690 354 L 700 368 L 690 382 L 680 390 L 650 384 L 620 392 L 600 384 L 610 370 L 598 356 L 610 342 L 620 330 Z",
  // New Zealand
  "M 780 360 L 792 356 L 798 366 L 790 376 L 780 372 L 780 360 Z",
].join(" ");

const crowdMeta: Record<
  CrowdLevel,
  { label: string; dot: string; ring: string; text: string }
> = {
  low: {
    label: "Low",
    dot: "bg-success",
    ring: "ring-success/40",
    text: "text-success",
  },
  medium: {
    label: "Medium",
    dot: "bg-warning",
    ring: "ring-warning/40",
    text: "text-warning",
  },
  high: {
    label: "High",
    dot: "bg-destructive",
    ring: "ring-destructive/40",
    text: "text-destructive",
  },
};

const legendOrder: CrowdLevel[] = [
  CrowdLevel.low,
  CrowdLevel.medium,
  CrowdLevel.high,
];

function MapMarker({ destination }: { destination: Destination }) {
  const { x, y } = project(
    destination.coordinates.lat,
    destination.coordinates.lng,
  );
  const meta = crowdMeta[destination.crowdLevel];

  return (
    <Link
      to="/destination/$id"
      params={{ id: destination.id.toString() }}
      data-ocid="map_marker"
      aria-label={`${destination.name}, ${destination.country} — crowd level ${meta.label}`}
      className="group absolute -translate-x-1/2 -translate-y-1/2 focus-visible:outline-none"
      style={{
        left: `${(x / MAP_WIDTH) * 100}%`,
        top: `${(y / MAP_HEIGHT) * 100}%`,
      }}
    >
      <span
        className={cn(
          "flex size-4 items-center justify-center rounded-full ring-4 transition-transform duration-200 group-hover:scale-125 group-focus-visible:scale-125 sm:size-5",
          meta.dot,
          meta.ring,
        )}
      >
        <span className="size-1.5 rounded-full bg-white/90 sm:size-2" />
      </span>
      <span
        className={cn(
          "pointer-events-none absolute left-1/2 top-full z-10 mt-2 -translate-x-1/2 whitespace-nowrap rounded-md border border-border bg-card px-2 py-1 text-xs font-medium text-foreground opacity-0 shadow-elevated transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100",
        )}
      >
        {destination.name}
      </span>
    </Link>
  );
}

export function LiveMapPage() {
  const { data: destinations, isLoading, isError } = useListDestinations();

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <Radio className="size-3.5 text-primary" />
            Live Crowd Map
          </div>
          <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Crowd Levels, At a Glance
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Explore destinations positioned by their real coordinates, with
            color-coded crowd levels so you can spot the quieter spots before
            you book.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 rounded-2xl border border-border bg-card px-4 py-3 shadow-subtle">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Legend
          </span>
          {legendOrder.map((level) => {
            const meta = crowdMeta[level];
            return (
              <span
                key={level}
                className="inline-flex items-center gap-2 text-sm font-medium text-foreground"
              >
                <span
                  className={cn("size-3 rounded-full", meta.dot)}
                  aria-hidden="true"
                />
                {meta.label}
              </span>
            );
          })}
        </div>
      </div>

      <div className="mt-8 overflow-hidden rounded-3xl border border-border bg-card shadow-elevated">
        <div className="flex flex-col gap-2 border-b border-border bg-muted/40 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Navigation className="size-4 text-primary" />
            <span>
              {isLoading
                ? "Loading destinations…"
                : `${destinations?.length ?? 0} destinations mapped`}
            </span>
          </div>
          <span
            data-ocid="demo_data_badge"
            className="inline-flex w-fit items-center gap-1.5 rounded-full border border-warning/30 bg-warning/10 px-2.5 py-1 text-xs font-medium text-warning"
          >
            <span
              className="size-1.5 rounded-full bg-warning"
              aria-hidden="true"
            />
            Demo crowd data — live traffic APIs not connected yet
          </span>
        </div>

        <div className="relative p-3 sm:p-5">
          <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-subtle">
            <svg
              viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
              role="img"
              aria-label="World map showing destination crowd levels"
              className="block h-auto w-full"
              preserveAspectRatio="xMidYMid meet"
            >
              <path d="M0 0 H800 V400 H0 Z" fill="oklch(0.96 0.01 230)" />
              <path
                d={WORLD_MAP_PATH}
                fill="oklch(0.85 0.02 230)"
                stroke="oklch(0.72 0.02 230)"
                strokeWidth="1"
                strokeLinejoin="round"
              />
            </svg>

            {isLoading && (
              <div
                data-ocid="loading_state"
                className="absolute inset-0 flex items-center justify-center bg-background/40"
              >
                <div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground shadow-elevated">
                  <span className="size-2 animate-pulse rounded-full bg-primary" />
                  Loading destinations…
                </div>
              </div>
            )}

            {isError && (
              <div
                data-ocid="error_state"
                className="absolute inset-0 flex items-center justify-center bg-background/40"
              >
                <div className="rounded-2xl border border-border bg-card px-6 py-4 text-center shadow-elevated">
                  <p className="font-display font-semibold text-foreground">
                    Couldn&apos;t load the map
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Please try again in a moment.
                  </p>
                </div>
              </div>
            )}

            {!isLoading &&
              !isError &&
              destinations?.map((destination) => (
                <MapMarker
                  key={destination.id.toString()}
                  destination={destination}
                />
              ))}
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {legendOrder.map((level) => {
          const meta = crowdMeta[level];
          const count =
            destinations?.filter((d) => d.crowdLevel === level).length ?? 0;
          return (
            <div
              key={level}
              className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-subtle"
            >
              <span
                className={cn(
                  "flex size-10 items-center justify-center rounded-xl",
                  meta.dot,
                )}
              >
                <MapPin className="size-5 text-white" />
              </span>
              <div>
                <p
                  className={cn(
                    "font-display text-sm font-semibold",
                    meta.text,
                  )}
                >
                  {meta.label} crowd
                </p>
                <p className="text-sm text-muted-foreground">
                  {count} destination{count === 1 ? "" : "s"}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-8 flex items-start gap-2 rounded-2xl border border-border bg-card p-4 text-sm text-muted-foreground shadow-subtle">
        <Radio className="mt-0.5 size-4 shrink-0 text-primary" />
        <span>
          Crowd levels shown here are{" "}
          <strong className="font-semibold text-foreground">demo data</strong>{" "}
          for preview purposes. Once live traffic and crowd APIs are connected,
          this map will reflect real-time conditions. Select any marker to open
          its destination intelligence page.
        </span>
      </p>
    </section>
  );
}
