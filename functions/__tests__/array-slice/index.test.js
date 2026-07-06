import { describe, it, expect } from "vitest";
import arraySlice from "../../functions/array-slice/1.0/index.js";

const shapes = [
  ["array", (arr) => arr],
  ["collection", (arr) => ({ data: arr })],
];

describe("arraySlice", () => {
  it.each(shapes)(
    "slices with both start and end (%s input)",
    async (_label, wrap) => {
      const out = await arraySlice({
        array: wrap([1, 2, 3, 4, 5]),
        start: 1,
        end: 3,
      });
      expect(out).toEqual({ resultSchema: [2, 3], resultModel: [2, 3] });
    },
  );

  it.each(shapes)(
    "slices with only start provided (%s input)",
    async (_label, wrap) => {
      const out = await arraySlice({ array: wrap([1, 2, 3, 4, 5]), start: 2 });
      expect(out).toEqual({ resultSchema: [3, 4, 5], resultModel: [3, 4, 5] });
    },
  );

  it.each(shapes)(
    "slices with negative start index (%s input)",
    async (_label, wrap) => {
      const out = await arraySlice({
        array: wrap([1, 2, 3, 4, 5]),
        start: -2,
      });
      expect(out).toEqual({ resultSchema: [4, 5], resultModel: [4, 5] });
    },
  );

  it.each(shapes)(
    "slices with negative end index (%s input)",
    async (_label, wrap) => {
      const out = await arraySlice({
        array: wrap([1, 2, 3, 4, 5]),
        start: 0,
        end: -1,
      });
      expect(out).toEqual({
        resultSchema: [1, 2, 3, 4],
        resultModel: [1, 2, 3, 4],
      });
    },
  );

  it.each(shapes)(
    "returns a full copy of the array when no bounds are given (%s input)",
    async (_label, wrap) => {
      const original = [1, 2, 3];
      const out = await arraySlice({ array: wrap(original) });
      expect(out).toEqual({ resultSchema: [1, 2, 3], resultModel: [1, 2, 3] });
      expect(out.resultSchema).not.toBe(original);
    },
  );

  it.each(shapes)(
    "does not mutate the original array (%s input)",
    async (_label, wrap) => {
      const original = [1, 2, 3, 4, 5];
      await arraySlice({ array: wrap(original), start: 1, end: 3 });
      expect(original).toEqual([1, 2, 3, 4, 5]);
    },
  );

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

  it.each(shapes)(
    "returns an empty array when given an empty array (%s input)",
    async (_label, wrap) => {
      const out = await arraySlice({ array: wrap([]) });
      expect(out).toEqual({ resultSchema: [], resultModel: [] });
    },
  );

  it.each(shapes)(
    "returns an empty array for out-of-bounds start index (%s input)",
    async (_label, wrap) => {
      const out = await arraySlice({ array: wrap([1, 2, 3]), start: 10 });
      expect(out).toEqual({ resultSchema: [], resultModel: [] });
    },
  );

  it.each(shapes)(
    "clamps an out-of-bounds end index to the array length (%s input)",
    async (_label, wrap) => {
      const out = await arraySlice({
        array: wrap([1, 2, 3]),
        start: 1,
        end: 10,
      });
      expect(out).toEqual({ resultSchema: [2, 3], resultModel: [2, 3] });
    },
  );
});
