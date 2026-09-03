import { normalizeArray, debugLog } from "../../utils/array-utils";
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
  debugLogging,
}) => {
  const log = debugLog(debugLogging);
  log("Array Filter By: input", {
    array,
    filterArray,
    path,
    filterPath,
    mode,
  });

  const normalizedArray = normalizeArray(array);
  log("Array Filter By: normalized array", normalizedArray);
  const normalizedFilterArray = normalizeArray(filterArray);
  log("Array Filter By: normalized filterArray", normalizedFilterArray);

  if (!Array.isArray(normalizedArray)) {
    log("Array Filter By: 'array' is missing or invalid");
    throw new Error("Array Filter By: 'array' is required!");
  }

  if (!Array.isArray(normalizedFilterArray)) {
    log("Array Filter By: 'filterArray' is missing or invalid");
    throw new Error("Array Filter By: 'filterArray' is required!");
  }

  if (!mode) {
    log("Array Filter By: 'mode' is missing");
    throw new Error("Array Filter By: 'mode' is required!");
  }

  const validModes = ["include", "exclude"];
  if (!validModes.includes(mode)) {
    log("Array Filter By: invalid mode", mode);
    throw new Error("Invalid mode: must be 'include' or 'exclude'");
  }

  const filterValues = new Set(
    normalizedFilterArray.map((item) => travelPath(item, filterPath)),
  );
  log("Array Filter By: filter values", [...filterValues]);

  const result = normalizedArray.filter((item) => {
    const itemValue = travelPath(item, path);
    const inSet = filterValues.has(itemValue);
    return mode === "include" ? inSet : !inSet;
  });
  log("Array Filter By: result", result);

  return {
    resultSchema: result,
    resultModel: result,
  };
};

export default arrayFilterBy;
