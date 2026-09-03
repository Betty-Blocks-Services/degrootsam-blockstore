import { normalizeArray, debugLog } from "../../utils/array-utils";

const travelPath = (object, path) => {
  const keys = path.split(".");
  let result = object;
  for (const key of keys) {
    result = result[key];
  }
  return result;
};

const setPath = (path, value) =>
  path.split(".").reduceRight((acc, key) => ({ [key]: acc }), value);

const mapArray = async ({ array, path, targetPath, debugLogging }) => {
  const log = debugLog(debugLogging);
  log("Array Map: input", { array, path, targetPath });

  const normalizedArray = normalizeArray(array);
  log("Array Map: normalized array", normalizedArray);

  if (!Array.isArray(normalizedArray)) {
    log("Array Map: 'array' is missing or invalid");
    throw new Error("Array Map: 'array' is required!");
  }
  if (!path) {
    log("Array Map: 'path' is missing");
    throw new Error("Array Map: 'path' is required!");
  }

  let result;
  if (path.includes(".")) {
    log("Array Map: path is nested, traveling path per item");
    result = normalizedArray.map((item) => {
      if (typeof item === "object") {
        const value = travelPath(item, path);
        return targetPath ? setPath(targetPath, value) : value;
      } else {
        log("Array Map: item is not an object, cannot travel path", item);
        throw new Error("Array item is not an object. Cannot travel path");
      }
    });
  } else {
    result = normalizedArray.map((item) => {
      const value = item[path];
      return targetPath ? setPath(targetPath, value) : value;
    });
  }
  log("Array Map: result", result);
  return {
    resultSchema: result,
    resultModel: result,
  };
};
export default mapArray;
