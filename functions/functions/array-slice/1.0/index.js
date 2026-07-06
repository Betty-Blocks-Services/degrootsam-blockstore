import { normalizeArray } from "../../utils/array-utils";

const arraySlice = async ({ array, start, end }) => {
  const normalizedArray = normalizeArray(array);
  if (!Array.isArray(normalizedArray)) {
    throw new Error("Array Slice: 'array' is required!");
  }

  const result = normalizedArray.slice(start, end);

  return {
    resultSchema: result,
    resultModel: result,
  };
};

export default arraySlice;
