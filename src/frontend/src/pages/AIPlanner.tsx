import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
  CalendarDays,
  Coffee,
  MapPin,
  Printer,
  Sparkles,
  TrainFront,
  Utensils,
  Wand2,
} from "lucide-react";
import { useMemo, useState } from "react";

const INTERESTS = [
  "Culture & History",
  "Food & Dining",
  "Nature & Outdoors",
  "Shopping",
  "Nightlife",
  "Art & Museums",
  "Adventure",
  "Relaxation",
] as const;

const BUDGETS = [
  { value: "budget", label: "Budget", hint: "$50–100 / day" },
  { value: "mid", label: "Mid-range", hint: "$100–250 / day" },
  { value: "luxury", label: "Luxury", hint: "$250+ / day" },
] as const;

const STYLES = [
  {
    value: "relaxed",
    label: "Relaxed",
    description: "Slow mornings, fewer stops, room to wander",
  },
  {
    value: "balanced",
    label: "Balanced",
    description: "A mix of sightseeing and downtime",
  },
  {
    value: "packed",
    label: "Packed",
    description: "Maximize every hour, sunrise to sunset",
  },
] as const;

interface DayPlan {
  day: number;
  dateLabel: string;
  theme: string;
  activities: string[];
  meals: { breakfast: string; lunch: string; dinner: string };
  transport: string;
}

interface Itinerary {
  destination: string;
  country: string;
  startLabel: string;
  endLabel: string;
  budgetLabel: string;
  styleLabel: string;
  interests: string[];
  days: DayPlan[];
}

const ACTIVITY_POOL: Record<string, string[]> = {
  "Culture & History": [
    "Guided walking tour of the old town",
    "Visit the historic landmarks and monuments",
    "Explore the local heritage quarter",
    "Tour the ancient sites with a local guide",
  ],
  "Food & Dining": [
    "Street food tasting tour",
    "Cooking class with local chefs",
    "Visit the central market for fresh produce",
    "Dinner at a highly-rated local restaurant",
  ],
  "Nature & Outdoors": [
    "Scenic hike with panoramic viewpoints",
    "Morning walk through the botanical gardens",
    "Boat trip along the coastline",
    "Sunset viewpoint overlooking the landscape",
  ],
  Shopping: [
    "Browse the artisan boutiques and craft shops",
    "Visit the main shopping district",
    "Explore the local flea market",
    "Pick up souvenirs at the specialty stores",
  ],
  Nightlife: [
    "Rooftop bar with city views",
    "Live music at a local venue",
    "Evening stroll through the illuminated streets",
    "Cocktails at a trendy lounge",
  ],
  "Art & Museums": [
    "Visit the city's top art museum",
    "Explore the contemporary art galleries",
    "See the local history museum",
    "Attend a cultural performance or exhibition",
  ],
  Adventure: [
    "Guided adventure excursion in the surrounding area",
    "Kayaking or paddleboarding session",
    "Mountain biking on scenic trails",
    "Zip-lining or rock climbing experience",
  ],
  Relaxation: [
    "Spa and wellness afternoon",
    "Leisurely beach or pool day",
    "Yoga session at sunrise",
    "Quiet café hopping and people-watching",
  ],
};

const TRANSPORT_POOL = [
  "Local metro and buses — grab a day pass",
  "Rideshare or taxis for longer hops",
  "Walkable city center, rent a bike for the day",
  "Hop-on-hop-off sightseeing bus",
  "Private driver for the day's excursions",
];

const MEAL_POOL = {
  breakfast: [
    "Café breakfast with fresh pastries and coffee",
    "Hotel breakfast buffet",
    "Local bakery breakfast on the go",
  ],
  lunch: [
    "Casual lunch at a neighborhood bistro",
    "Street food lunch at the market",
    "Picnic lunch with local specialties",
  ],
  dinner: [
    "Dinner at a waterfront restaurant",
    "Traditional dinner at a local favorite",
    "Fine dining tasting menu",
  ],
};

function formatDateLabel(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}

function generateItinerary(
  destination: Destination,
  start: Date,
  end: Date,
  budgetLabel: string,
  styleLabel: string,
  interests: string[],
): Itinerary {
  const dayCount = Math.max(
    1,
    Math.round((end.getTime() - start.getTime()) / 86_400_000) + 1,
  );
  const themes = [
    "Arrival & First Impressions",
    "Immersive Exploration",
    "Local Favorites",
    "Off the Beaten Path",
    "Highlights & Hidden Gems",
    "Leisure & Reflection",
    "Farewell & Final Moments",
  ];

  const days: DayPlan[] = Array.from({ length: dayCount }, (_, i) => {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    const seed = i + 1;
    const activeInterests =
      interests.length > 0
        ? interests
        : ["Culture & History", "Food & Dining", "Nature & Outdoors"];
    const activities = activeInterests.map((interest, j) =>
      pick(
        ACTIVITY_POOL[interest] ?? ACTIVITY_POOL["Culture & History"],
        seed + j,
      ),
    );

    return {
      day: i + 1,
      dateLabel: formatDateLabel(date),
      theme: themes[i % themes.length],
      activities,
      meals: {
        breakfast: pick(MEAL_POOL.breakfast, seed),
        lunch: pick(MEAL_POOL.lunch, seed + 1),
        dinner: pick(MEAL_POOL.dinner, seed + 2),
      },
      transport: pick(TRANSPORT_POOL, seed + 3),
    };
  });

  return {
    destination: destination.name,
    country: destination.country,
    startLabel: formatDateLabel(start),
    endLabel: formatDateLabel(end),
    budgetLabel,
    styleLabel,
    interests,
    days,
  };
}

export function AIPlannerPage() {
  const { data: destinations, isLoading } = useListDestinations();

  const [destinationId, setDestinationId] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [budget, setBudget] = useState<string>("mid");
  const [style, setStyle] = useState<string>("balanced");
  const [interests, setInterests] = useState<string[]>([]);
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);

  const selectedDestination = useMemo(
    () => destinations?.find((d) => d.id.toString() === destinationId),
    [destinations, destinationId],
  );

  const canSubmit =
    !!selectedDestination && !!startDate && !!endDate && endDate >= startDate;

  function toggleInterest(interest: string) {
    setInterests((current) =>
      current.includes(interest)
        ? current.filter((i) => i !== interest)
        : [...current, interest],
    );
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedDestination || !startDate || !endDate) return;
    const budgetLabel =
      BUDGETS.find((b) => b.value === budget)?.label ?? "Mid-range";
    const styleLabel =
      STYLES.find((s) => s.value === style)?.label ?? "Balanced";
    setItinerary(
      generateItinerary(
        selectedDestination,
        new Date(`${startDate}T00:00:00`),
        new Date(`${endDate}T00:00:00`),
        budgetLabel,
        styleLabel,
        interests,
      ),
    );
  }

  function handlePrint() {
    window.print();
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <Badge
          variant="secondary"
          className="mb-4 gap-1.5 border-accent/30 bg-accent/10 text-accent"
        >
          <Sparkles className="size-3" />
          Demo generator
        </Badge>
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Plan with <span className="text-gradient-primary">AI</span>
        </h1>
        <p className="mt-4 text-muted-foreground">
          Tell us where you're going, when, and how you like to travel — we'll
          draft a day-by-day itinerary you can view and print.
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          This is a demo/mock generator. Itineraries are created from your
          inputs until the OpenAI API is connected.
        </p>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        {/* Form */}
        <Card className="h-fit shadow-subtle">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-display">
              <Wand2 className="size-5 text-primary" />
              Trip details
            </CardTitle>
            <CardDescription>
              Fill in your preferences to generate an itinerary.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-6"
              data-ocid="planner.form"
            >
              <div className="flex flex-col gap-2">
                <Label htmlFor="destination">Destination</Label>
                {isLoading ? (
                  <Skeleton className="h-9 w-full" />
                ) : (
                  <Select
                    value={destinationId}
                    onValueChange={setDestinationId}
                  >
                    <SelectTrigger
                      id="destination"
                      data-ocid="planner.destination"
                      className="w-full"
                    >
                      <SelectValue placeholder="Where do you want to go?" />
                    </SelectTrigger>
                    <SelectContent>
                      {destinations?.map((d) => (
                        <SelectItem
                          key={d.id.toString()}
                          value={d.id.toString()}
                        >
                          {d.name}, {d.country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="startDate">Start date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    data-ocid="planner.start_date"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="endDate">End date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={endDate}
                    min={startDate || undefined}
                    onChange={(e) => setEndDate(e.target.value)}
                    data-ocid="planner.end_date"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label>Daily budget</Label>
                <RadioGroup
                  value={budget}
                  onValueChange={setBudget}
                  className="grid grid-cols-1 gap-2 sm:grid-cols-3"
                  data-ocid="planner.budget"
                >
                  {BUDGETS.map((b) => (
                    <Label
                      key={b.value}
                      htmlFor={`budget-${b.value}`}
                      className="flex cursor-pointer flex-col gap-1 rounded-lg border border-border p-3 transition-colors has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-accent/10"
                    >
                      <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                        <RadioGroupItem
                          value={b.value}
                          id={`budget-${b.value}`}
                          className="border-input"
                        />
                        {b.label}
                      </span>
                      <span className="pl-6 text-xs text-muted-foreground">
                        {b.hint}
                      </span>
                    </Label>
                  ))}
                </RadioGroup>
              </div>

              <div className="flex flex-col gap-2">
                <Label>Travel style</Label>
                <RadioGroup
                  value={style}
                  onValueChange={setStyle}
                  className="grid grid-cols-1 gap-2"
                  data-ocid="planner.style"
                >
                  {STYLES.map((s) => (
                    <Label
                      key={s.value}
                      htmlFor={`style-${s.value}`}
                      className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3 transition-colors has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-accent/10"
                    >
                      <RadioGroupItem
                        value={s.value}
                        id={`style-${s.value}`}
                        className="mt-0.5 border-input"
                      />
                      <span className="flex flex-col gap-0.5">
                        <span className="text-sm font-medium text-foreground">
                          {s.label}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {s.description}
                        </span>
                      </span>
                    </Label>
                  ))}
                </RadioGroup>
              </div>

              <div className="flex flex-col gap-2">
                <Label>Interests</Label>
                <div
                  className="grid grid-cols-1 gap-2 sm:grid-cols-2"
                  data-ocid="planner.interests"
                >
                  {INTERESTS.map((interest) => (
                    <Label
                      key={interest}
                      htmlFor={`interest-${interest}`}
                      className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-border px-3 py-2.5 text-sm font-medium text-foreground transition-colors has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-accent/10"
                    >
                      <Checkbox
                        id={`interest-${interest}`}
                        checked={interests.includes(interest)}
                        onCheckedChange={() => toggleInterest(interest)}
                      />
                      {interest}
                    </Label>
                  ))}
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={!canSubmit}
                data-ocid="planner.submit_button"
                className="w-full"
              >
                <Sparkles className="size-4" />
                Generate itinerary
              </Button>
              {!canSubmit && (
                <p className="text-center text-xs text-muted-foreground">
                  Select a destination and valid dates to generate.
                </p>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Itinerary */}
        <div className="min-w-0">
          {itinerary ? (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-subtle sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-subtle">
                    <MapPin className="size-6" />
                  </div>
                  <div>
                    <h2 className="font-display text-2xl font-bold text-foreground">
                      {itinerary.destination}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {itinerary.country} · {itinerary.startLabel} –{" "}
                      {itinerary.endLabel}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Badge variant="secondary">{itinerary.budgetLabel}</Badge>
                      <Badge variant="secondary">{itinerary.styleLabel}</Badge>
                      <Badge variant="secondary">
                        {itinerary.days.length}{" "}
                        {itinerary.days.length === 1 ? "day" : "days"}
                      </Badge>
                    </div>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrint}
                  data-ocid="planner.print_button"
                  className="shrink-0"
                >
                  <Printer className="size-4" />
                  Print itinerary
                </Button>
              </div>

              <div className="flex flex-col gap-4">
                {itinerary.days.map((day) => (
                  <Card
                    key={day.day}
                    className="shadow-subtle"
                    data-ocid={`planner.day.${day.day}`}
                  >
                    <CardHeader className="border-b border-border pb-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <span className="flex size-9 items-center justify-center rounded-lg bg-accent/15 font-mono text-sm font-bold text-accent">
                            {day.day}
                          </span>
                          <div>
                            <CardTitle className="font-display text-base">
                              {day.theme}
                            </CardTitle>
                            <CardDescription className="flex items-center gap-1.5">
                              <CalendarDays className="size-3.5" />
                              {day.dateLabel}
                            </CardDescription>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4 pt-4">
                      <div>
                        <h4 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          <MapPin className="size-3.5 text-primary" />
                          Activities
                        </h4>
                        <ul className="flex flex-col gap-1.5">
                          {day.activities.map((activity, i) => (
                            <li
                              key={`${day.day}-activity-${i}`}
                              className="flex items-start gap-2 text-sm text-foreground"
                            >
                              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                              {activity}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="rounded-lg border border-border bg-muted/40 p-3">
                          <h4 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            <Utensils className="size-3.5 text-primary" />
                            Meals
                          </h4>
                          <ul className="flex flex-col gap-1.5 text-sm text-foreground">
                            <li className="flex gap-2">
                              <span className="w-16 shrink-0 text-muted-foreground">
                                Breakfast
                              </span>
                              {day.meals.breakfast}
                            </li>
                            <li className="flex gap-2">
                              <span className="w-16 shrink-0 text-muted-foreground">
                                Lunch
                              </span>
                              {day.meals.lunch}
                            </li>
                            <li className="flex gap-2">
                              <span className="w-16 shrink-0 text-muted-foreground">
                                Dinner
                              </span>
                              {day.meals.dinner}
                            </li>
                          </ul>
                        </div>

                        <div className="rounded-lg border border-border bg-muted/40 p-3">
                          <h4 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            <TrainFront className="size-3.5 text-primary" />
                            Transport
                          </h4>
                          <p className="flex items-start gap-2 text-sm text-foreground">
                            <Coffee className="mt-0.5 size-4 shrink-0 text-primary" />
                            {day.transport}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <p className="text-center text-xs text-muted-foreground">
                Demo itinerary generated from your inputs. Connect the OpenAI
                API for personalized recommendations.
              </p>
            </div>
          ) : (
            <div className="flex h-full min-h-[420px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/40 p-10 text-center">
              <div className="flex size-16 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                <Sparkles className="size-8" />
              </div>
              <h3 className="mt-5 font-display text-xl font-semibold text-foreground">
                Your itinerary will appear here
              </h3>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                Fill in your trip details and hit "Generate itinerary" to see a
                day-by-day plan with activities, meals, and transport.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
