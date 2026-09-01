const regexMatch = async ({
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
  const matches = [...String(value).matchAll(re)].map((match) => match[0]);
  return { result: matches };
};

export default regexMatch;
