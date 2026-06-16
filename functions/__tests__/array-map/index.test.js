import { describe, it, expect } from "vitest";
import mapArray from "../../functions/array-map/1.1/index.js";

describe("mapArray", () => {
  it("maps array with simple path", async () => {
    const array = {
      data: [
        { name: "Alice", age: 25 },
        { name: "Bob", age: 30 },
        { name: "Charlie", age: 35 },
      ],
    };

    const out = await mapArray({
      array,
      path: "name",
    });

    expect(out).toEqual({ resultSchema: ["Alice", "Bob", "Charlie"], resultModel: ["Alice", "Bob", "Charlie"] });
  });

  it("maps array with nested path", async () => {
    const array = {
      data: [
        { user: { name: "Alice", age: 25 } },
        { user: { name: "Bob", age: 30 } },
        { user: { name: "Charlie", age: 35 } },
      ],
    };

    const out = await mapArray({
      array,
      path: "user.name",
    });

    expect(out).toEqual({ resultSchema: ["Alice", "Bob", "Charlie"], resultModel: ["Alice", "Bob", "Charlie"] });
  });

  it("maps array with numeric values", async () => {
    const array = {
      data: [
        { name: "Alice", age: 25 },
        { name: "Bob", age: 30 },
        { name: "Charlie", age: 35 },
      ],
    };

    const out = await mapArray({
      array,
      path: "age",
    });

    expect(out).toEqual({ resultSchema: [25, 30, 35], resultModel: [25, 30, 35] });
  });

  it("maps array with boolean values", async () => {
    const array = {
      data: [
        { name: "Alice", active: true },
        { name: "Bob", active: false },
        { name: "Charlie", active: true },
      ],
    };

    const out = await mapArray({
      array,
      path: "active",
    });

    expect(out).toEqual({ resultSchema: [true, false, true], resultModel: [true, false, true] });
  });

  it("maps array with mixed value types", async () => {
    const array = {
      data: [
        { name: "Alice", score: 95, passed: true },
        { name: "Bob", score: 87, passed: true },
        { name: "Charlie", score: 72, passed: false },
      ],
    };

    const out = await mapArray({
      array,
      path: "score",
    });

    expect(out).toEqual({ resultSchema: [95, 87, 72], resultModel: [95, 87, 72] });
  });

  it("maps array with deeply nested path", async () => {
    const array = {
      data: [
        { user: { profile: { settings: { theme: "dark" } } } },
        { user: { profile: { settings: { theme: "light" } } } },
        { user: { profile: { settings: { theme: "dark" } } } },
      ],
    };

    const out = await mapArray({
      array,
      path: "user.profile.settings.theme",
    });

    expect(out).toEqual({ resultSchema: ["dark", "light", "dark"], resultModel: ["dark", "light", "dark"] });
  });

  it("maps array with null values", async () => {
    const array = {
      data: [
        { name: "Alice", age: 25 },
        { name: "Bob", age: null },
        { name: "Charlie", age: 35 },
      ],
    };

    const out = await mapArray({
      array,
      path: "age",
    });

    expect(out).toEqual({ resultSchema: [25, null, 35], resultModel: [25, null, 35] });
  });

  it("maps array with undefined values", async () => {
    const array = {
      data: [
        { name: "Alice", age: 25 },
        { name: "Bob", age: undefined },
        { name: "Charlie", age: 35 },
      ],
    };

    const out = await mapArray({
      array,
      path: "age",
    });

    expect(out).toEqual({ resultSchema: [25, undefined, 35], resultModel: [25, undefined, 35] });
  });

  it("maps empty array", async () => {
    const array = { data: [] };

    const out = await mapArray({
      array,
      path: "name",
    });

    expect(out).toEqual({ resultSchema: [], resultModel: [] });
  });

  it("maps single element array", async () => {
    const array = {
      data: [{ name: "Alice", age: 25 }],
    };

    const out = await mapArray({
      array,
      path: "name",
    });

    expect(out).toEqual({ resultSchema: ["Alice"], resultModel: ["Alice"] });
  });

  it("handles path that doesn't exist on some objects", async () => {
    const array = {
      data: [
        { name: "Alice", age: 25 },
        { name: "Bob" },
        { name: "Charlie", age: 35 },
      ],
    };

    const out = await mapArray({
      array,
      path: "age",
    });

    expect(out).toEqual({ resultSchema: [25, undefined, 35], resultModel: [25, undefined, 35] });
  });

  it("handles path that returns undefined", async () => {
    const array = {
      data: [
        { name: "Alice", age: 25 },
        { name: "Bob", age: 30 },
        { name: "Charlie", age: 35 },
      ],
    };

    const out = await mapArray({
      array,
      path: "nonexistent",
    });

    expect(out).toEqual({ resultSchema: [undefined, undefined, undefined], resultModel: [undefined, undefined, undefined] });
  });

  it("wraps extracted value in targetPath key", async () => {
    const array = {
      data: [
        { name: "Alice", age: 25 },
        { name: "Bob", age: 30 },
      ],
    };

    const out = await mapArray({ array, path: "name", targetPath: "label" });

    expect(out).toEqual({
      resultSchema: [{ label: "Alice" }, { label: "Bob" }],
      resultModel: [{ label: "Alice" }, { label: "Bob" }],
    });
  });

  it("wraps extracted value in nested targetPath", async () => {
    const array = {
      data: [
        { name: "Alice" },
        { name: "Bob" },
      ],
    };

    const out = await mapArray({ array, path: "name", targetPath: "user.label" });

    expect(out).toEqual({
      resultSchema: [{ user: { label: "Alice" } }, { user: { label: "Bob" } }],
      resultModel: [{ user: { label: "Alice" } }, { user: { label: "Bob" } }],
    });
  });

  it("wraps nested path extraction in targetPath", async () => {
    const array = {
      data: [
        { user: { name: "Alice" } },
        { user: { name: "Bob" } },
      ],
    };

    const out = await mapArray({ array, path: "user.name", targetPath: "display.title" });

    expect(out).toEqual({
      resultSchema: [{ display: { title: "Alice" } }, { display: { title: "Bob" } }],
      resultModel: [{ display: { title: "Alice" } }, { display: { title: "Bob" } }],
    });
  });
});
