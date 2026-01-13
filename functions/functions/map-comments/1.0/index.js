const normalizeArray = (input) =>
  Array.isArray(input) ? input : Array.isArray(input?.data) ? input.data : [];

// commentsCollection = array => [...]
// commentsCollection = collection => { data: [...] }

const mapComments = async ({ commentsCollection }) => {
  const normalizedArray = normalizeArray(commentsCollection);

  console.log({ normalizedArray });

  const commentsMap = normalizedArray.reduce(
    (accumulator, currentValue, index) => {
      const key = `comment_${index}`;
      accumulator[key] = currentValue["comment"]; // testaedas
      return accumulator;
    },
    {},
  );

  console.log({ commentsMap });

  return {
    result: commentsMap,
  };
};

export default mapComments;
