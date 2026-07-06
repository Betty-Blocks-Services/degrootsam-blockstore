import { describe, it, expect } from "vitest";
import arrayReduce from "../../functions/array-reduce/1.2/index.js";

describe("arrayReduce", () => {
  it("reduces array with sum reducer", async () => {
    const out = await arrayReduce({
      array: [1, 2, 3, 4, 5],
      reducer: "sum",
    });

    expect(out).toEqual({ resultSchema: 15, resultModel: 15 });
  });

  it("reduces array with min reducer", async () => {
    const out = await arrayReduce({
      array: [5, 2, 8, 1, 9],
      reducer: "min",
    });

    expect(out).toEqual({ resultSchema: 1, resultModel: 1 });
  });

  it("reduces array with max reducer", async () => {
    const out = await arrayReduce({
      array: [5, 2, 8, 1, 9],
      reducer: "max",
    });

    expect(out).toEqual({ resultSchema: 9, resultModel: 9 });
  });

  it("reduces array with concat reducer", async () => {
    const out = await arrayReduce({
      array: [
        [1, 2],
        [3, 4],
        [5, 6],
      ],
      reducer: "concat",
    });

    expect(out).toEqual({ resultSchema: [1, 2, 3, 4, 5, 6], resultModel: [1, 2, 3, 4, 5, 6] });
  });

  it("reduces array with path and sum reducer", async () => {
    const array = [
      { name: "Alice", score: 85 },
      { name: "Bob", score: 92 },
      { name: "Charlie", score: 78 },
    ];

    const out = await arrayReduce({
      array,
      path: "score",
      reducer: "sum",
    });

    expect(out).toEqual({ resultSchema: 255, resultModel: 255 });
  });

  it("reduces array with nested path and min reducer", async () => {
    const array = [
      { user: { profile: { score: 85 } } },
      { user: { profile: { score: 92 } } },
      { user: { profile: { score: 78 } } },
    ];

    const out = await arrayReduce({
      array,
      path: "user.profile.score",
      reducer: "min",
    });

    expect(out).toEqual({ resultSchema: 78, resultModel: 78 });
  });

  it("reduces array with custom initial value", async () => {
    const out = await arrayReduce({
      array: [1, 2, 3, 4, 5],
      reducer: "sum",
      initialValue: 100,
    });

    expect(out).toEqual({ resultSchema: 115, resultModel: 115 });
  });

  it("reduces array with custom initial value for concat", async () => {
    const out = await arrayReduce({
      array: [
        [1, 2],
        [3, 4],
      ],
      reducer: "concat",
      initialValue: [0],
    });

    expect(out).toEqual({ resultSchema: [0, 1, 2, 3, 4], resultModel: [0, 1, 2, 3, 4] });
  });

  it("reduces empty array with sum and custom initial value", async () => {
    const out = await arrayReduce({
      array: [],
      reducer: "sum",
      initialValue: 10,
    });

    expect(out).toEqual({ resultSchema: 10, resultModel: 10 });
  });

  it("reduces empty array with min and custom initial value", async () => {
    const out = await arrayReduce({
      array: [],
      reducer: "min",
      initialValue: 5,
    });

    expect(out).toEqual({ resultSchema: 5, resultModel: 5 });
  });

  it("reduces empty array with max and custom initial value", async () => {
    const out = await arrayReduce({
      array: [],
      reducer: "max",
      initialValue: 5,
    });

    expect(out).toEqual({ resultSchema: 5, resultModel: 5 });
  });

  it("reduces empty array with concat and custom initial value", async () => {
    const out = await arrayReduce({
      array: [],
      reducer: "concat",
      initialValue: [1, 2],
    });

    expect(out).toEqual({ resultSchema: [1, 2], resultModel: [1, 2] });
  });

  it("reduces empty array with sum and no initial value defaults to 0", async () => {
    const out = await arrayReduce({
      array: [],
      reducer: "sum",
    });

    expect(out).toEqual({ resultSchema: 0, resultModel: 0 });
  });

  it("reduces array with string values using concat", async () => {
    const out = await arrayReduce({
      array: ["hello", "world", "test"],
      reducer: "concat",
    });

    expect(out).toEqual({ resultSchema: ["hello", "world", "test"], resultModel: ["hello", "world", "test"] });
  });

  it("reduces array with mixed numeric types using sum", async () => {
    const out = await arrayReduce({
      array: [1, "2", 3.5, "4.5"],
      reducer: "sum",
    });

    expect(out).toEqual({ resultSchema: 11, resultModel: 11 });
  });

  it("reduces array with mixed numeric types using min", async () => {
    const out = await arrayReduce({
      array: [1, "2", 3.5, "4.5"],
      reducer: "min",
    });

    expect(out).toEqual({ resultSchema: 1, resultModel: 1 });
  });

  it("reduces array with mixed numeric types using max", async () => {
    const out = await arrayReduce({
      array: [1, "2", 3.5, "4.5"],
      reducer: "max",
    });

    expect(out).toEqual({ resultSchema: 4.5, resultModel: 4.5 });
  });

  it("handles array with null values using sum", async () => {
    const out = await arrayReduce({
      array: [1, null, 3, undefined, 5],
      reducer: "sum",
    });

    expect(out).toEqual({ resultSchema: 9, resultModel: 9 });
  });

  it("handles array with null values using min", async () => {
    const out = await arrayReduce({
      array: [1, null, 3, undefined, 5],
      reducer: "min",
    });

    expect(out).toEqual({ resultSchema: 0, resultModel: 0 });
  });

  it("handles array with null values using max", async () => {
    const out = await arrayReduce({
      array: [1, null, 3, undefined, 5],
      reducer: "max",
    });

    expect(out).toEqual({ resultSchema: 5, resultModel: 5 });
  });

  it("handles array with null values using concat", async () => {
    const out = await arrayReduce({
      array: [[1, 2], null, [3, 4], undefined, [5, 6]],
      reducer: "concat",
    });

    expect(out).toEqual({ resultSchema: [1, 2, 3, 4, 5, 6], resultModel: [1, 2, 3, 4, 5, 6] });
  });

  it("normalizes a { data: [...] } shaped input before reducing", async () => {
    const out = await arrayReduce({
      array: { data: [1, 2, 3] },
      reducer: "sum",
    });

    expect(out).toEqual({ resultSchema: 6, resultModel: 6 });
  });

  it("throws when 'array' is missing (undefined)", async () => {
    await expect(
      arrayReduce({
        reducer: "sum",
      })
    ).rejects.toThrow("Array Reduce: 'array' is required!");
  });

  it("throws when 'array' is null", async () => {
    await expect(
      arrayReduce({
        array: null,
        reducer: "sum",
      })
    ).rejects.toThrow("Array Reduce: 'array' is required!");
  });

  it("throws when 'array' is not an array and has no .data array", async () => {
    await expect(
      arrayReduce({
        array: { foo: "bar" },
        reducer: "sum",
      })
    ).rejects.toThrow("Array Reduce: 'array' is required!");
  });

  it("throws when 'reducer' is missing (undefined)", async () => {
    await expect(
      arrayReduce({
        array: [1, 2, 3],
      })
    ).rejects.toThrow("Array Reduce: 'reducer' is required!");
  });

  it("throws when 'reducer' is an empty string", async () => {
    await expect(
      arrayReduce({
        array: [1, 2, 3],
        reducer: "",
      })
    ).rejects.toThrow("Array Reduce: 'reducer' is required!");
  });

  it("throws when 'reducer' is not a recognized reducer name", async () => {
    await expect(
      arrayReduce({
        array: [1, 2, 3],
        reducer: "average",
      })
    ).rejects.toThrow('Array Reduce: Invalid reducer "average"');
  });
});
