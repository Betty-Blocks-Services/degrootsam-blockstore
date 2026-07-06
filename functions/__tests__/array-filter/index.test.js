import { describe, it, expect, vi, afterEach } from "vitest";
import arrayFilter from "../../functions/array-filter/1.2/index.js";

describe("arrayFilter", () => {
  const originalConsoleLog = console.log;

  afterEach(() => {
    console.log = originalConsoleLog;
  });

  it("filters array with equality operator", async () => {
    const out = await arrayFilter({
      array: [1, 2, 3, 4, 5],
      value: 3,
      operator: "eq",
    });

    expect(out).toEqual({ resultSchema: [3], resultModel: [3] });
  });

  it("filters array with greater than operator", async () => {
    const out = await arrayFilter({
      array: [1, 2, 3, 4, 5],
      value: 3,
      operator: "gt",
    });

    expect(out).toEqual({ resultSchema: [4, 5], resultModel: [4, 5] });
  });

  it("filters array with contains operator on strings", async () => {
    const out = await arrayFilter({
      array: ["apple", "banana", "cherry", "date"],
      value: "an",
      operator: "cont",
    });

    expect(out).toEqual({ resultSchema: ["banana"], resultModel: ["banana"] });
  });

  it("filters array with path and operator", async () => {
    const array = [
      { name: "Alice", age: 25 },
      { name: "Bob", age: 30 },
      { name: "Charlie", age: 35 },
    ];

    const out = await arrayFilter({
      array,
      path: "age",
      value: 30,
      operator: "eq",
    });

    expect(out).toEqual({
      resultSchema: [{ name: "Bob", age: 30 }],
      resultModel: [{ name: "Bob", age: 30 }],
    });
  });

  it("filters array with nested path", async () => {
    const array = [
      { user: { name: "Alice", age: 25 } },
      { user: { name: "Bob", age: 30 } },
      { user: { name: "Charlie", age: 35 } },
    ];

    const out = await arrayFilter({
      array,
      path: "user.age",
      value: 30,
      operator: "eq",
    });

    expect(out).toEqual({
      resultSchema: [{ user: { name: "Bob", age: 30 } }],
      resultModel: [{ user: { name: "Bob", age: 30 } }],
    });
  });

  it("filters array with not equal operator", async () => {
    const out = await arrayFilter({
      array: [1, 2, 3, 4, 5],
      value: 3,
      operator: "ne",
    });

    expect(out).toEqual({
      resultSchema: [1, 2, 4, 5],
      resultModel: [1, 2, 4, 5],
    });
  });

  it("filters array with less than or equal operator", async () => {
    const out = await arrayFilter({
      array: [1, 2, 3, 4, 5],
      value: 3,
      operator: "lte",
    });

    expect(out).toEqual({ resultSchema: [1, 2, 3], resultModel: [1, 2, 3] });
  });

  it("filters array with not contains operator", async () => {
    const out = await arrayFilter({
      array: ["apple", "banana", "cherry", "date"],
      value: "an",
      operator: "ncont",
    });

    expect(out).toEqual({
      resultSchema: ["apple", "cherry", "date"],
      resultModel: ["apple", "cherry", "date"],
    });
  });

  it("handles date comparison with valueIsDate flag", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const array = ["2023-01-01", "2023-06-01", "2023-12-01"];

    const out = await arrayFilter({
      array,
      value: "2023-06-01",
      operator: "gt",
      valueIsDate: true,
    });

    expect(out.resultSchema).toHaveLength(1);
    expect(logSpy).toHaveBeenCalledWith(new Date("2023-12-01"));
  });

  it("throws error when operator is missing", async () => {
    await expect(arrayFilter({ array: [1, 2, 3], value: 3 })).rejects.toThrow(
      "Array Filter: Missing required parameters to filter array",
    );
  });

  it("throws error when operator is invalid", async () => {
    await expect(
      arrayFilter({ array: [1, 2, 3], value: 3, operator: "invalid" }),
    ).rejects.toThrow("Invalid operator");
  });

  it("logs parameters when error occurs", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    try {
      await arrayFilter({ array: [1, 2, 3], value: 3 });
    } catch (err) {
      // Expected to throw
    }

    expect(logSpy).toHaveBeenCalledWith({
      array: [1, 2, 3],
      operator: undefined,
    });
  });

  it("throws error when array is missing", async () => {
    await expect(
      arrayFilter({ value: 3, operator: "eq" }),
    ).rejects.toThrow("Array Filter: 'array' is required!");
  });

  it("throws error when array is invalid (not an array or {data} shape)", async () => {
    await expect(
      arrayFilter({ array: "not-an-array", value: 3, operator: "eq" }),
    ).rejects.toThrow("Array Filter: 'array' is required!");

    await expect(
      arrayFilter({ array: null, value: 3, operator: "eq" }),
    ).rejects.toThrow("Array Filter: 'array' is required!");
  });

  it("throws error when value is missing", async () => {
    await expect(
      arrayFilter({ array: [1, 2, 3], operator: "eq" }),
    ).rejects.toThrow("Array Filter: 'value' is required!");
  });

  it("normalizes a plain array input", async () => {
    const out = await arrayFilter({
      array: [1, 2, 3],
      value: 2,
      operator: "eq",
    });

    expect(out).toEqual({ resultSchema: [2], resultModel: [2] });
  });

  it("normalizes a { data: [...] } shaped input", async () => {
    const out = await arrayFilter({
      array: { data: [1, 2, 3, 4] },
      value: 2,
      operator: "gt",
    });

    expect(out).toEqual({ resultSchema: [3, 4], resultModel: [3, 4] });
  });
});
