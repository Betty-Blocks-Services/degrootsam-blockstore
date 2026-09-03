import { normalizeArray, debugLog } from "../../utils/array-utils";

const travelPath = (obj, path) =>
  path.split(".").reduce((acc, key) => acc?.[key], obj);

const arrayCombine = async ({ arrayA, pathA, arrayB, pathB, debugLogging }) => {
  const log = debugLog(debugLogging);
  log("Array Combine: input", { arrayA, pathA, arrayB, pathB });

  const normalizedA = normalizeArray(arrayA);
  log("Array Combine: normalized arrayA", normalizedA);
  if (!Array.isArray(normalizedA)) {
    log("Array Combine: 'arrayA' is missing or invalid");
    throw new Error("Array Combine: 'arrayA' is required!");
  }

  const normalizedB = normalizeArray(arrayB);
  log("Array Combine: normalized arrayB", normalizedB);
  if (!Array.isArray(normalizedB)) {
    log("Array Combine: 'arrayB' is missing or invalid");
    throw new Error("Array Combine: 'arrayB' is required!");
  }

  const arrayAValues = normalizedA.map((item) =>
    pathA ? travelPath(item, pathA) : item,
  );
  log("Array Combine: extracted arrayA values", arrayAValues);

  const arrayBValues = normalizedB.map((item) =>
    pathB ? travelPath(item, pathB) : item,
  );
  log("Array Combine: extracted arrayB values", arrayBValues);

  const result = [...arrayAValues, ...arrayBValues];
  log("Array Combine: result", result);

  return { result, resultModel: result };
};

export default arrayCombine;
