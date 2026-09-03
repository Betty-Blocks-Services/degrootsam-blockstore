import { normalizeArray, debugLog } from "../../utils/array-utils";

const travelPath = (object, path) => {
  const keys = path.split(".");
  let result = object;
  for (const key of keys) {
    result = result[key];
  }
  return result;
};

const arrayJoin = async ({ array, separator, path, debugLogging }) => {
  const log = debugLog(debugLogging);
  log("Array Join: input", { array, separator, path });

  const normalizedArray = normalizeArray(array);
  log("Array Join: normalized array", normalizedArray);

  if (!Array.isArray(normalizedArray)) {
    log("Array Join: 'array' is missing or invalid");
    throw new Error("Array Join: 'array' is required!");
  }

  if (separator === undefined || separator === null) {
    log("Array Join: 'separator' is missing");
    throw new Error("Array Join: 'separator' is required!");
  }

  let arrayToJoin = [];
  if (path) {
    for (const item of normalizedArray) {
      if (typeof item === "object") {
        arrayToJoin.push(travelPath(item, path));
      } else {
        log("Array Join: item is not an object, cannot travel path", item);
        throw new Error("Array item is not an object. Cannot travel path");
      }
    }
  } else {
    arrayToJoin = normalizedArray;
  }
  log("Array Join: values to join", arrayToJoin);

  const result = arrayToJoin.join(separator);
  log("Array Join: result", result);

  return {
    result,
  };
};
export default arrayJoin;
