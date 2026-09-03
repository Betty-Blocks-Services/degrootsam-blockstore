export const normalizeArray = (input) =>
  Array.isArray(input) ? input : Array.isArray(input?.data) ? input.data : null;

// Factory: takes a boolean, returns a logger that only logs when enabled.
export const debugLog =
  (enabled) =>
  (...args) => {
    if (enabled) console.log(...args);
  };
