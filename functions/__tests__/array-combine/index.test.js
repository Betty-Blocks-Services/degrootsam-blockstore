import { describe, it, expect } from "vitest";
import arrayCombine from "../../functions/array-combine/1.2/index.js";

const shapes = [
  ["array", (arr) => arr],
  ["collection", (arr) => ({ data: arr })],
];

describe("arrayCombine", () => {
  it.each(shapes)(
    "combines two simple arrays (%s input)",
    async (_label, wrap) => {
      const out = await arrayCombine({
        arrayA: wrap([1, 2, 3]),
        arrayB: wrap([4, 5, 6]),
      });

      expect(out).toEqual({
        result: [1, 2, 3, 4, 5, 6],
        resultModel: [1, 2, 3, 4, 5, 6],
      });
    },
  );

  it.each(shapes)(
    "combines arrays with object paths (%s input)",
    async (_label, wrap) => {
      const arrayA = wrap([
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" },
      ]);
      const arrayB = wrap([
        { id: 3, name: "Charlie" },
        { id: 4, name: "Diana" },
      ]);

      const out = await arrayCombine({
        arrayA,
        pathA: "name",
        arrayB,
        pathB: "name",
      });

      expect(out).toEqual({
        result: ["Alice", "Bob", "Charlie", "Diana"],
        resultModel: ["Alice", "Bob", "Charlie", "Diana"],
      });
    },
  );

  it("handles mixed array formats", async () => {
    const arrayA = [1, 2, 3];
    const arrayB = { data: [4, 5, 6] };

    const out = await arrayCombine({
      arrayA,
      arrayB,
    });

    expect(out).toEqual({
      result: [1, 2, 3, 4, 5, 6],
      resultModel: [1, 2, 3, 4, 5, 6],
    });
  });

  it.each(shapes)("handles empty arrays (%s input)", async (_label, wrap) => {
    const out = await arrayCombine({
      arrayA: wrap([]),
      arrayB: wrap([]),
    });

    expect(out).toEqual({ result: [], resultModel: [] });
  });

  it.each(shapes)(
    "handles nested object paths (%s input)",
    async (_label, wrap) => {
      const arrayA = wrap([
        { user: { name: "Alice" } },
        { user: { name: "Bob" } },
      ]);
      const arrayB = wrap([{ user: { name: "Charlie" } }]);

      const out = await arrayCombine({
        arrayA,
        pathA: "user.name",
        arrayB,
        pathB: "user.name",
      });

      expect(out).toEqual({
        result: ["Alice", "Bob", "Charlie"],
        resultModel: ["Alice", "Bob", "Charlie"],
      });
    },
  );

  it.each(shapes)(
    "uses path for only one array (%s input)",
    async (_label, wrap) => {
      const arrayA = wrap([
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" },
      ]);
      const arrayB = wrap(["Charlie", "Diana"]);

      const out = await arrayCombine({
        arrayA,
        pathA: "name",
        arrayB,
      });

      expect(out).toEqual({
        result: ["Alice", "Bob", "Charlie", "Diana"],
        resultModel: ["Alice", "Bob", "Charlie", "Diana"],
      });
    },
  );

  it("throws when arrayA is missing", async () => {
    await expect(
      arrayCombine({
        arrayA: undefined,
        arrayB: [1, 2, 3],
      }),
    ).rejects.toThrow("Array Combine: 'arrayA' is required!");
  });

  it("throws when arrayB is missing", async () => {
    await expect(
      arrayCombine({
        arrayA: [1, 2, 3],
        arrayB: undefined,
      }),
    ).rejects.toThrow("Array Combine: 'arrayB' is required!");
  });

  it("throws when arrayA is not a valid array or collection", async () => {
    await expect(
      arrayCombine({
        arrayA: null,
        arrayB: [1, 2, 3],
      }),
    ).rejects.toThrow("Array Combine: 'arrayA' is required!");
  });

  it("throws when arrayB is not a valid array or collection", async () => {
    await expect(
      arrayCombine({
        arrayA: [1, 2, 3],
        arrayB: { foo: "bar" },
      }),
    ).rejects.toThrow("Array Combine: 'arrayB' is required!");
  });

  it.each(shapes)(
    "normalizes plain arrays (%s input)",
    async (_label, wrap) => {
      const out = await arrayCombine({
        arrayA: wrap([1, 2]),
        arrayB: wrap([3, 4]),
      });

      expect(out).toEqual({ result: [1, 2, 3, 4], resultModel: [1, 2, 3, 4] });
    },
  );
});
