import { describe, it, expect } from "vitest";
import regexValidate from "../../functions/regex-validate/1.0/index.js";

describe("regexValidate", () => {
  it("returns valid with an empty message when the value matches", async () => {
    const out = await regexValidate({ regex: "^\\d+$", value: "123" });
    expect(out).toEqual({ valid: true, message: "" });
  });

  it("returns invalid with the default message when the value does not match", async () => {
    const out = await regexValidate({ regex: "^\\d+$", value: "abc" });
    expect(out).toEqual({
      valid: false,
      message: "Value does not match the required pattern.",
    });
  });

  it("returns the custom invalidMessage when provided", async () => {
    const out = await regexValidate({
      regex: "^\\d+$",
      value: "abc",
      invalidMessage: "Numbers only",
    });
    expect(out).toEqual({ valid: false, message: "Numbers only" });
  });

  it("falls back to the default message when invalidMessage is an empty string", async () => {
    const out = await regexValidate({
      regex: "^\\d+$",
      value: "abc",
      invalidMessage: "",
    });
    expect(out).toEqual({
      valid: false,
      message: "Value does not match the required pattern.",
    });
  });

  it("matches case-insensitively when flagCaseInsensitive is set", async () => {
    const out = await regexValidate({
      regex: "^hello$",
      value: "HELLO",
      flagCaseInsensitive: true,
    });
    expect(out).toEqual({ valid: true, message: "" });
  });

  it("only matches at the start position when flagSticky is set", async () => {
    const out = await regexValidate({
      regex: "world",
      value: "hello world",
      flagSticky: true,
    });
    expect(out).toEqual({
      valid: false,
      message: "Value does not match the required pattern.",
    });
  });

  it("throws on an invalid regex pattern", async () => {
    await expect(regexValidate({ regex: "(", value: "abc" })).rejects.toThrow();
  });
});
