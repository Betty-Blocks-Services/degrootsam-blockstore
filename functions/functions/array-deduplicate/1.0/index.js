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
  if (!array) {
    throw new Error("Array Deduplicate: Missing required parameters");
  }

  const seen = new Set();
  const result = array.filter((item) => {
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
