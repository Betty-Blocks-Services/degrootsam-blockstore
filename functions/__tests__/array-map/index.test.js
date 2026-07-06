import { describe, it, expect } from "vitest";
import mapArray from "../../functions/array-map/1.2/index.js";

const shapes = [
  ["array", (arr) => arr],
  ["collection", (arr) => ({ data: arr })],
];

describe("mapArray", () => {
  it.each(shapes)("maps array with simple path (%s input)", async (_label, wrap) => {
    const array = wrap([
      { name: "Alice", age: 25 },
      { name: "Bob", age: 30 },
      { name: "Charlie", age: 35 },
    ]);

    const out = await mapArray({
      array,
      path: "name",
    });

    expect(out).toEqual({ resultSchema: ["Alice", "Bob", "Charlie"], resultModel: ["Alice", "Bob", "Charlie"] });
  });

  it.each(shapes)("maps array with nested path (%s input)", async (_label, wrap) => {
    const array = wrap([
      { user: { name: "Alice", age: 25 } },
      { user: { name: "Bob", age: 30 } },
      { user: { name: "Charlie", age: 35 } },
    ]);

    const out = await mapArray({
      array,
      path: "user.name",
    });

    expect(out).toEqual({ resultSchema: ["Alice", "Bob", "Charlie"], resultModel: ["Alice", "Bob", "Charlie"] });
  });

  it.each(shapes)("maps array with numeric values (%s input)", async (_label, wrap) => {
    const array = wrap([
      { name: "Alice", age: 25 },
      { name: "Bob", age: 30 },
      { name: "Charlie", age: 35 },
    ]);

    const out = await mapArray({
      array,
      path: "age",
    });

    expect(out).toEqual({ resultSchema: [25, 30, 35], resultModel: [25, 30, 35] });
  });

  it.each(shapes)("maps array with boolean values (%s input)", async (_label, wrap) => {
    const array = wrap([
      { name: "Alice", active: true },
      { name: "Bob", active: false },
      { name: "Charlie", active: true },
    ]);

    const out = await mapArray({
      array,
      path: "active",
    });

    expect(out).toEqual({ resultSchema: [true, false, true], resultModel: [true, false, true] });
  });

  it.each(shapes)("maps array with mixed value types (%s input)", async (_label, wrap) => {
    const array = wrap([
      { name: "Alice", score: 95, passed: true },
      { name: "Bob", score: 87, passed: true },
      { name: "Charlie", score: 72, passed: false },
    ]);

    const out = await mapArray({
      array,
      path: "score",
    });

    expect(out).toEqual({ resultSchema: [95, 87, 72], resultModel: [95, 87, 72] });
  });

  it.each(shapes)("maps array with deeply nested path (%s input)", async (_label, wrap) => {
    const array = wrap([
      { user: { profile: { settings: { theme: "dark" } } } },
      { user: { profile: { settings: { theme: "light" } } } },
      { user: { profile: { settings: { theme: "dark" } } } },
    ]);

    const out = await mapArray({
      array,
      path: "user.profile.settings.theme",
    });

    expect(out).toEqual({ resultSchema: ["dark", "light", "dark"], resultModel: ["dark", "light", "dark"] });
  });

  it.each(shapes)("maps array with null values (%s input)", async (_label, wrap) => {
    const array = wrap([
      { name: "Alice", age: 25 },
      { name: "Bob", age: null },
      { name: "Charlie", age: 35 },
    ]);

    const out = await mapArray({
      array,
      path: "age",
    });

    expect(out).toEqual({ resultSchema: [25, null, 35], resultModel: [25, null, 35] });
  });

  it.each(shapes)("maps array with undefined values (%s input)", async (_label, wrap) => {
    const array = wrap([
      { name: "Alice", age: 25 },
      { name: "Bob", age: undefined },
      { name: "Charlie", age: 35 },
    ]);

    const out = await mapArray({
      array,
      path: "age",
    });

    expect(out).toEqual({ resultSchema: [25, undefined, 35], resultModel: [25, undefined, 35] });
  });

  it.each(shapes)("maps empty array (%s input)", async (_label, wrap) => {
    const array = wrap([]);

    const out = await mapArray({
      array,
      path: "name",
    });

    expect(out).toEqual({ resultSchema: [], resultModel: [] });
  });

  it.each(shapes)("maps single element array (%s input)", async (_label, wrap) => {
    const array = wrap([{ name: "Alice", age: 25 }]);

    const out = await mapArray({
      array,
      path: "name",
    });

    expect(out).toEqual({ resultSchema: ["Alice"], resultModel: ["Alice"] });
  });

  it.each(shapes)("handles path that doesn't exist on some objects (%s input)", async (_label, wrap) => {
    const array = wrap([
      { name: "Alice", age: 25 },
      { name: "Bob" },
      { name: "Charlie", age: 35 },
    ]);

    const out = await mapArray({
      array,
      path: "age",
    });

    expect(out).toEqual({ resultSchema: [25, undefined, 35], resultModel: [25, undefined, 35] });
  });

  it.each(shapes)("handles path that returns undefined (%s input)", async (_label, wrap) => {
    const array = wrap([
      { name: "Alice", age: 25 },
      { name: "Bob", age: 30 },
      { name: "Charlie", age: 35 },
    ]);

    const out = await mapArray({
      array,
      path: "nonexistent",
    });

    expect(out).toEqual({ resultSchema: [undefined, undefined, undefined], resultModel: [undefined, undefined, undefined] });
  });

  it.each(shapes)("wraps extracted value in targetPath key (%s input)", async (_label, wrap) => {
    const array = wrap([
      { name: "Alice", age: 25 },
      { name: "Bob", age: 30 },
    ]);

    const out = await mapArray({ array, path: "name", targetPath: "label" });

    expect(out).toEqual({
      resultSchema: [{ label: "Alice" }, { label: "Bob" }],
      resultModel: [{ label: "Alice" }, { label: "Bob" }],
    });
  });

  it.each(shapes)("wraps extracted value in nested targetPath (%s input)", async (_label, wrap) => {
    const array = wrap([
      { name: "Alice" },
      { name: "Bob" },
    ]);

    const out = await mapArray({ array, path: "name", targetPath: "user.label" });

    expect(out).toEqual({
      resultSchema: [{ user: { label: "Alice" } }, { user: { label: "Bob" } }],
      resultModel: [{ user: { label: "Alice" } }, { user: { label: "Bob" } }],
    });
  });

  it.each(shapes)("wraps nested path extraction in targetPath (%s input)", async (_label, wrap) => {
    const array = wrap([
      { user: { name: "Alice" } },
      { user: { name: "Bob" } },
    ]);

    const out = await mapArray({ array, path: "user.name", targetPath: "display.title" });

    expect(out).toEqual({
      resultSchema: [{ display: { title: "Alice" } }, { display: { title: "Bob" } }],
      resultModel: [{ display: { title: "Alice" } }, { display: { title: "Bob" } }],
    });
  });

  describe("required option validation", () => {
    it("throws when 'array' is missing", async () => {
      await expect(mapArray({ path: "name" })).rejects.toThrow(
        "Array Map: 'array' is required!",
      );
    });

    it("throws when 'array' is undefined", async () => {
      await expect(
        mapArray({ array: undefined, path: "name" }),
      ).rejects.toThrow("Array Map: 'array' is required!");
    });

    it("throws when 'path' is missing", async () => {
      const array = { data: [{ name: "Alice" }] };
      await expect(mapArray({ array })).rejects.toThrow(
        "Array Map: 'path' is required!",
      );
    });

    it("throws when 'path' is undefined", async () => {
      const array = { data: [{ name: "Alice" }] };
      await expect(
        mapArray({ array, path: undefined }),
      ).rejects.toThrow("Array Map: 'path' is required!");
    });
  });

  describe("normalizeArray edge cases", () => {
    it("throws the 'array' required error when array is null", async () => {
      await expect(mapArray({ array: null, path: "name" })).rejects.toThrow(
        "Array Map: 'array' is required!",
      );
    });

    it("throws the 'array' required error when array is an invalid shape (no data array)", async () => {
      await expect(
        mapArray({ array: { foo: "bar" }, path: "name" }),
      ).rejects.toThrow("Array Map: 'array' is required!");
    });

    it("throws the 'array' required error when array's data property is not an array", async () => {
      await expect(
        mapArray({ array: { data: "not-an-array" }, path: "name" }),
      ).rejects.toThrow("Array Map: 'array' is required!");
    });
  });

  describe("other edge cases", () => {
    it.each(shapes)("maps over an array of primitives using a non-dot path key (%s input)", async (_label, wrap) => {
      const array = wrap(["Alice", "Bob", "Charlie"]);

      const out = await mapArray({ array, path: "length" });

      expect(out).toEqual({
        resultSchema: [5, 3, 7],
        resultModel: [5, 3, 7],
      });
    });

    it("throws when a nested path is used but an item is a primitive, not an object", async () => {
      const array = { data: ["Alice", "Bob"] };

      await expect(
        mapArray({ array, path: "user.name" }),
      ).rejects.toThrow(
        "Array item is not an object. Cannot travel path",
      );
    });
  });
});
