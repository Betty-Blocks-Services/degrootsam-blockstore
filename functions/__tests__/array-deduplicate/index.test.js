import { describe, it, expect } from "vitest";
import arrayDeduplicate from "../../functions/array-deduplicate/1.1/index.js";

const shapes = [
  ["array", (arr) => arr],
  ["collection", (arr) => ({ data: arr })],
];

describe("arrayDeduplicate", () => {
  // happy path — primitives
  it.each(shapes)(
    "removes duplicate numbers (%s input)",
    async (_label, wrap) => {
      const out = await arrayDeduplicate({ array: wrap([1, 2, 2, 3, 1, 4]) });
      expect(out).toEqual({
        resultSchema: [1, 2, 3, 4],
        resultModel: [1, 2, 3, 4],
      });
    },
  );

  it.each(shapes)(
    "removes duplicate strings (%s input)",
    async (_label, wrap) => {
      const out = await arrayDeduplicate({
        array: wrap(["a", "b", "a", "c", "b"]),
      });
      expect(out).toEqual({
        resultSchema: ["a", "b", "c"],
        resultModel: ["a", "b", "c"],
      });
    },
  );

  // deduplication by path
  it.each(shapes)(
    "deduplicates objects by a top-level path (%s input)",
    async (_label, wrap) => {
      const array = [
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" },
        { id: 1, name: "Alice Duplicate" },
      ];
      const out = await arrayDeduplicate({ array: wrap(array), path: "id" });
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
    },
  );

  it.each(shapes)(
    "deduplicates objects by a nested dot-separated path (%s input)",
    async (_label, wrap) => {
      const array = [
        { user: { id: 1 } },
        { user: { id: 2 } },
        { user: { id: 1 } },
      ];
      const out = await arrayDeduplicate({
        array: wrap(array),
        path: "user.id",
      });
      expect(out).toEqual({
        resultSchema: [{ user: { id: 1 } }, { user: { id: 2 } }],
        resultModel: [{ user: { id: 1 } }, { user: { id: 2 } }],
      });
    },
  );

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
    await expect(arrayDeduplicate({ array: "not-an-array" })).rejects.toThrow(
      "Array Deduplicate: 'array' is required!",
    );
  });

  it("throws when 'array' is an object without a data array", async () => {
    await expect(arrayDeduplicate({ array: { foo: "bar" } })).rejects.toThrow(
      "Array Deduplicate: 'array' is required!",
    );
  });

  // other edge cases
  it.each(shapes)(
    "returns an empty array when given an empty array (%s input)",
    async (_label, wrap) => {
      const out = await arrayDeduplicate({ array: wrap([]) });
      expect(out).toEqual({ resultSchema: [], resultModel: [] });
    },
  );

  it.each(shapes)(
    "returns the same array when there are no duplicates (%s input)",
    async (_label, wrap) => {
      const out = await arrayDeduplicate({ array: wrap([1, 2, 3]) });
      expect(out).toEqual({
        resultSchema: [1, 2, 3],
        resultModel: [1, 2, 3],
      });
    },
  );

  it.each(shapes)(
    "returns a single item when all items are duplicates (%s input)",
    async (_label, wrap) => {
      const out = await arrayDeduplicate({ array: wrap([5, 5, 5, 5]) });
      expect(out).toEqual({ resultSchema: [5], resultModel: [5] });
    },
  );
});
