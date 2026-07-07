import { describe, it, expect } from "vitest";
import arrayIsArray from "../../functions/array-is-array/1.0/index.js";

describe("arrayIsArray", () => {
  it("returns true for a plain array", async () => {
    const out = await arrayIsArray({ array: [1, 2, 3] });

    expect(out).toEqual({ result: true });
  });

  it("returns true for an empty array", async () => {
    const out = await arrayIsArray({ array: [] });

    expect(out).toEqual({ result: true });
  });

  it("returns true for a { data: [...] } collection shape", async () => {
    const out = await arrayIsArray({ array: { data: [1, 2, 3] } });

    expect(out).toEqual({ result: true });
  });

  it("returns true for a { data: [] } empty collection shape", async () => {
    const out = await arrayIsArray({ array: { data: [] } });

    expect(out).toEqual({ result: true });
  });

  it("returns false when array is a string", async () => {
    const out = await arrayIsArray({ array: "not-an-array" });

    expect(out).toEqual({ result: false });
  });

  it("returns false when array is a number", async () => {
    const out = await arrayIsArray({ array: 42 });

    expect(out).toEqual({ result: false });
  });

  it("returns false when array is a plain object without a data array", async () => {
    const out = await arrayIsArray({ array: { foo: "bar" } });

    expect(out).toEqual({ result: false });
  });

  it("returns false when array's data property is not an array", async () => {
    const out = await arrayIsArray({ array: { data: "not-an-array" } });

    expect(out).toEqual({ result: false });
  });

  it("returns false when array is null", async () => {
    const out = await arrayIsArray({ array: null });

    expect(out).toEqual({ result: false });
  });

  it("returns false when array is undefined", async () => {
    const out = await arrayIsArray({ array: undefined });

    expect(out).toEqual({ result: false });
  });

  it("returns false when array is missing entirely", async () => {
    const out = await arrayIsArray({});

    expect(out).toEqual({ result: false });
  });
});
