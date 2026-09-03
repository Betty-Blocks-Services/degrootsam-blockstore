import { normalizeArray, debugLog } from "../../utils/array-utils";

const travelPath = (object, path) => {
  if (!path) return object;
  const keys = path.split(".");
  let result = object;
  for (const key of keys) {
    result = result[key];
  }
  return result;
};
const arrayFilter = async ({
  array,
  path,
  value,
  operator,
  valueIsDate,
  debugLogging,
}) => {
  const log = debugLog(debugLogging);
  log("Array Filter: input", { array, path, value, operator, valueIsDate });

  const normalizedArray = normalizeArray(array);
  log("Array Filter: normalized array", normalizedArray);

  if (!normalizedArray || !Array.isArray(normalizedArray)) {
    log("Array Filter: 'array' is missing or invalid");
    throw new Error("Array Filter: 'array' is required!");
  }
  if (value === undefined || value === null) {
    log("Array Filter: 'value' is missing");
    throw new Error("Array Filter: 'value' is required!");
  }
  if (!operator) {
    log("Array Filter: 'operator' is missing", {
      array: normalizedArray,
      operator,
    });
    throw new Error(
      "Array Filter: Missing required parameters to filter array",
    );
  }
  const operators = {
    eq: (a, b) => a === b,
    ne: (a, b) => a !== b,
    gt: (a, b) => a > b,
    lt: (a, b) => a < b,
    gte: (a, b) => a >= b,
    lte: (a, b) => a <= b,
    cont: (a, b) => a.includes(b),
    ncont: (a, b) => !a.includes(b),
  };
  const filterFn = operators[operator];
  if (!filterFn) {
    log("Array Filter: invalid operator", operator);
    throw new Error("Invalid operator");
  }
  const result = normalizedArray.filter((item) => {
    const itemValue = path ? travelPath(item, path) : item;

    if (typeof itemValue === "string") {
      if (valueIsDate) {
        const itemAsDate = new Date(itemValue).getTime();
        const valueAsDate =
          typeof value === "number" ? value : new Date(value).getTime();
        log("Array Filter: comparing as dates", {
          itemValue,
          itemAsDate,
          valueAsDate,
        });
        return filterFn(itemAsDate, valueAsDate);
      }

      return filterFn(itemValue, value);
    }
    if (typeof itemValue === "number") {
      return filterFn(itemValue, Number(value));
    }

    return filterFn(itemValue, Boolean(value) ? value : undefined);
  });
  log("Array Filter: result", result);
  return {
    resultSchema: result,
    resultModel: result,
  };
};
export default arrayFilter;
