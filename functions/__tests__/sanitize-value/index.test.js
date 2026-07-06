import { describe, it, expect } from "vitest";
import sanitizeValue from "../../functions/sanitize-value/1.0/index.js";

describe("sanitizeValue", () => {
  it("sanitizes a plain string: NFKC normalization, emoji/backtick removal, and disallowed characters", () => {
    const out = sanitizeValue({ value: "Hello 😀 World`!" });

    expect(out).toEqual({ result: "Hello  World!" });
  });

  it("normalizes Unicode using NFKC (e.g. ligatures decompose)", () => {
    const out = sanitizeValue({ value: "café ﬁ" });

    expect(out).toEqual({ result: "café fi" });
  });

  it("removes disallowed symbol characters while keeping letters, numbers, punctuation, and spaces", () => {
    const out = sanitizeValue({
      value: "Price: $100 < 5 ~ test | pipe ^ caret",
    });

    expect(out).toEqual({
      result: "Price: 100  5  test  pipe  caret",
    });
  });

  it("removes control characters like tabs but keeps carriage returns and line breaks", () => {
    const out = sanitizeValue({ value: "tab:\ttab\r\nnewline" });

    expect(out).toEqual({ result: "tab:tab\r\nnewline" });
  });

  it("sanitizes every string in an array of strings", () => {
    const out = sanitizeValue({ value: ["hello 😀", "world`"] });

    expect(out).toEqual({ result: ["hello ", "world"] });
  });

  it("recursively sanitizes string properties of an object/record", () => {
    const out = sanitizeValue({
      value: { a: "hi 😀", b: { c: "nested`val" } },
    });

    expect(out).toEqual({ result: { a: "hi ", b: { c: "nestedval" } } });
  });

  it("recursively sanitizes nested arrays within objects and objects within arrays", () => {
    const out = sanitizeValue({
      value: {
        list: ["one`", "two 😀"],
        nested: { deep: [{ label: "a`b" }] },
      },
    });

    expect(out).toEqual({
      result: {
        list: ["one", "two "],
        nested: { deep: [{ label: "ab" }] },
      },
    });
  });

  it("leaves already-clean input unchanged (no-op)", () => {
    const out = sanitizeValue({ value: "plain clean text 123." });

    expect(out).toEqual({ result: "plain clean text 123." });
  });

  it("handles an empty string", () => {
    const out = sanitizeValue({ value: "" });

    expect(out).toEqual({ result: "" });
  });

  it("throws 'value is required' error when value is undefined", () => {
    expect(() => sanitizeValue({})).toThrow(
      "Sanitize Value: 'value' is required!",
    );
  });

  it("throws 'value is required' error when value is null", () => {
    expect(() => sanitizeValue({ value: null })).toThrow(
      "Sanitize Value: 'value' is required!",
    );
  });
});
