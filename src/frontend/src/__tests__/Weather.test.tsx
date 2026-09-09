import { WeatherPage } from "@/pages/Weather";
import { allDestinations } from "@/test/fixtures";
import { renderPage } from "@/test/render";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/hooks/useQueries", () => ({
  useListDestinations: () => ({
    data: allDestinations,
    isLoading: false,
    isError: false,
    isPending: false,
  }),
  useDestination: () => ({ data: null, isLoading: false, isError: false }),
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
  useParams: () => ({}),
}));

const weatherResponse = {
  current: {
    temperature_2m: 22,
    relative_humidity_2m: 55,
    apparent_temperature: 21,
    precipitation: 0,
    weather_code: 0,
    wind_speed_10m: 10,
  },
  hourly: {
    time: ["2026-09-09T12:00", "2026-09-09T13:00"],
    temperature_2m: [22, 23],
    precipitation_probability: [10, 10],
    weather_code: [0, 0],
  },
  daily: {
    time: ["2026-09-09", "2026-09-10"],
    weather_code: [0, 1],
    temperature_2m_max: [24, 25],
    temperature_2m_min: [14, 15],
    precipitation_probability_max: [10, 20],
  },
};

describe("Weather page", () => {
  it("shows the empty state before a destination is selected", () => {
    renderPage(<WeatherPage />);

    expect(
      screen.getByRole("heading", { name: /Live Weather/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Select a destination to see its weather/i),
    ).toBeInTheDocument();
  });

  it("loads and displays weather after selecting a destination", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => weatherResponse,
      }),
    );

    const user = userEvent.setup();
    renderPage(<WeatherPage />);

    await user.selectOptions(
      screen.getByRole("combobox", { name: /Choose a destination/i }),
      "1",
    );

    await waitFor(() => {
      expect(screen.getByText("22°")).toBeInTheDocument();
    });
    expect(screen.getAllByText("Clear sky").length).toBeGreaterThan(0);
    expect(screen.getByText("55%")).toBeInTheDocument();
    expect(screen.getByText("km/h wind")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();

    vi.unstubAllGlobals();
  });

  it("shows an error state when the weather request fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({}),
      }),
    );

    const user = userEvent.setup();
    renderPage(<WeatherPage />);

    await user.selectOptions(
      screen.getByRole("combobox", { name: /Choose a destination/i }),
      "1",
    );

    await waitFor(() => {
      expect(
        screen.getByText(/Couldn't load live weather/i),
      ).toBeInTheDocument();
    });

    vi.unstubAllGlobals();
  });
});
