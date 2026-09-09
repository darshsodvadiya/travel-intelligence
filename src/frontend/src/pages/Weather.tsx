import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useListDestinations } from "@/hooks/useQueries";
import type { Destination } from "@/types";
import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  Droplets,
  Lightbulb,
  MapPin,
  Sun,
  Thermometer,
  Umbrella,
  Wind,
} from "lucide-react";
import { useMemo, useState } from "react";

/* ------------------------------------------------------------------ */
/* Open-Meteo types                                                    */
/* ------------------------------------------------------------------ */

interface OpenMeteoResponse {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    precipitation: number;
    weather_code: number;
    wind_speed_10m: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    precipitation_probability: number[];
    weather_code: number[];
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: number[];
  };
}

/* ------------------------------------------------------------------ */
/* WMO weather code mapping                                            */
/* ------------------------------------------------------------------ */

interface WeatherMeta {
  label: string;
  icon: typeof Sun;
  indoor: boolean;
}

const WEATHER_CODES: Record<number, WeatherMeta> = {
  0: { label: "Clear sky", icon: Sun, indoor: false },
  1: { label: "Mainly clear", icon: Sun, indoor: false },
  2: { label: "Partly cloudy", icon: CloudSun, indoor: false },
  3: { label: "Overcast", icon: Cloud, indoor: false },
  45: { label: "Fog", icon: CloudFog, indoor: true },
  48: { label: "Rime fog", icon: CloudFog, indoor: true },
  51: { label: "Light drizzle", icon: CloudDrizzle, indoor: true },
  53: { label: "Drizzle", icon: CloudDrizzle, indoor: true },
  55: { label: "Dense drizzle", icon: CloudDrizzle, indoor: true },
  56: { label: "Freezing drizzle", icon: CloudDrizzle, indoor: true },
  57: { label: "Freezing drizzle", icon: CloudDrizzle, indoor: true },
  61: { label: "Light rain", icon: CloudRain, indoor: true },
  63: { label: "Rain", icon: CloudRain, indoor: true },
  65: { label: "Heavy rain", icon: CloudRain, indoor: true },
  66: { label: "Freezing rain", icon: CloudRain, indoor: true },
  67: { label: "Freezing rain", icon: CloudRain, indoor: true },
  71: { label: "Light snow", icon: CloudSnow, indoor: true },
  73: { label: "Snow", icon: CloudSnow, indoor: true },
  75: { label: "Heavy snow", icon: CloudSnow, indoor: true },
  77: { label: "Snow grains", icon: CloudSnow, indoor: true },
  80: { label: "Light showers", icon: CloudDrizzle, indoor: true },
  81: { label: "Showers", icon: CloudRain, indoor: true },
  82: { label: "Violent showers", icon: CloudRain, indoor: true },
  85: { label: "Snow showers", icon: CloudSnow, indoor: true },
  86: { label: "Snow showers", icon: CloudSnow, indoor: true },
  95: { label: "Thunderstorm", icon: CloudLightning, indoor: true },
  96: { label: "Thunderstorm", icon: CloudLightning, indoor: true },
  99: { label: "Thunderstorm", icon: CloudLightning, indoor: true },
};

function weatherMeta(code: number): WeatherMeta {
  return (
    WEATHER_CODES[code] ?? {
      label: "Unknown",
      icon: Cloud,
      indoor: false,
    }
  );
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function formatHour(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleTimeString([], {
    hour: "numeric",
    hour12: true,
  });
}

function formatDay(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function formatTemp(value: number): string {
  return `${Math.round(value)}°`;
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export function WeatherPage() {
  const { data: destinations, isPending: destinationsPending } =
    useListDestinations();
  const [selectedId, setSelectedId] = useState<string>("");
  const [weather, setWeather] = useState<OpenMeteoResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selected = useMemo<Destination | undefined>(
    () => destinations?.find((d) => d.id.toString() === selectedId),
    [destinations, selectedId],
  );

  const fetchWeather = async (destination: Destination) => {
    setLoading(true);
    setError(null);
    setWeather(null);
    try {
      const params = new URLSearchParams({
        latitude: destination.coordinates.lat.toString(),
        longitude: destination.coordinates.lng.toString(),
        current:
          "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m",
        hourly: "temperature_2m,precipitation_probability,weather_code",
        daily:
          "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max",
        timezone: "auto",
        forecast_days: "7",
      });
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?${params.toString()}`,
      );
      if (!res.ok) {
        throw new Error(`Weather request failed (${res.status})`);
      }
      const data = (await res.json()) as OpenMeteoResponse;
      setWeather(data);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Could not load live weather data.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (value: string) => {
    setSelectedId(value);
    const destination = destinations?.find((d) => d.id.toString() === value);
    if (destination) {
      void fetchWeather(destination);
    }
  };

  const currentMeta = weather
    ? weatherMeta(weather.current.weather_code)
    : null;

  const hourly = useMemo(() => {
    if (!weather) return [];
    const now = Date.now();
    return weather.hourly.time
      .map((time, i) => ({
        time,
        temp: weather.hourly.temperature_2m[i],
        precip: weather.hourly.precipitation_probability[i],
        code: weather.hourly.weather_code[i],
      }))
      .filter((h) => new Date(h.time).getTime() >= now)
      .slice(0, 24);
  }, [weather]);

  const daily = useMemo(() => {
    if (!weather) return [];
    return weather.daily.time.map((time, i) => ({
      time,
      code: weather.daily.weather_code[i],
      max: weather.daily.temperature_2m_max[i],
      min: weather.daily.temperature_2m_min[i],
      precip: weather.daily.precipitation_probability_max[i],
    }));
  }, [weather]);

  const itineraryHint = useMemo(() => {
    if (!weather) return null;
    const today = daily[0];
    if (!today) return null;
    const meta = weatherMeta(today.code);
    if (meta.indoor || today.precip >= 50) {
      return {
        tone: "rain" as const,
        title: "Rain likely — plan indoor alternatives",
        body: `${meta.label} with a ${today.precip}% chance of precipitation. Swap outdoor sightseeing for museums, galleries, cafés, or a cooking class, and keep a rain jacket handy for short breaks between stops.`,
      };
    }
    if (today.max >= 30) {
      return {
        tone: "heat" as const,
        title: "Hot day ahead — pace your itinerary",
        body: `Highs near ${formatTemp(today.max)}. Schedule outdoor activities for the morning or late afternoon, stay hydrated, and build in shaded or air-conditioned breaks at midday.`,
      };
    }
    return {
      tone: "clear" as const,
      title: "Great weather for outdoor plans",
      body: `${meta.label} and comfortable temperatures make this a strong day for walking tours, viewpoints, and open-air experiences.`,
    };
  }, [weather, daily]);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
          Live Weather
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Current conditions, hourly, and 7-day forecasts for any destination,
          powered by the Open-Meteo API.
        </p>
      </div>

      {/* Destination selector */}
      <div className="mt-8 max-w-md">
        <label
          htmlFor="destination-select"
          className="mb-2 block text-sm font-medium text-foreground"
        >
          Choose a destination
        </label>
        <Select value={selectedId} onValueChange={handleSelect}>
          <SelectTrigger
            id="destination-select"
            data-ocid="weather.destination_select"
            className="w-full"
          >
            <SelectValue placeholder="Select a destination" />
          </SelectTrigger>
          <SelectContent>
            {destinationsPending ? (
              <div className="px-3 py-2 text-sm text-muted-foreground">
                Loading destinations…
              </div>
            ) : (
              destinations?.map((d) => (
                <SelectItem
                  key={d.id.toString()}
                  value={d.id.toString()}
                  data-ocid="weather.destination_option"
                >
                  {d.name}, {d.country}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Empty state */}
      {!selected && !loading && !error && (
        <Card
          data-ocid="weather.empty_state"
          className="mt-10 border-dashed bg-card/50"
        >
          <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-accent/15 text-accent">
              <CloudSun className="size-7" />
            </span>
            <h2 className="font-display text-xl font-semibold text-foreground">
              Select a destination to see its weather
            </h2>
            <p className="max-w-md text-sm text-muted-foreground">
              Pick a destination above and we&apos;ll pull live current
              conditions, an hourly outlook, and a 7-day forecast from
              Open-Meteo.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Loading state */}
      {loading && (
        <div data-ocid="weather.loading_state" className="mt-10 space-y-6">
          <Skeleton className="h-40 w-full rounded-2xl" />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
            {Array.from({ length: 8 }, (_, i) => `hour-${i}`).map((id) => (
              <Skeleton key={id} className="h-28 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-56 w-full rounded-2xl" />
        </div>
      )}

      {/* Error state */}
      {error && (
        <Card
          data-ocid="weather.error_state"
          className="mt-10 border-destructive/30 bg-destructive/5"
        >
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <CloudRain className="size-6" />
            </span>
            <h2 className="font-display text-lg font-semibold text-foreground">
              Couldn&apos;t load live weather
            </h2>
            <p className="max-w-md text-sm text-muted-foreground">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Weather content */}
      {selected && weather && !loading && !error && (
        <div className="mt-10 space-y-8">
          {/* Current conditions */}
          <Card data-ocid="weather.current_panel" className="overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-col gap-6 bg-gradient-subtle p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-5">
                  <span className="flex size-16 items-center justify-center rounded-2xl bg-accent/15 text-accent">
                    {currentMeta ? (
                      <currentMeta.icon className="size-9" />
                    ) : (
                      <CloudSun className="size-9" />
                    )}
                  </span>
                  <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="size-4" />
                      {selected.name}, {selected.country}
                    </div>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="font-display text-5xl font-bold tracking-tight text-foreground">
                        {formatTemp(weather.current.temperature_2m)}
                      </span>
                      <span className="text-lg text-muted-foreground">
                        {currentMeta?.label}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Feels like{" "}
                      {formatTemp(weather.current.apparent_temperature)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 lg:gap-8">
                  <div className="flex flex-col items-center gap-1 rounded-xl bg-card px-4 py-3 shadow-subtle">
                    <Droplets className="size-4 text-accent" />
                    <span className="font-mono text-lg font-semibold text-foreground">
                      {weather.current.relative_humidity_2m}%
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Humidity
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-1 rounded-xl bg-card px-4 py-3 shadow-subtle">
                    <Wind className="size-4 text-accent" />
                    <span className="font-mono text-lg font-semibold text-foreground">
                      {Math.round(weather.current.wind_speed_10m)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      km/h wind
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-1 rounded-xl bg-card px-4 py-3 shadow-subtle">
                    <Umbrella className="size-4 text-accent" />
                    <span className="font-mono text-lg font-semibold text-foreground">
                      {weather.current.precipitation} mm
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Precipitation
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Itinerary hint */}
          {itineraryHint && (
            <div
              data-ocid="weather.itinerary_hint"
              className={`flex flex-col gap-3 rounded-2xl border p-5 sm:flex-row sm:items-start ${
                itineraryHint.tone === "rain"
                  ? "border-accent/30 bg-accent/10"
                  : itineraryHint.tone === "heat"
                    ? "border-warning/30 bg-warning/10"
                    : "border-success/30 bg-success/10"
              }`}
            >
              <span
                className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${
                  itineraryHint.tone === "rain"
                    ? "bg-accent/15 text-accent"
                    : itineraryHint.tone === "heat"
                      ? "bg-warning/15 text-warning"
                      : "bg-success/15 text-success"
                }`}
              >
                <Lightbulb className="size-5" />
              </span>
              <div>
                <h3 className="font-display text-base font-semibold text-foreground">
                  {itineraryHint.title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {itineraryHint.body}
                </p>
              </div>
            </div>
          )}

          {/* Hourly forecast */}
          <Card data-ocid="weather.hourly_panel">
            <CardHeader>
              <CardTitle className="font-display text-lg">
                Hourly outlook
              </CardTitle>
              <CardDescription>
                Next 24 hours for {selected.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {hourly.map((h, i) => {
                  const meta = weatherMeta(h.code);
                  return (
                    <div
                      key={`${h.time}-${i}`}
                      data-ocid="weather.hourly_item"
                      className="flex min-w-[72px] flex-col items-center gap-2 rounded-xl border border-border bg-card px-3 py-3"
                    >
                      <span className="text-xs font-medium text-muted-foreground">
                        {formatHour(h.time)}
                      </span>
                      <meta.icon className="size-5 text-accent" />
                      <span className="font-mono text-sm font-semibold text-foreground">
                        {formatTemp(h.temp)}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Droplets className="size-3" />
                        {h.precip}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* 7-day forecast */}
          <Card data-ocid="weather.daily_panel">
            <CardHeader>
              <CardTitle className="font-display text-lg">
                7-day forecast
              </CardTitle>
              <CardDescription>
                Daily outlook for {selected.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="divide-y divide-border">
                {daily.map((d, i) => {
                  const meta = weatherMeta(d.code);
                  return (
                    <li
                      key={`${d.time}-${i}`}
                      data-ocid="weather.daily_item"
                      className="flex items-center gap-4 py-3"
                    >
                      <span className="w-28 shrink-0 text-sm font-medium text-foreground">
                        {i === 0 ? "Today" : formatDay(d.time)}
                      </span>
                      <span className="flex w-8 items-center justify-center text-accent">
                        <meta.icon className="size-5" />
                      </span>
                      <span className="hidden flex-1 text-sm text-muted-foreground sm:block">
                        {meta.label}
                      </span>
                      <span className="ml-auto flex items-center gap-3">
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Droplets className="size-3" />
                          {d.precip}%
                        </span>
                        <span className="w-24 text-right font-mono text-sm text-foreground">
                          <span className="text-muted-foreground">
                            {formatTemp(d.min)}
                          </span>
                          {" / "}
                          {formatTemp(d.max)}
                        </span>
                      </span>
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>

          {/* Data source note */}
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="secondary"
              data-ocid="weather.data_source_badge"
              className="gap-1.5"
            >
              <Thermometer className="size-3" />
              Live data via Open-Meteo
            </Badge>
            <p className="text-xs text-muted-foreground">
              Forecasts are model estimates and may change. Coordinates from the
              destination profile.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
