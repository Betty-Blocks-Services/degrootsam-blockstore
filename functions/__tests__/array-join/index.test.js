import { describe, it, expect } from "vitest";
import arrayJoin from "../../functions/array-join/1.3/index.js";

describe("arrayJoin", () => {
  it("joins simple array with comma separator", async () => {
    const out = await arrayJoin({
      array: ["apple", "banana", "cherry"],
      separator: ",",
    });

    expect(out).toEqual({ result: "apple,banana,cherry" });
  });

  it("joins simple array with custom separator", async () => {
    const out = await arrayJoin({
      array: ["apple", "banana", "cherry"],
      separator: " | ",
    });

    expect(out).toEqual({ result: "apple | banana | cherry" });
  });

  it("joins array with path to extract object property", async () => {
    const array = [
      { name: "Alice", age: 25 },
      { name: "Bob", age: 30 },
      { name: "Charlie", age: 35 },
    ];

    const out = await arrayJoin({
      array,
      separator: ", ",
      path: "name",
    });

    expect(out).toEqual({ result: "Alice, Bob, Charlie" });
  });

  it("joins array with nested path", async () => {
    const array = [
      { user: { name: "Alice", age: 25 } },
      { user: { name: "Bob", age: 30 } },
      { user: { name: "Charlie", age: 35 } },
    ];

    const out = await arrayJoin({
      array,
      separator: ", ",
      path: "user.name",
    });

    expect(out).toEqual({ result: "Alice, Bob, Charlie" });
  });

  it("handles array with data property (normalizeArray object shape)", async () => {
    const array = { data: ["apple", "banana", "cherry"] };

    const out = await arrayJoin({
      array,
      separator: ", ",
    });

    expect(out).toEqual({ result: "apple, banana, cherry" });
  });

  it("handles array with data property and path", async () => {
    const array = {
      data: [
        { name: "Alice", age: 25 },
        { name: "Bob", age: 30 },
        { name: "Charlie", age: 35 },
      ],
    };

    const out = await arrayJoin({
      array,
      separator: ", ",
      path: "name",
    });

    expect(out).toEqual({ result: "Alice, Bob, Charlie" });
  });

  it("joins empty array", async () => {
    const out = await arrayJoin({
      array: [],
      separator: ", ",
    });

    expect(out).toEqual({ result: "" });
  });

  it("joins single element array", async () => {
    const out = await arrayJoin({
      array: ["apple"],
      separator: ", ",
    });

    expect(out).toEqual({ result: "apple" });
  });

  it("joins array with mixed types", async () => {
    const out = await arrayJoin({
      array: [1, "string", true],
      separator: ", ",
    });

    expect(out).toEqual({ result: "1, string, true" });
  });

  it("joins numbers with custom separator", async () => {
    const out = await arrayJoin({
      array: [1, 2, 3, 4, 5],
      separator: " - ",
    });

    expect(out).toEqual({ result: "1 - 2 - 3 - 4 - 5" });
  });

  it("joins array with empty string separator (valid, concatenates directly)", async () => {
    const out = await arrayJoin({
      array: ["a", "b", "c"],
      separator: "",
    });

    expect(out).toEqual({ result: "abc" });
  });

  it("handles array with null/undefined values", async () => {
    const out = await arrayJoin({
      array: ["apple", null, undefined, "banana"],
      separator: ", ",
    });

    expect(out).toEqual({ result: "apple, , , banana" });
  });

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
    await expect(
      arrayJoin({ array: null, separator: ", " }),
    ).rejects.toThrow("Array Join: 'array' is required!");
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
