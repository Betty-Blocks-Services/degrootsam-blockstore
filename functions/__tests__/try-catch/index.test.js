import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import tryCatch from "../../functions/try-catch/1.2/index.js";

describe("tryCatch", () => {
  const originalConsoleLog = console.log;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    // Make sure we don't leave console patched if any test overrides it.
    console.log = originalConsoleLog;
  });

  it("throws when 'as' is missing", async () => {
    const steps = vi.fn().mockResolvedValue("OK");

    await expect(
      tryCatch({ errorMessage: null, logging: false }, steps),
    ).rejects.toThrow("Try Catch: 'as' is required!");

    // Validation happens before steps runs.
    expect(steps).not.toHaveBeenCalled();
  });

  it("throws when 'as' is undefined explicitly", async () => {
    const steps = vi.fn().mockResolvedValue("OK");

    await expect(
      tryCatch({ as: undefined, errorMessage: null, logging: false }, steps),
    ).rejects.toThrow("Try Catch: 'as' is required!");

    expect(steps).not.toHaveBeenCalled();
  });

  it("returns { as: result } on success", async () => {
    const steps = vi.fn().mockResolvedValue("OK");

    const out = await tryCatch(
      { as: "output", errorMessage: null, logging: false },
      steps,
    );

    expect(steps).toHaveBeenCalledTimes(1);
    expect(out).toEqual({ as: "OK" });
  });

  it("does not log anything on success, even when logging is true", async () => {
    const steps = vi.fn().mockResolvedValue("OK");
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    const out = await tryCatch(
      { as: "output", errorMessage: null, logging: true },
      steps,
    );

    expect(out).toEqual({ as: "OK" });
    expect(logSpy).not.toHaveBeenCalled();
  });

  it("returns { as: errorMessage } on error when errorMessage is provided", async () => {
    const err = new Error("boom");
    const steps = vi.fn().mockRejectedValue(err);
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    const out = await tryCatch(
      { as: "output", errorMessage: "Something went wrong", logging: true },
      steps,
    );

    expect(steps).toHaveBeenCalledTimes(1);
    expect(out).toEqual({ as: "Something went wrong" });
    // Should log only the error object from the catch block
    expect(logSpy).toHaveBeenCalledTimes(1);
    expect(logSpy).toHaveBeenCalledWith(err);
  });

  it("returns { as: error } on error when errorMessage is NOT provided", async () => {
    const err = new Error("kaboom");
    const steps = vi.fn().mockRejectedValue(err);
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    const out = await tryCatch(
      { as: "output", errorMessage: undefined, logging: false },
      steps,
    );

    expect(steps).toHaveBeenCalledTimes(1);
    expect(out).toEqual({ as: err }); // note: function returns the actual error object
    // No logging expected because logging=false
    expect(logSpy).not.toHaveBeenCalled();
  });

  it("does not log on error when logging is false, even with errorMessage set", async () => {
    const err = new Error("nope");
    const steps = vi.fn().mockRejectedValue(err);
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    const out = await tryCatch(
      { as: "output", errorMessage: "custom message", logging: false },
      steps,
    );

    expect(out).toEqual({ as: "custom message" });
    expect(logSpy).not.toHaveBeenCalled();
  });

  it("awaits the async steps function before returning", async () => {
    const order = [];
    const steps = vi.fn(async () => {
      order.push("steps-start");
      await new Promise((r) => setTimeout(r, 5));
      order.push("steps-end");
      return 42;
    });

    const out = await tryCatch(
      { as: "output", errorMessage: null, logging: true },
      steps,
    );

    expect(out).toEqual({ as: 42 });
    expect(order).toEqual(["steps-start", "steps-end"]);
  });
});
