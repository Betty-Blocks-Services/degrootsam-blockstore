import { describe, it, expect, afterEach } from "vitest";
import arrayFind from "../../functions/array-find/1.3/index.js";

describe("arrayFind", () => {
  const originalConsoleLog = console.log;

  afterEach(() => {
    console.log = originalConsoleLog;
  });

  it("finds element with equality operator", async () => {
    const out = await arrayFind({
      array: [1, 2, 3, 4, 5],
      path: "",
      value: 3,
      operator: "eq",
    });

    expect(out).toEqual({ resultSchema: 3, resultModel: 3 });
  });

  it("finds element with greater than operator", async () => {
    const out = await arrayFind({
      array: [1, 2, 3, 4, 5],
      path: "",
      value: 3,
      operator: "gt",
    });

    expect(out).toEqual({ resultSchema: 4, resultModel: 4 });
  });

  it("finds element with contains operator on strings", async () => {
    const out = await arrayFind({
      array: ["apple", "banana", "cherry", "date"],
      path: "",
      value: "an",
      operator: "cont",
    });

    expect(out).toEqual({ resultSchema: "banana", resultModel: "banana" });
  });

  it("finds element with path and operator", async () => {
    const array = [
      { name: "Alice", age: 25 },
      { name: "Bob", age: 30 },
      { name: "Charlie", age: 35 },
    ];

    const out = await arrayFind({
      array,
      path: "age",
      value: 30,
      operator: "eq",
    });

    expect(out).toEqual({
      resultSchema: { name: "Bob", age: 30 },
      resultModel: { name: "Bob", age: 30 },
    });
  });

  it("finds element with nested path", async () => {
    const array = [
      { user: { name: "Alice", age: 25 } },
      { user: { name: "Bob", age: 30 } },
      { user: { name: "Charlie", age: 35 } },
    ];

    const out = await arrayFind({
      array,
      path: "user.age",
      value: 30,
      operator: "eq",
    });

    expect(out).toEqual({
      resultSchema: { user: { name: "Bob", age: 30 } },
      resultModel: { user: { name: "Bob", age: 30 } },
    });
  });

  it("finds element with not equal operator", async () => {
    const out = await arrayFind({
      array: [3, 3, 3, 4, 5],
      path: "",
      value: 3,
      operator: "ne",
    });

    expect(out).toEqual({ resultSchema: 4, resultModel: 4 });
  });

  it("finds element with less than operator", async () => {
    const out = await arrayFind({
      array: [1, 2, 3, 4, 5],
      path: "",
      value: 3,
      operator: "lt",
    });

    expect(out).toEqual({ resultSchema: 1, resultModel: 1 });
  });

  it("finds element with greater than or equal operator", async () => {
    const out = await arrayFind({
      array: [1, 2, 3, 4, 5],
      path: "",
      value: 3,
      operator: "gte",
    });

    expect(out).toEqual({ resultSchema: 3, resultModel: 3 });
  });

  it("finds element with not contains operator", async () => {
    const out = await arrayFind({
      array: ["apple", "banana", "cherry", "date"],
      path: "",
      value: "an",
      operator: "ncont",
    });

    expect(out).toEqual({ resultSchema: "apple", resultModel: "apple" });
  });

  it("returns undefined when no element matches", async () => {
    const out = await arrayFind({
      array: [1, 2, 3, 4, 5],
      path: "",
      value: 10,
      operator: "eq",
    });

    expect(out).toEqual({ resultSchema: undefined, resultModel: undefined });
  });

  it("handles string values correctly", async () => {
    const out = await arrayFind({
      array: ["hello", "world", "test"],
      path: "",
      value: "world",
      operator: "eq",
    });

    expect(out).toEqual({ resultSchema: "world", resultModel: "world" });
  });

  it("handles number values correctly", async () => {
    const out = await arrayFind({
      array: [10, 20, 30],
      path: "",
      value: "20",
      operator: "eq",
    });

    expect(out).toEqual({ resultSchema: 20, resultModel: 20 });
  });

  it("returns undefined when path traverses into a non-existent property", async () => {
    const array = [
      { name: "Alice", age: 25 },
      { name: "Bob", age: 30 },
    ];

    const out = await arrayFind({
      array,
      path: "profile.age",
      value: 30,
      operator: "eq",
    });

    expect(out).toEqual({ resultSchema: undefined, resultModel: undefined });
  });

  it("throws error when array is missing", () => {
    expect(() =>
      arrayFind({ path: "test", value: 3, operator: "eq" }),
    ).toThrow("Array Find: 'array' is required!");
  });

  it("throws error when array is invalid (not an array or {data} shape)", () => {
    expect(() =>
      arrayFind({ array: "not-an-array", path: "test", value: 3, operator: "eq" }),
    ).toThrow("Array Find: 'array' is required!");

    expect(() =>
      arrayFind({ array: null, path: "test", value: 3, operator: "eq" }),
    ).toThrow("Array Find: 'array' is required!");

    expect(() =>
      arrayFind({ array: undefined, path: "test", value: 3, operator: "eq" }),
    ).toThrow("Array Find: 'array' is required!");
  });

  it("normalizes a plain array input", async () => {
    const out = await arrayFind({
      array: [1, 2, 3],
      path: "",
      value: 2,
      operator: "eq",
    });

    expect(out).toEqual({ resultSchema: 2, resultModel: 2 });
  });

  it("normalizes a { data: [...] } shaped collection input", async () => {
    const out = await arrayFind({
      array: { data: [1, 2, 3, 4] },
      path: "",
      value: 2,
      operator: "gt",
    });

    expect(out).toEqual({ resultSchema: 3, resultModel: 3 });
  });

  it("throws error when path is missing", () => {
    expect(() =>
      arrayFind({ array: [1, 2, 3], value: 3, operator: "eq" }),
    ).toThrow("Array Find: 'path' is required!");

    expect(() =>
      arrayFind({ array: [1, 2, 3], path: null, value: 3, operator: "eq" }),
    ).toThrow("Array Find: 'path' is required!");
  });

  it("throws error when value is missing", () => {
    expect(() =>
      arrayFind({ array: [1, 2, 3], path: "test", operator: "eq" }),
    ).toThrow("Array Find: 'value' is required!");
  });

  it("does not treat a falsy value of 0 as missing", async () => {
    const out = await arrayFind({
      array: [0, 1, 2],
      path: "",
      value: 0,
      operator: "eq",
    });

    expect(out).toEqual({ resultSchema: 0, resultModel: 0 });
  });

  it("throws error when operator is missing", () => {
    expect(() =>
      arrayFind({ array: [1, 2, 3], path: "test", value: 3 }),
    ).toThrow("Array Find: 'operator' is required");
  });

  it("throws error when operator is invalid", () => {
    expect(() =>
      arrayFind({
        array: [1, 2, 3],
        path: "test",
        value: 3,
        operator: "invalid",
      }),
    ).toThrow("Array Find: Invalid operator 'invalid'");
  });

  it("returns undefined for invalid value type", async () => {
    const array = [null, undefined, Symbol("test")];

    const out = await arrayFind({
      array,
      path: "test",
      value: 3,
      operator: "eq",
    });
    expect(out).toEqual({ resultSchema: undefined, resultModel: undefined });
  });
});
