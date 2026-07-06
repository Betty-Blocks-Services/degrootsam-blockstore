import { describe, it, expect } from "vitest";
import arrayFilterBy from "../../functions/array-filter-by/1.1/index.js";

describe("arrayFilterBy", () => {
  const shapes = [
    ["array", (arr) => arr],
    ["collection", (arr) => ({ data: arr })],
  ];

  // include mode — primitives
  it.each(shapes)(
    "include: keeps items present in filterArray (%s input)",
    async (_label, wrap) => {
      const out = await arrayFilterBy({
        array: wrap([1, 2, 3, 4, 5]),
        filterArray: wrap([2, 4]),
        mode: "include",
      });
      expect(out).toEqual({ resultSchema: [2, 4], resultModel: [2, 4] });
    },
  );

  it.each(shapes)(
    "include: returns empty array when no matches (%s input)",
    async (_label, wrap) => {
      const out = await arrayFilterBy({
        array: wrap([1, 2, 3]),
        filterArray: wrap([9, 10]),
        mode: "include",
      });
      expect(out).toEqual({ resultSchema: [], resultModel: [] });
    },
  );

  // exclude mode — primitives
  it.each(shapes)(
    "exclude: removes items present in filterArray (%s input)",
    async (_label, wrap) => {
      const out = await arrayFilterBy({
        array: wrap([1, 2, 3, 4, 5]),
        filterArray: wrap([2, 4]),
        mode: "exclude",
      });
      expect(out).toEqual({ resultSchema: [1, 3, 5], resultModel: [1, 3, 5] });
    },
  );

  it.each(shapes)(
    "exclude: returns full array when no matches (%s input)",
    async (_label, wrap) => {
      const out = await arrayFilterBy({
        array: wrap([1, 2, 3]),
        filterArray: wrap([9, 10]),
        mode: "exclude",
      });
      expect(out).toEqual({ resultSchema: [1, 2, 3], resultModel: [1, 2, 3] });
    },
  );

  // include mode — objects with path
  it.each(shapes)(
    "include: filters objects using path (%s input)",
    async (_label, wrap) => {
      const array = [
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" },
        { id: 3, name: "Charlie" },
      ];
      const out = await arrayFilterBy({
        array: wrap(array),
        filterArray: wrap([1, 3]),
        path: "id",
        mode: "include",
      });
      expect(out).toEqual({
        resultSchema: [
          { id: 1, name: "Alice" },
          { id: 3, name: "Charlie" },
        ],
        resultModel: [
          { id: 1, name: "Alice" },
          { id: 3, name: "Charlie" },
        ],
      });
    },
  );

  // filterArray objects with filterPath
  it.each(shapes)(
    "include: filters using path and filterPath (%s input)",
    async (_label, wrap) => {
      const array = [
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" },
        { id: 3, name: "Charlie" },
      ];
      const filterArray = [{ userId: 1 }, { userId: 3 }];
      const out = await arrayFilterBy({
        array: wrap(array),
        filterArray: wrap(filterArray),
        path: "id",
        filterPath: "userId",
        mode: "include",
      });
      expect(out).toEqual({
        resultSchema: [
          { id: 1, name: "Alice" },
          { id: 3, name: "Charlie" },
        ],
        resultModel: [
          { id: 1, name: "Alice" },
          { id: 3, name: "Charlie" },
        ],
      });
    },
  );

  // nested path
  it.each(shapes)(
    "include: supports nested dot-separated path (%s input)",
    async (_label, wrap) => {
      const array = [
        { user: { id: 1 } },
        { user: { id: 2 } },
        { user: { id: 3 } },
      ];
      const out = await arrayFilterBy({
        array: wrap(array),
        filterArray: wrap([1, 3]),
        path: "user.id",
        mode: "include",
      });
      expect(out).toEqual({
        resultSchema: [{ user: { id: 1 } }, { user: { id: 3 } }],
        resultModel: [{ user: { id: 1 } }, { user: { id: 3 } }],
      });
    },
  );

  it("throws when array is missing", async () => {
    await expect(
      arrayFilterBy({ filterArray: [1], mode: "include" }),
    ).rejects.toThrow("Array Filter By: 'array' is required!");
  });

  it("throws when filterArray is missing", async () => {
    await expect(
      arrayFilterBy({ array: [1], mode: "include" }),
    ).rejects.toThrow("Array Filter By: 'filterArray' is required!");
  });

  it("throws when mode is missing", async () => {
    await expect(
      arrayFilterBy({ array: [1], filterArray: [1] }),
    ).rejects.toThrow("Array Filter By: 'mode' is required!");
  });

  it("throws on invalid mode", async () => {
    await expect(
      arrayFilterBy({ array: [1], filterArray: [1], mode: "wrong" }),
    ).rejects.toThrow("Invalid mode");
  });

  // normalizeArray edge cases — array
  it("throws 'array' is required when array is null", async () => {
    await expect(
      arrayFilterBy({ array: null, filterArray: [1], mode: "include" }),
    ).rejects.toThrow("Array Filter By: 'array' is required!");
  });

  it("throws 'array' is required when array is undefined", async () => {
    await expect(
      arrayFilterBy({ array: undefined, filterArray: [1], mode: "include" }),
    ).rejects.toThrow("Array Filter By: 'array' is required!");
  });

  it("throws 'array' is required when array is a non-array, non-collection value", async () => {
    await expect(
      arrayFilterBy({ array: "not-an-array", filterArray: [1], mode: "include" }),
    ).rejects.toThrow("Array Filter By: 'array' is required!");
  });

  // mixed shapes — array as collection, filterArray as plain array
  it("include: accepts array as a { data: [...] } collection shape", async () => {
    const out = await arrayFilterBy({
      array: { data: [1, 2, 3] },
      filterArray: [2],
      mode: "include",
    });
    expect(out).toEqual({ resultSchema: [2], resultModel: [2] });
  });

  // normalizeArray edge cases — filterArray
  it("throws 'filterArray' is required when filterArray is null", async () => {
    await expect(
      arrayFilterBy({ array: [1], filterArray: null, mode: "include" }),
    ).rejects.toThrow("Array Filter By: 'filterArray' is required!");
  });

  it("throws 'filterArray' is required when filterArray is undefined", async () => {
    await expect(
      arrayFilterBy({ array: [1], filterArray: undefined, mode: "include" }),
    ).rejects.toThrow("Array Filter By: 'filterArray' is required!");
  });

  it("throws 'filterArray' is required when filterArray is a non-array, non-collection value", async () => {
    await expect(
      arrayFilterBy({ array: [1], filterArray: "nope", mode: "include" }),
    ).rejects.toThrow("Array Filter By: 'filterArray' is required!");
  });

  // mixed shapes — array as plain array, filterArray as collection
  it("include: accepts filterArray as a { data: [...] } collection shape", async () => {
    const out = await arrayFilterBy({
      array: [1, 2, 3],
      filterArray: { data: [1, 3] },
      mode: "include",
    });
    expect(out).toEqual({ resultSchema: [1, 3], resultModel: [1, 3] });
  });

  // mode values
  it.each(shapes)(
    "exclude: filters objects using path with exclude mode (%s input)",
    async (_label, wrap) => {
      const array = [
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" },
        { id: 3, name: "Charlie" },
      ];
      const out = await arrayFilterBy({
        array: wrap(array),
        filterArray: wrap([1, 3]),
        path: "id",
        mode: "exclude",
      });
      expect(out).toEqual({
        resultSchema: [{ id: 2, name: "Bob" }],
        resultModel: [{ id: 2, name: "Bob" }],
      });
    },
  );

  it.each(shapes)(
    "include: handles null items in array gracefully (%s input)",
    async (_label, wrap) => {
      const array = [{ id: 1 }, null, { id: 3 }];
      const out = await arrayFilterBy({
        array: wrap(array),
        filterArray: wrap([1, 3]),
        path: "id",
        mode: "include",
      });
      expect(out).toEqual({
        resultSchema: [{ id: 1 }, { id: 3 }],
        resultModel: [{ id: 1 }, { id: 3 }],
      });
    },
  );
});
