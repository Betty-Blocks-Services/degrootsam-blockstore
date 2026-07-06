import { describe, it, expect } from "vitest";
import arraySort from "../../functions/array-sort/1.1/index.js";

const shapes = [
  ["array", (arr) => arr],
  ["collection", (arr) => ({ data: arr })],
];

describe("arraySort", () => {
  // primitives — numbers
  it.each(shapes)("sorts numbers ascending by default (%s input)", async (_label, wrap) => {
    const out = await arraySort({ array: wrap([3, 1, 4, 1, 5, 9, 2]) });
    expect(out).toEqual({ resultModel: [1, 1, 2, 3, 4, 5, 9], resultSchema: [1, 1, 2, 3, 4, 5, 9] });
  });

  it.each(shapes)("sorts numbers ascending (explicit) (%s input)", async (_label, wrap) => {
    const out = await arraySort({ array: wrap([3, 1, 2]), direction: "asc" });
    expect(out).toEqual({ resultModel: [1, 2, 3], resultSchema: [1, 2, 3] });
  });

  it.each(shapes)("sorts numbers descending (%s input)", async (_label, wrap) => {
    const out = await arraySort({ array: wrap([3, 1, 2]), direction: "desc" });
    expect(out).toEqual({ resultModel: [3, 2, 1], resultSchema: [3, 2, 1] });
  });

  // primitives — strings
  it.each(shapes)("sorts strings ascending (%s input)", async (_label, wrap) => {
    const out = await arraySort({ array: wrap(["banana", "apple", "cherry"]), direction: "asc" });
    expect(out).toEqual({ resultModel: ["apple", "banana", "cherry"], resultSchema: ["apple", "banana", "cherry"] });
  });

  it.each(shapes)("sorts strings descending (%s input)", async (_label, wrap) => {
    const out = await arraySort({ array: wrap(["banana", "apple", "cherry"]), direction: "desc" });
    expect(out).toEqual({ resultModel: ["cherry", "banana", "apple"], resultSchema: ["cherry", "banana", "apple"] });
  });

  // objects with path
  it.each(shapes)("sorts objects by property path ascending (%s input)", async (_label, wrap) => {
    const array = [{ age: 30 }, { age: 20 }, { age: 25 }];
    const out = await arraySort({ array: wrap(array), path: "age", direction: "asc" });
    expect(out).toEqual({
      resultModel: [{ age: 20 }, { age: 25 }, { age: 30 }],
      resultSchema: [{ age: 20 }, { age: 25 }, { age: 30 }],
    });
  });

  it.each(shapes)("sorts objects by property path descending (%s input)", async (_label, wrap) => {
    const array = [{ age: 30 }, { age: 20 }, { age: 25 }];
    const out = await arraySort({ array: wrap(array), path: "age", direction: "desc" });
    expect(out).toEqual({
      resultModel: [{ age: 30 }, { age: 25 }, { age: 20 }],
      resultSchema: [{ age: 30 }, { age: 25 }, { age: 20 }],
    });
  });

  it.each(shapes)("sorts objects by string property path (%s input)", async (_label, wrap) => {
    const array = [{ name: "Charlie" }, { name: "Alice" }, { name: "Bob" }];
    const out = await arraySort({ array: wrap(array), path: "name", direction: "asc" });
    expect(out).toEqual({
      resultModel: [{ name: "Alice" }, { name: "Bob" }, { name: "Charlie" }],
      resultSchema: [{ name: "Alice" }, { name: "Bob" }, { name: "Charlie" }],
    });
  });

  // nested dot-separated path
  it.each(shapes)("sorts objects by nested path (%s input)", async (_label, wrap) => {
    const array = [
      { user: { score: 80 } },
      { user: { score: 60 } },
      { user: { score: 70 } },
    ];
    const out = await arraySort({ array: wrap(array), path: "user.score", direction: "asc" });
    expect(out).toEqual({
      resultModel: [{ user: { score: 60 } }, { user: { score: 70 } }, { user: { score: 80 } }],
      resultSchema: [{ user: { score: 60 } }, { user: { score: 70 } }, { user: { score: 80 } }],
    });
  });

  // date sorting
  it.each(shapes)("sorts date strings ascending when valueIsDate is true (%s input)", async (_label, wrap) => {
    const array = ["2023-06-15", "2021-01-01", "2022-12-31"];
    const out = await arraySort({ array: wrap(array), valueIsDate: true, direction: "asc" });
    expect(out).toEqual({
      resultModel: ["2021-01-01", "2022-12-31", "2023-06-15"],
      resultSchema: ["2021-01-01", "2022-12-31", "2023-06-15"],
    });
  });

  it.each(shapes)("sorts date strings descending when valueIsDate is true (%s input)", async (_label, wrap) => {
    const array = ["2023-06-15", "2021-01-01", "2022-12-31"];
    const out = await arraySort({ array: wrap(array), valueIsDate: true, direction: "desc" });
    expect(out).toEqual({
      resultModel: ["2023-06-15", "2022-12-31", "2021-01-01"],
      resultSchema: ["2023-06-15", "2022-12-31", "2021-01-01"],
    });
  });

  it.each(shapes)("sorts objects by date property path (%s input)", async (_label, wrap) => {
    const array = [
      { createdAt: "2023-06-15" },
      { createdAt: "2021-01-01" },
      { createdAt: "2022-12-31" },
    ];
    const out = await arraySort({ array: wrap(array), path: "createdAt", valueIsDate: true, direction: "asc" });
    expect(out).toEqual({
      resultModel: [
        { createdAt: "2021-01-01" },
        { createdAt: "2022-12-31" },
        { createdAt: "2023-06-15" },
      ],
      resultSchema: [
        { createdAt: "2021-01-01" },
        { createdAt: "2022-12-31" },
        { createdAt: "2023-06-15" },
      ],
    });
  });

  // edge cases
  it.each(shapes)("returns empty array for empty input (%s input)", async (_label, wrap) => {
    const out = await arraySort({ array: wrap([]) });
    expect(out).toEqual({ resultModel: [], resultSchema: [] });
  });

  it.each(shapes)("does not mutate the original array (%s input)", async (_label, wrap) => {
    const original = [3, 1, 2];
    await arraySort({ array: wrap(original), direction: "asc" });
    expect(original).toEqual([3, 1, 2]);
  });

  it.each(shapes)("returns single-element array unchanged (%s input)", async (_label, wrap) => {
    const out = await arraySort({ array: wrap([42]) });
    expect(out).toEqual({ resultModel: [42], resultSchema: [42] });
  });

  // error cases
  it("throws when array is missing", async () => {
    await expect(arraySort({})).rejects.toThrow("Array Sort: 'array' is required!");
  });

  it("throws when array is undefined", async () => {
    await expect(arraySort({ array: undefined })).rejects.toThrow("Array Sort: 'array' is required!");
  });

  it("throws when array is null", async () => {
    await expect(arraySort({ array: null })).rejects.toThrow("Array Sort: 'array' is required!");
  });

  it("throws when array is not an array or collection-like object", async () => {
    await expect(arraySort({ array: "not-an-array" })).rejects.toThrow("Array Sort: 'array' is required!");
  });

  it("throws when array is a plain object without a data property", async () => {
    await expect(arraySort({ array: { foo: "bar" } })).rejects.toThrow("Array Sort: 'array' is required!");
  });

  // normalizeArray edge cases
  it("throws when the data property is not an array", async () => {
    await expect(arraySort({ array: { data: "nope" } })).rejects.toThrow("Array Sort: 'array' is required!");
  });
});
