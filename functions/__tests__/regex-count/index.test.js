import { describe, it, expect } from "vitest";
import regexCount from "../../functions/regex-count/1.0/index.js";

describe("regexCount", () => {
  it("counts the number of matches", async () => {
    const out = await regexCount({ regex: "o", value: "foo boo" });
    expect(out).toEqual({ result: 4 });
  });

  it("returns 0 when there are no matches", async () => {
    const out = await regexCount({ regex: "xyz", value: "abc" });
    expect(out).toEqual({ result: 0 });
  });

  it("counts case-insensitively when flagCaseInsensitive is set", async () => {
    const out = await regexCount({
      regex: "a",
      value: "aAaA",
      flagCaseInsensitive: true,
    });
    expect(out).toEqual({ result: 4 });
  });

  it("counts case-sensitively when flagCaseInsensitive is off", async () => {
    const out = await regexCount({
      regex: "a",
      value: "aAaA",
      flagCaseInsensitive: false,
    });
    expect(out).toEqual({ result: 2 });
  });

  it("counts contiguous matches only when flagSticky is set", async () => {
    const out = await regexCount({
      regex: "\\d+",
      value: "12 34 ab 56",
      flagSticky: true,
    });
    expect(out).toEqual({ result: 1 });
  });

  it("coerces non-string values to string", async () => {
    const out = await regexCount({ regex: "\\d", value: 12345 });
    expect(out).toEqual({ result: 5 });
  });

  it("throws on an invalid regex pattern", async () => {
    await expect(regexCount({ regex: "(", value: "abc" })).rejects.toThrow();
  });
});
