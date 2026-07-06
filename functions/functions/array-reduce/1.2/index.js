import { normalizeArray } from "../../utils/array-utils";

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
}) => {
  const normalizedArray = normalizeArray(array);
  if (!Array.isArray(normalizedArray))
    throw new Error("Array Reduce: 'array' is required");
  if (!reducer) {
    throw new Error("Array Reduce: Reducer is required");
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
    throw new Error(`Array Reduce: Invalid reducer "${reducer}"`);
  }

  const start =
    initialValue !== undefined ? initialValue : defaultInits[reducer];

  const result = array.reduce((acc, item) => {
    // pull out the value at path, or use the item itself
    const val = path ? travelPath(item, path) : item;

    return fn(acc, val);
  }, start);

  return {
    resultSchema: result,
    resultModel: result,
  };
};

export default arrayReduce;
