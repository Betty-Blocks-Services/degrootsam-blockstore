const travelPath = (obj, path) =>
  path.split(".").reduce((acc, key) => acc?.[key], obj);

const normalizeArray = (input) =>
  Array.isArray(input) ? input : Array.isArray(input?.data) ? input.data : [];

const arrayCombine = async ({ arrayA = [], pathA, arrayB = [], pathB }) => {
  const arrayAValues = normalizeArray(arrayA).map((item) =>
    pathA ? travelPath(item, pathA) : item,
  );
  const arrayBValues = normalizeArray(arrayB).map((item) =>
    pathB ? travelPath(item, pathB) : item,
  );

  const result = [...arrayAValues, ...arrayBValues];
  return { result, resultModel: result };
};

export default arrayCombine;
