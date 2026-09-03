import { normalizeArray, debugLog } from "../../utils/array-utils";

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

const arrayGroup = async ({ array, path, debugLogging }) => {
  const log = debugLog(debugLogging);
  log("Array Group: input", { array, path });

  const normalizedArray = normalizeArray(array);
  log("Array Group: normalized array", normalizedArray);

  if (!Array.isArray(normalizedArray)) {
    log("Array Group: 'array' is missing or invalid", { array });
    throw new Error("Array Group: 'array' is required!");
  }
  if (!path) {
    log("Array Group: 'path' is missing");
    throw new Error("Array Group: 'path' is required!");
  }

  const groups = [];
  const groupIndex = new Map();

  for (const item of normalizedArray) {
    const key = travelPath(item, path);

    if (!groupIndex.has(key)) {
      groupIndex.set(key, groups.length);
      groups.push({ key, items: [] });
      log("Array Group: new group", key);
    }
    groups[groupIndex.get(key)].items.push(item);
  }

  log("Array Group: result", groups);

  return { result: groups };
};

export default arrayGroup;
