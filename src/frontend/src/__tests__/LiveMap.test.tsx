import { LiveMapPage } from "@/pages/LiveMap";
import { allDestinations } from "@/test/fixtures";
import { renderPage } from "@/test/render";
import { screen } from "@testing-library/react";
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

describe("Live map page", () => {
  it("renders the heading and the crowd legend", () => {
    renderPage(<LiveMapPage />);

    expect(
      screen.getByRole("heading", { name: /Crowd Levels, At a Glance/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("Legend")).toBeInTheDocument();
    expect(screen.getByText("Low")).toBeInTheDocument();
    expect(screen.getByText("Medium")).toBeInTheDocument();
    expect(screen.getByText("High")).toBeInTheDocument();
  });

  it("renders a marker for each destination with its crowd level", () => {
    renderPage(<LiveMapPage />);

    expect(
      screen.getByRole("link", {
        name: /Paris, France — crowd level High/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: /Banff, Canada — crowd level Medium/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: /Iceland, Iceland — crowd level Low/i,
      }),
    ).toBeInTheDocument();
  });

  it("reports the number of destinations mapped", () => {
    renderPage(<LiveMapPage />);
    expect(screen.getByText("4 destinations mapped")).toBeInTheDocument();
  });

  it("labels the crowd data as demo data", () => {
    renderPage(<LiveMapPage />);
    expect(
      screen.getByText(
        /Demo crowd data — live traffic APIs not connected yet/i,
      ),
    ).toBeInTheDocument();
  });
});
