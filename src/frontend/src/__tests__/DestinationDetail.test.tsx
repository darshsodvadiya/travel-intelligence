import { DestinationDetailPage } from "@/pages/DestinationDetail";
import { allDestinations, paris } from "@/test/fixtures";
import { renderPage } from "@/test/render";
import { screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/hooks/useQueries", () => ({
  useListDestinations: () => ({
    data: allDestinations,
    isLoading: false,
    isError: false,
  }),
  useDestination: () => ({
    data: paris,
    isLoading: false,
    isError: false,
  }),
  useSearchDestinations: () => ({
    data: allDestinations,
    isLoading: false,
    isError: false,
  }),
  useApiDoc: () => ({ data: "", isLoading: false, isError: false }),
}));

vi.mock("@tanstack/react-router", () => ({
  Link: ({ to, children, ...rest }: any) => (
    <a href={to} {...rest}>
      {children}
    </a>
  ),
  useNavigate: () => vi.fn(),
  useSearch: () => ({}),
  useParams: () => ({ id: "1" }),
}));

const weatherResponse = {
  current: {
    temperature_2m: 18,
    apparent_temperature: 17,
    relative_humidity_2m: 60,
    wind_speed_10m: 12,
    weather_code: 0,
  },
  daily: {
    time: ["2026-09-09", "2026-09-10", "2026-09-11"],
    temperature_2m_max: [20, 21, 19],
    temperature_2m_min: [12, 13, 11],
    precipitation_probability_max: [10, 20, 30],
    weather_code: [0, 1, 2],
  },
};

describe("Destination detail page", () => {
  it("renders the destination name, country, and travel intelligence score", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => weatherResponse,
      }),
    );

    renderPage(<DestinationDetailPage />);

    expect(screen.getByRole("heading", { name: /Paris/i })).toBeInTheDocument();
    expect(screen.getByText("France")).toBeInTheDocument();
    expect(
      screen.getAllByText(/Travel Intelligence Score/i).length,
    ).toBeGreaterThan(0);

    vi.unstubAllGlobals();
  });

  it("shows the best time to visit months and reason", () => {
    renderPage(<DestinationDetailPage />);

    expect(screen.getByText("Best Time to Visit")).toBeInTheDocument();
    expect(screen.getByText("Apr")).toBeInTheDocument();
    expect(screen.getByText("May")).toBeInTheDocument();
    expect(
      screen.getByText(/Spring and early autumn bring mild weather/i),
    ).toBeInTheDocument();
  });

  it("shows the budget planner with an estimated total", () => {
    renderPage(<DestinationDetailPage />);

    expect(screen.getByText("Budget Planner")).toBeInTheDocument();
    expect(screen.getByText("$390")).toBeInTheDocument();
  });

  it("shows smart alternatives for a busy destination", () => {
    renderPage(<DestinationDetailPage />);

    expect(
      screen.getByRole("heading", { name: /Smart Alternatives/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("Santorini")).toBeInTheDocument();
    expect(screen.getByText("Banff")).toBeInTheDocument();
  });

  it("shows live weather conditions from the mocked API", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => weatherResponse,
      }),
    );

    renderPage(<DestinationDetailPage />);

    await waitFor(() => {
      expect(screen.getByText("18°")).toBeInTheDocument();
    });
    expect(screen.getByText("Clear sky")).toBeInTheDocument();

    vi.unstubAllGlobals();
  });
});
