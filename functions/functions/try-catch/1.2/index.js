const tryCatch = async ({ errorMessage, logging }, steps) => {
  try {
    const result = await steps();

    return {
      result,
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
