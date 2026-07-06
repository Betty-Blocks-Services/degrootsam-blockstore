import { describe, it, expect } from "vitest";
import arrayCount from "../../functions/array-count/1.1/index.js";

const shapes = [
  ["array", (arr) => arr],
  ["collection", (arr) => ({ data: arr })],
];

describe("arrayCount", () => {
  it.each(shapes)(
    "counts elements in a valid array (%s input)",
    async (_label, wrap) => {
      const out = await arrayCount({ array: wrap([1, 2, 3, 4, 5]) });

      expect(out).toEqual({ result: 5 });
    },
  );

  it.each(shapes)(
    "counts elements in an empty array (%s input)",
    async (_label, wrap) => {
      const out = await arrayCount({ array: wrap([]) });

      expect(out).toEqual({ result: 0 });
    },
  );

  it.each(shapes)(
    "counts elements in an array with mixed types (%s input)",
    async (_label, wrap) => {
      const out = await arrayCount({
        array: wrap([1, "string", true, null, undefined]),
      });

      expect(out).toEqual({ result: 5 });
    },
  );

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
