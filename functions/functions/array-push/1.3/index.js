import { normalizeArray, debugLog } from "../../utils/array-utils";

const travelPath = (object, path) => {
  const keys = path.split(".");
  let result = object;
  for (const key of keys) {
    result = result[key];
  }
  return result;
};
const arrayPush = async ({
  array,
  path,
  data,
  filter = false,
  debugLogging = false,
}) => {
  const log = debugLog(debugLogging);
  log("Array Push: input", { array, path, data, filter });

  if (data === undefined) {
    log("Array Push: 'data' is missing");
    throw new Error("Array Push: 'data' is required!");
  }
  try {
    // 'array' is not a required option, so default to an empty array when
    // it is missing or cannot be normalized into an array.
    let result = normalizeArray(array) ?? [];
    log("Array Push: normalized array", result);
    if (path) {
      log("Array Push: extracting path", path);
      result = result.map((item) => {
        if (typeof item === "object") {
          return travelPath(item, path);
        } else {
          log("Array Push: item is not an object, cannot travel path", item);
          throw new Error("Array item is not an object. Cannot travel path");
        }
      });
      log("Array Push: array after path extraction", result);
    }
    if (filter) {
      log("Array Push: filter enabled, checking for existing value");
      // "If true, the value will only be pushed if it is not already in the array.
      if (result.includes(data)) {
        log("Array Push: value already in array, skipping push");
        return {
          resultSchema: result,
          resultModel: result,
          resultText: result,
        };
      }
    }
    log("Array Push: pushing value to array", data);
    result.push(data);
    log("Array Push: result", result);
    return {
      resultSchema: result,
      resultModel: result,
      resultText: result,
    };
  } catch (err) {
    log("Array Push: failed", err.message);
    const message = `Array Push failed: ${err.message}`;
    throw new Error(message);
  }
};
export default arrayPush;
