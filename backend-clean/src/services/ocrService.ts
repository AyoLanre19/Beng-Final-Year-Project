import Tesseract from "tesseract.js";

export type OcrResult = {
  extractedText: string;
  lines: string[];
};

const cleanOcrText = (text: string): string => {
  return text
    .replace(/\r/g, "")
    .replace(/\t/g, " ")
    .replace(/[ ]{2,}/g, " ")
    .trim();
};

const splitIntoLines = (text: string): string[] => {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
};

export const runOcrOnImage = async (
  filePath: string
): Promise<OcrResult> => {
  const result = await Tesseract.recognize(filePath, "eng", {
    logger: (info) => {
      if (info.status === "recognizing text") {
        console.log(
          `OCR progress: ${Math.round((info.progress || 0) * 100)}%`
        );
      }
    },
  });

  const extractedText = cleanOcrText(result.data.text || "");
  const lines = splitIntoLines(extractedText);

  return {
    extractedText,
    lines,
  };
};