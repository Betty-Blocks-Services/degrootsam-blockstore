import { normalizeArray } from "../../utils/array-utils";

const arrayIsArray = async ({ array }) => {
  return { result: normalizeArray(array) !== null };
};

export default arrayIsArray;
