import { normalizeArray } from "../../utils/array-utils";
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

const arrayDeduplicate = async ({ array, path }) => {
  const normalizedArray = normalizeArray(array);

  if (!Array.isArray(normalizedArray)) {
    throw new Error("Array Deduplicate: 'array' is required!");
  }

  const seen = new Set();
  const result = normalizedArray.filter((item) => {
    const key = JSON.stringify(travelPath(item, path));
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return {
    resultSchema: result,
    resultModel: result,
  };
};

export default arrayDeduplicate;
