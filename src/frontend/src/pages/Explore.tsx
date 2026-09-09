import { DestinationCard } from "@/components/DestinationCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useListDestinations, useSearchDestinations } from "@/hooks/useQueries";
import { Category } from "@/types";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useMemo } from "react";

const CATEGORIES: Array<{ label: string; value: Category }> = [
  { label: "City", value: Category.city },
  { label: "Beach", value: Category.beach },
  { label: "Mountain", value: Category.mountain },
  { label: "Country", value: Category.country },
  { label: "Attraction", value: Category.attraction },
];

export function ExplorePage() {
  const navigate = useNavigate();
  const { q, category } = useSearch({ from: "/explore" });

  const searchTerm = q ?? "";
  const activeCategory = (category as Category | undefined) || null;

  const listQuery = useListDestinations();
  const searchQuery = useSearchDestinations(searchTerm, activeCategory);

  const isSearching = searchTerm.length > 0 || activeCategory !== null;
  const query = isSearching ? searchQuery : listQuery;
  const destinations = query.data ?? [];

  const setSearch = (nextQ: string) => {
    void navigate({
      to: "/explore",
      search: (prev) => ({ ...prev, q: nextQ }),
    });
  };

  const setCategory = (nextCategory: Category | null) => {
    void navigate({
      to: "/explore",
      search: (prev) => ({
        ...prev,
        category: nextCategory ?? undefined,
      }),
    });
  };

  const clearFilters = () => {
    void navigate({ to: "/explore", search: { q: "", category: undefined } });
  };

  const resultCount = useMemo(() => destinations.length, [destinations]);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Explore Worldwide
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Browse cities, countries, beaches, mountains, and attractions — each
          scored with travel intelligence so you can pick the right destination.
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-4">
        <div className="relative max-w-xl">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Where do you want to go?"
            data-ocid="explore.search_input"
            className="h-11 rounded-full pl-10 pr-10"
            aria-label="Search destinations"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearch("")}
              data-ocid="explore.clear_search_button"
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
            <SlidersHorizontal className="size-4" />
            Filter
          </span>
          <button
            type="button"
            onClick={() => setCategory(null)}
            data-ocid="explore.filter.all"
            className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
              activeCategory === null
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            }`}
          >
            All
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => setCategory(c.value)}
              data-ocid={`explore.filter.${c.value}`}
              className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                activeCategory === c.value
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <p
          className="text-sm text-muted-foreground"
          data-ocid="explore.result_count"
        >
          {query.isLoading
            ? "Loading destinations…"
            : `${resultCount} destination${resultCount === 1 ? "" : "s"}${
                isSearching ? " found" : ""
              }`}
        </p>
        {(searchTerm || activeCategory) && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            data-ocid="explore.clear_filters_button"
          >
            <X className="size-4" />
            Clear filters
          </Button>
        )}
      </div>

      {query.isLoading ? (
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => `skeleton-${i}`).map((id) => (
            <div
              key={id}
              className="overflow-hidden rounded-2xl border border-border bg-card shadow-subtle"
            >
              <Skeleton className="aspect-[4/3] w-full rounded-none" />
              <div className="space-y-2 p-4">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : query.isError ? (
        <div
          data-ocid="explore.error_state"
          className="mt-6 rounded-2xl border border-border bg-card p-10 text-center"
        >
          <p className="font-display text-lg font-semibold text-foreground">
            Couldn&apos;t load destinations
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Something went wrong while fetching the catalog. Please try again.
          </p>
        </div>
      ) : destinations.length === 0 ? (
        <div
          data-ocid="explore.empty_state"
          className="mt-6 rounded-2xl border border-dashed border-border bg-card/50 p-14 text-center"
        >
          <p className="font-display text-lg font-semibold text-foreground">
            No destinations found
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            We couldn&apos;t find any destinations matching your search. Try a
            different term or clear the filters.
          </p>
          <Button
            type="button"
            variant="outline"
            className="mt-6"
            onClick={clearFilters}
            data-ocid="explore.empty_reset_button"
          >
            Clear filters
          </Button>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.map((destination) => (
            <DestinationCard
              key={destination.id.toString()}
              destination={destination}
            />
          ))}
        </div>
      )}

      <p
        data-ocid="explore.demo_note"
        className="mt-10 rounded-xl border border-border bg-muted/40 px-4 py-3 text-xs text-muted-foreground"
      >
        Demo data — destination catalog and travel intelligence scores are
        sample records until live APIs are connected.
      </p>
    </section>
  );
}
