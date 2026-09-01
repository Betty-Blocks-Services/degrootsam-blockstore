/** @module Interface betty-blocks:array-push/array-push **/
export function push(
  array: Array<JsonString>,
  value: JsonString,
): Array<JsonString>;
export interface PushError {
  message: string;
}
export type JsonString = string;
