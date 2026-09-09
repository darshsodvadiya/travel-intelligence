import { Layout } from "@/components/Layout";
import { AIPlannerPage } from "@/pages/AIPlanner";
import { DestinationDetailPage } from "@/pages/DestinationDetail";
import { ExplorePage } from "@/pages/Explore";
import { HomePage } from "@/pages/Home";
import { LiveMapPage } from "@/pages/LiveMap";
import { WeatherPage } from "@/pages/Weather";
import {
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";

const rootRoute = createRootRoute({
  component: Layout,
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const exploreRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/explore",
  validateSearch: (
    search: Record<string, unknown>,
  ): { q?: string; category?: string } => ({
    q: typeof search.q === "string" ? search.q : undefined,
    category: typeof search.category === "string" ? search.category : undefined,
  }),
  component: ExplorePage,
});

const destinationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/destination/$id",
  component: DestinationDetailPage,
});

const mapRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/map",
  component: LiveMapPage,
});

const planRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/plan",
  component: AIPlannerPage,
});

const weatherRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/weather",
  component: WeatherPage,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  exploreRoute,
  destinationRoute,
  mapRoute,
  planRoute,
  weatherRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
