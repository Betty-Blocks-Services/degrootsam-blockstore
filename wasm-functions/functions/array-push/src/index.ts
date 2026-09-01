import type { JsonString } from "gen/types/interfaces/betty-blocks-array-push-array-push";

function push(array: Array<JsonString>, value: JsonString): Array<JsonString> {
  if (!Array.isArray(array))
    throw new Error("Cannot push into array: input is not an array!");

  console.log({ array, value });

  array.push(value);

  return array;
}

export const arrayPush = {
  push,
};
