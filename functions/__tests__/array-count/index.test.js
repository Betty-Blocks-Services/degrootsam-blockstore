import { describe, it, expect } from "vitest";
import arrayCount from "../../functions/array-count/1.1/index.js";

describe("arrayCount", () => {
  it("counts elements in a valid array", async () => {
    const out = await arrayCount({ array: [1, 2, 3, 4, 5] });

    expect(out).toEqual({ result: 5 });
  });

  it("counts elements in an empty array", async () => {
    const out = await arrayCount({ array: [] });

    expect(out).toEqual({ result: 0 });
  });

  it("counts elements in an array with mixed types", async () => {
    const out = await arrayCount({
      array: [1, "string", true, null, undefined],
    });

    expect(out).toEqual({ result: 5 });
  });

  it("correctly counts a collection input ({ data: [...] } shape)", async () => {
    const out = await arrayCount({ array: { data: [1, 2, 3] } });

    expect(out).toEqual({ result: 3 });
  });

  it("throws when 'array' is missing", async () => {
    await expect(arrayCount({})).rejects.toThrow(
      "Array Count: 'array' is required!",
    );
  });

  it("throws when 'array' is undefined", async () => {
    await expect(arrayCount({ array: undefined })).rejects.toThrow(
      "Array Count: 'array' is required!",
    );
  });

  it("throws when 'array' is null", async () => {
    await expect(arrayCount({ array: null })).rejects.toThrow(
      "Array Count: 'array' is required!",
    );
  });

  it("throws when 'array' is not an array or valid collection", async () => {
    await expect(arrayCount({ array: "not-an-array" })).rejects.toThrow(
      "Array Count: 'array' is required!",
    );
  });

  it("throws when 'array' is an object without a data array", async () => {
    await expect(arrayCount({ array: { foo: "bar" } })).rejects.toThrow(
      "Array Count: 'array' is required!",
    );
  });
});
