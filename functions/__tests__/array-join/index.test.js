import { describe, it, expect } from "vitest";
import arrayJoin from "../../functions/array-join/1.3/index.js";

const shapes = [
  ["array", (arr) => arr],
  ["collection", (arr) => ({ data: arr })],
];

describe("arrayJoin", () => {
  it.each(shapes)(
    "joins simple array with comma separator (%s input)",
    async (_label, wrap) => {
      const out = await arrayJoin({
        array: wrap(["apple", "banana", "cherry"]),
        separator: ",",
      });

      expect(out).toEqual({ result: "apple,banana,cherry" });
    },
  );

  it.each(shapes)(
    "joins simple array with custom separator (%s input)",
    async (_label, wrap) => {
      const out = await arrayJoin({
        array: wrap(["apple", "banana", "cherry"]),
        separator: " | ",
      });

      expect(out).toEqual({ result: "apple | banana | cherry" });
    },
  );

  it.each(shapes)(
    "joins array with path to extract object property (%s input)",
    async (_label, wrap) => {
      const array = [
        { name: "Alice", age: 25 },
        { name: "Bob", age: 30 },
        { name: "Charlie", age: 35 },
      ];

      const out = await arrayJoin({
        array: wrap(array),
        separator: ", ",
        path: "name",
      });

      expect(out).toEqual({ result: "Alice, Bob, Charlie" });
    },
  );

  it.each(shapes)(
    "joins array with nested path (%s input)",
    async (_label, wrap) => {
      const array = [
        { user: { name: "Alice", age: 25 } },
        { user: { name: "Bob", age: 30 } },
        { user: { name: "Charlie", age: 35 } },
      ];

      const out = await arrayJoin({
        array: wrap(array),
        separator: ", ",
        path: "user.name",
      });

      expect(out).toEqual({ result: "Alice, Bob, Charlie" });
    },
  );

  it.each(shapes)("joins empty array (%s input)", async (_label, wrap) => {
    const out = await arrayJoin({
      array: wrap([]),
      separator: ", ",
    });

    expect(out).toEqual({ result: "" });
  });

  it.each(shapes)(
    "joins single element array (%s input)",
    async (_label, wrap) => {
      const out = await arrayJoin({
        array: wrap(["apple"]),
        separator: ", ",
      });

      expect(out).toEqual({ result: "apple" });
    },
  );

  it.each(shapes)(
    "joins array with mixed types (%s input)",
    async (_label, wrap) => {
      const out = await arrayJoin({
        array: wrap([1, "string", true]),
        separator: ", ",
      });

      expect(out).toEqual({ result: "1, string, true" });
    },
  );

  it.each(shapes)(
    "joins numbers with custom separator (%s input)",
    async (_label, wrap) => {
      const out = await arrayJoin({
        array: wrap([1, 2, 3, 4, 5]),
        separator: " - ",
      });

      expect(out).toEqual({ result: "1 - 2 - 3 - 4 - 5" });
    },
  );

  it.each(shapes)(
    "joins array with empty string separator (valid, concatenates directly) (%s input)",
    async (_label, wrap) => {
      const out = await arrayJoin({
        array: wrap(["a", "b", "c"]),
        separator: "",
      });

      expect(out).toEqual({ result: "abc" });
    },
  );

  it.each(shapes)(
    "handles array with null/undefined values (%s input)",
    async (_label, wrap) => {
      const out = await arrayJoin({
        array: wrap(["apple", null, undefined, "banana"]),
        separator: ", ",
      });

      expect(out).toEqual({ result: "apple, , , banana" });
    },
  );

  it("throws error when array item is not an object and path is provided", async () => {
    await expect(
      arrayJoin({
        array: ["string", 123, true],
        separator: ", ",
        path: "name",
      }),
    ).rejects.toThrow("Array item is not an object. Cannot travel path");
  });

  // Required option validation

  it("throws error when array is missing", async () => {
    await expect(arrayJoin({ separator: ", " })).rejects.toThrow(
      "Array Join: 'array' is required!",
    );
  });

  it("throws error when array is not an array (normalizeArray returns null)", async () => {
    await expect(
      arrayJoin({ array: "not an array", separator: ", " }),
    ).rejects.toThrow("Array Join: 'array' is required!");
  });

  it("throws error when array is null", async () => {
    await expect(arrayJoin({ array: null, separator: ", " })).rejects.toThrow(
      "Array Join: 'array' is required!",
    );
  });

  it("throws error when array's data property is not an array (invalid normalizeArray shape)", async () => {
    await expect(
      arrayJoin({ array: { data: "not an array" }, separator: ", " }),
    ).rejects.toThrow("Array Join: 'array' is required!");
  });

  it("throws error when separator is missing", async () => {
    await expect(arrayJoin({ array: ["a", "b"] })).rejects.toThrow(
      "Array Join: 'separator' is required!",
    );
  });

  it("throws error when separator is undefined", async () => {
    await expect(
      arrayJoin({ array: ["a", "b"], separator: undefined }),
    ).rejects.toThrow("Array Join: 'separator' is required!");
  });

  it("throws error when separator is null", async () => {
    await expect(
      arrayJoin({ array: ["a", "b"], separator: null }),
    ).rejects.toThrow("Array Join: 'separator' is required!");
  });
});
