const normalizeUnicode = (str) => str.normalize("NFKC");

const sanitize = (value) => {
  if (typeof value === "string") {
    return normalizeUnicode(value)
      .replace(/[\u{10000}-\u{10FFFF}]/gu, "")
      .replace(/`/g, "")
      .replace(/[^\p{L}\p{N}\p{P}\p{Zs}\r\n\\]/gu, "");
  }
  if (Array.isArray(value)) return value.map(sanitize);
  if (typeof value === "object" && value !== null) {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, sanitize(v)]),
    );
  }
  return value;
};

const sanitizeValue = ({ value }) => {
  return { result: sanitize(value) };
};

export default sanitizeValue;
