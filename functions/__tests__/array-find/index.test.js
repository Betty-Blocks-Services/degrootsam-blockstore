import { describe, it, expect, vi, afterEach } from "vitest";
import arrayFind from "../../functions/array-find/1.2/index.js";

describe("arrayFind", () => {
  const originalConsoleLog = console.log;

  afterEach(() => {
    console.log = originalConsoleLog;
  });

  it("finds element with equality operator", async () => {
    const out = await arrayFind({
      array: [1, 2, 3, 4, 5],
      path: undefined,
      value: 3,
      operator: "eq",
    });

    expect(out).toEqual({ resultSchema: 3, resultModel: 3 });
  });

  it("finds element with greater than operator", async () => {
    const out = await arrayFind({
      array: [1, 2, 3, 4, 5],
      path: undefined,
      value: 3,
      operator: "gt",
    });

    expect(out).toEqual({ resultSchema: 4, resultModel: 4 });
  });

  it("finds element with contains operator on strings", async () => {
    const out = await arrayFind({
      array: ["apple", "banana", "cherry", "date"],
      path: undefined,
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

    expect(out).toEqual({ resultSchema: { name: "Bob", age: 30 }, resultModel: { name: "Bob", age: 30 } });
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

    expect(out).toEqual({ resultSchema: { user: { name: "Bob", age: 30 } }, resultModel: { user: { name: "Bob", age: 30 } } });
  });

  it("finds element with not equal operator", async () => {
    const out = await arrayFind({
      array: [3, 3, 3, 4, 5],
      path: undefined,
      value: 3,
      operator: "ne",
    });

    expect(out).toEqual({ resultSchema: 4, resultModel: 4 });
  });

  it("finds element with less than operator", async () => {
    const out = await arrayFind({
      array: [1, 2, 3, 4, 5],
      path: undefined,
      value: 3,
      operator: "lt",
    });

    expect(out).toEqual({ resultSchema: 1, resultModel: 1 });
  });

  it("finds element with greater than or equal operator", async () => {
    const out = await arrayFind({
      array: [1, 2, 3, 4, 5],
      path: undefined,
      value: 3,
      operator: "gte",
    });

    expect(out).toEqual({ resultSchema: 3, resultModel: 3 });
  });

  it("finds element with not contains operator", async () => {
    const out = await arrayFind({
      array: ["apple", "banana", "cherry", "date"],
      path: undefined,
      value: "an",
      operator: "ncont",
    });

    expect(out).toEqual({ resultSchema: "apple", resultModel: "apple" });
  });

  it("returns undefined when no element matches", async () => {
    const out = await arrayFind({
      array: [1, 2, 3, 4, 5],
      path: undefined,
      value: 10,
      operator: "eq",
    });

    expect(out).toEqual({ resultSchema: undefined, resultModel: undefined });
  });

  it("handles string values correctly", async () => {
    const out = await arrayFind({
      array: ["hello", "world", "test"],
      path: undefined,
      value: "world",
      operator: "eq",
    });

    expect(out).toEqual({ resultSchema: "world", resultModel: "world" });
  });

  it("handles number values correctly", async () => {
    const out = await arrayFind({
      array: [10, 20, 30],
      path: undefined,
      value: "20",
      operator: "eq",
    });

    expect(out).toEqual({ resultSchema: 20, resultModel: 20 });
  });

  it("throws error when array is missing", async () => {
    try {
      await arrayFind({ path: "test", value: 3, operator: "eq" });
      throw new Error("Should have thrown");
    } catch (e) {
      expect(e.message).toBe("Array Find: 'array' is required");
    }
  });

  it("throws error when value is missing", async () => {
    try {
      await arrayFind({ array: [1, 2, 3], path: "test", operator: "eq" });
      throw new Error("Should have thrown");
    } catch (e) {
      expect(e.message).toBe("Array Find: 'value' is required");
    }
  });

  it("throws error when operator is missing", async () => {
    try {
      await arrayFind({ array: [1, 2, 3], path: "test", value: 3 });
      throw new Error("Should have thrown");
    } catch (e) {
      expect(e.message).toBe("Array Find: 'operator' is required");
    }
  });

  it("throws error when operator is invalid", async () => {
    try {
      await arrayFind({
        array: [1, 2, 3],
        path: "test",
        value: 3,
        operator: "invalid",
      });
      throw new Error("Should have thrown");
    } catch (e) {
      expect(e.message).toBe("Array Find: Invalid operator 'invalid'");
    }
  });

  it("returns undefined for invalid value type", async () => {
    const array = [null, undefined, Symbol("test")];

    const out = await arrayFind({ array, path: "test", value: 3, operator: "eq" });
    expect(out).toEqual({ resultSchema: undefined, resultModel: undefined });
  });
});
