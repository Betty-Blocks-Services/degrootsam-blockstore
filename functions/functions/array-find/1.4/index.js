import { normalizeArray, debugLog } from "../../utils/array-utils";

const getByPath = (object, path) => {
  if (!path) return object;

  const keys = path.split(".");
  let currentValue = object;

  for (const key of keys) {
    if (currentValue == null || typeof currentValue !== "object")
      return undefined;
    currentValue = currentValue[key];
  }

  return currentValue;
};

const operators = {
  eq: (a, b) => a === b,
  ne: (a, b) => a !== b,
  gt: (a, b) => a > b,
  lt: (a, b) => a < b,
  gte: (a, b) => a >= b,
  lte: (a, b) => a <= b,
  cont: (a, b) =>
    typeof a === "string" || Array.isArray(a) ? a.includes(b) : false,
  ncont: (a, b) =>
    typeof a === "string" || Array.isArray(a) ? !a.includes(b) : false,
};

const coerceForComparison = (candidateValue, rawValue) => {
  if (typeof candidateValue === "number") {
    const numericValue =
      typeof rawValue === "number" ? rawValue : Number(rawValue);
    return {
      candidate: candidateValue,
      target: numericValue,
      valid: Number.isFinite(numericValue),
    };
  }

  return { candidate: candidateValue, target: rawValue, valid: true };
};

const arrayFind = async ({ array, path, value, operator, debugLogging }) => {
  const log = debugLog(debugLogging);
  log("Array Find: input", { array, path, value, operator });

  const normalizedArray = normalizeArray(array);
  log("Array Find: normalized array", normalizedArray);

  if (normalizedArray == null) {
    log("Array Find: 'array' is missing or invalid");
    throw new Error("Array Find: 'array' is required!");
  }
  if (path == null) {
    log("Array Find: 'path' is missing");
    throw new Error("Array Find: 'path' is required!");
  }
  if (value == null) {
    log("Array Find: 'value' is missing");
    throw new Error("Array Find: 'value' is required!");
  }
  if (operator == null) {
    log("Array Find: 'operator' is missing");
    throw new Error("Array Find: 'operator' is required");
  }

  const filterFn = operators[operator];
  if (!filterFn) {
    log("Array Find: invalid operator", operator);
    throw new Error(`Array Find: Invalid operator '${operator}'`);
  }

  const foundItem = normalizedArray.find((item) => {
    const candidateValue = path ? getByPath(item, path) : item;

    if (candidateValue == null) return false;

    const { candidate, target, valid } = coerceForComparison(
      candidateValue,
      value,
    );
    if (!valid) return false;

    // Only compare primitives + arrays for cont/ncont
    const candidateType = typeof candidate;
    const isComparable =
      candidateType === "string" ||
      candidateType === "number" ||
      candidateType === "boolean" ||
      Array.isArray(candidate);

    if (!isComparable) return false;

    return filterFn(candidate, target);
  });

  log("Array Find: result", foundItem);

  return {
    resultSchema: foundItem,
    resultModel: foundItem,
  };
};

export default arrayFind;
