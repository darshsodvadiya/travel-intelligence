import { createActor } from "@/backend";
import type { Category } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";

/**
 * Fetch the full destination catalog.
 */
export function useListDestinations() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["destinations"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listDestinations();
    },
    enabled: !!actor && !isFetching,
  });
}

/**
 * Fetch a single destination by id.
 */
export function useDestination(id: bigint | undefined) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["destination", id],
    queryFn: async () => {
      if (!actor || id === undefined) return null;
      return actor.getDestination(id);
    },
    enabled: !!actor && !isFetching && id !== undefined,
  });
}

/**
 * Search destinations by term and optional category filter.
 */
export function useSearchDestinations(
  searchTerm: string,
  category: Category | null,
) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["destinations", "search", searchTerm, category],
    queryFn: async () => {
      if (!actor) return [];
      return actor.searchDestinations(searchTerm, category);
    },
    enabled: !!actor && !isFetching,
  });
}

/**
 * Fetch the backend API documentation / schema.
 */
export function useApiDoc() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["apiDoc"],
    queryFn: async () => {
      if (!actor) return "";
      return actor.schema();
    },
    enabled: !!actor && !isFetching,
  });
}
