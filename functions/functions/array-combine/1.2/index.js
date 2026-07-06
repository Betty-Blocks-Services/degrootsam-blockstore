import { normalizeArray } from "../../utils/array-utils";

const travelPath = (obj, path) =>
  path.split(".").reduce((acc, key) => acc?.[key], obj);

const arrayCombine = async ({ arrayA, pathA, arrayB, pathB }) => {
  const normalizedA = normalizeArray(arrayA);
  if (!Array.isArray(normalizedA)) {
    throw new Error("Array Combine: 'arrayA' is required!");
  }

  const normalizedB = normalizeArray(arrayB);
  if (!Array.isArray(normalizedB)) {
    throw new Error("Array Combine: 'arrayB' is required!");
  }

  const arrayAValues = normalizedA.map((item) =>
    pathA ? travelPath(item, pathA) : item,
  );
  const arrayBValues = normalizedB.map((item) =>
    pathB ? travelPath(item, pathB) : item,
  );

  const result = [...arrayAValues, ...arrayBValues];
  return { result, resultModel: result };
};

export default arrayCombine;
