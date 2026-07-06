import { describe, it, expect } from "vitest";
import arrayCombine from "../../functions/array-combine/1.2/index.js";

describe("arrayCombine", () => {
  it("combines two simple arrays", async () => {
    const out = await arrayCombine({
      arrayA: [1, 2, 3],
      arrayB: [4, 5, 6],
    });

    expect(out).toEqual({
      result: [1, 2, 3, 4, 5, 6],
      resultModel: [1, 2, 3, 4, 5, 6],
    });
  });

  it("combines arrays with object paths", async () => {
    const arrayA = [
      { id: 1, name: "Alice" },
      { id: 2, name: "Bob" },
    ];
    const arrayB = [
      { id: 3, name: "Charlie" },
      { id: 4, name: "Diana" },
    ];

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
  });

  it("handles arrays with data property", async () => {
    const arrayA = { data: [1, 2, 3] };
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

  it("handles empty arrays", async () => {
    const out = await arrayCombine({
      arrayA: [],
      arrayB: [],
    });

    expect(out).toEqual({ result: [], resultModel: [] });
  });

  it("handles nested object paths", async () => {
    const arrayA = [{ user: { name: "Alice" } }, { user: { name: "Bob" } }];
    const arrayB = [{ user: { name: "Charlie" } }];

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
  });

  it("uses path for only one array", async () => {
    const arrayA = [
      { id: 1, name: "Alice" },
      { id: 2, name: "Bob" },
    ];
    const arrayB = ["Charlie", "Diana"];

    const out = await arrayCombine({
      arrayA,
      pathA: "name",
      arrayB,
    });

    expect(out).toEqual({
      result: ["Alice", "Bob", "Charlie", "Diana"],
      resultModel: ["Alice", "Bob", "Charlie", "Diana"],
    });
  });

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

  it("normalizes plain arrays", async () => {
    const out = await arrayCombine({
      arrayA: [1, 2],
      arrayB: [3, 4],
    });

    expect(out).toEqual({ result: [1, 2, 3, 4], resultModel: [1, 2, 3, 4] });
  });

  it("normalizes collection shape ({ data: [...] })", async () => {
    const out = await arrayCombine({
      arrayA: { data: [1, 2] },
      arrayB: { data: [3, 4] },
    });

    expect(out).toEqual({ result: [1, 2, 3, 4], resultModel: [1, 2, 3, 4] });
  });
});
