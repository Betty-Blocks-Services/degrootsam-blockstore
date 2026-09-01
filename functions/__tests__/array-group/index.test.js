import { describe, it, expect } from "vitest";
import arrayGroup from "../../functions/array-group/1.0/index.js";

describe("arrayGroup", () => {
  const shapes = [
    ["array", (arr) => arr],
    ["collection", (arr) => ({ data: arr })],
  ];

  it.each(shapes)(
    "groups objects by a top-level path (%s input)",
    async (_label, wrap) => {
      const array = [
        { type: "fruit", name: "apple" },
        { type: "veg", name: "carrot" },
        { type: "fruit", name: "banana" },
      ];

      const out = await arrayGroup({ array: wrap(array), path: "type" });

      expect(out).toEqual({
        result: [
          {
            key: "fruit",
            items: [
              { type: "fruit", name: "apple" },
              { type: "fruit", name: "banana" },
            ],
          },
          {
            key: "veg",
            items: [{ type: "veg", name: "carrot" }],
          },
        ],
      });
    },
  );

  it.each(shapes)(
    "groups objects by a nested dot-separated path (%s input)",
    async (_label, wrap) => {
      const array = [
        { user: { role: "admin" }, id: 1 },
        { user: { role: "member" }, id: 2 },
        { user: { role: "admin" }, id: 3 },
      ];

      const out = await arrayGroup({ array: wrap(array), path: "user.role" });

      expect(out).toEqual({
        result: [
          {
            key: "admin",
            items: [
              { user: { role: "admin" }, id: 1 },
              { user: { role: "admin" }, id: 3 },
            ],
          },
          {
            key: "member",
            items: [{ user: { role: "member" }, id: 2 }],
          },
        ],
      });
    },
  );

  it.each(shapes)(
    "preserves first-seen order of groups and items within each group (%s input)",
    async (_label, wrap) => {
      const array = [
        { k: "b", v: 1 },
        { k: "a", v: 2 },
        { k: "b", v: 3 },
        { k: "a", v: 4 },
      ];

      const out = await arrayGroup({ array: wrap(array), path: "k" });

      expect(out.result.map((g) => g.key)).toEqual(["b", "a"]);
      expect(out.result[0].items.map((i) => i.v)).toEqual([1, 3]);
      expect(out.result[1].items.map((i) => i.v)).toEqual([2, 4]);
    },
  );

  it.each(shapes)(
    "groups items sharing a missing/undefined path value together (%s input)",
    async (_label, wrap) => {
      const array = [{ id: 1 }, { id: 2, category: "x" }, { id: 3 }];

      const out = await arrayGroup({ array: wrap(array), path: "category" });

      expect(out).toEqual({
        result: [
          { key: undefined, items: [{ id: 1 }, { id: 3 }] },
          { key: "x", items: [{ id: 2, category: "x" }] },
        ],
      });
    },
  );

  it.each(shapes)(
    "groups by numeric property values (%s input)",
    async (_label, wrap) => {
      const array = [{ age: 30 }, { age: 25 }, { age: 30 }];

      const out = await arrayGroup({ array: wrap(array), path: "age" });

      expect(out).toEqual({
        result: [
          { key: 30, items: [{ age: 30 }, { age: 30 }] },
          { key: 25, items: [{ age: 25 }] },
        ],
      });
    },
  );

  it("returns an empty groups array for an empty input array", async () => {
    const out = await arrayGroup({ array: [], path: "type" });
    expect(out).toEqual({ result: [] });
  });

  it.each(shapes)(
    "handles null items in the array gracefully, grouping them together (%s input)",
    async (_label, wrap) => {
      const array = [{ type: "a" }, null, { type: "a" }];

      const out = await arrayGroup({ array: wrap(array), path: "type" });

      expect(out).toEqual({
        result: [
          { key: "a", items: [{ type: "a" }, { type: "a" }] },
          { key: undefined, items: [null] },
        ],
      });
    },
  );

  it("throws when array is missing", async () => {
    await expect(arrayGroup({ path: "type" })).rejects.toThrow(
      "Array Group: 'array' is required!",
    );
  });

  it("throws when array is null", async () => {
    await expect(arrayGroup({ array: null, path: "type" })).rejects.toThrow(
      "Array Group: 'array' is required!",
    );
  });

  it("throws when array is a non-array, non-collection value", async () => {
    await expect(
      arrayGroup({ array: "not-an-array", path: "type" }),
    ).rejects.toThrow("Array Group: 'array' is required!");
  });

  it("accepts array as a { data: [...] } collection shape", async () => {
    const out = await arrayGroup({
      array: { data: [{ type: "a" }, { type: "a" }] },
      path: "type",
    });
    expect(out).toEqual({
      result: [{ key: "a", items: [{ type: "a" }, { type: "a" }] }],
    });
  });

  it("throws when path is missing", async () => {
    await expect(arrayGroup({ array: [{ type: "a" }] })).rejects.toThrow(
      "Array Group: 'path' is required!",
    );
  });

  it("throws when path is an empty string", async () => {
    await expect(
      arrayGroup({ array: [{ type: "a" }], path: "" }),
    ).rejects.toThrow("Array Group: 'path' is required!");
  });

  it("throws when path is null", async () => {
    await expect(
      arrayGroup({ array: [{ type: "a" }], path: null }),
    ).rejects.toThrow("Array Group: 'path' is required!");
  });
});
