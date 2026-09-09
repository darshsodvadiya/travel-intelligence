import { CrowdLevelBadge } from "@/components/CrowdLevelBadge";
import { DestinationCard } from "@/components/DestinationCard";
import { ScoreGauge } from "@/components/ScoreGauge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useDestination, useListDestinations } from "@/hooks/useQueries";
import type { Destination } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  CalendarDays,
  CloudRain,
  CloudSun,
  Droplets,
  MapPin,
  Sun,
  Thermometer,
  Umbrella,
  Wind,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const CATEGORY_LABELS: Record<string, string> = {
  city: "City",
  beach: "Beach",
  mountain: "Mountain",
  country: "Country",
  attraction: "Attraction",
};

interface OpenMeteoResponse {
  current?: {
    temperature_2m?: number;
    apparent_temperature?: number;
    relative_humidity_2m?: number;
    wind_speed_10m?: number;
    weather_code?: number;
  };
  daily?: {
    time?: string[];
    temperature_2m_max?: number[];
    temperature_2m_min?: number[];
    precipitation_probability_max?: number[];
    weather_code?: number[];
  };
}

function weatherLabel(code: number | undefined): string {
  if (code === undefined) return "Unknown";
  if (code === 0) return "Clear sky";
  if (code === 1) return "Mainly clear";
  if (code === 2) return "Partly cloudy";
  if (code === 3) return "Overcast";
  if (code >= 51 && code <= 67) return "Rain";
  if (code >= 71 && code <= 77) return "Snow";
  if (code >= 80 && code <= 82) return "Rain showers";
  if (code >= 95) return "Thunderstorm";
  return "Cloudy";
}

function isRainy(code: number | undefined): boolean {
  if (code === undefined) return false;
  return (code >= 51 && code <= 67) || (code >= 80 && code <= 82) || code >= 95;
}

function useWeather(lat: number | undefined, lng: number | undefined) {
  return useQuery({
    queryKey: ["weather", lat, lng],
    queryFn: async () => {
      if (lat === undefined || lng === undefined) return null;
      const params = new URLSearchParams({
        latitude: String(lat),
        longitude: String(lng),
        current:
          "temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code",
        daily:
          "temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code",
        timezone: "auto",
        forecast_days: "7",
      });
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?${params.toString()}`,
      );
      if (!res.ok) throw new Error("Weather request failed");
      return (await res.json()) as OpenMeteoResponse;
    },
    enabled: lat !== undefined && lng !== undefined,
    staleTime: 10 * 60 * 1000,
  });
}

function formatDay(dateStr: string | undefined): string {
  if (!dateStr) return "";
  const date = new Date(`${dateStr}T00:00:00`);
  return date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function ScoreFactorBar({
  label,
  value,
}: {
  label: string;
  value: bigint;
}) {
  const n = Number(value);
  return (
    <div className="flex items-center gap-3">
      <span className="w-24 shrink-0 text-sm font-medium text-muted-foreground">
        {label}
      </span>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-gradient-primary transition-all duration-500"
          style={{ width: `${n}%` }}
        />
      </div>
      <span className="w-8 shrink-0 text-right font-mono text-sm font-semibold text-foreground">
        {n}
      </span>
    </div>
  );
}

function BudgetPlanner({ destination }: { destination: Destination }) {
  const initial = useMemo(
    () => ({
      hotel: Number(destination.budget.hotel),
      food: Number(destination.budget.food),
      transport: Number(destination.budget.transport),
      activities: Number(destination.budget.activities),
    }),
    [destination],
  );

  const [draft, setDraft] = useState(initial);

  useEffect(() => {
    setDraft(initial);
  }, [initial]);

  const total = draft.hotel + draft.food + draft.transport + draft.activities;

  const update = (key: keyof typeof draft, value: string) => {
    const parsed = Number(value);
    setDraft((d) => ({ ...d, [key]: Number.isNaN(parsed) ? 0 : parsed }));
  };

  const rows: {
    key: keyof typeof draft;
    label: string;
    icon: typeof MapPin;
  }[] = [
    { key: "hotel", label: "Hotel", icon: MapPin },
    { key: "food", label: "Food", icon: Droplets },
    { key: "transport", label: "Transport", icon: Wind },
    { key: "activities", label: "Activities", icon: Sun },
  ];

  return (
    <Card data-ocid="budget_planner" className="shadow-subtle">
      <CardHeader>
        <CardTitle className="font-display">Budget Planner</CardTitle>
        <CardDescription>
          Estimated per-person trip cost. Adjust the inputs to match your plans.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {rows.map((row) => (
          <div
            key={row.key}
            className="flex items-center justify-between gap-4"
          >
            <label
              htmlFor={`budget-${row.key}`}
              className="flex items-center gap-2 text-sm font-medium text-foreground"
            >
              <row.icon className="size-4 text-primary" />
              {row.label}
            </label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">$</span>
              <Input
                id={`budget-${row.key}`}
                data-ocid={`budget.input.${row.key}`}
                type="number"
                min={0}
                value={draft[row.key]}
                onChange={(e) => update(row.key, e.target.value)}
                className="w-28 text-right font-mono"
              />
            </div>
          </div>
        ))}
        <div className="flex items-center justify-between border-t border-border pt-4">
          <span className="text-sm font-medium text-muted-foreground">
            Estimated total
          </span>
          <span
            data-ocid="budget.total"
            className="font-mono text-2xl font-bold text-foreground"
          >
            ${total.toLocaleString()}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          Demo estimate based on typical per-person costs. Adjust inputs to
          refine.
        </p>
      </CardContent>
    </Card>
  );
}

function WeatherPanel({ destination }: { destination: Destination }) {
  const { data, isLoading, isError } = useWeather(
    destination.coordinates.lat,
    destination.coordinates.lng,
  );

  const current = data?.current;
  const daily = data?.daily;
  const rainyToday = isRainy(current?.weather_code);
  const rainyWeek = (daily?.weather_code ?? []).some(isRainy);

  return (
    <Card data-ocid="weather_panel" className="shadow-subtle">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-display">
          <CloudSun className="size-5 text-primary" />
          Live Weather
        </CardTitle>
        <CardDescription>
          Current conditions and 7-day outlook via Open-Meteo.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {isLoading && (
          <div className="space-y-3">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        )}
        {isError && (
          <p className="text-sm text-muted-foreground">
            Weather is temporarily unavailable. Showing demo conditions.
          </p>
        )}
        {!isLoading && !isError && current && (
          <>
            <div className="flex items-center justify-between rounded-2xl bg-gradient-subtle p-5">
              <div>
                <p className="text-sm text-muted-foreground">Now</p>
                <p className="font-display text-4xl font-bold text-foreground">
                  {Math.round(current.temperature_2m ?? 0)}°
                </p>
                <p className="text-sm text-muted-foreground">
                  {weatherLabel(current.weather_code)}
                </p>
              </div>
              <div className="grid gap-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <Thermometer className="size-4 text-primary" />
                  Feels {Math.round(current.apparent_temperature ?? 0)}°
                </span>
                <span className="flex items-center gap-2">
                  <Droplets className="size-4 text-primary" />
                  {current.relative_humidity_2m ?? 0}% humidity
                </span>
                <span className="flex items-center gap-2">
                  <Wind className="size-4 text-primary" />
                  {Math.round(current.wind_speed_10m ?? 0)} km/h
                </span>
              </div>
            </div>

            {daily?.time && (
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
                {daily.time.slice(0, 7).map((day, i) => (
                  <div
                    key={day}
                    className="flex flex-col items-center gap-1 rounded-xl border border-border bg-card p-2 text-center"
                  >
                    <span className="text-[10px] font-medium text-muted-foreground">
                      {formatDay(day)}
                    </span>
                    {isRainy(daily.weather_code?.[i]) ? (
                      <CloudRain className="size-4 text-primary" />
                    ) : (
                      <Sun className="size-4 text-warning" />
                    )}
                    <span className="font-mono text-xs font-semibold text-foreground">
                      {Math.round(daily.temperature_2m_max?.[i] ?? 0)}°
                    </span>
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {Math.round(daily.temperature_2m_min?.[i] ?? 0)}°
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="rounded-2xl border border-accent/30 bg-accent/10 p-4">
              <p className="flex items-center gap-2 text-sm font-semibold text-accent-foreground">
                <Umbrella className="size-4" />
                Itinerary adjustment hint
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {rainyToday
                  ? "Rain is expected today — consider swapping outdoor plans for indoor alternatives like museums, galleries, or a cooking class."
                  : rainyWeek
                    ? "Some rain is forecast this week. Keep a flexible day for indoor attractions and pack a light layer."
                    : "Clear conditions ahead — great time to lock in outdoor activities and scenic viewpoints."}
              </p>
            </div>
          </>
        )}
        <p className="text-xs text-muted-foreground">
          Live data from Open-Meteo (api.open-meteo.com). Forecasts update
          regularly.
        </p>
      </CardContent>
    </Card>
  );
}

function SmartAlternatives({
  destination,
}: {
  destination: Destination;
}) {
  const { data: allDestinations } = useListDestinations();
  const alternatives = useMemo(
    () =>
      (allDestinations ?? []).filter((d) =>
        destination.alternatives.includes(d.id),
      ),
    [allDestinations, destination.alternatives],
  );

  return (
    <section data-ocid="smart_alternatives" className="mt-12">
      <div className="mb-5">
        <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">
          Smart Alternatives
        </h2>
        <p className="mt-1 max-w-2xl text-muted-foreground">
          {destination.crowdLevel === "high"
            ? `${destination.name} is busy right now. These less crowded nearby destinations offer a similar experience with more breathing room.`
            : `Looking for a change of pace? These nearby destinations pair well with ${destination.name}.`}
        </p>
      </div>
      {alternatives.length === 0 ? (
        <Card className="shadow-subtle">
          <CardContent className="flex flex-col items-center gap-2 py-10 text-center">
            <MapPin className="size-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              No nearby alternatives listed yet.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {alternatives.map((alt) => (
            <DestinationCard key={alt.id.toString()} destination={alt} />
          ))}
        </div>
      )}
    </section>
  );
}

export function DestinationDetailPage() {
  const { id } = useParams({ strict: false });
  const destinationId = useMemo(() => {
    if (!id) return undefined;
    try {
      return BigInt(id);
    } catch {
      return undefined;
    }
  }, [id]);

  const {
    data: destination,
    isLoading,
    isError,
  } = useDestination(destinationId);

  if (isLoading) {
    return (
      <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="mt-6 h-80 w-full rounded-2xl" />
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <Skeleton className="h-64 rounded-2xl lg:col-span-2" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      </section>
    );
  }

  if (isError || !destination) {
    return (
      <section className="mx-auto w-full max-w-7xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <h1 className="font-display text-3xl font-bold text-foreground">
          Destination not found
        </h1>
        <p className="mt-3 text-muted-foreground">
          We couldn't load this destination. It may have been removed.
        </p>
        <Button asChild type="button" className="mt-6">
          <Link to="/explore" search={{ q: "", category: undefined }}>
            Back to Explore
          </Link>
        </Button>
      </section>
    );
  }

  const factors = [
    { label: "Weather", value: destination.scoreFactors.weather },
    { label: "Crowd", value: destination.scoreFactors.crowd },
    { label: "Cost", value: destination.scoreFactors.cost },
    { label: "Traffic", value: destination.scoreFactors.traffic },
    { label: "Activities", value: destination.scoreFactors.activities },
  ];

  return (
    <div className="pb-16">
      {/* Gallery hero */}
      <div className="relative h-[52vh] min-h-[360px] w-full overflow-hidden">
        <img
          src={destination.imageUrl}
          alt={destination.name}
          className="size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30" />
        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto w-full max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
            <Link
              to="/explore"
              search={{ q: "", category: undefined }}
              data-ocid="back_link"
              className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-white/90 transition-colors hover:text-white"
            >
              <ArrowLeft className="size-4" />
              Back to Explore
            </Link>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur">
                    {CATEGORY_LABELS[destination.category] ??
                      destination.category}
                  </span>
                  <CrowdLevelBadge level={destination.crowdLevel} />
                </div>
                <h1 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
                  {destination.name}
                </h1>
                <p className="mt-2 flex items-center gap-1.5 text-white/90">
                  <MapPin className="size-4" />
                  {destination.country}
                </p>
              </div>
              <div className="rounded-2xl bg-white/15 px-4 py-3 backdrop-blur">
                <p className="text-xs font-medium uppercase tracking-wide text-white/80">
                  Travel Intelligence Score
                </p>
                <div className="mt-1">
                  <ScoreGauge score={destination.score} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mt-10 grid gap-8 lg:grid-cols-3">
          {/* Left column: overview + score + best time */}
          <div className="space-y-8 lg:col-span-2">
            <section data-ocid="overview">
              <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">
                Overview
              </h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                {destination.description}
              </p>
            </section>

            <Card data-ocid="score_breakdown" className="shadow-subtle">
              <CardHeader>
                <CardTitle className="font-display">
                  Travel Intelligence Score
                </CardTitle>
                <CardDescription>
                  How {destination.name} scores across the factors that matter
                  for a great trip.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {factors.map((f) => (
                  <ScoreFactorBar
                    key={f.label}
                    label={f.label}
                    value={f.value}
                  />
                ))}
              </CardContent>
            </Card>

            <Card data-ocid="best_time" className="shadow-subtle">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-display">
                  <CalendarDays className="size-5 text-primary" />
                  Best Time to Visit
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Best months
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {destination.bestTimeToVisit.bestMonths.map((m) => (
                      <span
                        key={m.toString()}
                        className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary"
                      >
                        {MONTH_NAMES[Number(m) - 1] ?? m.toString()}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Best days
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {destination.bestTimeToVisit.bestDays.map((day) => (
                      <span
                        key={day}
                        className="rounded-full bg-accent/10 px-3 py-1 text-sm font-medium text-accent-foreground"
                      >
                        {day}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="rounded-xl bg-muted p-3 text-sm text-muted-foreground">
                  {destination.bestTimeToVisit.reason}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Right column: budget + weather */}
          <div className="space-y-8">
            <BudgetPlanner destination={destination} />
            <WeatherPanel destination={destination} />
          </div>
        </div>

        <SmartAlternatives destination={destination} />
      </div>
    </div>
  );
}
