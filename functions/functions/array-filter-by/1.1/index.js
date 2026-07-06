import { normalizeArray } from "../../utils/array-utils";
const travelPath = (object, path) => {
  if (!path) return object;
  const keys = path.split(".");
  let result = object;
  for (const key of keys) {
    if (result == null) return undefined;
    result = result[key];
  }
  return result;
};

const arrayFilterBy = async ({
  array,
  filterArray,
  path,
  filterPath,
  mode,
}) => {
  const normalizedArray = normalizeArray(array);
  const normalizedFilterArray = normalizeArray(filterArray);

  if (!Array.isArray(normalizedArray)) {
    throw new Error("Array Filter By: 'array' is required!");
  }

  if (!Array.isArray(normalizedFilterArray)) {
    throw new Error("Array Filter By: 'filterArray' is required!");
  }

  if (!mode) {
    throw new Error("Array Filter By: 'mode' is required!");
  }

  const validModes = ["include", "exclude"];
  if (!validModes.includes(mode)) {
    throw new Error("Invalid mode: must be 'include' or 'exclude'");
  }

  const filterValues = new Set(
    normalizedFilterArray.map((item) => travelPath(item, filterPath)),
  );

  const result = normalizedArray.filter((item) => {
    const itemValue = travelPath(item, path);
    const inSet = filterValues.has(itemValue);
    return mode === "include" ? inSet : !inSet;
  });

  return {
    resultSchema: result,
    resultModel: result,
  };
};

export default arrayFilterBy;
