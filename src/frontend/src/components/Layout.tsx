import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Link, Outlet } from "@tanstack/react-router";
import {
  CloudSun,
  Compass,
  Map as MapIcon,
  Menu,
  Sparkles,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { label: "Explore", to: "/explore", icon: Compass },
  { label: "Live Map", to: "/map", icon: MapIcon },
  { label: "Plan with AI", to: "/plan", icon: Sparkles },
  { label: "Weather", to: "/weather", icon: CloudSun },
] as const;

export function Layout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-card/80 shadow-subtle backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            data-ocid="brand_link"
            className="flex items-center gap-2.5 font-display text-lg font-bold tracking-tight text-foreground"
          >
            <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-subtle">
              <Compass className="size-5" />
            </span>
            Travel Intelligence
          </Link>

          <nav
            className="hidden items-center gap-1 md:flex"
            aria-label="Primary"
          >
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                data-ocid="nav_link"
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                activeProps={{
                  className:
                    "bg-accent text-accent-foreground hover:bg-accent hover:text-accent-foreground",
                }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Open menu"
                data-ocid="mobile_menu_button"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle className="font-display">
                  Travel Intelligence
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4" aria-label="Mobile">
                {navItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    data-ocid="mobile_nav_link"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                    activeProps={{
                      className:
                        "bg-accent text-accent-foreground hover:bg-accent hover:text-accent-foreground",
                    }}
                  >
                    <item.icon className="size-4" />
                    {item.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-border bg-muted/40">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Compass className="size-4 text-primary" />
            <span className="font-display font-semibold text-foreground">
              Travel Intelligence
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()}. Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                window.location.hostname,
              )}`}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              caffeine.ai
            </a>
            .
          </p>
        </div>
      </footer>
    </div>
  );
}
