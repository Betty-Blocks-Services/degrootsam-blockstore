import { describe, it, expect } from "vitest";
import arrayReduce from "../../functions/array-reduce/1.2/index.js";

const shapes = [
  ["array", (arr) => arr],
  ["collection", (arr) => ({ data: arr })],
];

describe("arrayReduce", () => {
  it.each(shapes)("reduces array with sum reducer (%s input)", async (_label, wrap) => {
    const out = await arrayReduce({
      array: wrap([1, 2, 3, 4, 5]),
      reducer: "sum",
    });

    expect(out).toEqual({ resultSchema: 15, resultModel: 15 });
  });

  it.each(shapes)("reduces array with min reducer (%s input)", async (_label, wrap) => {
    const out = await arrayReduce({
      array: wrap([5, 2, 8, 1, 9]),
      reducer: "min",
    });

    expect(out).toEqual({ resultSchema: 1, resultModel: 1 });
  });

  it.each(shapes)("reduces array with max reducer (%s input)", async (_label, wrap) => {
    const out = await arrayReduce({
      array: wrap([5, 2, 8, 1, 9]),
      reducer: "max",
    });

    expect(out).toEqual({ resultSchema: 9, resultModel: 9 });
  });

  it.each(shapes)("reduces array with concat reducer (%s input)", async (_label, wrap) => {
    const out = await arrayReduce({
      array: wrap([
        [1, 2],
        [3, 4],
        [5, 6],
      ]),
      reducer: "concat",
    });

    expect(out).toEqual({ resultSchema: [1, 2, 3, 4, 5, 6], resultModel: [1, 2, 3, 4, 5, 6] });
  });

  it.each(shapes)("reduces array with path and sum reducer (%s input)", async (_label, wrap) => {
    const array = [
      { name: "Alice", score: 85 },
      { name: "Bob", score: 92 },
      { name: "Charlie", score: 78 },
    ];

    const out = await arrayReduce({
      array: wrap(array),
      path: "score",
      reducer: "sum",
    });

    expect(out).toEqual({ resultSchema: 255, resultModel: 255 });
  });

  it.each(shapes)("reduces array with nested path and min reducer (%s input)", async (_label, wrap) => {
    const array = [
      { user: { profile: { score: 85 } } },
      { user: { profile: { score: 92 } } },
      { user: { profile: { score: 78 } } },
    ];

    const out = await arrayReduce({
      array: wrap(array),
      path: "user.profile.score",
      reducer: "min",
    });

    expect(out).toEqual({ resultSchema: 78, resultModel: 78 });
  });

  it.each(shapes)("reduces array with custom initial value (%s input)", async (_label, wrap) => {
    const out = await arrayReduce({
      array: wrap([1, 2, 3, 4, 5]),
      reducer: "sum",
      initialValue: 100,
    });

    expect(out).toEqual({ resultSchema: 115, resultModel: 115 });
  });

  it.each(shapes)("reduces array with custom initial value for concat (%s input)", async (_label, wrap) => {
    const out = await arrayReduce({
      array: wrap([
        [1, 2],
        [3, 4],
      ]),
      reducer: "concat",
      initialValue: [0],
    });

    expect(out).toEqual({ resultSchema: [0, 1, 2, 3, 4], resultModel: [0, 1, 2, 3, 4] });
  });

  it.each(shapes)("reduces empty array with sum and custom initial value (%s input)", async (_label, wrap) => {
    const out = await arrayReduce({
      array: wrap([]),
      reducer: "sum",
      initialValue: 10,
    });

    expect(out).toEqual({ resultSchema: 10, resultModel: 10 });
  });

  it.each(shapes)("reduces empty array with min and custom initial value (%s input)", async (_label, wrap) => {
    const out = await arrayReduce({
      array: wrap([]),
      reducer: "min",
      initialValue: 5,
    });

    expect(out).toEqual({ resultSchema: 5, resultModel: 5 });
  });

  it.each(shapes)("reduces empty array with max and custom initial value (%s input)", async (_label, wrap) => {
    const out = await arrayReduce({
      array: wrap([]),
      reducer: "max",
      initialValue: 5,
    });

    expect(out).toEqual({ resultSchema: 5, resultModel: 5 });
  });

  it.each(shapes)("reduces empty array with concat and custom initial value (%s input)", async (_label, wrap) => {
    const out = await arrayReduce({
      array: wrap([]),
      reducer: "concat",
      initialValue: [1, 2],
    });

    expect(out).toEqual({ resultSchema: [1, 2], resultModel: [1, 2] });
  });

  it.each(shapes)("reduces empty array with sum and no initial value defaults to 0 (%s input)", async (_label, wrap) => {
    const out = await arrayReduce({
      array: wrap([]),
      reducer: "sum",
    });

    expect(out).toEqual({ resultSchema: 0, resultModel: 0 });
  });

  it.each(shapes)("reduces array with string values using concat (%s input)", async (_label, wrap) => {
    const out = await arrayReduce({
      array: wrap(["hello", "world", "test"]),
      reducer: "concat",
    });

    expect(out).toEqual({ resultSchema: ["hello", "world", "test"], resultModel: ["hello", "world", "test"] });
  });

  it.each(shapes)("reduces array with mixed numeric types using sum (%s input)", async (_label, wrap) => {
    const out = await arrayReduce({
      array: wrap([1, "2", 3.5, "4.5"]),
      reducer: "sum",
    });

    expect(out).toEqual({ resultSchema: 11, resultModel: 11 });
  });

  it.each(shapes)("reduces array with mixed numeric types using min (%s input)", async (_label, wrap) => {
    const out = await arrayReduce({
      array: wrap([1, "2", 3.5, "4.5"]),
      reducer: "min",
    });

    expect(out).toEqual({ resultSchema: 1, resultModel: 1 });
  });

  it.each(shapes)("reduces array with mixed numeric types using max (%s input)", async (_label, wrap) => {
    const out = await arrayReduce({
      array: wrap([1, "2", 3.5, "4.5"]),
      reducer: "max",
    });

    expect(out).toEqual({ resultSchema: 4.5, resultModel: 4.5 });
  });

  it.each(shapes)("handles array with null values using sum (%s input)", async (_label, wrap) => {
    const out = await arrayReduce({
      array: wrap([1, null, 3, undefined, 5]),
      reducer: "sum",
    });

    expect(out).toEqual({ resultSchema: 9, resultModel: 9 });
  });

  it.each(shapes)("handles array with null values using min (%s input)", async (_label, wrap) => {
    const out = await arrayReduce({
      array: wrap([1, null, 3, undefined, 5]),
      reducer: "min",
    });

    expect(out).toEqual({ resultSchema: 0, resultModel: 0 });
  });

  it.each(shapes)("handles array with null values using max (%s input)", async (_label, wrap) => {
    const out = await arrayReduce({
      array: wrap([1, null, 3, undefined, 5]),
      reducer: "max",
    });

    expect(out).toEqual({ resultSchema: 5, resultModel: 5 });
  });

  it.each(shapes)("handles array with null values using concat (%s input)", async (_label, wrap) => {
    const out = await arrayReduce({
      array: wrap([[1, 2], null, [3, 4], undefined, [5, 6]]),
      reducer: "concat",
    });

    expect(out).toEqual({ resultSchema: [1, 2, 3, 4, 5, 6], resultModel: [1, 2, 3, 4, 5, 6] });
  });

  // Regression test: previously `.reduce()` ran on the raw, un-normalized `array`
  // value, so a `{ data: [...] }` shaped collection (as Betty Blocks passes) would
  // throw instead of being normalized first. Kept as an explicit, standalone test
  // documenting that bug fix, in addition to the { data: [...] } coverage above.
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
