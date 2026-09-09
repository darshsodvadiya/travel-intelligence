import { PocketIc } from "@dfinity/pic";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { idlFactory } from "../../src/frontend/src/declarations/backend.did.js";
import type { _SERVICE } from "../../src/frontend/src/declarations/backend.did";

const PIC_URL = process.env.POCKET_IC_URL ?? "";
const BACKEND_WASM = process.env.BACKEND_WASM ?? "";

let pic: PocketIc | undefined;
let actor: _SERVICE;

beforeAll(async () => {
  pic = await PocketIc.create(PIC_URL);
  ({ actor } = await pic.setupCanister<_SERVICE>({ idlFactory, wasm: BACKEND_WASM }));
});

afterAll(async () => {
  await pic?.tearDown();
});

describe("Travel Intelligence backend public API", () => {
  it("lists the full destination catalog without trapping", async () => {
    const destinations = await actor.listDestinations();
    expect(destinations.length).toBeGreaterThan(0);
    expect(destinations[0]).toMatchObject({
      name: "Paris",
      country: "France",
    });
  });

  it("returns a single destination by id", async () => {
    const result = await actor.getDestination(1n);
    expect(result).toHaveLength(1);
    const [paris] = result;
    expect(paris.name).toBe("Paris");
    expect(paris.score).toBe(88n);
    expect(paris.crowdLevel).toEqual({ high: null });
    expect(paris.category).toEqual({ city: null });
  });

  it("returns null for an unknown destination id", async () => {
    const result = await actor.getDestination(999n);
    expect(result).toEqual([]);
  });

  it("searches destinations by term and category", async () => {
    const byTerm = await actor.searchDestinations("paris", []);
    expect(byTerm.map((d) => d.name)).toContain("Paris");

    const beaches = await actor.searchDestinations("", [{ beach: null }]);
    expect(beaches.length).toBeGreaterThan(0);
    expect(beaches.every((d) => d.category.beach !== undefined)).toBe(true);
  });

  it("returns the API documentation", async () => {
    const doc = await actor.getApiDoc();
    expect(doc).toContain("Travel Intelligence");
    expect(doc).toContain("listDestinations");
    expect(doc).toContain("getDestination");
    expect(doc).toContain("searchDestinations");
  });
});
