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

const arrayGroup = async ({ array, path }) => {
  const normalizedArray = normalizeArray(array);
  if (!Array.isArray(normalizedArray)) {
    console.log({ array });
    throw new Error("Array Group: 'array' is required!");
  }
  if (!path) {
    throw new Error("Array Group: 'path' is required!");
  }

  const groups = [];
  const groupIndex = new Map();

  for (const item of normalizedArray) {
    const key = travelPath(item, path);

    if (!groupIndex.has(key)) {
      groupIndex.set(key, groups.length);
      groups.push({ key, items: [] });
    }
    groups[groupIndex.get(key)].items.push(item);
  }

  return { result: groups };
};

export default arrayGroup;
