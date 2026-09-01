const regexValidate = async ({
  regex,
  value,
  invalidMessage,
  flagCaseInsensitive,
  flagMultiline,
  flagSingleLine,
  flagUnicode,
  flagSticky,
}) => {
  let flags = "";
  if (flagCaseInsensitive) flags += "i";
  if (flagMultiline) flags += "m";
  if (flagSingleLine) flags += "s";
  if (flagUnicode) flags += "u";
  if (flagSticky) flags += "y";

  const re = new RegExp(regex, flags);
  const valid = re.test(String(value));
  const message = valid
    ? ""
    : invalidMessage || "Value does not match the required pattern.";

  return { valid, message };
};

export default regexValidate;
