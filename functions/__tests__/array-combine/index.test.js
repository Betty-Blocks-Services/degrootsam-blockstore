import { describe, it, expect } from "vitest";
import arrayCombine from "../../functions/array-combine/1.1/index.js";

describe("arrayCombine", () => {
  it("combines two simple arrays", async () => {
    const out = await arrayCombine({
      arrayA: [1, 2, 3],
      arrayB: [4, 5, 6],
    });

    expect(out).toEqual({ result: [1, 2, 3, 4, 5, 6], resultModel: [1, 2, 3, 4, 5, 6] });
  });

  it("combines arrays with object paths", async () => {
    const arrayA = [
      { id: 1, name: "Alice" },
      { id: 2, name: "Bob" },
    ];
    const arrayB = [
      { id: 3, name: "Charlie" },
      { id: 4, name: "Diana" },
    ];

    const out = await arrayCombine({
      arrayA,
      pathA: "name",
      arrayB,
      pathB: "name",
    });

    expect(out).toEqual({ result: ["Alice", "Bob", "Charlie", "Diana"], resultModel: ["Alice", "Bob", "Charlie", "Diana"] });
  });

  it("handles arrays with data property", async () => {
    const arrayA = { data: [1, 2, 3] };
    const arrayB = { data: [4, 5, 6] };

    const out = await arrayCombine({
      arrayA,
      arrayB,
    });

    expect(out).toEqual({ result: [1, 2, 3, 4, 5, 6], resultModel: [1, 2, 3, 4, 5, 6] });
  });

  it("handles mixed array formats", async () => {
    const arrayA = [1, 2, 3];
    const arrayB = { data: [4, 5, 6] };

    const out = await arrayCombine({
      arrayA,
      arrayB,
    });

    expect(out).toEqual({ result: [1, 2, 3, 4, 5, 6], resultModel: [1, 2, 3, 4, 5, 6] });
  });

  it("handles empty arrays", async () => {
    const out = await arrayCombine({
      arrayA: [],
      arrayB: [],
    });

    expect(out).toEqual({ result: [], resultModel: [] });
  });

  it("handles nested object paths", async () => {
    const arrayA = [{ user: { name: "Alice" } }, { user: { name: "Bob" } }];
    const arrayB = [{ user: { name: "Charlie" } }];

    const out = await arrayCombine({
      arrayA,
      pathA: "user.name",
      arrayB,
      pathB: "user.name",
    });

    expect(out).toEqual({ result: ["Alice", "Bob", "Charlie"], resultModel: ["Alice", "Bob", "Charlie"] });
  });

  it("uses path for only one array", async () => {
    const arrayA = [
      { id: 1, name: "Alice" },
      { id: 2, name: "Bob" },
    ];
    const arrayB = ["Charlie", "Diana"];

    const out = await arrayCombine({
      arrayA,
      pathA: "name",
      arrayB,
    });

    expect(out).toEqual({ result: ["Alice", "Bob", "Charlie", "Diana"], resultModel: ["Alice", "Bob", "Charlie", "Diana"] });
  });

  it("handles undefined arrays gracefully", async () => {
    const out = await arrayCombine({
      arrayA: undefined,
      arrayB: [1, 2, 3],
    });

    expect(out).toEqual({ result: [1, 2, 3], resultModel: [1, 2, 3] });
  });
});
