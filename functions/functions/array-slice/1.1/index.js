import { normalizeArray, debugLog } from "../../utils/array-utils";

const arraySlice = async ({ array, start, end, debugLogging }) => {
  const log = debugLog(debugLogging);
  log("Array Slice: input", { array, start, end });

  const normalizedArray = normalizeArray(array);
  log("Array Slice: normalized array", normalizedArray);

  if (!Array.isArray(normalizedArray)) {
    log("Array Slice: 'array' is missing or invalid");
    throw new Error("Array Slice: 'array' is required!");
  }

  const result = normalizedArray.slice(start, end);
  log("Array Slice: result", result);

  return {
    resultSchema: result,
    resultModel: result,
  };
};

export default arraySlice;
