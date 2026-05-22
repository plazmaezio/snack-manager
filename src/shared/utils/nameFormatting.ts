export const namePattern = "^[A-Za-z\\s]+$";

export const nameTitle = "Name containing only letters and spaces";

const connectionWords = new Set([
  "a",
  "an",
  "and",
  "as",
  "at",
  "by",
  "for",
  "from",
  "in",
  "of",
  "on",
  "or",
  "the",
  "to",
  "with",
]);

const wordMapping: Record<string, string> = {
  bbq: "BBQ",
  gmo: "GMO",
  msg: "MSG",
  non: "Non",
  organic: "Organic",
  vegan: "Vegan",
};

const toCapitalizedWord = (word: string) =>
  word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();

export const formatName = (value: string) => {
  const cleanValue = value.replace(/[^A-Za-z\s]/g, " ");

  const trimmedValue = cleanValue.trim().replace(/\s+/g, " ");

  if (trimmedValue.length === 0) {
    return "";
  }

  return trimmedValue
    .split(" ")
    .map((word, index) => {
      const normalizedWord = word.toLowerCase();

      if (wordMapping[normalizedWord]) {
        return wordMapping[normalizedWord];
      }

      if (index > 0 && connectionWords.has(normalizedWord)) {
        return normalizedWord;
      }

      return toCapitalizedWord(normalizedWord);
    })
    .join(" ");
};
