import App from "@/App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import type { ReactElement } from "react";

export function renderApp() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const utils = render(
    <QueryClientProvider client={queryClient}>
      {App() as ReactElement}
    </QueryClientProvider>,
  );
  return { ...utils, queryClient };
}

/**
 * Navigate the app's router to a path by pushing browser history and notifying
 * the router through a popstate event. The router is created inside App.tsx, so
 * this is the only way to drive it from a test without editing production code.
 */
export function navigateTo(path: string) {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
}
