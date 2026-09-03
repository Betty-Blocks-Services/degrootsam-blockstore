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

const arrayDeduplicate = async ({ array, path, debugLogging }) => {
  const log = debugLog(debugLogging);
  log("Array Deduplicate: input", { array, path });

  const normalizedArray = normalizeArray(array);
  log("Array Deduplicate: normalized array", normalizedArray);

  if (!Array.isArray(normalizedArray)) {
    log("Array Deduplicate: 'array' is missing or invalid");
    throw new Error("Array Deduplicate: 'array' is required!");
  }

  const seen = new Set();
  const result = normalizedArray.filter((item) => {
    const key = JSON.stringify(travelPath(item, path));
    if (seen.has(key)) {
      log("Array Deduplicate: dropping duplicate", { key, item });
      return false;
    }
    seen.add(key);
    return true;
  });

  log("Array Deduplicate: result", result);

  return {
    resultSchema: result,
    resultModel: result,
  };
};

export default arrayDeduplicate;
