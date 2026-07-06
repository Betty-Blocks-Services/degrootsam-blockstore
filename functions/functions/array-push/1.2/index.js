import { normalizeArray } from "../../utils/array-utils";

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
  logging = false,
}) => {
  if (data === undefined) {
    throw new Error("Array Push: 'data' is required!");
  }
  try {
    if (logging)
      console.log({
        array,
        path,
        data,
        filter,
        logging,
      });
    // 'array' is not a required option, so default to an empty array when
    // it is missing or cannot be normalized into an array.
    let result = normalizeArray(array) ?? [];
    if (path) {
      if (logging) console.log("path", path);
      result = result.map((item) => {
        if (typeof item === "object") {
          return travelPath(item, path);
        } else {
          throw new Error("Array item is not an object. Cannot travel path");
        }
      });
    }
    if (filter) {
      if (logging) console.log("filter", filter);
      // "If true, the value will only be pushed if it is not already in the array.
      if (result.includes(data)) {
        if (logging) console.log("Value already in array");
        return { result };
      }
    }
    if (logging) console.log("Pushing value to array");
    result.push(data);
    if (logging) console.log("Result", result);
    return {
      resultSchema: result,
      resultModel: result,
      resultText: result,
    };
  } catch (err) {
    const message = `Array Push failed: ${err.message}`;
    throw new Error(message);
  }
};
export default arrayPush;
