import { normalizeArray } from "../../utils/array-utils";

const arrayCount = async ({ array }) => {
  const normalizedArray = normalizeArray(array);
  if (!normalizedArray || !Array.isArray(normalizedArray)) {
    throw new Error("Array Count: 'array' is required!");
  }
  return { result: normalizedArray.length };
};

export default arrayCount;
