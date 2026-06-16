import { describe, it, expect } from "vitest";
import arrayFilterBy from "../../functions/array-filter-by/1.0/index.js";

describe("arrayFilterBy", () => {
  // include mode — primitives
  it("include: keeps items present in filterArray", async () => {
    const out = await arrayFilterBy({
      array: [1, 2, 3, 4, 5],
      filterArray: [2, 4],
      mode: "include",
    });
    expect(out).toEqual({ resultSchema: [2, 4], resultModel: [2, 4] });
  });

  it("include: returns empty array when no matches", async () => {
    const out = await arrayFilterBy({
      array: [1, 2, 3],
      filterArray: [9, 10],
      mode: "include",
    });
    expect(out).toEqual({ resultSchema: [], resultModel: [] });
  });

  // exclude mode — primitives
  it("exclude: removes items present in filterArray", async () => {
    const out = await arrayFilterBy({
      array: [1, 2, 3, 4, 5],
      filterArray: [2, 4],
      mode: "exclude",
    });
    expect(out).toEqual({ resultSchema: [1, 3, 5], resultModel: [1, 3, 5] });
  });

  it("exclude: returns full array when no matches", async () => {
    const out = await arrayFilterBy({
      array: [1, 2, 3],
      filterArray: [9, 10],
      mode: "exclude",
    });
    expect(out).toEqual({ resultSchema: [1, 2, 3], resultModel: [1, 2, 3] });
  });

  // include mode — objects with path
  it("include: filters objects using path", async () => {
    const array = [
      { id: 1, name: "Alice" },
      { id: 2, name: "Bob" },
      { id: 3, name: "Charlie" },
    ];
    const out = await arrayFilterBy({
      array,
      filterArray: [1, 3],
      path: "id",
      mode: "include",
    });
    expect(out).toEqual({
      resultSchema: [{ id: 1, name: "Alice" }, { id: 3, name: "Charlie" }],
      resultModel: [{ id: 1, name: "Alice" }, { id: 3, name: "Charlie" }],
    });
  });

  // filterArray objects with filterPath
  it("include: filters using path and filterPath", async () => {
    const array = [
      { id: 1, name: "Alice" },
      { id: 2, name: "Bob" },
      { id: 3, name: "Charlie" },
    ];
    const filterArray = [{ userId: 1 }, { userId: 3 }];
    const out = await arrayFilterBy({
      array,
      filterArray,
      path: "id",
      filterPath: "userId",
      mode: "include",
    });
    expect(out).toEqual({
      resultSchema: [{ id: 1, name: "Alice" }, { id: 3, name: "Charlie" }],
      resultModel: [{ id: 1, name: "Alice" }, { id: 3, name: "Charlie" }],
    });
  });

  // nested path
  it("include: supports nested dot-separated path", async () => {
    const array = [
      { user: { id: 1 } },
      { user: { id: 2 } },
      { user: { id: 3 } },
    ];
    const out = await arrayFilterBy({
      array,
      filterArray: [1, 3],
      path: "user.id",
      mode: "include",
    });
    expect(out).toEqual({
      resultSchema: [{ user: { id: 1 } }, { user: { id: 3 } }],
      resultModel: [{ user: { id: 1 } }, { user: { id: 3 } }],
    });
  });

  // error cases
  it("throws when array is missing", async () => {
    await expect(
      arrayFilterBy({ filterArray: [1], mode: "include" })
    ).rejects.toThrow("Array Filter By: Missing required parameters");
  });

  it("throws when filterArray is missing", async () => {
    await expect(
      arrayFilterBy({ array: [1], mode: "include" })
    ).rejects.toThrow("Array Filter By: Missing required parameters");
  });

  it("throws when mode is missing", async () => {
    await expect(
      arrayFilterBy({ array: [1], filterArray: [1] })
    ).rejects.toThrow("Array Filter By: Missing required parameters");
  });

  it("throws on invalid mode", async () => {
    await expect(
      arrayFilterBy({ array: [1], filterArray: [1], mode: "wrong" })
    ).rejects.toThrow("Invalid mode");
  });
});
