import { describe, it, expect, afterEach } from "vitest";
import arrayPush from "../../functions/array-push/1.2/index.js";

const shapes = [
  ["array", (arr) => arr],
  ["collection", (arr) => ({ data: arr })],
];

describe("arrayPush", () => {
  const originalConsoleLog = console.log;

  afterEach(() => {
    console.log = originalConsoleLog;
  });

  it.each(shapes)(
    "pushes value to simple array (%s input)",
    async (_label, wrap) => {
      const out = await arrayPush({
        array: wrap([1, 2, 3]),
        data: 4,
      });

      expect(out).toEqual({
        resultSchema: [1, 2, 3, 4],
        resultModel: [1, 2, 3, 4],
        resultText: [1, 2, 3, 4],
      });
    },
  );

  it.each(shapes)(
    "pushes value to array with path mapping (%s input)",
    async (_label, wrap) => {
      const array = [
        { name: "Alice", age: 25 },
        { name: "Bob", age: 30 },
      ];

      const out = await arrayPush({
        array: wrap(array),
        path: "name",
        data: "Charlie",
      });

      expect(out).toEqual({
        resultSchema: ["Alice", "Bob", "Charlie"],
        resultModel: ["Alice", "Bob", "Charlie"],
        resultText: ["Alice", "Bob", "Charlie"],
      });
    },
  );

  it.each(shapes)(
    "pushes value to array with nested path (%s input)",
    async (_label, wrap) => {
      const array = [
        { user: { name: "Alice", age: 25 } },
        { user: { name: "Bob", age: 30 } },
      ];

      const out = await arrayPush({
        array: wrap(array),
        path: "user.name",
        data: "Charlie",
      });

      expect(out).toEqual({
        resultSchema: ["Alice", "Bob", "Charlie"],
        resultModel: ["Alice", "Bob", "Charlie"],
        resultText: ["Alice", "Bob", "Charlie"],
      });
    },
  );

  it.each(shapes)(
    "pushes value with filter when value is not already in array (%s input)",
    async (_label, wrap) => {
      const out = await arrayPush({
        array: wrap([1, 2, 3]),
        data: 4,
        filter: true,
      });

      expect(out).toEqual({
        resultSchema: [1, 2, 3, 4],
        resultModel: [1, 2, 3, 4],
        resultText: [1, 2, 3, 4],
      });
    },
  );

  it.each(shapes)(
    "does not push value with filter when value is already in array (%s input)",
    async (_label, wrap) => {
      const out = await arrayPush({
        array: wrap([1, 2, 3]),
        data: 2,
        filter: true,
      });

      expect(out).toEqual({ result: [1, 2, 3] });
    },
  );

  it.each(shapes)(
    "pushes string value with filter when not already in array (%s input)",
    async (_label, wrap) => {
      const out = await arrayPush({
        array: wrap(["apple", "banana"]),
        data: "cherry",
        filter: true,
      });

      expect(out).toEqual({
        resultSchema: ["apple", "banana", "cherry"],
        resultModel: ["apple", "banana", "cherry"],
        resultText: ["apple", "banana", "cherry"],
      });
    },
  );

  it.each(shapes)(
    "does not push string value with filter when already in array (%s input)",
    async (_label, wrap) => {
      const out = await arrayPush({
        array: wrap(["apple", "banana"]),
        data: "apple",
        filter: true,
      });

      expect(out).toEqual({ result: ["apple", "banana"] });
    },
  );

  it("pushes value to empty array", async () => {
    const out = await arrayPush({
      array: [],
      data: "first",
    });

    expect(out).toEqual({
      resultSchema: ["first"],
      resultModel: ["first"],
      resultText: ["first"],
    });
  });

  it("pushes value when array is undefined (defaults to empty array)", async () => {
    const out = await arrayPush({
      array: undefined,
      data: "first",
    });

    expect(out).toEqual({
      resultSchema: ["first"],
      resultModel: ["first"],
      resultText: ["first"],
    });
  });

  it("pushes value when array is null (defaults to empty array)", async () => {
    const out = await arrayPush({
      array: null,
      data: "first",
    });

    expect(out).toEqual({
      resultSchema: ["first"],
      resultModel: ["first"],
      resultText: ["first"],
    });
  });

  it("pushes value when array is an invalid, non-array value (defaults to empty array)", async () => {
    const out = await arrayPush({
      array: "not-an-array-or-collection",
      data: "first",
    });

    expect(out).toEqual({
      resultSchema: ["first"],
      resultModel: ["first"],
      resultText: ["first"],
    });
  });

  it.each(shapes)("pushes object to array (%s input)", async (_label, wrap) => {
    const out = await arrayPush({
      array: wrap([{ name: "Alice" }, { name: "Bob" }]),
      data: { name: "Charlie" },
    });

    expect(out).toEqual({
      resultSchema: [{ name: "Alice" }, { name: "Bob" }, { name: "Charlie" }],
      resultModel: [{ name: "Alice" }, { name: "Bob" }, { name: "Charlie" }],
      resultText: [{ name: "Alice" }, { name: "Bob" }, { name: "Charlie" }],
    });
  });

  it.each(shapes)("pushes null value to array (%s input)", async (_label, wrap) => {
    const out = await arrayPush({
      array: wrap([1, 2, 3]),
      data: null,
    });

    expect(out).toEqual({
      resultSchema: [1, 2, 3, null],
      resultModel: [1, 2, 3, null],
      resultText: [1, 2, 3, null],
    });
  });

  it.each(shapes)(
    "pushes multiple items in sequence into the same array (%s input)",
    async (_label, wrap) => {
      let out = await arrayPush({ array: wrap([1, 2]), data: 3 });
      out = await arrayPush({ array: out.resultSchema, data: 4 });

      expect(out).toEqual({
        resultSchema: [1, 2, 3, 4],
        resultModel: [1, 2, 3, 4],
        resultText: [1, 2, 3, 4],
      });
    },
  );

  it("throws when data is undefined", async () => {
    await expect(
      arrayPush({
        array: [1, 2, 3],
        data: undefined,
      }),
    ).rejects.toThrow("Array Push: 'data' is required!");
  });

  it("throws when data option is missing entirely", async () => {
    await expect(
      arrayPush({
        array: [1, 2, 3],
      }),
    ).rejects.toThrow("Array Push: 'data' is required!");
  });
});
