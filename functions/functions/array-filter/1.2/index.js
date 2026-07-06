import { normalizeArray } from "../../utils/array-utils";

const travelPath = (object, path) => {
  if (!path) return object;
  const keys = path.split(".");
  let result = object;
  for (const key of keys) {
    result = result[key];
  }
  return result;
};
const arrayFilter = async ({ array, path, value, operator, valueIsDate }) => {
  const normalizedArray = normalizeArray(array);
  if (!normalizedArray || !Array.isArray(normalizedArray)) {
    throw new Error("Array Filter: 'array' is required!");
  }
  if (value === undefined || value === null) {
    throw new Error("Array Filter: 'value' is required!");
  }
  if (!operator) {
    console.log({ array: normalizedArray, operator });
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
    throw new Error("Invalid operator");
  }
  const result = normalizedArray.filter((item) => {
    const itemValue = path ? travelPath(item, path) : item;

    if (typeof itemValue === "string") {
      if (valueIsDate) {
        console.log(new Date(itemValue));
        const itemAsDate = new Date(itemValue).getTime();
        const valueAsDate =
          typeof value === "number" ? value : new Date(value).getTime();
        return filterFn(itemAsDate, valueAsDate);
      }

      return filterFn(itemValue, value);
    }
    if (typeof itemValue === "number") {
      return filterFn(itemValue, Number(value));
    }

    return filterFn(itemValue, Boolean(value) ? value : undefined);
  });
  return {
    resultSchema: result,
    resultModel: result,
  };
};
export default arrayFilter;
