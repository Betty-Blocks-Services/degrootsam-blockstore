import { describe, it, expect } from "vitest";
import regexExtractGroups from "../../functions/regex-extract-groups/1.0/index.js";

describe("regexExtractGroups", () => {
  it("returns the match and numbered groups for each match", async () => {
    const out = await regexExtractGroups({
      regex: "(\\w+)@(\\w+)",
      value: "a@b c@d",
    });
    expect(out).toEqual({
      result: [
        { match: "a@b", groups: ["a", "b"], namedGroups: {} },
        { match: "c@d", groups: ["c", "d"], namedGroups: {} },
      ],
    });
  });

  it("returns an empty groups array when the pattern has no capture groups", async () => {
    const out = await regexExtractGroups({ regex: "\\d+", value: "12 34" });
    expect(out).toEqual({
      result: [
        { match: "12", groups: [], namedGroups: {} },
        { match: "34", groups: [], namedGroups: {} },
      ],
    });
  });

  it("returns an empty array when there are no matches", async () => {
    const out = await regexExtractGroups({ regex: "xyz", value: "abc" });
    expect(out).toEqual({ result: [] });
  });

  it("includes named groups in namedGroups", async () => {
    const out = await regexExtractGroups({
      regex: "(?<user>\\w+)@(?<domain>\\w+)",
      value: "a@b",
    });
    expect(out).toEqual({
      result: [
        {
          match: "a@b",
          groups: ["a", "b"],
          namedGroups: { user: "a", domain: "b" },
        },
      ],
    });
  });

  it("matches case-insensitively when flagCaseInsensitive is set", async () => {
    const out = await regexExtractGroups({
      regex: "(hello)",
      value: "HELLO",
      flagCaseInsensitive: true,
    });
    expect(out).toEqual({
      result: [{ match: "HELLO", groups: ["HELLO"], namedGroups: {} }],
    });
  });

  it("throws on an invalid regex pattern", async () => {
    await expect(
      regexExtractGroups({ regex: "(", value: "abc" }),
    ).rejects.toThrow();
  });
});
