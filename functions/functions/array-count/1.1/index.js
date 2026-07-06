import { normalizeArray } from "../../utils/array-utils";

const arrayCount = async ({ array }) => {
  try {
    const normalizedArray = normalizeArray(array);
    if (!normalizedArray || !Array.isArray(normalizedArray)) {
      throw new Error("Provided array is not valid");
    }
    return { result: normalizedArray.length };
  } catch (err) {
    const message = err.message;
    throw new Error(`Unable to count array: ${message}`);
  }
};

export default arrayCount;
