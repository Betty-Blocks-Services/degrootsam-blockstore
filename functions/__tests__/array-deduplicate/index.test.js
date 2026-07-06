import { describe, it, expect } from "vitest";
import arrayDeduplicate from "../../functions/array-deduplicate/1.1/index.js";

describe("arrayDeduplicate", () => {
  // happy path — primitives
  it("removes duplicate numbers", async () => {
    const out = await arrayDeduplicate({ array: [1, 2, 2, 3, 1, 4] });
    expect(out).toEqual({
      resultSchema: [1, 2, 3, 4],
      resultModel: [1, 2, 3, 4],
    });
  });

  it("removes duplicate strings", async () => {
    const out = await arrayDeduplicate({
      array: ["a", "b", "a", "c", "b"],
    });
    expect(out).toEqual({
      resultSchema: ["a", "b", "c"],
      resultModel: ["a", "b", "c"],
    });
  });

  // deduplication by path
  it("deduplicates objects by a top-level path", async () => {
    const array = [
      { id: 1, name: "Alice" },
      { id: 2, name: "Bob" },
      { id: 1, name: "Alice Duplicate" },
    ];
    const out = await arrayDeduplicate({ array, path: "id" });
    expect(out).toEqual({
      resultSchema: [
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" },
      ],
      resultModel: [
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" },
      ],
    });
  });

  it("deduplicates objects by a nested dot-separated path", async () => {
    const array = [
      { user: { id: 1 } },
      { user: { id: 2 } },
      { user: { id: 1 } },
    ];
    const out = await arrayDeduplicate({ array, path: "user.id" });
    expect(out).toEqual({
      resultSchema: [{ user: { id: 1 } }, { user: { id: 2 } }],
      resultModel: [{ user: { id: 1 } }, { user: { id: 2 } }],
    });
  });

  // required 'array' errors
  it("throws when 'array' is missing", async () => {
    await expect(arrayDeduplicate({})).rejects.toThrow(
      "Array Deduplicate: 'array' is required!",
    );
  });

  it("throws when 'array' is undefined", async () => {
    await expect(arrayDeduplicate({ array: undefined })).rejects.toThrow(
      "Array Deduplicate: 'array' is required!",
    );
  });

  it("throws when 'array' is null", async () => {
    await expect(arrayDeduplicate({ array: null })).rejects.toThrow(
      "Array Deduplicate: 'array' is required!",
    );
  });

  it("throws when 'array' is not an array or valid collection", async () => {
    await expect(
      arrayDeduplicate({ array: "not-an-array" }),
    ).rejects.toThrow("Array Deduplicate: 'array' is required!");
  });

  it("throws when 'array' is an object without a data array", async () => {
    await expect(
      arrayDeduplicate({ array: { foo: "bar" } }),
    ).rejects.toThrow("Array Deduplicate: 'array' is required!");
  });

  // normalizeArray edge cases
  it("accepts array as a plain array", async () => {
    const out = await arrayDeduplicate({ array: [1, 1, 2] });
    expect(out).toEqual({ resultSchema: [1, 2], resultModel: [1, 2] });
  });

  it("accepts array as a { data: [...] } collection shape", async () => {
    const out = await arrayDeduplicate({ array: { data: [1, 1, 2] } });
    expect(out).toEqual({ resultSchema: [1, 2], resultModel: [1, 2] });
  });

  // other edge cases
  it("returns an empty array when given an empty array", async () => {
    const out = await arrayDeduplicate({ array: [] });
    expect(out).toEqual({ resultSchema: [], resultModel: [] });
  });

  it("returns the same array when there are no duplicates", async () => {
    const out = await arrayDeduplicate({ array: [1, 2, 3] });
    expect(out).toEqual({
      resultSchema: [1, 2, 3],
      resultModel: [1, 2, 3],
    });
  });

  it("returns a single item when all items are duplicates", async () => {
    const out = await arrayDeduplicate({ array: [5, 5, 5, 5] });
    expect(out).toEqual({ resultSchema: [5], resultModel: [5] });
  });
});
