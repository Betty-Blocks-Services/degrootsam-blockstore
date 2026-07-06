export const normalizeArray = (input) =>
  Array.isArray(input) ? input : Array.isArray(input?.data) ? input.data : [];
