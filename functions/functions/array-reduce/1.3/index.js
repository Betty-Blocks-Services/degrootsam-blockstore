import { normalizeArray, debugLog } from "../../utils/array-utils";

const travelPath = (object, path) => {
  const keys = path.split(".");
  let result = object;
  for (const key of keys) {
    result = result[key];
  }
  return result;
};

const arrayReduce = async ({
  array,
  path, // optional: dot-delimited path into each item
  reducer, // one of "sum", "min", "max", "concat", "count"
  initialValue, // optional override for the accumulator’s start
  debugLogging,
}) => {
  const log = debugLog(debugLogging);
  log("Array Reduce: input", { array, path, reducer, initialValue });

  const normalizedArray = normalizeArray(array);
  log("Array Reduce: normalized array", normalizedArray);

  if (!Array.isArray(normalizedArray)) {
    log("Array Reduce: 'array' is missing or invalid");
    throw new Error("Array Reduce: 'array' is required!");
  }
  if (!reducer) {
    log("Array Reduce: 'reducer' is missing");
    throw new Error("Array Reduce: 'reducer' is required!");
  }

  const reducers = {
    sum: (acc, val) => {
      const numVal = Number(val);
      return isNaN(numVal) ? acc : acc + numVal;
    },
    min: (acc, val) => {
      const numVal = Number(val);
      return isNaN(numVal) ? acc : Math.min(acc, numVal);
    },
    max: (acc, val) => {
      const numVal = Number(val);
      return isNaN(numVal) ? acc : Math.max(acc, numVal);
    },
    concat: (acc, val) => {
      return val != null ? acc.concat(val) : acc;
    },
  };

  const defaultInits = {
    sum: 0,
    min: Infinity,
    max: -Infinity,
    concat: [],
    count: 0,
  };

  const fn = reducers[reducer];
  if (!fn) {
    log("Array Reduce: invalid reducer", reducer);
    throw new Error(`Array Reduce: Invalid reducer "${reducer}"`);
  }

  const start =
    initialValue !== undefined ? initialValue : defaultInits[reducer];
  log("Array Reduce: initial accumulator", start);

  const result = normalizedArray.reduce((acc, item) => {
    // pull out the value at path, or use the item itself
    const val = path ? travelPath(item, path) : item;

    return fn(acc, val);
  }, start);

  log("Array Reduce: result", result);

  return {
    resultSchema: result,
    resultModel: reducer === "concat" ? result : undefined,
  };
};

export default arrayReduce;
