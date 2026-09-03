import { debugLog } from "../../utils/array-utils";

const arraySplit = async ({
  value,
  delimiter = ",",
  trim = false,
  removeEmpty = false,
  debugLogging,
}) => {
  const log = debugLog(debugLogging);
  const result = [];

  log("Array Split: input", { value, delimiter, trim, removeEmpty });
  if (typeof value !== "string") {
    log("Array Split: 'value' is not a string");
    throw new Error("Value is not a string");
  }

  const values = value === "" ? [] : value.split(delimiter);
  log("Array Split: values split into array", values);
  values.forEach((value) => {
    if (trim) {
      value = value.trim();
    }
    if (removeEmpty) {
      if (value) {
        result.push(value);
      }
      return;
    }
    result.push(value);
  });
  log("Array Split: result", result);
  return {
    resultStr: result,
    resultInt: result,
  };
};
export default arraySplit;
