import { describe, it, expect } from "vitest";
import regexMatch from "../../functions/regex-match/1.0/index.js";

describe("regexMatch", () => {
  it("returns all matches in the value", async () => {
    const out = await regexMatch({ regex: "\\w+", value: "Hello World 123" });
    expect(out).toEqual({ result: ["Hello", "World", "123"] });
  });

  it("returns an empty array when there are no matches", async () => {
    const out = await regexMatch({ regex: "xyz", value: "no match here" });
    expect(out).toEqual({ result: [] });
  });

  it("matches case-insensitively when flagCaseInsensitive is set", async () => {
    const out = await regexMatch({
      regex: "hello",
      value: "Hello hello HELLO",
      flagCaseInsensitive: true,
    });
    expect(out).toEqual({ result: ["Hello", "hello", "HELLO"] });
  });

  it("is case-sensitive when flagCaseInsensitive is off", async () => {
    const out = await regexMatch({
      regex: "hello",
      value: "Hello hello HELLO",
      flagCaseInsensitive: false,
    });
    expect(out).toEqual({ result: ["hello"] });
  });

  it("matches '^' per line when flagMultiline is set", async () => {
    const out = await regexMatch({
      regex: "^\\w+",
      value: "foo\nbar",
      flagMultiline: true,
    });
    expect(out).toEqual({ result: ["foo", "bar"] });
  });

  it("matches '.' across newlines when flagSingleLine is set", async () => {
    const out = await regexMatch({
      regex: "foo.bar",
      value: "foo\nbar",
      flagSingleLine: true,
    });
    expect(out).toEqual({ result: ["foo\nbar"] });
  });

  it("does not match '.' across newlines when flagSingleLine is off", async () => {
    const out = await regexMatch({
      regex: "foo.bar",
      value: "foo\nbar",
      flagSingleLine: false,
    });
    expect(out).toEqual({ result: [] });
  });

  it("stops at the first non-contiguous position when flagSticky is set", async () => {
    const out = await regexMatch({
      regex: "\\d+",
      value: "12 34 ab 56",
      flagSticky: true,
    });
    expect(out).toEqual({ result: ["12"] });
  });

  it("keeps matching while matches stay contiguous with flagSticky", async () => {
    const out = await regexMatch({
      regex: "\\d+\\s*",
      value: "12 34 ab 56",
      flagSticky: true,
    });
    expect(out).toEqual({ result: ["12 ", "34 "] });
  });

  it("coerces non-string values to string", async () => {
    const out = await regexMatch({ regex: "\\d+", value: 12345 });
    expect(out).toEqual({ result: ["12345"] });
  });

  it("throws on an invalid regex pattern", async () => {
    await expect(regexMatch({ regex: "(", value: "abc" })).rejects.toThrow();
  });
});
