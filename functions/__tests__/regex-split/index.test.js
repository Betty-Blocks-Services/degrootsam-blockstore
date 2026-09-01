import { describe, it, expect } from "vitest";
import regexSplit from "../../functions/regex-split/1.0/index.js";

describe("regexSplit", () => {
  it("splits the value on the regex", async () => {
    const out = await regexSplit({ regex: "\\s*,\\s*", value: "a, b ,c" });
    expect(out).toEqual({ result: ["a", "b", "c"] });
  });

  it("returns the whole value in a single-element array when there is no match", async () => {
    const out = await regexSplit({ regex: ";", value: "abc" });
    expect(out).toEqual({ result: ["abc"] });
  });

  it("splits case-insensitively when flagCaseInsensitive is set", async () => {
    const out = await regexSplit({
      regex: "x",
      value: "aXbxc",
      flagCaseInsensitive: true,
    });
    expect(out).toEqual({ result: ["a", "b", "c"] });
  });

  it("returns a single empty string for an empty value", async () => {
    const out = await regexSplit({ regex: ",", value: "" });
    expect(out).toEqual({ result: [""] });
  });

  it("coerces non-string values to string", async () => {
    const out = await regexSplit({ regex: "3", value: 12345 });
    expect(out).toEqual({ result: ["12", "45"] });
  });

  it("throws on an invalid regex pattern", async () => {
    await expect(regexSplit({ regex: "(", value: "abc" })).rejects.toThrow();
  });
});
