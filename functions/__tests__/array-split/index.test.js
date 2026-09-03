import { describe, it, expect, vi, afterEach } from "vitest";
import arraySplit from "../../functions/array-split/1.4/index.js";

describe("arraySplit", () => {
  const originalConsoleLog = console.log;

  afterEach(() => {
    console.log = originalConsoleLog;
  });

  it("splits string with default comma delimiter", async () => {
    const out = await arraySplit({
      value: "apple,banana,cherry",
    });

    expect(out).toEqual({
      resultStr: ["apple", "banana", "cherry"],
      resultInt: ["apple", "banana", "cherry"],
    });
  });

  it("splits string with custom delimiter", async () => {
    const out = await arraySplit({
      value: "apple|banana|cherry",
      delimiter: "|",
    });

    expect(out).toEqual({
      resultStr: ["apple", "banana", "cherry"],
      resultInt: ["apple", "banana", "cherry"],
    });
  });

  it("splits string with space delimiter", async () => {
    const out = await arraySplit({
      value: "apple banana cherry",
      delimiter: " ",
    });

    expect(out).toEqual({
      resultStr: ["apple", "banana", "cherry"],
      resultInt: ["apple", "banana", "cherry"],
    });
  });

  it("splits string with trim enabled", async () => {
    const out = await arraySplit({
      value: "apple, banana , cherry ",
      delimiter: ",",
      trim: true,
    });

    expect(out).toEqual({
      resultStr: ["apple", "banana", "cherry"],
      resultInt: ["apple", "banana", "cherry"],
    });
  });

  it("splits string with removeEmpty enabled", async () => {
    const out = await arraySplit({
      value: "apple,,banana,,cherry",
      delimiter: ",",
      removeEmpty: true,
    });

    expect(out).toEqual({
      resultStr: ["apple", "banana", "cherry"],
      resultInt: ["apple", "banana", "cherry"],
    });
  });

  it("splits string with both trim and removeEmpty enabled", async () => {
    const out = await arraySplit({
      value: "apple, , banana , ,cherry , ",
      delimiter: ",",
      trim: true,
      removeEmpty: true,
    });

    expect(out).toEqual({
      resultStr: ["apple", "banana", "cherry"],
      resultInt: ["apple", "banana", "cherry"],
    });
  });

  it("splits empty string", async () => {
    const out = await arraySplit({
      value: "",
    });

    expect(out).toEqual({ resultStr: [], resultInt: [] });
  });

  it("splits string with no delimiter matches", async () => {
    const out = await arraySplit({
      value: "apple banana cherry",
      delimiter: ",",
    });

    expect(out).toEqual({
      resultStr: ["apple banana cherry"],
      resultInt: ["apple banana cherry"],
    });
  });

  it("splits string with single character", async () => {
    const out = await arraySplit({
      value: "a",
    });

    expect(out).toEqual({ resultStr: ["a"], resultInt: ["a"] });
  });

  it("splits string with multiple consecutive delimiters", async () => {
    const out = await arraySplit({
      value: "apple,,,banana",
      delimiter: ",",
    });

    expect(out).toEqual({
      resultStr: ["apple", "", "", "banana"],
      resultInt: ["apple", "", "", "banana"],
    });
  });

  it("splits string with leading and trailing delimiters", async () => {
    const out = await arraySplit({
      value: ",apple,banana,",
      delimiter: ",",
    });

    expect(out).toEqual({
      resultStr: ["", "apple", "banana", ""],
      resultInt: ["", "apple", "banana", ""],
    });
  });

  it("logs when debugLogging is enabled", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    await arraySplit({
      value: "apple,banana,cherry",
      delimiter: ",",
      debugLogging: true,
    });

    expect(logSpy).toHaveBeenCalledWith("Array Split: input", {
      value: "apple,banana,cherry",
      delimiter: ",",
      trim: false,
      removeEmpty: false,
    });
    expect(logSpy).toHaveBeenCalledWith(
      "Array Split: values split into array",
      ["apple", "banana", "cherry"],
    );
    expect(logSpy).toHaveBeenCalledWith("Array Split: result", [
      "apple",
      "banana",
      "cherry",
    ]);
  });

  it("logs when value is not a string and debugLogging is enabled", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    try {
      await arraySplit({
        value: 123,
        delimiter: ",",
        debugLogging: true,
      });
    } catch (err) {
      // Expected to throw
    }

    expect(logSpy).toHaveBeenCalledWith("Array Split: 'value' is not a string");
  });

  it("does not log when debugLogging is disabled", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    await arraySplit({
      value: "apple,banana,cherry",
      delimiter: ",",
    });

    expect(logSpy).not.toHaveBeenCalled();
  });

  it("throws error when value is not a string", async () => {
    await expect(
      arraySplit({
        value: 123,
        delimiter: ",",
      }),
    ).rejects.toThrow("Value is not a string");
  });

  it("throws error when value is null", async () => {
    await expect(
      arraySplit({
        value: null,
        delimiter: ",",
      }),
    ).rejects.toThrow("Value is not a string");
  });

  it("throws error when value is undefined", async () => {
    await expect(
      arraySplit({
        value: undefined,
        delimiter: ",",
      }),
    ).rejects.toThrow("Value is not a string");
  });

  it("throws error when value is an object", async () => {
    await expect(
      arraySplit({
        value: { key: "value" },
        delimiter: ",",
      }),
    ).rejects.toThrow("Value is not a string");
  });

  it("throws error when value is already an array", async () => {
    await expect(
      arraySplit({
        value: ["apple", "banana"],
        delimiter: ",",
      }),
    ).rejects.toThrow("Value is not a string");
  });

  it("throws error when value is a number", async () => {
    await expect(
      arraySplit({
        value: 42,
      }),
    ).rejects.toThrow("Value is not a string");
  });

  it("splits string with special character delimiter", async () => {
    const out = await arraySplit({
      value: "apple*banana*cherry",
      delimiter: "*",
    });

    expect(out).toEqual({
      resultStr: ["apple", "banana", "cherry"],
      resultInt: ["apple", "banana", "cherry"],
    });
  });

  it("splits string with multi-character delimiter", async () => {
    const out = await arraySplit({
      value: "apple--banana--cherry",
      delimiter: "--",
    });

    expect(out).toEqual({
      resultStr: ["apple", "banana", "cherry"],
      resultInt: ["apple", "banana", "cherry"],
    });
  });

  it("handles string with only delimiters", async () => {
    const out = await arraySplit({
      value: ",,,",
      delimiter: ",",
    });

    expect(out).toEqual({
      resultStr: ["", "", "", ""],
      resultInt: ["", "", "", ""],
    });
  });

  it("handles string with only delimiters and removeEmpty", async () => {
    const out = await arraySplit({
      value: ",,,",
      delimiter: ",",
      removeEmpty: true,
    });

    expect(out).toEqual({ resultStr: [], resultInt: [] });
  });

  it("handles string with whitespace and trim", async () => {
    const out = await arraySplit({
      value: "  apple   ,  banana  ,   cherry  ",
      delimiter: ",",
      trim: true,
    });

    expect(out).toEqual({
      resultStr: ["apple", "banana", "cherry"],
      resultInt: ["apple", "banana", "cherry"],
    });
  });

  it("splits an uneven number of values across the delimiter", async () => {
    const out = await arraySplit({
      value: "a,b,c,d,e",
      delimiter: ",",
    });

    expect(out).toEqual({
      resultStr: ["a", "b", "c", "d", "e"],
      resultInt: ["a", "b", "c", "d", "e"],
    });
  });

  it("returns an empty array for an empty string regardless of trim/removeEmpty", async () => {
    const out = await arraySplit({
      value: "",
      trim: true,
      removeEmpty: true,
    });

    expect(out).toEqual({ resultStr: [], resultInt: [] });
  });

  it("does not mutate delimiter default when explicitly undefined", async () => {
    const out = await arraySplit({
      value: "apple,banana",
      delimiter: undefined,
    });

    expect(out).toEqual({
      resultStr: ["apple", "banana"],
      resultInt: ["apple", "banana"],
    });
  });
});
