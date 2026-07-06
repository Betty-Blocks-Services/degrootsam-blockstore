const tryCatch = async ({ as, errorMessage, logging }, steps) => {
  if (!as) {
    throw new Error("Try Catch: 'as' is required!");
  }

  try {
    const result = await steps();

    return {
      as: result,
    };
  } catch (error) {
    if (logging) {
      console.log(error);
    }
    const message = errorMessage ? errorMessage : error;
    return { as: message };
  }
};
export default tryCatch;
