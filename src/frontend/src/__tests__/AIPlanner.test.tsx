import { AIPlannerPage } from "@/pages/AIPlanner";
import { allDestinations } from "@/test/fixtures";
import { renderPage } from "@/test/render";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/hooks/useQueries", () => ({
  useListDestinations: () => ({
    data: allDestinations,
    isLoading: false,
    isError: false,
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

describe("AI trip planner", () => {
  it("renders the form and the empty itinerary placeholder", () => {
    renderPage(<AIPlannerPage />);

    expect(
      screen.getByRole("heading", { name: /Plan with AI/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Your itinerary will appear here/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Generate itinerary/i }),
    ).toBeDisabled();
  });

  it("generates a demo itinerary after selecting a destination and dates", async () => {
    const user = userEvent.setup();
    renderPage(<AIPlannerPage />);

    // Choose Paris from the destination select.
    await user.selectOptions(
      screen.getByRole("combobox", { name: /Destination/i }),
      "1",
    );

    // Fill in dates.
    fireEvent.change(screen.getByLabelText(/Start date/i), {
      target: { value: "2026-09-10" },
    });
    fireEvent.change(screen.getByLabelText(/End date/i), {
      target: { value: "2026-09-12" },
    });

    await user.click(
      screen.getByRole("button", { name: /Generate itinerary/i }),
    );

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /Paris/i }),
      ).toBeInTheDocument();
    });
    expect(screen.getByText("3 days")).toBeInTheDocument();
    expect(
      screen.getByText(/Arrival & First Impressions/i),
    ).toBeInTheDocument();
  });

  it("labels the generator as demo data", () => {
    renderPage(<AIPlannerPage />);
    expect(screen.getByText("Demo generator")).toBeInTheDocument();
  });
});
