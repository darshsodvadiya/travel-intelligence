import { ExplorePage } from "@/pages/Explore";
import { allDestinations, paris } from "@/test/fixtures";
import { renderPage } from "@/test/render";
import { screen } from "@testing-library/react";
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
  useSearch: () => ({ q: "", category: undefined }),
}));

describe("Explore page catalog", () => {
  it("renders the heading and lists all destinations", () => {
    renderPage(<ExplorePage />);

    expect(
      screen.getByRole("heading", { name: /Explore Worldwide/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("Paris")).toBeInTheDocument();
    expect(screen.getByText("Santorini")).toBeInTheDocument();
    expect(screen.getByText("Banff")).toBeInTheDocument();
    expect(screen.getAllByText("Iceland").length).toBeGreaterThan(0);
    expect(screen.getByText("4 destinations")).toBeInTheDocument();
  });

  it("navigates with the search term when typing in the search box", async () => {
    const user = userEvent.setup();
    renderPage(<ExplorePage />);

    const input = screen.getByRole("searchbox", {
      name: /Search destinations/i,
    });
    await user.type(input, "Paris");

    expect(navigateMock).toHaveBeenCalledWith({
      to: "/explore",
      search: expect.any(Function),
    });
  });

  it("navigates with a category filter when a filter chip is clicked", async () => {
    const user = userEvent.setup();
    renderPage(<ExplorePage />);

    await user.click(screen.getByRole("button", { name: /^Beach$/ }));

    expect(navigateMock).toHaveBeenCalledWith({
      to: "/explore",
      search: expect.any(Function),
    });
  });

  it("labels the catalog as demo data", () => {
    renderPage(<ExplorePage />);
    expect(
      screen.getByText(/sample records until live APIs are connected/i),
    ).toBeInTheDocument();
  });
});
