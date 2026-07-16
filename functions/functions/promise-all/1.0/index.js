import { normalizeArray } from "../../utils/array-utils";

const promiseAll = async ({ concurrency, array }, steps) => {
  const normalizedArray = normalizeArray(array);
  if (!Array.isArray(normalizedArray)) {
    throw new Error("Promise All: 'array' is required!");
  }
  const batchSize = concurrency > 0 ? concurrency : normalizedArray.length;

  for (let i = 0; i < normalizedArray.length; i += batchSize) {
    const batch = normalizedArray.slice(i, i + batchSize);
    await Promise.all(
      batch.map((value, offset) =>
        steps({ iterator: value, index: i + offset }),
      ),
    );
  }
};

export default promiseAll;
