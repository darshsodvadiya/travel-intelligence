import { DestinationCard } from "@/components/DestinationCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useListDestinations } from "@/hooks/useQueries";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  Compass,
  Map as MapIcon,
  Search,
  Sparkles,
} from "lucide-react";
import { motion } from "motion/react";
import { type FormEvent, useState } from "react";

const FEATURED_IDS = [5, 3, 4, 2, 7, 6];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] as const },
  },
};

const stagger = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12 },
  },
};

export function HomePage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const { data: destinations, isLoading } = useListDestinations();

  const featured = (destinations ?? []).filter((d) =>
    FEATURED_IDS.includes(Number(d.id)),
  );

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    navigate({ to: "/explore", search: { q: query, category: "" } });
  }

  return (
    <div className="bg-background">
      {/* Hero */}
      <section
        data-ocid="hero_section"
        className="relative flex min-h-[calc(100vh-4rem)] items-center overflow-hidden"
      >
        <div className="absolute inset-0">
          <img
            src="/assets/generated/hero-fjord.dim_1920x1080.jpg"
            alt="A breathtaking aerial view of a small village with red houses surrounded by steep, snow-capped mountains and turquoise fjord waters under a golden sunrise sky"
            className="size-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/40 to-background" />
        </div>

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="relative mx-auto w-full max-w-4xl px-4 py-24 text-center sm:px-6"
        >
          <motion.p
            variants={fadeUp}
            className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-md"
          >
            <Compass className="size-4" />
            Smarter travel, fewer crowds
          </motion.p>

          <motion.h1
            variants={fadeUp}
            className="font-display text-4xl font-bold leading-tight tracking-tight text-white drop-shadow-md sm:text-5xl md:text-6xl"
          >
            From Crowded Hotspots to{" "}
            <span className="text-gradient-primary">Smarter Destinations.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mx-auto mt-6 max-w-2xl text-lg text-white/85"
          >
            Discover destinations with live crowd levels, travel intelligence
            scores, and weather — so you can travel smarter, not harder.
          </motion.p>

          <motion.form
            variants={fadeUp}
            onSubmit={handleSearch}
            className="mx-auto mt-10 flex max-w-xl items-center gap-2 rounded-full border border-white/30 bg-white/95 p-2 shadow-elevated backdrop-blur-md"
          >
            <Search className="ml-3 size-5 shrink-0 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Where do you want to go?"
              aria-label="Search destinations"
              data-ocid="hero.search_input"
              className="h-11 flex-1 border-0 bg-transparent text-base shadow-none focus-visible:ring-0"
            />
            <Button
              type="submit"
              size="lg"
              data-ocid="hero.search_button"
              className="h-11 shrink-0 rounded-full px-6"
            >
              Search
            </Button>
          </motion.form>

          <motion.div
            variants={fadeUp}
            className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Button
              asChild
              type="button"
              size="lg"
              data-ocid="hero.explore_button"
              className="w-full rounded-full sm:w-auto"
            >
              <Link to="/explore" search={{ q: "", category: "" }}>
                Explore Destinations
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              asChild
              type="button"
              variant="secondary"
              size="lg"
              data-ocid="hero.plan_button"
              className="w-full rounded-full bg-white/15 text-white backdrop-blur-md hover:bg-white/25 sm:w-auto"
            >
              <Link to="/plan">
                <Sparkles className="size-4" />
                Plan with AI
              </Link>
            </Button>
            <Button
              asChild
              type="button"
              variant="secondary"
              size="lg"
              data-ocid="hero.map_button"
              className="w-full rounded-full bg-white/15 text-white backdrop-blur-md hover:bg-white/25 sm:w-auto"
            >
              <Link to="/map">
                <MapIcon className="size-4" />
                Live Crowd Map
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Featured destinations */}
      <section
        data-ocid="featured_section"
        className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8"
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end"
        >
          <div>
            <p className="font-mono text-sm font-medium uppercase tracking-wider text-primary">
              Featured destinations
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Travel smarter, not harder
            </h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Hand-picked places where the experience outshines the crowds —
              each scored on weather, crowd levels, cost, and things to do.
            </p>
          </div>
          <span
            data-ocid="demo_data_badge"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
          >
            Demo data
          </span>
        </motion.div>

        {isLoading ? (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }, (_, i) => `skeleton-${i}`).map((id) => (
              <div
                key={id}
                className="animate-pulse overflow-hidden rounded-2xl border border-border bg-card"
              >
                <div className="aspect-[4/3] bg-muted" />
                <div className="space-y-2 p-4">
                  <div className="h-4 w-1/2 rounded bg-muted" />
                  <div className="h-3 w-1/3 rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {featured.map((destination) => (
              <motion.div key={destination.id.toString()} variants={fadeUp}>
                <DestinationCard destination={destination} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      {/* Closing CTA */}
      <section
        data-ocid="cta_section"
        className="mx-auto w-full max-w-7xl px-4 pb-24 sm:px-6 lg:px-8"
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="relative overflow-hidden rounded-3xl bg-gradient-primary px-6 py-16 text-center shadow-elevated sm:px-12"
        >
          <div className="relative z-10 mx-auto max-w-2xl">
            <h2 className="font-display text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
              Not sure where to go next?
            </h2>
            <p className="mt-4 text-primary-foreground/85">
              Let our AI trip planner craft a smarter itinerary around your
              dates, budget, and crowd preferences.
            </p>
            <Button
              asChild
              type="button"
              size="lg"
              data-ocid="cta.plan_button"
              className="mt-8 rounded-full bg-primary-foreground text-primary hover:bg-primary-foreground/90"
            >
              <Link to="/plan">
                <Sparkles className="size-4" />
                Plan with AI
              </Link>
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
