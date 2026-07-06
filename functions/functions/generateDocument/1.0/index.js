const generateWordDocument = async ({
  publicTemplateUrl,
  model,
  property,
  fileName,
  variables = [],
  commentMap = {},
  changesMap = {},
}) => {
  if (!model) {
    throw new Error("Generate Word Document: 'model' is required!");
  }

  if (!property || !property[0]) {
    throw new Error("Generate Word Document: 'property' is required!");
  }

  const [{ name: propertyName }] = property;

  const variableMap = variables.reduce((previousValue, currentValue) => {
    previousValue[currentValue.key] = currentValue.value;
    return previousValue;
  }, {});

  const mergedObject = {
    ...variableMap,
    ...commentMap,
    ...changesMap,
  };

  console.log({ mergedObject });

  const buffer = await generateDocx(publicTemplateUrl, mergedObject, {
    linebreaks: true,
    paragraphLoop: true,
  });

  const reference = await storeFile(model.name, propertyName, {
    contentType:
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    extension: "docx",
    fileName,
    fileBuffer: buffer,
  });

  return {
    result: reference,
  };
};

export default generateWordDocument;
