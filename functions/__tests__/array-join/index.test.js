import { describe, it, expect } from "vitest";
import arrayJoin from "../../functions/array-join/1.2/index.js";

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

  it("handles array with data property", async () => {
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

  it("handles missing array gracefully (defaults to empty)", async () => {
    const out = await arrayJoin({ separator: ", " });

    expect(out).toEqual({ result: "" });
  });

  it("throws error when array is not an array", async () => {
    await expect(
      arrayJoin({ array: "not an array", separator: ", " }),
    ).rejects.toThrow("Missing array input");
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

  it("handles array with null/undefined values", async () => {
    const out = await arrayJoin({
      array: ["apple", null, undefined, "banana"],
      separator: ", ",
    });

    expect(out).toEqual({ result: "apple, , , banana" });
  });

  it("joins numbers with custom separator", async () => {
    const out = await arrayJoin({
      array: [1, 2, 3, 4, 5],
      separator: " - ",
    });

    expect(out).toEqual({ result: "1 - 2 - 3 - 4 - 5" });
  });
});
