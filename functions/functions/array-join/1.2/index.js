const travelPath = (object, path) => {
  const keys = path.split(".");
  let result = object;
  for (const key of keys) {
    result = result[key];
  }
  return result;
};

const arrayJoin = async ({ array = [], separator, path }) => {
  const parsedArray =
    typeof array === "object" && "data" in array ? array.data : array;

  if (!Array.isArray(parsedArray)) throw new Error("Missing array input");
  let arrayToJoin = [];
  if (path) {
    for (const item of parsedArray) {
      if (typeof item === "object") {
        arrayToJoin.push(travelPath(item, path));
      } else {
        throw new Error("Array item is not an object. Cannot travel path");
      }
    }
  } else {
    arrayToJoin = parsedArray;
  }
  const result = arrayToJoin.join(separator);
  return {
    result,
  };
};
export default arrayJoin;
