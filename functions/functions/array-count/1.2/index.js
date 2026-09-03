import { normalizeArray, debugLog } from "../../utils/array-utils";

const arrayCount = async ({ array, debugLogging }) => {
  const log = debugLog(debugLogging);
  log("Array Count: input", { array });

  const normalizedArray = normalizeArray(array);
  log("Array Count: normalized array", normalizedArray);

  if (!normalizedArray || !Array.isArray(normalizedArray)) {
    log("Array Count: 'array' is missing or invalid");
    throw new Error("Array Count: 'array' is required!");
  }

  const result = normalizedArray.length;
  log("Array Count: result", result);

  return { result };
};

export default arrayCount;
