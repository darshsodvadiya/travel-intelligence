import { HomePage } from "@/pages/Home";
import { allDestinations } from "@/test/fixtures";
import { renderPage } from "@/test/render";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

const { navigateMock } = vi.hoisted(() => ({ navigateMock: vi.fn() }));

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
  useNavigate: () => navigateMock,
}));

describe("Home page hero", () => {
  it("renders the headline, search bar, and all three CTAs", () => {
    renderPage(<HomePage />);

    const hero = within(screen.getByTestId("hero_section"));

    expect(
      hero.getByRole("heading", {
        name: /From Crowded Hotspots to Smarter Destinations/i,
      }),
    ).toBeInTheDocument();

    expect(
      hero.getByPlaceholderText("Where do you want to go?"),
    ).toBeInTheDocument();

    expect(
      hero.getByRole("link", { name: /Explore Destinations/i }),
    ).toHaveAttribute("href", "/explore");
    expect(hero.getByRole("link", { name: /Plan with AI/i })).toHaveAttribute(
      "href",
      "/plan",
    );
    expect(hero.getByRole("link", { name: /Live Crowd Map/i })).toHaveAttribute(
      "href",
      "/map",
    );
  });

  it("labels the featured catalog as demo data", () => {
    renderPage(<HomePage />);
    expect(screen.getByText("Demo data")).toBeInTheDocument();
  });

  it("navigates to the explore page when searching for a destination", async () => {
    const user = userEvent.setup();
    renderPage(<HomePage />);

    const input = screen.getByPlaceholderText("Where do you want to go?");
    await user.type(input, "Paris");
    await user.click(screen.getByRole("button", { name: /Search/i }));

    expect(navigateMock).toHaveBeenCalledWith({
      to: "/explore",
      search: { q: "Paris", category: "" },
    });
  });

  it("renders the featured destinations from the catalog", () => {
    renderPage(<HomePage />);
    expect(screen.getByText("Travel smarter, not harder")).toBeInTheDocument();
    expect(screen.getByText("Santorini")).toBeInTheDocument();
    expect(screen.getAllByText("Iceland").length).toBeGreaterThan(0);
  });
});
