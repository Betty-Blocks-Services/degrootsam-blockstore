import { describe, it, expect, afterEach } from "vitest";
import arrayFind from "../../functions/array-find/1.3/index.js";

describe("arrayFind", () => {
  const originalConsoleLog = console.log;

  afterEach(() => {
    console.log = originalConsoleLog;
  });

  const shapes = [
    ["array", (arr) => arr],
    ["collection", (arr) => ({ data: arr })],
  ];

  it.each(shapes)(
    "finds element with equality operator (%s input)",
    async (_label, wrap) => {
      const out = await arrayFind({
        array: wrap([1, 2, 3, 4, 5]),
        path: "",
        value: 3,
        operator: "eq",
      });

      expect(out).toEqual({ resultSchema: 3, resultModel: 3 });
    },
  );

  it.each(shapes)(
    "finds element with greater than operator (%s input)",
    async (_label, wrap) => {
      const out = await arrayFind({
        array: wrap([1, 2, 3, 4, 5]),
        path: "",
        value: 3,
        operator: "gt",
      });

      expect(out).toEqual({ resultSchema: 4, resultModel: 4 });
    },
  );

  it.each(shapes)(
    "finds element with contains operator on strings (%s input)",
    async (_label, wrap) => {
      const out = await arrayFind({
        array: wrap(["apple", "banana", "cherry", "date"]),
        path: "",
        value: "an",
        operator: "cont",
      });

      expect(out).toEqual({ resultSchema: "banana", resultModel: "banana" });
    },
  );

  it.each(shapes)(
    "finds element with path and operator (%s input)",
    async (_label, wrap) => {
      const array = [
        { name: "Alice", age: 25 },
        { name: "Bob", age: 30 },
        { name: "Charlie", age: 35 },
      ];

      const out = await arrayFind({
        array: wrap(array),
        path: "age",
        value: 30,
        operator: "eq",
      });

      expect(out).toEqual({
        resultSchema: { name: "Bob", age: 30 },
        resultModel: { name: "Bob", age: 30 },
      });
    },
  );

  it.each(shapes)(
    "finds element with nested path (%s input)",
    async (_label, wrap) => {
      const array = [
        { user: { name: "Alice", age: 25 } },
        { user: { name: "Bob", age: 30 } },
        { user: { name: "Charlie", age: 35 } },
      ];

      const out = await arrayFind({
        array: wrap(array),
        path: "user.age",
        value: 30,
        operator: "eq",
      });

      expect(out).toEqual({
        resultSchema: { user: { name: "Bob", age: 30 } },
        resultModel: { user: { name: "Bob", age: 30 } },
      });
    },
  );

  it.each(shapes)(
    "finds element with not equal operator (%s input)",
    async (_label, wrap) => {
      const out = await arrayFind({
        array: wrap([3, 3, 3, 4, 5]),
        path: "",
        value: 3,
        operator: "ne",
      });

      expect(out).toEqual({ resultSchema: 4, resultModel: 4 });
    },
  );

  it.each(shapes)(
    "finds element with less than operator (%s input)",
    async (_label, wrap) => {
      const out = await arrayFind({
        array: wrap([1, 2, 3, 4, 5]),
        path: "",
        value: 3,
        operator: "lt",
      });

      expect(out).toEqual({ resultSchema: 1, resultModel: 1 });
    },
  );

  it.each(shapes)(
    "finds element with greater than or equal operator (%s input)",
    async (_label, wrap) => {
      const out = await arrayFind({
        array: wrap([1, 2, 3, 4, 5]),
        path: "",
        value: 3,
        operator: "gte",
      });

      expect(out).toEqual({ resultSchema: 3, resultModel: 3 });
    },
  );

  it.each(shapes)(
    "finds element with not contains operator (%s input)",
    async (_label, wrap) => {
      const out = await arrayFind({
        array: wrap(["apple", "banana", "cherry", "date"]),
        path: "",
        value: "an",
        operator: "ncont",
      });

      expect(out).toEqual({ resultSchema: "apple", resultModel: "apple" });
    },
  );

  it.each(shapes)(
    "returns undefined when no element matches (%s input)",
    async (_label, wrap) => {
      const out = await arrayFind({
        array: wrap([1, 2, 3, 4, 5]),
        path: "",
        value: 10,
        operator: "eq",
      });

      expect(out).toEqual({ resultSchema: undefined, resultModel: undefined });
    },
  );

  it.each(shapes)(
    "handles string values correctly (%s input)",
    async (_label, wrap) => {
      const out = await arrayFind({
        array: wrap(["hello", "world", "test"]),
        path: "",
        value: "world",
        operator: "eq",
      });

      expect(out).toEqual({ resultSchema: "world", resultModel: "world" });
    },
  );

  it.each(shapes)(
    "handles number values correctly (%s input)",
    async (_label, wrap) => {
      const out = await arrayFind({
        array: wrap([10, 20, 30]),
        path: "",
        value: "20",
        operator: "eq",
      });

      expect(out).toEqual({ resultSchema: 20, resultModel: 20 });
    },
  );

  it.each(shapes)(
    "returns undefined when path traverses into a non-existent property (%s input)",
    async (_label, wrap) => {
      const array = [
        { name: "Alice", age: 25 },
        { name: "Bob", age: 30 },
      ];

      const out = await arrayFind({
        array: wrap(array),
        path: "profile.age",
        value: 30,
        operator: "eq",
      });

      expect(out).toEqual({ resultSchema: undefined, resultModel: undefined });
    },
  );

  it("throws error when array is missing", async () => {
    await expect(
      arrayFind({ path: "test", value: 3, operator: "eq" }),
    ).rejects.toThrow("Array Find: 'array' is required!");
  });

  it("throws error when array is invalid (not an array or {data} shape)", async () => {
    await expect(
      arrayFind({
        array: "not-an-array",
        path: "test",
        value: 3,
        operator: "eq",
      }),
    ).rejects.toThrow("Array Find: 'array' is required!");

    await expect(
      arrayFind({ array: null, path: "test", value: 3, operator: "eq" }),
    ).rejects.toThrow("Array Find: 'array' is required!");

    await expect(
      arrayFind({ array: undefined, path: "test", value: 3, operator: "eq" }),
    ).rejects.toThrow("Array Find: 'array' is required!");
  });

  it("throws error when path is missing", async () => {
    await expect(
      arrayFind({ array: [1, 2, 3], value: 3, operator: "eq" }),
    ).rejects.toThrow("Array Find: 'path' is required!");

    await expect(
      arrayFind({ array: [1, 2, 3], path: null, value: 3, operator: "eq" }),
    ).rejects.toThrow("Array Find: 'path' is required!");
  });

  it("throws error when value is missing", async () => {
    await expect(
      arrayFind({ array: [1, 2, 3], path: "test", operator: "eq" }),
    ).rejects.toThrow("Array Find: 'value' is required!");
  });

  it.each(shapes)(
    "does not treat a falsy value of 0 as missing (%s input)",
    async (_label, wrap) => {
      const out = await arrayFind({
        array: wrap([0, 1, 2]),
        path: "",
        value: 0,
        operator: "eq",
      });

      expect(out).toEqual({ resultSchema: 0, resultModel: 0 });
    },
  );

  it("throws error when operator is missing", async () => {
    await expect(
      arrayFind({ array: [1, 2, 3], path: "test", value: 3 }),
    ).rejects.toThrow("Array Find: 'operator' is required");
  });

  it("throws error when operator is invalid", async () => {
    await expect(
      arrayFind({
        array: [1, 2, 3],
        path: "test",
        value: 3,
        operator: "invalid",
      }),
    ).rejects.toThrow("Array Find: Invalid operator 'invalid'");
  });

  it.each(shapes)(
    "returns undefined for invalid value type (%s input)",
    async (_label, wrap) => {
      const array = [null, undefined, Symbol("test")];

      const out = await arrayFind({
        array: wrap(array),
        path: "test",
        value: 3,
        operator: "eq",
      });
      expect(out).toEqual({ resultSchema: undefined, resultModel: undefined });
    },
  );
});
