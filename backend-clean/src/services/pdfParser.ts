import fs from "fs";
import { PDFParse } from "pdf-parse";

export type ParsedPdfResult = {
  extractedText: string;
  lines: string[];
};

const cleanPdfText = (text: string): string => {
  return text
    .replace(/\r/g, "\n")
    .replace(/\u0000/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};

const splitIntoLines = (text: string): string[] => {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
};

export const parsePdfFile = async (
  filePath: string
): Promise<ParsedPdfResult> => {
  const fileBuffer = fs.readFileSync(filePath);
  const parser = new PDFParse({
    data: new Uint8Array(fileBuffer),
  });
  const result = await parser.getText();
  const extractedText = cleanPdfText(result.text || "");

  await parser.destroy();

  return {
    extractedText,
    lines: splitIntoLines(extractedText),
  };
};
