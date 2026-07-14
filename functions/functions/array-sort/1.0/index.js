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

const arraySort = async ({ array, path, valueIsDate, direction = "asc" }) => {
  if (!array) {
    throw new Error("Array Sort: Missing required parameters");
  }

  const sorted = [...array].sort((a, b) => {
    let aVal = travelPath(a, path);
    let bVal = travelPath(b, path);

    if (valueIsDate) {
      aVal = new Date(aVal);
      bVal = new Date(bVal);
    }

    if (aVal < bVal) return direction === "asc" ? -1 : 1;
    if (aVal > bVal) return direction === "asc" ? 1 : -1;
    return 0;
  });

  return {
    resultModel: sorted,
    resultSchema: sorted,
  };
};

export default arraySort;
