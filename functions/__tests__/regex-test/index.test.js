import { describe, it, expect } from "vitest";
import regexTest from "../../functions/regex-test/1.0/index.js";

describe("regexTest", () => {
  it("returns true when the value matches", async () => {
    const out = await regexTest({ regex: "^\\d+$", value: "123" });
    expect(out).toEqual({ result: true });
  });

  it("returns false when the value does not match", async () => {
    const out = await regexTest({ regex: "^\\d+$", value: "abc" });
    expect(out).toEqual({ result: false });
  });

  it("matches case-insensitively when flagCaseInsensitive is set", async () => {
    const out = await regexTest({
      regex: "hello",
      value: "HELLO",
      flagCaseInsensitive: true,
    });
    expect(out).toEqual({ result: true });
  });

  it("is case-sensitive when flagCaseInsensitive is off", async () => {
    const out = await regexTest({
      regex: "hello",
      value: "HELLO",
      flagCaseInsensitive: false,
    });
    expect(out).toEqual({ result: false });
  });

  it("matches '^'/'$' per line when flagMultiline is set", async () => {
    const out = await regexTest({
      regex: "^world",
      value: "hello\nworld",
      flagMultiline: true,
    });
    expect(out).toEqual({ result: true });
  });

  it("does not match '^'/'$' per line when flagMultiline is off", async () => {
    const out = await regexTest({
      regex: "^world",
      value: "hello\nworld",
      flagMultiline: false,
    });
    expect(out).toEqual({ result: false });
  });

  it("matches '.' across newlines when flagSingleLine is set", async () => {
    const out = await regexTest({
      regex: "hello.world",
      value: "hello\nworld",
      flagSingleLine: true,
    });
    expect(out).toEqual({ result: true });
  });

  it("does not match '.' across newlines when flagSingleLine is off", async () => {
    const out = await regexTest({
      regex: "hello.world",
      value: "hello\nworld",
      flagSingleLine: false,
    });
    expect(out).toEqual({ result: false });
  });

  it("accepts unicode patterns when flagUnicode is set", async () => {
    const out = await regexTest({
      regex: "\\u{1F600}",
      value: "😀",
      flagUnicode: true,
    });
    expect(out).toEqual({ result: true });
  });

  it("does not interpret '\\u{...}' as a code point escape when flagUnicode is off", async () => {
    const out = await regexTest({
      regex: "\\u{1F600}",
      value: "😀",
      flagUnicode: false,
    });
    expect(out).toEqual({ result: false });
  });

  it("only matches at the start position when flagSticky is set", async () => {
    const out = await regexTest({
      regex: "world",
      value: "hello world",
      flagSticky: true,
    });
    expect(out).toEqual({ result: false });
  });

  it("matches anywhere when flagSticky is off", async () => {
    const out = await regexTest({
      regex: "world",
      value: "hello world",
      flagSticky: false,
    });
    expect(out).toEqual({ result: true });
  });

  it("matches at the start with flagSticky when the pattern is there", async () => {
    const out = await regexTest({
      regex: "hello",
      value: "hello world",
      flagSticky: true,
    });
    expect(out).toEqual({ result: true });
  });

  it("throws on an invalid regex pattern", async () => {
    await expect(regexTest({ regex: "(", value: "abc" })).rejects.toThrow();
  });
});
