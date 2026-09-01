const regexReplace = async ({
  regex,
  value,
  replacement,
  replaceAll,
  flagCaseInsensitive,
  flagMultiline,
  flagSingleLine,
  flagUnicode,
  flagSticky,
}) => {
  let flags = "";
  if (replaceAll) flags += "g";
  if (flagCaseInsensitive) flags += "i";
  if (flagMultiline) flags += "m";
  if (flagSingleLine) flags += "s";
  if (flagUnicode) flags += "u";
  if (flagSticky) flags += "y";

  const re = new RegExp(regex, flags);
  const result = String(value).replace(re, replacement ?? "");
  return { result };
};

export default regexReplace;
