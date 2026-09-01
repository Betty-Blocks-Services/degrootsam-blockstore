const regexSplit = async ({
  regex,
  value,
  flagCaseInsensitive,
  flagMultiline,
  flagSingleLine,
  flagUnicode,
}) => {
  let flags = "";
  if (flagCaseInsensitive) flags += "i";
  if (flagMultiline) flags += "m";
  if (flagSingleLine) flags += "s";
  if (flagUnicode) flags += "u";

  const re = new RegExp(regex, flags);
  const result = String(value).split(re);
  return { result };
};

export default regexSplit;
