const generateWordDocument = async ({
  publicTemplateUrl,
  model,
  property: [{ name: propertyName }],
  fileName,
  variables,
  commentMap = {},
  changesMap = {},
}) => {
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
