export const shortenStatementDescription = (value: string): string => {
  const cleaned = value
    .replace(/\b\d{6,}\b/g, " ")
    .replace(/[_-]{2,}/g, " ")
    .replace(/[^\w\s/&]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned) {
    return value;
  }

  const words = cleaned.split(" ").filter(Boolean);

  return words.slice(0, 6).join(" ");
};
