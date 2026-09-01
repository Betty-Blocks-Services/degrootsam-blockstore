import { describe, it, expect } from "vitest";
import regexReplace from "../../functions/regex-replace/1.0/index.js";

describe("regexReplace", () => {
  it("replaces every match when replaceAll is on", async () => {
    const out = await regexReplace({
      regex: "o",
      value: "foo boo",
      replacement: "0",
      replaceAll: true,
    });
    expect(out).toEqual({ result: "f00 b00" });
  });

  it("replaces only the first match when replaceAll is off", async () => {
    const out = await regexReplace({
      regex: "o",
      value: "foo boo",
      replacement: "0",
      replaceAll: false,
    });
    expect(out).toEqual({ result: "f0o boo" });
  });

  it("supports '$n' group references in the replacement", async () => {
    const out = await regexReplace({
      regex: "(\\w+)@(\\w+)",
      value: "a@b",
      replacement: "$2@$1",
      replaceAll: true,
    });
    expect(out).toEqual({ result: "b@a" });
  });

  it("matches case-insensitively when flagCaseInsensitive is set", async () => {
    const out = await regexReplace({
      regex: "hello",
      value: "Hello HELLO",
      replacement: "hi",
      replaceAll: true,
      flagCaseInsensitive: true,
    });
    expect(out).toEqual({ result: "hi hi" });
  });

  it("is case-sensitive when flagCaseInsensitive is off", async () => {
    const out = await regexReplace({
      regex: "hello",
      value: "Hello HELLO",
      replacement: "hi",
      replaceAll: true,
      flagCaseInsensitive: false,
    });
    expect(out).toEqual({ result: "Hello HELLO" });
  });

  it("removes matches when no replacement is given", async () => {
    const out = await regexReplace({
      regex: "o",
      value: "foo",
      replaceAll: true,
    });
    expect(out).toEqual({ result: "f" });
  });

  it("coerces non-string values to string", async () => {
    const out = await regexReplace({
      regex: "\\d",
      value: 123,
      replacement: "x",
      replaceAll: true,
    });
    expect(out).toEqual({ result: "xxx" });
  });

  it("throws on an invalid regex pattern", async () => {
    await expect(
      regexReplace({ regex: "(", value: "abc", replacement: "x" }),
    ).rejects.toThrow();
  });
});
