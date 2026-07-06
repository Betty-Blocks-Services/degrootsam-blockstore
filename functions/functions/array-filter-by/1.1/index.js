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

  if (
    !normalizedArray ||
    !Array.isArray(normalizedArray) ||
    !filterArray ||
    !mode
  ) {
    throw new Error("Array Filter By: Missing required parameters");
  }

  const validModes = ["include", "exclude"];
  if (!validModes.includes(mode)) {
    throw new Error("Invalid mode: must be 'include' or 'exclude'");
  }

  const filterValues = new Set(
    filterArray.map((item) => travelPath(item, filterPath)),
  );

  const result = array.filter((item) => {
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
