import { normalizeArray } from "../../utils/array-utils";

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

const mapArray = async ({ array, path, targetPath }) => {
  const normalizedArray = normalizeArray(array);
  if (!Array.isArray(normalizedArray)) {
    throw new Error("Array Map: 'array' is required!");
  }
  if (!path) {
    throw new Error("Array Map: 'path' is required!");
  }

  let result;
  if (path.includes(".")) {
    result = normalizedArray.map((item) => {
      if (typeof item === "object") {
        const value = travelPath(item, path);
        return targetPath ? setPath(targetPath, value) : value;
      } else {
        throw new Error("Array item is not an object. Cannot travel path");
      }
    });
  } else {
    result = normalizedArray.map((item) => {
      const value = item[path];
      return targetPath ? setPath(targetPath, value) : value;
    });
  }
  return {
    resultSchema: result,
    resultModel: result,
  };
};
export default mapArray;
