import "@testing-library/jest-dom/vitest";
import { cleanup, configure } from "@testing-library/react";
import React from "react";
import { afterEach, vi } from "vitest";

// Generated components use `data-ocid` as their test id attribute.
configure({ testIdAttribute: "data-ocid" });

// Vitest runs without `globals: true`, so React Testing Library's automatic
// afterEach cleanup never registers. Clean up explicitly between tests.
afterEach(() => {
  cleanup();
});

// The generated backend wrapper (`@/backend`) re-exports `ExternalBlob` from
// `@caffeineai/object-storage`, whose dist entry fails to resolve `./blob`
// under Vitest. The app's pages only use the type, so a stub is enough.
vi.mock("@caffeineai/object-storage", () => ({
  ExternalBlob: class ExternalBlob {},
}));

// The `motion` animation library observes elements with IntersectionObserver,
// which jsdom does not implement. A no-op stub keeps the Home page's
// whileInView animations from throwing during render.
class IntersectionObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}
vi.stubGlobal("IntersectionObserver", IntersectionObserverStub);

// Radix UI's Select (used by the AI planner and Weather pages) relies on
// ResizeObserver and pointer-capture APIs that jsdom does not implement.
// Stub them so the components render and can be interacted with.
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
vi.stubGlobal("ResizeObserver", ResizeObserverStub);

if (typeof Element !== "undefined") {
  Element.prototype.hasPointerCapture = () => false;
  Element.prototype.setPointerCapture = () => {};
  Element.prototype.releasePointerCapture = () => {};
  Element.prototype.scrollIntoView = () => {};
}

// Radix UI's Select (used by the Weather and AI Planner pages) opens a portal
// and runs open/close animations that never settle under jsdom, so any test
// that opens the dropdown hangs until the 5s timeout. The tests exercise page
// behavior (fetching weather, generating an itinerary) rather than the Radix
// Select itself, so replace it with a native <select> that behaves reliably in
// jsdom. The mock preserves the trigger's `id` so label-based accessible-name
// queries keep working, and renders each SelectItem as an <option>.
vi.mock("@/components/ui/select", () => {
  interface SelectChildProps {
    id?: string;
    value?: unknown;
    children?: React.ReactNode;
  }
  type SelectChild = React.ReactElement<SelectChildProps>;

  function Select({ value, onValueChange, children }: any) {
    const items: { value: string; label: React.ReactNode }[] = [];
    let selectId: string | undefined;

    React.Children.forEach(children, (rawChild) => {
      if (!React.isValidElement<SelectChildProps>(rawChild)) return;
      const child = rawChild as SelectChild;
      if (typeof child.props.id === "string") {
        selectId = child.props.id;
      }
      React.Children.forEach(child.props.children, (rawItem) => {
        if (!React.isValidElement<SelectChildProps>(rawItem)) return;
        const item = rawItem as SelectChild;
        if (item.props.value != null) {
          items.push({
            value: String(item.props.value),
            label: item.props.children,
          });
        }
      });
    });

    return React.createElement(
      "select",
      {
        id: selectId,
        value,
        onChange: (e: React.ChangeEvent<HTMLSelectElement>) =>
          onValueChange(e.target.value),
      },
      items.map((it) =>
        React.createElement(
          "option",
          { key: it.value, value: it.value },
          it.label,
        ),
      ),
    );
  }

  function SelectTrigger({ children }: any) {
    return React.createElement(React.Fragment, null, children);
  }
  function SelectValue() {
    return null;
  }
  function SelectContent({ children }: any) {
    return React.createElement(React.Fragment, null, children);
  }
  function SelectItem({ value, children }: any) {
    return React.createElement("span", { "data-value": value }, children);
  }

  return {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
  };
});
