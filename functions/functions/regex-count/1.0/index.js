const regexCount = async ({
  regex,
  value,
  flagCaseInsensitive,
  flagMultiline,
  flagSingleLine,
  flagUnicode,
  flagSticky,
}) => {
  let flags = "g";
  if (flagCaseInsensitive) flags += "i";
  if (flagMultiline) flags += "m";
  if (flagSingleLine) flags += "s";
  if (flagUnicode) flags += "u";
  if (flagSticky) flags += "y";

  const re = new RegExp(regex, flags);
  const result = [...String(value).matchAll(re)].length;
  return { result };
};

export default regexCount;
