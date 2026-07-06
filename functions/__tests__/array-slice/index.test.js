import { describe, it, expect } from "vitest";
import arraySlice from "../../functions/array-slice/1.0/index.js";

describe("arraySlice", () => {
  it("slices with both start and end", async () => {
    const out = await arraySlice({ array: [1, 2, 3, 4, 5], start: 1, end: 3 });
    expect(out).toEqual({ resultSchema: [2, 3], resultModel: [2, 3] });
  });

  it("slices with only start provided", async () => {
    const out = await arraySlice({ array: [1, 2, 3, 4, 5], start: 2 });
    expect(out).toEqual({ resultSchema: [3, 4, 5], resultModel: [3, 4, 5] });
  });

  it("slices with negative start index", async () => {
    const out = await arraySlice({ array: [1, 2, 3, 4, 5], start: -2 });
    expect(out).toEqual({ resultSchema: [4, 5], resultModel: [4, 5] });
  });

  it("slices with negative end index", async () => {
    const out = await arraySlice({ array: [1, 2, 3, 4, 5], start: 0, end: -1 });
    expect(out).toEqual({
      resultSchema: [1, 2, 3, 4],
      resultModel: [1, 2, 3, 4],
    });
  });

  it("returns a full copy of the array when no bounds are given", async () => {
    const original = [1, 2, 3];
    const out = await arraySlice({ array: original });
    expect(out).toEqual({ resultSchema: [1, 2, 3], resultModel: [1, 2, 3] });
    expect(out.resultSchema).not.toBe(original);
  });

  it("does not mutate the original array", async () => {
    const original = [1, 2, 3, 4, 5];
    await arraySlice({ array: original, start: 1, end: 3 });
    expect(original).toEqual([1, 2, 3, 4, 5]);
  });

  it("normalizes a plain array input", async () => {
    const out = await arraySlice({ array: [10, 20, 30], start: 1 });
    expect(out).toEqual({ resultSchema: [20, 30], resultModel: [20, 30] });
  });

  it("normalizes a { data: [...] } shaped input", async () => {
    const out = await arraySlice({
      array: { data: [1, 2, 3, 4] },
      start: 1,
      end: 3,
    });
    expect(out).toEqual({ resultSchema: [2, 3], resultModel: [2, 3] });
  });

  it("throws error when array is missing", async () => {
    await expect(arraySlice({ start: 0, end: 2 })).rejects.toThrow(
      "Array Slice: 'array' is required!",
    );
  });

  it("throws error when array is undefined", async () => {
    await expect(
      arraySlice({ array: undefined, start: 0, end: 2 }),
    ).rejects.toThrow("Array Slice: 'array' is required!");
  });

  it("throws error when array is null", async () => {
    await expect(arraySlice({ array: null })).rejects.toThrow(
      "Array Slice: 'array' is required!",
    );
  });

  it("throws error when array is not an array or {data} shape", async () => {
    await expect(arraySlice({ array: "not-an-array" })).rejects.toThrow(
      "Array Slice: 'array' is required!",
    );
  });

  it("returns an empty array when given an empty array", async () => {
    const out = await arraySlice({ array: [] });
    expect(out).toEqual({ resultSchema: [], resultModel: [] });
  });

  it("returns an empty array for out-of-bounds start index", async () => {
    const out = await arraySlice({ array: [1, 2, 3], start: 10 });
    expect(out).toEqual({ resultSchema: [], resultModel: [] });
  });

  it("clamps an out-of-bounds end index to the array length", async () => {
    const out = await arraySlice({ array: [1, 2, 3], start: 1, end: 10 });
    expect(out).toEqual({ resultSchema: [2, 3], resultModel: [2, 3] });
  });
});
