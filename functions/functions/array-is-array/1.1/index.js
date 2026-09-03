import { normalizeArray, debugLog } from "../../utils/array-utils";

const arrayIsArray = async ({ array, debugLogging }) => {
  const log = debugLog(debugLogging);
  log("Array Is Array: input", { array });

  const normalized = normalizeArray(array);
  log("Array Is Array: normalized array", normalized);

  const result = normalized !== null;
  log("Array Is Array: result", result);

  return { result };
};

export default arrayIsArray;
